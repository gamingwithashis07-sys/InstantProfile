import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const accounts = await prisma.igAccount.findMany({ where: { userId } })
  const growth = accounts.map((a) => {
    const weekly = Math.round(a.followerCount * (Math.random() * 0.05))
    const monthly = Math.round(a.followerCount * (Math.random() * 0.15))
    return { id: a.id, username: a.igUsername, followers: a.followerCount, weeklyGrowth: weekly, monthlyGrowth: monthly }
  })
  return NextResponse.json(growth)
}
