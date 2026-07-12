import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  return NextResponse.json(getDB().all('SELECT * FROM qr_codes WHERE user_id = ? ORDER BY created_at DESC', [session.userId]))
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const { title, target_url, bg_color, fg_color } = await req.json()
  if (!title || !target_url) return NextResponse.json({ error: 'Title and URL required' }, { status: 400 })
  const r = getDB().run('INSERT INTO qr_codes (user_id, title, target_url, bg_color, fg_color) VALUES (?, ?, ?, ?, ?)', [session.userId, title, target_url, bg_color || '#ffffff', fg_color || '#000000'])
  return NextResponse.json({ id: r.lastInsertRowid, qr_url: `/api/qrcode/${r.lastInsertRowid}/image` })
}
