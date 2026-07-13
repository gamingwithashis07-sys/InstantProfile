import { redirect } from 'next/navigation'
import prisma from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const link = await prisma.shortLink.findUnique({ where: { slug } })
  if (!link) return new Response('Not found', { status: 404 })
  await prisma.shortLink.update({
    where: { id: link.id },
    data: { clicks: { increment: 1 } },
  })
  redirect(link.targetUrl)
}
