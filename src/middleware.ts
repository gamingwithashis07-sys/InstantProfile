import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

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
  '/admin(.*)',
])

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
