'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { Clock, TrendingUp } from 'lucide-react'

export default function BestTimePage() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts/best-time').then(r => r.json()).then(d => { setData(d); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Clock className="w-6 h-6 text-[#f4a261]" /> Best Time to Post</h2>
      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : (
        <>
          <ClayCard className="mb-6">
            <div className="flex items-center gap-2 text-lg font-bold mb-2"><TrendingUp className="w-5 h-5 text-[#f4a261]" /> {data?.recommendation}</div>
          </ClayCard>
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {data?.bestTimes?.map((t: any, i: number) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ClayCard className="text-center">
                  <h3 className="font-bold text-sm mb-1">{t.day}</h3>
                  <p className="text-lg font-black text-[#f4a261]">{t.best}</p>
                  <div className="mt-2 w-full bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 rounded-full h-2">
                    <div className="h-2 rounded-full bg-[#f4a261]" style={{ width: `${t.score}%` }} />
                  </div>
                  <p className="text-xs text-[#6b5a4c] mt-1">{t.score}% score</p>
                </ClayCard>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}
