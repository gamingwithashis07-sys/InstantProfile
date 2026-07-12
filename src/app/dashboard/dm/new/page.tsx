'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import { Send } from 'lucide-react'

export default function NewCampaignPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [accounts, setAccounts] = useState<any[]>([])
  const [form, setForm] = useState({ ig_account_id: '', name: '', message_template: '', trigger_type: 'manual', delay_minutes: '0' })

  useEffect(() => {
    fetch('/api/ig/connect').then(r => r.json()).then(setAccounts)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/dm/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ig_account_id: Number(form.ig_account_id), delay_minutes: Number(form.delay_minutes) }),
    })
    if (res.ok) {
      showToast('Campaign created!', 'success')
      router.push('/dashboard/dm')
    } else {
      showToast('Failed to create campaign', 'error')
    }
  }

  return (
    <ClayCard>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Send className="w-5 h-5 text-[#f4a261]" /> New DM Campaign</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <NeuSelect label="Instagram Account" options={[
          { value: '', label: 'Select account...' },
          ...accounts.map(a => ({ value: String(a.id), label: `@${a.ig_username}` })),
        ]} value={form.ig_account_id} onChange={e => setForm({ ...form, ig_account_id: e.target.value })} required />
        <NeuInput label="Campaign Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        <div>
          <label className="text-sm font-medium mb-1 block">Message Template</label>
          <textarea
            value={form.message_template}
            onChange={e => setForm({ ...form, message_template: e.target.value })}
            required
            className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[100px]"
            placeholder="Hi {{username}}, check out our latest post!"
          />
        </div>
        <NeuSelect label="Trigger Type" options={[
          { value: 'manual', label: 'Manual' },
          { value: 'new_follower', label: 'New Follower' },
          { value: 'like', label: 'New Like' },
          { value: 'comment', label: 'New Comment' },
        ]} value={form.trigger_type} onChange={e => setForm({ ...form, trigger_type: e.target.value })} />
        <NeuInput label="Delay (minutes)" type="number" value={form.delay_minutes} onChange={e => setForm({ ...form, delay_minutes: e.target.value })} />
        <NeuButton variant="primary" type="submit">Create Campaign</NeuButton>
      </form>
    </ClayCard>
  )
}
