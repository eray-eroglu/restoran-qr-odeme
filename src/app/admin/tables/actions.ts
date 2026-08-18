'use server'
/**
 * T05 — Admin table list server actions.
 * All DB mutations go through here; pages stay pure async components.
 */

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

/** Create a new empty table with the given name. */
export async function createTable(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) return
  await prisma.table.create({ data: { name } })
  revalidatePath('/admin/tables')
}

/**
 * Create a pre-filled sample table in one click.
 * Takes the first 5 active menu items as a starter bill.
 * Used for repeat testing without hand-entering items every run.
 */
export async function createSampleTable() {
  const items = await prisma.menuItem.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    take: 5,
  })
  if (!items.length) return

  const count = await prisma.table.count()

  await prisma.table.create({
    data: {
      name: `Test ${count + 1}`,
      bills: {
        create: {
          status: 'OPEN',
          items: {
            create: items.map((i) => ({ name: i.name, priceKurus: i.priceKurus })),
          },
        },
      },
    },
  })

  revalidatePath('/admin/tables')
}

/** Open a new bill for a table that currently has no open bill. */
export async function openBill(formData: FormData) {
  const tableId = String(formData.get('tableId') ?? '').trim()
  if (!tableId) return
  await prisma.bill.create({ data: { tableId, status: 'OPEN' } })
  revalidatePath('/admin/tables')
}
