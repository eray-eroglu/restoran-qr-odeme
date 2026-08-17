'use client'
// E3 — Item selection
// States:
//   E3-a  no selection → total grey, Öde button disabled
//   E3-b  items selected → total live, Öde button active
//   E3-c  conflict → info banner, conflicting item in dashed state

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'
import type { BillItem } from '@/lib/mock'

// Mock — replaced by getTableBill() in T10
const MOCK_REMAINING = 1306.67
const TABLE_NAME = 'Masa 7'
const MOCK_ITEMS: BillItem[] = [
  { id: 'i1a', name: 'Adana Kebap', pricePerUnit: 480, quantity: 1, paidQuantity: 1 }, // paid
  { id: 'i1b', name: 'Adana Kebap', pricePerUnit: 480, quantity: 1, paidQuantity: 0 },
  { id: 'i2',  name: 'İçli Köfte',  pricePerUnit: 220, quantity: 1, paidQuantity: 0, lockedBy: 'other' }, // selected by other
  { id: 'i3a', name: 'Ayran',       pricePerUnit: 45,  quantity: 1, paidQuantity: 0 },
  { id: 'i3b', name: 'Ayran',       pricePerUnit: 45,  quantity: 1, paidQuantity: 0 },
  { id: 'i3c', name: 'Ayran',       pricePerUnit: 45,  quantity: 1, paidQuantity: 0, lockedBy: 'other' }, // selected by other
  { id: 'i4a', name: 'Efes (50cl)', pricePerUnit: 190, quantity: 1, paidQuantity: 0 },
  { id: 'i4b', name: 'Efes (50cl)', pricePerUnit: 190, quantity: 1, paidQuantity: 0 },
  { id: 'i5',  name: 'Künefe',      pricePerUnit: 265, quantity: 1, paidQuantity: 0 },
]

// Conflict item ID — simulates a race condition (set to null to remove the banner)
const CONFLICT_ITEM_ID: string | null = null

export default function ItemsPage() {
  const router = useRouter()
  const s = strings.items
  const [selected, setSelected] = useState<Set<string>>(new Set())

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectedItems = MOCK_ITEMS.filter((i) => selected.has(i.id))
  const total = selectedItems.reduce((sum, i) => sum + i.pricePerUnit, 0)
  const hasSelection = selected.size > 0

  function proceed() {
    const ids = Array.from(selected).join(',')
    router.push(`/table/7/pay?mode=items&items=${ids}&amount=${total}`)
  }

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header */}
      <div className="px-5 pt-4 pb-4 border-b-2 border-brand-black flex flex-col gap-1.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
          {TABLE_NAME} · {s.label}
        </p>
        <p className={`text-[52px] leading-none ${hasSelection ? 'text-brand-black' : 'text-brand-grey-light'}`}>
          {formatTL(total)}
        </p>
        <p className="text-[17px] text-brand-grey-dark">
          {hasSelection
            ? s.selectionHint(selected.size)
            : s.hint(formatTLNoUnit(MOCK_REMAINING))}
        </p>
      </div>

      {/* Conflict banner */}
      {CONFLICT_ITEM_ID && (
        <div className="mx-4 mt-3 border-2 border-brand-grey-dark rounded-lg p-3 flex gap-3 items-start bg-brand-surface">
          <div className="w-[26px] h-[26px] border-2 border-brand-grey-dark rounded-full flex items-center justify-center text-base text-brand-grey-dark flex-none">
            i
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[18px] text-brand-black">{s.conflictTitle}</span>
            <span className="text-[15px] text-brand-grey-dark">
              {s.conflictSub(MOCK_ITEMS.find((i) => i.id === CONFLICT_ITEM_ID)?.name ?? '')}
            </span>
          </div>
        </div>
      )}

      {/* Item list */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-2">
        {MOCK_ITEMS.map((item) => {
          const isPaid      = (item.paidQuantity ?? 0) >= 1
          const isLocked    = !!item.lockedBy && !isPaid
          const isConflict  = item.id === CONFLICT_ITEM_ID
          const isMine      = selected.has(item.id)

          if (isPaid) {
            // State: paid — grey, strikethrough, not tappable
            return (
              <div key={item.id} className="h-[64px] border-2 border-brand-border rounded-lg flex items-center gap-3 px-3.5 bg-brand-surface-card">
                <div className="w-[26px] h-[26px] border-2 border-brand-grey-light rounded-md flex items-center justify-center text-[15px] text-brand-grey-mid">✓</div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[19px] text-brand-grey-mid line-through">{item.name}</span>
                  <span className="text-sm text-brand-grey-mid">{s.statePaid}</span>
                </div>
                <span className="text-[19px] text-brand-grey-mid line-through">{formatTLNoUnit(item.pricePerUnit)}</span>
              </div>
            )
          }

          if (isLocked && !isMine) {
            // State: selected by someone else — dashed border, hatching
            return (
              <div key={item.id} className="h-[64px] border-2 border-dashed border-brand-grey-mid rounded-lg flex items-center gap-3 px-3.5 hatch-light">
                <div className="w-[26px] h-[26px] border-2 border-dashed border-brand-grey-mid rounded-md" />
                <div className="flex-1 flex flex-col">
                  <span className="text-[19px] text-brand-grey-dark">{item.name}</span>
                  <span className="text-sm text-brand-grey-mid">
                    {isConflict ? s.stateJustSelected : s.stateSelectedByOther}
                  </span>
                </div>
                <span className="text-[19px] text-brand-grey-dark">{formatTLNoUnit(item.pricePerUnit)}</span>
              </div>
            )
          }

          if (isMine) {
            // State: selected by me — filled dark
            return (
              <button key={item.id} onClick={() => toggle(item.id)}
                className="h-[64px] border-[3px] border-brand-black rounded-lg flex items-center gap-3 px-3 bg-brand-black text-white w-full text-left">
                <div className="w-[26px] h-[26px] border-2 border-white rounded-md flex items-center justify-center text-base">✓</div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[19px]">{item.name}</span>
                  <span className="text-sm opacity-70">{s.stateMyChoice}</span>
                </div>
                <span className="text-[19px]">{formatTLNoUnit(item.pricePerUnit)}</span>
              </button>
            )
          }

          // State: available — plain border, tappable
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className="h-[64px] border-2 border-brand-black rounded-lg flex items-center gap-3 px-3.5 w-full text-left">
              <div className="w-[26px] h-[26px] border-2 border-brand-black rounded-md" />
              <span className="flex-1 text-[19px] text-brand-black">{item.name}</span>
              <span className="text-[19px] text-brand-black">{formatTLNoUnit(item.pricePerUnit)}</span>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface">
        {hasSelection ? (
          <button onClick={proceed}
            className="w-full h-[68px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[22px] bg-brand-black text-white">
            {s.pay(formatTL(total))}
          </button>
        ) : (
          <div className="w-full h-[68px] border-2 border-brand-border rounded-lg flex items-center justify-center text-[22px] text-brand-grey-light bg-brand-surface-card">
            {s.payDisabled}
          </div>
        )}
      </div>
    </main>
  )
}
