'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Shield, FileCheck, Copy, Check } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { useToast } from '@/components/ui/Toast'

const policyLabels: Record<string, string> = {
  privacy_policy: 'Privacy Policy',
  refund_policy: 'Refund Policy',
  terms_of_service: 'Terms of Service',
  shipping_policy: 'Shipping Policy',
}

export default function PolicyGeneratorPage() {
  const { showToast } = useToast()
  const [genForm, setGenForm] = useState({ business_name: '', email: '', product_type: 'digital product' })
  const [selected, setSelected] = useState<string | null>(null)
  const [generated, setGenerated] = useState<Record<string, string>>({})
  const [generating, setGenerating] = useState(false)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleGenerate = async (type: string) => {
    setSelected(type)
    setGenerating(true)
    const res = await fetch('/api/shop/policies/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...genForm }),
    })
    const data = await res.json()
    setGenerating(false)
    if (data[type]) {
      setGenerated(prev => ({ ...prev, [type]: data[type] }))
      showToast(`${policyLabels[type] || type} generated!`, 'success')
    }
  }

  const handleGenerateAll = async () => {
    setGenerating(true)
    const res = await fetch('/api/shop/policies/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'all', ...genForm }),
    })
    const data = await res.json()
    setGenerating(false)
    setGenerated(prev => ({ ...prev, ...data }))
    showToast('All policies generated!', 'success')
  }

  const copyToClipboard = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
    showToast('Copied!', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-6 h-6 text-[#f4a261]" />
        <h2 className="text-2xl font-bold">Policy Generator</h2>
      </div>

      <GlassCard className="p-6 mb-6">
        <h3 className="font-semibold mb-3">Business Information</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <NeuInput label="Business Name" value={genForm.business_name} onChange={e => setGenForm({ ...genForm, business_name: e.target.value })} placeholder="My Store" />
          <NeuInput label="Email" type="email" value={genForm.email} onChange={e => setGenForm({ ...genForm, email: e.target.value })} placeholder="support@example.com" />
          <NeuInput label="Product Type" value={genForm.product_type} onChange={e => setGenForm({ ...genForm, product_type: e.target.value })} placeholder="digital product" />
        </div>
        <div className="flex gap-2 mt-4">
          <NeuButton variant="primary" onClick={handleGenerateAll} loading={generating}>
            <FileCheck className="w-4 h-4" /> Generate All
          </NeuButton>
        </div>
      </GlassCard>

      <div className="grid gap-3 mb-6">
        {Object.entries(policyLabels).map(([type, label], i) => {
          const isGenerated = !!generated[type]
          return (
            <motion.div
              key={type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <GlassCard className={`p-4 cursor-pointer transition-all duration-200 ${isGenerated ? 'border-[#f4a261]/40' : ''}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Shield className={`w-4 h-4 ${isGenerated ? 'text-emerald-500' : 'text-[#9c8a7a]'}`} />
                    <span className="font-semibold text-sm">{label}</span>
                    {isGenerated && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400">Ready</span>}
                  </div>
                  <div className="flex gap-1">
                    {isGenerated && (
                      <button
                        onClick={() => copyToClipboard(generated[type], type)}
                        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
                        title="Copy"
                      >
                        {copiedKey === type ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-[#9c8a7a]" />}
                      </button>
                    )}
                    <button
                      onClick={() => handleGenerate(type)}
                      disabled={generating}
                      className="text-xs text-[#f4a261] hover:underline disabled:opacity-50"
                    >
                      {generating && selected === type ? '...' : 'Generate'}
                    </button>
                  </div>
                </div>
                {isGenerated && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                  >
                    <textarea
                      readOnly
                      value={generated[type]}
                      className="w-full p-3 rounded-[12px] bg-[#ece7e1] dark:bg-[#2a2522] outline-none text-xs min-h-[100px] resize-none"
                    />
                  </motion.div>
                )}
              </GlassCard>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
