import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(date: string) {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatCurrency(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function truncate(str: string, len = 30) {
  return str.length > len ? str.substring(0, len) + '...' : str
}

export function generateId() {
  return Math.random().toString(36).substring(2, 10)
}

export function getStatusColor(status: string) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500',
    inactive: 'bg-red-500',
    pending: 'bg-amber-500',
    processing: 'bg-blue-500',
    completed: 'bg-emerald-500',
    cancelled: 'bg-red-500',
  }
  return colors[status] || 'bg-gray-500'
}

export function getStatusBg(status: string) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    processing: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  }
  return colors[status] || 'bg-gray-50 text-gray-700'
}
