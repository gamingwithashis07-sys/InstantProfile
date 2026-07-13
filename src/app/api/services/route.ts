import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const campaigns = await prisma.dmCampaign.findMany({
    where: { status: 'active' },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = campaigns.map(c => ({
    ...c,
    account_username: c.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}
