'use client'
/**
 * T10 — Item selection UI for BY_ITEM split mode.
 *
 * Three states per item (R6):
 *   available  — plain border, tappable
 *   mine       — filled dark, tappable (removes selection)
 *   others     — dashed border + "seçildi" label, not tappable
 *   paid       — grey strikethrough, not tappable
 *
 * Optimistic UI: tap is instant, API call runs in background.
 * Conflict: soft banner appears, selection reverted (R6).
 * Server props sync `myLocks` after each router.refresh() so R7 stale-lock
 * releases are reflected without a manual page reload.
 */

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'
import Poller from '../Poller'

export type ItemRow = {
  id: string
  name: string
  priceKurus: number
  isPaid: boolean
  lockedByMe: boolean
  lockedByOther: boolean
}

type Props = {
  billId: string
  tableToken: string
  items: ItemRow[]
  mySessionId: string
}

const FAST_POLL_MS = 1_500

export default function ItemsSelector({ billId, tableToken, items, mySessionId }: Props) {
  const router = useRouter()
  const s = strings.items

  // Derive initial lock state from server
  const initLocks = () => new Set(items.filter((i) => i.lockedByMe).map((i) => i.id))

  const [myLocks, setMyLocks] = useState<Set<string>>(initLocks)
  const [conflicts, setConflicts] = useState<Set<string>>(new Set())
  const inFlight = useRef<Set<string>>(new Set()) // items with pending API calls

  // Sync server lock state after each router.refresh() — handles R7 stale cleanup
  // Skip items that are currently in-flight to avoid flickering
  const serverLocksKey = items
    .filter((i) => i.lockedByMe)
    .map((i) => i.id)
    .sort()
    .join(',')

  useEffect(() => {
    const serverLocks = new Set(items.filter((i) => i.lockedByMe).map((i) => i.id))
    setMyLocks((prev) => {
      // For items not in flight: use server truth. For in-flight: keep client optimism.
      const next = new Set(prev)
      for (const item of items) {
        if (inFlight.current.has(item.id)) continue // don't touch in-flight items
        if (serverLocks.has(item.id)) next.add(item.id)
        else next.delete(item.id)
      }
      return next
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [serverLocksKey])

  async function toggle(item: ItemRow) {
    if (item.isPaid || item.lockedByOther || inFlight.current.has(item.id)) return

    const isLocked = myLocks.has(item.id)
    // Optimistic update
    setMyLocks((prev) => {
      const next = new Set(prev)
      if (isLocked) next.delete(item.id)
      else next.add(item.id)
      return next
    })
    setConflicts((prev) => {
      const next = new Set(prev)
      next.delete(item.id)
      return next
    })

    inFlight.current.add(item.id)
    try {
      const endpoint = isLocked ? '/api/items/unlock' : '/api/items/lock'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ billItemId: item.id, billId }),
      })
      const data = await res.json() as { ok: boolean; conflict?: boolean }

      if (!data.ok && data.conflict) {
        // Revert optimistic update + show soft conflict banner
        setMyLocks((prev) => {
          const next = new Set(prev)
          next.delete(item.id) // remove if we just tried to lock
          return next
        })
        setConflicts((prev) => new Set(prev).add(item.id))
        // Clear conflict banner after 4 s
        setTimeout(() => {
          setConflicts((prev) => {
            const next = new Set(prev)
            next.delete(item.id)
            return next
          })
        }, 4_000)
      }
    } catch {
      // Network error — revert
      setMyLocks((prev) => {
        const next = new Set(prev)
        if (isLocked) next.add(item.id)    // was locked, put back
        else next.delete(item.id)           // wasn't locked, remove
        return next
      })
    } finally {
      inFlight.current.delete(item.id)
    }
  }

  const selectedItems   = items.filter((i) => myLocks.has(i.id) && !i.isPaid)
  const totalKurus      = selectedItems.reduce((s, i) => s + i.priceKurus, 0)
  const hasSelection    = selectedItems.length > 0
  const firstConflict   = items.find((i) => conflicts.has(i.id)) ?? null
  const remainingKurus  = items.filter((i) => !i.isPaid).reduce((s, i) => s + i.priceKurus, 0)

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header — live selection total */}
      <div className="px-5 pt-4 pb-4 border-b-2 border-brand-black flex flex-col gap-1.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
          {s.label}
        </p>
        <p className={`text-[52px] leading-none ${hasSelection ? 'text-brand-black' : 'text-brand-grey-light'}`}>
          {formatTL(totalKurus / 100)}
        </p>
        <p className="text-[17px] text-brand-grey-dark">
          {hasSelection
            ? s.selectionHint(selectedItems.length)
            : s.hint(formatTLNoUnit(remainingKurus / 100))}
        </p>
      </div>

      {/* Conflict banner (R6 — soft info, not an error) */}
      {firstConflict && (
        <div className="mx-4 mt-3 border-2 border-brand-grey-dark rounded-lg p-3 flex gap-3 items-start bg-brand-surface">
          <div className="w-[26px] h-[26px] border-2 border-brand-grey-dark rounded-full flex items-center justify-center text-base text-brand-grey-dark flex-none">
            i
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="text-[18px] text-brand-black">{s.conflictTitle}</span>
            <span className="text-[15px] text-brand-grey-dark">
              {s.conflictSub(firstConflict.name)}
            </span>
          </div>
        </div>
      )}

      {/* Item list */}
      <div className="flex-1 overflow-y-auto px-4 py-3.5 flex flex-col gap-2">
        {items.map((item) => {
          const isMine      = myLocks.has(item.id) && !item.isPaid
          const isConflict  = conflicts.has(item.id)

          if (item.isPaid) {
            return (
              <div key={item.id} className="h-[64px] border-2 border-brand-border rounded-lg flex items-center gap-3 px-3.5 bg-brand-surface-card">
                <div className="w-[26px] h-[26px] border-2 border-brand-grey-light rounded-md flex items-center justify-center text-[15px] text-brand-grey-mid">✓</div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[19px] text-brand-grey-mid line-through">{item.name}</span>
                  <span className="text-sm text-brand-grey-mid">{s.statePaid}</span>
                </div>
                <span className="text-[19px] text-brand-grey-mid line-through">{formatTLNoUnit(item.priceKurus / 100)}</span>
              </div>
            )
          }

          if (item.lockedByOther) {
            return (
              <div key={item.id} className="h-[64px] border-2 border-dashed border-brand-grey-mid rounded-lg flex items-center gap-3 px-3.5">
                <div className="w-[26px] h-[26px] border-2 border-dashed border-brand-grey-mid rounded-md" />
                <div className="flex-1 flex flex-col">
                  <span className="text-[19px] text-brand-grey-dark">{item.name}</span>
                  <span className="text-sm text-brand-grey-mid">
                    {isConflict ? s.stateJustSelected : s.stateSelectedByOther}
                  </span>
                </div>
                <span className="text-[19px] text-brand-grey-dark">{formatTLNoUnit(item.priceKurus / 100)}</span>
              </div>
            )
          }

          if (isMine) {
            return (
              <button
                key={item.id}
                onClick={() => toggle(item)}
                className="h-[64px] border-[3px] border-brand-black rounded-lg flex items-center gap-3 px-3 bg-brand-black text-white w-full text-left"
              >
                <div className="w-[26px] h-[26px] border-2 border-white rounded-md flex items-center justify-center text-base">✓</div>
                <div className="flex-1 flex flex-col">
                  <span className="text-[19px]">{item.name}</span>
                  <span className="text-sm opacity-70">{s.stateMyChoice}</span>
                </div>
                <span className="text-[19px]">{formatTLNoUnit(item.priceKurus / 100)}</span>
              </button>
            )
          }

          // Available
          return (
            <button
              key={item.id}
              onClick={() => toggle(item)}
              className="h-[64px] border-2 border-brand-black rounded-lg flex items-center gap-3 px-3.5 w-full text-left"
            >
              <div className="w-[26px] h-[26px] border-2 border-brand-black rounded-md" />
              <span className="flex-1 text-[19px] text-brand-black">{item.name}</span>
              <span className="text-[19px] text-brand-black">{formatTLNoUnit(item.priceKurus / 100)}</span>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface">
        {hasSelection ? (
          <a
            href={`/t/${tableToken}/pay`}
            className="block w-full h-[68px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[22px] bg-brand-black text-white"
          >
            {s.pay(formatTL(totalKurus / 100))}
          </a>
        ) : (
          <div className="w-full h-[68px] border-2 border-brand-border rounded-lg flex items-center justify-center text-[22px] text-brand-grey-light bg-brand-surface-card">
            {s.payDisabled}
          </div>
        )}
      </div>

      {/* 1.5 s fast polling (D24) — keeps lock states fresh across phones */}
      <Poller billId={billId} intervalMs={FAST_POLL_MS} />
    </main>
  )
}
