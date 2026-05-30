'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/lib/api'
import { redirectByRole } from '@/hooks/useAuth'

interface ChangePasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'At least 8 characters', pass: password.length >= 8 },
    { label: 'Contains uppercase letter', pass: /[A-Z]/.test(password) },
    { label: 'Contains lowercase letter', pass: /[a-z]/.test(password) },
    { label: 'Contains a number', pass: /\d/.test(password) },
    { label: 'Contains special character', pass: /[!@#$%^&*]/.test(password) },
  ]

  const score = checks.filter((c) => c.pass).length

  const strengthLabel =
    score <= 1 ? 'Very Weak' :
    score === 2 ? 'Weak' :
    score === 3 ? 'Fair' :
    score === 4 ? 'Strong' : 'Very Strong'

  const strengthColor =
    score <= 1 ? 'bg-red-500' :
    score === 2 ? 'bg-orange-500' :
    score === 3 ? 'bg-yellow-500' :
    score === 4 ? 'bg-blue-500' : 'bg-emerald-500'

  if (!password) return null

  return (
    <div className="space-y-2 mt-2">
      {/* Bar */}
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i < score ? strengthColor : 'bg-muted'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        score <= 2 ? 'text-red-500' :
        score === 3 ? 'text-yellow-600' : 'text-emerald-600'
      }`}>
        {strengthLabel}
      </p>
      {/* Checklist */}
      <ul className="space-y-1">
        {checks.map((check) => (
          <li key={check.label}
              className="flex items-center gap-2 text-xs text-muted-foreground">
            <i className={`fa-solid text-[10px] ${
              check.pass
                ? 'fa-circle-check text-emerald-500'
                : 'fa-circle text-muted-foreground/40'
            }`} />
            {check.label}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function ChangePasswordPage() {
  const router = useRouter()
  const { user, setUser } = useAuthStore()
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [serverError, setServerError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePasswordForm>()

  const newPassword = watch('newPassword', '')

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true)
    setServerError('')

    try {
      await authApi.changePassword(data.currentPassword, data.newPassword)

      if (user) {
        setUser({ ...user, isFirstLogin: false })
      }

      if (user) {
        redirectByRole(user.role, router)
      }
    } catch (err: any) {
      const message =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        'Failed to change password. Please try again.'
      setServerError(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="bg-cbe-primary px-8 py-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-cbe-gold flex items-center
                          justify-center mx-auto mb-3">
            <i className="fa-solid fa-key text-2xl text-gray-900" />
          </div>
          <h1 className="font-heading text-xl font-bold text-white mb-1">
            Change Your Password
          </h1>
          <p className="text-white/60 text-sm">
            You must set a new password before continuing
          </p>
        </div>

        {/* Alert Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <p className="text-xs text-amber-700 flex items-center gap-2">
            <i className="fa-solid fa-triangle-exclamation shrink-0" />
            This is required for account security. You cannot skip this step.
          </p>
        </div>

        {/* Form */}
        <div className="px-8 py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Current Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock absolute left-3.5 top-1/2
                              -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  {...register('currentPassword', {
                    required: 'Current password is required',
                  })}
                  type={showCurrent ? 'text' : 'password'}
                  placeholder="Your current password"
                  className={`input-base pl-10 pr-11 ${
                    errors.currentPassword ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-muted-foreground hover:text-foreground transition-colors"
                >
                  <i className={`fa-solid ${showCurrent ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation" />
                  {errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                New Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-lock-open absolute left-3.5 top-1/2
                              -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  {...register('newPassword', {
                    required: 'New password is required',
                    minLength: {
                      value: 8,
                      message: 'Password must be at least 8 characters',
                    },
                  })}
                  type={showNew ? 'text' : 'password'}
                  placeholder="Choose a strong password"
                  className={`input-base pl-10 pr-11 ${
                    errors.newPassword ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-muted-foreground hover:text-foreground transition-colors"
                >
                  <i className={`fa-solid ${showNew ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation" />
                  {errors.newPassword.message}
                </p>
              )}
              <PasswordStrength password={newPassword} />
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Confirm New Password
              </label>
              <div className="relative">
                <i className="fa-solid fa-shield-halved absolute left-3.5 top-1/2
                              -translate-y-1/2 text-muted-foreground text-sm" />
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your new password',
                    validate: (value) =>
                      value === newPassword || 'Passwords do not match',
                  })}
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Repeat your new password"
                  className={`input-base pl-10 pr-11 ${
                    errors.confirmPassword ? 'border-red-500' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2
                             text-muted-foreground hover:text-foreground transition-colors"
                >
                  <i className={`fa-solid ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <i className="fa-solid fa-circle-exclamation" />
                  {errors.confirmPassword.message}
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
                  Updating Password...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk" />
                  Save New Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
