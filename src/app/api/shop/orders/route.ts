import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'
import crypto from 'crypto'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const orders = getDB().all(
    `SELECT o.*, p.title as product_title, p.slug as product_slug, p.type as product_type
     FROM digital_orders o
     JOIN products p ON o.product_id = p.id
     WHERE o.user_id = ?
     ORDER BY o.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { product_id } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  const product = db.get('SELECT * FROM products WHERE id = ? AND status = ?', [product_id, 'active'])
  if (!product) return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 })
  if (product.user_id === session.userId) return NextResponse.json({ error: 'You cannot purchase your own product' }, { status: 400 })

  const token = crypto.randomBytes(24).toString('hex')

  if (product.price === 0) {
    db.run(
      'INSERT INTO digital_orders (user_id, product_id, amount, download_token, status) VALUES (?, ?, ?, ?, ?)',
      [session.userId, product_id, 0, token, 'completed']
    )
    return NextResponse.json({ success: true, download_token: token, product: { title: product.title, slug: product.slug, file_url: product.file_url } })
  }

  const result = db.run(
    'INSERT INTO digital_orders (user_id, product_id, amount, download_token, status) VALUES (?, ?, ?, ?, ?)',
    [session.userId, product_id, product.price, token, 'pending']
  )

  return NextResponse.json({
    requires_payment: true,
    order_db_id: result.lastInsertRowid,
    amount: product.price,
    product: { title: product.title, slug: product.slug, image_url: product.image_url },
  })
}
