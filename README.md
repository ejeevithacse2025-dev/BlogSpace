# ✒ BlogSpace

A responsive full-stack blogging platform where users can create, publish, edit, explore, and manage blog posts.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Password hashing using bcrypt
- Protected private API routes
- Personalized user dashboard
- Create, view, edit, and delete blogs
- View all publicly published blogs
- User profile page
- Logout functionality
- User-specific blog management

## 🛠️ Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## 📁 Project Structure

```text
BlogSpace/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── dashboard.css
├── dashboard.js
├── blogs.html
├── blog-details.html
├── create-blog.html
├── edit-blog.html
├── profile.html
├── profile.css
├── profile.js
└── README.md
```

## ⚙️ How to Run the Project

1. Clone or download the repository.
2. Open the project in VS Code.
3. Navigate to the backend folder.
4. Install dependencies:

```bash
npm install
```

5. Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

6. Start the backend:

```bash
npm run dev
```

7. Open `index.html` using VS Code Live Server.

## 🔐 Authentication & Security

- JWT authentication for login sessions.
- Passwords hashed using bcrypt.
- Protected routes verify authentication tokens.
- Expired tokens are rejected.
- Users can access only their own dashboard blogs.

## 👩‍💻 Project Status

Core backend APIs, authentication, dashboard, blog management, and user profile functionality have been implemented and tested.

## 📌 Developer

E. Jeevitha

