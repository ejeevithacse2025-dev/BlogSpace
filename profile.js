
const token = localStorage.getItem("blogSpaceToken");
const userData = localStorage.getItem("blogSpaceUser");

// Redirect to login if the user is not logged in
if (!token || !userData) {
    window.location.href = "login.html";
} else {
    try {
        const user = JSON.parse(userData);

        const name = user.name || "BlogSpace User";
        const email = user.email || "Email not available";

        document.getElementById("profileName").textContent = name;
        document.getElementById("userName").textContent = name;
        document.getElementById("userEmail").textContent = email;

        // Display the first letter of the user's name
        document.getElementById("profileAvatar").textContent =
            name.charAt(0).toUpperCase();

    } catch (error) {
        console.error("Unable to load profile:", error);
        localStorage.removeItem("blogSpaceUser");
        localStorage.removeItem("blogSpaceToken");
        window.location.href = "login.html";
    }
}

// Logout functionality
document.getElementById("logoutButton").addEventListener("click", function () {
    localStorage.removeItem("blogSpaceToken");
    localStorage.removeItem("blogSpaceUser");

    alert("You have been logged out successfully!");
    window.location.href = "login.html";
});
