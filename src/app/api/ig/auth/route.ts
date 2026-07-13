import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getUserId, unauthorized } from '@/lib/helpers'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const [fbAppId, siteUrl] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'fb_app_id' } }),
    prisma.setting.findUnique({ where: { key: 'site_url' } }),
  ])

  if (!fbAppId?.value) {
    return NextResponse.json({ error: 'Facebook App not configured by admin' }, { status: 400 })
  }

  const baseUrl = siteUrl?.value || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}`
  const redirectUri = `${baseUrl}/api/ig/callback`

  const params = new URLSearchParams({
    client_id: fbAppId.value,
    redirect_uri: redirectUri,
    scope: 'instagram_basic,pages_show_list,business_management',
    response_type: 'code',
    state: String(userId),
  })

  return NextResponse.redirect(`https://www.facebook.com/v21.0/dialog/oauth?${params}`)
}
