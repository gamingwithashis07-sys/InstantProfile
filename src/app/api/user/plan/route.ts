import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true, dmMonthlyUsage: true, dmLimit: true, role: true },
  })
  return NextResponse.json(user)
}

export async function POST() {
  return NextResponse.json({ error: 'Upgrade via /api/user/upgrade' }, { status: 400 })
}
