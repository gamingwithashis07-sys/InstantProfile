'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { Eye, CheckCircle, XCircle } from 'lucide-react'

export default function PreviewPage() {
  const [caption, setCaption] = useState('')
  const [mentions, setMentions] = useState('')
  const [hashtags, setHashtags] = useState('')
  const [preview, setPreview] = useState<any>(null)

  const generatePreview = async () => {
    const r = await fetch('/api/posts/preview', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        caption,
        mentions: mentions.split(',').map(m => m.trim()).filter(Boolean),
        hashtags: hashtags.split(',').map(h => h.trim()).filter(Boolean),
      }),
    })
    setPreview(await r.json())
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><Eye className="w-6 h-6 text-[#f4a261]" /> Post Preview</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard>
          <div className="space-y-4">
            <div><label className="text-sm font-medium mb-1 block">Caption</label>
              <textarea value={caption} onChange={e => setCaption(e.target.value)} className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[120px]" /></div>
            <NeuInput label="Mentions (comma separated)" value={mentions} onChange={e => setMentions(e.target.value)} placeholder="user1, user2" />
            <NeuInput label="Hashtags (comma separated)" value={hashtags} onChange={e => setHashtags(e.target.value)} placeholder="explore, viral" />
            <NeuButton variant="primary" onClick={generatePreview}><Eye className="w-4 h-4" /> Preview</NeuButton>
          </div>
        </ClayCard>

        {preview && (
          <ClayCard>
            <h3 className="font-bold mb-3">Preview</h3>
            <div className="p-4 rounded-[14px] bg-white/10 whitespace-pre-wrap text-sm mb-4">{preview.preview || '(empty)'}</div>
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-[12px] bg-white/10">
                <div className="text-lg font-bold text-[#f4a261]">{preview.charCount}</div>
                <div className="text-xs text-[#6b5a4c]">Characters</div>
              </div>
              <div className="p-3 rounded-[12px] bg-white/10">
                <div className="text-lg font-bold text-[#7cb86c]">{preview.lineCount}</div>
                <div className="text-xs text-[#6b5a4c]">Lines</div>
              </div>
              <div className="col-span-2 p-3 rounded-[12px] bg-white/10">
                <div className="flex items-center justify-center gap-2">
                  {preview.fitsInCaption ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : <XCircle className="w-5 h-5 text-red-400" />}
                  <span className={`font-bold ${preview.fitsInCaption ? 'text-emerald-400' : 'text-red-400'}`}>
                    {preview.fitsInCaption ? 'Fits in caption' : 'Too long!'}
                  </span>
                </div>
              </div>
            </div>
          </ClayCard>
        )}
      </div>
    </motion.div>
  )
}
