'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import { redirectByRole } from '@/hooks/useAuth'

export default function HomePage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.isFirstLogin) {
        router.replace('/change-password')
      } else {
        redirectByRole(user.role, router)
      }
    } else {
      router.replace('/login')
    }
  }, [isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-cbe-primary border-t-cbe-gold
                        rounded-full animate-spin mx-auto" />
        <p className="text-muted-foreground font-body text-sm">
          Loading CBE Clearance System...
        </p>
      </div>
    </div>
  )
}
