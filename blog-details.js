
const loading = document.getElementById("loading");
const article = document.getElementById("article");
const errorMessage = document.getElementById("errorMessage");

const blogTitle = document.getElementById("blogTitle");
const blogCategory = document.getElementById("blogCategory");
const blogAuthor = document.getElementById("blogAuthor");
const blogDate = document.getElementById("blogDate");
const blogImage = document.getElementById("blogImage");
const blogContent = document.getElementById("blogContent");
const blogTags = document.getElementById("blogTags");

// Get the blog ID from the URL
const params = new URLSearchParams(window.location.search);
const blogId = params.get("id");

// Safely display formatted blog content
function sanitizeBlogContent(html) {
    const parsed = new DOMParser().parseFromString(html || "", "text/html");

    const allowedTags = [
        "P", "BR", "STRONG", "B", "EM", "I", "U",
        "H1", "H2", "H3", "H4", "H5", "H6",
        "UL", "OL", "LI", "BLOCKQUOTE", "A", "IMG"
    ];

    function cleanNode(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            return document.createTextNode(node.textContent);
        }

        if (node.nodeType !== Node.ELEMENT_NODE) {
            return document.createDocumentFragment();
        }

        if (!allowedTags.includes(node.tagName)) {
            const fragment = document.createDocumentFragment();

            [...node.childNodes].forEach(child => {
                fragment.appendChild(cleanNode(child));
            });

            return fragment;
        }

        const cleanElement = document.createElement(
            node.tagName.toLowerCase()
        );

        if (node.tagName === "A") {
            const href = node.getAttribute("href");

            try {
                const url = new URL(href, window.location.origin);

                if (["http:", "https:", "mailto:"].includes(url.protocol)) {
                    cleanElement.setAttribute("href", url.href);
                    cleanElement.setAttribute("rel", "noopener noreferrer");
                    cleanElement.setAttribute("target", "_blank");
                }
            } catch (error) {
                // Ignore invalid links
            }
        }

        if (node.tagName === "IMG") {
            const src = node.getAttribute("src") || "";

            if (
                src.startsWith("https://") ||
                src.startsWith("http://") ||
                /^data:image\/(png|jpeg|jpg|gif|webp);base64,/i.test(src)
            ) {
                cleanElement.setAttribute("src", src);
                cleanElement.setAttribute("alt", "Blog image");
            } else {
                return document.createDocumentFragment();
            }
        }

        [...node.childNodes].forEach(child => {
            cleanElement.appendChild(cleanNode(child));
        });

        return cleanElement;
    }

    const result = document.createDocumentFragment();

    [...parsed.body.childNodes].forEach(node => {
        result.appendChild(cleanNode(node));
    });

    return result;
}

// Fetch individual blog details
async function loadBlogDetails() {
    if (!blogId) {
        showError();
        return;
    }

    try {
        const response = await fetch(
            `http://localhost:5000/api/blogs/${encodeURIComponent(blogId)}`
        );

        const data = await response.json();

        if (!response.ok || !data.blog) {
            throw new Error(data.message || "Blog not found");
        }

        const blog = data.blog;

        // Display blog information
        blogTitle.textContent = blog.title || "Untitled Blog";
        blogCategory.textContent = blog.category || "General";

        blogAuthor.textContent =
            "By " + (blog.author?.name || "Unknown Author");

        blogDate.textContent = blog.createdAt
            ? new Date(blog.createdAt).toLocaleDateString()
            : "";

        // Display cover image
        if (blog.image) {
            blogImage.src = blog.image;
        } else {
            blogImage.hidden = true;
        }

        blogImage.onerror = () => {
            blogImage.hidden = true;
        };

        // Display formatted article content safely
        blogContent.replaceChildren(
            sanitizeBlogContent(blog.content)
        );

        // Display tags
        blogTags.innerHTML = "";

        if (Array.isArray(blog.tags)) {
            blog.tags.forEach(tag => {
                const tagElement = document.createElement("span");
                tagElement.className = "tag";
                tagElement.textContent = "#" + tag;
                blogTags.appendChild(tagElement);
            });
        }

        // Update browser tab title
        document.title = `${blog.title} | BlogSpace`;

        loading.hidden = true;
        article.hidden = false;

    } catch (error) {
        console.error("Error loading blog:", error);
        showError();
    }
}

function showError() {
    loading.hidden = true;
    article.hidden = true;
    errorMessage.hidden = false;
}

// Start loading the blog
loadBlogDetails();
