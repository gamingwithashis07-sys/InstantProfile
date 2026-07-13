'use client'

import { ReactNode, useState } from 'react'
import { useUser, SignInButton, SignUpButton } from '@clerk/nextjs'
import { motion } from 'framer-motion'
import { UserSidebar } from '@/components/layout/UserSidebar'
import { GlassCard } from '@/components/ui/GlassCard'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isLoaded, isSignedIn } = useUser()
  const [isRegister, setIsRegister] = useState(false)

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
    </div>
  )
}
