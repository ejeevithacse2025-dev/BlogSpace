
const editBlogForm = document.getElementById("editBlogForm");
const statusMessage = document.getElementById("statusMessage");
const saveBtn = document.getElementById("saveBtn");

const blogId = new URLSearchParams(window.location.search).get("id");
const token = localStorage.getItem("blogSpaceToken");

const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const categoryInput = document.getElementById("category");
const contentInput = document.getElementById("content");
const tagsInput = document.getElementById("tags");
const visibilityInput = document.getElementById("visibility");

// Check login and blog ID
if (!token) {
    window.location.href = "login.html";
}

if (!blogId) {
    statusMessage.textContent = "Blog ID is missing.";
    saveBtn.disabled = true;
}

// Load the existing blog
async function loadBlog() {
    try {
        const response = await fetch(
            `http://localhost:5000/api/blogs/my-blogs`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load your blogs.");
        }

        const blog = (data.blogs || []).find(
            item => item._id === blogId
        );

        if (!blog) {
            throw new Error("Blog not found or you are not its author.");
        }

        titleInput.value = blog.title || "";
        descriptionInput.value = blog.description || "";
        categoryInput.value = blog.category || "";
        
        // The current editor uses a textarea, so strip HTML tags for editing.
        const temporaryElement = document.createElement("div");
        temporaryElement.innerHTML = blog.content || "";
        contentInput.value = temporaryElement.textContent || "";

        tagsInput.value = Array.isArray(blog.tags)
            ? blog.tags.join(", ")
            : "";

        visibilityInput.value = blog.visibility || "Public";

    } catch (error) {
        statusMessage.textContent = error.message;
        saveBtn.disabled = true;
    }
}

// Save updated blog
editBlogForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const category = categoryInput.value.trim();
    const content = contentInput.value.trim();

    if (!title || !description || !category || !content) {
        statusMessage.textContent = "Please fill in all required fields.";
        return;
    }

    const updatedBlog = {
        title,
        description,
        category,
        content,
        tags: tagsInput.value
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean),
        visibility: visibilityInput.value
    };

    saveBtn.disabled = true;
    statusMessage.textContent = "Saving your changes...";

    try {
        const response = await fetch(
            `http://localhost:5000/api/blogs/${encodeURIComponent(blogId)}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(updatedBlog)
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to update blog.");
        }

        statusMessage.textContent = "Blog updated successfully! 💜";

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1200);

    } catch (error) {
        statusMessage.textContent = error.message;
        saveBtn.disabled = false;
    }
});

// Load blog information when page opens
if (token && blogId) {
    loadBlog();
}
