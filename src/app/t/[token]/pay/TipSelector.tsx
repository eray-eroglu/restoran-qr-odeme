'use client'
/**
 * T11 — Tip selector + pay button.
 *
 * Single client component that owns tip state and updates the pay button total
 * live. Nothing is preselected by default (D22 — skippable).
 *
 * The parent form (server component) keeps the card fields. This component
 * adds a hidden <input name="tipPercent"> so the form POST carries the tip.
 *
 * R3: only amountKurus (bill share) affects the bill balance — the tip is
 * stored separately and does not trigger auto-close.
 */

import { useState } from 'react'
import { formatTL, formatTLNoUnit } from '@/lib/strings'

const TIP_OPTIONS = [
  { label: 'Yok',  pct: 0  },
  { label: '%5',   pct: 5  },
  { label: '%10',  pct: 10 },
  { label: '%15',  pct: 15 },
] as const

type Props = {
  amountKurus: number  // bill share (without tip)
  payLabel: string     // strings.payment.pay — receives formatted amount
}

export default function TipSelector({ amountKurus, payLabel }: Props) {
  const [tipPct, setTipPct] = useState<number | null>(null) // null = nothing selected

  const tipKurus   = tipPct !== null ? Math.round(amountKurus * tipPct / 100) : 0
  const totalKurus = amountKurus + tipKurus

  return (
    <>
      {/* Hidden input carries tipPercent to the initiate route */}
      <input type="hidden" name="tipPercent" value={tipPct ?? 0} />

      {/* Tip row */}
      <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-3">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">BAHŞİŞ</p>

        {/* Four option buttons */}
        <div className="flex gap-2">
          {TIP_OPTIONS.map(({ label, pct }) => {
            const isSelected = pct === 0 ? tipPct === 0 : tipPct === pct
            return (
              <button
                key={pct}
                type="button"
                onClick={() => setTipPct(pct === 0 && tipPct === 0 ? null : pct)}
                className={
                  isSelected
                    ? 'flex-1 h-[52px] border-2 border-brand-black rounded-lg text-[17px] bg-brand-black text-white'
                    : 'flex-1 h-[52px] border-2 border-brand-black rounded-lg text-[17px] text-brand-black'
                }
              >
                {label}
              </button>
            )
          })}
        </div>

        {/* Show breakdown when tip > 0 */}
        {tipKurus > 0 && (
          <div className="flex flex-col gap-1 text-[15px] text-brand-grey-dark">
            <div className="flex justify-between">
              <span>Hesap payı</span>
              <span>{formatTLNoUnit(amountKurus / 100)}</span>
            </div>
            <div className="flex justify-between">
              <span>Bahşiş ({tipPct}%)</span>
              <span>{formatTLNoUnit(tipKurus / 100)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Pay button — total updates live */}
      <div className="mt-auto border-t-2 border-brand-black px-5 py-4 bg-brand-surface flex flex-col gap-2">
        <button
          type="submit"
          className="w-full h-[70px] border-2 border-brand-black rounded-lg flex flex-col items-center justify-center bg-brand-black text-white gap-0.5"
        >
          <span className="text-[26px]">{payLabel} {formatTL(totalKurus / 100)}</span>
        </button>
        <p className="text-center text-[14px] text-brand-grey-mid">Sonraki adımda bankanızın 3D Secure sayfası açılır.</p>
      </div>
    </>
  )
}
