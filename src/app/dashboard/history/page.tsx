'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { Skeleton } from '@/components/ui/LoadingSkeleton'
import { History, MessageSquare, Camera, Bell } from 'lucide-react'
import Link from 'next/link'

export default function AutomationHistory() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const t = setTimeout(() => setLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">History</h2><p className="text-[#6b5a4c]">Loading...</p></div>

  const sections = [
    { icon: MessageSquare, label: 'DM Campaigns', desc: 'View sent campaigns and message history', href: '/dashboard/dm', color: '#f4a261' },
    { icon: Camera, label: 'Scheduled Posts', desc: 'See published and upcoming posts', href: '/dashboard/posts', color: '#7cb86c' },
    { icon: Bell, label: 'Auto Replies', desc: 'Review triggered auto-reply activity', href: '/dashboard/replies', color: '#6cb8c4' },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Activity History</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((s, i) => {
          const Icon = s.icon
          return (
            <Link key={i} href={s.href}>
              <ClayCard className="text-center h-full cursor-pointer hover:translate-y-[-4px] transition-transform">
                <Icon className="w-10 h-10 mx-auto mb-3" style={{ color: s.color }} />
                <h3 className="font-bold mb-1">{s.label}</h3>
                <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{s.desc}</p>
              </ClayCard>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
