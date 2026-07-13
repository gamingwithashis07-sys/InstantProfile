import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const queue = await prisma.dmQueue.findMany({
    where: { igAccount: { userId } },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  const mapped = queue.map(q => ({
    ...q,
    account_name: q.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}
