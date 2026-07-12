import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const pages = db.all('SELECT * FROM bio_pages WHERE user_id = ? ORDER BY created_at DESC', [session.userId])
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { title, bio, username, avatar_url, theme_color } = await req.json()
  if (!title || !username) return NextResponse.json({ error: 'Title and username required' }, { status: 400 })
  try {
    const r = db.run('INSERT INTO bio_pages (user_id, title, bio, username, avatar_url, theme_color) VALUES (?, ?, ?, ?, ?, ?)', [session.userId, title, bio || '', username, avatar_url || '', theme_color || '#f4a261'])
    return NextResponse.json({ id: r.lastInsertRowid, username })
  } catch {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }
}
