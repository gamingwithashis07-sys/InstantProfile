import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'

export async function GET() {
  await initDB()
  const db = getDB()
  const settings = db.all('SELECT * FROM settings')
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  await initDB()
  const db = getDB()
  const entries = await req.json()
  if (!Array.isArray(entries)) {
    return NextResponse.json({ error: 'Expected array of {key, value}' }, { status: 400 })
  }
  for (const { key, value } of entries) {
    const existing = db.get('SELECT key FROM settings WHERE key = ?', [key])
    if (existing) {
      db.run('UPDATE settings SET value = ? WHERE key = ?', [value, key])
    } else {
      db.run('INSERT INTO settings (key, value) VALUES (?, ?)', [key, value])
    }
  }
  return NextResponse.json({ success: true })
}
