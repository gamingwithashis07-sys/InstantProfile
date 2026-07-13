import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminUserId } from '@/lib/helpers'
import { logAudit, getRequestMeta } from '@/lib/security'

export async function GET(req: NextRequest) {
  try {
    await requireAdminUserId(req)
  } catch {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '50')
  const action = searchParams.get('action')
  const status = searchParams.get('status')

  const where: any = {}
  if (action) where.action = action
  if (status) where.status = parseInt(status)

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: { user: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ])

  return NextResponse.json({
    logs: logs.map(l => ({
      ...l,
      username: l.user?.username || null,
      user: undefined,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
}
