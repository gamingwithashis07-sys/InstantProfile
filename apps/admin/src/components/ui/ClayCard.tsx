'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export function ClayCard({
  children,
  className,
  hover = true,
  ...props
}: {
  children: ReactNode
  className?: string
  hover?: boolean
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'rounded-[20px] p-5 clay',
        hover && 'hover:scale-[1.01] transition-transform duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
