import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()
  await initDB()
  const db = getDB()
  const queue = db.all(
    `SELECT q.*, u.username, a.ig_username as account_name FROM dm_queue q
     JOIN ig_accounts a ON q.ig_account_id = a.id
     JOIN users u ON a.user_id = u.id
     ORDER BY q.created_at DESC`
  )
  return NextResponse.json(queue)
}
