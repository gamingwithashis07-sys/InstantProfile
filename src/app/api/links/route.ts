import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'
import crypto from 'crypto'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const links = await prisma.shortLink.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(links)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { target_url, title, slug } = await req.json()
  if (!target_url) return NextResponse.json({ error: 'Target URL required' }, { status: 400 })
  const finalSlug = slug || crypto.randomBytes(4).toString('hex')
  try {
    const link = await prisma.shortLink.create({
      data: { userId, slug: finalSlug, targetUrl: target_url, title: title || '' },
    })
    return NextResponse.json({ slug: finalSlug, short_url: `/go/${finalSlug}`, target_url })
  } catch {
    return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
  }
}
