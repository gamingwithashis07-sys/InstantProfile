'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ClayCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  hover?: boolean
}

export function ClayCard({ children, className, onClick, hover = true }: ClayCardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, boxShadow: '12px 12px 24px #c4b5a5, -12px -12px 24px #fff5eb' } : {}}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={cn(
        'rounded-[24px] p-6 bg-[#e8d5c4] dark:bg-[#2d1f14]',
        'shadow-[8px_8px_16px_#c4b5a5,-8px_-8px_16px_#fff5eb]',
        'dark:shadow-[4px_4px_12px_rgba(0,0,0,0.5),-4px_-4px_12px_rgba(60,40,30,0.3)]',
        'transition-all duration-300',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </motion.div>
  )
}
