import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'
import crypto from 'crypto'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const links = getDB().all('SELECT * FROM short_links WHERE user_id = ? ORDER BY created_at DESC', [session.userId])
  return NextResponse.json(links)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { target_url, title, slug } = await req.json()
  if (!target_url) return NextResponse.json({ error: 'Target URL required' }, { status: 400 })
  const finalSlug = slug || crypto.randomBytes(4).toString('hex')
  try {
    db.run('INSERT INTO short_links (user_id, slug, target_url, title) VALUES (?, ?, ?, ?)', [session.userId, finalSlug, target_url, title || ''])
    return NextResponse.json({ slug: finalSlug, short_url: `/go/${finalSlug}`, target_url })
  } catch {
    return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
  }
}
