'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Instagram, Twitter, Github, Mail, Heart, ArrowUp } from 'lucide-react'
import { useThemeContext } from './ThemeProvider'

export function Footer() {
  const { accent } = useThemeContext()

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <footer className="relative mt-20 border-t border-white/10 bg-white/5 dark:bg-black/10 backdrop-blur-[8px]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <Link href="/" className="text-2xl font-extrabold tracking-tight" style={{ color: accent }}>
              InstantProfile
            </Link>
            <p className="mt-3 text-sm text-[#6b5a4c] dark:text-[#9c8a7a] max-w-sm leading-relaxed">
              The most reliable Instagram automation platform. Automate DMs,
              schedule posts, and manage your Instagram presence with the official Graph API.
            </p>
            <div className="flex gap-3 mt-4">
              {[
                { icon: Instagram, href: '#', label: 'Instagram' },
                { icon: Twitter, href: '#', label: 'Twitter' },
                { icon: Github, href: '#', label: 'Github' },
                { icon: Mail, href: 'mailto:support@instaautomate.com', label: 'Email' },
              ].map((s, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-[12px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 flex items-center justify-center text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors"
                >
                  <s.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#6b5a4c] dark:text-[#9c8a7a]">Quick Links</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Home', href: '/' },
                { label: 'Features', href: '/#features' },
                { label: 'Dashboard', href: '/dashboard' },
              ].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#6b5a4c] dark:text-[#9c8a7a]">Automation</h4>
            <ul className="space-y-2.5">
              {['DM Campaigns', 'Scheduled Posts', 'Auto Replies', 'Hashtag Groups', 'Analytics'].map((s, i) => (
                <li key={i}>
                  <span className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[#9c8a7a] flex items-center gap-1">
            &copy; {new Date().getFullYear()} InstantProfile. Made with <Heart className="w-3 h-3 text-red-400" fill="#f87171" /> for the community.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#9c8a7a]">
            <Link href="#" className="hover:text-[#f4a261] transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-[#f4a261] transition-colors">Terms of Service</Link>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={scrollToTop}
              className="p-2 rounded-[10px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  )
}
