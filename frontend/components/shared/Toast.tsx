'use client'

import { useEffect, useState } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

const TOAST_CONFIG: Record<
  ToastType,
  { icon: string; bg: string; text: string; border: string }
> = {
  success: {
    icon: 'fa-circle-check',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
  },
  error: {
    icon: 'fa-circle-xmark',
    bg: 'bg-red-50',
    text: 'text-red-600',
    border: 'border-red-200',
  },
  warning: {
    icon: 'fa-triangle-exclamation',
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    border: 'border-orange-200',
  },
  info: {
    icon: 'fa-circle-info',
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    border: 'border-blue-200',
  },
}

export function Toast({
  message,
  type,
  duration = 4000,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true)
  const config = TOAST_CONFIG[type]

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border
                  shadow-lg transition-all duration-300 max-w-sm w-full
                  ${config.bg} ${config.border}
                  ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}
    >
      <i className={`fa-solid ${config.icon} ${config.text} text-lg shrink-0`} />
      <p className={`text-sm font-medium flex-1 ${config.text}`}>
        {message}
      </p>
      <button
        onClick={() => {
          setVisible(false)
          setTimeout(onClose, 300)
        }}
        className={`${config.text} opacity-60 hover:opacity-100 transition-opacity`}
      >
        <i className="fa-solid fa-xmark text-sm" />
      </button>
    </div>
  )
}

/* ── Toast Container ── */
interface ToastItem {
  id: string
  message: string
  type: ToastType
}

interface ToastContainerProps {
  toasts: ToastItem[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => onRemove(toast.id)}
        />
      ))}
    </div>
  )
}
