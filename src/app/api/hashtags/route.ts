import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const groups = await prisma.hashtagGroup.findMany({
    where: { igAccount: { userId } },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = groups.map(g => ({
    ...g,
    ig_username: g.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { ig_account_id, name, hashtags } = await req.json()
  if (!ig_account_id || !name || !hashtags) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const tags = typeof hashtags === 'string' ? hashtags : hashtags.join(',')
  const group = await prisma.hashtagGroup.create({
    data: { igAccountId: ig_account_id, name, hashtags: tags },
  })
  return NextResponse.json({ id: group.id, name })
}
