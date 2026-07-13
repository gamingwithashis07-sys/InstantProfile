import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const posts = await prisma.scheduledPost.findMany({
    where: { igAccount: { userId } },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { scheduledAt: 'desc' },
  })
  const mapped = posts.map(p => ({
    ...p,
    ig_username: p.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { ig_account_id, media_type, caption, media_url, scheduled_at } = await req.json()
  if (!ig_account_id || !media_url || !scheduled_at) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const post = await prisma.scheduledPost.create({
    data: {
      igAccountId: ig_account_id,
      mediaType: media_type || 'image',
      caption: caption || '',
      mediaUrl: media_url,
      scheduledAt: new Date(scheduled_at),
    },
  })
  return NextResponse.json({ id: post.id, status: 'scheduled' })
}
