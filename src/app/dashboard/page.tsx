'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'
import { useToast } from '@/components/ui/Toast'
import {
  MessageSquare, Camera, Bell, Hash, BarChart3, Instagram,
  Users, Send, TrendingUp, Plus, ArrowRight, Zap
} from 'lucide-react'
import Link from 'next/link'

export default function AutomationDashboard() {
  const [session, setSession] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([
      fetch('/api/auth/me').then(r => r.json()),
      fetch('/api/analytics').then(r => r.json()),
      fetch('/api/ig/connect').then(r => r.json()),
    ]).then(([s, st, accts]) => {
      setSession(s); setStats(st); setAccounts(accts); setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Automation Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const featureCards = [
    { icon: Send, label: 'DM Campaigns', value: stats?.totalDmSent || 0, suffix: ' sent', href: '/dashboard/dm', color: '#f4a261' },
    { icon: Camera, label: 'Scheduled Posts', value: stats?.totalPosts || 0, suffix: '', href: '/dashboard/posts', color: '#7cb86c' },
    { icon: Bell, label: 'Auto Replies', value: stats?.totalAutoReplies || 0, suffix: ' active', href: '/dashboard/replies', color: '#6cb8c4' },
    { icon: Instagram, label: 'Connected Accounts', value: stats?.totalAccounts || 0, suffix: '', href: '/dashboard/accounts', color: '#c46cb8' },
  ]

  const quickActions = [
    { label: 'New DM Campaign', icon: Send, href: '/dashboard/dm', desc: 'Send bulk messages' },
    { label: 'Schedule Post', icon: Camera, href: '/dashboard/posts', desc: 'Auto-publish content' },
    { label: 'Auto Reply Rule', icon: Bell, href: '/dashboard/replies', desc: 'Automate responses' },
    { label: 'Hashtag Groups', icon: Hash, href: '/dashboard/hashtags', desc: 'Manage hashtags' },
    { label: 'View Analytics', icon: BarChart3, href: '/dashboard/analytics', desc: 'Track growth' },
    { label: 'Connect Account', icon: Plus, href: '/dashboard/accounts', desc: 'Add IG account' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Automation Hub</h2>
          <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mt-1">
            {accounts.length > 0
              ? `${accounts.length} account${accounts.length > 1 ? 's' : ''} connected`
              : 'Connect your first Instagram account'}
          </p>
        </div>
        <motion.div animate={{ rotate: [0, 10, 0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Zap className="w-6 h-6 text-[#f4a261]" />
        </motion.div>
      </div>

      {accounts.length === 0 ? (
        <GlassCard className="text-center py-16 mb-8">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Instagram className="w-16 h-16 mx-auto mb-4 text-[#9c8a7a]" />
          </motion.div>
          <h3 className="text-xl font-bold mb-2">Connect Your Instagram Account</h3>
          <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-6 max-w-md mx-auto">
            Link your Instagram Business or Creator account via Facebook Graph API to unlock DM campaigns, auto-replies, content scheduling, and analytics.
          </p>
          <Link href="/dashboard/accounts">
            <NeuButton variant="primary" size="lg">
              <Plus className="w-5 h-5" /> Connect Instagram Account
            </NeuButton>
          </Link>
        </GlassCard>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {featureCards.map((f, i) => (
              <Link key={i} href={f.href}>
                <ClayCard hover={false} className="text-center cursor-pointer hover:translate-y-[-4px] transition-transform">
                  <f.icon className="w-5 h-5 mx-auto mb-2" style={{ color: f.color }} />
                  <div className="text-2xl font-black" style={{ color: f.color }}>
                    <AnimatedCounter end={f.value} suffix={f.suffix} />
                  </div>
                  <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-1">{f.label}</div>
                </ClayCard>
              </Link>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ClayCard>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">Quick Actions</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {quickActions.map((a, i) => (
                  <Link key={i} href={a.href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10 hover:bg-white/20 transition-all"
                    >
                      <a.icon className="w-4 h-4 text-[#f4a261]" />
                      <div>
                        <p className="text-sm font-semibold">{a.label}</p>
                        <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{a.desc}</p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            </ClayCard>

            <ClayCard>
              <h3 className="font-bold text-lg mb-4">Accounts</h3>
              {accounts.map((a, i) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10 mb-2"
                >
                  <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold text-sm">
                    {a.ig_username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">@{a.ig_username}</p>
                    <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{a.follower_count?.toLocaleString() || 0} followers</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${a.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {a.status}
                  </span>
                </motion.div>
              ))}
            </ClayCard>
          </div>
        </>
      )}

      {stats && (
        <ClayCard className="mt-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-[#f4a261]" /> Growth Snapshot
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Follower Growth', value: stats.followerGrowth, suffix: '+', color: '#f4a261' },
              { label: 'Engagement Rate', value: stats.engagementRate, suffix: '%', color: '#7cb86c' },
              { label: 'DMs Sent', value: stats.totalDmSent, suffix: '', color: '#6cb8c4' },
              { label: 'Posts Scheduled', value: stats.totalPosts, suffix: '', color: '#c46cb8' },
            ].map((s, i) => (
              <div key={i} className="text-center p-3 rounded-[14px] bg-white/10">
                <div className="text-xl font-bold" style={{ color: s.color }}>
                  <AnimatedCounter end={s.value} suffix={s.suffix} />
                </div>
                <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </ClayCard>
      )}
    </motion.div>
  )
}
