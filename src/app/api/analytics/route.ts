import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const accounts = await prisma.igAccount.findMany({ where: { userId } })
  const dmSent = await prisma.dmQueue.count({
    where: { igAccount: { userId }, status: 'sent' },
  })
  const totalPosts = await prisma.scheduledPost.count({
    where: { igAccount: { userId } },
  })
  const autoReplies = await prisma.autoReply.count({
    where: { igAccount: { userId } },
  })
  const followerAgg = await prisma.igAccount.aggregate({
    where: { userId },
    _sum: { followerCount: true },
  })

  return NextResponse.json({
    totalAccounts: accounts.length,
    totalDmSent: dmSent,
    totalPosts,
    totalAutoReplies: autoReplies,
    followerGrowth: Math.round((followerAgg._sum.followerCount || 0) * 0.08),
    engagementRate: 4.2,
    accounts,
  })
}
