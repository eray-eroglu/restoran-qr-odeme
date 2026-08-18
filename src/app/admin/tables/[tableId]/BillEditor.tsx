'use client'
/**
 * T06 — Interactive bill editor for the admin table detail.
 *
 * Shows current bill items (with remove buttons) and the full demo menu to
 * add items. Mutations go through server actions; the router is refreshed so
 * the server component re-fetches and the total updates.
 */

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addBillItem, removeBillItem } from './actions'
import { formatTL, formatTLNoUnit } from '@/lib/strings'

type BillItem = {
  id: string
  name: string
  priceKurus: number
  isPaid: boolean
}

type MenuItem = {
  id: string
  name: string
  priceKurus: number
  category: string
}

type Props = {
  billId: string
  tableId: string
  items: BillItem[]
  menu: MenuItem[]
  totalKurus: number
  canEdit: boolean // false if bill is closed
}

// Group menu items by category
function groupByCategory(items: MenuItem[]): Record<string, MenuItem[]> {
  return items.reduce<Record<string, MenuItem[]>>((acc, item) => {
    ;(acc[item.category] ??= []).push(item)
    return acc
  }, {})
}

export default function BillEditor({ billId, tableId, items, menu, totalKurus, canEdit }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function refresh() {
    router.refresh()
  }

  const menuByCategory = groupByCategory(menu)

  return (
    <div className="flex flex-col gap-4">
      {/* Current bill items */}
      <div className="flex flex-col gap-2">
        {items.length === 0 ? (
          <p className="text-brand-grey-mid text-base py-2">Adisyon boş.</p>
        ) : (
          <>
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-[16px]">
                <div className="flex items-center gap-2 min-w-0">
                  {canEdit && !item.isPaid && (
                    <form
                      action={async (fd) => {
                        startTransition(async () => {
                          await removeBillItem(fd)
                          refresh()
                        })
                      }}
                    >
                      <input type="hidden" name="billItemId" value={item.id} />
                      <input type="hidden" name="tableId" value={tableId} />
                      <button
                        type="submit"
                        disabled={pending}
                        className="w-6 h-6 rounded-full border border-brand-border text-brand-grey-mid hover:border-red-400 hover:text-red-400 text-sm leading-none flex items-center justify-center transition-colors"
                        title="Kaldır"
                      >
                        ×
                      </button>
                    </form>
                  )}
                  <span className={`text-brand-black truncate ${item.isPaid ? 'line-through text-brand-grey-mid' : ''}`}>
                    {item.name}
                  </span>
                  {item.isPaid && (
                    <span className="text-xs text-brand-grey-mid shrink-0">ödendi</span>
                  )}
                </div>
                <span className="text-brand-grey-dark shrink-0 ml-3">
                  {formatTLNoUnit(item.priceKurus / 100)}
                </span>
              </div>
            ))}
            <div className="pt-3 border-t border-brand-border flex justify-between text-[19px] font-medium">
              <span className="text-brand-black">Toplam</span>
              <span className="text-brand-black">{formatTL(totalKurus / 100)}</span>
            </div>
          </>
        )}
      </div>

      {/* Demo menu — add items */}
      {canEdit && (
        <details className="border border-brand-border rounded-lg overflow-hidden">
          <summary className="px-4 py-2.5 text-[14px] text-brand-grey-dark hover:bg-brand-surface cursor-pointer select-none">
            Menüden ekle
          </summary>
          <div className="px-4 pb-4 flex flex-col gap-4 pt-3 border-t border-brand-border">
            {Object.entries(menuByCategory).map(([category, categoryItems]) => (
              <div key={category}>
                <p className="text-xs font-medium tracking-wider uppercase text-brand-grey-mid mb-2">
                  {category}
                </p>
                <div className="flex flex-col gap-1">
                  {categoryItems.map((mi) => (
                    <form
                      key={mi.id}
                      action={async (fd) => {
                        startTransition(async () => {
                          await addBillItem(fd)
                          refresh()
                        })
                      }}
                      className="flex justify-between items-center"
                    >
                      <input type="hidden" name="billId" value={billId} />
                      <input type="hidden" name="menuItemId" value={mi.id} />
                      <input type="hidden" name="tableId" value={tableId} />
                      <button
                        type="submit"
                        disabled={pending}
                        className="flex-1 text-left py-1.5 text-[15px] text-brand-black hover:text-brand-grey-dark transition-colors disabled:opacity-40"
                      >
                        {mi.name}
                      </button>
                      <span className="text-[14px] text-brand-grey-mid ml-4 shrink-0">
                        {formatTLNoUnit(mi.priceKurus / 100)}
                      </span>
                    </form>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
