# BlogSpace ✨

**Write · Read · Share · Connect**

BlogSpace is a full-stack blogging platform where users can create, publish, explore, and manage blog posts. It provides a simple and user-friendly space for writers to share their thoughts and readers to discover new ideas.

## 🚀 Features

- User registration and login
- JWT-based authentication
- Protected dashboard
- Personal user profile
- Create, edit, and delete blog posts
- Explore and view published blogs
- View individual blog details
- Display blogs belonging to the logged-in user
- Logout functionality
- Responsive user interface

## 🛠️ Technologies Used

**Frontend**
- HTML5
- CSS3
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MongoDB Atlas
- Mongoose

**Authentication**
- JSON Web Tokens (JWT)
- bcryptjs

## 📁 Project Structure

```text
BlogSpace/
│
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Blog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── blogRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── index.html
├── login.html
├── register.html
├── dashboard.html
├── dashboard.css
├── dashboard.js
├── profile.html
├── profile.css
├── profile.js
├── blogs.html
├── blogs.css
├── blogs.js
├── blog-details.html
├── blog-details.css
├── blog-details.js
├── create-blog.html
├── edit-blog.html
├── edit-blog.css
├── edit-blog.js
├── auth.css
├── style.css
├── script.js
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/ejjeevithacse2025-dev/BlogSpace.git
```

### 2. Open the project

```bash
cd BlogSpace
```

### 3. Install backend dependencies

```bash
cd backend
npm install
```

### 4. Configure environment variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the placeholder values with your own credentials. Never upload your `.env` file to GitHub.

### 5. Start the backend server

```bash
npm run dev
```

The backend runs at:

`http://localhost:5000`

### 6. Open the frontend

Open `index.html` using VS Code Live Server.

## 🔐 Authentication

BlogSpace uses JSON Web Tokens (JWT) to authenticate users. Passwords are hashed using bcryptjs before being stored in MongoDB.

Protected API routes verify the token before allowing users to access their personal blogs or perform account-specific operations.

## 👩‍💻 Developed By

**E. Jeevitha**

Computer Science Engineering Student

GitHub: [ejjeevithacse2025-dev](https://github.com/ejjeevithacse2025-dev)

---

*BlogSpace: Every story deserves a place to be shared.* 💜
