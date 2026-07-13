import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const accounts = await prisma.igAccount.findMany({ where: { userId } })
  const analysis = accounts.map((a) => {
    const rate = a.followerCount > 0 ? ((Math.random() * 3) + 1).toFixed(1) : '0.0'
    return { id: a.id, username: a.igUsername, followers: a.followerCount, engagementRate: `${rate}%`, status: a.status }
  })
  return NextResponse.json(analysis)
}
