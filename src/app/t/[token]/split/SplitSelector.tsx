'use client'
/**
 * T09 — Headcount stepper for the equal-split screen.
 * Controlled client component: updates the share preview as the user changes
 * the count. Submits to the setEqualSplit server action via a hidden input.
 */

import { useState } from 'react'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'
import { setEqualSplit } from './actions'

type Props = {
  billId: string
  tableToken: string
  totalKurus: number
  paidKurus: number
  initialPeople?: number // pre-fill if mode is already EQUAL_SPLIT (but not yet locked)
}

export default function SplitSelector({ billId, tableToken, totalKurus, paidKurus, initialPeople }: Props) {
  const [people, setPeople] = useState(initialPeople ?? 2)
  const s = strings.split

  const remainingKurus = totalKurus - paidKurus
  // Display share: floor (first shares pay this; last pays the rounding remainder)
  const shareKurus     = Math.floor(remainingKurus / people)

  return (
    <form action={setEqualSplit} className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Hidden context fields */}
      <input type="hidden" name="billId"     value={billId} />
      <input type="hidden" name="tableToken" value={tableToken} />
      <input type="hidden" name="people"     value={people} />

      {/* Header — live share amount */}
      <div className="px-5 pt-3.5 pb-4 border-b-2 border-brand-black flex flex-col gap-1.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
          {s.label}
        </p>
        <p className="text-[52px] leading-none text-brand-black">
          {formatTL(shareKurus / 100)}
        </p>
        <p className="text-[17px] text-brand-grey-dark">
          {s.calculation(formatTLNoUnit(totalKurus / 100), people)}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-4">
        <p className="text-[20px] text-brand-black">{s.question}</p>

        {/* Stepper */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setPeople((n) => Math.max(2, n - 1))}
            disabled={people <= 2}
            className="w-[76px] h-[76px] border-2 border-brand-black rounded-xl flex items-center justify-center text-[34px] disabled:border-brand-border disabled:text-brand-border"
          >
            −
          </button>
          <div className="flex-1 h-[76px] border-2 border-brand-black rounded-xl flex items-center justify-center text-[38px] text-brand-black select-none">
            {people}
          </div>
          <button
            type="button"
            onClick={() => setPeople((n) => Math.min(20, n + 1))}
            disabled={people >= 20}
            className="w-[76px] h-[76px] border-2 border-brand-black rounded-xl flex items-center justify-center text-[34px] disabled:border-brand-border disabled:text-brand-border"
          >
            +
          </button>
        </div>

        {/* Hint */}
        <div className="px-3.5 py-3 border-2 border-dashed border-brand-border rounded-lg text-base leading-relaxed text-brand-grey-dark">
          {s.hint}
        </div>

        {/* Bill summary */}
        <div className="flex flex-col gap-1.5 text-[17px] text-brand-grey-dark">
          <div className="flex justify-between">
            <span>{s.billTotal}</span>
            <span>{formatTLNoUnit(totalKurus / 100)}</span>
          </div>
          <div className="flex justify-between">
            <span>{s.paid}</span>
            <span>{formatTLNoUnit(paidKurus / 100)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface">
        <button
          type="submit"
          className="w-full h-[70px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[23px] bg-brand-black text-white"
        >
          {s.continue(formatTL(shareKurus / 100))}
        </button>
      </div>
    </form>
  )
}
