import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const pages = await prisma.bioPage.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { title, bio, username, avatar_url, theme_color } = await req.json()
  if (!title || !username) return NextResponse.json({ error: 'Title and username required' }, { status: 400 })
  try {
    const page = await prisma.bioPage.create({
      data: {
        userId,
        title,
        bio: bio || '',
        username,
        avatarUrl: avatar_url || '',
        themeColor: theme_color || '#f4a261',
      },
    })
    return NextResponse.json({ id: page.id, username })
  } catch {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }
}
