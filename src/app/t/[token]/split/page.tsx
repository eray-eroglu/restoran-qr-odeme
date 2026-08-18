/**
 * T09 — /t/[token]/split — headcount screen
 *
 * Server component: fetches the open bill, enforces R5, then renders
 * the SplitSelector client component (the −/+ stepper).
 *
 * R5: if there is already a SUCCEEDED payment the headcount is locked —
 * redirect back to /t/[token] (the bill screen will show S1-c in mode).
 */

import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import SplitSelector from './SplitSelector'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ token: string }> }

export default async function SplitPage({ params }: Props) {
  const { token } = await params

  const table = await prisma.table.findUnique({
    where: { token },
    include: {
      bills: {
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          items: { select: { priceKurus: true } },
          payments: { where: { status: 'SUCCEEDED' }, select: { amountKurus: true } },
        },
      },
    },
  })

  if (!table) notFound()

  const bill = table.bills[0]

  // No open bill → back to bill screen
  if (!bill) redirect(`/t/${token}`)

  // R5: headcount is locked after the first succeeded payment
  if (bill.payments.length > 0) redirect(`/t/${token}`)

  const totalKurus = bill.items.reduce((s, i) => s + i.priceKurus, 0)
  const paidKurus  = bill.payments.reduce((s, p) => s + p.amountKurus, 0)

  return (
    <SplitSelector
      billId={bill.id}
      tableToken={token}
      totalKurus={totalKurus}
      paidKurus={paidKurus}
      initialPeople={bill.splitPeople ?? 2}
    />
  )
}
