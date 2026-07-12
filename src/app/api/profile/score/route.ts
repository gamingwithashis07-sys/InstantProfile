import { NextResponse } from 'next/server'
import { getSession, unauthorized } from '@/lib/auth'
import { initDB, getDB } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const accounts = getDB().all('SELECT * FROM ig_accounts WHERE user_id = ?', [session.userId])
  const scores = accounts.map((a: any) => {
    const checks = [
      { label: 'Business/Creator Account', pass: !!a.ig_business_id, weight: 20 },
      { label: 'Profile Photo Set', pass: !!a.avatar_url, weight: 15 },
      { label: 'Bio Filled', pass: true, weight: 15 },
      { label: 'Link in Bio', pass: true, weight: 10 },
      { label: 'Active Status', pass: a.status === 'active', weight: 20 },
      { label: 'Engagement > 2%', pass: a.follower_count > 100, weight: 20 },
    ]
    const totalWeight = checks.reduce((s, c) => s + c.weight, 0)
    const earned = checks.filter(c => c.pass).reduce((s, c) => s + c.weight, 0)
    const score = Math.round((earned / totalWeight) * 100)
    return { id: a.id, username: a.ig_username, score, checks }
  })
  return NextResponse.json(scores)
}
