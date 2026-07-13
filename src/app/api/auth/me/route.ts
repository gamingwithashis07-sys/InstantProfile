import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  const internalUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  return NextResponse.json({
    id: internalUser?.id,
    clerkId: userId,
    username: clerkUser.username || clerkUser.id,
    role: clerkUser.publicMetadata?.role || 'user',
  })
}
