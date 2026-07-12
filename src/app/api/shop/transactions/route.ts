import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const transactions = getDB().all(
    `SELECT t.*, o.product_id, p.title as product_title
     FROM transactions t
     LEFT JOIN digital_orders o ON t.order_id = o.id
     LEFT JOIN products p ON o.product_id = p.id
     WHERE t.user_id = ?
     ORDER BY t.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(transactions)
}
