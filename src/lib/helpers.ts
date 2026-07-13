import { NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from './prisma'

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

export async function requireAdminUserId(): Promise<number> {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(userId)
  if (clerkUser.publicMetadata.role !== 'admin') throw new Error('Forbidden')
  const internalId = await getUserId()
  if (!internalId) throw new Error('Unauthorized')
  return internalId
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
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

