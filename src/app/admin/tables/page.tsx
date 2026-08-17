// E8 — Admin: table list (desktop)
// Single table: each row shows total / paid / remaining / mode + action buttons.

import Link from 'next/link'
import { getAdminTables } from '@/lib/mock'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'

export default async function AdminTablesPage() {
  const tables = await getAdminTables()
  const s = strings.admin.tables

  return (
    <div className="min-h-screen bg-brand-surface-off">
      {/* Top bar */}
      <header className="bg-white border-b border-brand-border px-8 py-4 flex justify-between items-center">
        <h1 className="text-[22px] text-brand-black">{s.title}</h1>
        <button className="h-10 px-5 border-2 border-brand-black rounded-lg text-[15px] text-brand-black hover:bg-brand-surface transition-colors">
          {s.newTable}
        </button>
      </header>

      {/* Table */}
      <div className="p-8 overflow-x-auto">
        <table className="w-full border-2 border-brand-black rounded-xl overflow-hidden bg-white" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
          <thead>
            <tr className="bg-brand-surface border-b-2 border-brand-black">
              {[s.colTable, s.colTotal, s.colPaid, s.colRemaining, s.colMode, s.colActions].map((col) => (
                <th key={col} className="text-left px-5 py-3 text-sm font-medium tracking-wider text-brand-grey-mid uppercase">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tables.map((table, i) => {
              const remaining = table.totalAmount !== null && table.paidAmount !== null
                ? table.totalAmount - table.paidAmount
                : null

              return (
                <tr key={table.id} className={`border-b border-brand-border last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-brand-surface-off/30'}`}>
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
                        <button className="h-8 px-3 border-2 border-brand-black rounded-md text-[14px] text-brand-black hover:bg-brand-black hover:text-white transition-colors">
                          {s.newBill}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        {tables.length === 0 && (
          <p className="text-center py-12 text-brand-grey-mid">{s.noTables}</p>
        )}
      </div>
    </div>
  )
}
