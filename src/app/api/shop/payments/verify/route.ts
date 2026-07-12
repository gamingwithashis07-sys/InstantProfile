import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { razorpay_order_id, payment_id, order_db_id } = await req.json()

  if (!razorpay_order_id || !payment_id || !order_db_id) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
  }

  const order = db.get('SELECT * FROM digital_orders WHERE id = ? AND user_id = ?', [order_db_id, session.userId])
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.status !== 'pending') return NextResponse.json({ error: 'Order already processed' }, { status: 400 })

  const product = db.get('SELECT * FROM products WHERE id = ?', [order.product_id])
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  db.run(
    'UPDATE digital_orders SET status = ?, payment_id = ? WHERE id = ?',
    ['completed', payment_id, order_db_id]
  )

  db.run(
    'UPDATE users SET balance = COALESCE(balance, 0) + ? WHERE id = ?',
    [order.amount, product.user_id]
  )

  db.run(
    'INSERT INTO transactions (user_id, order_id, amount, type, description, status) VALUES (?, ?, ?, ?, ?, ?)',
    [product.user_id, order_db_id, order.amount, 'credit', `Sale: ${product.title}`, 'completed']
  )

  return NextResponse.json({
    success: true,
    download_token: order.download_token,
    product: { title: product.title, slug: product.slug, file_url: product.file_url },
  })
}
