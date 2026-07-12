'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/Toast'
import { Calendar, Sparkles } from 'lucide-react'

export default function CalendarPage() {
  const [calendar, setCalendar] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  const generate = async () => {
    setLoading(true)
    const r = await fetch('/api/calendar/ideas?count=7').then(r => r.json())
    setCalendar(r.calendar || [])
    setLoading(false)
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Calendar className="w-6 h-6 text-[#f4a261]" /> Content Calendar</h2>

      <div className="mb-6">
        <NeuButton variant="primary" onClick={generate} loading={loading}><Sparkles className="w-4 h-4" /> Generate Weekly Plan</NeuButton>
      </div>

      {calendar.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {calendar.map((c, i) => {
            const colors = ['#f4a261', '#7cb86c', '#6cb8c4', '#c46cb8', '#e8c36c', '#6c7cc4', '#e8a87c']
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ClayCard>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-bold text-xs" style={{ backgroundColor: colors[i % colors.length] }}>{c.day}</div>
                    <h3 className="font-bold text-sm">{c.day}</h3>
                  </div>
                  <p className="text-sm text-[#6b5a4c]">{c.idea}</p>
                </ClayCard>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
