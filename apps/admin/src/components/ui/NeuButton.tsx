'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface NeuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  children: ReactNode
}

export function NeuButton({
  variant = 'ghost',
  size = 'md',
  loading,
  children,
  className,
  ...props
}: NeuButtonProps) {
  const base = 'rounded-[14px] font-semibold transition-all duration-200 flex items-center justify-center gap-2'

  const variants = {
    primary: 'bg-[#f4a261] text-white hover:bg-[#e8913d] shadow-neu-sm',
    ghost: 'bg-[#e8d5c4]/30 dark:bg-[#2d1f14]/30 text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] hover:bg-[#e8d5c4]/50 dark:hover:bg-[#2d1f14]/50',
    danger: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }

  return (
    <button
      className={cn(base, variants[variant], sizes[size], loading && 'opacity-60 pointer-events-none', className)}
      disabled={loading}
      {...props}
    >
      {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : children}
    </button>
  )
}
