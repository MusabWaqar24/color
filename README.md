# ColorPlatee 🎨

A responsive web application where students can play quiz games and take CSS code writing exams to learn web development skills.

## Features

- **Authentication**: Email/password and Google OAuth login
- **Quiz System**: Color palette guessing games with multiple choice and drag-drop questions
- **CSS Code Writing Exams**: Integrated code editor with live preview and auto-checking
- **Levels**: Beginner, Intermediate, and Pro categories
- **Gamification**: Points system, badges, and leaderboards
- **Responsive Design**: Works on desktop and mobile devices
- **Dark/Light Mode**: Theme switching capability

## Tech Stack

- **Frontend**: Next.js + React + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB Atlas
- **Authentication**: JWT-based
- **Code Editor**: Monaco Editor (VSCode-like)

## Getting Started

1. Install dependencies:
```bash
npm run install-all
```

2. Set up environment variables:
- Create `.env` files in both `backend/` and `frontend/` directories
- Add your MongoDB connection string and JWT secret

3. Start the development servers:
```bash
npm run dev
```

4. Open your browser to `http://localhost:3000`

## Project Structure

```
colorplatee/
├── frontend/          # Next.js React application
├── backend/           # Express.js API server
├── package.json       # Root package.json with scripts
└── README.md         # This file
```

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/quiz/:level` - Get quiz questions by level
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/css-exams/:level` - Get CSS challenges by level
- `POST /api/css-exams/submit` - Submit CSS code solutions
- `GET /api/leaderboard` - Get user rankings

## Database Collections

- `users` - User profiles and progress
- `quizzes` - Quiz questions and answers
- `css_exams` - CSS coding challenges
- `submissions` - User submissions and results
