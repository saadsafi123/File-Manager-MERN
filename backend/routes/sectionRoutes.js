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

module.exports = router;
