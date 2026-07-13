'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  LayoutDashboard, MessageSquare, Camera, Bell, Hash, BarChart3, Instagram,
  User, Settings, ChevronLeft, ChevronRight, Home, LogOut, Zap, ShoppingCart, Bot, Wallet, Crown, ListOrdered, Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

const links = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/tools', label: 'Growth Tools', icon: Zap },
  { href: '/dashboard/automation', label: 'Automation', icon: Bot },
  { href: '/dashboard/dm', label: 'DM Campaigns', icon: MessageSquare },
  { href: '/dashboard/posts', label: 'Scheduled Posts', icon: Camera },
  { href: '/dashboard/replies', label: 'Auto Replies', icon: Bell },
  { href: '/dashboard/hashtags', label: 'Hashtag Groups', icon: Hash },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/orders', label: 'DM Queue', icon: ListOrdered },
  { href: '/dashboard/history', label: 'History', icon: Clock },
  { href: '/dashboard/accounts', label: 'IG Accounts', icon: Instagram },
  { href: '/dashboard/products', label: 'Products', icon: ShoppingCart },
  { href: '/dashboard/earnings', label: 'Earnings', icon: Wallet },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

export function UserSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { showToast } = useToast()

  const handleLogout = async () => {
    await fetch('/api/auth/logout')
    showToast('Logged out', 'success')
    window.location.href = '/'
  }

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      className={cn(
        'fixed left-0 top-[70px] bottom-0 z-[500]',
        'hidden md:flex', // hide on mobile, show as flex on md+
        'bg-white/95 dark:bg-[#1a0e08]/95',
        'border-r border-white/20 dark:border-white/5',
        'p-3 flex-col gap-1 overflow-hidden'
      )}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mb-4 p-2 self-end rounded-[10px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 text-[#6b5a4c] dark:text-[#9c8a7a] hover:text-[#f4a261] transition-colors"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {links.map((link) => {
        const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href)
        const Icon = link.icon
        return (
          <Link key={link.href} href={link.href}>
            <motion.div
              whileHover={{ x: 4 }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all duration-200',
                isActive
                  ? 'bg-[#f4a261]/20 text-[#f4a261] font-semibold'
                  : 'text-[#6b5a4c] dark:text-[#9c8a7a] hover:bg-white/10 hover:text-[#f4a261]'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span className={cn('text-sm whitespace-nowrap', collapsed && 'hidden')}>
                {link.label}
              </span>
            </motion.div>
          </Link>
        )
      })}

      <div className="mt-auto pt-4 border-t border-white/10 space-y-1">
        <Link href="/dashboard/upgrade">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-500 hover:from-amber-500/30 hover:to-orange-500/30 transition-all"
          >
            <Crown className="w-5 h-5 shrink-0" />
            <span className={cn('text-sm font-semibold whitespace-nowrap', collapsed && 'hidden')}>
              Upgrade to Pro
            </span>
          </motion.div>
        </Link>
        <Link href="/">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[#6b5a4c] dark:text-[#9c8a7a] hover:bg-white/10 hover:text-[#f4a261] transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className={cn('text-sm', collapsed && 'hidden')}>Back to Site</span>
          </motion.div>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-red-400 hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          <span className={cn('text-sm', collapsed && 'hidden')}>Logout</span>
        </button>
      </div>
    </motion.aside>
  )
}
