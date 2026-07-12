'use client'

import { useState, useEffect, useCallback } from 'react'

export function useTheme() {
  const [theme, setThemeState] = useState<'light' | 'dark'>('dark')
  const [accent, setAccentState] = useState('#f4a261')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('insta-theme')
    const accentStored = localStorage.getItem('insta-accent')
    if (stored === 'light' || stored === 'dark') setThemeState(stored)
    if (accentStored) setAccentState(accentStored)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('insta-theme', theme)
  }, [theme, mounted])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.style.setProperty('--accent-color', accent)
    localStorage.setItem('insta-accent', accent)
  }, [accent, mounted])

  const setTheme = useCallback((t: 'light' | 'dark') => setThemeState(t), [])
  const setAccent = useCallback((c: string) => setAccentState(c), [])

  return { theme, setTheme, accent, setAccent, mounted }
}
