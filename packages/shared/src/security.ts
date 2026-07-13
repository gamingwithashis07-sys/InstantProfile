import { NextRequest } from 'next/server'
import prisma from './prisma'
import { auth } from '@clerk/nextjs/server'

export async function logAudit(params: {
  action: string
  target?: string
  status: number
  ip?: string
  userAgent?: string
  method?: string
  path?: string
  detail?: string
  userId?: number | null
}) {
  try {
    const userAgent = params.userAgent || ''
    const device = parseDevice(userAgent)
    await prisma.auditLog.create({
      data: {
        action: params.action,
        target: params.target || '',
        status: params.status,
        ip: params.ip || '',
        userAgent,
        device,
        method: params.method || '',
        path: params.path || '',
        detail: params.detail || '',
        userId: params.userId || null,
      },
    })
  } catch {}
}

function parseDevice(ua: string): string {
  if (!ua) return 'Unknown'
  if (ua.includes('Mobile') || ua.includes('Android')) return 'Mobile'
  if (ua.includes('iPad') || ua.includes('Tablet')) return 'Tablet'
  if (ua.includes('Windows')) return 'Windows'
  if (ua.includes('Mac')) return 'Mac'
  if (ua.includes('Linux')) return 'Linux'
  return 'Desktop'
}

export function getRequestMeta(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || req.headers.get('x-real-ip')
    || req.headers.get('cf-connecting-ip')
    || 'unknown'
  const userAgent = req.headers.get('user-agent') || ''
  return { ip, userAgent }
}

export async function getUserIdSafely(): Promise<number | null> {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return null
    const user = await prisma.user.findUnique({ where: { clerkId } })
    return user?.id || null
  } catch {
    return null
  }
}
