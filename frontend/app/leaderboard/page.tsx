'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { leaderboardApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Trophy, Medal, Award, Crown, Star } from 'lucide-react'
import { LeaderboardUser } from '@/types'
import { formatScore, formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function LeaderboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [currentUserRank, setCurrentUserRank] = useState<number | null>(null)
  const [selectedFilter, setSelectedFilter] = useState({
    type: 'all',
    level: 'all',
  })
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    loadLeaderboard()
  }, [selectedFilter])

  const loadLeaderboard = async () => {
    setIsLoadingData(true)
    try {
      const response = await leaderboardApi.getGlobal(
        selectedFilter.type === 'all' ? undefined : selectedFilter.type,
        selectedFilter.level === 'all' ? undefined : selectedFilter.level,
        50
      )
      
      if (response.success && response.data) {
        setLeaderboard(response.data.leaderboard)
        setCurrentUserRank(response.data.currentUserRank)
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error)
      toast.error('Failed to load leaderboard')
    } finally {
      setIsLoadingData(false)
    }
  }

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />
    return <Trophy className="h-5 w-5 text-gray-400" />
  }

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300'
    if (rank === 2) return 'bg-gray-100 dark:bg-gray-800 border-gray-300'
    if (rank === 3) return 'bg-amber-100 dark:bg-amber-900/20 border-amber-300'
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
  }

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                🏆 Leaderboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                See how you rank against other learners
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Activity Type
                </label>
                <select
                  value={selectedFilter.type}
                  onChange={(e) => setSelectedFilter(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Activities</option>
                  <option value="quiz">Quizzes Only</option>
                  <option value="css-exam">CSS Challenges Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Level
                </label>
                <select
                  value={selectedFilter.level}
                  onChange={(e) => setSelectedFilter(prev => ({ ...prev, level: e.target.value }))}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Pro">Pro</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current User Rank */}
        {currentUserRank && (
          <Card className="mb-6 bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-800 rounded-full">
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      #{currentUserRank}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      Your Current Rank
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      You're ranked #{currentUserRank} on the leaderboard
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {formatScore(user.totalScore)}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Points
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              Top Performers
            </CardTitle>
            <CardDescription>
              Rankings based on total points earned
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingData ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              </div>
            ) : leaderboard.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  No data available for the selected filters
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {leaderboard.map((user, index) => (
                  <div
                    key={user.userId}
                    className={`flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 last:border-b-0 ${
                      user.userId === user?.id ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                    } ${getRankColor(user.rank)}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(user.rank)}
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {user.name}
                            {user.userId === user?.id && (
                              <span className="ml-2 text-xs bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 px-2 py-1 rounded-full">
                                You
                              </span>
                            )}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>{user.level}</span>
                            <span>•</span>
                            <span>{user.submissionsCount} activities</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          {formatScore(user.totalScore)}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.averageScore.toFixed(0)} avg
                        </p>
                      </div>
                      
                      {user.badges.length > 0 && (
                        <div className="flex items-center space-x-1">
                          {user.badges.slice(0, 3).map((badge, badgeIndex) => (
                            <div
                              key={badgeIndex}
                              className="w-6 h-6 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center"
                              title={badge}
                            >
                              <Star className="h-3 w-3 text-yellow-600 dark:text-yellow-400" />
                            </div>
                          ))}
                          {user.badges.length > 3 && (
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              +{user.badges.length - 3}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Your Rank
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    #{currentUserRank || 'N/A'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Your Score
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatScore(user.totalScore)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Your Level
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {user.level}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
