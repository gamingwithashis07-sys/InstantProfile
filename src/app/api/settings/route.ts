import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.setting.findMany()
  return NextResponse.json(settings)
}

export async function POST(req: NextRequest) {
  const entries = await req.json()
  if (!Array.isArray(entries)) {
    return NextResponse.json({ error: 'Expected array of {key, value}' }, { status: 400 })
  }
  for (const { key, value } of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
  }
  return NextResponse.json({ success: true })
}
