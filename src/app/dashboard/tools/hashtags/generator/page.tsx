'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { useToast } from '@/components/ui/Toast'
import { Hash, Copy, Sparkles } from 'lucide-react'

export default function HashtagGeneratorPage() {
  const [hashtags, setHashtags] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('general')
  const { showToast } = useToast()

  const generate = async () => {
    setLoading(true)
    const r = await fetch(`/api/hashtags/generator?category=${category}&count=15`).then(r => r.json())
    setHashtags(r.hashtags || [])
    setLoading(false)
  }

  const copyAll = () => {
    navigator.clipboard.writeText(hashtags.map(h => `#${h}`).join(' '))
    showToast('Copied!', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Hash className="w-6 h-6 text-[#f4a261]" /> Hashtag Generator</h2>

      <ClayCard className="mb-6 max-w-lg">
        <div className="space-y-4">
          <NeuSelect label="Category" options={[
            { value: 'general', label: 'General' }, { value: 'business', label: 'Business' },
            { value: 'fashion', label: 'Fashion' }, { value: 'food', label: 'Food' },
            { value: 'travel', label: 'Travel' }, { value: 'fitness', label: 'Fitness' }, { value: 'tech', label: 'Tech' },
          ]} value={category} onChange={e => setCategory(e.target.value)} />
          <NeuButton variant="primary" onClick={generate} loading={loading}>
            <Sparkles className="w-4 h-4" /> Generate Hashtags
          </NeuButton>
        </div>
      </ClayCard>

      {hashtags.length > 0 && (
        <ClayCard>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Suggested Hashtags</h3>
            <NeuButton size="sm" onClick={copyAll}><Copy className="w-4 h-4" /> Copy All</NeuButton>
          </div>
          <div className="flex flex-wrap gap-2">
            {hashtags.map((h, i) => (
              <motion.span
                key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="px-3 py-1.5 rounded-full bg-[#f4a261]/20 text-[#f4a261] text-sm font-medium cursor-pointer hover:bg-[#f4a261]/30"
                onClick={() => { navigator.clipboard.writeText(`#${h}`); showToast(`#${h} copied!`, 'success') }}
              >
                #{h}
              </motion.span>
            ))}
          </div>
        </ClayCard>
      )}
    </motion.div>
  )
}
