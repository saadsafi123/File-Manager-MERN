const mongoose = require("mongoose");

const sectionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  files: [{ type: mongoose.Schema.Types.ObjectId, ref: "File" }],
});

module.exports = mongoose.model("Section", sectionSchema);
