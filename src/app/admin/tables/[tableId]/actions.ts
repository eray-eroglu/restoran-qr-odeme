'use server'
/**
 * T06 — Admin table detail server actions.
 */

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

function revalidate(tableId: string) {
  revalidatePath(`/admin/tables/${tableId}`)
  revalidatePath('/admin/tables')
}

/** Add one unit of a menu item to an open bill. */
export async function addBillItem(formData: FormData) {
  const billId = String(formData.get('billId') ?? '')
  const menuItemId = String(formData.get('menuItemId') ?? '')
  const tableId = String(formData.get('tableId') ?? '')
  if (!billId || !menuItemId) return

  const item = await prisma.menuItem.findUnique({ where: { id: menuItemId } })
  if (!item) return

  await prisma.billItem.create({
    data: { billId, name: item.name, priceKurus: item.priceKurus },
  })
  revalidate(tableId)
}

/** Remove a single unpaid bill item. */
export async function removeBillItem(formData: FormData) {
  const billItemId = String(formData.get('billItemId') ?? '')
  const tableId = String(formData.get('tableId') ?? '')
  if (!billItemId) return

  // Only remove if not yet paid
  const item = await prisma.billItem.findUnique({ where: { id: billItemId } })
  if (!item || item.isPaid) return

  await prisma.billItem.delete({ where: { id: billItemId } })
  revalidate(tableId)
}

/**
 * Close the open bill for a table.
 * The remaining balance is treated as collected by other means (escape hatch).
 * Confirmation is handled on the client before this is called.
 */
export async function closeBill(formData: FormData) {
  const billId = String(formData.get('billId') ?? '')
  const tableId = String(formData.get('tableId') ?? '')
  if (!billId) return

  await prisma.bill.update({
    where: { id: billId },
    data: { status: 'CLOSED', closedAt: new Date() },
  })
  revalidate(tableId)
}

/** Open a fresh bill for a table that has no open bill. */
export async function openBillForTable(formData: FormData) {
  const tableId = String(formData.get('tableId') ?? '')
  if (!tableId) return
  await prisma.bill.create({ data: { tableId, status: 'OPEN' } })
  revalidate(tableId)
}
