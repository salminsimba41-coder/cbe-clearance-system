import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions) {
  return new Date(dateStr).toLocaleDateString('en-TZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    ...options,
  })
}

export function formatDateTime(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-TZ', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatEnum(value: string) {
  return value?.replace(/_/g, ' ')
}

export function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('')
}

export function calculateProgress(approved: number, total: number) {
  if (total === 0) return 0
  return Math.round((approved / total) * 100)
}

export function truncate(text: string, length: number = 50) {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
