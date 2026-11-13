
const blogContainer = document.getElementById("blogContainer");
const blogCount = document.getElementById("blogCount");
const emptyMessage = document.getElementById("emptyMessage");

async function loadAllBlogs() {
    try {
        const response = await fetch("http://localhost:5000/api/blogs/all");
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load blogs");
        }

        const blogs = data.blogs || [];

        blogContainer.innerHTML = "";
        blogCount.textContent = `${blogs.length} blogs published`;

        if (blogs.length === 0) {
            emptyMessage.hidden = false;
            return;
        }

        emptyMessage.hidden = true;

        blogs.forEach(blog => {
            const card = document.createElement("article");
            card.className = "blog-card";

            const image = blog.image ||
                "https://placehold.co/600x400/eee8ff/8b5cf6?text=BlogSpace";

            const author = blog.author?.name || "Unknown Author";

            const date = blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString()
                : "";

            card.innerHTML = `
                <img
                    src="${image}"
                    alt="Blog cover"
                    class="blog-image"
                >

                <div class="blog-card-content">
                    <span class="category">
                        ${escapeHTML(blog.category)}
                    </span>

                    <h3>${escapeHTML(blog.title)}</h3>

                    <p class="blog-description">
                        ${escapeHTML(blog.description)}
                    </p>

                    <p class="blog-meta">
                        By ${escapeHTML(author)} · ${date}
                    </p>

                    <a href="blog-details.html?id=${encodeURIComponent(blog._id)}"
                       class="read-more">
                        Read More →
                    </a>
                </div>
            `;

            blogContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading blogs:", error);

        blogContainer.innerHTML =
            "<p>Unable to load blogs. Please try again later.</p>";

        blogCount.textContent = "Loading failed";
    }
}

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

loadAllBlogs();
