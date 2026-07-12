import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const campaigns = db.all(
    'SELECT dc.*, ia.ig_username as account_username FROM dm_campaigns dc LEFT JOIN ig_accounts ia ON dc.ig_account_id = ia.id ORDER BY dc.created_at DESC'
  )
  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const { ig_account_id, name, message_template, trigger_type, delay_minutes } = await req.json()
  if (!ig_account_id || !name || !message_template) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const result = db.run(
    'INSERT INTO dm_campaigns (ig_account_id, name, message_template, trigger_type, delay_minutes) VALUES (?, ?, ?, ?, ?)',
    [ig_account_id, name, message_template, trigger_type || 'manual', delay_minutes || 0]
  )
  logActivity(session.username, 'created', `Campaign: ${name}`, `Trigger: ${trigger_type || 'manual'}`)
  return NextResponse.json({ id: result.lastInsertRowid, name, status: 'draft' })
}
