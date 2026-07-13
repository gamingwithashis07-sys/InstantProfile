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
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 350, damping: 26 }}
      className="fixed bottom-0 left-0 right-0 z-[1000] md:hidden
        bg-white/95 dark:bg-black/95
        border-t border-white/20 dark:border-white/5
        flex items-center justify-around px-2 pt-2 pb-1
        shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
    >
      {items.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
        const Icon = item.icon
        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex flex-col items-center gap-0 px-3 min-w-[56px]"
          >
            <div className="relative flex flex-col items-center">
              {isActive && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute -top-0.5 w-5 h-1 rounded-full bg-[#f4a261]"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <motion.div
                animate={isActive ? { scale: 1.15, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                whileTap={{ scale: 0.85 }}
                className="flex flex-col items-center gap-0"
              >
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    isActive ? 'text-[#f4a261]' : 'text-gray-500 dark:text-gray-400'
                  }`}
                />
                <motion.span
                  animate={isActive ? { y: 2, opacity: 1 } : { y: 0, opacity: 0.7 }}
                  className={`text-[10px] leading-tight font-semibold mt-0.5 ${
                    isActive ? 'text-[#f4a261]' : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  {item.label}
                </motion.span>
              </motion.div>
            </div>
          </Link>
        )
      })}
    </motion.nav>
  )
}
