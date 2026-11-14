
const API_URL = "http://localhost:5000/api";

const token = localStorage.getItem("blogSpaceToken");
const user = JSON.parse(localStorage.getItem("blogSpaceUser") || "{}");

if (!token) {
    window.location.href = "login.html";
}

const profileName = document.getElementById("profileName");
const welcomeName = document.getElementById("welcomeName");
const profileAvatar = document.getElementById("profileAvatar");
const totalBlogs = document.getElementById("totalBlogs");
const totalViews = document.getElementById("totalViews");
const totalLikes = document.getElementById("totalLikes");
const myBlogList = document.getElementById("myBlogList");
const dashboardSearch = document.getElementById("dashboardSearch");
const logoutButton = document.getElementById("logoutButton");

let allBlogs = [];
let selectedCategory = "All";

const displayName = user.name || "Blogger";

if (profileName) profileName.textContent = displayName;
if (welcomeName) welcomeName.textContent = displayName;

if (profileAvatar) {
    profileAvatar.textContent = displayName.charAt(0).toUpperCase();
}

// Create category filter
const filterContainer = document.createElement("div");
filterContainer.className = "blog-filter-container";

filterContainer.innerHTML = `
    <label for="categoryFilter">Filter by category:</label>
    <select id="categoryFilter">
        <option value="All">All Categories</option>
    </select>
`;

if (myBlogList) {
    myBlogList.parentNode.insertBefore(filterContainer, myBlogList);
}

const categoryFilter = document.getElementById("categoryFilter");

// Load blogs
async function loadMyBlogs() {
    try {
        const response = await fetch(`${API_URL}/blogs/my-blogs`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to load blogs.");
        }

        allBlogs = data.blogs || [];

        if (totalBlogs) totalBlogs.textContent = allBlogs.length;
        if (totalViews) totalViews.textContent = "0";
        if (totalLikes) totalLikes.textContent = "0";

        populateCategories();
        applyFilters();

    } catch (error) {
        console.error("Dashboard error:", error);

        if (myBlogList) {
            myBlogList.textContent = error.message;
        }
    }
}

// Add available categories to dropdown
function populateCategories() {
    if (!categoryFilter) return;

    const categories = [
        ...new Set(
            allBlogs
                .map(blog => blog.category)
                .filter(Boolean)
        )
    ].sort();

    categoryFilter.innerHTML = `
        <option value="All">All Categories</option>
    `;

    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });

    categoryFilter.value = selectedCategory;
}

// Apply search and category filters
function applyFilters() {
    const searchText = dashboardSearch
        ? dashboardSearch.value.toLowerCase().trim()
        : "";

    const filteredBlogs = allBlogs.filter(blog => {
        const matchesSearch =
            (blog.title || "").toLowerCase().includes(searchText) ||
            (blog.description || "").toLowerCase().includes(searchText) ||
            (blog.category || "").toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "All" ||
            blog.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    displayBlogs(filteredBlogs);
}

// Display blog cards
function displayBlogs(blogs) {
    if (!myBlogList) return;

    myBlogList.innerHTML = "";

    if (blogs.length === 0) {
        myBlogList.innerHTML = `
            <div class="empty-state">
                <h3>No blogs found!</h3>
                <p>Try another search or category.</p>
            </div>
        `;
        return;
    }

    blogs.forEach(blog => {
        const card = document.createElement("div");
        card.className = "dashboard-blog-card";

        const image = blog.image ||
            "https://placehold.co/600x400/eee8ff/8b5cf6?text=BlogSpace";

        const date = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString()
            : "";

        const imageElement = document.createElement("img");
        imageElement.src = image;
        imageElement.alt = "Blog cover";
        imageElement.className = "dashboard-blog-image";

        const details = document.createElement("div");
        details.className = "dashboard-blog-content";

        const category = document.createElement("span");
        category.className = "dashboard-category";
        category.textContent = blog.category || "General";

        const title = document.createElement("h3");
        title.textContent = blog.title || "";

        const description = document.createElement("p");
        description.textContent = blog.description || "";

        const dateText = document.createElement("small");
        dateText.textContent = `${date} · ${blog.visibility || "Public"}`;

        const actions = document.createElement("div");
        actions.className = "dashboard-blog-actions";

        const editLink = document.createElement("a");
        editLink.href = `edit-blog.html?id=${encodeURIComponent(blog._id)}`;
        editLink.className = "edit-blog-btn";
        editLink.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-blog-btn";
        deleteButton.dataset.id = blog._id;
        deleteButton.textContent = "Delete";

        const viewLink = document.createElement("a");
        viewLink.href = `blog-details.html?id=${encodeURIComponent(blog._id)}`;
        viewLink.className = "view-blog-btn";
        viewLink.textContent = "View";

        actions.append(editLink, deleteButton, viewLink);
        details.append(category, title, description, dateText, actions);
        card.append(imageElement, details);

        myBlogList.appendChild(card);
    });
}

// Category filter
if (categoryFilter) {
    categoryFilter.addEventListener("change", event => {
        selectedCategory = event.target.value;
        applyFilters();
    });
}

// Search
if (dashboardSearch) {
    dashboardSearch.addEventListener("input", applyFilters);
}

// Delete blog
async function deleteBlog(blogId) {
    if (!confirm("Are you sure you want to delete this blog?")) {
        return;
    }

    try {
        const response = await fetch(
            `${API_URL}/blogs/${encodeURIComponent(blogId)}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Unable to delete blog.");
        }

        alert("Blog deleted successfully! 💜");
        await loadMyBlogs();

    } catch (error) {
        alert(error.message);
    }
}

// Handle Delete clicks
if (myBlogList) {
    myBlogList.addEventListener("click", event => {
        const button = event.target.closest(".delete-blog-btn");

        if (button) {
            deleteBlog(button.dataset.id);
        }
    });
}

// Notifications
const notifications = document.getElementById("notifications");

if (notifications) {
    notifications.addEventListener("click", () => {
        alert("You're all caught up! 💜");
    });
}

// Settings
const settingsButton = document.getElementById("settingsButton");

if (settingsButton) {
    settingsButton.addEventListener("click", event => {
        event.preventDefault();
        alert("Profile settings will be available in a future update.");
    });
}

// Logout
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem("blogSpaceToken");
            localStorage.removeItem("blogSpaceUser");
            window.location.href = "login.html";
        }
    });
}

// Start dashboard
loadMyBlogs();
