export interface User {
  id: string
  name: string
  email: string
  level: 'Beginner' | 'Intermediate' | 'Pro'
  totalScore: number
  badges: string[]
  achievements: {
    quizzesCompleted: number
    cssExamsCompleted: number
    perfectScores: number
    streak: number
    lastActivityDate: string
  }
  progress: {
    beginner: LevelProgress
    intermediate: LevelProgress
    pro: LevelProgress
  }
  avatar?: string
  createdAt: string
}

export interface LevelProgress {
  quizzesCompleted: number
  cssExamsCompleted: number
  averageScore: number
}

export interface QuizQuestion {
  id: string
  question: string
  type: 'color-guess' | 'multiple-choice' | 'drag-drop' | 'hex-to-rgb' | 'rgb-to-hex'
  level: 'Beginner' | 'Intermediate' | 'Pro'
  category: 'colors' | 'css-basics' | 'layout' | 'animations' | 'responsive'
  colorData?: {
    hex: string
    rgb: { r: number; g: number; b: number }
    hsl: { h: number; s: number; l: number }
    colorName: string
  }
  options?: Array<{
    text: string
    value: string
  }>
  points: number
  timeLimit: number
  difficulty: 'Easy' | 'Medium' | 'Hard'
  tags: string[]
}

export interface QuizAnswer {
  questionId: string
  answer: string | object
  timeSpent?: number
}

export interface QuizResult {
  score: number
  totalQuestions: number
  correctAnswers: number
  percentage: number
  timeSpent: number
  level: string
  answers: Array<{
    questionId: string
    answer: string | object
    isCorrect: boolean
    timeSpent: number
  }>
  badges: string[]
}

export interface CSSExam {
  id: string
  title: string
  description: string
  level: 'Beginner' | 'Intermediate' | 'Pro'
  category: 'layout' | 'styling' | 'animations' | 'responsive' | 'advanced'
  requirements: Array<{
    type: 'selector' | 'property' | 'value' | 'effect' | 'layout'
    description: string
    selector?: string
    property?: string
    expectedValue?: string
    points: number
  }>
  starterCode: {
    html: string
    css: string
  }
  hints: string[]
  difficulty: 'Easy' | 'Medium' | 'Hard'
  timeLimit: number
  points: number
  tags: string[]
}

export interface CSSExamCode {
  html: string
  css: string
  javascript?: string
}

export interface CSSExamResult {
  score: number
  totalRequirements: number
  passedRequirements: number
  percentage: number
  timeSpent: number
  level: string
  requirements: Array<{
    requirement: string
    passed: boolean
    message: string
    points: number
  }>
  badges: string[]
  feedback: string
}

export interface Submission {
  id: string
  type: 'quiz' | 'css-exam'
  score: number
  totalQuestions?: number
  totalRequirements?: number
  correctAnswers?: number
  passedRequirements?: number
  percentage: number
  timeSpent: number
  submittedAt: string
  quiz?: {
    id: string
    question: string
    type: string
    level: string
  }
  exam?: {
    id: string
    title: string
    level: string
    category: string
  }
}

export interface LeaderboardUser {
  userId: string
  name: string
  email: string
  level: string
  avatar?: string
  totalScore: number
  submissionsCount: number
  averageScore: number
  lastSubmission: string
  badges: string[]
  rank: number
}

export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  earned: boolean
  progress: number
  maxProgress: number
  percentage: number
}

export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
}

export interface QuizSession {
  questions: QuizQuestion[]
  currentQuestionIndex: number
  answers: QuizAnswer[]
  startTime: number
  timeSpent: number
  isCompleted: boolean
}

export interface CSSExamSession {
  exam: CSSExam
  code: CSSExamCode
  startTime: number
  timeSpent: number
  isCompleted: boolean
}

export interface Theme {
  name: string
  label: string
  value: 'light' | 'dark' | 'system'
}

export interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  current?: boolean
}

export interface LevelCard {
  level: 'Beginner' | 'Intermediate' | 'Pro'
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  stats: {
    quizzes: number
    cssExams: number
    totalPoints: number
  }
  progress: LevelProgress
  isUnlocked: boolean
}

export interface QuizCategory {
  name: string
  value: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  questionCount: number
}

export interface DashboardStats {
  totalScore: number
  totalSubmissions: number
  quizzesCompleted: number
  cssExamsCompleted: number
  currentStreak: number
  level: string
  rank: number | null
}
