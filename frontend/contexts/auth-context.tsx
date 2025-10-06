'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { authApi } from '@/lib/api'
import { User, AuthState } from '@/types'
import toast from 'react-hot-toast'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check for existing session on mount
    const savedToken = Cookies.get('token')
    const savedUser = Cookies.get('user')

    if (savedToken && savedUser) {
      try {
        setToken(savedToken)
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error('Error parsing saved user:', error)
        // Clear invalid cookies
        Cookies.remove('token')
        Cookies.remove('user')
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authApi.login({ email, password })

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data

        // Save to cookies
        Cookies.set('token', newToken, { expires: 7 })
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })

        // Update state
        setToken(newToken)
        setUser(userData)

        toast.success('Login successful!')
        return true
      } else {
        toast.error(response.message || 'Login failed')
        return false
      }
    } catch (error: any) {
      console.error('Login error:', error)
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await authApi.register({ name, email, password })

      if (response.success && response.data) {
        const { token: newToken, user: userData } = response.data

        // Save to cookies
        Cookies.set('token', newToken, { expires: 7 })
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })

        // Update state
        setToken(newToken)
        setUser(userData)

        toast.success('Registration successful!')
        return true
      } else {
        toast.error(response.message || 'Registration failed')
        return false
      }
    } catch (error: any) {
      console.error('Registration error:', error)
      const message = error.response?.data?.message || 'Registration failed'
      toast.error(message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    // Clear cookies
    Cookies.remove('token')
    Cookies.remove('user')

    // Clear state
    setToken(null)
    setUser(null)

    toast.success('Logged out successfully')
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      Cookies.set('user', JSON.stringify(updatedUser), { expires: 7 })
    }
  }

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        const userData = response.data.user
        setUser(userData)
        Cookies.set('user', JSON.stringify(userData), { expires: 7 })
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isLoading,
    isAuthenticated: !!user && !!token,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
