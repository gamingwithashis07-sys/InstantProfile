'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Download, ShoppingCart, CheckCircle, BookOpen, FileText, Sparkles, Shield, ChevronDown } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeuButton } from '@/components/ui/NeuButton'
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

declare global {
  interface Window {
    Razorpay: any
  }
}

export default function ProductDetail() {
  const { slug } = useParams()
  const router = useRouter()
  const { showToast } = useToast()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [buying, setBuying] = useState(false)
  const [purchased, setPurchased] = useState<any>(null)
  const [authed, setAuthed] = useState(false)
  const [policies, setPolicies] = useState<Record<string, string>>({})
  const [openPolicy, setOpenPolicy] = useState<string | null>(null)
  const [razorpayLoaded, setRazorpayLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => setRazorpayLoaded(true)
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setAuthed(!!d.id))
    fetch(`/api/shop/products`)
      .then(r => r.json())
      .then(products => {
        const p = products.find((x: any) => x.slug === slug)
        setProduct(p || null)
        if (p?.policies) {
          try { setPolicies(JSON.parse(p.policies)) } catch {}
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const handleBuy = async () => {
    if (!authed) { router.push('/dashboard'); return }
    if (!product) return
    setBuying(true)

    if (product.price === 0) {
      const res = await fetch('/api/shop/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_id: product.id }),
      })
      const data = await res.json()
      setBuying(false)
      if (data.success) {
        setPurchased(data)
        showToast('Free product acquired!', 'success')
      } else {
        showToast(data.error || 'Failed', 'error')
      }
      return
    }

    const orderRes = await fetch('/api/shop/payments/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: product.id }),
    })
    const orderData = await orderRes.json()
    setBuying(false)

    if (orderData.error) {
      showToast(orderData.error, 'error')
      return
    }

    if (!window.Razorpay) {
      showToast('Payment gateway loading. Please try again.', 'error')
      return
    }

    const options = {
      key: orderData.key,
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: product.title,
      description: `Purchase of ${product.title}`,
      image: product.image_url || '',
      order_id: orderData.razorpay_order_id,
      handler: async function (response: any) {
        const verifyRes = await fetch('/api/shop/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_order_id: response.razorpay_order_id,
            payment_id: response.razorpay_payment_id,
            order_db_id: orderData.order_id,
          }),
        })
        const verifyData = await verifyRes.json()
        if (verifyData.success) {
          setPurchased(verifyData)
          showToast('Payment successful!', 'success')
        } else {
          showToast(verifyData.error || 'Payment verification failed', 'error')
        }
      },
      modal: {
        ondismiss: function () {
          showToast('Payment cancelled', 'warning')
        },
      },
      prefill: {
        contact: '',
        email: '',
      },
      theme: {
        color: '#f4a261',
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#f4a261] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <GlassCard className="text-center py-16 px-8">
        <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-[#9c8a7a]" />
        <h2 className="text-xl font-semibold mb-2">Product not found</h2>
        <Link href="/shop"><NeuButton variant="primary"><ArrowLeft className="w-4 h-4" /> Back to Shop</NeuButton></Link>
      </GlassCard>
    </div>
  )

  const Icon = typeIcons[product.type] || Download
  const policyEntries = Object.entries(policies).filter(([, v]) => v.trim())

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link href="/shop">
          <NeuButton variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4" /> Back
          </NeuButton>
        </Link>

        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3">
            {product.image_url && (
              <div className="w-full h-56 rounded-[20px] overflow-hidden mb-6">
                <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-[14px] bg-gradient-to-br from-[#f4a261] to-[#e07c3c] flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{product.title}</h1>
                <span className="text-xs capitalize text-[#f4a261]">{product.type}</span>
              </div>
            </div>
            <p className="text-[#6b5a4c] dark:text-[#9c8a7a] leading-relaxed mb-8">
              {product.description || 'No description available.'}
            </p>

            {policyEntries.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider text-[#6b5a4c] dark:text-[#9c8a7a] mb-3 flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Policies
                </h3>
                <div className="flex flex-col gap-2">
                  {policyEntries.map(([type, content]) => (
                    <div key={type} className="border border-white/10 dark:border-white/5 rounded-[14px] overflow-hidden">
                      <button
                        onClick={() => setOpenPolicy(openPolicy === type ? null : type)}
                        className="w-full flex items-center justify-between p-3 text-sm font-medium hover:bg-white/5 transition-colors text-left"
                      >
                        <span>{policyLabels[type] || type.replace(/_/g, ' ')}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${openPolicy === type ? 'rotate-180' : ''}`} />
                      </button>
                      {openPolicy === type && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          className="px-3 pb-3"
                        >
                          <div className="text-xs text-[#6b5a4c] dark:text-[#9c8a7a] whitespace-pre-wrap leading-relaxed border-t border-white/10 pt-3">
                            {content}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="md:col-span-2">
            <GlassCard className="p-6 sticky top-[90px]">
              <p className="text-3xl font-bold text-[#f4a261] mb-4">
                {product.price > 0 ? `₹${product.price.toFixed(2)}` : 'Free'}
              </p>

              {purchased ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Purchased!</span>
                  </div>
                  {product.file_url && (
                    <a href={product.file_url} target="_blank" rel="noopener noreferrer">
                      <NeuButton variant="primary" size="lg" className="w-full">
                        <Download className="w-4 h-4" /> Download
                      </NeuButton>
                    </a>
                  )}
                  <Link href={`/order`}>
                    <NeuButton variant="default" size="sm" className="w-full">View My Orders</NeuButton>
                  </Link>
                </div>
              ) : (
                <NeuButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  loading={buying}
                  onClick={handleBuy}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {authed ? (product.price > 0 ? 'Pay Now' : 'Get Free') : 'Login to Purchase'}
                </NeuButton>
              )}

              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[#9c8a7a] space-y-1">
                <p>Secure payment via Razorpay</p>
                <p>Instant download after purchase</p>
                <p>Amount credited directly to creator</p>
              </div>
            </GlassCard>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
