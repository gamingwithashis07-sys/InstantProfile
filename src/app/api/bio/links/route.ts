import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const { bio_page_id, title, url, icon, sort_order } = await req.json()
  if (!bio_page_id || !title || !url) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  const link = await prisma.bioLink.create({
    data: {
      bioPageId: bio_page_id,
      title,
      url,
      icon: icon || '',
      sortOrder: sort_order || 0,
    },
  })
  return NextResponse.json({ id: link.id })
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  await prisma.bioLink.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
