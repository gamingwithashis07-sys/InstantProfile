import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, logActivity } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const queue = await prisma.dmQueue.findMany({
    where: { igAccount: { userId } },
    include: {
      campaign: { select: { name: true } },
      igAccount: { select: { igUsername: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = queue.map(q => ({
    ...q,
    campaign_name: q.campaign?.name || null,
    account_username: q.igAccount.igUsername,
    campaign: undefined,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { campaign_id, ig_account_id, recipient_username, message } = await req.json()
  if (!ig_account_id || !recipient_username || !message) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const result = await prisma.dmQueue.create({
    data: {
      campaignId: campaign_id || null,
      igAccountId: ig_account_id,
      recipientUsername: recipient_username,
      message,
      status: 'pending',
    },
  })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  await logActivity(user?.username || '', 'queued dm', `#${result.id}`, `${recipient_username}`)
  return NextResponse.json({ id: result.id, status: 'pending' })
}
