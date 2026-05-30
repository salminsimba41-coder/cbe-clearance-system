'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { usePathname } from 'next/navigation'
import type { Campus } from '@/types'

const CAMPUS_LABELS: Record<Campus, string> = {
  DAR_ES_SALAAM: 'Dar es Salaam Campus',
  DODOMA: 'Dodoma Campus',
  MWANZA: 'Mwanza Campus',
}

const PAGE_TITLES: Record<string, string> = {
  '/student/dashboard': 'Dashboard',
  '/student/clearance': 'My Clearance',
  '/department/dashboard': 'Dashboard',
  '/department/pending': 'Pending Students',
  '/department/history': 'Clearance History',
  '/registrar/dashboard': 'Dashboard',
  '/registrar/ready': 'Ready for Final Approval',
  '/admin/dashboard': 'Dashboard',
  '/admin/students': 'All Students',
  '/admin/departments': 'Departments',
  '/admin/reports': 'Reports & Analytics',
  '/admin/audit-logs': 'Audit Logs',
}

interface NavbarProps {
  onMenuClick: () => void
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, student, officer } = useAuthStore()
  const pathname = usePathname()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const pageTitle = PAGE_TITLES[pathname] ?? 'CBE Clearance System'

  const campus =
    user?.role === 'STUDENT' && student
      ? CAMPUS_LABELS[student.campus]
      : user?.role === 'DEPARTMENT_OFFICER' && officer
      ? CAMPUS_LABELS[officer.campus]
      : null

  const formattedDate = time.toLocaleDateString('en-TZ', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <header className="h-16 bg-card border-b border-border flex items-center
                       justify-between px-4 lg:px-6 shrink-0">
      {/* Left — Menu + Title */}
      <div className="flex items-center gap-4">
        {/* Hamburger (mobile only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center
                     text-muted-foreground hover:bg-muted transition-colors"
        >
          <i className="fa-solid fa-bars text-lg" />
        </button>

        {/* Page Title */}
        <div>
          <h1 className="font-heading text-lg font-bold text-foreground leading-tight">
            {pageTitle}
          </h1>
          {campus && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <i className="fa-solid fa-location-dot text-cbe-gold" />
              {campus}
            </p>
          )}
        </div>
      </div>

      {/* Right — Date + User */}
      <div className="flex items-center gap-3">
        {/* Date */}
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground
                        bg-muted px-3 py-1.5 rounded-lg">
          <i className="fa-solid fa-calendar text-cbe-gold" />
          {formattedDate}
        </div>

        {/* CBE Badge */}
        <div className="flex items-center gap-2 bg-cbe-primary px-3 py-1.5 rounded-lg">
          <i className="fa-solid fa-graduation-cap text-cbe-gold text-xs" />
          <span className="text-white text-xs font-medium hidden sm:block">
            CBE Tanzania
          </span>
        </div>
      </div>
    </header>
  )
}
