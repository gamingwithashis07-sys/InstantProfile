'use client'

'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Zap, Shield, MessageSquare, Camera, Bell, Hash, BarChart3, Instagram,
  ArrowRight, Star, ChevronDown, Send, TrendingUp, Users, Repeat, Clock, Sparkles
} from 'lucide-react'
import { ClayCard } from '@/components/ui/ClayCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'
import Link from 'next/link'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

export default function HomePage() {
  const [stats, setStats] = useState({ total_dms_sent: 0, total_posts_scheduled: 0, total_connected_accounts: 0, total_users: 0 })

  useEffect(() => {
    fetch('/api/stats/public').then(r => r.json()).then(setStats).catch(() => {})
  }, [])

  return (
    <div>
      {/* ─── HERO ─── */}
      <section className="min-h-[90vh] flex items-center justify-center px-4 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#f4a261]/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#e8a87c]/10 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl relative z-10"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full glass text-sm font-medium text-[#6b5a4c] dark:text-[#9c8a7a]"
          >
            <Star className="w-4 h-4 text-[#f4a261]" fill="#f4a261" />
            Official Instagram Graph API Partner
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-black leading-[1.1] mb-6 hero-gradient">
            Smart Instagram<br />Automation Platform
          </h1>

          <p className="text-lg md:text-xl text-[#6b5a4c] dark:text-[#9c8a7a] mb-10 max-w-2xl mx-auto leading-relaxed">
            Automate DMs, schedule posts, set up auto-replies, and manage hashtags
            &mdash; all through the official Instagram Graph API. No fake engagement, no risks.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard">
                <NeuButton variant="primary" size="lg">
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </NeuButton>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <NeuButton size="lg" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Learn More
              </NeuButton>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-16"
          >
            <ChevronDown className="w-6 h-6 mx-auto text-[#9c8a7a]" />
          </motion.div>
        </motion.div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Powerful Automation Tools
        </motion.h2>
        <p className="text-center text-[#6b5a4c] dark:text-[#9c8a7a] mb-12 max-w-xl mx-auto">
          Everything you need to grow your Instagram presence &mdash; built on the official Meta API
        </p>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {[
            { icon: Send, title: 'Auto DM Campaigns', desc: 'Send bulk DMs to followers based on triggers like new followers, likes, or comments' },
            { icon: Camera, title: 'Content Scheduling', desc: 'Schedule posts, carousels, and Reels to publish automatically at the best times' },
            { icon: Bell, title: 'Smart Auto-Replies', desc: 'Automatically respond to comments and DMs with keyword-triggered templates' },
            { icon: Hash, title: 'Hashtag Manager', desc: 'Create, save, and reuse hashtag groups to boost reach and engagement' },
            { icon: BarChart3, title: 'Analytics & Insights', desc: 'Track follower growth, engagement rates, and campaign performance' },
            { icon: MessageSquare, title: 'Conversation Inbox', desc: 'View and manage all DM conversations from one unified dashboard' },
            { icon: Repeat, title: 'Trigger-Based Actions', desc: 'Set up campaigns that run automatically on new followers, likes, or comments' },
            { icon: Clock, title: 'Scheduled Publishing', desc: 'Plan your content calendar weeks in advance with automatic publishing' },
          ].map((f, i) => (
            <motion.div key={i} variants={item}>
              <GlassCard className="text-center p-8 h-full">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                  className="w-16 h-16 mx-auto mb-5 rounded-[20px] clay flex items-center justify-center"
                >
                  <f.icon className="w-7 h-7 text-[#f4a261]" />
                </motion.div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{f.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          How It Works
        </motion.h2>
        <p className="text-center text-[#6b5a4c] dark:text-[#9c8a7a] mb-12">
          Get started in minutes with a secure OAuth connection
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Connect', desc: 'Link your Instagram Business or Creator account via secure OAuth with the Facebook Graph API.' },
            { step: '02', title: 'Configure', desc: 'Set up DM campaigns, schedule posts, create auto-reply rules, and organize hashtags.' },
            { step: '03', title: 'Automate', desc: 'Let the platform handle engagement while you focus on creating great content.' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="text-center"
            >
              <div className="text-5xl font-black text-[#f4a261]/30 mb-4">{s.step}</div>
              <h3 className="text-xl font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── BENEFITS ─── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-4"
        >
          Why Choose InstantProfile
        </motion.h2>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {[
            { icon: Shield, title: 'Official Graph API', desc: '100% compliant with Meta\'s platform policies. No fake engagement, no risk of bans.' },
            { icon: Zap, title: 'Secure OAuth', desc: 'Your credentials are never stored. We use Meta\'s secure OAuth flow for authentication.' },
            { icon: Sparkles, title: 'All-in-One Platform', desc: 'DMs, scheduling, auto-replies, hashtags, and analytics in one dashboard.' },
          ].map((b, i) => (
            <motion.div key={i} variants={item}>
              <ClayCard className="text-center h-full">
                <b.icon className="w-10 h-10 mx-auto mb-4 text-[#f4a261]" />
                <h3 className="text-lg font-bold mb-2">{b.title}</h3>
                <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{b.desc}</p>
              </ClayCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ─── STATS ─── */}
      <section className="max-w-4xl mx-auto px-4 py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-center mb-12"
        >
          Trusted by Thousands
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {[
            { end: stats.total_dms_sent || 0, label: 'DMs Sent', suffix: '+' },
            { end: stats.total_posts_scheduled || 0, label: 'Posts Scheduled', suffix: '+' },
            { end: stats.total_connected_accounts || 0, label: 'Connected Accounts', suffix: '+' },
            { end: stats.total_users || 0, label: 'Active Users', suffix: '+' },
          ].map((stat, i) => (
            <ClayCard key={i} hover={false} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-[#f4a261]">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </div>
              <div className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mt-2 font-medium">
                {stat.label}
              </div>
            </ClayCard>
          ))}
        </motion.div>
      </section>

      {/* ─── CTA ─── */}
      <section className="max-w-lg mx-auto px-4 py-20 text-center">
        <GlassCard className="p-10">
          <Instagram className="w-12 h-12 mx-auto mb-4 text-[#f4a261]" />
          <h2 className="text-2xl font-bold mb-3">Ready to Automate Your Instagram?</h2>
          <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] mb-6">
            Connect your Instagram Business account and start automating today.
          </p>
          <Link href="/dashboard">
            <NeuButton variant="primary" size="lg">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </NeuButton>
          </Link>
        </GlassCard>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="text-center py-8 text-sm text-[#9c8a7a] border-t border-white/10">
        <p>&copy; {new Date().getFullYear()} InstantProfile. All rights reserved. Built on the Instagram Graph API.</p>
      </footer>
    </div>
  )
}
