import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/layout/ThemeProvider'
import { ToastProvider } from '@/components/ui/Toast'
import { Navbar } from '@/components/layout/Navbar'
import { BottomNav } from '@/components/layout/BottomNav'
import { Footer } from '@/components/layout/Footer'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'InstantProfile - Instagram Automation',
  description: 'Powerful Instagram automation platform with smart tools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Providers>
          <ThemeProvider>
            <ToastProvider>
              <Navbar />
              <main className="pt-[70px] pb-[70px] md:pb-0">{children}</main>
              <BottomNav />
              <Footer />
            </ToastProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  )
}
