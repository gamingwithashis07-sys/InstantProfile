'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'
import { Users, Instagram, MessageSquare, Camera, Bell, Send, TrendingUp, Clock, ShoppingCart, DollarSign } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Stats {
  totalUsers: number
  totalAccounts: number
  totalDmSent: number
  totalPosts: number
  totalAutoReplies: number
  totalDmPending: number
  totalDmCampaigns: number
  totalProducts: number
  totalOrders: number
  totalRevenue: number
}

interface Activity {
  id: number
  user: string
  action: string
  target: string
  detail: string
  created_at: string
}

export default function AdminOverview() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [activity, setActivity] = useState<Activity[]>([])
  const router = useRouter()

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/stats').then(r => r.json()),
      fetch('/api/admin/activity').then(r => r.json()),
    ]).then(([s, a]) => {
      setStats(s)
      setActivity(a.slice(0, 6))
    }).catch(() => {})
  }, [])

  if (!stats) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      </div>
    )
  }

  const statCards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: '#6cb8c4' },
    { icon: Instagram, label: 'IG Accounts', value: stats.totalAccounts, color: '#c46cb8' },
    { icon: ShoppingCart, label: 'Products', value: stats.totalProducts, color: '#f4a261' },
    { icon: DollarSign, label: 'Orders', value: stats.totalOrders, color: '#7cb86c' },
    { icon: MessageSquare, label: 'DMs Sent', value: stats.totalDmSent, color: '#f4a261' },
    { icon: Send, label: 'Pending DMs', value: stats.totalDmPending, color: '#e8c36c' },
    { icon: Camera, label: 'Posts Scheduled', value: stats.totalPosts, color: '#7cb86c' },
    { icon: Bell, label: 'Auto Replies', value: stats.totalAutoReplies, color: '#6cb8c4' },
    { icon: Clock, label: 'DM Campaigns', value: stats.totalDmCampaigns, color: '#f4a261' },
  ]

  return (
    <div>
      <motion.h2 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-bold mb-6">
        Admin Dashboard
      </motion.h2>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <ClayCard className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-emerald-500" />
            <span className="text-sm font-semibold text-[#6b5a4c] dark:text-[#9c8a7a]">Total Platform Revenue</span>
          </div>
          <p className="text-3xl font-bold text-emerald-500">₹{stats.totalRevenue.toFixed(2)}</p>
        </ClayCard>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
        {statCards.map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <ClayCard hover={false} className="text-center">
              <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
              <div className="text-xl md:text-2xl font-black" style={{ color: s.color }}>
                <AnimatedCounter end={s.value} />
              </div>
              <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-1 font-medium">{s.label}</div>
            </ClayCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard>
          <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'IG Accounts', href: '/admin/ig-accounts', icon: Instagram },
              { label: 'Products', href: '/admin/products', icon: ShoppingCart },
              { label: 'DM Campaigns', href: '/admin/services', icon: MessageSquare },
              { label: 'DM Queue', href: '/admin/orders', icon: Send },
              { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
              { label: 'Manage Users', href: '/admin/users', icon: Users },
              { label: 'Settings', href: '/admin/settings', icon: TrendingUp },
            ].map((action, i) => {
              const Icon = action.icon
              return (
                <motion.div key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <button onClick={() => router.push(action.href)} className="w-full flex items-center gap-3 px-4 py-3 rounded-[14px] bg-white/10 hover:bg-white/20 transition-all text-left">
                    <Icon className="w-4 h-4 text-[#f4a261]" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </button>
                </motion.div>
              )
            })}
          </div>
        </ClayCard>

        {activity.length > 0 && (
          <ClayCard>
            <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
            <div className="space-y-2">
              {activity.map((a) => (
                <div key={a.id} className="flex items-center gap-3 p-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">
                  <div className="w-2 h-2 rounded-full bg-[#f4a261]" />
                  <span className="font-medium text-[#2d1f14] dark:text-[#e8d5c4]">{a.user}</span>
                  <span>{a.action}</span>
                  <span className="text-xs ml-auto">{new Date(a.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </ClayCard>
        )}
      </div>
    </div>
  )
}
