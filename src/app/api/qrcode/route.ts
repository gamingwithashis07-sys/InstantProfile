import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const codes = await prisma.qrCode.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(codes)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { title, target_url, bg_color, fg_color } = await req.json()
  if (!title || !target_url) return NextResponse.json({ error: 'Title and URL required' }, { status: 400 })
  const code = await prisma.qrCode.create({
    data: {
      userId,
      title,
      targetUrl: target_url,
      bgColor: bg_color || '#ffffff',
      fgColor: fg_color || '#000000',
    },
  })
  return NextResponse.json({ id: code.id, qr_url: `/api/qrcode/${code.id}/image` })
}
