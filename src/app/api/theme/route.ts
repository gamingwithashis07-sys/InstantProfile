import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { theme } = await req.json()
  const res = NextResponse.json({ success: true })
  res.cookies.set('theme', theme, { path: '/', maxAge: 60 * 60 * 24 * 365 })
  return res
}
