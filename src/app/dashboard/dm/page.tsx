'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/Toast'
import { MessageSquare, Plus, Send, Trash2, ListOrdered, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const tabs = [
  { href: '/dashboard/dm', label: 'Campaigns', icon: Send },
  { href: '/dashboard/orders', label: 'Queue', icon: ListOrdered },
  { href: '/dashboard/dm/conversations', label: 'Conversations', icon: MessageCircle },
]

export default function DMPage() {
  const pathname = usePathname()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([
      fetch('/api/dm/campaigns').then(r => r.json()),
      fetch('/api/ig/connect').then(r => r.json()),
    ]).then(([c, a]) => { setCampaigns(c); setAccounts(a); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2"><MessageSquare className="w-6 h-6 text-[#f4a261]" /> DM Campaigns</h2>
        <Link href="/dashboard/dm/new"><NeuButton variant="primary" size="sm"><Plus className="w-4 h-4" /> New Campaign</NeuButton></Link>
      </div>

      <div className="flex gap-1 mb-6 p-1 bg-white/5 rounded-[12px] w-fit overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          const isActive = pathname === tab.href
          return (
            <Link key={tab.href} href={tab.href}>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-sm transition-all ${
                isActive
                  ? 'bg-[#f4a261]/20 text-[#f4a261] font-semibold'
                  : 'text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261]'
              }`}>
                <Icon className="w-4 h-4" />
                {tab.label}
              </div>
            </Link>
          )
        })}
      </div>

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : campaigns.length === 0 ? (
        <ClayCard className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p className="mb-4">No DM campaigns yet. Create your first campaign to send bulk messages.</p>
          <Link href="/dashboard/dm/new"><NeuButton variant="primary">Create Campaign</NeuButton></Link>
        </ClayCard>
      ) : (
        <div className="grid gap-4">
          {campaigns.map(c => (
            <ClayCard key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold">{c.name}</h3>
                  <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Account: @{c.ig_username} · Trigger: {c.trigger_type} · Delay: {c.delay_minutes}m</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{c.status}</span>
              </div>
              <p className="text-xs text-[#6b5a4c] mt-2">{c.sent_count} messages sent</p>
            </ClayCard>
          ))}
        </div>
      )}
    </motion.div>
  )
}
