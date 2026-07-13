'use client'

import { ReactNode, useEffect, useState } from 'react'
import { useUser, SignInButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { GlassCard } from '@/components/ui/GlassCard'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    async function check() {
      if (!isSignedIn || !user) {
        setChecking(false)
        return
      }
      const role = user.publicMetadata?.role as string
      setIsAdmin(role === 'admin')
      setChecking(false)
    }
    if (isLoaded) check()
  }, [isLoaded, isSignedIn, user])

  if (!isLoaded || checking) {
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
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mt-2">Sign in to continue</p>
            </div>
            <SignInButton mode="modal" fallbackRedirectUrl="/admin">
              <button className="w-full py-3 px-6 rounded-[12px] bg-[#f4a261] text-white font-semibold hover:bg-[#e8913d] transition-all">
                Sign In
              </button>
            </SignInButton>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <GlassCard className="p-8 text-center">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">Admin privileges required</p>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-4 md:p-8 md:ml-[240px]"
      >
        {children}
      </motion.div>
    </div>
  )
}
