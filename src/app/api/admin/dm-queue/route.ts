import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const queue = await prisma.dmQueue.findMany({
    include: {
      igAccount: {
        include: { user: { select: { username: true } } },
      },
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(queue)
}
