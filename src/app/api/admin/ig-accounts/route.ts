import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized, forbidden } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const accounts = await prisma.igAccount.findMany({
    include: { user: { select: { username: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(accounts)
}

export async function DELETE(req: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { userId: clerkId } = await auth()
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(clerkId!)
  if (clerkUser.publicMetadata.role !== 'admin') return forbidden()

  const { id } = await req.json()
  await prisma.igAccount.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
