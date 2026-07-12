'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { Activity, Clock } from 'lucide-react'

interface ActivityItem {
  id: number
  user: string
  action: string
  target: string
  detail: string
  created_at: string
}

function ActionDot({ action }: { action: string }) {
  const colors: Record<string, string> = {
    created: 'bg-emerald-500',
    updated: 'bg-blue-500',
    deleted: 'bg-red-500',
    login: 'bg-[#f4a261]',
    order: 'bg-purple-500',
    api_key: 'bg-cyan-500',
    service: 'bg-pink-500',
  }
  return (
    <div className={`w-2.5 h-2.5 rounded-full ${colors[action] || 'bg-gray-500'} ring-4 ring-[#f5e6d3] dark:ring-[#1a0e08]`} />
  )
}

export default function ActivityPage() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/activity')
      .then(r => r.json())
      .then(data => { setActivities(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">Activity Log</h2><TableSkeleton /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold">Activity Log</h2>
        <Activity className="w-5 h-5 text-[#9c8a7a]" />
      </div>

      {activities.length === 0 ? (
        <EmptyState icon={<Activity className="w-12 h-12" />} title="No activity yet" description="Admin actions will be logged here" />
      ) : (
        <div className="relative">
          <div className="absolute left-[14px] top-0 bottom-0 w-0.5 bg-[#c4b5a5]/30 dark:bg-[#3a2a1c]/50" />
          <div className="space-y-4">
            {activities.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="relative pl-10"
              >
                <div className="absolute left-[10px] top-1.5">
                  <ActionDot action={a.action} />
                </div>
                <ClayCard hover={false} className="p-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">{a.user}</span>
                      <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{a.action}</span>
                      <span className="text-sm font-medium">{a.target}</span>
                    </div>
                    <span className="text-xs text-[#9c8a7a] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(a.created_at).toLocaleString()}
                    </span>
                  </div>
                  {a.detail && (
                    <p className="text-xs text-[#9c8a7a] mt-1 ml-1">{a.detail}</p>
                  )}
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}
