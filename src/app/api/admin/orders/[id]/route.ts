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
  const { status } = await req.json()
  if (!status) return NextResponse.json({ error: 'Status required' }, { status: 400 })
  await prisma.dmQueue.update({ where: { id: Number(id) }, data: { status } })
  await logActivity(clerkUser.username || 'admin', 'updated', `DM Queue #${id}`, `Status: ${status}`)
  return NextResponse.json({ success: true })
}
