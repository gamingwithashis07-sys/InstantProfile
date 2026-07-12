import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'

// Public endpoint to render a bio page
export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')
  if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })
  await initDB()
  const db = getDB()
  const page = db.get('SELECT * FROM bio_pages WHERE username = ?', [username])
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const links = db.all('SELECT * FROM bio_links WHERE bio_page_id = ? ORDER BY sort_order ASC', [page.id])
  return NextResponse.json({ ...page, links })
}
