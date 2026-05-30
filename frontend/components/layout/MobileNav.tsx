'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth.store'
import type { Role } from '@/types'

interface NavItem {
  label: string
  href: string
  icon: string
}

const NAV_ITEMS: Record<Role, NavItem[]> = {
  STUDENT: [
    { label: 'Dashboard', href: '/student/dashboard', icon: 'fa-gauge' },
    { label: 'Clearance', href: '/student/clearance', icon: 'fa-file-check' },
  ],
  DEPARTMENT_OFFICER: [
    { label: 'Dashboard', href: '/department/dashboard', icon: 'fa-gauge' },
    { label: 'Pending', href: '/department/pending', icon: 'fa-clock' },
    { label: 'History', href: '/department/history', icon: 'fa-clock-rotate-left' },
  ],
  REGISTRAR: [
    { label: 'Dashboard', href: '/registrar/dashboard', icon: 'fa-gauge' },
    { label: 'Ready', href: '/registrar/ready', icon: 'fa-user-check' },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'fa-gauge' },
    { label: 'Students', href: '/admin/students', icon: 'fa-users' },
    { label: 'Reports', href: '/admin/reports', icon: 'fa-chart-bar' },
    { label: 'Logs', href: '/admin/audit-logs', icon: 'fa-shield' },
  ],
}

export default function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user } = useAuthStore()

  if (!user) return null

  const navItems = NAV_ITEMS[user.role]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t
                    border-border flex lg:hidden safe-area-pb">
      {navItems.map((item) => {
        const isActive = pathname === item.href
        return (
          <button
            key={item.href}
            onClick={() => router.push(item.href)}
            className={`flex-1 flex flex-col items-center justify-center
                        py-2 gap-0.5 text-center transition-colors ${
              isActive
                ? 'text-cbe-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <i className={`fa-solid ${item.icon} text-lg ${
              isActive ? 'text-cbe-primary' : ''
            }`} />
            <span className={`text-[10px] font-medium ${
              isActive ? 'text-cbe-primary' : ''
            }`}>
              {item.label}
            </span>
            {isActive && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2
                              w-8 h-0.5 bg-cbe-primary rounded-full" />
            )}
          </button>
        )
      })}
    </nav>
  )
}
