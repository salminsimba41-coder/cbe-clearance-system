'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import type { Role } from '@/types'

export function useAuth(requiredRole?: Role | Role[]) {
  const router = useRouter()
  const { user, isAuthenticated, token } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !token) {
      router.replace('/login')
      return
    }

    if (user?.isFirstLogin) {
      router.replace('/change-password')
      return
    }

    if (requiredRole && user) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole]
      if (!roles.includes(user.role)) {
        redirectByRole(user.role, router)
      }
    }
  }, [isAuthenticated, token, user, requiredRole, router])

  return { user, isAuthenticated, token }
}

export function useRedirectIfAuthenticated() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isFirstLogin) {
        router.replace('/change-password')
      } else {
        redirectByRole(user.role, router)
      }
    }
  }, [isAuthenticated, user, router])
}

export function redirectByRole(role: Role, router: ReturnType<typeof useRouter>) {
  switch (role) {
    case 'STUDENT':
      router.replace('/student/dashboard')
      break
    case 'DEPARTMENT_OFFICER':
      router.replace('/department/dashboard')
      break
    case 'REGISTRAR':
      router.replace('/registrar/dashboard')
      break
    case 'ADMIN':
      router.replace('/admin/dashboard')
      break
    default:
      router.replace('/login')
  }
}
