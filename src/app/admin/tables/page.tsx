// E8 — Admin: table list (T05 — real DB)
// Replaces mock data with live Prisma queries.

import Link from 'next/link'
import { prisma } from '@/lib/db'
import { strings, formatTLNoUnit, formatTL } from '@/lib/strings'
import { openBill } from './actions'
import NewTableForm from './NewTableForm'

export const dynamic = 'force-dynamic'

// Map DB enum values to display strings
function displayMode(mode: string | null): string {
  if (!mode || mode === 'NONE') return '—'
  if (mode === 'EQUAL_SPLIT') return 'eşit böl'
  if (mode === 'BY_ITEM') return 'ürüne göre'
  return mode.toLowerCase()
}

async function getTablesWithBills() {
  const rows = await prisma.table.findMany({
    include: {
      bills: {
        // Latest bill only — determines the table's current status
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          items: { select: { priceKurus: true } },
          payments: {
            where: { status: 'SUCCEEDED' },
            select: { amountKurus: true },
          },
        },
      },
    },
    orderBy: { name: 'asc' },
  })

  return rows.map((table) => {
    const bill = table.bills[0] ?? null
    const status: 'no_bill' | 'open' | 'closed' = !bill
      ? 'no_bill'
      : bill.status === 'OPEN'
        ? 'open'
        : 'closed'

    // Amounts in kuruş → TL for display helpers
    const totalKurus = bill ? bill.items.reduce((s, i) => s + i.priceKurus, 0) : null
    const paidKurus = bill ? bill.payments.reduce((s, p) => s + p.amountKurus, 0) : null

    return {
      id: table.id,
      name: table.name,
      status,
      totalAmount: totalKurus !== null ? totalKurus / 100 : null,
      paidAmount: paidKurus !== null ? paidKurus / 100 : null,
      mode: bill ? displayMode(bill.mode) : null,
      billId: bill?.id ?? null,
    }
  })
}

// A single table row, shared between both sections
function TableRow({
  table,
  s,
}: {
  table: Awaited<ReturnType<typeof getTablesWithBills>>[number]
  s: typeof strings.admin.tables
}) {
  const remaining =
    table.totalAmount !== null && table.paidAmount !== null
      ? table.totalAmount - table.paidAmount
      : null

  const isClosed = table.status === 'closed'

  return (
    <tr className={`border-b border-brand-border last:border-0 ${isClosed ? 'opacity-50' : ''}`}>
      <td className="px-5 py-4 text-[17px] text-brand-black font-medium">
        <Link href={`/admin/tables/${table.id}`} className="hover:underline">
          {table.name}
        </Link>
      </td>
      <td className="px-5 py-4 text-[17px] text-brand-grey-dark">
        {table.totalAmount !== null ? formatTLNoUnit(table.totalAmount) : '—'}
      </td>
      <td className="px-5 py-4 text-[17px] text-brand-grey-dark">
        {table.paidAmount !== null ? formatTLNoUnit(table.paidAmount) : '—'}
      </td>
      <td className="px-5 py-4 text-[17px] text-brand-grey-dark">
        {remaining !== null ? formatTLNoUnit(remaining) : '—'}
      </td>
      <td className="px-5 py-4 text-[15px] text-brand-grey-mid">
        {table.mode ?? s.statusNoBill}
      </td>
      <td className="px-5 py-4">
        <div className="flex gap-2">
          <Link
            href={`/admin/tables/${table.id}`}
            className="h-8 px-3 border border-brand-border rounded-md text-[14px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors"
          >
            Detay
          </Link>
          {table.status === 'no_bill' && (
            <form action={openBill}>
              <input type="hidden" name="tableId" value={table.id} />
              <button
                type="submit"
                className="h-8 px-3 border-2 border-brand-black rounded-md text-[14px] text-brand-black hover:bg-brand-black hover:text-white transition-colors"
              >
                {s.newBill}
              </button>
            </form>
          )}
        </div>
      </td>
    </tr>
  )
}

// The column header row
function TableHead({ s }: { s: typeof strings.admin.tables }) {
  return (
    <thead>
      <tr className="bg-brand-surface border-b-2 border-brand-black">
        {[s.colTable, s.colTotal, s.colPaid, s.colRemaining, s.colMode, s.colActions].map((col) => (
          <th
            key={col}
            className="text-left px-5 py-3 text-sm font-medium tracking-wider text-brand-grey-mid uppercase"
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  )
}

export default async function AdminTablesPage() {
  const tables = await getTablesWithBills()
  const s = strings.admin.tables

  const activeTables = tables.filter((t) => t.status !== 'closed')
  const closedTables = tables.filter((t) => t.status === 'closed')

  return (
    <div className="min-h-screen bg-brand-surface-off">
      {/* Top bar */}
      <header className="bg-white border-b border-brand-border px-8 py-4 flex justify-between items-center">
        <h1 className="text-[22px] text-brand-black">{s.title}</h1>
        <NewTableForm />
      </header>

      <div className="p-8 flex flex-col gap-8">
        {/* Active + no-bill tables */}
        <div className="overflow-x-auto">
          <table
            className="w-full border-2 border-brand-black rounded-xl overflow-hidden bg-white"
            style={{ borderCollapse: 'separate', borderSpacing: 0 }}
          >
            <TableHead s={s} />
            <tbody>
              {activeTables.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-brand-grey-mid">
                    {s.noTables}
                  </td>
                </tr>
              ) : (
                activeTables.map((table) => (
                  <TableRow key={table.id} table={table} s={s} />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Closed tables — visually separated (R: acceptance criteria) */}
        {closedTables.length > 0 && (
          <div className="overflow-x-auto">
            <h2 className="text-[13px] font-medium tracking-wider uppercase text-brand-grey-mid mb-3">
              {s.closedSection}
            </h2>
            <table
              className="w-full border border-brand-border rounded-xl overflow-hidden bg-white"
              style={{ borderCollapse: 'separate', borderSpacing: 0 }}
            >
              <TableHead s={s} />
              <tbody>
                {closedTables.map((table) => (
                  <TableRow key={table.id} table={table} s={s} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
