'use client'

import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
}

export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-6',
        'bg-white/15 dark:bg-black/20',
        'backdrop-blur-[12px]',
        'border border-white/25 dark:border-white/10',
        'shadow-[0_8px_32px_rgba(0,0,0,0.1)]',
        className
      )}
    >
      {children}
    </div>
  )
}
