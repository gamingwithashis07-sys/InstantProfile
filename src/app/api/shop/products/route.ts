import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  await initDB()
  const products = getDB().all(
    'SELECT id, title, description, price, type, image_url, slug, status, policies, created_at FROM products WHERE status = ? ORDER BY created_at DESC',
    ['active']
  )
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()
  const { title, description, price, type, file_url, image_url, slug, policies } = await req.json()
  if (!title || !slug) return NextResponse.json({ error: 'Title and slug required' }, { status: 400 })
  try {
    db.run(
      'INSERT INTO products (user_id, title, description, price, type, file_url, image_url, slug, policies) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [session.userId, title, description || '', price || 0, type || 'digital', file_url || '', image_url || '', slug, policies || '{}']
    )
    return NextResponse.json({ success: true, slug })
  } catch {
    return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
  }
}
