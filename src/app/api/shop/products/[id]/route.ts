import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await prisma.product.findUnique({
    where: { id: Number(id) },
    select: { id: true, userId: true, title: true, description: true, price: true, type: true, fileUrl: true, imageUrl: true, slug: true, status: true, policies: true, createdAt: true },
  })
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(product)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { id } = await params
  const existing = await prisma.product.findUnique({ where: { id: Number(id) } })
  if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const { title, description, price, type, file_url, image_url, slug, status, policies } = await req.json()
  const finalStatus = status || existing.status
  const finalPolicies = policies !== undefined ? policies : (existing.policies || '{}')
  if (finalStatus === 'active') {
    const parsed = JSON.parse(typeof finalPolicies === 'string' ? finalPolicies : JSON.stringify(finalPolicies))
    if (!parsed.privacy_policy || !parsed.refund_policy || !parsed.terms_of_service) {
      return NextResponse.json({ error: 'Privacy policy, refund policy, and terms of service are required before activating' }, { status: 400 })
    }
  }
  await prisma.product.update({
    where: { id: Number(id) },
    data: {
      title: title || existing.title,
      description: description ?? existing.description,
      price: price ?? existing.price,
      type: type || existing.type,
      fileUrl: file_url ?? existing.fileUrl,
      imageUrl: image_url ?? existing.imageUrl,
      slug: slug || existing.slug,
      status: finalStatus,
      policies: typeof finalPolicies === 'string' ? finalPolicies : JSON.stringify(finalPolicies),
    },
  })
  return NextResponse.json({ success: true })
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { id } = await params
  await prisma.product.delete({ where: { id: Number(id) } })
  return NextResponse.json({ success: true })
}
