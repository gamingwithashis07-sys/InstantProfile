'use client'

import { motion } from 'framer-motion'
import { PackageOpen } from 'lucide-react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="mb-6 text-[#9c8a7a]"
      >
        {icon || <PackageOpen className="w-16 h-16" />}
      </motion.div>
      <h3 className="text-lg font-bold text-[#2d1f14] dark:text-[#e8d5c4] mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] max-w-sm mb-6">{description}</p>
      )}
      {action}
    </motion.div>
  )
}
