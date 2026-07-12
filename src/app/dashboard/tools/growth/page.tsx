'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { TrendingUp } from 'lucide-react'

export default function GrowthPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analyze/growth').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="w-6 h-6 text-[#f4a261]" /> Growth Tracker</h2>
      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : data.length === 0 ? (
        <ClayCard className="text-center py-12"><TrendingUp className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>No data yet.</p></ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard>
                <h3 className="font-bold mb-3">@{a.username}</h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-lg font-bold text-[#f4a261]">{a.followers.toLocaleString()}</div><div className="text-xs text-[#6b5a4c]">Followers</div></div>
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-lg font-bold text-[#7cb86c]">+{a.weeklyGrowth}</div><div className="text-xs text-[#6b5a4c]">Weekly</div></div>
                  <div className="p-3 rounded-[12px] bg-white/10"><div className="text-lg font-bold text-[#6cb8c4]">+{a.monthlyGrowth}</div><div className="text-xs text-[#6b5a4c]">Monthly</div></div>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
