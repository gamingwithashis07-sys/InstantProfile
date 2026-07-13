'use client'

import { ReactNode, useState, useEffect } from 'react'
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { usePathname, useRouter } from 'next/navigation'
import { UserSidebar } from '@/components/layout/UserSidebar'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import UpgradePopup from '@/components/UpgradePopup'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isRegister, setIsRegister] = useState(false)
  const [plan, setPlan] = useState<string | null>(null)
  const [hasIgAccount, setHasIgAccount] = useState<boolean | null>(null)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isSignedIn) return
    fetch('/api/user/plan').then(r => r.json()).then(d => {
      setPlan(d.plan)
      if (d.plan === 'starter') setShowUpgrade(true)
    })
    fetch('/api/ig/connect').then(r => r.json()).then(d => {
      setHasIgAccount(Array.isArray(d) && d.length > 0)
    })
  }, [isSignedIn])

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="w-full max-w-sm"
        >
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">👤</div>
              <h2 className="text-2xl font-bold">{isRegister ? 'Create Account' : 'User Login'}</h2>
              <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mt-2">
                {isRegister ? 'Register to access your dashboard' : 'Login to access your dashboard'}
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {isRegister ? (
                <SignUpButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="w-full py-3 px-6 rounded-[12px] bg-[#f4a261] text-white font-semibold hover:bg-[#e8913d] transition-all">
                    Register
                  </button>
                </SignUpButton>
              ) : (
                <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
                  <button className="w-full py-3 px-6 rounded-[12px] bg-[#f4a261] text-white font-semibold hover:bg-[#e8913d] transition-all">
                    Login
                  </button>
                </SignInButton>
              )}
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => setIsRegister(!isRegister)}
                className="text-sm text-[#f4a261] hover:underline"
              >
                {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
              </button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  const isIgRoute = pathname.startsWith('/dashboard/accounts')
  if (hasIgAccount === false && !isIgRoute && !pathname.startsWith('/dashboard/settings') && !pathname.startsWith('/dashboard/profile') && !pathname.startsWith('/dashboard/earnings')) {
    return (
      <div className="flex min-h-screen">
        <UserSidebar />
        <div className="flex-1 ml-[240px] p-6 md:p-8 flex items-center justify-center">
          <GlassCard className="p-10 max-w-lg text-center">
            <div className="text-6xl mb-4">📱</div>
            <h2 className="text-2xl font-bold mb-2">Connect Your Instagram Account</h2>
            <p className="text-[#6b5a4c] dark:text-[#9c8a7a] mb-6">You need to connect an Instagram Business or Creator account before using any tools.</p>
            <NeuButton variant="primary" onClick={() => router.push('/dashboard/accounts')}>
              Connect Instagram
            </NeuButton>
          </GlassCard>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <UserSidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 ml-[240px] p-6 md:p-8 pb-[70px] md:pb-8"
      >
        {children}
      </motion.div>
      {showUpgrade && plan === 'starter' && (
        <UpgradePopup onClose={() => setShowUpgrade(false)} />
      )}
    </div>
  )
}
