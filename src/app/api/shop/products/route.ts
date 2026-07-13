import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const products = await prisma.product.findMany({
    where: { status: 'active' },
    orderBy: { createdAt: 'desc' },
    select: { id: true, title: true, description: true, price: true, type: true, imageUrl: true, slug: true, status: true, policies: true, createdAt: true },
  })
  return NextResponse.json(products)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { title, description, price, type, file_url, image_url, slug, policies } = await req.json()
  if (!title || !slug) return NextResponse.json({ error: 'Title and slug required' }, { status: 400 })
  try {
    await prisma.product.create({
      data: {
        userId,
        title,
        description: description || '',
        price: price || 0,
        type: type || 'digital',
        fileUrl: file_url || '',
        imageUrl: image_url || '',
        slug,
        policies: policies || '{}',
      },
    })
    return NextResponse.json({ success: true, slug })
  } catch (err: any) {
    if (err.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already taken' }, { status: 409 })
    }
    throw err
  }
}
