'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { Send } from 'lucide-react'

export default function AdminDmQueuePage() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const data = await fetch('/api/admin/dm-queue').then(r => r.json())
    setQueue(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">DM Queue</h2><p className="text-[#6b5a4c]">Loading...</p></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">All DM Queue Items</h2>
      {queue.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Send className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p>No queued DMs.</p>
        </ClayCard>
      ) : (
        <ClayCard hover={false} className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="neu-table">
              <thead><tr><th>ID</th><th>User</th><th>To</th><th>Message</th><th>Status</th><th>Sent At</th><th>Created</th></tr></thead>
              <tbody>
                {queue.map(q => (
                  <motion.tr key={q.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td className="font-semibold">#{q.id}</td>
                    <td>{q.username}</td>
                    <td>@{q.recipient_username}</td>
                    <td className="max-w-[200px] truncate text-sm">{q.message}</td>
                    <td><span className={`px-2 py-0.5 rounded-full text-xs ${q.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : q.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{q.status}</span></td>
                    <td className="text-sm">{q.sent_at ? new Date(q.sent_at).toLocaleString() : '-'}</td>
                    <td className="text-sm text-[#6b5a4c]">{new Date(q.created_at).toLocaleDateString()}</td>
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
