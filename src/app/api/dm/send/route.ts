import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { ig_account_id, recipient_username, message, campaign_id } = await req.json()
  if (!ig_account_id || !recipient_username || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const result = db.run(
    'INSERT INTO dm_queue (ig_account_id, recipient_username, message, status, campaign_id) VALUES (?, ?, ?, ?, ?)',
    [ig_account_id, recipient_username, message, 'pending', campaign_id || null]
  )
  if (campaign_id) {
    db.run('UPDATE dm_campaigns SET sent_count = sent_count + 1 WHERE id = ?', [campaign_id])
  }
  logActivity(session.username, 'queued DM', `to ${recipient_username}`, message.substring(0, 50))
  return NextResponse.json({ id: result.lastInsertRowid, status: 'pending' })
}
