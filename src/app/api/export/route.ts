import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminUserId, unauthorized, forbidden } from '@/lib/helpers'

export async function GET(req: NextRequest) {
  try {
    await requireAdminUserId(req)
  } catch (e: any) {
    if (e.message === 'Unauthorized') return unauthorized(req)
    if (e.message === 'Forbidden') return forbidden(req)
    return unauthorized(req)
  }

  const type = req.nextUrl.searchParams.get('type') || 'dm_queue'

  let csv = ''

  if (type === 'dm_queue') {
    const data = await prisma.dmQueue.findMany({
      include: {
        campaign: { select: { name: true } },
        igAccount: { select: { igUsername: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    csv = 'ID,Campaign,Account,Recipient,Message,Status,Created'
    data.forEach(r => {
      csv += `\n${r.id},${r.campaign?.name || ''},${r.igAccount.igUsername || ''},${r.recipientUsername},"${(r.message || '').replace(/"/g, '""')}",${r.status},${r.createdAt}`
    })
  } else if (type === 'dm_campaigns') {
    const data = await prisma.dmCampaign.findMany({
      include: { igAccount: { select: { igUsername: true } } },
      orderBy: { createdAt: 'desc' },
    })
    csv = 'ID,Name,Account,Trigger,Delay,Status,Sent,Created'
    data.forEach(r => {
      csv += `\n${r.id},${r.name},${r.igAccount.igUsername || ''},${r.triggerType},${r.delayMinutes},${r.status},${r.sentCount},${r.createdAt}`
    })
  } else if (type === 'ig_accounts') {
    const data = await prisma.igAccount.findMany({ orderBy: { createdAt: 'desc' } })
    csv = 'ID,User ID,Username,Business ID,Followers,Status,Created'
    data.forEach(r => {
      csv += `\n${r.id},${r.igUserId},${r.igUsername},${r.igBusinessId || ''},${r.followerCount},${r.status},${r.createdAt}`
    })
  }

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${type}-export.csv"`,
    },
  })
}
