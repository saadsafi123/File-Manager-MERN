const express = require("express");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const sectionRoutes = require("./routes/sectionRoutes");
const fileRoutes = require("./routes/fileRoutes");
require("dotenv").config();

const app = express();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Connect Database
connectDB();

app.get("/", (req, res) => {
    res.send("Backend is working!");
});

// Routes
app.use("/api/sections", sectionRoutes);
app.use("/api/files", fileRoutes);



// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🔥 Server running on port ${PORT}`));
