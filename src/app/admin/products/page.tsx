'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { useToast } from '@/components/ui/Toast'
import { ShoppingCart, Edit3, Trash2, BookOpen, FileText, Sparkles, Download, Shield, Eye, DollarSign } from 'lucide-react'

const typeIcons: Record<string, any> = {
  course: BookOpen,
  pdf: FileText,
  template: Sparkles,
}

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const fetchAll = async () => {
    const res = await fetch('/api/shop/products')
    const all = await res.json()
    setProducts(all)
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    await fetch(`/api/shop/products/${id}`, { method: 'DELETE' })
    showToast('Product deleted', 'info')
    fetchAll()
  }

  const toggleStatus = async (p: any) => {
    const newStatus = p.status === 'active' ? 'inactive' : 'active'
    const res = await fetch(`/api/shop/products/${p.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    const data = await res.json()
    if (data.error) { showToast(data.error, 'error'); return }
    showToast(`Product ${newStatus}`, 'success')
    fetchAll()
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ShoppingCart className="w-6 h-6 text-[#f4a261]" /> All Products
        </h2>
        <Link href="/dashboard/products">
          <NeuButton variant="primary" size="sm">Manage as User</NeuButton>
        </Link>
      </div>

      {products.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Download className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p>No products created yet.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {products.map((p, i) => {
            const Icon = typeIcons[p.type] || Download
            let policyCount = 0
            try { policyCount = Object.keys(JSON.parse(p.policies || '{}')).length } catch {}
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <ClayCard>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#f4a261] to-[#e07c3c] flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-sm truncate">{p.title}</p>
                        <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">
                          ₹{p.price.toFixed(2)} &middot; {p.type} &middot; /{p.slug}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span title={`${policyCount} policies`} className={`text-xs px-1.5 py-0.5 rounded-full ${policyCount >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <Shield className="w-3 h-3 inline mr-0.5" />{policyCount}
                      </span>
                      <button
                        onClick={() => toggleStatus(p)}
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}
                      >
                        {p.status}
                      </button>
                      <Link href={`/shop/${p.slug}`}>
                        <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="View in shop">
                          <Eye className="w-4 h-4 text-[#9c8a7a]" />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.title)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                </ClayCard>
              </motion.div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
