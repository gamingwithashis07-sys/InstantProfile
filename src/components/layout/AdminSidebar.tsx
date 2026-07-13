'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Key, Package, ShoppingCart, Users, Settings as SettingsIcon,
  BarChart3, Activity, ChevronLeft, ChevronRight, Home, Instagram, MessageSquare, CreditCard, Globe, Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/admin/ig-accounts', label: 'IG Accounts', icon: Instagram },
  { href: '/admin/integrations', label: 'Integrations', icon: Globe },
  { href: '/admin/api-keys', label: 'API Keys', icon: Key },
  { href: '/admin/services', label: 'DM Campaigns', icon: MessageSquare },
  { href: '/admin/orders', label: 'DM Queue', icon: ShoppingCart },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/activity', label: 'Activity', icon: Activity },
  { href: '/admin/audit', label: 'Security Audit', icon: Shield },
  { href: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

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

      <div className="mt-auto pt-4 border-t border-white/10">
        <Link href="/">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[#6b5a4c] dark:text-[#9c8a7a] hover:bg-white/10 hover:text-[#f4a261] transition-colors"
          >
            <Home className="w-5 h-5 shrink-0" />
            <span className={cn('text-sm', collapsed && 'hidden')}>Back to Site</span>
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  )
}
