import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const [totalDms, totalPosts, totalAccounts, totalUsers] = await Promise.all([
    prisma.dmQueue.count({ where: { status: 'sent' } }),
    prisma.scheduledPost.count({ where: { status: 'published' } }),
    prisma.igAccount.count(),
    prisma.user.count(),
  ])
  return NextResponse.json({
    total_dms_sent: totalDms,
    total_posts_scheduled: totalPosts,
    total_connected_accounts: totalAccounts,
    total_users: totalUsers,
  })
}
