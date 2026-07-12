import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { createSession, generateCsrfToken, checkRateLimit, resetRateLimit } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await initDB()
  const db = getDB()

  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many login attempts. Try again in 15 minutes.' }, { status: 429 })
  }

  const { username, password, secret_code } = await req.json()
  if (!username || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const user = db.get('SELECT * FROM users WHERE username = ?', [username])
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  if (user.role === 'admin') {
    const stored = db.get('SELECT value FROM settings WHERE key = ?', ['admin_secret_code'])
    if (!secret_code || secret_code !== stored?.value) {
      return NextResponse.json({ error: 'Invalid admin secret code' }, { status: 401 })
    }
  }

  resetRateLimit(ip)
  const token = createSession(user.id, user.username, user.role)
  const csrfToken = generateCsrfToken()

  const res = NextResponse.json({ id: user.id, username: user.username, role: user.role })
  res.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 })
  res.cookies.set('csrf_token', csrfToken, { httpOnly: false, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 })
  return res
}
