import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const scheduled = db.all(
    `SELECT p.*, a.ig_username FROM scheduled_posts p
     JOIN ig_accounts a ON p.ig_account_id = a.id
     WHERE a.user_id = ? AND p.status = 'scheduled' ORDER BY p.scheduled_at ASC`,
    [session.userId]
  )
  return NextResponse.json(scheduled)
}
