'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'
import { useThemeContext } from '@/components/layout/ThemeProvider'
import { Palette, Sun, Moon, Bell, Globe, Eye, CreditCard, Shield } from 'lucide-react'

export default function UserSettings() {
  const { theme, setTheme, accent, setAccent } = useThemeContext()
  const { showToast } = useToast()
  const [razorpayKeyId, setRazorpayKeyId] = useState('')
  const [razorpaySecret, setRazorpaySecret] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.json())
      .then(settings => {
        const map = Object.fromEntries(settings.map((s: any) => [s.key, s.value]))
        setRazorpayKeyId(map.razorpay_key_id || '')
        setRazorpaySecret(map.razorpay_key_secret || '')
        setLoaded(true)
      })
  }, [])

  const saveRazorpay = async () => {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([
        { key: 'razorpay_key_id', value: razorpayKeyId },
        { key: 'razorpay_key_secret', value: razorpaySecret },
      ]),
    })
    setSaving(false)
    showToast('Payment settings saved!', 'success')
  }

  const accentColors = ['#f4a261', '#e8a87c', '#7cb86c', '#6cb8c4', '#c46cb8', '#6c7cc4']

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard>
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#f4a261]" /> Appearance
          </h3>
          <div className="mb-6">
            <label className="block text-sm font-semibold mb-3 text-[#6b5a4c] dark:text-[#9c8a7a]">Theme</label>
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
                <button key={c} onClick={() => setAccent(c)} className={`w-9 h-9 rounded-full transition-all ${accent === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-110' : ''}`} style={{ backgroundColor: c }} />
              ))}
            </div>
          </div>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#f4a261]" /> Preferences
          </h3>
          <div className="space-y-4">
            {[
              { icon: Bell, label: 'Email Notifications', desc: 'Get notified when orders are completed' },
              { icon: Globe, label: 'Language', desc: 'English (default)' },
              { icon: Eye, label: 'Show Order Details', desc: 'Display detailed order information' },
            ].map((s, i) => {
              const Icon = s.icon
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-[14px] bg-white/10">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-[#f4a261]" />
                    <div>
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{s.desc}</p>
                    </div>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-colors ${i === 0 ? 'bg-[#f4a261]' : 'bg-[#6b5a4c]/30'} relative cursor-pointer`}>
                    <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-all ${i === 0 ? 'left-[22px]' : 'left-0.5'}`} />
                  </div>
                </div>
              )
            })}
          </div>
          <div className="mt-6">
            <NeuButton variant="primary" onClick={() => showToast('Settings saved!', 'success')}>Save Preferences</NeuButton>
          </div>
        </ClayCard>

        <ClayCard className="lg:col-span-2">
          <h3 className="font-bold text-lg mb-5 flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-[#f4a261]" /> Payment Gateway — Razorpay
          </h3>
          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mb-4">
            Connect Razorpay to accept payments. Buyers pay via UPI, cards, or net banking. Amounts are credited directly to your linked Razorpay account.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <NeuInput label="Razorpay Key ID" value={razorpayKeyId} onChange={e => setRazorpayKeyId(e.target.value)} placeholder="rzp_live_xxxxxxxx" />
            <NeuInput label="Razorpay Key Secret" type="password" value={razorpaySecret} onChange={e => setRazorpaySecret(e.target.value)} placeholder="xxxxxxxxxxxx" />
          </div>
          <div className="flex items-center gap-2 text-xs text-[#9c8a7a] mb-4">
            <Shield className="w-3.5 h-3.5" /> Get your keys from{' '}
            <a href="https://dashboard.razorpay.com" target="_blank" rel="noopener noreferrer" className="text-[#f4a261] hover:underline">Razorpay Dashboard</a>
          </div>
          <NeuButton variant="primary" onClick={saveRazorpay} loading={saving}>
            <CreditCard className="w-4 h-4" /> Save Payment Settings
          </NeuButton>
        </ClayCard>
      </div>
    </motion.div>
  )
}
