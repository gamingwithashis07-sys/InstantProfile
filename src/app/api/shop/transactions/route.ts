import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    include: {
      order: {
        select: {
          productId: true,
          product: { select: { title: true } },
        },
      },
    },
  })
  const result = transactions.map((t) => ({
    ...t,
    product_id: t.order?.productId ?? null,
    product_title: t.order?.product?.title ?? null,
  }))
  return NextResponse.json(result)
}
