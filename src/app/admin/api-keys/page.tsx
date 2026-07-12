'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { NeuSelect } from '@/components/ui/NeuSelect'
import { Modal } from '@/components/ui/Modal'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { Tooltip } from '@/components/ui/Tooltip'
import { useToast } from '@/components/ui/Toast'
import { Key, Plus, Trash2, Edit, Download } from 'lucide-react'
import confetti from 'canvas-confetti'

interface ApiKey {
  id: number
  name: string
  key_value: string
  provider: string
  status: string
  created_at: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null)
  const [selected, setSelected] = useState<number[]>([])
  const [form, setForm] = useState({ name: '', key_value: '', provider: 'Instagram' })
  const { showToast } = useToast()

  const loadKeys = async () => {
    const data = await fetch('/api/admin/api-keys').then(r => r.json())
    setKeys(data)
    setLoading(false)
  }

  useEffect(() => { loadKeys() }, [])

  const filtered = keys.filter(k =>
    k.name.toLowerCase().includes(search.toLowerCase()) ||
    k.provider.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingKey(null)
    setForm({ name: '', key_value: '', provider: 'Instagram' })
    setModalOpen(true)
  }

  const openEdit = (k: ApiKey) => {
    setEditingKey(k)
    setForm({ name: k.name, key_value: k.key_value, provider: k.provider })
    setModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.key_value) return showToast('Fill all fields', 'error')
    const url = editingKey ? `/api/admin/api-keys/${editingKey.id}` : '/api/admin/api-keys'
    const method = editingKey ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (data.id || data.success) {
      showToast(editingKey ? 'Key updated!' : 'Key added!', 'success')
      if (!editingKey) confetti({ particleCount: 50, spread: 60, origin: { y: 0.5 } })
      setModalOpen(false)
      loadKeys()
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this API key?')) return
    await fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' })
    showToast('Key deleted', 'info')
    loadKeys()
  }

  const bulkDelete = async () => {
    if (!confirm(`Delete ${selected.length} keys?`)) return
    await Promise.all(selected.map(id => fetch(`/api/admin/api-keys/${id}`, { method: 'DELETE' })))
    showToast(`${selected.length} keys deleted`, 'info')
    setSelected([])
    loadKeys()
  }

  const exportCSV = () => {
    const csv = [['Name', 'Provider', 'Status', 'Created'].join(',')]
    filtered.forEach(k => csv.push([k.name, k.provider, k.status, k.created_at].join(',')))
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'api-keys.csv'; a.click()
    URL.revokeObjectURL(url)
    showToast('Exported as CSV', 'success')
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold">API Keys</h2>
        <div className="flex gap-2 flex-wrap">
          {selected.length > 0 && (
            <NeuButton variant="danger" size="sm" onClick={bulkDelete}>
              <Trash2 className="w-4 h-4" /> Delete {selected.length}
            </NeuButton>
          )}
          <Tooltip content="Export as CSV">
            <NeuButton size="sm" onClick={exportCSV}>
              <Download className="w-4 h-4" />
            </NeuButton>
          </Tooltip>
          <NeuButton variant="primary" size="sm" onClick={openAdd}>
            <Plus className="w-4 h-4" /> Add Key
          </NeuButton>
        </div>
      </div>

      <div className="mb-4 max-w-xs">
          <NeuInput
            placeholder="Search keys..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
      </div>

      {loading ? <TableSkeleton /> : filtered.length === 0 ? (
        <EmptyState
          icon={<Key className="w-12 h-12" />}
          title="No API keys found"
          description="Add your first API key to start managing services"
          action={<NeuButton variant="primary" size="sm" onClick={openAdd}><Plus className="w-4 h-4" /> Add Key</NeuButton>}
        />
      ) : (
        <ClayCard hover={false} className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="neu-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input
                      type="checkbox"
                      onChange={e => setSelected(e.target.checked ? keys.map(k => k.id) : [])}
                      checked={selected.length === keys.length && keys.length > 0}
                      className="accent-[#f4a261]"
                    />
                  </th>
                  <th>Name</th>
                  <th>Key</th>
                  <th>Provider</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map(k => (
                    <motion.tr
                      key={k.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      layout
                    >
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(k.id)}
                          onChange={e => setSelected(e.target.checked ? [...selected, k.id] : selected.filter(id => id !== k.id))}
                          className="accent-[#f4a261]"
                        />
                      </td>
                      <td className="font-semibold">{k.name}</td>
                      <td>
                        <code className="px-2 py-1 rounded-[8px] bg-[#e8d5c4]/50 dark:bg-[#2d1f14]/50 text-xs font-mono">
                          {k.key_value.substring(0, 12)}...
                        </code>
                      </td>
                      <td>{k.provider}</td>
                      <td><StatusBadge status={k.status} /></td>
                      <td className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{new Date(k.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="flex gap-1">
                          <Tooltip content="Edit">
                            <button onClick={() => openEdit(k)} className="p-1.5 rounded-[8px] hover:bg-white/10 text-[#6b5a4c] dark:text-[#9c8a7a]">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Tooltip>
                          <Tooltip content="Delete">
                            <button onClick={() => handleDelete(k.id)} className="p-1.5 rounded-[8px] hover:bg-white/10 text-red-400">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </Tooltip>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </ClayCard>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editingKey ? 'Edit API Key' : 'Add API Key'}>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <NeuInput label="Name" placeholder="My API Key" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <NeuInput label="API Key" placeholder="Enter the API key" value={form.key_value} onChange={e => setForm({ ...form, key_value: e.target.value })} required />
          <NeuSelect
            label="Provider"
            options={[
              { value: 'Instagram', label: 'Instagram' },
              { value: 'Facebook', label: 'Facebook' },
              { value: 'RapidAPI', label: 'RapidAPI' },
              { value: 'Custom', label: 'Custom' },
            ]}
            value={form.provider}
            onChange={e => setForm({ ...form, provider: e.target.value })}
          />
          <NeuButton variant="primary" type="submit">{editingKey ? 'Update' : 'Save'} Key</NeuButton>
        </form>
      </Modal>
    </motion.div>
  )
}
