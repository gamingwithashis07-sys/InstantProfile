import { NextRequest, NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()

  await initDB()
  const db = getDB()
  const users = db.all('SELECT id, username, role, created_at FROM users ORDER BY created_at DESC')
  return NextResponse.json(users)
}
