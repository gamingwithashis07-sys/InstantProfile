import { NextResponse } from 'next/server'

export async function GET() {
  const res = NextResponse.json({ success: true })
  res.cookies.set('token', '', { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  res.cookies.set('csrf_token', '', { httpOnly: false, secure: true, sameSite: 'lax', path: '/', maxAge: 0 })
  return res
}
