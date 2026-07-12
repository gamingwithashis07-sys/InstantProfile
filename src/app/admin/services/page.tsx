'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { MessageSquare } from 'lucide-react'

export default function AdminDmCampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await fetch('/api/admin/dm-campaigns').then(r => r.json())
    setCampaigns(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">All DM Campaigns</h2><p className="text-[#6b5a4c]">Loading...</p></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">All DM Campaigns</h2>
      {campaigns.length === 0 ? (
        <ClayCard className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p>No DM campaigns yet.</p>
        </ClayCard>
      ) : (
        <ClayCard hover={false} className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="neu-table">
              <thead><tr><th>Name</th><th>User</th><th>Account</th><th>Trigger</th><th>Sent</th><th>Status</th><th>Created</th></tr></thead>
              <tbody>
                {campaigns.map(c => (
                  <motion.tr key={c.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td className="font-semibold">{c.name}</td>
                    <td>{c.username}</td>
                    <td>@{c.ig_username}</td>
                    <td className="capitalize text-sm">{c.trigger_type}</td>
                    <td>{c.sent_count}</td>
                    <td><span className={`px-2 py-0.5 rounded-full text-xs ${c.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{c.status}</span></td>
                    <td className="text-sm text-[#6b5a4c]">{new Date(c.created_at).toLocaleDateString()}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClayCard>
      )}
    </motion.div>
  )
}
