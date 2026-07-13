'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { Zap, Crown, X, Check } from 'lucide-react'

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: '₹149-199',
    features: ['1 Instagram account', '1,000 DMs/month (hard limit)', 'Basic keyword-trigger only (comment → DM)', 'Standard templates, no customization', 'Basic analytics (sent/failed count)'],
  },
  {
    id: 'pro',
    name: 'Pro (Unlimited)',
    price: '₹499-699',
    popular: true,
    features: ['1 Instagram account', 'Unlimited DMs (soft cap ~15-20k, fair-use)', 'AI smart replies + multi-step flows', 'Story-reply automation', 'Advanced analytics (funnel, conversion rate)', 'Priority support'],
  },
]

export default function UpgradePopup({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState<string | null>(null)

  const handleUpgrade = async (plan: string) => {
    setLoading(plan)
    const res = await fetch('/api/user/upgrade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    })
    setLoading(null)
    if (res.ok) {
      onClose()
      window.location.reload()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 50 }}
        className="relative w-full max-w-3xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
          <X className="w-5 h-5" />
        </button>
        <GlassCard className="p-8 md:p-10">
          <div className="text-center mb-8">
            <Crown className="w-12 h-12 mx-auto mb-3 text-[#f4a261]" />
            <h2 className="text-3xl font-bold">Upgrade Your Plan</h2>
            <p className="text-[#6b5a4c] dark:text-[#9c8a7a] mt-2">Unlock more features and higher DM limits</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {PLANS.map(plan => (
              <div key={plan.id} className={`relative rounded-[20px] p-6 ${plan.popular ? 'bg-[#f4a261]/10 border-2 border-[#f4a261]' : 'bg-white/5 border border-white/10'}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#f4a261] text-white text-xs font-bold rounded-full">
                    POPULAR
                  </div>
                )}
                <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                <p className="text-3xl font-black text-[#f4a261] mb-4">{plan.price}<span className="text-sm font-normal text-[#6b5a4c]">/month</span></p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                      <span className="text-[#6b5a4c] dark:text-[#9c8a7a]">{f}</span>
                    </li>
                  ))}
                </ul>
                <NeuButton
                  variant={plan.popular ? 'primary' : 'default'}
                  className="w-full"
                  onClick={() => handleUpgrade(plan.id)}
                  loading={loading === plan.id}
                >
                  {loading === plan.id ? 'Upgrading...' : `Upgrade to ${plan.name}`}
                </NeuButton>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-[#9c8a7a] mt-6">You can switch between plans anytime. Your current usage will be preserved.</p>
        </GlassCard>
      </motion.div>
    </motion.div>
  )
}
