import { cn } from '@/lib/utils'

export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400',
    inactive: 'bg-red-500/20 text-red-400',
    pending: 'bg-amber-500/20 text-amber-400',
    processing: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  }

  return (
    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium', colors[status] || 'bg-gray-500/20 text-gray-400')}>
      {status}
    </span>
  )
}
