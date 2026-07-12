'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { Send, Search } from 'lucide-react'
import { NeuInput } from '@/components/ui/NeuInput'

export default function DmQueue() {
  const [queue, setQueue] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/dm/queue').then(r => r.json()).then(data => { setQueue(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  const filtered = queue.filter(q =>
    q.recipient_username?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">DM Queue</h2><p className="text-[#6b5a4c]">Loading...</p></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">DM Queue</h2>
        <NeuInput placeholder="Search by username..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-[220px]" />
      </div>

      {filtered.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Send className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p>No queued DMs yet. Create a campaign to start sending messages.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {filtered.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <ClayCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white text-xs font-bold">
                      {q.recipient_username?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">@{q.recipient_username}</p>
                      <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Account: @{q.account_name}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${q.status === 'sent' ? 'bg-emerald-500/20 text-emerald-400' : q.status === 'failed' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'}`}>{q.status}</span>
                </div>
                <p className="text-xs text-[#6b5a4c] mt-2 truncate">{q.message}</p>
                {q.sent_at && <p className="text-xs text-[#9c8a7a] mt-1">Sent: {new Date(q.sent_at).toLocaleString()}</p>}
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
