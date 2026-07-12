'use client'

import { cn } from '@/lib/utils'
import { SelectHTMLAttributes, forwardRef } from 'react'

interface NeuSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export const NeuSelect = forwardRef<HTMLSelectElement, NeuSelectProps>(
  ({ label, options, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-semibold mb-1.5 text-[#6b5a4c] dark:text-[#9c8a7a]">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2.5 rounded-[14px] border-none outline-none appearance-none',
            'bg-[#e8d5c4] dark:bg-[#2d1f14]',
            'shadow-[inset_3px_3px_6px_#c4b5a5,inset_-3px_-3px_6px_#fff5eb]',
            'dark:shadow-[inset_2px_2px_5px_rgba(0,0,0,0.5),inset_-2px_-2px_5px_rgba(60,40,30,0.3)]',
            'text-[#2d1f14] dark:text-[#e8d5c4]',
            'transition-all duration-200 cursor-pointer',
            className
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    )
  }
)

NeuSelect.displayName = 'NeuSelect'
