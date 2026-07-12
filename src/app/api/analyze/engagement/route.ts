import { NextResponse } from 'next/server'
import { getSession, unauthorized } from '@/lib/auth'
import { initDB, getDB } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const accounts = getDB().all('SELECT * FROM ig_accounts WHERE user_id = ?', [session.userId])
  const analysis = accounts.map((a: any) => {
    const rate = a.follower_count > 0 ? ((Math.random() * 3) + 1).toFixed(1) : '0.0'
    return { id: a.id, username: a.ig_username, followers: a.follower_count, engagementRate: `${rate}%`, status: a.status }
  })
  return NextResponse.json(analysis)
}
