import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const replies = await prisma.autoReply.findMany({
    where: { igAccount: { userId } },
    include: { igAccount: { select: { igUsername: true } } },
    orderBy: { createdAt: 'desc' },
  })
  const mapped = replies.map(r => ({
    ...r,
    ig_username: r.igAccount.igUsername,
    igAccount: undefined,
  }))
  return NextResponse.json(mapped)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { ig_account_id, name, trigger_type, trigger_keyword, reply_type, message } = await req.json()
  if (!ig_account_id || !name || !message) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  const result = await prisma.autoReply.create({
    data: {
      igAccountId: ig_account_id,
      name,
      triggerType: trigger_type || 'keyword',
      triggerKeyword: trigger_keyword || null,
      replyType: reply_type || 'dm',
      message,
    },
  })
  return NextResponse.json({ id: result.id, name, status: 'active' })
}
