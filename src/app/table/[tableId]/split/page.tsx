'use client'
// E2 — Equal split: person count selector

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'

type Props = { params: Promise<{ tableId: string }> }

// In a real app, totalAmount and paidAmount come from the server.
// For now, use the mock values directly (swapped for a server component + fetch in T07).
const MOCK_TOTAL = 1960
const MOCK_PAID = 0
const TABLE_NAME = 'Masa 7'

export default function SplitPage({ params }: Props) {
  const [people, setPeople] = useState(2)
  const router = useRouter()
  const s = strings.split

  const remaining = MOCK_TOTAL - MOCK_PAID
  const shareAmount = remaining / people
  const shareFormatted = formatTL(shareAmount)

  function decrement() { if (people > 1) setPeople((n) => n - 1) }
  function increment() { if (people < 20) setPeople((n) => n + 1) }

  async function proceed() {
    // In T07+ this will lock the mode via API, then navigate to pay.
    router.push(`/table/7/pay?mode=equal_split&people=${people}`)
  }

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header */}
      <div className="px-5 pt-3.5 pb-4 border-b-2 border-brand-black flex flex-col gap-1.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
          {TABLE_NAME} · {s.label}
        </p>
        <p className="text-[52px] leading-none text-brand-black">{shareFormatted}</p>
        <p className="text-[17px] text-brand-grey-dark">
          {s.calculation(formatTLNoUnit(MOCK_TOTAL), people)}
        </p>
      </div>

      {/* Body */}
      <div className="flex-1 px-5 py-6 flex flex-col gap-4">
        <p className="text-[20px] text-brand-black">{s.question}</p>

        {/* Stepper */}
        <div className="flex items-center gap-4">
          <button
            onClick={decrement}
            disabled={people <= 1}
            className="w-[76px] h-[76px] border-2 border-brand-black rounded-xl flex items-center justify-center text-[34px] disabled:border-brand-border disabled:text-brand-border"
          >
            −
          </button>
          <div className="flex-1 h-[76px] border-2 border-brand-black rounded-xl flex items-center justify-center text-[38px] text-brand-black">
            {people}
          </div>
          <button
            onClick={increment}
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

        {/* Summary */}
        <div className="flex flex-col gap-1.5 text-[17px] text-brand-grey-dark">
          <div className="flex justify-between">
            <span>{s.billTotal}</span>
            <span>{formatTLNoUnit(MOCK_TOTAL)}</span>
          </div>
          <div className="flex justify-between">
            <span>{s.paid}</span>
            <span>{formatTLNoUnit(MOCK_PAID)}</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface">
        <button
          onClick={proceed}
          className="w-full h-[70px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[23px] bg-brand-black text-white"
        >
          {s.continue(shareFormatted)}
        </button>
      </div>
    </main>
  )
}
