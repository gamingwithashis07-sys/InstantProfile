import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const posts = db.all(
    `SELECT p.*, a.ig_username FROM scheduled_posts p
     JOIN ig_accounts a ON p.ig_account_id = a.id
     WHERE a.user_id = ? ORDER BY p.scheduled_at DESC`,
    [session.userId]
  )
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { ig_account_id, media_type, caption, media_url, scheduled_at } = await req.json()
  if (!ig_account_id || !media_url || !scheduled_at) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const result = db.run(
    'INSERT INTO scheduled_posts (ig_account_id, media_type, caption, media_url, scheduled_at) VALUES (?, ?, ?, ?, ?)',
    [ig_account_id, media_type || 'image', caption || '', media_url, scheduled_at]
  )
  return NextResponse.json({ id: result.lastInsertRowid, status: 'scheduled' })
}
