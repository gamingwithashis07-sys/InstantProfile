'use client'

import { cn, getStatusBg } from '@/lib/utils'

interface StatusBadgeProps {
  status: string
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold capitalize',
        getStatusBg(status),
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', status === 'active' || status === 'completed' ? 'bg-emerald-500 animate-pulse' : status === 'pending' ? 'bg-amber-500 animate-pulse' : 'bg-red-500')} />
      {status}
    </span>
  )
}
