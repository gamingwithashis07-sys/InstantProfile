import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()
  await initDB()
  const db = getDB()
  const accounts = db.all('SELECT i.*, u.username FROM ig_accounts i JOIN users u ON i.user_id = u.id ORDER BY i.created_at DESC')
  return NextResponse.json(accounts)
}

export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()
  await initDB()
  const db = getDB()
  const { id } = await req.json()
  db.run('DELETE FROM ig_accounts WHERE id = ?', [id])
  return NextResponse.json({ success: true })
}
