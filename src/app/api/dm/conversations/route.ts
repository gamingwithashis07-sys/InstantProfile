import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const conversations = db.all(
    `SELECT c.*, a.ig_username as account_name FROM dm_conversations c
     JOIN ig_accounts a ON c.ig_account_id = a.id
     WHERE a.user_id = ? ORDER BY c.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(conversations)
}
