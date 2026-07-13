import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden, logActivity } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const campaigns = await prisma.dmCampaign.findMany({
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(campaigns)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const { ig_account_id, name, message_template, trigger_type, delay_minutes } = await req.json()
  if (!ig_account_id || !name || !message_template) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const campaign = await prisma.dmCampaign.create({
    data: {
      igAccountId: Number(ig_account_id),
      name,
      messageTemplate: message_template,
      triggerType: trigger_type || 'manual',
      delayMinutes: delay_minutes || 0,
    },
  })
  await logActivity(clerkUser.username || 'admin', 'created', `Campaign: ${name}`, `Trigger: ${trigger_type || 'manual'}`)
  return NextResponse.json({ id: campaign.id, name, status: 'draft' })
}
