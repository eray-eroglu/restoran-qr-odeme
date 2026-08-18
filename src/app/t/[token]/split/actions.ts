'use server'
/**
 * T09 — Equal split server actions.
 */

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

/**
 * Set the bill's split mode and headcount.
 *
 * Rules enforced here:
 *  - Bill must be OPEN.
 *  - If there is already a SUCCEEDED payment (R5), headcount is locked — redirect
 *    back to the bill screen without changing anything.
 *  - People count must be ≥ 2.
 *
 * On success: sets mode=EQUAL_SPLIT, splitPeople=N, then redirects to /t/[token]/pay
 * so the guest immediately lands on their share's payment screen.
 */
export async function setEqualSplit(formData: FormData) {
  const billId     = String(formData.get('billId')     ?? '')
  const tableToken = String(formData.get('tableToken') ?? '')
  const people     = parseInt(String(formData.get('people') ?? '2'), 10)

  if (!billId || !tableToken || isNaN(people) || people < 2) {
    redirect(`/t/${tableToken}`)
  }

  // R5: headcount cannot change after the first payment
  const paidCount = await prisma.payment.count({
    where: { billId, status: 'SUCCEEDED' },
  })

  if (paidCount > 0) {
    // Already locked — just go to the bill screen (S1-c)
    redirect(`/t/${tableToken}`)
  }

  await prisma.bill.update({
    where: { id: billId, status: 'OPEN' },
    data: { mode: 'EQUAL_SPLIT', splitPeople: people },
  })

  // Redirect straight to payment — the guest is the first/next in line
  redirect(`/t/${tableToken}/pay`)
}
