
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100
        },

        description: {
            type: String,
            required: true,
            maxlength: 300
        },

        content: {
            type: String,
            required: true
        },

        category: {
            type: String,
            required: true
        },

        tags: {
            type: [String],
            default: []
        },

        image: {
            type: String,
            default: ""
        },

        visibility: {
            type: String,
            enum: ["Public", "Private"],
            default: "Public"
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
