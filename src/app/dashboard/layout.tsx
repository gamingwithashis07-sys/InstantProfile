'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { UserSidebar } from '@/components/layout/UserSidebar'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuButton } from '@/components/ui/NeuButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/Toast'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.id) setAuthed(true)
        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUser, password: loginPass }),
    })
    const data = await res.json()
    setLoginLoading(false)

    if (data.id) {
      setAuthed(true)
      showToast(isRegister ? 'Account created!' : 'Welcome back!', 'success')
    } else {
      setLoginError(data.error || 'Authentication failed')
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!authed) {
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
            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              <NeuInput label="Username" placeholder="your username" value={loginUser} onChange={e => setLoginUser(e.target.value)} required />
              <NeuInput label="Password" type="password" placeholder="••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
              {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
              <NeuButton variant="primary" size="lg" type="submit" loading={loginLoading}>
                {loginLoading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
              </NeuButton>
            </form>
            <div className="text-center mt-4">
              <button
                onClick={() => { setIsRegister(!isRegister); setLoginError('') }}
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
