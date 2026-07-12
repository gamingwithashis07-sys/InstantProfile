'use client'

import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import {
  Link2, Layout, Lightbulb, FileText, QrCode, Hash, BarChart3, TrendingUp,
  Users, Clock, Eye, LayoutTemplate, Award, Calendar, Search, Zap, Share2,
  MessageSquare, Camera, Bell, Download, Shield
} from 'lucide-react'
import Link from 'next/link'

const tools = [
  { icon: Link2, label: 'Link Shortener', desc: 'Create short, trackable links', href: '/dashboard/tools/links', color: '#f4a261' },
  { icon: Layout, label: 'Bio Page', desc: 'Link-in-bio landing page', href: '/dashboard/tools/bio', color: '#c46cb8' },
  { icon: Lightbulb, label: 'Content Ideas', desc: 'Generate post ideas', href: '/dashboard/tools/ideas', color: '#e8c36c' },
  { icon: FileText, label: 'Caption Templates', desc: 'Save & reuse captions', href: '/dashboard/tools/captions', color: '#7cb86c' },
  { icon: QrCode, label: 'QR Code Generator', desc: 'Create Instagram QR codes', href: '/dashboard/tools/qrcode', color: '#6cb8c4' },
  { icon: Hash, label: 'Hashtag Generator', desc: 'AI-powered hashtag suggestions', href: '/dashboard/tools/hashtags/generator', color: '#f4a261' },
  { icon: BarChart3, label: 'Engagement Calculator', desc: 'Analyze engagement rates', href: '/dashboard/tools/engagement', color: '#7cb86c' },
  { icon: TrendingUp, label: 'Growth Tracker', desc: 'Track follower growth', href: '/dashboard/tools/growth', color: '#6cb8c4' },
  { icon: Users, label: 'Competitor Analysis', desc: 'Analyze competitor accounts', href: '/dashboard/tools/competitor', color: '#c46cb8' },
  { icon: Clock, label: 'Best Time to Post', desc: 'Find optimal posting times', href: '/dashboard/tools/best-time', color: '#f4a261' },
  { icon: Eye, label: 'Post Preview', desc: 'Preview how posts look', href: '/dashboard/tools/preview', color: '#e8c36c' },
  { icon: LayoutTemplate, label: 'Story Templates', desc: 'Story idea templates', href: '/dashboard/tools/templates', color: '#7cb86c' },
  { icon: Award, label: 'Profile Score', desc: 'Optimize your profile', href: '/dashboard/tools/profile', color: '#c46cb8' },
  { icon: Calendar, label: 'Content Calendar', desc: 'Plan weekly content', href: '/dashboard/tools/calendar', color: '#6cb8c4' },
  { icon: Search, label: 'Hashtag Research', desc: 'Find trending hashtags', href: '/dashboard/tools/hashtags/generator', color: '#f4a261' },
  { icon: MessageSquare, label: 'DM Templates', desc: 'Message templates', href: '/dashboard/tools/captions', color: '#e8c36c' },
  { icon: Camera, label: 'Post Ideas', desc: 'Visual content ideas', href: '/dashboard/tools/ideas', color: '#7cb86c' },
  { icon: Bell, label: 'Auto Reply Templates', desc: 'Reply message templates', href: '/dashboard/tools/captions', color: '#c46cb8' },
  { icon: Share2, label: 'Share Button', desc: 'Bio page share link', href: '/dashboard/tools/bio', color: '#6cb8c4' },
  { icon: Download, label: 'Export Insights', desc: 'Download analytics data', href: '/dashboard/tools/engagement', color: '#f4a261' },
  { icon: Shield, label: 'Policy Generator', desc: 'Generate privacy & refund policies', href: '/dashboard/tools/policies', color: '#e8c36c' },
]

export default function ToolsPage() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Growth Tools</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {tools.map((t, i) => {
          const Icon = t.icon
          return (
            <Link key={i} href={t.href}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <ClayCard className="h-full cursor-pointer hover:translate-y-[-4px] transition-all">
                  <Icon className="w-6 h-6 mb-3" style={{ color: t.color }} />
                  <h3 className="font-bold text-sm mb-1">{t.label}</h3>
                  <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{t.desc}</p>
                </ClayCard>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </motion.div>
  )
}
