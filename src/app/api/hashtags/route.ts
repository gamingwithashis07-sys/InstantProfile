import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const groups = db.all(
    `SELECT h.*, a.ig_username FROM hashtag_groups h
     JOIN ig_accounts a ON h.ig_account_id = a.id
     WHERE a.user_id = ? ORDER BY h.created_at DESC`,
    [session.userId]
  )
  return NextResponse.json(groups)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { ig_account_id, name, hashtags } = await req.json()
  if (!ig_account_id || !name || !hashtags) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const tags = typeof hashtags === 'string' ? hashtags : hashtags.join(',')
  const result = db.run('INSERT INTO hashtag_groups (ig_account_id, name, hashtags) VALUES (?, ?, ?)', [ig_account_id, name, tags])
  return NextResponse.json({ id: result.lastInsertRowid, name })
}
