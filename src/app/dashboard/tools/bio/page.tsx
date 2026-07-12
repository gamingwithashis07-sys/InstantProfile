'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'
import { Layout, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function BioPagePage() {
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', bio: '', username: '', avatar_url: '', theme_color: '#f4a261' })
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/bio').then(r => r.json()).then(d => { setPages(d); setLoading(false) })
  }, [])

  const createPage = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/bio', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { showToast('Bio page created!', 'success'); setShowForm(false); location.reload() }
    else showToast('Username taken!', 'error')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Layout className="w-6 h-6 text-[#f4a261]" /> Bio Pages</h2>
        <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Page</NeuButton>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <form onSubmit={createPage} className="space-y-4 max-w-lg">
            <NeuInput label="Page Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <NeuInput label="Username" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} required placeholder="your-bio-page" />
            <NeuInput label="Bio" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
            <NeuInput label="Avatar URL" type="url" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} />
            <NeuInput label="Theme Color" type="color" value={form.theme_color} onChange={e => setForm({ ...form, theme_color: e.target.value })} />
            <NeuButton variant="primary" type="submit">Create Bio Page</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : pages.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Layout className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>No bio pages yet.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-4">
          {pages.map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {p.avatar_url ? <img src={p.avatar_url} className="w-12 h-12 rounded-[14px] object-cover" /> : <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold">{p.title[0]}</div>}
                    <div>
                      <h3 className="font-bold">{p.title}</h3>
                      <p className="text-xs text-[#6b5a4c]">/{p.username}</p>
                      {p.bio && <p className="text-xs text-[#6b5a4c] mt-1 max-w-md truncate">{p.bio}</p>}
                    </div>
                  </div>
                  <a href={`/bio/${p.username}`} target="_blank" className="p-2 rounded-[10px] hover:bg-white/20"><ExternalLink className="w-4 h-4" /></a>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
