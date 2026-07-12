import { NextResponse } from 'next/server'
import { getSession, unauthorized } from '@/lib/auth'
import { initDB, getDB } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const accounts = getDB().all('SELECT * FROM ig_accounts WHERE user_id = ?', [session.userId])
  const growth = accounts.map((a: any) => {
    const weekly = Math.round(a.follower_count * (Math.random() * 0.05))
    const monthly = Math.round(a.follower_count * (Math.random() * 0.15))
    return { id: a.id, username: a.ig_username, followers: a.follower_count, weeklyGrowth: weekly, monthlyGrowth: monthly }
  })
  return NextResponse.json(growth)
}
