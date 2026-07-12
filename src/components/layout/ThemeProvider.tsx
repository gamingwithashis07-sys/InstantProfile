'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useTheme } from '@/hooks/useTheme'

interface ThemeContextType {
  theme: 'light' | 'dark'
  setTheme: (t: 'light' | 'dark') => void
  accent: string
  setAccent: (c: string) => void
  mounted: boolean
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  setTheme: () => {},
  accent: '#f4a261',
  setAccent: () => {},
  mounted: false,
})

export function useThemeContext() {
  return useContext(ThemeContext)
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const themeData = useTheme()
  return (
    <ThemeContext.Provider value={themeData}>
      {children}
    </ThemeContext.Provider>
  )
}
