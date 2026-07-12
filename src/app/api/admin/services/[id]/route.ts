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
  const { ig_account_id, name, message_template, trigger_type, delay_minutes, status } = await req.json()
  db.run(
    `UPDATE dm_campaigns SET
      ig_account_id = COALESCE(?, ig_account_id),
      name = COALESCE(?, name),
      message_template = COALESCE(?, message_template),
      trigger_type = COALESCE(?, trigger_type),
      delay_minutes = COALESCE(?, delay_minutes),
      status = COALESCE(?, status)
     WHERE id = ?`,
    [ig_account_id, name, message_template, trigger_type, delay_minutes, status, id]
  )
  logActivity(session.username, 'updated', `Campaign #${id}`, name || '')
  return NextResponse.json({ success: true })
}

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
  db.run('DELETE FROM dm_campaigns WHERE id = ?', [id])
  logActivity(session.username, 'deleted', `Campaign #${id}`, '')
  return NextResponse.json({ success: true })
}
