'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { Camera, Plus } from 'lucide-react'
import Link from 'next/link'

export default function PostsPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts').then(r => r.json()).then(p => { setPosts(p); setLoading(false) })
  }, [])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2"><Camera className="w-6 h-6 text-[#f4a261]" /> Scheduled Posts</h2>
        <Link href="/dashboard/posts/new"><NeuButton variant="primary" size="sm"><Plus className="w-4 h-4" /> Schedule Post</NeuButton></Link>
      </div>
      {loading ? <p className="text-[#6b5a4c]">Loading...</p> : posts.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Camera className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" /><p className="mb-4">No scheduled posts yet.</p>
          <Link href="/dashboard/posts/new"><NeuButton variant="primary">Schedule a Post</NeuButton></Link>
        </ClayCard>
      ) : (
        <div className="grid gap-4">
          {posts.map(p => (
            <ClayCard key={p.id}>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-[12px] bg-gradient-to-br from-[#e8a87c] to-[#f4a261] flex items-center justify-center text-white text-xs">{p.media_type}</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">@{p.ig_username}</p>
                  <p className="text-xs text-[#6b5a4c]">{p.caption?.substring(0, 60)}{p.caption?.length > 60 ? '...' : ''}</p>
                  <p className="text-xs text-[#6b5a4c] mt-1">Scheduled: {new Date(p.scheduled_at).toLocaleString()}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{p.status}</span>
              </div>
            </ClayCard>
          ))}
        </div>
      )}
    </motion.div>
  )
}
