'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function GlassCard({ children, className, ...props }: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[20px] border border-white/20 dark:border-white/5',
        'bg-white/40 dark:bg-black/30',
        'backdrop-blur-[12px]',
        'shadow-glass',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
