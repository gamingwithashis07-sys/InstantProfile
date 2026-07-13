import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden, logActivity } from '@/lib/helpers'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const { id } = await params
  const { ig_account_id, name, message_template, trigger_type, delay_minutes, status } = await req.json()
  const data: Record<string, any> = {}
  if (ig_account_id !== undefined) data.igAccountId = Number(ig_account_id)
  if (name !== undefined) data.name = name
  if (message_template !== undefined) data.messageTemplate = message_template
  if (trigger_type !== undefined) data.triggerType = trigger_type
  if (delay_minutes !== undefined) data.delayMinutes = delay_minutes
  if (status !== undefined) data.status = status

  await prisma.dmCampaign.update({ where: { id: Number(id) }, data })
  await logActivity(clerkUser.username || 'admin', 'updated', `Campaign #${id}`, name || '')
  return NextResponse.json({ success: true })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const { id } = await params
  await prisma.dmCampaign.delete({ where: { id: Number(id) } })
  await logActivity(clerkUser.username || 'admin', 'deleted', `Campaign #${id}`, '')
  return NextResponse.json({ success: true })
}
