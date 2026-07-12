'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wallet, TrendingUp, ArrowUpRight, Download, ShoppingCart, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { ClayCard } from '@/components/ui/ClayCard'

export default function EarningsPage() {
  const [data, setData] = useState<any>({ balance: 0, transactions: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/shop/balance')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const totalEarned = data.transactions
    .filter((t: any) => t.type === 'credit')
    .reduce((sum: number, t: any) => sum + t.amount, 0)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center gap-3 mb-6">
        <Wallet className="w-6 h-6 text-[#f4a261]" />
        <h2 className="text-2xl font-bold">Earnings</h2>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <GlassCard className="p-5">
          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mb-1">Available Balance</p>
          <p className="text-3xl font-bold text-[#f4a261]">₹{data.balance.toFixed(2)}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mb-1">Total Earned</p>
          <p className="text-3xl font-bold text-emerald-500">₹{totalEarned.toFixed(2)}</p>
        </GlassCard>
        <GlassCard className="p-5">
          <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] mb-1">Transactions</p>
          <p className="text-3xl font-bold">{data.transactions.length}</p>
        </GlassCard>
      </div>

      <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6b5a4c] dark:text-[#9c8a7a] mb-3 flex items-center gap-1.5">
        <TrendingUp className="w-4 h-4" /> Transaction History
      </h3>

      {data.transactions.length === 0 ? (
        <ClayCard className="text-center py-12">
          <ShoppingCart className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p>No transactions yet. Sell products to earn.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-2">
          {data.transactions.map((t: any, i: number) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <ClayCard>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center ${t.type === 'credit' ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                      {t.type === 'credit' ? <ArrowUpRight className="w-4 h-4 text-emerald-500" /> : <Download className="w-4 h-4 text-red-500" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold truncate">{t.description || t.type}</p>
                      <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">{new Date(t.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold ${t.type === 'credit' ? 'text-emerald-500' : 'text-red-400'}`}>
                    {t.type === 'credit' ? '+' : '-'}₹{t.amount.toFixed(2)}
                  </span>
                </div>
              </ClayCard>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
