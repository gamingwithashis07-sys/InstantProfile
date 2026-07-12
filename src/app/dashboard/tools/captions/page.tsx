'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import { FileText, Plus, Copy } from 'lucide-react'

export default function CaptionsPage() {
  const [captions, setCaptions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', content: '', category: 'general' })
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/captions').then(r => r.json()).then(d => { setCaptions(d); setLoading(false) })
  }, [])

  const addCaption = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/captions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { showToast('Caption saved!', 'success'); setShowForm(false); location.reload() }
  }

  const copyCaption = (text: string) => {
    navigator.clipboard.writeText(text)
    showToast('Copied!', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6 text-[#f4a261]" /> Caption Templates</h2>
        <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Template</NeuButton>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <form onSubmit={addCaption} className="space-y-4 max-w-lg">
            <NeuInput label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <div><label className="text-sm font-medium mb-1 block">Caption Content</label>
              <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[100px]" /></div>
            <NeuSelect label="Category" options={[
              { value: 'general', label: 'General' }, { value: 'promo', label: 'Promotional' },
              { value: 'educational', label: 'Educational' }, { value: 'fun', label: 'Fun' }, { value: 'story', label: 'Story' },
            ]} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            <NeuButton variant="primary" type="submit">Save Template</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : captions.length === 0 ? (
        <ClayCard className="text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>No caption templates yet.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {captions.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <ClayCard>
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-sm">{c.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#f4a261]/20 text-[#f4a261] capitalize">{c.category}</span>
                    </div>
                    <p className="text-sm text-[#6b5a4c] whitespace-pre-wrap line-clamp-3">{c.content}</p>
                  </div>
                  <button onClick={() => copyCaption(c.content)} className="p-2 rounded-[10px] hover:bg-white/20 shrink-0 ml-2"><Copy className="w-4 h-4" /></button>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
