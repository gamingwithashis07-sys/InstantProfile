'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { Shield, AlertTriangle, AlertCircle, Monitor, Smartphone, Tablet, Globe, X, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react'

const ACTION_COLORS: Record<string, string> = {
  UNAUTHORIZED_ACCESS: 'text-red-400 bg-red-500/10',
  FORBIDDEN_ACCESS: 'text-orange-400 bg-orange-500/10',
}

const ACTION_ICONS: Record<string, any> = {
  UNAUTHORIZED_ACCESS: AlertTriangle,
  FORBIDDEN_ACCESS: AlertCircle,
}

const DEVICE_ICONS: Record<string, any> = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Windows: Monitor,
  Mac: Monitor,
  Linux: Monitor,
}

export default function AuditPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [filter, setFilter] = useState('')
  const [selected, setSelected] = useState<any>(null)

  const load = (p: number) => {
    setLoading(true)
    const params = new URLSearchParams({ page: String(p), limit: '50' })
    if (filter) params.set('action', filter)
    fetch(`/api/admin/audit?${params}`)
      .then(r => r.json())
      .then(d => { setLogs(d.logs); setTotalPages(d.totalPages); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load(page) }, [page, filter])

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6 text-[#f4a261]" />
          <h2 className="text-2xl font-bold">Security Audit</h2>
        </div>
        <div className="flex items-center gap-2">
          <NeuButton variant="ghost" size="sm" onClick={() => load(page)}><RefreshCw className="w-4 h-4" /></NeuButton>
        </div>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'UNAUTHORIZED_ACCESS', 'FORBIDDEN_ACCESS'].map(a => (
          <button
            key={a}
            onClick={() => { setFilter(a); setPage(1) }}
            className={`px-3 py-1.5 rounded-[10px] text-xs font-semibold transition-all ${
              filter === a ? 'bg-[#f4a261]/20 text-[#f4a261]' : 'bg-white/5 text-[#6b5a4c] hover:bg-white/10'
            }`}
          >
            {a || 'All Events'}
          </button>
        ))}
        {filter && (
          <button onClick={() => { setFilter(''); setPage(1) }} className="px-2 py-1.5 rounded-[10px] text-xs text-red-400 hover:bg-red-500/10">
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><RefreshCw className="w-6 h-6 animate-spin text-[#f4a261]" /></div>
      ) : logs.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Shield className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
          <p className="text-emerald-500 font-semibold">No security events</p>
          <p className="text-xs text-[#9c8a7a] mt-1">Your system is secure</p>
        </ClayCard>
      ) : (
        <>
          <div className="grid gap-2 mb-4">
            {logs.map((log, i) => {
              const ActionIcon = ACTION_ICONS[log.action] || Shield
              const DeviceIcon = DEVICE_ICONS[log.device] || Globe
              const colorClass = ACTION_COLORS[log.action] || 'text-[#6b5a4c] bg-white/5'

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  onClick={() => setSelected(selected?.id === log.id ? null : log)}
                  className={`cursor-pointer rounded-[14px] p-4 transition-all ${
                    selected?.id === log.id ? 'bg-[#f4a261]/10 border border-[#f4a261]/30' : 'bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-[10px] ${colorClass}`}>
                        <ActionIcon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{log.action.replace(/_/g, ' ')}</p>
                        <p className="text-xs text-[#9c8a7a]">{new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <DeviceIcon className="w-4 h-4 text-[#9c8a7a]" />
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                        log.status === 401 ? 'bg-red-500/20 text-red-400' :
                        log.status === 403 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                  </div>

                  {selected?.id === log.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-white/10 space-y-2 text-sm"
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-[#9c8a7a]">IP Address</p>
                          <p className="font-mono text-[#f4a261]">{log.ip || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9c8a7a]">Device</p>
                          <p>{log.device || 'Unknown'}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-xs text-[#9c8a7a]">User Agent</p>
                          <p className="text-xs truncate font-mono">{log.userAgent || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9c8a7a]">Path</p>
                          <p className="font-mono">{log.path || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9c8a7a]">Method</p>
                          <p>{log.method || 'Unknown'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9c8a7a]">User</p>
                          <p>{log.username || 'Guest'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-[#9c8a7a]">Target</p>
                          <p className="truncate">{log.target || 'N/A'}</p>
                        </div>
                        {log.detail && (
                          <div className="col-span-2">
                            <p className="text-xs text-[#9c8a7a]">Detail</p>
                            <p>{log.detail}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3">
              <NeuButton variant="ghost" size="sm" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
                <ChevronLeft className="w-4 h-4" />
              </NeuButton>
              <span className="text-sm text-[#6b5a4c]">Page {page} of {totalPages}</span>
              <NeuButton variant="ghost" size="sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                <ChevronRight className="w-4 h-4" />
              </NeuButton>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
