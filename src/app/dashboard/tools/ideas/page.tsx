'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import { Lightbulb, Plus, Sparkles } from 'lucide-react'

const CATEGORIES = ['general', 'business', 'fashion', 'food', 'travel', 'fitness', 'tech', 'lifestyle']

export default function ContentIdeasPage() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ idea: '', category: 'general' })
  const [showForm, setShowForm] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/ideas').then(r => r.json()).then(d => { setIdeas(d); setLoading(false) })
  }, [])

  const addIdea = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { showToast('Idea added!', 'success'); setForm({ idea: '', category: 'general' }); location.reload() }
  }

  const generateIdeas = async () => {
    const r = await fetch('/api/calendar/ideas?count=5').then(r => r.json())
    const cal = r.calendar || []
    for (const c of cal) {
      await fetch('/api/ideas', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idea: c.idea, category: 'general' }) })
    }
    showToast('Generated 5 ideas!', 'success')
    location.reload()
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Lightbulb className="w-6 h-6 text-[#f4a261]" /> Content Ideas</h2>
        <div className="flex gap-2">
          <NeuButton size="sm" onClick={generateIdeas}><Sparkles className="w-4 h-4" /> Generate</NeuButton>
          <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Add Idea</NeuButton>
        </div>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <form onSubmit={addIdea} className="space-y-4 max-w-lg">
            <NeuInput label="Idea" value={form.idea} onChange={e => setForm({ ...form, idea: e.target.value })} required />
            <NeuSelect label="Category" options={CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <NeuButton variant="primary" type="submit">Add Idea</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : ideas.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Lightbulb className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p className="mb-4">No ideas yet. Generate some!</p>
          <NeuButton onClick={generateIdeas}><Sparkles className="w-4 h-4" /> Generate Ideas</NeuButton>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {ideas.map((idea, i) => (
            <motion.div key={idea.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}>
              <ClayCard>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{idea.idea}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#f4a261]/20 text-[#f4a261] capitalize">{idea.category}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${idea.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{idea.status}</span>
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
