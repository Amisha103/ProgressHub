# ProgressHub 🚀

**ProgressHub** is a productivity and habit-tracking application designed to help users build consistent routines, manage daily tasks, and track their personal progress.

The application provides a centralized space to organize habits, manage daily activities, and stay focused on personal goals.

## 🌐 Live Demo

- **Frontend:** https://progresshub-frontend-one.vercel.app
- **Backend API:** https://progresshub-7b5q.onrender.com

## ✨ Features

- **User Authentication:** Secure user registration and login.
- **JWT Authentication:** Token-based authentication with refresh sessions.
- **Habit Management:** Create and manage personal habits.
- **Category Management:** Organize habits using categories.
- **Daily Task Tracking:** View and manage daily tasks.
- **Progress Tracking:** Keep track of daily task completion and consistency.

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- Tailwind CSS
- JavaScript

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Data JPA
- JWT Authentication
- Maven

### Database
- PostgreSQL
- Neon Database
- Flyway Database Migrations

### Deployment
- Vercel – Frontend hosting
- Render – Backend hosting
- Neon – Database hosting

## 📁 Project Structure

```text
ProgressHub/
│
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   ├── components/
│   │   ├── pages/
│   │   └── ...
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   └── Dockerfile
│
└── README.md
```

## ⚙️ Getting Started

Follow these instructions to run ProgressHub locally.

### Prerequisites

Make sure you have installed:

- Node.js and npm
- Java 21
- PostgreSQL
- Git

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd ProgressHub
```

### 2. Set Up the Frontend

Navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

### 3. Set Up the Backend

Open another terminal and navigate to the backend directory:

```bash
cd backend
```

Configure the following environment variables:

| Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | PostgreSQL database username |
| `DB_PASSWORD` | PostgreSQL database password |
| `JWT_SECRET` | Secret key used for JWT signing |

The backend uses Flyway to manage database migrations.

Build and run the backend:

**Windows:**

```bash
.\mvnw.cmd spring-boot:run
```

**macOS / Linux:**

```bash
./mvnw spring-boot:run
```

The backend will run on:

```text
http://localhost:8080
```

## 🔐 Environment Variables

Never commit passwords, database credentials, JWT secrets, or other sensitive environment variables to GitHub.

For production deployment, configure environment variables through the hosting platforms:

- Vercel – Frontend environment variables
- Render – Backend environment variables
- Neon – PostgreSQL database credentials

## 🚀 Deployment

ProgressHub is deployed using:

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |

## 🎯 Project Goal

The goal of ProgressHub is to make personal productivity more structured by helping users develop habits, manage daily responsibilities, and monitor their progress over time.

## 👩‍💻 Author

Developed as a full-stack web application project.

---

**ProgressHub – Build habits. Track progress. Keep growing.**
