'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowLeft, Download, BookOpen, FileText, Sparkles, Package } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'

const typeIcons: Record<string, any> = {
  course: BookOpen,
  pdf: FileText,
  template: Sparkles,
}

export default function OrderPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shop/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/">
            <NeuButton variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </NeuButton>
          </Link>
          <h1 className="text-2xl font-bold">My Orders</h1>
        </div>

        {orders.length === 0 ? (
          <GlassCard className="text-center py-12">
            <Package className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
            <p className="mb-4">No orders yet</p>
            <Link href="/shop">
              <NeuButton variant="primary">
                <ShoppingCart className="w-4 h-4" /> Browse Products
              </NeuButton>
            </Link>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, i) => {
              const Icon = typeIcons[order.product_type] || Download
              return (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <GlassCard className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#f4a261] to-[#e07c3c] flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{order.product_title || `Product #${order.product_id}`}</p>
                          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">
                            {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-[#f4a261]">
                        ${order.amount > 0 ? order.amount.toFixed(2) : 'Free'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-white/10">
                      <span className={`text-xs font-medium capitalize ${order.status === 'completed' ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {order.status}
                      </span>
                      <Link href={`/shop/${order.product_slug}`}>
                        <NeuButton variant="ghost" size="sm">
                          <Download className="w-3.5 h-3.5" /> Download
                        </NeuButton>
                      </Link>
                    </div>
                  </GlassCard>
                </motion.div>
              )
            })}
          </div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 text-center">
          <Link href="/shop">
            <NeuButton variant="primary">
              <ShoppingCart className="w-4 h-4" /> Browse Shop
            </NeuButton>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
