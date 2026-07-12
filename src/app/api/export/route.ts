import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const type = req.nextUrl.searchParams.get('type') || 'dm_queue'

  let csv = ''

  if (type === 'dm_queue') {
    const data = db.all(
      'SELECT dq.*, dc.name as campaign_name, ia.ig_username as account_username FROM dm_queue dq LEFT JOIN dm_campaigns dc ON dq.campaign_id = dc.id LEFT JOIN ig_accounts ia ON dq.ig_account_id = ia.id'
    )
    csv = 'ID,Campaign,Account,Recipient,Message,Status,Created'
    data.forEach((r: any) => {
      csv += `\n${r.id},${r.campaign_name || ''},${r.account_username || ''},${r.recipient_username},"${(r.message || '').replace(/"/g, '""')}",${r.status},${r.created_at}`
    })
  } else if (type === 'dm_campaigns') {
    const data = db.all(
      'SELECT dc.*, ia.ig_username as account_username FROM dm_campaigns dc LEFT JOIN ig_accounts ia ON dc.ig_account_id = ia.id'
    )
    csv = 'ID,Name,Account,Trigger,Delay,Status,Sent,Created'
    data.forEach((r: any) => {
      csv += `\n${r.id},${r.name},${r.account_username || ''},${r.trigger_type},${r.delay_minutes},${r.status},${r.sent_count},${r.created_at}`
    })
  } else if (type === 'ig_accounts') {
    const data = db.all('SELECT * FROM ig_accounts')
    csv = 'ID,User ID,Username,Business ID,Followers,Status,Created'
    data.forEach((r: any) => {
      csv += `\n${r.id},${r.ig_user_id},${r.ig_username},${r.ig_business_id || ''},${r.follower_count},${r.status},${r.created_at}`
    })
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}-export.csv"`,
    },
  })
}
