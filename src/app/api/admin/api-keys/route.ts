import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden, logActivity } from '@/lib/helpers'

const KEY_NAMES = ['fb_app_id', 'fb_app_secret', 'graph_api_version']

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const keys = await Promise.all(
    KEY_NAMES.map(async (key) => {
      const row = await prisma.setting.findUnique({ where: { key } })
      return row || { key, value: '' }
    })
  )
  return NextResponse.json(keys)
}

export async function POST(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const { fb_app_id, fb_app_secret, graph_api_version } = await req.json()
  const entries: Record<string, string | undefined> = { fb_app_id, fb_app_secret, graph_api_version }
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined) {
      await prisma.setting.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })
    }
  }
  await logActivity(clerkUser.username || 'admin', 'updated', 'Facebook API Credentials', '')
  return NextResponse.json({ success: true })
}
