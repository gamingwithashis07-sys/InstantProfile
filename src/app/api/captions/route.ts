import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  return NextResponse.json(getDB().all('SELECT * FROM caption_templates WHERE user_id = ? ORDER BY created_at DESC', [session.userId]))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const { title, content, category } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
  const r = getDB().run('INSERT INTO caption_templates (user_id, title, content, category) VALUES (?, ?, ?, ?)', [session.userId, title, content, category || 'general'])
  return NextResponse.json({ id: r.lastInsertRowid })
}
