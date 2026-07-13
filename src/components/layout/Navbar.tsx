'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Menu, X, Sun, Moon, Palette, User, LogOut, Settings, LayoutDashboard
} from 'lucide-react'
import { useThemeContext } from './ThemeProvider'
import { useToast } from '@/components/ui/Toast'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [session, setSession] = useState<any>(null)
  const [checked, setChecked] = useState(false)
  const { theme, setTheme, accent, setAccent } = useThemeContext()
  const { showToast } = useToast()

  const accentColors = ['#f4a261', '#e8a87c', '#7cb86c', '#6cb8c4', '#c46cb8', '#6c7cc4']

  useEffect(() => {
    fetch('/api/auth/me')
      .then(r => r.json())
      .then(data => { if (data.id) setSession(data); setChecked(true) })
      .catch(() => setChecked(true))
  }, [])

  const handleLogout = async () => {
    await fetch('/api/auth/logout')
    showToast('Logged out', 'success')
    setSession(null)
    setUserMenu(false)
    window.location.href = '/'
  }

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-[1000] h-[70px] px-4 md:px-8 flex items-center justify-between
          bg-white/95 dark:bg-[#1a0e08]/95 border-b border-white/25 dark:border-white/10
          shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
      >
        <Link href="/" className="flex items-center gap-2">
          <img src="/logo.png" alt="InstantProfile" className="h-8 w-auto" />
          <span className="text-xl font-extrabold tracking-tight" style={{ color: accent }}>InstantProfile</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors">
            Home
          </Link>
          <Link href="/#features" className="text-sm font-medium text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors">
            Features
          </Link>

          {checked && session && (
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm font-medium text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors">
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-[12px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowThemePicker(!showThemePicker)}
              className="p-2 rounded-[12px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50"
            >
              <Palette className="w-4 h-4 text-[#6b5a4c] dark:text-[#9c8a7a]" />
            </button>
            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-full mt-2 p-3 bg-white dark:bg-[#2d1f14] rounded-[16px] border border-white/30 shadow-lg flex gap-2"
                >
                  {accentColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => { setAccent(c); setShowThemePicker(false) }}
                      className={`w-7 h-7 rounded-full transition-transform hover:scale-110 ${accent === c ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="relative">
            <button
              onClick={() => setUserMenu(!userMenu)}
              className="p-2 rounded-[12px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261]"
            >
              <User className="w-4 h-4" />
            </button>
            <AnimatePresence>
              {userMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-44 p-2 bg-white dark:bg-[#2d1f14] rounded-[16px] border border-white/30 shadow-lg"
                >
                  {!checked ? (
                    <div className="px-3 py-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">Loading...</div>
                  ) : !session ? (
                    <>
                      <button
                        onClick={() => { window.location.href = '/dashboard'; setUserMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] rounded-[10px] hover:bg-white/20"
                      >
                        <User className="w-3.5 h-3.5" /> Sign In
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-3 py-2 border-b border-white/10 mb-1">
                        <p className="text-sm font-semibold">{session.username}</p>
                        <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] capitalize">{session.role}</p>
                      </div>
                      <button
                        onClick={() => { window.location.href = '/dashboard'; setUserMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] rounded-[10px] hover:bg-white/20"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
                      </button>
                      <button
                        onClick={() => { window.location.href = '/dashboard/dm'; setUserMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] rounded-[10px] hover:bg-white/20"
                      >
                        <LayoutDashboard className="w-3.5 h-3.5" /> DM Campaigns
                      </button>
                      <button
                        onClick={() => { window.location.href = '/dashboard/settings'; setUserMenu(false) }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] rounded-[10px] hover:bg-white/20"
                      >
                        <Settings className="w-3.5 h-3.5" /> Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:text-red-300 rounded-[10px] hover:bg-white/20"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-[12px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 text-[#6b5a4c] dark:text-[#9c8a7a]"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-[70px] left-0 right-0 z-[999] p-4 bg-white dark:bg-[#1a0e08] border-b border-white/30 md:hidden"
          >
            <div className="flex flex-col gap-3">
              <Link href="/" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium text-[#6b5a4c] dark:text-[#9c8a7a] rounded-[10px] hover:bg-white/20">Home</Link>
              <Link href="/#features" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium text-[#6b5a4c] dark:text-[#9c8a7a] rounded-[10px] hover:bg-white/20">Features</Link>

              {checked && session && (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#f4a261] rounded-[10px] hover:bg-white/20">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
              )}

              <div className="flex gap-2 px-4 pt-2 border-t border-white/10">
                {accentColors.map((c) => (
                  <button key={c} onClick={() => setAccent(c)} className={`w-6 h-6 rounded-full ${accent === c ? 'ring-2 ring-white' : ''}`} style={{ backgroundColor: c }} />
                ))}
                <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ml-auto p-1.5 rounded-[10px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50">
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              {session ? (
                <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-400 rounded-[10px] hover:bg-white/20">
                  <LogOut className="w-4 h-4" /> Logout ({session.username})
                </button>
              ) : (
                <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="flex items-center gap-2 px-4 py-2 text-sm text-[#f4a261] rounded-[10px] hover:bg-white/20">
                  <User className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
