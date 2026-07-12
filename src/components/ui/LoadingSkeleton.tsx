'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[12px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        'before:animate-[shimmer_2s_infinite]',
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="rounded-[24px] p-6 bg-[#e8d5c4] dark:bg-[#2d1f14] shadow-clay-sm">
      <Skeleton className="h-4 w-24 mb-4" />
      <Skeleton className="h-8 w-16 mb-2" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-[20px] p-4 bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-3 border-b border-[#c4b5a5]/20">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/6" />
          <Skeleton className="h-4 w-1/12" />
        </div>
      ))}
    </div>
  )
}
