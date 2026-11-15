
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Registration and authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

// Home route
app.get("/", (req, res) => {
    res.json({
        message: "Welcome to BlogSpace Backend API!",
        status: "Server is running successfully"
    });
});

// Start server after MongoDB connects
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(`BlogSpace server running at http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
