'use server'
/**
 * T12 — Guest-level bill actions.
 *
 * resetMode: resets the split mode to NONE so guests can pick a different one.
 *   - R4: only allowed before the first SUCCEEDED payment.
 *   - Clears all unpaid ItemLocks (BY_ITEM cleanup) before resetting.
 */

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

export async function resetMode(formData: FormData) {
  const billId     = String(formData.get('billId')     ?? '')
  const tableToken = String(formData.get('tableToken') ?? '')

  if (!billId || !tableToken) redirect(`/t/${tableToken}`)

  // R4: mode is locked after the first succeeded payment
  const paidCount = await prisma.payment.count({
    where: { billId, status: 'SUCCEEDED' },
  })
  if (paidCount > 0) redirect(`/t/${tableToken}`)

  // Clear unpaid selections — BY_ITEM cleanup (paid locks survive, R4)
  await prisma.itemLock.deleteMany({
    where: { billId, isPaid: false },
  })

  // Reset split mode and headcount
  await prisma.bill.update({
    where: { id: billId, status: 'OPEN' },
    data: { mode: 'NONE', splitPeople: null },
  })

  redirect(`/t/${tableToken}`)
}
