import { ReactNode } from 'react'
import { GlassCard } from './GlassCard'

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description: string; action?: ReactNode }) {
  return (
    <GlassCard className="text-center py-16">
      <div className="text-[#9c8a7a] mb-4 flex justify-center">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-6">{description}</p>
      {action}
    </GlassCard>
  )
}
