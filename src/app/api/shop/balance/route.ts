import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const user = db.get('SELECT id, username, balance FROM users WHERE id = ?', [session.userId])
  const transactions = db.all(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
    [session.userId]
  )
  return NextResponse.json({ balance: user?.balance || 0, transactions })
}
