export function CardSkeleton() {
  return (
    <div className="rounded-[20px] p-5 clay animate-pulse">
      <div className="w-8 h-8 bg-[#c4b5a5]/30 dark:bg-[#3a2a1e] rounded-[12px] mb-3" />
      <div className="h-6 w-16 bg-[#c4b5a5]/30 dark:bg-[#3a2a1e] rounded mb-2" />
      <div className="h-3 w-24 bg-[#c4b5a5]/30 dark:bg-[#3a2a1e] rounded" />
    </div>
  )
}

export function TableSkeleton() {
  return (
    <div className="rounded-[20px] p-5 clay animate-pulse space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-4 w-1/4 bg-[#c4b5a5]/30 dark:bg-[#3a2a1e] rounded" />
          <div className="h-4 w-1/3 bg-[#c4b5a5]/30 dark:bg-[#3a2a1e] rounded" />
          <div className="h-4 w-1/6 bg-[#c4b5a5]/30 dark:bg-[#3a2a1e] rounded" />
        </div>
      ))}
    </div>
  )
}
