
const express = require("express");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog");

const router = express.Router();

// VERIFY LOGIN TOKEN
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Please log in to continue."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
}

// CREATE BLOG API
router.post("/create", verifyToken, async (req, res) => {
    try {
        const {
            title,
            description,
            content,
            category,
            tags,
            image,
            visibility
        } = req.body;

        if (!title || !description || !content || !category) {
            return res.status(400).json({
                message: "Please provide all required blog details."
            });
        }

        const newBlog = new Blog({
            title,
            description,
            content,
            category,
            tags: tags || [],
            image: image || "",
            visibility: visibility || "Public",
            author: req.userId
        });

        await newBlog.save();

        res.status(201).json({
            message: "Blog published successfully!",
            blog: newBlog
        });

    } catch (error) {
        console.error("Create blog error:", error.message);

        res.status(500).json({
            message: "Server error while creating blog."
        });
    }
});

// GET MY BLOGS API
router.get("/my-blogs", verifyToken, async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Blogs fetched successfully!",
            blogs
        });

    } catch (error) {
        console.error("Fetch blogs error:", error.message);

        res.status(500).json({
            message: "Server error while fetching blogs."
        });
    }
});

module.exports = router;
