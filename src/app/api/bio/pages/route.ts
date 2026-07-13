import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const username = req.nextUrl.searchParams.get('username')
  if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 })
  const page = await prisma.bioPage.findUnique({
    where: { username },
    include: {
      links: { orderBy: { sortOrder: 'asc' } },
      theme: { select: { name: true, colors: true, cssUrl: true } },
    },
  })
  if (!page) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(page)
}
