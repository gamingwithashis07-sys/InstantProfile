import { NextResponse } from 'next/server'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function POST(req: Request) {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const { competitors } = await req.json()
  if (!competitors || !Array.isArray(competitors) || competitors.length === 0) {
    return NextResponse.json({ error: 'Provide at least one competitor username' }, { status: 400 })
  }
  const analysis = competitors.map((username: string) => ({
    username,
    followers: Math.floor(Math.random() * 50000) + 1000,
    postsPerWeek: Math.floor(Math.random() * 7) + 1,
    engagementRate: `${(Math.random() * 5 + 0.5).toFixed(1)}%`,
    topHashtags: ['explore', 'viral', 'trending'].slice(0, Math.floor(Math.random() * 3) + 1),
  }))
  return NextResponse.json(analysis)
}
