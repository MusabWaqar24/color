import axios from 'axios'
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
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Admin API
export const adminApi = {
  // Dashboard Stats
  getStats: async () => {
    const response = await api.get<ApiResponse>('/admin/stats')
    return response.data
  },

  // Quiz Management
  getQuizzes: async () => {
    const response = await api.get<ApiResponse>('/admin/quizzes')
    return response.data
  },

  createQuiz: async (data: any) => {
    const response = await api.post<ApiResponse>('/admin/quizzes', data)
    return response.data
  },

  updateQuiz: async (id: string, data: any) => {
    const response = await api.put<ApiResponse>(`/admin/quizzes/${id}`, data)
    return response.data
  },

  deleteQuiz: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/admin/quizzes/${id}`)
    return response.data
  },

  // CSS Exam Management
  getCSSExams: async () => {
    const response = await api.get<ApiResponse>('/admin/css-exams')
    return response.data
  },

  createCSSExam: async (data: any) => {
    const response = await api.post<ApiResponse>('/admin/css-exams', data)
    return response.data
  },

  updateCSSExam: async (id: string, data: any) => {
    const response = await api.put<ApiResponse>(`/admin/css-exams/${id}`, data)
    return response.data
  },

  deleteCSSExam: async (id: string) => {
    const response = await api.delete<ApiResponse>(`/admin/css-exams/${id}`)
    return response.data
  },

  // User Management
  getUsers: async () => {
    const response = await api.get<ApiResponse>('/admin/users')
    return response.data
  },
}

export default adminApi
