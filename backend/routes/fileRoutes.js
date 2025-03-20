const express = require("express");
const multer = require("multer");
const File = require("../models/File");
const router = express.Router();

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload a file
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { sectionId } = req.body;
    const file = new File({
      sectionId,
      filename: req.file.originalname,
      filepath: req.file.path,
    });

    await file.save();
    res.status(201).json(file);
  } catch (error) {
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

module.exports = router;
