const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { sectionId } = req.body;
    const file = new File({
      sectionId,
      filename: req.file.filename,
      filepath: req.file.path,
    });

    await file.save();
    res.status(201).json(file);
  } catch (error) {
        console.error("File upload error:", error);
    res.status(500).json({ message: "File upload failed" });
  }
});

// Get all files for a section
router.get("/:sectionId", async (req, res) => {
  try {
    const files = await File.find({ sectionId: req.params.sectionId });
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ message: "Error fetching files" });
  }
});

// DELETE a file by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const fileId = req.params.id;
    console.log("Deleting file with ID:", fileId); // Debugging

    const deletedFile = await File.findByIdAndDelete(fileId);
    if (!deletedFile) {
      return res.status(404).json({ message: "File not found" });
    }
    // Delete file from storage
    fs.unlink(path.resolve(deletedFile.filepath), (err) => {
        if (err) {
          console.error("Error deleting file from storage:", err);
        }
      });
      
    res.json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Update filename by ID


router.put("/update/:id", async (req, res) => {
  try {
    const { filename } = req.body;
    const file = await File.findById(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const oldFilePath = file.filepath;
    const fileExtension = path.extname(oldFilePath); // Get the original file extension
    const newFilePath = path.join("uploads", filename + fileExtension); // New path with updated name

    // Rename file in filesystem
    fs.rename(oldFilePath, newFilePath, async (err) => {
      if (err) {
        console.error("Error renaming file:", err);
        return res.status(500).json({ message: "Error renaming file on server" });
      }

      // Update database with new filename and filepath
      file.filename = filename + fileExtension;
      file.filepath = newFilePath;
      await file.save();

      res.json(file);
    });
  } catch (error) {
    console.error("Error updating file:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

  
module.exports = router;
