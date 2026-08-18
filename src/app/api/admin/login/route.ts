/**
 * POST /api/admin/login
 *
 * Verifies the submitted password against ADMIN_PASSWORD env var.
 * On success: sets a session cookie and returns { ok: true }.
 * On failure: returns 401 { error: string }.
 */

import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { ADMIN_COOKIE, computeSessionToken } from '@/lib/admin-auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const envPassword = process.env.ADMIN_PASSWORD

  if (!envPassword) {
    return NextResponse.json(
      { error: 'Server misconfiguration: ADMIN_PASSWORD not set.' },
      { status: 503 },
    )
  }

  let body: { password?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const submitted = body.password ?? ''

  // Constant-time comparison prevents timing attacks
  const submittedBuf = Buffer.from(submitted)
  const expectedBuf = Buffer.from(envPassword)
  const match =
    submittedBuf.length === expectedBuf.length &&
    timingSafeEqual(submittedBuf, expectedBuf)

  if (!match) {
    return NextResponse.json({ error: 'Şifre yanlış.' }, { status: 401 })
  }

  const token = await computeSessionToken(envPassword)

  const response = NextResponse.json({ ok: true })
  response.cookies.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // No maxAge / expires → session cookie; gone when browser closes
  })

  return response
}
