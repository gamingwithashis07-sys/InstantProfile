'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { BarChart3, Instagram, MessageSquare, Camera, Bell, TrendingUp, Users } from 'lucide-react'

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(s => { setStats(s); setLoading(false) })
  }, [])

  if (loading) return <p className="text-[#6b5a4c]">Loading analytics...</p>

  const metrics = [
    { icon: Instagram, label: 'Connected Accounts', value: stats.totalAccounts, suffix: '', color: '#c46cb8' },
    { icon: MessageSquare, label: 'DMs Sent', value: stats.totalDmSent, suffix: '', color: '#f4a261' },
    { icon: Camera, label: 'Posts Scheduled', value: stats.totalPosts, suffix: '', color: '#7cb86c' },
    { icon: Bell, label: 'Auto-Reply Rules', value: stats.totalAutoReplies, suffix: '', color: '#6cb8c4' },
    { icon: TrendingUp, label: 'Follower Growth (30d)', value: stats.followerGrowth, suffix: '+', color: '#f4a261' },
    { icon: Users, label: 'Engagement Rate', value: stats.engagementRate, suffix: '%', color: '#7cb86c' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-6 h-6 text-[#f4a261]" /> Analytics Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {metrics.map((m, i) => (
          <ClayCard key={i} className="text-center">
            <m.icon className="w-5 h-5 mx-auto mb-2" style={{ color: m.color }} />
            <div className="text-2xl font-black" style={{ color: m.color }}>
              <AnimatedCounter end={m.value} suffix={m.suffix} />
            </div>
            <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-1">{m.label}</div>
          </ClayCard>
        ))}
      </div>

      {stats.accounts?.length > 0 && (
        <ClayCard>
          <h3 className="font-bold text-lg mb-4">Account Details</h3>
          <div className="grid gap-3">
            {stats.accounts.map((a: any) => (
              <div key={a.id} className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10">
                <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold">{a.ig_username?.[0]?.toUpperCase()}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">@{a.ig_username}</p>
                  <p className="text-xs text-[#6b5a4c]">{a.follower_count?.toLocaleString()} followers · {a.status}</p>
                </div>
              </div>
            ))}
          </div>
        </ClayCard>
      )}
    </motion.div>
  )
}
