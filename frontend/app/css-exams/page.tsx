'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { cssExamApi } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Code, Eye, Clock, CheckCircle, XCircle } from 'lucide-react'
import { CSSExam, CSSExamCode } from '@/types'
import toast from 'react-hot-toast'
import dynamic from 'next/dynamic'

// Dynamically import Monaco Editor to avoid SSR issues
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 dark:bg-gray-800 animate-pulse rounded" />
})

export default function CSSExamsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  
  const [exams, setExams] = useState<CSSExam[]>([])
  const [selectedExam, setSelectedExam] = useState<CSSExam | null>(null)
  const [code, setCode] = useState<CSSExamCode>({
    html: '',
    css: '',
    javascript: ''
  })
  const [timeLeft, setTimeLeft] = useState(30 * 60) // 30 minutes in seconds
  const [examStarted, setExamStarted] = useState(false)
  const [examCompleted, setExamCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(true)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      loadExams(user.level)
    }
  }, [user])

  useEffect(() => {
    if (examStarted && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      handleSubmitExam()
    }
  }, [timeLeft, examStarted])

  const loadExams = async (level: string) => {
    try {
      const response = await cssExamApi.getExams(level)
      if (response.success && response.data) {
        setExams(response.data.exams)
      }
    } catch (error) {
      console.error('Error loading CSS exams:', error)
      toast.error('Failed to load CSS exams')
    }
  }

  const startExam = (exam: CSSExam) => {
    setSelectedExam(exam)
    setCode({
      html: exam.starterCode.html,
      css: exam.starterCode.css,
      javascript: ''
    })
    setTimeLeft(exam.timeLimit * 60) // Convert minutes to seconds
    setExamStarted(true)
  }

  const handleSubmitExam = async () => {
    if (!selectedExam) return

    setIsSubmitting(true)
    try {
      const timeSpent = (selectedExam.timeLimit * 60) - timeLeft
      
      const response = await cssExamApi.submitCode({
        examId: selectedExam.id,
        code,
        timeSpent,
      })

      if (response.success && response.data) {
        setResult(response.data.result)
        setExamCompleted(true)
        toast.success('CSS exam submitted successfully!')
      }
    } catch (error) {
      console.error('Error submitting CSS exam:', error)
      toast.error('Failed to submit CSS exam')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const generatePreviewHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Preview</title>
        <style>
          ${code.css}
        </style>
      </head>
      <body>
        ${code.html}
        <script>
          ${code.javascript}
        </script>
      </body>
      </html>
    `
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

  if (examCompleted && result) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <Card className="text-center">
            <CardHeader>
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-2xl">CSS Challenge Completed!</CardTitle>
              <CardDescription>
                Great job on completing the CSS challenge. Here are your results:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {result.score}
                  </div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    Points Earned
                  </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {result.passedRequirements}/{result.totalRequirements}
                  </div>
                  <div className="text-sm text-green-600 dark:text-green-400">
                    Requirements Met
                  </div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {result.percentage}%
                  </div>
                  <div className="text-sm text-purple-600 dark:text-purple-400">
                    Success Rate
                  </div>
                </div>
              </div>

              {/* Requirements Results */}
              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Requirements Check:
                </h3>
                {result.requirements.map((req: any, index: number) => (
                  <div
                    key={index}
                    className={`flex items-center p-3 rounded-lg ${
                      req.passed
                        ? 'bg-green-50 dark:bg-green-900/20'
                        : 'bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    {req.passed ? (
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {req.requirement}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {req.message}
                      </p>
                    </div>
                    <span className="text-sm font-medium">
                      {req.points} pts
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  {result.feedback}
                </p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button onClick={() => {
                  setExamCompleted(false)
                  setResult(null)
                  setSelectedExam(null)
                  setExamStarted(false)
                }} variant="outline">
                  Try Another Challenge
                </Button>
                <Button onClick={() => router.push('/dashboard')}>
                  Back to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!examStarted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => router.push('/dashboard')}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              CSS Coding Challenges
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Practice your CSS skills with hands-on coding challenges
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Code className="h-5 w-5 mr-2" />
                    {exam.title}
                  </CardTitle>
                  <CardDescription>
                    {exam.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Level</span>
                    <span className="font-medium">{exam.level}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium">{exam.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Time Limit</span>
                    <span className="font-medium">{exam.timeLimit} min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Points</span>
                    <span className="font-medium">{exam.points}</span>
                  </div>
                  
                  <Button
                    onClick={() => startExam(exam)}
                    className="w-full"
                  >
                    Start Challenge
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!selectedExam) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading challenge...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedExam.title}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {selectedExam.level} • {selectedExam.category}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                {formatTime(timeLeft)}
              </div>
              <Button
                onClick={() => setShowPreview(!showPreview)}
                variant="outline"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                {showPreview ? 'Hide' : 'Show'} Preview
              </Button>
              <Button
                onClick={handleSubmitExam}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Code Editor */}
        <div className={`${showPreview ? 'w-1/2' : 'w-full'} flex flex-col`}>
          <div className="flex-1 p-4">
            <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <MonacoEditor
                height="100%"
                defaultLanguage="css"
                value={code.css}
                onChange={(value) => setCode(prev => ({ ...prev, css: value || '' }))}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                }}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        {showPreview && (
          <div className="w-1/2 border-l border-gray-200 dark:border-gray-700">
            <div className="h-full p-4">
              <div className="h-full border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={generatePreviewHTML()}
                  className="w-full h-full border-0"
                  title="CSS Preview"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
