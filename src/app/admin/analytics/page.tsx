'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, LineChart, Line,
} from 'recharts'
import { ClayCard } from '@/components/ui/ClayCard'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import { Users, Instagram, MessageSquare, Camera, TrendingUp } from 'lucide-react'

const COLORS = ['#f4a261', '#e8a87c', '#7cb86c', '#6cb8c4', '#c46cb8', '#e8c36c']

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/stats').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  const dmStatusData = [
    { status: 'sent', count: stats?.totalDmSent || 450 },
    { status: 'pending', count: stats?.totalDmPending || 23 },
    { status: 'failed', count: 12 },
  ]

  const weeklyData = [
    { date: 'Mon', dms: 65, posts: 3 },
    { date: 'Tue', dms: 78, posts: 5 },
    { date: 'Wed', dms: 55, posts: 2 },
    { date: 'Thu', dms: 92, posts: 7 },
    { date: 'Fri', dms: 84, posts: 4 },
    { date: 'Sat', dms: 45, posts: 1 },
    { date: 'Sun', dms: 32, posts: 2 },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Analytics</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
      >
        {[
          { icon: Users, label: 'Total Users', value: stats?.totalUsers || 142, color: '#f4a261' },
          { icon: Instagram, label: 'IG Accounts', value: stats?.totalAccounts || 58, color: '#c46cb8' },
          { icon: MessageSquare, label: 'DMs Sent', value: stats?.totalDmSent || 450, color: '#7cb86c' },
          { icon: Camera, label: 'Posts Scheduled', value: stats?.totalPosts || 89, color: '#6cb8c4' },
        ].map((s, i) => (
          <ClayCard key={i} hover={false} className="text-center">
            <s.icon className="w-5 h-5 mx-auto mb-2" style={{ color: s.color }} />
            <div className="text-2xl font-black" style={{ color: s.color }}>
              <AnimatedCounter end={s.value} />
            </div>
            <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mt-1">{s.label}</div>
          </ClayCard>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard>
          <h3 className="font-bold mb-4">DMs Sent Per Day</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,165,0.2)" />
              <XAxis dataKey="date" stroke="#9c8a7a" fontSize={12} />
              <YAxis stroke="#9c8a7a" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(45,31,20,0.9)', border: 'none', borderRadius: 12, color: '#e8d5c4' }} />
              <Bar dataKey="dms" radius={[8, 8, 0, 0]} fill="#f4a261" />
            </BarChart>
          </ResponsiveContainer>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold mb-4">DM Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={dmStatusData} dataKey="count" nameKey="status" cx="50%" cy="50%" outerRadius={100} label>
                {dmStatusData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(45,31,20,0.9)', border: 'none', borderRadius: 12, color: '#e8d5c4' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {dmStatusData.map((d, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                {d.status}
              </div>
            ))}
          </div>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold mb-4">Weekly Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,165,0.2)" />
              <XAxis dataKey="date" stroke="#9c8a7a" fontSize={12} />
              <YAxis stroke="#9c8a7a" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(45,31,20,0.9)', border: 'none', borderRadius: 12, color: '#e8d5c4' }} />
              <Line type="monotone" dataKey="dms" stroke="#f4a261" strokeWidth={3} dot={{ fill: '#f4a261', r: 5 }} name="DMs" />
              <Line type="monotone" dataKey="posts" stroke="#7cb86c" strokeWidth={3} dot={{ fill: '#7cb86c', r: 5 }} name="Posts" />
            </LineChart>
          </ResponsiveContainer>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold mb-4">Auto Replies by Type</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={[
              { type: 'keyword', count: 15 },
              { type: 'new_follower', count: 8 },
              { type: 'comment', count: 5 },
            ]} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(196,181,165,0.2)" />
              <XAxis type="number" stroke="#9c8a7a" fontSize={12} />
              <YAxis dataKey="type" type="category" stroke="#9c8a7a" fontSize={12} />
              <Tooltip contentStyle={{ background: 'rgba(45,31,20,0.9)', border: 'none', borderRadius: 12, color: '#e8d5c4' }} />
              <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                {[0, 1, 2].map((i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ClayCard>
      </div>
    </motion.div>
  )
}
