'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuButton } from '@/components/ui/NeuButton'
import { CardSkeleton } from '@/components/ui/LoadingSkeleton'
import { useToast } from '@/components/ui/Toast'
import { User, Calendar, Shield, Key } from 'lucide-react'

export default function Profile() {
  const [session, setSession] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        setSession(data)
        setUser(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">Profile</h2><CardSkeleton /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ClayCard>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[20px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white text-2xl font-bold">
              {session?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-xl font-bold">{session?.username || 'User'}</h3>
              <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] capitalize">{session?.role || 'user'}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10">
              <User className="w-4 h-4 text-[#f4a261]" />
              <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">Username:</span>
              <span className="text-sm font-semibold ml-auto">{session?.username}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10">
              <Shield className="w-4 h-4 text-[#f4a261]" />
              <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">Role:</span>
              <span className="text-sm font-semibold ml-auto capitalize">{session?.role}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10">
              <Calendar className="w-4 h-4 text-[#f4a261]" />
              <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">User ID:</span>
              <span className="text-sm font-semibold ml-auto">#{session?.id}</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-[14px] bg-white/10">
              <Key className="w-4 h-4 text-[#f4a261]" />
              <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">Session:</span>
              <span className="text-sm font-semibold ml-auto text-emerald-500">Active</span>
            </div>
          </div>
        </ClayCard>

        <ClayCard>
          <h3 className="font-bold text-lg mb-5">Account Settings</h3>
          <form className="flex flex-col gap-4" onSubmit={e => { e.preventDefault(); showToast('Profile updated!', 'success') }}>
            <NeuInput label="Username" defaultValue={session?.username} />
            <NeuInput label="Email" placeholder="your@email.com" type="email" />
            <NeuInput label="New Password" placeholder="Leave blank to keep current" type="password" />
            <NeuButton variant="primary" type="submit">Update Profile</NeuButton>
          </form>
        </ClayCard>
      </div>
    </motion.div>
  )
}
