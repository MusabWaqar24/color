'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ThemeToggle } from '@/components/theme-toggle'
import { 
  Trophy, 
  Target, 
  Code, 
  Palette, 
  TrendingUp, 
  Star,
  ArrowRight,
  LogOut,
  User,
  Settings,
  BookOpen,
  Zap,
  Crown,
  Award,
  Medal,
  Flame,
  BarChart3,
  Calendar,
  Clock,
  Users
} from 'lucide-react'
import { formatScore, formatPercentage, getLevelIcon } from '@/lib/utils'
import { User as UserType } from '@/types'

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalScore: 0,
    totalSubmissions: 0,
    quizzesCompleted: 0,
    cssExamsCompleted: 0,
    currentStreak: 0,
    rank: null as number | null,
  })

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      setStats({
        totalScore: user.totalScore,
        totalSubmissions: user.achievements.quizzesCompleted + user.achievements.cssExamsCompleted,
        quizzesCompleted: user.achievements.quizzesCompleted,
        cssExamsCompleted: user.achievements.cssExamsCompleted,
        currentStreak: user.achievements.streak,
        rank: null, // This would come from API
      })
    }
  }, [user])

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

  const levels = [
    {
      level: 'Beginner',
      title: 'CSS Basics',
      description: 'Learn the fundamentals of CSS styling',
      icon: BookOpen,
      color: 'bg-primary-500',
      isUnlocked: true,
      stats: user.progress?.beginner || { quizzesCompleted: 0, cssExamsCompleted: 0, averageScore: 0 },
    },
    {
      level: 'Intermediate',
      title: 'Layout & Design',
      description: 'Master flexbox, grid, and responsive design',
      icon: Code,
      color: 'bg-secondary-500',
      isUnlocked: user.totalScore >= 500,
      stats: user.progress?.intermediate || { quizzesCompleted: 0, cssExamsCompleted: 0, averageScore: 0 },
    },
    {
      level: 'Pro',
      title: 'Advanced CSS',
      description: 'Explore animations, advanced selectors, and performance',
      icon: Zap,
      color: 'bg-gray-800',
      isUnlocked: user.totalScore >= 1500,
      stats: user.progress?.pro || { quizzesCompleted: 0, cssExamsCompleted: 0, averageScore: 0 },
    },
  ]

  const quickActions = [
    {
      title: 'Take a Quiz',
      description: 'Test your CSS knowledge',
      icon: Target,
      href: '/quiz',
      color: 'bg-blue-500',
    },
    {
      title: 'CSS Challenge',
      description: 'Practice coding skills',
      icon: Code,
      href: '/css-exams',
      color: 'bg-purple-500',
    },
    {
      title: 'Leaderboard',
      description: 'See how you rank',
      icon: Trophy,
      href: '/leaderboard',
      color: 'bg-secondary-500',
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="relative">
                <Palette className="h-8 w-8 text-primary-600 mr-3" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
                ColorPlatee
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Crown className="h-3 w-3" />
                <span>{user.level}</span>
              </Badge>
              {user.email === 'admin@colorplatee.com' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push('/admin')}
                  className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/40"
                >
                  <Settings className="h-4 w-4 mr-1" />
                  Admin
                </Button>
              )}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {formatScore(user.totalScore)} points
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 rounded-3xl"></div>
          <Card className="relative border-0 shadow-xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent mb-2">
                    Welcome back, {user.name}! 👋
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 text-lg">
                    Ready to continue your CSS learning journey?
                  </p>
                  <div className="flex items-center mt-4 space-x-4">
                    <Badge variant="success" className="flex items-center space-x-1">
                      <Flame className="h-3 w-3" />
                      <span>{stats.currentStreak} day streak</span>
                    </Badge>
                    <Badge variant="info" className="flex items-center space-x-1">
                      <Award className="h-3 w-3" />
                      <span>{user.badges.length} badges</span>
                    </Badge>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center">
                    <Palette className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Total Score
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {formatScore(stats.totalScore)}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900 dark:to-primary-800 rounded-xl group-hover:scale-110 transition-transform">
                  <Trophy className="h-6 w-6 text-primary-600 dark:text-primary-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Quizzes Completed
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.quizzesCompleted}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 rounded-xl group-hover:scale-110 transition-transform">
                  <Target className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    CSS Challenges
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.cssExamsCompleted}
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl group-hover:scale-110 transition-transform">
                  <Code className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Current Streak
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stats.currentStreak}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">days</p>
                </div>
                <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900 dark:to-orange-800 rounded-xl group-hover:scale-110 transition-transform">
                  <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges */}
        {user.badges.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 text-yellow-500 mr-2" />
                Your Badges
              </CardTitle>
              <CardDescription>
                Achievements you've earned along your learning journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {user.badges.map((badge, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  >
                    🏅 {badge}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => router.push(action.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 ${action.color} rounded-lg mr-4`}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {action.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Learning Levels */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Learning Levels
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {levels.map((level, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all ${
                  level.isUnlocked
                    ? 'hover:shadow-lg hover:-translate-y-1'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                onClick={() => level.isUnlocked && router.push(`/${level.level.toLowerCase()}`)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`p-3 ${level.color} rounded-lg mr-4`}>
                        <level.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          {getLevelIcon(level.level)} {level.title}
                        </CardTitle>
                        <CardDescription>
                          {level.description}
                        </CardDescription>
                      </div>
                    </div>
                    {!level.isUnlocked && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">
                        Locked
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Quizzes</span>
                      <span className="font-medium">{level.stats.quizzesCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">CSS Challenges</span>
                      <span className="font-medium">{level.stats.cssExamsCompleted}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Avg Score</span>
                      <span className="font-medium">{level.stats.averageScore}%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
