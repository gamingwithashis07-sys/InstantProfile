'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, BookOpen, FileText, Download, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'

const typeIcons: Record<string, any> = {
  course: BookOpen,
  pdf: FileText,
  template: Sparkles,
  other: Download,
}

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shop/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Digital Products</h1>
          <p className="text-[#6b5a4c] dark:text-[#9c8a7a]">Courses, templates, PDFs, and more</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <GlassCard className="text-center py-16">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#9c8a7a]" />
            <h2 className="text-xl font-semibold mb-2">No products yet</h2>
            <p className="text-[#6b5a4c] dark:text-[#9c8a7a]">Check back soon for new digital products.</p>
          </GlassCard>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, i) => {
              const Icon = typeIcons[product.type] || Download
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/shop/${product.slug}`}>
                    <GlassCard className="p-6 h-full hover:scale-[1.02] transition-transform duration-200 cursor-pointer group">
                      {product.image_url && (
                        <div className="w-full h-40 rounded-[16px] overflow-hidden mb-4">
                          <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#f4a261] to-[#e07c3c] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-lg font-bold mb-1">{product.title}</h3>
                      <p className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a] line-clamp-2 mb-4">
                        {product.description || 'No description'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-[#f4a261]">
                          ${product.price > 0 ? product.price.toFixed(2) : 'Free'}
                        </span>
                        <span className="text-xs capitalize px-2 py-1 rounded-full bg-[#f4a261]/10 text-[#f4a261]">
                          {product.type}
                        </span>
                      </div>
                    </GlassCard>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
