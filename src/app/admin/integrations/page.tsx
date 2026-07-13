'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { ClayCard } from '@/components/ui/ClayCard'
import { useToast } from '@/components/ui/Toast'
import {
  Key, CreditCard, Mail, Shield, Bot, Eye, EyeOff, Plus, Trash2,
  Facebook, Lock, CheckCircle, AlertTriangle
} from 'lucide-react'

interface CustomKey {
  id: string
  key_name: string
  key_value: string
}

const sections = [
  { id: 'facebook', label: 'Facebook / Instagram Graph API', icon: Facebook, color: '#1877F2' },
  { id: 'razorpay', label: 'Razorpay Payment Gateway', icon: CreditCard, color: '#f4a261' },
  { id: 'smtp', label: 'SMTP / Email', icon: Mail, color: '#7cb86c' },
  { id: 'recaptcha', label: 'Google reCAPTCHA', icon: Shield, color: '#6cb8c4' },
  { id: 'openai', label: 'OpenAI / AI', icon: Bot, color: '#c46cb8' },
  { id: 'auth', label: 'Authentication', icon: Lock, color: '#e8c36c' },
]

export default function AdminIntegrations() {
  const { showToast } = useToast()

  // ── Form states ──
  const [fb, setFb] = useState({ fb_app_id: '', fb_app_secret: '', graph_api_version: 'v21.0', site_url: '' })
  const [rzp, setRzp] = useState({ razorpay_key_id: '', razorpay_key_secret: '' })
  const [smtp, setSmtp] = useState({ smtp_host: '', smtp_port: '587', smtp_user: '', smtp_pass: '', smtp_from: '' })
  const [recaptcha, setRecaptcha] = useState({ recaptcha_site_key: '', recaptcha_secret_key: '' })
  const [openai, setOpenai] = useState({ openai_api_key: '' })
  const [auth, setAuth] = useState({ jwt_secret: '', admin_secret_code: '' })
  const [customKeys, setCustomKeys] = useState<CustomKey[]>([])
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({})
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(data => {
      if (!data) return
      setFb({ fb_app_id: data.fb_app_id || '', fb_app_secret: data.fb_app_secret || '', graph_api_version: data.graph_api_version || 'v21.0', site_url: data.site_url || '' })
      setRzp({ razorpay_key_id: data.razorpay_key_id || '', razorpay_key_secret: data.razorpay_key_secret || '' })
      setSmtp({ smtp_host: data.smtp_host || '', smtp_port: data.smtp_port || '587', smtp_user: data.smtp_user || '', smtp_pass: data.smtp_pass || '', smtp_from: data.smtp_from || '' })
      setRecaptcha({ recaptcha_site_key: data.recaptcha_site_key || '', recaptcha_secret_key: data.recaptcha_secret_key || '' })
      setOpenai({ openai_api_key: data.openai_api_key || '' })
      setAuth({ jwt_secret: data.jwt_secret || '', admin_secret_code: data.admin_secret_code || '' })

      const custom: CustomKey[] = []
      for (const [k, v] of Object.entries(data)) {
        if (k.startsWith('custom_')) custom.push({ id: k, key_name: k.replace('custom_', ''), key_value: v as string })
      }
      setCustomKeys(custom)
    }).catch(() => {})
  }, [])

  const toggleSecret = (field: string) => {
    setShowSecrets(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const saveSection = async (sectionId: string, payload: Record<string, string>) => {
    setSaving(sectionId)
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(null)
    showToast(`${sections.find(s => s.id === sectionId)?.label || sectionId} saved!`, 'success')
  }

  const addCustomKey = () => {
    setCustomKeys(prev => [...prev, { id: `new_${Date.now()}`, key_name: '', key_value: '' }])
  }

  const updateCustomKey = (id: string, field: 'key_name' | 'key_value', value: string) => {
    setCustomKeys(prev => prev.map(k => k.id === id ? { ...k, [field]: value } : k))
  }

  const removeCustomKey = (id: string) => {
    setCustomKeys(prev => prev.filter(k => k.id !== id))
  }

  const saveCustomKeys = async () => {
    const payload: Record<string, string> = {}
    customKeys.forEach(k => {
      if (k.key_name.trim()) payload[`custom_${k.key_name.trim()}`] = k.key_value
    })
    setSaving('custom')
    await fetch('/api/admin/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    setSaving(null)
    showToast('Custom API keys saved!', 'success')
  }

  const sectionIcons: Record<string, any> = {
    facebook: Facebook,
    razorpay: CreditCard,
    smtp: Mail,
    recaptcha: Shield,
    openai: Bot,
    auth: Lock,
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <Key className="w-6 h-6 text-[#f4a261]" />
        <h2 className="text-2xl font-bold">API Integrations</h2>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Facebook / Instagram */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[#1877F2]/20 flex items-center justify-center">
              <Facebook className="w-5 h-5 text-[#1877F2]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Facebook / Instagram Graph API</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Required for Instagram automation features</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <NeuInput label="App ID" value={fb.fb_app_id} onChange={e => setFb({ ...fb, fb_app_id: e.target.value })} placeholder="123456789" />
            <div className="relative">
              <NeuInput label="App Secret" type={showSecrets.fb_app_secret ? 'text' : 'password'} value={fb.fb_app_secret} onChange={e => setFb({ ...fb, fb_app_secret: e.target.value })} placeholder="••••••••" />
              <button type="button" onClick={() => toggleSecret('fb_app_secret')} className="absolute right-3 top-[34px] text-[#9c8a7a] hover:text-white">
                {showSecrets.fb_app_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <NeuInput label="Graph API Version" value={fb.graph_api_version} onChange={e => setFb({ ...fb, graph_api_version: e.target.value })} placeholder="v21.0" />
            <NeuInput label="Site URL" value={fb.site_url} onChange={e => setFb({ ...fb, site_url: e.target.value })} placeholder="https://example.com" />
          </div>
          <p className="text-xs text-[#9c8a7a] mb-3">Site URL is used for OAuth redirect URIs (e.g. https://your-app.vercel.app)</p>
          <NeuButton variant="primary" onClick={() => saveSection('facebook', fb)} loading={saving === 'facebook'}><CheckCircle className="w-4 h-4" /> Save Facebook Settings</NeuButton>
        </ClayCard>

        {/* Razorpay */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[#f4a261]/20 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-[#f4a261]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Razorpay Payment Gateway</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Accept payments for digital products</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <NeuInput label="Key ID" value={rzp.razorpay_key_id} onChange={e => setRzp({ ...rzp, razorpay_key_id: e.target.value })} placeholder="rzp_live_xxxxxxxx" />
            <div className="relative">
              <NeuInput label="Key Secret" type={showSecrets.razorpay_key_secret ? 'text' : 'password'} value={rzp.razorpay_key_secret} onChange={e => setRzp({ ...rzp, razorpay_key_secret: e.target.value })} placeholder="••••••••" />
              <button type="button" onClick={() => toggleSecret('razorpay_key_secret')} className="absolute right-3 top-[34px] text-[#9c8a7a] hover:text-white">
                {showSecrets.razorpay_key_secret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <NeuButton variant="primary" onClick={() => saveSection('razorpay', rzp)} loading={saving === 'razorpay'}><CheckCircle className="w-4 h-4" /> Save Razorpay Settings</NeuButton>
        </ClayCard>

        {/* SMTP / Email */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[#7cb86c]/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-[#7cb86c]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">SMTP / Email</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Send transactional emails and notifications</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <NeuInput label="SMTP Host" value={smtp.smtp_host} onChange={e => setSmtp({ ...smtp, smtp_host: e.target.value })} placeholder="smtp.gmail.com" />
            <NeuInput label="SMTP Port" value={smtp.smtp_port} onChange={e => setSmtp({ ...smtp, smtp_port: e.target.value })} placeholder="587" />
            <NeuInput label="SMTP Username" value={smtp.smtp_user} onChange={e => setSmtp({ ...smtp, smtp_user: e.target.value })} placeholder="user@gmail.com" />
            <div className="relative">
              <NeuInput label="SMTP Password" type={showSecrets.smtp_pass ? 'text' : 'password'} value={smtp.smtp_pass} onChange={e => setSmtp({ ...smtp, smtp_pass: e.target.value })} placeholder="••••••••" />
              <button type="button" onClick={() => toggleSecret('smtp_pass')} className="absolute right-3 top-[34px] text-[#9c8a7a] hover:text-white">
                {showSecrets.smtp_pass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <NeuInput label="From Email" value={smtp.smtp_from} onChange={e => setSmtp({ ...smtp, smtp_from: e.target.value })} placeholder="noreply@example.com" />
          </div>
          <NeuButton variant="primary" onClick={() => saveSection('smtp', smtp)} loading={saving === 'smtp'}><CheckCircle className="w-4 h-4" /> Save SMTP Settings</NeuButton>
        </ClayCard>

        {/* Google reCAPTCHA */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[#6cb8c4]/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#6cb8c4]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Google reCAPTCHA</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Protect forms from spam and abuse</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <NeuInput label="Site Key" value={recaptcha.recaptcha_site_key} onChange={e => setRecaptcha({ ...recaptcha, recaptcha_site_key: e.target.value })} placeholder="6Lexxxxxxxxxxxxxxxxxxxx" />
            <div className="relative">
              <NeuInput label="Secret Key" type={showSecrets.recaptcha_secret_key ? 'text' : 'password'} value={recaptcha.recaptcha_secret_key} onChange={e => setRecaptcha({ ...recaptcha, recaptcha_secret_key: e.target.value })} placeholder="••••••••" />
              <button type="button" onClick={() => toggleSecret('recaptcha_secret_key')} className="absolute right-3 top-[34px] text-[#9c8a7a] hover:text-white">
                {showSecrets.recaptcha_secret_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <NeuButton variant="primary" onClick={() => saveSection('recaptcha', recaptcha)} loading={saving === 'recaptcha'}><CheckCircle className="w-4 h-4" /> Save reCAPTCHA Settings</NeuButton>
        </ClayCard>

        {/* OpenAI / AI */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[#c46cb8]/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-[#c46cb8]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">OpenAI / AI</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Power AI content generation features</p>
            </div>
          </div>
          <div className="grid sm:grid-cols-1 max-w-md gap-4 mb-4">
            <div className="relative">
              <NeuInput label="OpenAI API Key" type={showSecrets.openai_api_key ? 'text' : 'password'} value={openai.openai_api_key} onChange={e => setOpenai({ ...openai, openai_api_key: e.target.value })} placeholder="sk-xxxxxxxxxxxxxxxx" />
              <button type="button" onClick={() => toggleSecret('openai_api_key')} className="absolute right-3 top-[34px] text-[#9c8a7a] hover:text-white">
                {showSecrets.openai_api_key ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <NeuButton variant="primary" onClick={() => saveSection('openai', openai)} loading={saving === 'openai'}><CheckCircle className="w-4 h-4" /> Save OpenAI Settings</NeuButton>
        </ClayCard>

        {/* Admin User */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-[#e8c36c]/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-[#e8c36c]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Admin Access</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Authentication is handled by Clerk</p>
            </div>
          </div>
          <div className="bg-[#e8c36c]/10 border border-[#e8c36c]/20 rounded-[14px] p-4 mb-4">
            <p className="text-sm font-medium mb-2">How to set an admin user:</p>
            <ol className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://dashboard.clerk.com" target="_blank" rel="noopener noreferrer" className="text-[#f4a261] hover:underline">Clerk Dashboard</a></li>
              <li>Find the user you want to make admin</li>
              <li>Click on the user → <strong>Edit</strong></li>
              <li>Under <strong>Public metadata</strong>, add: <code className="bg-black/20 px-1.5 py-0.5 rounded text-xs">{'{ "role": "admin" }'}</code></li>
              <li>Save — the user can now access /admin</li>
            </ol>
          </div>
        </ClayCard>

        {/* Custom API Keys */}
        <ClayCard>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#f4a261]/20 to-[#e07c3c]/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-[#f4a261]" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Custom API Integrations</h3>
              <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Add any custom API keys your integrations need</p>
            </div>
          </div>

          {customKeys.length === 0 ? (
            <p className="text-sm text-[#9c8a7a] mb-4">No custom API keys configured yet.</p>
          ) : (
            <div className="space-y-3 mb-4">
              {customKeys.map((ck) => (
                <div key={ck.id} className="flex items-end gap-3">
                  <div className="flex-1">
                    <NeuInput
                      label="Key Name"
                      value={ck.key_name}
                      onChange={e => updateCustomKey(ck.id, 'key_name', e.target.value)}
                      placeholder="e.g. stripe_secret_key"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <NeuInput
                      label="Value"
                      type={showSecrets[ck.id] ? 'text' : 'password'}
                      value={ck.key_value}
                      onChange={e => updateCustomKey(ck.id, 'key_value', e.target.value)}
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => toggleSecret(ck.id)} className="absolute right-3 top-[34px] text-[#9c8a7a] hover:text-white">
                      {showSecrets[ck.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button onClick={() => removeCustomKey(ck.id)} className="p-2.5 mb-1 rounded-[10px] bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3">
            <NeuButton variant="ghost" onClick={addCustomKey}>
              <Plus className="w-4 h-4" /> Add Custom Key
            </NeuButton>
            {customKeys.length > 0 && (
              <NeuButton variant="primary" onClick={saveCustomKeys} loading={saving === 'custom'}>
                <CheckCircle className="w-4 h-4" /> Save Custom Keys
              </NeuButton>
            )}
          </div>
        </ClayCard>
      </div>
    </motion.div>
  )
}
