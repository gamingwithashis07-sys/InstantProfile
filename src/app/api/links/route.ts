import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'
import crypto from 'crypto'

async function getSiteUrl() {
  const setting = await prisma.setting.findUnique({ where: { key: 'site_url' } })
  return setting?.value || process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const siteUrl = await getSiteUrl()
  const links = await prisma.shortLink.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = links.map(l => ({
    ...l,
    short_url: `${siteUrl}/go/${l.slug}`,
  }))
  return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { target_url, title, slug } = await req.json()
  if (!target_url) return NextResponse.json({ error: 'Target URL required' }, { status: 400 })
  const siteUrl = await getSiteUrl()
  const finalSlug = slug || crypto.randomBytes(4).toString('hex')
  try {
    await prisma.shortLink.create({
      data: { userId, slug: finalSlug, targetUrl: target_url, title: title || '' },
    })
    return NextResponse.json({ slug: finalSlug, short_url: `${siteUrl}/go/${finalSlug}`, target_url })
  } catch {
    return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
  }
}
