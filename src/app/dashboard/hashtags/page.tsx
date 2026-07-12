'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import { Hash, Plus } from 'lucide-react'

export default function HashtagsPage() {
  const [groups, setGroups] = useState<any[]>([])
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ig_account_id: '', name: '', hashtags: '' })
  const { showToast } = useToast()

  useEffect(() => {
    Promise.all([fetch('/api/hashtags').then(r => r.json()), fetch('/api/ig/connect').then(r => r.json())])
      .then(([g, a]) => { setGroups(g); setAccounts(a); setLoading(false) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/hashtags', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ig_account_id: Number(form.ig_account_id) }),
    })
    if (res.ok) { showToast('Hashtag group created!', 'success'); setShowForm(false); location.reload() }
    else showToast('Failed', 'error')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Hash className="w-6 h-6 text-[#f4a261]" /> Hashtag Groups</h2>
        <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New Group</NeuButton>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <NeuSelect label="Account" options={[
              { value: '', label: 'Select...' },
              ...accounts.map(a => ({ value: String(a.id), label: `@${a.ig_username}` })),
              ]} value={form.ig_account_id} onChange={e => setForm({ ...form, ig_account_id: e.target.value })} required />
            <NeuInput label="Group Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            <div>
              <label className="text-sm font-medium mb-1 block">Hashtags (comma separated)</label>
              <textarea value={form.hashtags} onChange={e => setForm({ ...form, hashtags: e.target.value })} required className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[80px]" placeholder="marketing, socialmedia, growth" />
            </div>
            <NeuButton variant="primary" type="submit">Create Group</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : groups.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Hash className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>No hashtag groups yet.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-4">
          {groups.map(g => (
            <ClayCard key={g.id}>
              <h3 className="font-bold">{g.name}</h3>
              <p className="text-xs text-[#6b5a4c]">@{g.ig_username}</p>
              <div className="flex flex-wrap gap-1 mt-2">
                {g.hashtags.split(',').map((t: string, i: number) => (
                  <span key={i} className="px-2 py-0.5 rounded-full bg-[#f4a261]/20 text-[#f4a261] text-xs">#{t.trim()}</span>
                ))}
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </motion.div>
  )
}
