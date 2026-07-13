'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ThemeContextType {
  theme: string
  setTheme: (t: string) => void
  accent: string
  setAccent: (c: string) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  accent: '#f4a261',
  setAccent: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState('dark')
  const [accent, setAccentState] = useState('#f4a261')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setThemeState(saved)
  }, [])

  const setTheme = (t: string) => {
    setThemeState(t)
    localStorage.setItem('theme', t)
    if (t === 'dark') document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }

  const setAccent = (c: string) => {
    setAccentState(c)
    localStorage.setItem('accent', c)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => useContext(ThemeContext)
