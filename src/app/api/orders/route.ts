import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  await initDB()
  const db = getDB()
  const session = await getSession()
  if (!session) return unauthorized()
  const queue = db.all(
    `SELECT dq.*, dc.name as campaign_name, ia.ig_username as account_username
     FROM dm_queue dq
     LEFT JOIN dm_campaigns dc ON dq.campaign_id = dc.id
     LEFT JOIN ig_accounts ia ON dq.ig_account_id = ia.id
     WHERE ia.user_id = ?
     ORDER BY dq.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(queue)
}

export async function POST(req: NextRequest) {
  await initDB()
  const db = getDB()
  const session = await getSession()
  if (!session) return unauthorized()

  const { campaign_id, ig_account_id, recipient_username, message } = await req.json()
  if (!ig_account_id || !recipient_username || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const result = db.run(
    'INSERT INTO dm_queue (campaign_id, ig_account_id, recipient_username, message, status) VALUES (?, ?, ?, ?, ?)',
    [campaign_id || null, ig_account_id, recipient_username, message, 'pending']
  )
  logActivity(session.username, 'queued dm', `#${result.lastInsertRowid}`, `${recipient_username}`)
  return NextResponse.json({ id: result.lastInsertRowid, status: 'pending' })
}
