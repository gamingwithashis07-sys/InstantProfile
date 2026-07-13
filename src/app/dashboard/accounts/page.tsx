'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/Toast'
import { Instagram, ExternalLink, RefreshCw } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

function AccountsContent() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const searchParams = useSearchParams()

  useEffect(() => {
    const success = searchParams.get('success')
    const error = searchParams.get('error')
    if (success === 'connected') showToast('Instagram account connected!', 'success')
    else if (error === 'instagram_denied') showToast('Authorization cancelled', 'error')
    else if (error === 'no_instagram_business') showToast('No Instagram Business account found on your Facebook Page', 'error')
    else if (error === 'fb_not_configured') showToast('Facebook App not configured by admin', 'error')
    else if (error) showToast('Failed to connect: ' + error, 'error')
  }, [])

  useEffect(() => {
    fetch('/api/ig/connect').then(r => r.json()).then(a => { setAccounts(a); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Instagram className="w-6 h-6 text-[#f4a261]" /> Connected Accounts</h2>
        <a href="/api/ig/auth">
          <NeuButton variant="primary" size="sm"><Instagram className="w-4 h-4" /> Connect with Instagram</NeuButton>
        </a>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin text-[#f4a261]" />
        </div>
      ) : accounts.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Instagram className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p className="mb-2 font-semibold">No Instagram accounts connected</p>
          <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-4">
            Click the button above to connect your Instagram Business or Creator account via Facebook OAuth.
          </p>
        </ClayCard>
      ) : (
        <div className="grid gap-4">
          {accounts.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <ClayCard>
                <div className="flex items-center gap-4">
                  {a.avatarUrl ? (
                    <img src={a.avatarUrl} alt={a.igUsername} className="w-12 h-12 rounded-[14px] object-cover" />
                  ) : (
                    <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white font-bold text-lg">
                      {a.igUsername?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold">@{a.igUsername}</h3>
                    <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">
                      {a.followerCount?.toLocaleString() || 0} followers
                    </p>
                    {a.igBusinessId && (
                      <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">Page: {a.igBusinessId}</p>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${a.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                    {a.status}
                  </span>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}

export default function AccountsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-[#f4a261]" /></div>}>
      <AccountsContent />
    </Suspense>
  )
}
