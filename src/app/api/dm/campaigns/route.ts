import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const campaigns = db.all(
    `SELECT c.*, a.ig_username FROM dm_campaigns c
     JOIN ig_accounts a ON c.ig_account_id = a.id
     WHERE a.user_id = ? ORDER BY c.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { ig_account_id, name, message_template, trigger_type, delay_minutes, settings } = await req.json()
  if (!ig_account_id || !name || !message_template) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const settingsJson = settings ? (typeof settings === 'string' ? settings : JSON.stringify(settings)) : '{}'
  const result = db.run(
    'INSERT INTO dm_campaigns (ig_account_id, name, message_template, trigger_type, delay_minutes, settings) VALUES (?, ?, ?, ?, ?, ?)',
    [ig_account_id, name, message_template, trigger_type || 'manual', delay_minutes || 0, settingsJson]
  )
  logActivity(session.username, 'created', `DM Campaign: ${name}`, '')
  return NextResponse.json({ id: result.lastInsertRowid, name, status: 'draft' })
}
