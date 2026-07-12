import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const replies = db.all(
    `SELECT r.*, a.ig_username FROM auto_replies r
     JOIN ig_accounts a ON r.ig_account_id = a.id
     WHERE a.user_id = ? ORDER BY r.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(replies)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { ig_account_id, name, trigger_type, trigger_keyword, reply_type, message } = await req.json()
  if (!ig_account_id || !name || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const result = db.run(
    'INSERT INTO auto_replies (ig_account_id, name, trigger_type, trigger_keyword, reply_type, message) VALUES (?, ?, ?, ?, ?, ?)',
    [ig_account_id, name, trigger_type || 'keyword', trigger_keyword || null, reply_type || 'dm', message]
  )
  return NextResponse.json({ id: result.lastInsertRowid, name, status: 'active' })
}
