import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { product_id } = await req.json()
  if (!product_id) return NextResponse.json({ error: 'Product ID required' }, { status: 400 })
  const product = await prisma.product.findUnique({ where: { id: Number(product_id) } })
  if (!product || product.status !== 'active') return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  if (product.userId === userId) return NextResponse.json({ error: 'You cannot purchase your own product' }, { status: 400 })

  const settingsRows = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settingsRows.map((s) => [s.key, s.value]))

  const token = crypto.randomBytes(24).toString('hex')
  const amountPaise = Math.round(product.price * 100)

  const razorpayOrderId = `rzp_order_${crypto.randomBytes(12).toString('hex')}`

  const order = await prisma.digitalOrder.create({
    data: { userId, productId: Number(product_id), amount: product.price, downloadToken: token, status: 'pending', razorpayOrderId },
  })

  return NextResponse.json({
    order_id: order.id,
    razorpay_order_id: razorpayOrderId,
    amount: amountPaise,
    currency: 'INR',
    product: { title: product.title, slug: product.slug, image_url: product.imageUrl },
    key: settingsMap.razorpay_key_id || '',
  })
}
