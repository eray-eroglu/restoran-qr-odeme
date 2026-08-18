/**
 * T10 — /t/[token]/items — BY_ITEM item selection screen.
 *
 * Server component:
 *   1. Fetches bill + items + their locks + the current guest's session.
 *   2. R7: cleans up stale locks from silent sessions before rendering.
 *   3. Passes item rows (with per-item lock state) to ItemsSelector.
 *
 * The ItemsSelector client component handles:
 *   - Optimistic toggle via /api/items/lock and /api/items/unlock (R6)
 *   - ~1.5 s polling to see other guests' selections live (D24)
 *   - Conflict banner (R6 soft conflict)
 */

import { cookies } from 'next/headers'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import ItemsSelector, { type ItemRow } from './ItemsSelector'

export const dynamic = 'force-dynamic'

const STALE_MS = 60_000 // R7

type Props = { params: Promise<{ token: string }> }

export default async function ItemsPage({ params }: Props) {
  const { token } = await params

  const table = await prisma.table.findUnique({
    where: { token },
    include: {
      bills: {
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          items: {
            orderBy: { createdAt: 'asc' },
            include: { lock: { include: { session: true } } },
          },
        },
      },
    },
  })

  if (!table) notFound()

  const bill = table.bills[0]
  if (!bill) redirect(`/t/${token}`)
  if (bill.mode !== 'BY_ITEM') redirect(`/t/${token}`)

  // R7: release unpaid locks from sessions not seen for > 60 s
  await prisma.itemLock.deleteMany({
    where: {
      isPaid: false,
      billId: bill.id,
      session: { lastSeenAt: { lt: new Date(Date.now() - STALE_MS) } },
    },
  })

  // Find this guest's session from cookie (may be null for brand-new guests)
  const cookieStore = await cookies()
  const guestToken  = cookieStore.get('guest_session')?.value ?? null
  const mySession   = guestToken
    ? await prisma.session.findUnique({ where: { token: guestToken } })
    : null

  const mySessionId = mySession?.id ?? null

  // Re-fetch items after stale cleanup to get accurate lock state
  const freshItems = await prisma.billItem.findMany({
    where: { billId: bill.id },
    orderBy: { createdAt: 'asc' },
    include: { lock: true },
  })

  const rows: ItemRow[] = freshItems.map((item) => ({
    id:            item.id,
    name:          item.name,
    priceKurus:    item.priceKurus,
    isPaid:        item.isPaid,
    lockedByMe:    !!item.lock && item.lock.sessionId === mySessionId,
    lockedByOther: !!item.lock && item.lock.sessionId !== mySessionId,
  }))

  return (
    <ItemsSelector
      billId={bill.id}
      tableToken={token}
      items={rows}
      mySessionId={mySessionId ?? ''}
    />
  )
}
