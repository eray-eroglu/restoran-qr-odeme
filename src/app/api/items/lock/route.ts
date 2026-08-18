/**
 * POST /api/items/lock
 *
 * Acquires an ItemLock for the current guest session on a single BillItem.
 *
 * R6 — The server owns the lock. Atomicity is guaranteed by the unique
 * constraint on ItemLock.billItemId: the first writer wins, the second gets a
 * P2002 (unique constraint violation) which we surface as { conflict: true }.
 *
 * R7 — Stale lock cleanup runs here so expired locks don't block fresh taps.
 */

import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

const STALE_MS = 60_000 // 60 s — R7

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { billItemId, billId } = await request.json() as { billItemId?: string; billId?: string }

    if (!billItemId || !billId) {
      return Response.json({ ok: false, error: 'missing fields' }, { status: 400 })
    }

    // Find this session from cookie
    const guestToken = request.cookies.get('guest_session')?.value
    if (!guestToken) return Response.json({ ok: false, error: 'no session' }, { status: 401 })

    const session = await prisma.session.findUnique({ where: { token: guestToken } })
    if (!session || session.billId !== billId) {
      return Response.json({ ok: false, error: 'session mismatch' }, { status: 401 })
    }

    // R7: release unpaid locks from sessions silent for > 60 s (on this bill)
    await prisma.itemLock.deleteMany({
      where: {
        isPaid: false,
        billId,
        session: { lastSeenAt: { lt: new Date(Date.now() - STALE_MS) } },
      },
    })

    // Update session heartbeat
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    })

    // Verify item belongs to an open bill
    const item = await prisma.billItem.findUnique({
      where: { id: billItemId },
      select: { billId: true, isPaid: true },
    })
    if (!item || item.billId !== billId || item.isPaid) {
      return Response.json({ ok: false, conflict: true })
    }

    // Atomic lock: unique constraint on billItemId = no two sessions can lock the same unit
    try {
      await prisma.itemLock.create({
        data: { billItemId, billId, sessionId: session.id },
      })
      return Response.json({ ok: true })
    } catch (e: unknown) {
      // P2002 = unique constraint violation → another session got there first
      if (isUniqueViolation(e)) {
        return Response.json({ ok: false, conflict: true })
      }
      throw e
    }
  } catch (err) {
    console.error('[T10] lock error:', err)
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}

function isUniqueViolation(e: unknown): boolean {
  return typeof e === 'object' && e !== null && 'code' in e && (e as { code: string }).code === 'P2002'
}
