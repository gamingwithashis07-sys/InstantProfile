'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'
import { QrCode, Plus, Download } from 'lucide-react'

export default function QRPage() {
  const [codes, setCodes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', target_url: '', bg_color: '#ffffff', fg_color: '#000000' })
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/qrcode').then(r => r.json()).then(d => { setCodes(d); setLoading(false) })
  }, [])

  const createQR = async (e: React.FormEvent) => {
    e.preventDefault()
    const r = await fetch('/api/qrcode', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    if (r.ok) { showToast('QR code created!', 'success'); setShowForm(false); location.reload() }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><QrCode className="w-6 h-6 text-[#f4a261]" /> QR Code Generator</h2>
        <NeuButton variant="primary" size="sm" onClick={() => setShowForm(!showForm)}><Plus className="w-4 h-4" /> New QR</NeuButton>
      </div>

      {showForm && (
        <ClayCard className="mb-6">
          <form onSubmit={createQR} className="space-y-4 max-w-lg">
            <NeuInput label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            <NeuInput label="Target URL" type="url" value={form.target_url} onChange={e => setForm({ ...form, target_url: e.target.value })} required />
            <div className="flex gap-4">
              <NeuInput label="BG Color" type="color" value={form.bg_color} onChange={e => setForm({ ...form, bg_color: e.target.value })} />
              <NeuInput label="FG Color" type="color" value={form.fg_color} onChange={e => setForm({ ...form, fg_color: e.target.value })} />
            </div>
            <NeuButton variant="primary" type="submit">Generate QR Code</NeuButton>
          </form>
        </ClayCard>
      )}

      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : codes.length === 0 ? (
        <ClayCard className="text-center py-12">
          <QrCode className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p>No QR codes yet.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {codes.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard className="text-center">
                <div className="w-32 h-32 mx-auto mb-3 bg-white rounded-[12px] flex items-center justify-center p-2">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(q.target_url)}&bgcolor=${q.bg_color.replace('#', '')}&color=${q.fg_color.replace('#', '')}`} alt="QR" className="w-full h-full" />
                </div>
                <h3 className="font-bold text-sm">{q.title}</h3>
                <p className="text-xs text-[#6b5a4c] truncate mt-1">{q.target_url}</p>
                <p className="text-xs text-[#6b5a4c]">{q.downloads} downloads</p>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
