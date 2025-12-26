description was re-written by chatgpt
# StudySync

StudySync is a web application designed to help students manage their studies more effectively.  
It combines task management, productivity tools, study sessions, and basic AI assistance in one platform.

The project was built as part of a Web Development course and focuses on practical full-stack concepts.


## Features

### User & Authentication
- User registration and login
- JWT-based authentication
- Role-based access control (User / Admin)

### Tasks
- Create, view, update, and delete tasks
- Task attributes:
  - title
  - subject
  - type (task, exam, project, etc.)
  - priority
  - due date
- Tasks are user-specific

### Pomodoro Timer
- Customizable Pomodoro timer
- Configurable focus time, short break, and long break
- Designed to support study productivity

### Study Sessions
- Create and join study sessions
- Sessions prepared for future collaboration features

### AI Helper
- Rule-based AI assistant
- Provides study tips and basic text assistance
- Implemented without external APIs for reliability and cost reasons

### Admin Dashboard
- Admin-only access
- View all users
- Delete users when necessary


## Tech Stack

### Frontend
- Vue 3
- Vite
- Vue Router
- Axios

### Backend
- Node.js
- Express
- Prisma ORM
- MySQL database

### Authentication & Security
- JSON Web Tokens (JWT)
- Password hashing with bcrypt
