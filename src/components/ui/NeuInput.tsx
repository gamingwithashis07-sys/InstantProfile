'use client'

import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface NeuInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const NeuInput = forwardRef<HTMLInputElement, NeuInputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold mb-1.5 text-[#6b5a4c] dark:text-[#9c8a7a]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-[14px] border-none outline-none',
            'bg-[#e8d5c4] dark:bg-[#2d1f14]',
            'shadow-[inset_3px_3px_6px_#c4b5a5,inset_-3px_-3px_6px_#fff5eb]',
            'dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,40,30,0.3)]',
            'text-[#2d1f14] dark:text-[#e8d5c4]',
            'placeholder:text-[#9c8a7a] dark:placeholder:text-[#6b5a4c]',
            'focus:shadow-[inset_4px_4px_8px_#c4b5a5,inset_-4px_-4px_8px_#fff5eb]',
            'transition-all duration-200',
            error && 'shadow-[inset_3px_3px_6px_#fca5a5,inset_-3px_-3px_6px_#fecaca]',
            className
          )}
          {...props}
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>
    )
  }
)

NeuInput.displayName = 'NeuInput'
