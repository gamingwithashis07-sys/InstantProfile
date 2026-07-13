'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/Toast'
import { Crown, Check, ArrowLeft } from 'lucide-react'

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

export default function UpgradePage() {
  const router = useRouter()
  const { showToast } = useToast()
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
      showToast(`Upgraded to ${plan === 'pro' ? 'Pro' : 'Starter'}!`, 'success')
      router.push('/dashboard')
      router.refresh()
    } else {
      showToast('Upgrade failed', 'error')
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] mb-4">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <div className="text-center mb-8">
        <Crown className="w-12 h-12 mx-auto mb-3 text-[#f4a261]" />
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-[#6b5a4c] dark:text-[#9c8a7a] mt-2">Pick the plan that fits your needs</p>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
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
    </motion.div>
  )
}
