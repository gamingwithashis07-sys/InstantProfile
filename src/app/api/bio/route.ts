import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const pages = await prisma.bioPage.findMany({
    where: { userId },
    include: { theme: { select: { id: true, name: true, colors: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(pages)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { title, bio, username, avatar_url, theme_color, theme_id } = await req.json()
  if (!title || !username) return NextResponse.json({ error: 'Title and username required' }, { status: 400 })
  try {
    const data: any = {
      userId,
      title,
      bio: bio || '',
      username,
      avatarUrl: avatar_url || null,
      themeColor: theme_color || '#f4a261',
    }
    if (theme_id) data.themeId = theme_id
    const page = await prisma.bioPage.create({ data })
    return NextResponse.json({ id: page.id, username })
  } catch {
    return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
  }
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })
  const page = await prisma.bioPage.findFirst({ where: { id: Number(id), userId } })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  await prisma.bioPage.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
