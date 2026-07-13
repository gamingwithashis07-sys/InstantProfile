import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden, logActivity } from '@/lib/helpers'

const ALLOWED_KEYS = ['fb_app_id', 'fb_app_secret', 'graph_api_version']

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
  if (!ALLOWED_KEYS.includes(id)) {
    return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
  }

  const { value } = await req.json()
  if (value === undefined) {
    return NextResponse.json({ error: 'Value required' }, { status: 400 })
  }
  await prisma.setting.upsert({
    where: { key: id },
    update: { value: String(value) },
    create: { key: id, value: String(value) },
  })
  await logActivity(clerkUser.username || 'admin', 'updated', `Setting: ${id}`, '')
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
  if (!ALLOWED_KEYS.includes(id)) {
    return NextResponse.json({ error: 'Invalid setting key' }, { status: 400 })
  }

  await prisma.setting.delete({ where: { key: id } })
  await logActivity(clerkUser.username || 'admin', 'deleted', `Setting: ${id}`, '')
  return NextResponse.json({ success: true })
}
