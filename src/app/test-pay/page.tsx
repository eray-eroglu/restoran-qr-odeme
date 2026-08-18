'use client'
// T03 — Payment vertical slice test page.
// Fixed 1.00 TL amount; proves the 3DS flow end-to-end.
//
// Form posts directly to /api/test-pay/initiate (no fetch + document.write).
// The browser navigates naturally: API returns 3DS HTML → browser renders it.

import { useState, useRef } from 'react'

// iyzico sandbox test cards — full list: https://sandbox-merchant.iyzipay.com/test-cards
const TEST_CARDS = [
  { label: 'Başarılı (Akbank Visa)', number: '4603450000000000', expiry: '12/2030', cvc: '000' },
  { label: 'Başarısız (iyzico hata kartı)', number: '5528790000000008', expiry: '12/2030', cvc: '000' },
]

export default function TestPayPage() {
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  function fillCard(card: (typeof TEST_CARDS)[number]) {
    if (!formRef.current) return
    const f = formRef.current
    ;(f.elements.namedItem('cardNumber') as HTMLInputElement).value = card.number
    ;(f.elements.namedItem('expireMonth') as HTMLInputElement).value = card.expiry.split('/')[0]
    ;(f.elements.namedItem('expireYear') as HTMLInputElement).value = card.expiry.split('/')[1]
    ;(f.elements.namedItem('cvc') as HTMLInputElement).value = card.cvc
  }

  return (
    <main className="min-h-screen bg-brand-surface-off flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[400px]">
        <div className="mb-6">
          <p className="text-xs font-mono text-brand-grey-mid uppercase tracking-widest mb-1">
            T03 · Dikey Dilim
          </p>
          <h1 className="text-[26px] text-brand-black">Ödeme Testi</h1>
          <p className="text-[15px] text-brand-grey-dark mt-1">
            Sabit tutar: <span className="text-brand-black font-medium">1,00 TL</span> · iyzico sandbox
          </p>
        </div>

        {/* Test card shortcuts */}
        <div className="mb-5 flex flex-col gap-2">
          {TEST_CARDS.map((card) => (
            <button
              key={card.number}
              type="button"
              onClick={() => fillCard(card)}
              className="w-full text-left px-3 py-2 border border-brand-border rounded-lg text-[13px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors"
            >
              <span className="text-brand-grey-light mr-2">→</span>
              {card.label}
              <span className="ml-2 font-mono text-brand-grey-light">{card.number.slice(-4)}</span>
            </button>
          ))}
        </div>

        {/*
          action="/api/test-pay/initiate": API returns 3DS HTML → browser renders it.
          No fetch/document.write — plain navigation is more reliable.
        */}
        <form
          ref={formRef}
          method="POST"
          action="/api/test-pay/initiate"
          onSubmit={() => setLoading(true)}
          className="flex flex-col gap-3"
        >
          <input
            name="cardHolderName"
            placeholder="Kart sahibinin adı"
            defaultValue="Test User"
            required
            className="h-[52px] border-2 border-brand-black rounded-lg px-4 text-[17px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white"
          />
          <input
            name="cardNumber"
            placeholder="Kart numarası"
            inputMode="numeric"
            maxLength={19}
            required
            className="h-[52px] border-2 border-brand-black rounded-lg px-4 text-[17px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white font-mono tracking-wider"
          />
          <div className="flex gap-3">
            <input
              name="expireMonth"
              placeholder="Ay (06)"
              inputMode="numeric"
              maxLength={2}
              required
              className="flex-1 h-[52px] border-2 border-brand-black rounded-lg px-4 text-[17px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white"
            />
            <input
              name="expireYear"
              placeholder="Yıl (2030)"
              inputMode="numeric"
              maxLength={4}
              required
              className="flex-1 h-[52px] border-2 border-brand-black rounded-lg px-4 text-[17px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white"
            />
            <input
              name="cvc"
              placeholder="CVC"
              inputMode="numeric"
              maxLength={3}
              required
              className="w-[90px] h-[52px] border-2 border-brand-black rounded-lg px-4 text-[17px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`h-[56px] rounded-lg flex items-center justify-center gap-2 text-[19px] border-2 transition-colors ${
              loading
                ? 'border-brand-border text-brand-grey-mid cursor-not-allowed'
                : 'border-brand-black bg-brand-black text-white hover:bg-brand-grey-dark hover:border-brand-grey-dark'
            }`}
          >
            {loading ? (
              <>
                <span className="w-5 h-5 rounded-full border-2 border-brand-grey-mid border-r-transparent animate-spin" />
                İşleniyor…
              </>
            ) : (
              '1,00 TL Öde'
            )}
          </button>
        </form>

        <p className="mt-4 text-[12px] text-brand-grey-light text-center">
          Bu sayfa sadece geliştirme testidir. Gerçek para alınmaz.
        </p>
      </div>
    </main>
  )
}
