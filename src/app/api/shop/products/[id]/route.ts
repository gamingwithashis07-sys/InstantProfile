import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await initDB()
  const product = getDB().get(
    'SELECT id, user_id, title, description, price, type, file_url, image_url, slug, status, policies, created_at FROM products WHERE id = ?',
    [id]
  )
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorized()
  const { id } = await params
  await initDB()
  const db = getDB()
  const existing = db.get('SELECT * FROM products WHERE id = ?', [id])
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { title, description, price, type, file_url, image_url, slug, status, policies } = await req.json()
  const finalStatus = status || existing.status
  const finalPolicies = policies !== undefined ? policies : (existing.policies || '{}')
  if (finalStatus === 'active') {
    const parsed = JSON.parse(typeof finalPolicies === 'string' ? finalPolicies : JSON.stringify(finalPolicies))
    if (!parsed.privacy_policy || !parsed.refund_policy || !parsed.terms_of_service) {
      return NextResponse.json({ error: 'Privacy policy, refund policy, and terms of service are required before activating' }, { status: 400 })
    }
  }
  db.run(
    'UPDATE products SET title=?, description=?, price=?, type=?, file_url=?, image_url=?, slug=?, status=?, policies=? WHERE id=?',
    [
      title || existing.title, description ?? existing.description, price ?? existing.price,
      type || existing.type, file_url ?? existing.file_url, image_url ?? existing.image_url,
      slug || existing.slug, finalStatus, typeof finalPolicies === 'string' ? finalPolicies : JSON.stringify(finalPolicies), id
    ]
  )
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session) return unauthorized()
  const { id } = await params
  await initDB()
  getDB().run('DELETE FROM products WHERE id = ?', [id])
  return NextResponse.json({ success: true })
}
