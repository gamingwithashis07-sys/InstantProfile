'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip,
} from 'recharts'
import { ClayCard } from '@/components/ui/ClayCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { Users, Instagram, MessageSquare, Camera, ShoppingCart, DollarSign, Send, TrendingUp, Bell } from 'lucide-react'

const COLORS = ['#f4a261', '#e8a87c', '#7cb86c', '#6cb8c4', '#c46cb8', '#e8c36c']

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const dmStatusData = [
    { status: 'Sent', count: stats?.totalDmSent || 0 },
    { status: 'Pending', count: stats?.totalDmPending || 0 },
  ]

  const overviewCards = [
    { icon: Users, label: 'Total Users', value: stats?.totalUsers || 0, color: '#f4a261' },
    { icon: Instagram, label: 'IG Accounts', value: stats?.totalAccounts || 0, color: '#c46cb8' },
    { icon: MessageSquare, label: 'DMs Sent', value: stats?.totalDmSent || 0, color: '#7cb86c' },
    { icon: Camera, label: 'Posts', value: stats?.totalPosts || 0, color: '#6cb8c4' },
    { icon: Send, label: 'DM Campaigns', value: stats?.totalDmCampaigns || 0, color: '#e8c36c' },
    { icon: Bell, label: 'Auto Replies', value: stats?.totalAutoReplies || 0, color: '#c46cb8' },
    { icon: ShoppingCart, label: 'Products', value: stats?.totalProducts || 0, color: '#f4a261' },
    { icon: TrendingUp, label: 'Orders', value: stats?.totalOrders || 0, color: '#7cb86c' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Platform Analytics</h2>

      <motion.div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {overviewCards.map((s, i) => (
          <ClayCard key={i} hover={false} className="text-center">
            <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
            <div className="text-2xl font-black" style={{ color: s.color }}>
              <AnimatedCounter end={s.value} />
            </div>
            <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-1">{s.label}</div>
          </ClayCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ClayCard>
          <h3 className="font-bold text-lg mb-4">DM Status Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={dmStatusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={80} label>
                {dmStatusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold text-lg mb-4">Revenue</h3>
          <div className="flex items-center justify-center h-[250px]">
            <div className="text-center">
              <DollarSign className="w-10 h-10 mx-auto mb-2 text-emerald-500" />
              <p className="text-4xl font-bold text-emerald-500">₹{stats?.totalRevenue?.toFixed(2) || '0.00'}</p>
              <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mt-2">Total Platform Revenue</p>
            </div>
          </div>
        </ClayCard>
      </div>
    </motion.div>
  )
}
