/**
 * POST /api/admin/logout
 *
 * Clears the admin session cookie and redirects to /admin.
 */

import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(_request: NextRequest) {
  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0, // Delete cookie immediately
  })
  return response
}
