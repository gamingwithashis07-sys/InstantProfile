import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const scheduled = await prisma.scheduledPost.findMany({
    where: { igAccount: { userId }, status: 'scheduled' },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { scheduledAt: 'asc' },
  })
  const mapped = scheduled.map(p => ({
    ...p,
    ig_username: p.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}
