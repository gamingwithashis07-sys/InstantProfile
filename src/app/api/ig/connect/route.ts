import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const accounts = db.all(
    'SELECT id, ig_user_id, ig_username, ig_business_id, avatar_url, follower_count, status, created_at FROM ig_accounts WHERE user_id = ? ORDER BY created_at DESC',
    [session.userId]
  )
  return NextResponse.json(accounts)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { ig_user_id, ig_username, ig_business_id, access_token, token_expires_at, avatar_url, follower_count } = await req.json()
  if (!ig_user_id || !ig_username || !access_token) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const result = db.run(
    'INSERT INTO ig_accounts (user_id, ig_user_id, ig_username, ig_business_id, access_token, token_expires_at, avatar_url, follower_count) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [session.userId, ig_user_id, ig_username, ig_business_id || null, access_token, token_expires_at || null, avatar_url || null, follower_count || 0]
  )
  logActivity(session.username, 'connected', `IG: ${ig_username}`, `Account #${result.lastInsertRowid}`)
  return NextResponse.json({ id: result.lastInsertRowid, ig_username, status: 'active' })
}
