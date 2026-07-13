import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const templates = await prisma.captionTemplate.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(templates)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { title, content, category } = await req.json()
  if (!title || !content) return NextResponse.json({ error: 'Title and content required' }, { status: 400 })
  const template = await prisma.captionTemplate.create({
    data: { userId, title, content, category: category || 'general' },
  })
  return NextResponse.json({ id: template.id })
}
