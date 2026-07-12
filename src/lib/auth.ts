import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

export interface Session {
  userId: number
  username: string
  role: string
}

// ── JWT helpers ──────────────────────────────────────────

const SECRET = crypto.createHash('sha256').update(process.env.JWT_SECRET || 'insta-automate-jwt-secret-change-me').digest()

function base64url(data: Buffer): string {
  return data.toString('base64url')
}

function fromBase64url(str: string): Buffer {
  return Buffer.from(str, 'base64url')
}

function signJWT(payload: Record<string, unknown>): string {
  const header = { alg: 'HS256', typ: 'JWT' }
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = { ...payload, iat: now, exp: now + 86400 } // 24h expiry
  const headerB64 = base64url(Buffer.from(JSON.stringify(header)))
  const payloadB64 = base64url(Buffer.from(JSON.stringify(fullPayload)))
  const signature = crypto.createHmac('sha256', SECRET).update(`${headerB64}.${payloadB64}`).digest()
  return `${headerB64}.${payloadB64}.${base64url(signature)}`
}

function verifyJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const [headerB64, payloadB64, sigB64] = parts
    const expectedSig = crypto.createHmac('sha256', SECRET).update(`${headerB64}.${payloadB64}`).digest()
    const actualSig = fromBase64url(sigB64)
    if (!crypto.timingSafeEqual(expectedSig, actualSig)) return null
    const payload = JSON.parse(fromBase64url(payloadB64).toString())
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}

// ── Session management ───────────────────────────────────

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('token')?.value
    if (!token) return null
    const payload = verifyJWT(token)
    if (!payload) return null
    return { userId: payload.userId as number, username: payload.username as string, role: payload.role as string }
  } catch {
    return null
  }
}

export function createSession(userId: number, username: string, role: string): string {
  return signJWT({ userId, username, role })
}

// ── CSRF ─────────────────────────────────────────────────

export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function validateCsrf(req: Request): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const csrfCookie = cookieStore.get('csrf_token')?.value
    const csrfHeader = req.headers.get('x-csrf-token')
    if (!csrfCookie || !csrfHeader) return false
    const a = Buffer.from(csrfCookie)
    const b = Buffer.from(csrfHeader)
    return a.length === b.length && crypto.timingSafeEqual(a, b)
  } catch {
    return false
  }
}

// ── Login rate limiting (in-memory) ──────────────────────

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 900000 }) // 15 min window
    return true
  }
  if (entry.count >= 10) return false // 10 attempts per 15 min
  entry.count++
  return true
}

export function resetRateLimit(ip: string) {
  loginAttempts.delete(ip)
}

// ── Input validation ─────────────────────────────────────

export function validateUsername(username: string): string | null {
  if (!username || typeof username !== 'string') return 'Username is required'
  if (username.length < 3 || username.length > 30) return 'Username must be 3-30 characters'
  if (!/^[a-zA-Z0-9_]+$/.test(username)) return 'Username can only contain letters, numbers, and underscores'
  return null
}

export function validatePassword(password: string): string | null {
  if (!password || typeof password !== 'string') return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  if (password.length > 128) return 'Password is too long'
  return null
}

// ── CSRF-protected request helper ────────────────────────

export async function requireCsrf(req: NextRequest): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') return true // skip CSRF in dev
  return validateCsrf(req)
}

// ── Response helpers ─────────────────────────────────────

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function forbidden() {
  return NextResponse.json({ error: 'Forbidden: Admin only' }, { status: 403 })
}

export function csrfError() {
  return NextResponse.json({ error: 'Invalid CSRF token' }, { status: 403 })
}
