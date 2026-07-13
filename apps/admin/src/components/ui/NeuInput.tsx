'use client'

import { cn } from '@/lib/utils'

interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function NeuInput({ label, className, ...props }: NeuInputProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1.5 text-[#6b5a4c] dark:text-[#9c8a7a]">{label}</label>}
      <input
        className={cn(
          'w-full px-4 py-2.5 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522]',
          'border-2 border-transparent focus:border-[#f4a261] outline-none',
          'text-sm text-[#2d1f14] dark:text-[#e8d5c4]',
          'placeholder:text-[#9c8a7a]',
          className
        )}
        {...props}
      />
    </div>
  )
}
