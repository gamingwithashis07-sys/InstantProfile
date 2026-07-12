import { NextResponse } from 'next/server'
import { getSession, unauthorized } from '@/lib/auth'

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return unauthorized()
  const { caption, mentions, hashtags } = await req.json()
  const preview = `${caption || ''}${mentions ? `\n\n${mentions.map((m: string) => `@${m}`).join(' ')}` : ''}${hashtags ? `\n\n${hashtags.map((h: string) => `#${h}`).join(' ')}` : ''}`
  const charCount = preview.length
  const lineCount = preview.split('\n').length
  return NextResponse.json({ preview, charCount, lineCount, fitsInCaption: charCount <= 2200 })
}
