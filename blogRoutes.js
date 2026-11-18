
const express = require("express");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog");

const router = express.Router();

// AUTHENTICATION MIDDLEWARE
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Please login first."
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.id || decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

// CREATE BLOG
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
                message: "Please fill in all required fields."
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
        res.status(500).json({
            message: "Failed to create blog.",
            error: error.message
        });
    }
});

// GET ALL PUBLIC BLOGS
router.get("/all", async (req, res) => {
    try {
        const blogs = await Blog.find({ visibility: "Public" })
            .populate("author", "name")
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "All public blogs fetched successfully!",
            blogs
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch blogs.",
            error: error.message
        });
    }
});

// GET MY BLOGS
router.get("/my-blogs", verifyToken, async (req, res) => {
    try {
        const blogs = await Blog.find({
            author: req.userId
        }).sort({ createdAt: -1 });

        res.status(200).json({
            message: "Your blogs fetched successfully!",
            blogs
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch your blogs.",
            error: error.message
        });
    }
});

// UPDATE MY BLOG
router.put("/:id", verifyToken, async (req, res) => {
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
                message: "Please fill in all required fields."
            });
        }

        if (
            visibility !== undefined &&
            !["Public", "Private"].includes(visibility)
        ) {
            return res.status(400).json({
                message: "Invalid blog visibility."
            });
        }

        const updatedBlog = await Blog.findOneAndUpdate(
            {
                _id: req.params.id,
                author: req.userId
            },
            {
                title,
                description,
                content,
                category,
                tags: tags || [],
                image: image || "",
                visibility: visibility || "Public"
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedBlog) {
            return res.status(404).json({
                message: "Blog not found or you are not authorized to edit it."
            });
        }

        res.status(200).json({
            message: "Blog updated successfully!",
            blog: updatedBlog
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update blog.",
            error: error.message
        });
    }
});

// DELETE MY BLOG
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const deletedBlog = await Blog.findOneAndDelete({
            _id: req.params.id,
            author: req.userId
        });

        if (!deletedBlog) {
            return res.status(404).json({
                message: "Blog not found or you are not authorized to delete it."
            });
        }

        res.status(200).json({
            message: "Blog deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete blog.",
            error: error.message
        });
    }
});

// GET INDIVIDUAL PUBLIC BLOG
// Keep this route LAST because it uses a dynamic ID.
router.get("/:id", async (req, res) => {
    try {
        const blog = await Blog.findOne({
            _id: req.params.id,
            visibility: "Public"
        }).populate("author", "name");

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found."
            });
        }

        res.status(200).json({
            message: "Blog details fetched successfully!",
            blog
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch blog details.",
            error: error.message
        });
    }
});

module.exports = router;
