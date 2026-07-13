import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, logActivity } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const accounts = await prisma.igAccount.findMany({
    where: { userId },
    select: {
      id: true,
      igUserId: true,
      igUsername: true,
      igBusinessId: true,
      avatarUrl: true,
      followerCount: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(accounts)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { ig_user_id, ig_username, ig_business_id, access_token, token_expires_at, avatar_url, follower_count } = await req.json()
  if (!ig_user_id || !ig_username || !access_token) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  const account = await prisma.igAccount.create({
    data: {
      userId,
      igUserId: ig_user_id,
      igUsername: ig_username,
      igBusinessId: ig_business_id || null,
      accessToken: access_token,
      tokenExpiresAt: token_expires_at ? new Date(token_expires_at) : null,
      avatarUrl: avatar_url || null,
      followerCount: follower_count || 0,
    },
  })
  const user = await prisma.user.findUnique({ where: { id: userId } })
  await logActivity(user?.username || '', 'connected', `IG: ${ig_username}`, `Account #${account.id}`)
  return NextResponse.json({ id: account.id, ig_username, status: 'active' })
}
