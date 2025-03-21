const express = require("express");
const Section = require("../models/Section");
const router = express.Router();

// Create a new section
router.post("/add", async (req, res) => {
  try {
    const { name } = req.body;
    const newSection = new Section({ name });
    await newSection.save();
    res.status(201).json(newSection);
  } catch (error) {
    res.status(500).json({ message: "Error creating section" });
  }
});

// Get all sections
router.get("/", async (req, res) => {
  try {
    const sections = await Section.find();
    res.status(200).json(sections);
  } catch (error) {
    res.status(500).json({ message: "Error fetching sections" });
  }
});


// DELETE a section by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const sectionId = req.params.id;
    console.log("Deleting section with ID:", sectionId);

    const deletedSection = await Section.findByIdAndDelete(sectionId);
    if (!deletedSection) {
      return res.status(404).json({ message: "Section not found" });
    }

    res.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
