import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const conversations = await prisma.dmConversation.findMany({
    where: { igAccount: { userId } },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = conversations.map(c => ({
    ...c,
    account_name: c.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}
