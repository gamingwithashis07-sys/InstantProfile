'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'
import { Link2, Plus, Copy, ExternalLink } from 'lucide-react'

export default function LinkShortenerPage() {
  const [links, setLinks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ target_url: '', title: '', slug: '' })
  const [showForm, setShowForm] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/links').then(r => r.json()).then(d => { setLinks(d); setLoading(false) })
  }, [])

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/links', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { showToast('Link created!', 'success'); setShowForm(false); location.reload() }
    else showToast('Failed', 'error')
  }

  const copyLink = (slug: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/go/${slug}`)
    showToast('Copied!', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Link2 className="w-6 h-6 text-[#f4a261]" /> Link Shortener</h2>
        <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Link</NeuButton>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <form onSubmit={createLink} className="space-y-4 max-w-lg">
            <NeuInput label="Target URL" type="url" value={form.target_url} onChange={e => setForm({ ...form, target_url: e.target.value })} required placeholder="https://..." />
            <NeuInput label="Title (optional)" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <NeuInput label="Custom Slug (optional)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="leave blank for random" />
            <NeuButton variant="primary" type="submit">Create Short Link</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : links.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Link2 className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>No links yet.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {links.map((l, i) => (
            <motion.div key={l.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <ClayCard>
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{l.title || l.slug}</p>
                    <p className="text-xs text-[#6b5a4c] truncate">{l.target_url}</p>
                    <p className="text-xs text-[#f4a261] mt-0.5">{window.location.origin}/go/{l.slug}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-4">
                    <span className="text-xs text-[#6b5a4c]">{l.clicks} clicks</span>
                    <button onClick={() => copyLink(l.slug)} className="p-2 rounded-[10px] hover:bg-white/20"><Copy className="w-4 h-4" /></button>
                    <a href={`/go/${l.slug}`} target="_blank" className="p-2 rounded-[10px] hover:bg-white/20"><ExternalLink className="w-4 h-4" /></a>
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
