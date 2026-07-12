import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { validateUsername, validatePassword, createSession, generateCsrfToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  await initDB()
  const db = getDB()

  const { username, password } = await req.json()

  const usernameErr = validateUsername(username)
  if (usernameErr) return NextResponse.json({ error: usernameErr }, { status: 400 })

  const passwordErr = validatePassword(password)
  if (passwordErr) return NextResponse.json({ error: passwordErr }, { status: 400 })

  try {
    const hash = bcrypt.hashSync(password, 12)
    const result = db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash])

    const token = createSession(result.lastInsertRowid as number, username, 'user')
    const csrfToken = generateCsrfToken()

    const res = NextResponse.json({ id: result.lastInsertRowid, username, role: 'user' })
    res.cookies.set('token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 })
    res.cookies.set('csrf_token', csrfToken, { httpOnly: false, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 })
    return res
  } catch {
    return NextResponse.json({ error: 'Username already exists' }, { status: 409 })
  }
}
