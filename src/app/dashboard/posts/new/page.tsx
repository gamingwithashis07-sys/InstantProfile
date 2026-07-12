'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import { Camera } from 'lucide-react'

export default function NewPostPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [accounts, setAccounts] = useState<any[]>([])
  const [form, setForm] = useState({ ig_account_id: '', media_type: 'image', caption: '', media_url: '', scheduled_at: '' })

  useEffect(() => {
    fetch('/api/ig/connect').then(r => r.json()).then(setAccounts)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/posts', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ig_account_id: Number(form.ig_account_id) }),
    })
    if (res.ok) { showToast('Post scheduled!', 'success'); router.push('/dashboard/posts') }
    else showToast('Failed to schedule post', 'error')
  }

  return (
    <ClayCard>
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Camera className="w-5 h-5 text-[#f4a261]" /> Schedule Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
        <NeuSelect label="Instagram Account" options={[
          { value: '', label: 'Select...' },
          ...accounts.map(a => ({ value: String(a.id), label: `@${a.ig_username}` })),
        ]} value={form.ig_account_id} onChange={e => setForm({ ...form, ig_account_id: e.target.value })} required />
        <NeuSelect label="Media Type" options={[
          { value: 'image', label: 'Image' },
          { value: 'carousel', label: 'Carousel' },
          { value: 'reel', label: 'Reel' },
        ]} value={form.media_type} onChange={e => setForm({ ...form, media_type: e.target.value })} />
        <div>
          <label className="text-sm font-medium mb-1 block">Caption</label>
          <textarea value={form.caption} onChange={e => setForm({ ...form, caption: e.target.value })} className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[80px]" />
        </div>
        <NeuInput label="Media URL" type="url" value={form.media_url} onChange={e => setForm({ ...form, media_url: e.target.value })} required />
        <NeuInput label="Schedule Date/Time" type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} required />
        <NeuButton variant="primary" type="submit">Schedule Post</NeuButton>
      </form>
    </ClayCard>
  )
}
