'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'
import { Instagram, Plus, ExternalLink } from 'lucide-react'
import Link from 'next/link'

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ ig_user_id: '', ig_username: '', ig_business_id: '', access_token: '', token_expires_at: '', avatar_url: '', follower_count: '0' })
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/ig/connect').then(r => r.json()).then(a => { setAccounts(a); setLoading(false) })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/ig/connect', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, follower_count: Number(form.follower_count) }),
    })
    if (res.ok) { showToast('Account connected!', 'success'); setShowForm(false); location.reload() }
    else showToast('Failed to connect account', 'error')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Instagram className="w-6 h-6 text-[#f4a261]" /> Connected Accounts</h2>
        <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> Connect Account</NeuButton>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-4">
            Enter your Instagram Business/Creator account details obtained via Facebook Graph API OAuth flow.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <NeuInput label="IG User ID" value={form.ig_user_id} onChange={e => setForm({ ...form, ig_user_id: e.target.value })} required />
            <NeuInput label="IG Username" value={form.ig_username} onChange={e => setForm({ ...form, ig_username: e.target.value })} required />
            <NeuInput label="IG Business ID (optional)" value={form.ig_business_id} onChange={e => setForm({ ...form, ig_business_id: e.target.value })} />
            <div>
              <label className="text-sm font-medium mb-1 block">Access Token</label>
              <textarea value={form.access_token} onChange={e => setForm({ ...form, access_token: e.target.value })} required className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[60px]" />
            </div>
            <NeuInput label="Token Expires At" type="datetime-local" value={form.token_expires_at} onChange={e => setForm({ ...form, token_expires_at: e.target.value })} />
            <NeuInput label="Avatar URL" type="url" value={form.avatar_url} onChange={e => setForm({ ...form, avatar_url: e.target.value })} />
            <NeuInput label="Follower Count" type="number" value={form.follower_count} onChange={e => setForm({ ...form, follower_count: e.target.value })} />
            <NeuButton variant="primary" type="submit">Connect Account</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : accounts.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Instagram className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p className="mb-4">No Instagram accounts connected.</p>
          <NeuButton variant="primary" onClick={() => setShowForm(true)}>Connect Account</NeuButton>
        </ClayCard>
      ) : (
        <div className="grid gap-4">
          {accounts.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold text-lg">
                    {a.ig_username?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold">@{a.ig_username}</h3>
                    <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">ID: {a.ig_user_id} · {a.follower_count?.toLocaleString() || 0} followers</p>
                    {a.ig_business_id && <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Business ID: {a.ig_business_id}</p>}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${a.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>{a.status}</span>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
