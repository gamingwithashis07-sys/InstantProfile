'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface NeuButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  variant?: 'default' | 'primary' | 'danger' | 'success' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function NeuButton({
  children,
  variant = 'default',
  size = 'md',
  loading,
  className,
  disabled,
  ...props
}: NeuButtonProps) {
  const variants = {
    default:
      'bg-[#e8d5c4] dark:bg-[#2d1f14] text-[#2d1f14] dark:text-[#e8d5c4] shadow-[5px_5px_10px_#c4b5a5,-5px_-5px_10px_#fff5eb] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(60,40,30,0.3)]',
    primary:
      'bg-gradient-to-r from-[#e8a87c] to-[#f4a261] text-white shadow-[5px_5px_10px_#c4b5a5,-5px_-5px_10px_#fff5eb] dark:shadow-[3px_3px_6px_rgba(0,0,0,0.5),-3px_-3px_6px_rgba(60,40,30,0.3)]',
    danger:
      'bg-red-400 text-white shadow-[5px_5px_10px_#c4b5a5,-5px_-5px_10px_#fff5eb]',
    success:
      'bg-emerald-400 text-white shadow-[5px_5px_10px_#c4b5a5,-5px_-5px_10px_#fff5eb]',
    ghost: 'bg-transparent shadow-none hover:bg-white/10',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-[12px]',
    md: 'px-5 py-2.5 text-sm rounded-[16px]',
    lg: 'px-8 py-3.5 text-base rounded-[20px]',
  }

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { scale: 0.98 }}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 border-none cursor-pointer',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </motion.button>
  )
}
