import { NextResponse } from 'next/server'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()
  const times = [
    { day: 'Monday', best: '11:00 AM', score: 92 },
    { day: 'Tuesday', best: '10:00 AM', score: 88 },
    { day: 'Wednesday', best: '12:00 PM', score: 85 },
    { day: 'Thursday', best: '1:00 PM', score: 90 },
    { day: 'Friday', best: '9:00 AM', score: 87 },
    { day: 'Saturday', best: '10:00 AM', score: 78 },
    { day: 'Sunday', best: '11:00 AM', score: 82 },
  ]
  return NextResponse.json({ bestTimes: times, recommendation: 'Best overall time: Wednesday 12:00 PM' })
}
