# Twitube 🎥

Twitube is a full-stack social video platform that combines ideas from **YouTube** and **Twitter/X**.  
Users can browse videos, interact with content, post tweets, comment, like content, and manage their accounts.

## 🚀 Features

### Frontend
- Modern React UI
- Responsive video feed
- Video watch page
- Like interactions
- Comments
- Tweet/social feed
- User authentication UI
- Video upload interface
- Animated and modern UI components
- API integration with the backend

### Backend
- REST API built with Node.js and Express
- MongoDB database with Mongoose
- JWT-based authentication
- User registration and login
- Protected routes with authentication middleware
- Video management
- Tweet management
- Comments
- Likes/interactions
- Cloudinary integration for media uploads
- Secure password hashing with bcrypt

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cloudinary
- Multer

## 📁 Project Structure

```text
twitube/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   └── utils/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd twitube
```

### 2. Setup the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the required environment variables for your MongoDB, JWT, Cloudinary, CORS, and other backend configuration.

Start the backend:

```bash
npm run dev
```

### 3. Setup the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Create the frontend environment configuration required by the API client.

Start the frontend:

```bash
npm run dev
```

The frontend will normally be available at the local Vite development URL shown in your terminal.

## 🔐 Environment Variables

Do **not** commit `.env` files to GitHub.

The backend may require variables such as:

```env
MONGODB_URI=
CORS_ORIGIN=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Use the variable names required by your current backend configuration.

## 🔄 Development Workflow

Run the backend and frontend separately during development:

```text
Terminal 1
└── cd backend
    └── npm run dev

Terminal 2
└── cd frontend
    └── npm run dev
```

## 📌 Git Workflow

After making changes:

```bash
git status
git add .
git commit -m "Describe your changes"
git push origin master
```

## 🎯 Project Goal

The goal of Twitube is to build a complete full-stack application that combines:

**Video sharing + Social posts + User interaction**

into one platform while practicing real-world React, Node.js, Express, MongoDB, authentication, API integration, and cloud media storage.

## 👨‍💻 Author

**Kunal Sharma**

---

⭐ If you find this project useful, consider giving the repository a star!
