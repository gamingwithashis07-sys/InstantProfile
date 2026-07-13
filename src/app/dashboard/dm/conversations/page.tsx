'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { MessageSquare, MessageCircle, User } from 'lucide-react'

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dm/conversations')
      .then(r => r.json())
      .then(data => { setConversations(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-6 h-6 text-[#f4a261]" />
        <h2 className="text-2xl font-bold">Conversations</h2>
      </div>

      {conversations.length === 0 ? (
        <ClayCard className="text-center py-12">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p className="text-[#6b5a4c] dark:text-[#9c8a7a] mb-1">No conversations yet</p>
          <p className="text-xs text-[#9c8a7a]">Conversations will appear here when your auto-reply triggers are activated.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {conversations.map((c, i) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ClayCard className="cursor-pointer hover:translate-y-[-2px] transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-[10px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold text-sm">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold truncate">@{c.participant_username || 'Unknown'}</p>
                      <span className="text-xs text-[#9c8a7a]">{new Date(c.updated_at || c.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] truncate mt-0.5">
                      Account: @{c.account_name}
                      {c.last_message && <span className="ml-2">&middot; {c.last_message}</span>}
                    </p>
                  </div>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
