'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: '#f4a261',
          colorNeutral: '#6b5a4c',
          borderRadius: '0.75rem',
        },
      }}
    >
      {children}
    </ClerkProvider>
  )
}
