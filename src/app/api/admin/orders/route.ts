import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const queue = db.all(
    `SELECT dq.*, dc.name as campaign_name, ia.ig_username as account_username
     FROM dm_queue dq
     LEFT JOIN dm_campaigns dc ON dq.campaign_id = dc.id
     LEFT JOIN ig_accounts ia ON dq.ig_account_id = ia.id
     ORDER BY dq.created_at DESC`
  )
  return NextResponse.json(queue)
}
