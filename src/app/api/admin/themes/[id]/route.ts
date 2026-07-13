import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdminUserId, unauthorized, forbidden } from '@/lib/helpers'

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await requireAdminUserId()
  } catch (e: any) {
    if (e.message === 'Forbidden') return forbidden()
    return unauthorized()
  }
  const { id } = await params
  await prisma.bioTheme.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
