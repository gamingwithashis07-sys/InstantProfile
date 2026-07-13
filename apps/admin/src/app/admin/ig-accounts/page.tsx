'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/Toast'
import { Instagram, Trash2, RefreshCw } from 'lucide-react'

export default function AdminIGAccounts() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const load = () => {
    setLoading(true)
    fetch('/api/admin/ig-accounts')
      .then(r => r.json())
      .then(a => { setAccounts(a); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [])

  const remove = async (id: number) => {
    const res = await fetch('/api/admin/ig-accounts', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    if (res.ok) { showToast('Account removed', 'success'); load() }
    else showToast('Failed to remove', 'error')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <Instagram className="w-6 h-6 text-[#f4a261]" />
        <h2 className="text-2xl font-bold">Instagram Accounts</h2>
        <NeuButton variant="ghost" size="sm" onClick={load}><RefreshCw className="w-4 h-4" /></NeuButton>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-[#f4a261]" /></div>
      ) : accounts.length === 0 ? (
        <ClayCard className="text-center py-12">
          <p className="text-[#9c8a7a]">No Instagram accounts connected</p>
        </ClayCard>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[#9c8a7a] border-b border-white/10">
                <th className="pb-3 font-semibold">Username</th>
                <th className="pb-3 font-semibold">User</th>
                <th className="pb-3 font-semibold">Followers</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map(a => (
                <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-3">@{a.igUsername}</td>
                  <td className="py-3 text-[#9c8a7a]">{a.user?.username || 'Unknown'}</td>
                  <td className="py-3">{a.followerCount?.toLocaleString() || 0}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs ${a.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <button onClick={() => remove(a.id)} className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
