'use client'

import { cn } from '@/lib/utils'

interface NeuSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: { value: string; label: string }[]
}

export function NeuSelect({ label, options, className, ...props }: NeuSelectProps) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium mb-1.5 text-[#6b5a4c] dark:text-[#9c8a7a]">{label}</label>}
      <select
        className={cn(
          'w-full px-4 py-2.5 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522]',
          'border-2 border-transparent focus:border-[#f4a261] outline-none',
          'text-sm text-[#2d1f14] dark:text-[#e8d5c4]',
          className
        )}
        {...props}
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
