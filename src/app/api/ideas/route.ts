import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  return NextResponse.json(getDB().all('SELECT * FROM content_ideas WHERE user_id = ? ORDER BY created_at DESC', [session.userId]))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const { idea, category } = await req.json()
  if (!idea) return NextResponse.json({ error: 'Idea required' }, { status: 400 })
  const r = getDB().run('INSERT INTO content_ideas (user_id, idea, category) VALUES (?, ?, ?)', [session.userId, idea, category || 'general'])
  return NextResponse.json({ id: r.lastInsertRowid })
}
