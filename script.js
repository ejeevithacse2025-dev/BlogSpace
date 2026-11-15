

const API_URL = "http://localhost:5000/api";

// Homepage elements
const blogContainer = document.getElementById("blogContainer");
const searchInput = document.getElementById("searchInput");

// Fetch published blogs from MongoDB through the backend
async function loadFeaturedBlogs() {
    if (!blogContainer) return;

    blogContainer.innerHTML = `
        <p class="loading-message">Loading stories...</p>
    `;

    try {
        const response = await fetch(`${API_URL}/blogs/all`);

        if (!response.ok) {
            throw new Error("Unable to fetch blogs");
        }

        const result = await response.json();

        const blogs = Array.isArray(result)
            ? result
            : result.blogs || result.data || [];

        if (blogs.length === 0) {
            blogContainer.innerHTML = `
                <p class="empty-message">
                    No published blogs yet. Be the first to share a story!
                </p>
            `;
            return;
        }

        displayBlogs(blogs);

    } catch (error) {
        console.error("Homepage blog loading error:", error);

        blogContainer.innerHTML = `
            <p class="error-message">
                Unable to load blogs. Please check your connection and try again.
            </p>
        `;
    }
}

// Display blog cards
function displayBlogs(blogs) {
    blogContainer.innerHTML = "";

    blogs.forEach(blog => {
        const card = document.createElement("article");
        card.className = "blog-card";

        const image = document.createElement("img");
        image.className = "blog-image";
        image.alt = blog.title || "Blog cover";

        if (blog.image) {
            image.src = blog.image;
        } else {
            image.src = "https://placehold.co/600x350/e9ddff/6940a8?text=BlogSpace";
        }

        const info = document.createElement("div");
        info.className = "blog-info";

        const category = document.createElement("span");
        category.className = "blog-category";
        category.textContent = blog.category || "General";

        const title = document.createElement("h3");
        title.textContent = blog.title || "Untitled Blog";

        const description = document.createElement("p");
        description.textContent = blog.description || "Discover this story on BlogSpace.";

        const footer = document.createElement("div");
        footer.className = "blog-footer";

        const author = document.createElement("div");
        author.className = "author";

        const authorName = document.createElement("strong");

        const name = typeof blog.author === "object"
            ? blog.author?.name
            : null;

        authorName.textContent = name || "BlogSpace Writer";

        author.appendChild(authorName);

        const readMore = document.createElement("a");
        readMore.className = "read-more";
        readMore.textContent = "Read More →";

        readMore.href = `blog-details.html?id=${encodeURIComponent(blog._id)}`;

        footer.appendChild(author);
        footer.appendChild(readMore);

        info.appendChild(category);
        info.appendChild(title);
        info.appendChild(description);
        info.appendChild(footer);

        card.appendChild(image);
        card.appendChild(info);

        blogContainer.appendChild(card);
    });
}

// Homepage search
if (searchInput) {
    searchInput.addEventListener("input", async function () {
        const query = this.value.trim().toLowerCase();

        try {
            const response = await fetch(`${API_URL}/blogs/all`);
            const result = await response.json();

            const blogs = Array.isArray(result)
                ? result
                : result.blogs || result.data || [];

            const filteredBlogs = blogs.filter(blog => {
                const title = (blog.title || "").toLowerCase();
                const description = (blog.description || "").toLowerCase();
                const category = (blog.category || "").toLowerCase();

                return title.includes(query) ||
                    description.includes(query) ||
                    category.includes(query);
            });

            displayBlogs(filteredBlogs);

        } catch (error) {
            console.error("Search error:", error);
        }
    });
}

// Write buttons require login
function openCreateBlog() {
    const token = localStorage.getItem("blogSpaceToken");

    if (!token) {
        window.location.href = "login.html";
        return;
    }

    window.location.href = "create-blog.html";
}

// Connect Write buttons
document.querySelectorAll(
    ".write-btn, .primary-btn"
).forEach(button => {
    button.addEventListener("click", function (event) {
        event.preventDefault();
        openCreateBlog();
    });
});

// Connect profile icon
const profileButton = document.querySelector(".profile");

if (profileButton) {
    profileButton.style.cursor = "pointer";

    profileButton.addEventListener("click", function () {
        const token = localStorage.getItem("blogSpaceToken");

        window.location.href = token
            ? "profile.html"
            : "login.html";
    });
}

// Load blogs when homepage opens

// Load latest community blogs
async function loadLatestBlogs() {
    const container = document.getElementById("latestBlogContainer");

    if (!container) return;

    try {
        const response = await fetch(`${API_URL}/blogs/all`);

        if (!response.ok) {
            throw new Error("Failed to load community blogs");
        }

        const result = await response.json();

        const blogs = Array.isArray(result)
            ? result
            : result.blogs || result.data || [];

        if (blogs.length === 0) {
            container.innerHTML = "<p>No community stories yet.</p>";
            return;
        }

        // Show the latest blog first
        const latestBlogs = [...blogs]
            .sort((a, b) =>
                new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
            )
            .slice(0, 3);

        container.innerHTML = "";

        latestBlogs.forEach(blog => {
            const card = document.createElement("div");
            card.className = "latest-card";

            const authorName =
                typeof blog.author === "object"
                    ? blog.author?.name
                    : null;

            const author = authorName || "BlogSpace Writer";

            const authorSection = document.createElement("div");
            authorSection.className = "latest-author";

            const avatar = document.createElement("div");
            avatar.className = "author-avatar";
            avatar.textContent = author.charAt(0).toUpperCase();

            const details = document.createElement("div");

            const title = document.createElement("h3");
            title.textContent = blog.title || "Untitled Blog";

            const description = document.createElement("p");
            description.textContent =
                `${author} · ${blog.category || "General"}`;

            details.appendChild(title);
            details.appendChild(description);

            authorSection.appendChild(avatar);
            authorSection.appendChild(details);

            card.appendChild(authorSection);

            if (blog.image) {
                const image = document.createElement("img");
                image.className = "latest-image";
                image.src = blog.image;
                image.alt = blog.title || "Blog image";
                card.appendChild(image);
            }

            const readMore = document.createElement("a");
            readMore.href =
                `blog-details.html?id=${encodeURIComponent(blog._id)}`;
            readMore.textContent = "Read More →";
            readMore.className = "read-more";

            card.appendChild(readMore);
            container.appendChild(card);
        });

    } catch (error) {
        console.error("Latest blogs error:", error);
        container.innerHTML =
            "<p>Unable to load community stories.</p>";
    }
}

// Load both homepage sections
document.addEventListener("DOMContentLoaded", () => {
    loadFeaturedBlogs();
    loadLatestBlogs();
});