import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, logActivity } from '@/lib/helpers'

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { ig_account_id, recipient_username, message, campaign_id } = await req.json()
  if (!ig_account_id || !recipient_username || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const queueItem = await prisma.dmQueue.create({
    data: {
      igAccountId: ig_account_id,
      recipientUsername: recipient_username,
      message,
      status: 'pending',
      campaignId: campaign_id || null,
    },
  })
  if (campaign_id) {
    await prisma.dmCampaign.update({
      where: { id: campaign_id },
      data: { sentCount: { increment: 1 } },
    })
  }
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user) logActivity(user.username, 'queued DM', `to ${recipient_username}`, message.substring(0, 50))
  return NextResponse.json({ id: queueItem.id, status: 'pending' })
}
