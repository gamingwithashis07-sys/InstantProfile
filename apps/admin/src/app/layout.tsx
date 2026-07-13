import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Admin - InstantProfile',
  description: 'Admin panel for InstantProfile automation platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <html lang="en" className="dark">
        <body className={`${inter.className} antialiased`}>
          <ThemeProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
