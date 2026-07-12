import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const queue = db.all(
    `SELECT q.*, a.ig_username as account_name FROM dm_queue q
     JOIN ig_accounts a ON q.ig_account_id = a.id
     WHERE a.user_id = ? ORDER BY q.created_at DESC LIMIT 50`,
    [session.userId]
  )
  return NextResponse.json(queue)
}
