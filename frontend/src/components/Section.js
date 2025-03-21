// import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import "../styles/Section.css";

// function Section() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [files, setFiles] = useState(["Example.pdf", "Lab1.docx"]);
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileSelect = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleFileUpload = () => {
//     if (selectedFile) {
//       setFiles([...files, selectedFile.name]);
//       setSelectedFile(null);
//     } else {
//       alert("Please choose a file first.");
//     }
//   };

//   const deleteFile = (fileName) => {
//     setFiles(files.filter((file) => file !== fileName));
//   };

//   return (
//     <div className="section-container">
//       <button onClick={() => navigate("/")}>← Back</button>
//       <h2>{id} - Files</h2>

//       <div className="upload-container">
//         <input type="file" onChange={handleFileSelect} />
//         <button onClick={handleFileUpload} className="upload-btn">Upload File</button>
//       </div>

//       <ul className="file-list">
//         {files.map((file, index) => (
//           <li key={index} className="file-item">
//             <span>{file}</span>
//             <div>
//               <button className="view-btn">View</button>
//               <button className="download-btn">Download</button>
//               <button onClick={() => deleteFile(file)} className="delete-btn">Delete</button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Section;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Section.css";
import { FaPen, FaDownload, FaTrash } from "react-icons/fa";

const Section = ({ section, onBack }) => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingFileId, setEditingFileId] = useState(null);
  const [newFilename, setNewFilename] = useState("");

  // Load files from backend
  useEffect(() => {
    axios.get(`http://localhost:5000/api/files/${section._id}`)
      .then(response => setFiles(response.data))
      .catch(error => console.error("Error fetching files:", error));
  }, [section]);

  // Handle File Upload
  const handleUpload = () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("sectionId", section._id);

    axios.post("http://localhost:5000/api/files/upload", formData)
      .then(response => {
        setFiles([...files, response.data]);
        setSelectedFile(null);
      })
      .catch(error => console.error("Error uploading file:", error));
  };

  // Handle File Download
  const handleDownload = (file) => {
    window.open(`http://localhost:5000/${file.filepath}`, "_blank");
  };

  // Handle File Delete
  const handleDelete = (fileId) => {
    axios.delete(`http://localhost:5000/api/files/delete/${fileId}`)
      .then(() => {
        setFiles(prevFiles => prevFiles.filter(file => file._id !== fileId));
      })
      .catch(error => console.error("Error deleting file:", error));
  };

  // Handle Start Editing (Click on Edit Icon)
  const handleEditStart = (file) => {
    setEditingFileId(file._id);
  
    // Remove ID & extract filename without extension
    const cleanName = file.filename.split("-").slice(1).join("-").split(".").slice(0, -1).join(".");
    setNewFilename(cleanName);
  };
  // Handle Save Edit (Update Filename)
  const handleEditSave = (fileId) => {
    
    axios.put(`http://localhost:5000/api/files/update/${fileId}`, { filename: newFilename })
      .then(response => {
        setFiles(prevFiles =>
          prevFiles.map(file => (file._id === fileId ? response.data : file))
        );
        setEditingFileId(null);
        setNewFilename("");
      })
      .catch(error => console.error("Error updating filename:", error));
  };

  return (
    <div className="section-container">
      <button onClick={onBack}>⬅ Back</button>
      <h2>{section.name}</h2>

      <div className="upload-container">
        <input type="file" onChange={(e) => setSelectedFile(e.target.files[0])} />
        <button className="upload-btn" onClick={handleUpload}>Upload</button>
      </div>

      <ul className="file-list">
        {files.map(file => (
          <li key={file._id} className="file-item">
            {/* Show input field if editing, otherwise show filename */}
            {editingFileId === file._id ? (
              <input
                type="text"
                value={newFilename}
                onChange={(e) => setNewFilename(e.target.value)}
                onBlur={() => handleEditSave(file._id)}
                autoFocus
              />
            ) : (
              <span>
                {file.filename.includes("-") 
                  ? file.filename.split("-").slice(1).join("-")  // Removes ID prefix
                  : file.filename}
              </span>

            )}

            <div className="file-actions">
              <FaPen className="icon edit-icon" onClick={() => handleEditStart(file)} />
              <FaDownload className="icon download-icon" onClick={() => handleDownload(file)} />
              <FaTrash className="icon delete-icon" onClick={() => handleDelete(file._id)} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Section;
