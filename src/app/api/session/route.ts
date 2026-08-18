/**
 * POST /api/session
 *
 * Creates or refreshes an anonymous guest session tied to a bill.
 * Called by the Poller client component on mount and every ~5 s.
 *
 * - First call: creates a Session row, sets guest_session cookie.
 * - Subsequent calls: finds existing session, updates lastSeenAt (R7).
 * - No name, no email, no fields — pure anonymous (R10).
 */

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  let billId: string
  try {
    const body = await request.json()
    billId = String(body.billId ?? '').trim()
  } catch {
    return NextResponse.json({ error: 'bad request' }, { status: 400 })
  }

  if (!billId) {
    return NextResponse.json({ error: 'billId required' }, { status: 400 })
  }

  const existingToken = request.cookies.get('guest_session')?.value

  // Try to reuse existing session ──────────────────────────────────────────
  if (existingToken) {
    const session = await prisma.session.findUnique({
      where: { token: existingToken },
    })
    // Validate: session must belong to the current bill
    if (session && session.billId === billId) {
      await prisma.session.update({
        where: { id: session.id },
        data: { lastSeenAt: new Date() },
      })
      return NextResponse.json({ sessionId: session.id })
    }
  }

  // Create a new anonymous session ─────────────────────────────────────────
  const session = await prisma.session.create({ data: { billId } })

  const response = NextResponse.json({ sessionId: session.id })
  response.cookies.set('guest_session', session.token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    // No maxAge → session cookie; gone when browser closes
  })
  return response
}
