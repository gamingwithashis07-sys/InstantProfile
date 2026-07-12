'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClayCard } from '@/components/ui/ClayCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { EmptyState } from '@/components/ui/EmptyState'
import { TableSkeleton } from '@/components/ui/LoadingSkeleton'
import { useToast } from '@/components/ui/Toast'
import { Users, Trash2 } from 'lucide-react'

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()

  const load = async () => {
    const data = await fetch('/api/admin/users').then(r => r.json())
    setUsers(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this user?')) return
    await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    showToast('User deleted', 'info')
    load()
  }

  if (loading) return <div><h2 className="text-2xl font-bold mb-6">Users</h2><TableSkeleton /></div>

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <h2 className="text-2xl font-bold mb-6">Users</h2>
      {users.length === 0 ? (
        <EmptyState icon={<Users className="w-12 h-12" />} title="No users" description="Users will appear once they register" />
      ) : (
        <ClayCard hover={false} className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="neu-table">
              <thead><tr><th>ID</th><th>Username</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <motion.tr key={u.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <td>{u.id}</td>
                    <td className="font-semibold">{u.username}</td>
                    <td><span className={`px-3 py-1 rounded-full text-xs font-semibold ${u.role === 'admin' ? 'bg-[#f4a261]/20 text-[#f4a261]' : 'bg-[#6cb8c4]/20 text-[#6cb8c4]'}`}>{u.role}</span></td>
                    <td className="text-sm text-[#6b5a4c] dark:text-[#9c8a7a]">{new Date(u.created_at).toLocaleDateString()}</td>
                    <td>
                      {u.role !== 'admin' ? (
                        <NeuButton variant="danger" size="sm" onClick={() => handleDelete(u.id)}>
                          <Trash2 className="w-3 h-3" /> Delete
                        </NeuButton>
                      ) : (
                        <span className="text-xs text-[#9c8a7a]">Protected</span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </ClayCard>
      )}
    </motion.div>
  )
}
