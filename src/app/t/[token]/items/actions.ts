'use server'
/**
 * T10 — BY_ITEM split server actions.
 */

import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'

/**
 * Set the bill's split mode to BY_ITEM.
 * Called when the guest taps "Kendi ürünlerimi seç" in S1-b.
 *
 * - If mode is already BY_ITEM: redirect to items screen (idempotent).
 * - If mode is NONE: atomically set to BY_ITEM.
 * - If mode is EQUAL_SPLIT: redirect back to bill (can't switch modes after EQUAL_SPLIT is set).
 */
export async function setByItemMode(formData: FormData) {
  const billId     = String(formData.get('billId')     ?? '')
  const tableToken = String(formData.get('tableToken') ?? '')

  if (!billId || !tableToken) redirect(`/t/${tableToken}`)

  const bill = await prisma.bill.findUnique({
    where: { id: billId },
    select: { mode: true, status: true },
  })

  if (!bill || bill.status !== 'OPEN') redirect(`/t/${tableToken}`)

  // Already set — go straight to items
  if (bill.mode === 'BY_ITEM') redirect(`/t/${tableToken}/items`)

  // Wrong mode already set by someone else
  if (bill.mode === 'EQUAL_SPLIT') redirect(`/t/${tableToken}`)

  // Atomically set mode: only succeeds if still NONE
  // (Prisma throws if no record matches the where clause)
  try {
    await prisma.bill.update({
      where: { id: billId, mode: 'NONE' },
      data: { mode: 'BY_ITEM' },
    })
  } catch {
    // Another guest changed the mode in the meantime — go back and let them see the new state
    redirect(`/t/${tableToken}`)
  }

  redirect(`/t/${tableToken}/items`)
}
