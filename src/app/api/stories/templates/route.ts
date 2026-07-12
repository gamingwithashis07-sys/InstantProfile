import { NextResponse } from 'next/server'
import { getSession, unauthorized } from '@/lib/auth'

const TEMPLATES = [
  { id: 1, name: 'Q&A', description: 'Ask me anything', colors: ['#f4a261', '#e8a87c'] },
  { id: 2, name: 'This or That', description: 'Choose between two options', colors: ['#7cb86c', '#6cb8c4'] },
  { id: 3, name: 'Countdown', description: 'Countdown to an event', colors: ['#c46cb8', '#e8c36c'] },
  { id: 4, name: 'Quiz', description: 'Test your followers', colors: ['#6c7cc4', '#f4a261'] },
  { id: 5, name: 'Poll', description: 'Get feedback', colors: ['#e8a87c', '#7cb86c'] },
  { id: 6, name: 'Announcement', description: 'Share news', colors: ['#f4a261', '#c46cb8'] },
  { id: 7, name: 'Behind the Scenes', description: 'Show your process', colors: ['#6cb8c4', '#6c7cc4'] },
  { id: 8, name: 'Testimonial', description: 'Share reviews', colors: ['#7cb86c', '#e8c36c'] },
]

export async function GET() {
  const session = await getSession()
  if (!session) return unauthorized()
  return NextResponse.json(TEMPLATES)
}
