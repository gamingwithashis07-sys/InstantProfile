import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { product_id } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  const product = db.get('SELECT * FROM products WHERE id = ? AND status = ?', [product_id, 'active'])
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  if (product.user_id === session.userId) return NextResponse.json({ error: 'You cannot purchase your own product' }, { status: 400 })

  const settings = db.all('SELECT key, value FROM settings')
  const settingsMap = Object.fromEntries(settings.map((s: any) => [s.key, s.value]))

  const token = crypto.randomBytes(24).toString('hex')
  const amountPaise = Math.round(product.price * 100)

  const razorpayOrderId = `rzp_order_${crypto.randomBytes(12).toString('hex')}`

  const result = db.run(
    'INSERT INTO digital_orders (user_id, product_id, amount, download_token, status, razorpay_order_id) VALUES (?, ?, ?, ?, ?, ?)',
    [session.userId, product_id, product.price, token, 'pending', razorpayOrderId]
  )

  return NextResponse.json({
    order_id: result.lastInsertRowid,
    razorpay_order_id: razorpayOrderId,
    amount: amountPaise,
    currency: 'INR',
    product: { title: product.title, slug: product.slug, image_url: product.image_url },
    key: settingsMap.razorpay_key_id || '',
  })
}
