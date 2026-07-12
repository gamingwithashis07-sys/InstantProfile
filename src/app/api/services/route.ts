import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'

export async function GET() {
  await initDB()
  const db = getDB()
  const campaigns = db.all(
    'SELECT dc.*, ia.ig_username as account_username FROM dm_campaigns dc LEFT JOIN ig_accounts ia ON dc.ig_account_id = ia.id WHERE dc.status = ? ORDER BY dc.created_at DESC',
    ['active']
  )
  return NextResponse.json(campaigns)
}
