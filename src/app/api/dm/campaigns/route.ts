import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, logActivity } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const campaigns = await prisma.dmCampaign.findMany({
    where: { igAccount: { userId } },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = campaigns.map(c => ({
    ...c,
    ig_username: c.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { ig_account_id, name, message_template, trigger_type, delay_minutes, settings } = await req.json()
  if (!ig_account_id || !name || !message_template) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const settingsJson = settings ? (typeof settings === 'string' ? settings : JSON.stringify(settings)) : '{}'
  const campaign = await prisma.dmCampaign.create({
    data: {
      igAccountId: ig_account_id,
      name,
      messageTemplate: message_template,
      triggerType: trigger_type || 'manual',
      delayMinutes: delay_minutes || 0,
      settings: settingsJson,
    },
  })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (user) logActivity(user.username, 'created', `DM Campaign: ${name}`, '')
  return NextResponse.json({ id: campaign.id, name, status: 'draft' })
}
