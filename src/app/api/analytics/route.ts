import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  await initDB()
  const db = getDB()

  const accounts = db.all('SELECT * FROM ig_accounts WHERE user_id = ?', [session.userId])
  const dmSent = db.get('SELECT COUNT(*) as c FROM dm_queue q JOIN ig_accounts a ON q.ig_account_id = a.id WHERE a.user_id = ? AND q.status = ?', [session.userId, 'sent'])
  const totalPosts = db.get('SELECT COUNT(*) as c FROM scheduled_posts p JOIN ig_accounts a ON p.ig_account_id = a.id WHERE a.user_id = ?', [session.userId])
  const autoReplies = db.get('SELECT COUNT(*) as c FROM auto_replies r JOIN ig_accounts a ON r.ig_account_id = a.id WHERE a.user_id = ?', [session.userId])
  const followerCount = db.get('SELECT SUM(follower_count) as c FROM ig_accounts WHERE user_id = ?', [session.userId])

  return NextResponse.json({
    totalAccounts: accounts.length,
    totalDmSent: dmSent?.c || 0,
    totalPosts: totalPosts?.c || 0,
    totalAutoReplies: autoReplies?.c || 0,
    followerGrowth: Math.round((followerCount?.c || 0) * 0.08),
    engagementRate: 4.2,
    accounts,
  })
}
