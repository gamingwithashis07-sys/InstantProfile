import { NextResponse } from 'next/server'
import { initDB, getDB } from '@/lib/db'
import { getSession, unauthorized, forbidden } from '@/lib/auth'

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  if (session.role !== 'admin') return forbidden()
  await initDB()
  const db = getDB()

  const totalUsers = db.get('SELECT COUNT(*) as c FROM users')
  const totalAccounts = db.get('SELECT COUNT(*) as c FROM ig_accounts')
  const totalDmSent = db.get('SELECT COUNT(*) as c FROM dm_queue WHERE status = ?', ['sent'])
  const totalPosts = db.get('SELECT COUNT(*) as c FROM scheduled_posts')
  const totalAutoReplies = db.get('SELECT COUNT(*) as c FROM auto_replies')
  const totalDmPending = db.get('SELECT COUNT(*) as c FROM dm_queue WHERE status = ?', ['pending'])
  const totalDmCampaigns = db.get('SELECT COUNT(*) as c FROM dm_campaigns')
  const totalProducts = db.get('SELECT COUNT(*) as c FROM products')
  const totalOrders = db.get('SELECT COUNT(*) as c FROM digital_orders WHERE status = ?', ['completed'])
  const totalRevenue = db.get('SELECT COALESCE(SUM(amount), 0) as total FROM digital_orders WHERE status = ?', ['completed'])
  const totalBalance = db.get('SELECT COALESCE(SUM(balance), 0) as total FROM users')

  return NextResponse.json({
    totalUsers: totalUsers?.c || 0,
    totalAccounts: totalAccounts?.c || 0,
    totalDmSent: totalDmSent?.c || 0,
    totalPosts: totalPosts?.c || 0,
    totalAutoReplies: totalAutoReplies?.c || 0,
    totalDmPending: totalDmPending?.c || 0,
    totalDmCampaigns: totalDmCampaigns?.c || 0,
    totalProducts: totalProducts?.c || 0,
    totalOrders: totalOrders?.c || 0,
    totalRevenue: totalRevenue?.total || 0,
  })
}
