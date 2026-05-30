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
    { label: 'My Clearance', href: '/student/clearance', icon: 'fa-file-check' },
  ],
  DEPARTMENT_OFFICER: [
    { label: 'Dashboard', href: '/department/dashboard', icon: 'fa-gauge' },
    { label: 'Pending Students', href: '/department/pending', icon: 'fa-clock' },
    { label: 'History', href: '/department/history', icon: 'fa-clock-rotate-left' },
  ],
  REGISTRAR: [
    { label: 'Dashboard', href: '/registrar/dashboard', icon: 'fa-gauge' },
    { label: 'Ready Students', href: '/registrar/ready', icon: 'fa-user-check' },
  ],
  ADMIN: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: 'fa-gauge' },
    { label: 'Students', href: '/admin/students', icon: 'fa-users' },
    { label: 'Departments', href: '/admin/departments', icon: 'fa-building' },
    { label: 'Reports', href: '/admin/reports', icon: 'fa-chart-bar' },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: 'fa-shield' },
  ],
}

const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'Student Portal',
  DEPARTMENT_OFFICER: 'Department Portal',
  REGISTRAR: 'Registrar Portal',
  ADMIN: 'Admin Portal',
}

const ROLE_ICONS: Record<Role, string> = {
  STUDENT: 'fa-graduation-cap',
  DEPARTMENT_OFFICER: 'fa-building-columns',
  REGISTRAR: 'fa-stamp',
  ADMIN: 'fa-shield-halved',
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, student, officer, clearAuth } = useAuthStore()

  if (!user) return null

  const navItems = NAV_ITEMS[user.role]
  const roleLabel = ROLE_LABELS[user.role]
  const roleIcon = ROLE_ICONS[user.role]

  const handleNavClick = (href: string) => {
    router.push(href)
    onClose()
  }

  const handleLogout = () => {
    clearAuth()
    router.replace('/login')
  }

  const displayName =
    user.role === 'STUDENT' && student
      ? `${student.firstName} ${student.lastName}`
      : user.role === 'DEPARTMENT_OFFICER' && officer
      ? `${officer.firstName} ${officer.lastName}`
      : user.email.split('@')[0]

  const displaySub =
    user.role === 'STUDENT' && student
      ? student.studentNumber
      : user.role === 'DEPARTMENT_OFFICER' && officer
      ? officer.department?.name ?? 'Department Officer'
      : user.role === 'REGISTRAR'
      ? 'Registrar'
      : 'System Administrator'

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
                    bg-cbe-primary transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                    lg:translate-x-0 lg:static lg:z-auto`}
      >
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cbe-gold flex items-center justify-center shrink-0">
              <i className="fa-solid fa-graduation-cap text-gray-900 text-lg" />
            </div>
            <div>
              <p className="font-heading text-white font-bold text-sm leading-tight">
                CBE Clearance
              </p>
              <p className="text-white/50 text-xs">Digital System</p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="px-6 py-3 border-b border-white/10">
          <div className="flex items-center gap-2">
            <i className={`fa-solid ${roleIcon} text-cbe-gold text-xs`} />
            <span className="text-white/70 text-xs font-medium">{roleLabel}</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <button
                key={item.href}
                onClick={() => handleNavClick(item.href)}
                className={`sidebar-item w-full text-left
                            ${isActive ? 'sidebar-item-active' : ''}`}
              >
                <i className={`fa-solid ${item.icon} w-4 text-center`} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* User Profile + Logout */}
        <div className="px-3 py-4 border-t border-white/10 space-y-2">
          {/* User Info */}
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-9 h-9 rounded-full bg-cbe-gold flex items-center
                            justify-center shrink-0">
              <span className="text-gray-900 font-bold text-sm">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">
                {displayName}
              </p>
              <p className="text-white/50 text-xs truncate">{displaySub}</p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="sidebar-item w-full text-left text-red-300
                       hover:text-red-200 hover:bg-red-500/20"
          >
            <i className="fa-solid fa-right-from-bracket w-4 text-center" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
