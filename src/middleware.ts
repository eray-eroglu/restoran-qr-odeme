/**
 * Next.js Edge middleware — runs on every /admin/* request.
 *
 * T04: Protect all admin pages with a session cookie derived from ADMIN_PASSWORD.
 * Guest routes (/table/...) are never touched.
 */

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, computeSessionToken } from '@/lib/admin-auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only act on /admin routes
  if (!pathname.startsWith('/admin')) return NextResponse.next()

  const envPassword = process.env.ADMIN_PASSWORD

  // Misconfiguration guard — fail closed
  if (!envPassword) {
    return new NextResponse('Server misconfiguration: ADMIN_PASSWORD not set.', {
      status: 503,
    })
  }

  const expectedToken = await computeSessionToken(envPassword)
  const cookieToken = request.cookies.get(ADMIN_COOKIE)?.value
  const isAuthenticated = cookieToken === expectedToken

  // /admin login page itself — skip auth (but redirect to /admin/tables if already in)
  if (pathname === '/admin') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/tables', request.url))
    }
    return NextResponse.next()
  }

  // All other /admin/* pages require a valid session
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Run middleware on /admin and every sub-path, but skip static assets and API files
  // that sit under /admin/api (there are none right now, but future-proofs).
  matcher: '/admin/:path*',
}
