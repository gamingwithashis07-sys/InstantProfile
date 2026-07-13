import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/api/dm(.*)',
  '/api/posts(.*)',
  '/api/hashtags(.*)',
  '/api/replies(.*)',
  '/api/analytics(.*)',
  '/api/analyze(.*)',
  '/api/links(.*)',
  '/api/bio(.*)',
  '/api/captions(.*)',
  '/api/ideas(.*)',
  '/api/calendar(.*)',
  '/api/qrcode(.*)',
  '/api/profile(.*)',
  '/api/stories(.*)',
  '/api/ig(.*)',
  '/api/shop/products(.*)',
  '/api/shop/orders(.*)',
  '/api/shop/balance(.*)',
  '/api/orders(.*)',
  '/api/export(.*)',
  '/api/admin(.*)',
  '/api/user(.*)',
  '/admin(.*)',
])

const isSensitiveRoute = createRouteMatcher([
  '/api/admin(.*)',
  '/api/user/upgrade(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }

  if (isSensitiveRoute(req)) {
    const response = NextResponse.next()
    response.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return response
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
