import { cookies } from 'next/headers'
import { User } from '@/types'

export async function getServerSession(): Promise<User | null> {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('token')?.value
    
    if (!token) {
      return null
    }

    // In a real app, you would verify the JWT token here
    // For now, we'll just check if the token exists
    const userCookie = cookieStore.get('user')?.value
    if (userCookie) {
      return JSON.parse(userCookie)
    }

    return null
  } catch (error) {
    console.error('Error getting server session:', error)
    return null
  }
}

export function getAuthHeaders() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  
  return {
    Authorization: token ? `Bearer ${token}` : '',
  }
}
