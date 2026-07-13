import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')
  const error = searchParams.get('error')

  if (error) {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=instagram_denied', req.url))
  }

  if (!code || !state) {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=invalid_request', req.url))
  }

  const userId = Number(state)
  if (!userId) {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=invalid_state', req.url))
  }

  const [fbAppId, fbAppSecret, siteUrl] = await Promise.all([
    prisma.setting.findUnique({ where: { key: 'fb_app_id' } }),
    prisma.setting.findUnique({ where: { key: 'fb_app_secret' } }),
    prisma.setting.findUnique({ where: { key: 'site_url' } }),
  ])

  if (!fbAppId?.value || !fbAppSecret?.value) {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=fb_not_configured', req.url))
  }

  const baseUrl = siteUrl?.value || `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}`
  const redirectUri = `${baseUrl}/api/ig/callback`

  try {
    // Exchange code for short-lived token
    const tokenRes = await fetch('https://graph.facebook.com/v21.0/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: fbAppId.value,
        client_secret: fbAppSecret.value,
        redirect_uri: redirectUri,
        code,
      }),
    })
    const tokenData = await tokenRes.json()
    if (!tokenData.access_token) {
      return NextResponse.redirect(new URL('/dashboard/accounts?error=token_exchange_failed', req.url))
    }

    // Exchange for long-lived token
    const longTokenRes = await fetch(
      `https://graph.facebook.com/v21.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${fbAppId.value}&client_secret=${fbAppSecret.value}&fb_exchange_token=${tokenData.access_token}`
    )
    const longTokenData = await longTokenRes.json()
    const accessToken = longTokenData.access_token || tokenData.access_token
    const expiresIn = longTokenData.expires_in || tokenData.expires_in || 5184000

    // Get Facebook Pages
    const pagesRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?access_token=${accessToken}&fields=id,name,instagram_business_account{id,username,profile_picture_url,followers_count}`
    )
    const pagesData = await pagesRes.json()
    const page = pagesData.data?.[0]

    if (!page?.instagram_business_account) {
      return NextResponse.redirect(new URL('/dashboard/accounts?error=no_instagram_business', req.url))
    }

    const ig = page.instagram_business_account

    // Check if already exists
    const existing = await prisma.igAccount.findFirst({
      where: { igUserId: String(ig.id), userId },
    })

    if (existing) {
      await prisma.igAccount.update({
        where: { id: existing.id },
        data: {
          igUsername: ig.username,
          accessToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
          avatarUrl: ig.profile_picture_url || null,
          followerCount: ig.followers_count || 0,
          igBusinessId: page.id,
          status: 'active',
        },
      })
    } else {
      await prisma.igAccount.create({
        data: {
          userId,
          igUserId: String(ig.id),
          igUsername: ig.username,
          igBusinessId: page.id,
          accessToken,
          tokenExpiresAt: new Date(Date.now() + expiresIn * 1000),
          avatarUrl: ig.profile_picture_url || null,
          followerCount: ig.followers_count || 0,
          status: 'active',
        },
      })
    }

    return NextResponse.redirect(new URL('/dashboard/accounts?success=connected', req.url))
  } catch {
    return NextResponse.redirect(new URL('/dashboard/accounts?error=callback_failed', req.url))
  }
}
