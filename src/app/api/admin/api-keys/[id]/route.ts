import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

const ALLOWED_KEYS = ['fb_app_id', 'fb_app_secret', 'graph_api_version']

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  const { id } = await params
  if (!ALLOWED_KEYS.includes(id)) {
    return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
  }

  await initDB()
  const db = getDB()
  const { value } = await req.json()
  if (value === undefined) {
    return NextResponse.json({ error: 'Value required' }, { status: 400 })
  }
  db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [id, value])
  logActivity(session.username, 'updated', `Setting: ${id}`, '')
  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  const { id } = await params
  if (!ALLOWED_KEYS.includes(id)) {
    return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
  }

  await initDB()
  const db = getDB()
  db.run('DELETE FROM settings WHERE key = ?', [id])
  logActivity(session.username, 'deleted', `Setting: ${id}`, '')
  return NextResponse.json({ success: true })
}
