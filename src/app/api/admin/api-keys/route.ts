import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const keys = ['fb_app_id', 'fb_app_secret', 'graph_api_version'].map(key => {
    const row = db.get('SELECT * FROM settings WHERE key = ?', [key])
    return row || { key, value: '' }
  })
  return NextResponse.json(keys)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const { fb_app_id, fb_app_secret, graph_api_version } = await req.json()
  if (fb_app_id !== undefined) {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['fb_app_id', fb_app_id])
  }
  if (fb_app_secret !== undefined) {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['fb_app_secret', fb_app_secret])
  }
  if (graph_api_version !== undefined) {
    db.run('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)', ['graph_api_version', graph_api_version])
  }
  logActivity(session.username, 'updated', 'Facebook API Credentials', '')
  return NextResponse.json({ success: true })
}
