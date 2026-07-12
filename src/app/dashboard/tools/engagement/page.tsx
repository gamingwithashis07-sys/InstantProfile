'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { BarChart3 } from 'lucide-react'

export default function EngagementPage() {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/analyze/engagement').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><BarChart3 className="w-6 h-6 text-[#f4a261]" /> Engagement Calculator</h2>

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : data.length === 0 ? (
        <ClayCard className="text-center py-12">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>Connect an Instagram account first.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold">@{a.username[0]}</div>
                  <div>
                    <h3 className="font-bold">@{a.username}</h3>
                    <p className="text-xs text-[#6b5a4c]">{a.followers.toLocaleString()} followers</p>
                  </div>
                </div>
                <div className="text-center p-4 rounded-[14px] bg-white/10">
                  <div className="text-3xl font-black text-[#f4a261]">{a.engagementRate}</div>
                  <p className="text-xs text-[#6b5a4c] mt-1">Engagement Rate</p>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
