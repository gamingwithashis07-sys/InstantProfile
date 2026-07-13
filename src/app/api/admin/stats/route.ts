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

  const [totalUsers, totalAccounts, totalDmSent, totalPosts, totalAutoReplies, totalDmPending, totalDmCampaigns, totalProducts, totalOrders, totalRevenue, totalBalance] = await Promise.all([
    prisma.user.count(),
    prisma.igAccount.count(),
    prisma.dmQueue.count({ where: { status: 'sent' } }),
    prisma.scheduledPost.count(),
    prisma.autoReply.count(),
    prisma.dmQueue.count({ where: { status: 'pending' } }),
    prisma.dmCampaign.count(),
    prisma.product.count(),
    prisma.digitalOrder.count({ where: { status: 'completed' } }),
    prisma.digitalOrder.aggregate({ _sum: { amount: true }, where: { status: 'completed' } }),
    prisma.user.aggregate({ _sum: { balance: true } }),
  ])

  return NextResponse.json({
    totalUsers,
    totalAccounts,
    totalDmSent,
    totalPosts,
    totalAutoReplies,
    totalDmPending,
    totalDmCampaigns,
    totalProducts,
    totalOrders,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalBalance: totalBalance._sum.balance || 0,
  })
}
