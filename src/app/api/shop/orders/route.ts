import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'
import crypto from 'crypto'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const orders = await prisma.digitalOrder.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      product: {
        select: { title: true, slug: true, type: true },
      },
    },
  })
  return NextResponse.json(orders)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { product_id } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  const product = await prisma.product.findUnique({ where: { id: Number(product_id) } })
  if (!product || product.status !== 'active') return NextResponse.json({ error: 'Product not found or unavailable' }, { status: 404 })
  if (product.userId === userId) return NextResponse.json({ error: 'You cannot purchase your own product' }, { status: 400 })

  const token = crypto.randomBytes(24).toString('hex')

  if (product.price === 0) {
    const order = await prisma.digitalOrder.create({
      data: { userId, productId: Number(product_id), amount: 0, downloadToken: token, status: 'completed' },
    })
    return NextResponse.json({ success: true, download_token: order.downloadToken, product: { title: product.title, slug: product.slug, file_url: product.fileUrl } })
  }

  const order = await prisma.digitalOrder.create({
    data: { userId, productId: Number(product_id), amount: product.price, downloadToken: token, status: 'pending' },
  })

  return NextResponse.json({
    requires_payment: true,
    order_db_id: order.id,
    amount: product.price,
    product: { title: product.title, slug: product.slug, image_url: product.imageUrl },
  })
}
