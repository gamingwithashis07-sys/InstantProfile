import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const settings = db.all('SELECT * FROM settings')
  const obj: Record<string, string> = {}
  settings.forEach((s: any) => obj[s.key] = s.value)
  return NextResponse.json(obj)
}

export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const settings = await req.json()
  Object.entries(settings).forEach(([key, value]) => {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', [key, value])
  })
  logActivity(session.username, 'updated', 'Settings', '')
  return NextResponse.json({ success: true })
}
