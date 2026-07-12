import { NextResponse } from 'next/server'
import { getSession, unauthorized } from '@/lib/auth'

const IDEAS = [
  'Monday Motivation quote', 'Behind the scenes photo', 'Customer testimonial', 'Product feature spotlight',
  'Team introduction', 'FAQ video', 'Industry news share', 'User-generated content repost',
  'Tip/Tutorial post', 'Poll or survey', 'Throwback Thursday', 'Weekend vibes',
  'Collaboration announcement', 'Special offer/discount', 'Birthday/anniversary post',
  'Seasonal content', 'Holiday greeting', 'Challenge participation', 'Live session announcement',
  'Milestone celebration', 'Infographic', 'Comparison post', 'Myth busting', 'Resource list',
]

export async function GET(req: Request) {
  const session = await getSession()
  if (!session) return unauthorized()
  const url = new URL(req.url)
  const count = parseInt(url.searchParams.get('count') || '7')
  const shuffled = [...IDEAS].sort(() => Math.random() - 0.5).slice(0, count)
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const calendar = shuffled.map((idea, i) => ({ day: weekDays[i] || `Day ${i + 1}`, idea }))
  return NextResponse.json(calendar)
}
