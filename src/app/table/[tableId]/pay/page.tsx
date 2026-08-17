'use client'
// E4 — Payment screen
// States:
//   E4-a  no tip selected (default)
//   E4-b  tip selected, card filled
//   E4-c  redirecting to 3D Secure (loading state)

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'

// Mock — amount comes from search params in real app
const MOCK_SHARE = 525
const TABLE_NAME = 'Masa 7'

const TIP_OPTIONS = [
  { label: strings.payment.tip5,  value: 5  },
  { label: strings.payment.tip10, value: 10 },
  { label: strings.payment.tip15, value: 15 },
  { label: strings.payment.tipNone, value: 0 },
]

function PayForm() {
  const searchParams = useSearchParams()
  const amountParam = searchParams.get('amount')
  const shareAmount = amountParam ? parseFloat(amountParam) : MOCK_SHARE

  const s = strings.payment
  const [tip, setTip] = useState<number | null>(null)
  const [cardNo, setCardNo] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [redirecting, setRedirecting] = useState(false)

  const tipAmount = tip ? (shareAmount * tip) / 100 : 0
  const total = shareAmount + tipAmount

  function handlePay() {
    // In T08, this calls the iyzico API, then sets redirecting = true
    setRedirecting(true)
  }

  // E4-c: Redirecting / loading
  if (redirecting) {
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto items-center justify-center gap-5 px-10 text-center">
        {/* Spinner placeholder — arc border */}
        <div className="w-[60px] h-[60px] border-[3px] border-brand-black border-r-brand-border rounded-full animate-spin" />
        <p className="text-[24px] leading-snug text-brand-black">{s.redirecting}</p>
        <p className="text-[18px] text-brand-grey-dark">{s.redirectAmount(formatTL(total), TABLE_NAME)}</p>
        <p className="text-base text-brand-grey-mid">{s.doNotClose}</p>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Back */}
      <p className="px-5 pt-3.5 text-[17px] text-brand-grey-dark">{s.back}</p>

      {/* Amount header */}
      <div className="px-5 pt-2.5 pb-4 border-b-2 border-brand-black flex flex-col gap-1.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
          {TABLE_NAME} · {s.label}
        </p>
        <p className="text-[52px] leading-none text-brand-black">{formatTL(total)}</p>
        <p className="text-[17px] text-brand-grey-dark">
          {tip && tip > 0
            ? `${formatTLNoUnit(shareAmount)} + ${formatTLNoUnit(tipAmount)} bahşiş`
            : s.noTip}
        </p>
      </div>

      {/* Tip row */}
      <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-2.5">
        <p className="text-[17px] text-brand-grey-dark">
          {tip !== null && tip > 0 ? s.tipLabel : s.tipQuestion}{' '}
          <span className="text-brand-grey-mid">{s.tipOptional}</span>
        </p>
        <div className="flex gap-2">
          {TIP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTip(opt.value === 0 ? 0 : opt.value === tip ? null : opt.value)}
              className={`flex-1 h-[56px] border-2 rounded-lg flex items-center justify-center text-[19px] transition-colors ${
                tip === opt.value && opt.value !== 0
                  ? 'border-brand-black bg-brand-black text-white border-[3px]'
                  : opt.value === 0 && tip === 0
                  ? 'border-brand-black bg-brand-black text-white border-[3px]'
                  : 'border-brand-black text-brand-black'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Card form */}
      <div className="flex-1 px-5 py-4 flex flex-col gap-2.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.cardLabel}</p>
        <input
          type="text"
          inputMode="numeric"
          placeholder={s.cardNumber}
          value={cardNo}
          onChange={(e) => setCardNo(e.target.value)}
          maxLength={19}
          className="h-[60px] border-2 border-brand-black rounded-lg px-3.5 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none"
        />
        <div className="flex gap-2.5">
          <input
            type="text"
            inputMode="numeric"
            placeholder={s.expiry}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            maxLength={5}
            className="flex-1 h-[60px] border-2 border-brand-black rounded-lg px-3.5 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none"
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder={s.cvc}
            value={cvc}
            onChange={(e) => setCvc(e.target.value)}
            maxLength={3}
            className="flex-1 h-[60px] border-2 border-brand-black rounded-lg px-3.5 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none"
          />
        </div>
      </div>

      {/* CTA */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface flex flex-col gap-2.5">
        <div className="flex flex-col gap-1 text-[17px] text-brand-grey-dark">
          <div className="flex justify-between">
            <span>{s.billShare}</span>
            <span>{formatTLNoUnit(shareAmount)}</span>
          </div>
          {tip !== null && (
            <div className={`flex justify-between ${tip > 0 ? 'text-brand-black' : ''}`}>
              <span>{tip > 0 ? `${s.tipLabel} (%${tip})` : s.tipLabel}</span>
              <span>{formatTLNoUnit(tipAmount)}</span>
            </div>
          )}
        </div>
        <button
          onClick={handlePay}
          className="w-full h-[70px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[23px] bg-brand-black text-white"
        >
          {s.pay(formatTL(total))}
        </button>
        <p className="text-sm text-brand-grey-mid text-center">{s.secureNote}</p>
      </div>
    </main>
  )
}

export default function PayPage() {
  return (
    <Suspense>
      <PayForm />
    </Suspense>
  )
}
