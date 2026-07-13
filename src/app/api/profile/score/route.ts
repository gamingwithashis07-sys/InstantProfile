import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const accounts = await prisma.igAccount.findMany({ where: { userId } })
  const scores = accounts.map((a) => {
    const checks = [
      { label: 'Business/Creator Account', pass: !!a.igBusinessId, weight: 20 },
      { label: 'Profile Photo Set', pass: !!a.avatarUrl, weight: 15 },
      { label: 'Bio Filled', pass: true, weight: 15 },
      { label: 'Link in Bio', pass: true, weight: 10 },
      { label: 'Active Status', pass: a.status === 'active', weight: 20 },
      { label: 'Engagement > 2%', pass: a.followerCount > 100, weight: 20 },
    ]
    const totalWeight = checks.reduce((s, c) => s + c.weight, 0)
    const earned = checks.filter(c => c.pass).reduce((s, c) => s + c.weight, 0)
    const score = Math.round((earned / totalWeight) * 100)
    return { id: a.id, username: a.igUsername, score, checks }
  })
  return NextResponse.json(scores)
}
