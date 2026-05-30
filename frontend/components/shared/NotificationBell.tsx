'use client'

import { useState } from 'react'
import type { Notification } from '@/types'

interface NotificationBellProps {
  notifications: Notification[]
  onMarkRead: (id: string) => void
}

export default function NotificationBell({
  notifications,
  onMarkRead,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false)
  const unread = notifications.filter((n) => !n.isRead).length

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 rounded-lg flex items-center justify-center
                   text-muted-foreground hover:bg-muted transition-colors"
      >
        <i className="fa-solid fa-bell text-lg" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full
                           bg-red-500 text-white text-[10px] font-bold
                           flex items-center justify-center">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-11 z-20 w-80 bg-card rounded-xl
                          border border-border shadow-xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3
                            border-b border-border">
              <h4 className="font-heading font-bold text-sm text-foreground">
                Notifications
              </h4>
              {unread > 0 && (
                <span className="bg-red-100 text-red-600 text-xs font-medium
                                 px-2 py-0.5 rounded-full">
                  {unread} new
                </span>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto scrollbar-thin">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <i className="fa-solid fa-bell-slash text-2xl
                                text-muted-foreground mb-2 block" />
                  <p className="text-xs text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => onMarkRead(n.id)}
                    className={`px-4 py-3 border-b border-border last:border-0
                                cursor-pointer hover:bg-muted/50 transition-colors ${
                      !n.isRead ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                        !n.isRead ? 'bg-blue-500' : 'bg-transparent'
                      }`} />
                      <div>
                        <p className="text-xs font-semibold text-foreground">
                          {n.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {n.message}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">
                          {new Date(n.createdAt).toLocaleString('en-TZ', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
