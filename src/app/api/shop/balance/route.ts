import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, balance: true } })
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
  return NextResponse.json({ balance: user?.balance || 0, transactions })
}
