const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  sectionId: { type: mongoose.Schema.Types.ObjectId, ref: "Section", required: true },
  filename: { type: String, required: true },
  filepath: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("File", fileSchema);
