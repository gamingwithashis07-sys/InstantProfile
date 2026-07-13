import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const ideas = await prisma.contentIdea.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(ideas)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { idea, category } = await req.json()
  if (!idea) return NextResponse.json({ error: 'Idea required' }, { status: 400 })
  const created = await prisma.contentIdea.create({
    data: { userId, idea, category: category || 'general' },
  })
  return NextResponse.json({ id: created.id })
}
