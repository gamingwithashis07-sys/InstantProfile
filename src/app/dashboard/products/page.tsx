'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit3, Trash2, BookOpen, FileText, Sparkles, Download, Shield, FileCheck } from 'lucide-react'
import { ClayCard } from '@/components/ui/ClayCard'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
import { NeuInput } from '@/components/ui/NeuInput'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'

const typeIcons: Record<string, any> = {
  course: BookOpen,
  pdf: FileText,
  template: Sparkles,
}

const policyLabels: Record<string, string> = {
  privacy_policy: 'Privacy Policy',
  refund_policy: 'Refund Policy',
  terms_of_service: 'Terms of Service',
  shipping_policy: 'Shipping Policy',
}

const defaultPolicyTypes = ['privacy_policy', 'refund_policy', 'terms_of_service']

export default function ManageProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', description: '', price: '0', type: 'digital', slug: '', image_url: '', file_url: '' })
  const [saving, setSaving] = useState(false)
  const [policies, setPolicies] = useState<Record<string, string>>({})
  const [showPolicies, setShowPolicies] = useState(false)
  const [genOpen, setGenOpen] = useState(false)
  const [genForm, setGenForm] = useState({ business_name: '', email: '', product_type: 'digital product' })
  const [genType, setGenType] = useState('privacy_policy')
  const [generating, setGenerating] = useState(false)
  const { showToast } = useToast()

  const fetchProducts = async () => {
    const res = await fetch('/api/shop/products')
    const all = await res.json()
    setProducts(all)
    setLoading(false)
  }

  useEffect(() => { fetchProducts() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm({ title: '', description: '', price: '0', type: 'digital', slug: '', image_url: '', file_url: '' })
    setPolicies({})
    setShowPolicies(false)
    setShowModal(true)
  }

  const openEdit = (p: any) => {
    setEditing(p)
    setForm({ title: p.title, description: p.description || '', price: String(p.price), type: p.type, slug: p.slug, image_url: p.image_url || '', file_url: p.file_url || '' })
    let parsed: Record<string, string> = {}
    try { parsed = JSON.parse(p.policies || '{}') } catch {}
    setPolicies(parsed)
    setShowPolicies(false)
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.title || !form.slug) { showToast('Title and slug required', 'error'); return }
    setSaving(true)
    const body = { ...form, price: parseFloat(form.price) || 0, policies: JSON.stringify(policies) }
    if (editing) {
      const res = await fetch(`/api/shop/products/${editing.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) { showToast(data.error, 'error'); setSaving(false); return }
    } else {
      const res = await fetch('/api/shop/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (data.error) { showToast(data.error, 'error'); setSaving(false); return }
    }
    setSaving(false)
    setShowModal(false)
    showToast(editing ? 'Product updated' : 'Product created', 'success')
    fetchProducts()
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this product?')) return
    await fetch(`/api/shop/products/${id}`, { method: 'DELETE' })
    showToast('Product deleted', 'info')
    fetchProducts()
  }

  const handleGenerate = async (type: string) => {
    setGenerating(true)
    const res = await fetch('/api/shop/policies/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, ...genForm }),
    })
    const data = await res.json()
    setGenerating(false)
    if (data[type]) {
      setPolicies(prev => ({ ...prev, [type]: data[type] }))
      showToast(`${policyLabels[type] || type} generated!`, 'success')
    }
  }

  const handleGenerateAll = async () => {
    setGenerating(true)
    const res = await fetch('/api/shop/policies/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'all', ...genForm }),
    })
    const data = await res.json()
    setGenerating(false)
    setPolicies(prev => ({ ...prev, ...data }))
    showToast('All policies generated!', 'success')
    setGenOpen(false)
  }

  const hasRequiredPolicies = () => {
    return defaultPolicyTypes.every(t => policies[t]?.trim())
  }

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Manage Products</h2>
        <NeuButton variant="primary" onClick={openCreate}>
          <Plus className="w-4 h-4" /> Add Product
        </NeuButton>
      </div>

      {products.length === 0 ? (
        <ClayCard className="text-center py-12">
          <Download className="w-12 h-12 mx-auto mb-3 text-[#9c8a7a]" />
          <p>No products yet. Create your first digital product.</p>
        </ClayCard>
      ) : (
        <div className="grid gap-3">
          {products.map((p, i) => {
            const Icon = typeIcons[p.type] || Download
            let policyCount = 0
            try { const pp = JSON.parse(p.policies || '{}'); policyCount = Object.keys(pp).length } catch {}
            return (
              <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <ClayCard>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#f4a261] to-[#e07c3c] flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{p.title}</p>
                        <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">${p.price.toFixed(2)} &middot; {p.type} &middot; /{p.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span title={`${policyCount} policies`} className={`text-xs px-1.5 py-0.5 rounded-full ${policyCount >= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                        <Shield className="w-3 h-3 inline mr-0.5" />{policyCount}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${p.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {p.status}
                      </span>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                        <Edit3 className="w-4 h-4 text-[#9c8a7a]" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
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

      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <GlassCard className="p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{editing ? 'Edit Product' : 'New Product'}</h3>
            <div className="flex gap-1">
              <button
                onClick={() => setShowPolicies(false)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${!showPolicies ? 'bg-[#f4a261]/20 text-[#f4a261]' : 'text-[#9c8a7a] hover:text-white'}`}
              >
                Details
              </button>
              <button
                onClick={() => setShowPolicies(true)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${showPolicies ? 'bg-[#f4a261]/20 text-[#f4a261]' : 'text-[#9c8a7a] hover:text-white'}`}
              >
                Policies {!hasRequiredPolicies() && <span className="text-red-400 ml-0.5">*</span>}
              </button>
            </div>
          </div>

          {!showPolicies ? (
            <div className="flex flex-col gap-3">
              <NeuInput label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
              <div className="flex gap-3">
                <NeuInput label="Slug" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="my-course" required className="flex-1" />
                <div className="flex-1">
                  <label className="block text-xs font-medium text-[#6b5a4c] dark:text-[#9c8a7a] mb-1">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2.5 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm">
                    <option value="digital">Digital</option>
                    <option value="course">Course</option>
                    <option value="pdf">PDF</option>
                    <option value="template">Template</option>
                  </select>
                </div>
              </div>
              <NeuInput label="Price ($)" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
              <NeuInput label="Image URL" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} />
              <NeuInput label="File URL" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} />
              <label className="block text-xs font-medium text-[#6b5a4c] dark:text-[#9c8a7a]">Description</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full p-3 rounded-[14px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-sm min-h-[80px]" />
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a]">
                  Required: Privacy Policy, Refund Policy, Terms of Service
                </p>
                <button
                  onClick={() => setGenOpen(true)}
                  className="flex items-center gap-1 text-xs text-[#f4a261] hover:underline"
                >
                  <FileCheck className="w-3.5 h-3.5" /> Generator
                </button>
              </div>

              {defaultPolicyTypes.map(type => (
                <div key={type}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[#6b5a4c] dark:text-[#9c8a7a]">
                      {policyLabels[type] || type}
                      <span className="text-red-400 ml-0.5">*</span>
                    </label>
                    <button
                      onClick={() => handleGenerate(type)}
                      className="text-[10px] text-[#f4a261] hover:underline"
                    >
                      Generate
                    </button>
                  </div>
                  <textarea
                    value={policies[type] || ''}
                    onChange={e => setPolicies(prev => ({ ...prev, [type]: e.target.value }))}
                    className="w-full p-2.5 rounded-[12px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-xs min-h-[80px]"
                    placeholder={`Enter your ${policyLabels[type].toLowerCase()}...`}
                    required
                  />
                </div>
              ))}

              <details className="text-xs">
                <summary className="cursor-pointer text-[#9c8a7a] hover:text-[#f4a261]">Additional policies (optional)</summary>
                <div className="mt-3 space-y-3">
                  {Object.entries(policyLabels).filter(([k]) => !defaultPolicyTypes.includes(k)).map(([type, label]) => (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-medium text-[#6b5a4c] dark:text-[#9c8a7a]">{label}</label>
                        <button onClick={() => handleGenerate(type)} className="text-[10px] text-[#f4a261] hover:underline">Generate</button>
                      </div>
                      <textarea
                        value={policies[type] || ''}
                        onChange={e => setPolicies(prev => ({ ...prev, [type]: e.target.value }))}
                        className="w-full p-2.5 rounded-[12px] bg-[#ece7e1] dark:bg-[#2a2522] border-2 border-transparent focus:border-[#f4a261] outline-none text-xs min-h-[60px]"
                        placeholder={`Enter your ${label.toLowerCase()}...`}
                      />
                    </div>
                  ))}
                </div>
              </details>

              {!hasRequiredPolicies() && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <Shield className="w-3 h-3" /> All required policies must be filled before the product can be activated
                </p>
              )}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            <NeuButton variant="ghost" onClick={() => setShowModal(false)} className="flex-1">Cancel</NeuButton>
            <NeuButton variant="primary" onClick={handleSave} loading={saving} className="flex-1">
              {editing ? 'Update' : 'Create'}
            </NeuButton>
          </div>
        </GlassCard>
      </Modal>

      <Modal open={genOpen} onClose={() => setGenOpen(false)}>
        <GlassCard className="p-6 w-full max-w-sm">
          <h3 className="text-lg font-bold mb-4">Policy Generator</h3>
          <div className="flex flex-col gap-3">
            <NeuInput label="Business Name" value={genForm.business_name} onChange={e => setGenForm({ ...genForm, business_name: e.target.value })} placeholder="My Store" />
            <NeuInput label="Email" type="email" value={genForm.email} onChange={e => setGenForm({ ...genForm, email: e.target.value })} placeholder="support@example.com" />
            <NeuInput label="Product Type" value={genForm.product_type} onChange={e => setGenForm({ ...genForm, product_type: e.target.value })} placeholder="digital product" />
            <div className="flex gap-2 mt-2">
              <NeuButton variant="ghost" onClick={() => setGenOpen(false)} className="flex-1">Cancel</NeuButton>
              <NeuButton variant="primary" onClick={handleGenerateAll} loading={generating} className="flex-1">
                <FileCheck className="w-4 h-4" /> Generate All
              </NeuButton>
            </div>
          </div>
        </GlassCard>
      </Modal>
    </motion.div>
  )
}
