'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { Award, CheckCircle, XCircle } from 'lucide-react'

export default function ProfileScorePage() {
  const [scores, setScores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile/score').then(r => r.json()).then(d => { setScores(d); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Award className="w-6 h-6 text-[#f4a261]" /> Profile Score</h2>
      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : scores.length === 0 ? (
        <ClayCard className="text-center py-12"><Award className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>Connect an account first.</p></ClayCard>
      ) : (
        <div className="grid gap-6">
          {scores.map((s, i) => (
            <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg">@{s.username}</h3>
                  <div className="text-center">
                    <div className={`text-3xl font-black ${s.score >= 80 ? 'text-emerald-400' : s.score >= 50 ? 'text-[#f4a261]' : 'text-red-400'}`}>{s.score}%</div>
                    <p className="text-xs text-[#6b5a4c]">Profile Score</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  {s.checks.map((c: any, j: number) => (
                    <div key={j} className="flex items-center justify-between p-3 rounded-[12px] bg-white/10">
                      <div className="flex items-center gap-2">
                        {c.pass ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />}
                        <span className="text-sm">{c.label}</span>
                      </div>
                      <span className="text-xs text-[#6b5a4c]">+{c.weight} pts</span>
                    </div>
                  ))}
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
