import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'

export async function POST(req: NextRequest) {
  await initDB()
  const db = getDB()
  const { bio_page_id, title, url, icon, sort_order } = await req.json()
  if (!bio_page_id || !title || !url) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const r = db.run('INSERT INTO bio_links (bio_page_id, title, url, icon, sort_order) VALUES (?, ?, ?, ?, ?)', [bio_page_id, title, url, icon || '', sort_order || 0])
  return NextResponse.json({ id: r.lastInsertRowid })
}

export async function DELETE(req: NextRequest) {
  await initDB()
  const db = getDB()
  const { id } = await req.json()
  db.run('DELETE FROM bio_links WHERE id = ?', [id])
  return NextResponse.json({ success: true })
}
