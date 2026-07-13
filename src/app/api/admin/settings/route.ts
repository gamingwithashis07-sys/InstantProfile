import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden, logActivity } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const settings = await prisma.setting.findMany()
  const obj: Record<string, string> = {}
  settings.forEach(s => obj[s.key] = s.value)
  return NextResponse.json(obj)
}

export async function PUT(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const settings = await req.json()
  for (const [key, value] of Object.entries(settings)) {
    await prisma.setting.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    })
  }
  await logActivity(clerkUser.username || 'admin', 'updated', 'Settings', '')
  return NextResponse.json({ success: true })
}
