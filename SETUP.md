# ColorPlatee Setup Guide 🎨

This guide will help you set up and run the ColorPlatee web application locally.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB instance)

## Quick Start

### 1. Install Dependencies

From the root directory, run:

```bash
npm run install-all
```

This will install dependencies for both frontend and backend.

### 2. Environment Setup

#### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
# Copy the example file
cp backend/env.example backend/.env
```

Edit `backend/.env` with your values:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/colorplatee

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

#### Frontend Environment Variables

Create a `.env.local` file in the `frontend/` directory:

```bash
# Copy the example file
cp frontend/env.example frontend/.env.local
```

Edit `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# App Configuration
NEXT_PUBLIC_APP_NAME=ColorPlatee
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Database Setup

#### Option A: MongoDB Atlas (Recommended)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get your connection string and update the `MONGODB_URI` in your backend `.env` file
4. Make sure to whitelist your IP address in the Atlas dashboard

#### Option B: Local MongoDB

If you have MongoDB installed locally, you can use:

```env
MONGODB_URI=mongodb://localhost:27017/colorplatee
```

### 4. Seed the Database

Populate your database with sample quiz questions and CSS challenges:

```bash
cd backend
npm run seed
```

This will create sample data including:
- Quiz questions for all levels
- CSS coding challenges
- User-friendly content to test the application

### 5. Start the Application

From the root directory, start both frontend and backend:

```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend application on `http://localhost:3000`

### 6. Access the Application

Open your browser and navigate to `http://localhost:3000`

## Features Overview

### 🎯 Quiz System
- Multiple choice questions about CSS
- Color palette guessing games
- Timer-based challenges
- Points and scoring system

### 💻 CSS Code Challenges
- Monaco Editor integration (VSCode-like experience)
- Live preview of your code
- Auto-validation of CSS requirements
- Hands-on coding practice

### 🏆 Gamification
- Points system for correct answers
- Badges and achievements
- Leaderboard rankings
- Progress tracking across levels

### 📱 Responsive Design
- Mobile-friendly interface
- Dark/light mode toggle
- Modern UI with Tailwind CSS

## Project Structure

```
colorplatee/
├── backend/                 # Express.js API server
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── data/              # Sample data
│   └── scripts/           # Database seeding
├── frontend/              # Next.js React application
│   ├── app/               # App router pages
│   ├── components/        # Reusable UI components
│   ├── contexts/          # React contexts
│   ├── lib/               # Utilities and API client
│   └── types/             # TypeScript type definitions
├── package.json           # Root package.json with scripts
└── README.md             # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Quizzes
- `GET /api/quiz/:level` - Get quiz questions by level
- `POST /api/quiz/submit` - Submit quiz answers
- `GET /api/quiz/history` - Get user's quiz history

### CSS Exams
- `GET /api/css-exams/:level` - Get CSS challenges by level
- `POST /api/css-exams/submit` - Submit CSS code solutions
- `GET /api/css-exams/history` - Get user's CSS exam history

### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard
- `GET /api/leaderboard/level/:level` - Get level-specific leaderboard
- `GET /api/leaderboard/stats` - Get leaderboard statistics

## Development Commands

### Backend Commands
```bash
cd backend
npm run dev          # Start development server
npm run start        # Start production server
npm run seed         # Seed database with sample data
npm test            # Run tests
```

### Frontend Commands
```bash
cd frontend
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

### Root Commands
```bash
npm run dev         # Start both frontend and backend
npm run build       # Build frontend
npm run start       # Start backend
npm run install-all # Install all dependencies
```

## Customization

### Adding New Quiz Questions

1. Edit `backend/data/sampleData.js`
2. Add new questions to the `sampleQuizzes` array
3. Run `npm run seed` to update the database

### Adding New CSS Challenges

1. Edit `backend/data/sampleData.js`
2. Add new challenges to the `sampleCSSExams` array
3. Run `npm run seed` to update the database

### Styling Customization

- Edit `frontend/tailwind.config.js` for theme colors
- Modify `frontend/app/globals.css` for global styles
- Update component styles in the `frontend/components/` directory

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check your `MONGODB_URI` in the backend `.env` file
   - Ensure your IP is whitelisted in MongoDB Atlas
   - Verify your MongoDB credentials

2. **Port Already in Use**
   - Change the `PORT` in your backend `.env` file
   - Kill any processes using ports 3000 or 5000

3. **Frontend Can't Connect to Backend**
   - Verify `NEXT_PUBLIC_API_URL` in frontend `.env.local`
   - Check that the backend server is running
   - Ensure CORS is properly configured

4. **Authentication Issues**
   - Check your `JWT_SECRET` in the backend `.env` file
   - Clear browser cookies and try again
   - Verify token expiration settings

### Getting Help

If you encounter any issues:

1. Check the console logs in both frontend and backend
2. Verify all environment variables are set correctly
3. Ensure all dependencies are installed
4. Check that MongoDB is accessible

## Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Use a process manager like PM2
3. Set up proper logging and monitoring
4. Use HTTPS in production

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or your preferred platform
3. Update `NEXT_PUBLIC_API_URL` to your production backend URL

### Database

- Use MongoDB Atlas for production
- Set up proper database backups
- Configure connection pooling for better performance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Happy coding! 🚀
