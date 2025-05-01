# Todo Application

A fullstack Todo application built with React, TypeScript, Node.js, and MySQL.

## Demo
- Frontend: [https://apptodoreactnet.netlify.app/](https://apptodoreactnet.netlify.app/)

## Features

- User Authentication (Register, Login, Logout)
- Task Management (Create, Read, Update, Delete)
- Task Status Management
- Protected Routes
- Modern UI with Tailwind CSS
- CI/CD with GitHub Actions
- Automated Deployment to Vercel (Frontend) and Railway (Backend)

## Tech Stack

### Frontend
- React
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Vite

### Backend
- Node.js
- Express
- TypeScript
- Prisma
- MySQL
- JWT Authentication

## CI/CD Setup

### Frontend (Netlify)
- Automated testing and building
- Deployment to Netflify
- Environment variables managed in Netlify

### Backend (Railway)
- Automated testing and building
- Deployment to Railway
- Database and environment variables managed in Railway

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd todo-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
DATABASE_URL="mysql://user:password@localhost:3306/todo_db"
JWT_SECRET="your-secret-key"
PORT=5000
```

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd todo-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
todo/
├── todo-backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── generated/
│   │   ├── prisma.ts
│   │   └── index.ts
│   ├── prisma/
│   └── package.json
└── todo-frontend/
    ├── src/
    │   ├── components/
    │   ├── services/
    │   ├── theme.ts
    │   ├── App.tsx
    │   └── main.tsx
    └── package.json
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user
- POST /api/auth/logout - Logout user

### Tasks
- GET /api/tasks - Get all tasks for authenticated user
- POST /api/tasks - Create a new task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task
- PATCH /api/tasks/:id/status - Update task status

## License

MIT 