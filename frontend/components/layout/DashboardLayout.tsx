'use client'

import { useState } from 'react'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import Footer from './Footer'
import MobileNav from './MobileNav'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar — desktop only */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="p-4 lg:p-6 pb-20 lg:pb-6 page-enter">
            {children}
          </div>
        </main>

        {/* Footer — desktop only */}
        <div className="hidden lg:block">
          <Footer />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  )
}
