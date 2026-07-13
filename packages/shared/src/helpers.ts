import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from './prisma'
import { logAudit, getRequestMeta } from './security'

export async function getUserId(): Promise<number | null> {
  const { userId } = await auth()
  if (!userId) return null
  let user = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!user) {
    user = await prisma.user.create({
      data: { clerkId: userId, username: `user_${userId.slice(0, 8)}`, role: 'user' },
    })
  }
  return user.id
}

export async function requireAdminUserId(req?: NextRequest): Promise<number> {
  const { userId } = await auth()
  if (!userId) {
    if (req) await logAudit({ ...getRequestMeta(req), action: 'UNAUTHORIZED_ACCESS', target: req.url, status: 401, method: req.method, path: req.nextUrl.pathname, detail: 'No auth token' })
    throw new Error('Unauthorized')
  }
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  if (clerkUser.publicMetadata.role !== 'admin') {
    if (req) await logAudit({ ...getRequestMeta(req), action: 'FORBIDDEN_ACCESS', target: 'admin', status: 403, method: req.method, path: req.nextUrl.pathname, detail: `User ${userId} tried to access admin resource` })
    throw new Error('Forbidden')
  }
  const internalId = await getUserId()
  if (!internalId) throw new Error('Unauthorized')
  return internalId
}

export function unauthorized(req?: NextRequest) {
  if (req) {
    const meta = getRequestMeta(req)
    logAudit({ ...meta, action: 'UNAUTHORIZED_ACCESS', target: req.url, status: 401, method: req.method, path: req.nextUrl.pathname, detail: 'No valid session' })
  }
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden(req?: NextRequest) {
  if (req) {
    const meta = getRequestMeta(req)
    logAudit({ ...meta, action: 'FORBIDDEN_ACCESS', target: 'admin', status: 403, method: req.method, path: req.nextUrl.pathname, detail: 'Non-admin tried admin endpoint' })
  }
  return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
}

export async function logActivity(username: string, action: string, target: string, detail: string) {
  try {
    const user = await prisma.user.findUnique({ where: { username } })
    if (user) {
      await prisma.activityLog.create({
        data: { userId: user.id, action, target, detail },
      })
    }
  } catch {}
}

const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(key: string, maxRequests = 10, windowMs = 60000): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(key)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

export function rateLimitResponse() {
  return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
}
