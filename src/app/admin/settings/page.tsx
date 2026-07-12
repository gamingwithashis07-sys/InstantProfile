'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { ClayCard } from '@/components/ui/ClayCard'
import { useToast } from '@/components/ui/Toast'
import { Settings, Palette, Sun, Moon, CreditCard, Shield, DollarSign } from 'lucide-react'
import { useThemeContext } from '@/components/layout/ThemeProvider'

export default function SettingsPage() {
  const [form, setForm] = useState({ site_name: '', site_description: '', default_price: '' })
  const [razorpayForm, setRazorpayForm] = useState({ razorpay_key_id: '', razorpay_key_secret: '' })
  const [saving, setSaving] = useState(false)
  const [razorpaySaving, setRazorpaySaving] = useState(false)
  const { showToast } = useToast()
  const { theme, setTheme, accent, setAccent } = useThemeContext()

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => {
      if (data) {
        setForm({ site_name: data.site_name || '', site_description: data.site_description || '', default_price: data.default_price || '' })
        setRazorpayForm({ razorpay_key_id: data.razorpay_key_id || '', razorpay_key_secret: data.razorpay_key_secret || '' })
      }
    }).catch(() => {})
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    showToast('Settings saved!', 'success')
    setSaving(false)
  }

  const saveRazorpay = async () => {
    setRazorpaySaving(true)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(razorpayForm),
    })
    setRazorpaySaving(false)
    showToast('Payment settings saved!', 'success')
  }

  const accentColors = ['#f4a261', '#e8a87c', '#7cb86c', '#6cb8c4', '#c46cb8', '#6c7cc4']

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard>
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#f4a261]" /> Site Settings
          </h3>
          <form onSubmit={handleSave} className="flex flex-col gap-4">
            <NeuInput label="Site Name" value={form.site_name} onChange={e => setForm({ ...form, site_name: e.target.value })} required />
            <NeuInput label="Site Description" value={form.site_description} onChange={e => setForm({ ...form, site_description: e.target.value })} required />
            <NeuInput label="Default Price (USD)" value={form.default_price} onChange={e => setForm({ ...form, default_price: e.target.value })} required />
            <NeuButton variant="primary" type="submit" loading={saving}>Save Settings</NeuButton>
          </form>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#f4a261]" /> Theme Customizer
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-[#6b5a4c] dark:text-[#9c8a7a]">Theme Mode</label>
            <div className="flex gap-3">
              <button onClick={() => setTheme('dark')} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[14px] transition-all ${theme === 'dark' ? 'bg-[#2d1f14] text-[#e8d5c4] shadow-neu-sm' : 'bg-[#e8d5c4] text-[#6b5a4c]'}`}>
                <Moon className="w-4 h-4" /> Dark
              </button>
              <button onClick={() => setTheme('light')} className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-[14px] transition-all ${theme === 'light' ? 'bg-[#2d1f14] text-[#e8d5c4] shadow-neu-sm' : 'bg-[#e8d5c4] text-[#6b5a4c]'}`}>
                <Sun className="w-4 h-4" /> Light
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-3 text-[#6b5a4c] dark:text-[#9c8a7a]">Accent Color</label>
            <div className="flex gap-3 flex-wrap">
              {accentColors.map(c => (
                <button key={c} onClick={() => setAccent(c)} className={`w-10 h-10 rounded-full transition-all ${accent === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-3">
              <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">Custom:</span>
              <input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="w-10 h-10 rounded-full border-0 cursor-pointer" />
              <span className="text-xs font-mono text-[#6b5a4c] dark:text-[#9c8a7a]">{accent}</span>
            </div>
          </div>
        </ClayCard>

        <ClayCard className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#f4a261]" /> Payment Gateway — Razorpay
          </h3>
          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mb-4">
            Configure Razorpay to accept payments on the platform. When a buyer purchases a product, the amount is credited directly to the creator&apos;s balance via Razorpay.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <NeuInput label="Razorpay Key ID" value={razorpayForm.razorpay_key_id} onChange={e => setRazorpayForm({ ...razorpayForm, razorpay_key_id: e.target.value })} placeholder="rzp_live_xxxxxxxx" />
            <NeuInput label="Razorpay Key Secret" type="password" value={razorpayForm.razorpay_key_secret} onChange={e => setRazorpayForm({ ...razorpayForm, razorpay_key_secret: e.target.value })} placeholder="xxxxxxxxxxxx" />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9c8a7a] mb-4">
            <Shield className="w-3.5 h-3.5" /> Get your keys from{' '}
            <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer" className="text-[#f4a261] hover:underline">Razorpay Dashboard</a>
          </div>
          <NeuButton variant="primary" onClick={saveRazorpay} loading={razorpaySaving}>
            <DollarSign className="w-4 h-4" /> Save Payment Settings
          </NeuButton>
        </ClayCard>
      </div>
    </motion.div>
  )
}
