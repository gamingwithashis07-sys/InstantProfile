import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminUserId, unauthorized, forbidden } from '@/lib/helpers'

export async function GET() {
  try {
    await requireAdminUserId()
  } catch (e: any) {
    if (e.message === 'Forbidden') return forbidden()
    return unauthorized()
  }
  const themes = await prisma.bioTheme.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(themes)
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminUserId()
  } catch (e: any) {
    if (e.message === 'Forbidden') return forbidden()
    return unauthorized()
  }
  const { name, colors, cssUrl, previewUrl } = await req.json()
  const theme = await prisma.bioTheme.create({
    data: { name, colors: colors || '#f4a261,#e8a87c', cssUrl, previewUrl },
  })
  return NextResponse.json(theme)
}
