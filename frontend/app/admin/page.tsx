'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Edit, Trash2, Eye, BarChart3, Users, BookOpen, Code, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
      return
    }

    // Check if user is admin (you can add admin role to user model)
    if (user && user.email !== 'admin@colorplatee.com') {
      router.push('/dashboard')
      return
    }
  }, [isAuthenticated, isLoading, router, user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'quizzes', label: 'Manage Quizzes', icon: BookOpen },
    { id: 'exams', label: 'Manage CSS Exams', icon: Code },
    { id: 'users', label: 'Manage Users', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>
            <Badge variant="destructive" className="flex items-center space-x-1">
              <Settings className="h-3 w-3" />
              <span>Admin</span>
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg p-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">156</p>
                  </div>
                  <Users className="h-8 w-8 text-primary-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">24</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">CSS Exams</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">12</p>
                  </div>
                  <Code className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Submissions</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">1,247</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'quizzes' && (
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage Quizzes</CardTitle>
                <CardDescription>Add, edit, or remove quiz questions</CardDescription>
              </div>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Quiz
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((quiz) => (
                  <div key={quiz} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">CSS Color Quiz #{quiz}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Beginner Level • 5 questions</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'exams' && (
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Manage CSS Exams</CardTitle>
                <CardDescription>Add, edit, or remove CSS coding challenges</CardDescription>
              </div>
              <Button className="bg-primary-600 hover:bg-primary-700">
                <Plus className="h-4 w-4 mr-2" />
                Add CSS Exam
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((exam) => (
                  <div key={exam} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">CSS Layout Challenge #{exam}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Intermediate Level • 30 min</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'users' && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>View and manage user accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((user) => (
                  <div key={user} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h3 className="font-medium">User {user}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">user{user}@example.com • Beginner Level</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'settings' && (
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure application settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Application Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Maintenance Mode</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Temporarily disable user access</p>
                      </div>
                      <Button variant="outline">Toggle</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Send email updates to users</p>
                      </div>
                      <Button variant="outline">Configure</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
