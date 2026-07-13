import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { razorpay_order_id, payment_id, order_db_id } = await req.json()

  if (!razorpay_order_id || !payment_id || !order_db_id) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
  }

  const order = await prisma.digitalOrder.findUnique({ where: { id: Number(order_db_id) } })
  if (!order || order.userId !== userId) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  if (order.status !== 'pending') return NextResponse.json({ error: 'Order already processed' }, { status: 400 })

  const product = await prisma.product.findUnique({ where: { id: order.productId } })
  if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })

  await prisma.digitalOrder.update({
    where: { id: Number(order_db_id) },
    data: { status: 'completed', paymentId: payment_id },
  })

  await prisma.user.update({
    where: { id: product.userId },
    data: { balance: { increment: order.amount } },
  })

  await prisma.transaction.create({
    data: {
      userId: product.userId,
      orderId: Number(order_db_id),
      amount: order.amount,
      type: 'credit',
      description: `Sale: ${product.title}`,
      status: 'completed',
    },
  })

  return NextResponse.json({
    success: true,
    download_token: order.downloadToken,
    product: { title: product.title, slug: product.slug, file_url: product.fileUrl },
  })
}
