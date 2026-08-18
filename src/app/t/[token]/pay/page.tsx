// S4 — Payment screen: amount + card form → 3D Secure
// Amount is computed server-side from DB (R8 — never trusted from client).
// Form POSTs directly to /api/payment/initiate which returns the bank's 3DS HTML.

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { strings, formatTL } from '@/lib/strings'
import ExpiryInput from './ExpiryInput'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ token: string }> }

function kurusToDecimal(kuruş: number): string {
  return (Math.floor(kuruş / 100)).toString() + '.' + String(kuruş % 100).padStart(2, '0')
}

export default async function PayPage({ params }: Props) {
  const { token } = await params
  const s = strings.payment

  const table = await prisma.table.findUnique({
    where: { token },
    include: {
      bills: {
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          items: { select: { priceKurus: true } },
          payments: { where: { status: 'SUCCEEDED' }, select: { amountKurus: true } },
        },
      },
    },
  })

  if (!table) notFound()

  const bill = table.bills[0]
  if (!bill) {
    // No open bill — redirect back to bill screen
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto justify-center px-6 gap-4">
        <p className="text-[22px] text-brand-black">{strings.bill.noOpenBill}</p>
        <a href={`/t/${token}`} className="text-brand-grey-dark underline">{s.back}</a>
      </main>
    )
  }

  const totalKurus  = bill.items.reduce((s, i) => s + i.priceKurus, 0)
  const paidKurus   = bill.payments.reduce((s, p) => s + p.amountKurus, 0)
  const amountKurus = totalKurus - paidKurus

  if (amountKurus <= 0) {
    // Nothing left to pay
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto justify-center px-6 gap-4">
        <p className="text-[22px] text-brand-black">Hesap zaten ödendi.</p>
        <a href={`/t/${token}`} className="text-brand-grey-dark underline">{s.back}</a>
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header */}
      <div className="px-5 py-4 border-b border-brand-border flex items-center gap-3">
        <a href={`/t/${token}`} className="text-[17px] text-brand-grey-dark hover:text-brand-black">
          {s.back}
        </a>
        <span className="text-brand-border">·</span>
        <span className="text-[17px] text-brand-black">{table.name}</span>
      </div>

      {/* Amount */}
      <div className="px-5 pt-6 pb-4 border-b border-brand-border flex flex-col gap-1">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.label}</p>
        <p className="text-[52px] leading-none text-brand-black">{formatTL(amountKurus / 100)}</p>
      </div>

      {/* Card form — POSTs to /api/payment/initiate; server returns 3DS HTML */}
      <form
        method="POST"
        action="/api/payment/initiate"
        className="flex-1 flex flex-col"
        onSubmit={undefined}
      >
        {/* Hidden fields — server uses these to identify the payment */}
        <input type="hidden" name="tableToken" value={token} />
        <input type="hidden" name="billId" value={bill.id} />
        <input type="hidden" name="amountKurus" value={amountKurus} />

        <div className="px-5 py-5 flex flex-col gap-3">
          <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.cardLabel}</p>

          {/* Card holder name */}
          <input
            name="cardHolderName"
            type="text"
            placeholder="Ad Soyad"
            autoComplete="cc-name"
            required
            className="h-[60px] border-2 border-brand-black rounded-lg px-4 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none"
          />

          {/* Card number */}
          <input
            name="cardNumber"
            type="text"
            inputMode="numeric"
            placeholder={s.cardNumber}
            autoComplete="cc-number"
            maxLength={19}
            required
            className="h-[60px] border-2 border-brand-black rounded-lg px-4 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none tracking-widest"
          />

          <div className="flex gap-3">
            {/* Expiry MM/YY — auto-inserts "/" after 2nd digit */}
            <ExpiryInput className="flex-1 h-[60px] border-2 border-brand-black rounded-lg px-4 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none tracking-widest" />
            {/* CVC */}
            <input
              name="cvc"
              type="text"
              inputMode="numeric"
              placeholder={s.cvc}
              autoComplete="cc-csc"
              maxLength={4}
              required
              className="w-[110px] h-[60px] border-2 border-brand-black rounded-lg px-4 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none tracking-widest"
            />
          </div>
        </div>

        {/* Sticky pay button */}
        <div className="mt-auto border-t-2 border-brand-black px-5 py-4 bg-brand-surface flex flex-col gap-2">
          <button
            type="submit"
            className="w-full h-[70px] border-2 border-brand-black rounded-lg flex flex-col items-center justify-center bg-brand-black text-white gap-0.5"
          >
            <span className="text-[26px]">{s.pay(formatTL(amountKurus / 100))}</span>
          </button>
          <p className="text-center text-[14px] text-brand-grey-mid">{s.secureNote}</p>
        </div>
      </form>
    </main>
  )
}
