import axios, { AxiosResponse } from 'axios'
import Cookies from 'js-cookie'
import { ApiResponse } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, clear cookies and redirect to login
      Cookies.remove('token')
      Cookies.remove('user')
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authApi = {
  register: async (data: { name: string; email: string; password: string }) => {
    const response = await api.post<ApiResponse>('/auth/register', data)
    return response.data
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post<ApiResponse>('/auth/login', data)
    return response.data
  },

  getProfile: async () => {
    const response = await api.get<ApiResponse>('/auth/me')
    return response.data
  },

  updateProfile: async (data: { name?: string; avatar?: string }) => {
    const response = await api.put<ApiResponse>('/auth/profile', data)
    return response.data
  },
}

// Quiz API
export const quizApi = {
  getQuestions: async (level: string, category?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<ApiResponse>(`/quiz/${level}?${params}`)
    return response.data
  },

  submitAnswers: async (data: {
    answers: Array<{ questionId: string; answer: any; timeSpent?: number }>
    timeSpent: number
    quizId?: string
  }) => {
    const response = await api.post<ApiResponse>('/quiz/submit', data)
    return response.data
  },

  getCategories: async (level: string) => {
    const response = await api.get<ApiResponse>(`/quiz/categories/${level}`)
    return response.data
  },

  getHistory: async (limit?: number, page?: number) => {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (page) params.append('page', page.toString())
    
    const response = await api.get<ApiResponse>(`/quiz/history?${params}`)
    return response.data
  },
}

// CSS Exam API
export const cssExamApi = {
  getExams: async (level: string, category?: string) => {
    const params = new URLSearchParams()
    if (category) params.append('category', category)
    
    const response = await api.get<ApiResponse>(`/css-exams/${level}?${params}`)
    return response.data
  },

  getExam: async (level: string, id: string) => {
    const response = await api.get<ApiResponse>(`/css-exams/${level}/${id}`)
    return response.data
  },

  submitCode: async (data: {
    examId: string
    code: { html: string; css: string; javascript?: string }
    timeSpent: number
  }) => {
    const response = await api.post<ApiResponse>('/css-exams/submit', data)
    return response.data
  },

  getHistory: async (limit?: number) => {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<ApiResponse>(`/css-exams/history?${params}`)
    return response.data
  },
}

// User API
export const userApi = {
  getProfile: async () => {
    const response = await api.get<ApiResponse>('/users/profile')
    return response.data
  },

  getProgress: async () => {
    const response = await api.get<ApiResponse>('/users/progress')
    return response.data
  },

  getAchievements: async () => {
    const response = await api.get<ApiResponse>('/users/achievements')
    return response.data
  },
}

// Leaderboard API
export const leaderboardApi = {
  getGlobal: async (type?: string, level?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (level) params.append('level', level)
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<ApiResponse>(`/leaderboard?${params}`)
    return response.data
  },

  getByLevel: async (level: string, type?: string, limit?: number) => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (limit) params.append('limit', limit.toString())
    
    const response = await api.get<ApiResponse>(`/leaderboard/level/${level}?${params}`)
    return response.data
  },

  getAroundUser: async (type?: string, range?: number) => {
    const params = new URLSearchParams()
    if (type) params.append('type', type)
    if (range) params.append('range', range.toString())
    
    const response = await api.get<ApiResponse>(`/leaderboard/around-user?${params}`)
    return response.data
  },

  getStats: async () => {
    const response = await api.get<ApiResponse>('/leaderboard/stats')
    return response.data
  },
}

// Health check
export const healthApi = {
  check: async () => {
    const response = await api.get<ApiResponse>('/health')
    return response.data
  },
}

export default api
