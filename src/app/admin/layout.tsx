'use client'

import { useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuButton } from '@/components/ui/NeuButton'
import { GlassCard } from '@/components/ui/GlassCard'
import { useToast } from '@/components/ui/Toast'

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(false)
  const [checking, setChecking] = useState(true)
  const [loginUser, setLoginUser] = useState('')
  const [loginPass, setLoginPass] = useState('')
  const [loginSecret, setLoginSecret] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')
  const router = useRouter()
  const { showToast } = useToast()

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => {
        if (data.role === 'admin') setAuthed(true)
        setChecking(false)
      })
      .catch(() => setChecking(false))
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: loginUser, password: loginPass, secret_code: loginSecret }),
    })
    const data = await res.json()
    setLoginLoading(false)
    if (data.role === 'admin') {
      setAuthed(true)
      showToast('Welcome back!', 'success')
    } else {
      setLoginError(data.error || 'Invalid credentials')
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
              <div className="text-5xl mb-4">⚙️</div>
              <h2 className="text-2xl font-bold">Admin Login</h2>
              <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mt-2">Enter your credentials to continue</p>
            </div>
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <NeuInput label="Username" placeholder="admin" value={loginUser} onChange={e => setLoginUser(e.target.value)} required />
              <NeuInput label="Password" type="password" placeholder="••••••" value={loginPass} onChange={e => setLoginPass(e.target.value)} required />
              <NeuInput label="Secret Code" type="password" placeholder="admin secret" value={loginSecret} onChange={e => setLoginSecret(e.target.value)} required />
              {loginError && <p className="text-red-400 text-sm text-center">{loginError}</p>}
              <NeuButton variant="primary" size="lg" type="submit" loading={loginLoading}>
                {loginLoading ? 'Logging in...' : 'Login'}
              </NeuButton>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 ml-[240px] p-6 md:p-8 min-h-screen"
      >
        {children}
      </motion.div>
    </div>
  )
}
