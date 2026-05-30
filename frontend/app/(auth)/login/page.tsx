'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/lib/api'
import { redirectByRole } from '@/hooks/useAuth'
import { useRedirectIfAuthenticated } from '@/hooks/useAuth'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  useRedirectIfAuthenticated()

  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    setServerError('')

    try {
      const response = await authApi.login(data.email, data.password)
      const { token, user, student, officer } = response.data

      setAuth(token, user, student, officer)

      if (user.isFirstLogin) {
        router.replace('/change-password')
      } else {
        redirectByRole(user.role, router)
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Login failed. Please check your credentials.'
      setServerError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      {/* Card */}
      <div className="bg-card rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-cbe-primary px-8 py-8 text-center">
          {/* Logo Icon */}
          <div className="w-20 h-20 rounded-2xl bg-cbe-gold flex items-center
                          justify-center mx-auto mb-4 shadow-lg">
            <i className="fa-solid fa-graduation-cap text-3xl text-gray-900" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">
            CBE Clearance System
          </h1>
          <p className="text-white/60 text-sm">
            College of Business Education — Tanzania
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-8">
          <h2 className="font-heading text-xl font-bold text-foreground mb-1">
            Welcome Back
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Sign in with your CBE institutional email
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Email Address
              </label>
              <div className="relative">
                <i className="fa-solid fa-envelope absolute left-3.5 top-1/2
                              -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Enter a valid email address',
                    },
                  })}
                  type="email"
                  placeholder="firstname.lastname@cbe.ac.tz"
                  autoComplete="email"
                  className={`input-base pl-10 ${
                    errors.email ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation" />
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2
                              -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`input-base pl-10 pr-11 ${
                    errors.password ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-muted-foreground hover:text-foreground
                             transition-colors"
                >
                  <i
                    className={`fa-solid ${
                      showPassword ? 'fa-eye-slash' : 'fa-eye'
                    } text-sm`}
                  />
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation" />
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 flex items-center gap-2">
                  <i className="fa-solid fa-circle-xmark shrink-0" />
                  {serverError}
                </p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-lg bg-cbe-primary hover:bg-cbe-primary-light
                         text-white font-semibold text-sm transition-colors duration-150
                         flex items-center justify-center gap-2
                         disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-right-to-bracket" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Default Password Hint */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700 flex items-start gap-2">
              <i className="fa-solid fa-circle-info mt-0.5 shrink-0" />
              First time? Your default password is{' '}
              <span className="font-bold font-mono">CBE@2024</span>.
              You will be asked to change it on first login.
            </p>
          </div>
        </div>
      </div>

      {/* Campuses */}
      <div className="mt-6 flex items-center justify-center gap-6">
        {['Dar es Salaam', 'Dodoma', 'Mwanza'].map((campus) => (
          <div key={campus} className="flex items-center gap-1.5">
            <i className="fa-solid fa-location-dot text-cbe-gold text-xs" />
            <span className="text-white/60 text-xs">{campus}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
