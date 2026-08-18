/**
 * POST /api/items/unlock
 *
 * Releases an ItemLock held by the current guest session.
 * No-ops silently if the lock doesn't exist or belongs to another session.
 * Paid locks (isPaid=true) are permanent and cannot be unlocked.
 */

import { type NextRequest } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { billItemId, billId } = await request.json() as { billItemId?: string; billId?: string }

    if (!billItemId || !billId) {
      return Response.json({ ok: false, error: 'missing fields' }, { status: 400 })
    }

    const guestToken = request.cookies.get('guest_session')?.value
    if (!guestToken) return Response.json({ ok: false, error: 'no session' }, { status: 401 })

    const session = await prisma.session.findUnique({ where: { token: guestToken } })
    if (!session) return Response.json({ ok: false, error: 'no session' }, { status: 401 })

    // Update heartbeat
    await prisma.session.update({
      where: { id: session.id },
      data: { lastSeenAt: new Date() },
    })

    // Delete only if this session owns it and it's not yet paid
    await prisma.itemLock.deleteMany({
      where: { billItemId, sessionId: session.id, isPaid: false },
    })

    return Response.json({ ok: true })
  } catch (err) {
    console.error('[T10] unlock error:', err)
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
