// S5 — Receipt / Payment result (T08 — real DB)
// Permanent URL: /receipt/[paymentId]
// Shows the payment details fetched from DB.
// Works for both success (shows receipt) and if somehow accessed for a failed payment.

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { strings, formatTL, formatTLNoUnit, formatDateTime } from '@/lib/strings'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ paymentId: string }> }

export default async function ReceiptPage({ params }: Props) {
  const { paymentId } = await params
  const s = strings.result

  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      bill: {
        include: {
          table: { select: { name: true, token: true } },
          items: {
            where: { paymentId },
            select: { name: true, priceKurus: true },
          },
          payments: { where: { status: 'SUCCEEDED' }, select: { amountKurus: true } },
        },
      },
    },
  })

  if (!payment) notFound()

  const tableToken = payment.bill.table.token
  const tableName  = payment.bill.table.name
  const isSuccess  = payment.status === 'SUCCEEDED'

  // ── Failure view ───────────────────────────────────────────────────────────
  if (!isSuccess) {
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
        <div className="px-5 py-6 border-b-2 border-brand-black flex flex-col gap-2.5 items-center text-center">
          <div className="w-[52px] h-[52px] border-[3px] border-brand-grey-dark rounded-full flex items-center justify-center text-[28px] text-brand-grey-dark">
            !
          </div>
          <p className="text-[26px] leading-snug text-brand-black">{s.failTitle}</p>
          <p className="text-[18px] leading-snug text-brand-grey-dark">{s.failDesc}</p>
        </div>
        <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-2 text-[17px] text-brand-grey-dark">
          <div className="flex justify-between">
            <span>{s.triedAmount}</span>
            <span>{formatTL((payment.amountKurus + payment.tipKurus) / 100)}</span>
          </div>
          <div className="flex justify-between">
            <span>{s.table}</span>
            <span>{tableName}</span>
          </div>
        </div>
        <div className="flex-1 px-5 py-4">
          <div className="p-3 border-2 border-dashed border-brand-border rounded-lg text-base leading-relaxed text-brand-grey-dark">
            {s.failNote}
          </div>
        </div>
        <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface flex flex-col gap-2.5">
          <a
            href={`/t/${tableToken}/pay`}
            className="w-full h-[70px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[23px] bg-brand-black text-white"
          >
            {s.retry}
          </a>
          <a
            href={`/t/${tableToken}`}
            className="w-full h-[56px] border-2 border-dashed border-brand-grey-mid rounded-lg flex items-center justify-center text-[19px] text-brand-grey-dark"
          >
            {s.backToBill}
          </a>
        </div>
      </main>
    )
  }

  // ── Success / Receipt view ─────────────────────────────────────────────────
  const totalPaid  = payment.amountKurus + payment.tipKurus
  const allItems   = await prisma.billItem.findMany({ where: { billId: payment.billId }, select: { priceKurus: true } })
  const billTotal  = allItems.reduce((s, i) => s + i.priceKurus, 0)
  const paidSoFar  = payment.bill.payments.reduce((s, p) => s + p.amountKurus, 0)
  const remaining  = Math.max(0, billTotal - paidSoFar)

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header */}
      <div className="px-5 py-6 border-b-2 border-brand-black flex flex-col gap-2 items-center text-center">
        <div className="w-[52px] h-[52px] border-[3px] border-brand-black rounded-full flex items-center justify-center text-[26px]">
          ✓
        </div>
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.successLabel}</p>
        <p className="text-[48px] leading-none text-brand-black">{formatTL(totalPaid / 100)}</p>
      </div>

      {/* Receipt rows */}
      <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-2 text-[17px] text-brand-grey-dark">
        <div className="flex justify-between">
          <span>{s.billShare}</span>
          <span>{formatTLNoUnit(payment.amountKurus / 100)}</span>
        </div>
        {payment.tipKurus > 0 && (
          <div className="flex justify-between">
            <span>{strings.payment.tipLabel}</span>
            <span>{formatTLNoUnit(payment.tipKurus / 100)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{s.table}</span>
          <span>{tableName}</span>
        </div>
        <div className="flex justify-between">
          <span>{s.date}</span>
          <span>{formatDateTime(payment.createdAt)}</span>
        </div>
        {payment.providerPaymentId && (
          <div className="flex justify-between">
            <span>{s.txNo}</span>
            <span className="text-sm">{payment.providerPaymentId}</span>
          </div>
        )}
      </div>

      {/* Paid items */}
      {payment.bill.items.length > 0 && (
        <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-1.5">
          <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.paidItemsLabel}</p>
          {payment.bill.items.map((item, i) => (
            <div key={i} className="flex justify-between text-[17px] text-brand-grey-dark">
              <span>{item.name}</span>
              <span>{formatTLNoUnit(item.priceKurus / 100)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Table status + permanent receipt note */}
      <div className="flex-1 min-h-0 px-5 py-4 flex flex-col gap-2">
        {remaining > 0 && (
          <div className="p-3 border-2 border-dashed border-brand-border rounded-lg text-base leading-relaxed text-brand-grey-dark">
            {s.remainingInTable(formatTL(remaining / 100))}
          </div>
        )}
        <p className="text-[15px] text-brand-grey-mid leading-relaxed">{s.receiptNote}</p>
        {/* Legal notice — not a fiscal receipt */}
        <p className="text-[13px] text-brand-grey-light leading-relaxed border-t border-brand-border pt-2 mt-1">
          {s.fiscalNotice}
        </p>
      </div>

      {/* Back to bill */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface">
        <a
          href={`/t/${tableToken}`}
          className="w-full h-[64px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[21px] text-brand-black"
        >
          {s.backToBill}
        </a>
      </div>
    </main>
  )
}
