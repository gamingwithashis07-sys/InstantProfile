import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()
  await initDB()
  const db = getDB()
  const campaigns = db.all(
    `SELECT c.*, u.username, a.ig_username FROM dm_campaigns c
     JOIN ig_accounts a ON c.ig_account_id = a.id
     JOIN users u ON a.user_id = u.id
     ORDER BY c.created_at DESC`
  )
  return NextResponse.json(campaigns)
}
