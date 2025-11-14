'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ROUTES } from '@/lib/constants/routes'
import { Button, Input } from '@/components/ui'
import { Navigation, Footer } from '@/components/layout'
import { authService } from '@/services/auth'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (error) setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      console.log('Attempting login with:', { email: formData.email })
      const response = await authService.login(formData.email, formData.password)
      console.log('Login successful:', response)
      
      // Validate response has required fields
      if (!response || !response.id || !response.email) {
        throw new Error('Invalid response from server')
      }
      
      // Store user data in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true')
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          email: response.email,
          name: response.name,
          type: response.type,
          status: response.status,
        }))
        
        // Set profile completion status based on user status
        // For now, we'll check if status is verified (you can enhance this later)
        const profileComplete = response.status === 'verified'
        localStorage.setItem('profileComplete', profileComplete.toString())
      }
      
      // After successful login, redirect to marketplace
      router.push(ROUTES.MARKETPLACE)
    } catch (err) {
      console.error('Login error details:', err)
      const errorMessage = err instanceof Error ? err.message : 'Login failed. Please try again.'
      setError(errorMessage)
      // Don't redirect on error - stay on login page
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-700 px-8 py-6 text-center">
              <h1 className="text-3xl font-bold text-white">vayada</h1>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading}
              />

              <div>
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={isLoading}
                />
                <div className="mt-2 text-right">
                  <Link
                    href={ROUTES.FORGOT_PASSWORD}
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="px-8 pb-8 text-center border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link
                  href={ROUTES.SIGNUP}
                  className="text-primary-600 hover:text-primary-700 font-semibold"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
