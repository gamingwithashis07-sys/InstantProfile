import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB, logActivity } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  const { id } = await params
  await initDB()
  const db = getDB()
  const { status } = await req.json()
  if (!status) return NextResponse.json({ error: 'Status required' }, { status: 400 })
  db.run('UPDATE dm_queue SET status = ? WHERE id = ?', [status, id])
  logActivity(session.username, 'updated', `DM Queue #${id}`, `Status: ${status}`)
  return NextResponse.json({ success: true })
}
