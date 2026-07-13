import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden, logActivity } from '@/lib/helpers'

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
  await prisma.user.deleteMany({
    where: { id: Number(id), role: { not: 'admin' } },
  })
  await logActivity(clerkUser.username || 'admin', 'deleted', `User #${id}`, '')
  return NextResponse.json({ success: true })
}
