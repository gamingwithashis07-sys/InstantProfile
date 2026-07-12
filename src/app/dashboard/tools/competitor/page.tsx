'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'
import { Users, Search } from 'lucide-react'

export default function CompetitorPage() {
  const [usernames, setUsernames] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const analyze = async () => {
    const list = usernames.split(',').map(u => u.trim()).filter(Boolean)
    if (list.length === 0) return showToast('Enter at least one username', 'error')
    setLoading(true)
    const r = await fetch('/api/analyze/competitor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ competitors: list }) })
    const data = await r.json()
    setResults(data)
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Users className="w-6 h-6 text-[#f4a261]" /> Competitor Analysis</h2>

      <ClayCard className="mb-6 max-w-lg">
        <NeuInput label="Competitor Usernames" value={usernames} onChange={e => setUsernames(e.target.value)} placeholder="username1, username2, username3" />
        <div className="mt-4"><NeuButton variant="primary" onClick={analyze} loading={loading}><Search className="w-4 h-4" /> Analyze</NeuButton></div>
      </ClayCard>

      {results.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {results.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <ClayCard>
                <h3 className="font-bold text-lg mb-3">@{r.username}</h3>
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-lg font-bold text-[#f4a261]">{r.followers.toLocaleString()}</div><div className="text-xs text-[#6b5a4c]">Followers</div></div>
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-lg font-bold text-[#7cb86c]">{r.engagementRate}</div><div className="text-xs text-[#6b5a4c]">Engagement</div></div>
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-lg font-bold text-[#6cb8c4]">{r.postsPerWeek}/wk</div><div className="text-xs text-[#6b5a4c]">Posts</div></div>
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-xs text-[#6b5a4c]">{r.topHashtags?.map((h: string) => `#${h}`).join(', ')}</div><div className="text-xs text-[#6b5a4c] mt-1">Top Hashtags</div></div>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
