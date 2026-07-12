'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, Sparkles, Bot, ShoppingCart, User } from 'lucide-react'

const items = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/dashboard/tools', label: 'AI', icon: Sparkles },
  { href: '/dashboard/automation', label: 'Automation', icon: Bot },
  { href: '/shop', label: 'Shop', icon: ShoppingCart },
  { href: '/dashboard/profile', label: 'Account', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden
        bg-white/80 dark:bg-black/80 backdrop-blur-[12px]
        border-t border-white/20 dark:border-white/5
        flex items-center justify-around px-2 py-1
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]
        pb-safe"
    >
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-0 px-3 py-1 min-w-[56px]"
          >
            {isActive && (
              <motion.div
                layoutId="bottom-nav-indicator"
                className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 rounded-full bg-[#f4a261]"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <motion.div
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              className="flex flex-col items-center gap-0"
            >
              <item.icon
                className={`w-[22px] h-[22px] transition-colors ${
                  isActive ? 'text-[#f4a261]' : 'text-gray-500 dark:text-gray-400'
                }`}
              />
              <span
                className={`text-[10px] leading-tight font-semibold mt-0.5 transition-colors ${
                  isActive ? 'text-[#f4a261]' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                {item.label}
              </span>
            </motion.div>
          </Link>
        )
      })}
    </motion.nav>
  )
}
