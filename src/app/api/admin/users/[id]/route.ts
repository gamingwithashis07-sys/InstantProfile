import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  const { id } = await params
  await initDB()
  const db = getDB()
  db.run('DELETE FROM users WHERE id = ? AND role != ?', [id, 'admin'])
  logActivity(session.username, 'deleted', `User #${id}`, '')
  return NextResponse.json({ success: true })
}
