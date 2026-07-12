'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { LayoutTemplate } from 'lucide-react'

export default function StoryTemplatesPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stories/templates').then(r => r.json()).then(d => { setTemplates(d); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><LayoutTemplate className="w-6 h-6 text-[#f4a261]" /> Story Templates</h2>
      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 rounded-[16px]" style={{ background: `linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})` }} />
                <h3 className="font-bold">{t.name}</h3>
                <p className="text-xs text-[#6b5a4c] mt-1">{t.description}</p>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
