'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Palette, 
  Target, 
  Code, 
  Trophy, 
  Star, 
  Users, 
  Zap, 
  BookOpen,
  ArrowRight,
  CheckCircle,
  Play,
  Sparkles
} from 'lucide-react'

export default function LandingPage() {
  const router = useRouter()

  const features = [
    {
      icon: Target,
      title: 'Interactive Quizzes',
      description: 'Test your CSS knowledge with engaging multiple-choice questions and color guessing games.',
      color: 'text-blue-600'
    },
    {
      icon: Code,
      title: 'Hands-on Coding',
      description: 'Practice CSS with real coding challenges using our integrated Monaco editor.',
      color: 'text-purple-600'
    },
    {
      icon: Trophy,
      title: 'Gamified Learning',
      description: 'Earn points, unlock badges, and climb the leaderboard as you master CSS.',
      color: 'text-yellow-600'
    },
    {
      icon: BookOpen,
      title: 'Progressive Levels',
      description: 'Start as a beginner and advance through Intermediate to Pro levels.',
      color: 'text-green-600'
    }
  ]

  const stats = [
    { label: 'Active Learners', value: '1,247', icon: Users },
    { label: 'Quiz Questions', value: '150+', icon: Target },
    { label: 'CSS Challenges', value: '50+', icon: Code },
    { label: 'Success Rate', value: '94%', icon: Trophy }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-black dark:via-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200/50 dark:border-gray-700/50">
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
              <Link href="/auth/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Learn CSS the Fun Way</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Master CSS with
              <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent block">
                Interactive Learning
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
              Join thousands of students learning CSS through quizzes, coding challenges, 
              and gamified experiences. Progress from beginner to pro at your own pace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="bg-primary-600 hover:bg-primary-700 px-8 py-4 text-lg">
                  <Play className="h-5 w-5 mr-2" />
                  Start Learning Free
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="px-8 py-4 text-lg">
                  Sign In
                </Button>
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-2 mx-auto">
                    <stat.icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ColorPlatee?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Our platform combines the best of interactive learning with practical CSS skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-md">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${feature.color}`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Get started in minutes and begin your CSS learning journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Account',
                description: 'Sign up for free and set up your learning profile.'
              },
              {
                step: '02',
                title: 'Take Quizzes',
                description: 'Test your knowledge with interactive CSS quizzes.'
              },
              {
                step: '03',
                title: 'Code & Learn',
                description: 'Practice with real CSS challenges and track your progress.'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of students already mastering CSS with ColorPlatee.
          </p>
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-4 text-lg">
              Get Started Free
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Palette className="h-8 w-8 text-primary-400 mr-3" />
              <h3 className="text-xl font-bold">ColorPlatee</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Master CSS through interactive learning and hands-on practice.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/auth/register" className="text-gray-400 hover:text-white transition-colors">
                Sign Up
              </Link>
              <Link href="/auth/login" className="text-gray-400 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/dashboard" className="text-gray-400 hover:text-white transition-colors">
                Dashboard
              </Link>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-800 text-sm text-gray-400">
              © 2024 ColorPlatee. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
