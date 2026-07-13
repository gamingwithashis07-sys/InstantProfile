import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

const PLANS: Record<string, { dmLimit: number; price: number }> = {
  starter: { dmLimit: 1000, price: 199 },
  pro: { dmLimit: 20000, price: 699 },
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { plan } = await req.json()
  if (!plan || !PLANS[plan]) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan,
      dmLimit: PLANS[plan].dmLimit,
      dmMonthlyUsage: 0,
    },
  })

  return NextResponse.json({ success: true, plan, dmLimit: PLANS[plan].dmLimit })
}

export async function GET() {
  return NextResponse.json({ plans: PLANS })
}
