'use client'

import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function Modal({ open, onClose, children, title }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-gradient-to-br from-white/25 to-white/10 dark:from-black/30 dark:to-black/10 backdrop-blur-[20px] border border-white/30 dark:border-white/10 rounded-[28px] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-[#9c8a7a] hover:text-[#2d1f14] dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {title && (
              <h2 className="text-xl font-bold mb-5 text-[#2d1f14] dark:text-[#e8d5c4]">
                {title}
              </h2>
            )}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
