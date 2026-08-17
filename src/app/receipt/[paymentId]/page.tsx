// E5 — Payment result: success or failure
// The paymentId is the iyzico token returned after 3D Secure redirect.
// Mock: show success for any ID, failure for 'fail'.

import Link from 'next/link'
import { getPayment } from '@/lib/mock'
import { strings, formatTL, formatTLNoUnit, formatDateTime } from '@/lib/strings'

type Props = { params: Promise<{ paymentId: string }> }

export default async function ReceiptPage({ params }: Props) {
  const { paymentId } = await params
  const s = strings.result

  // In T08+, the route receives iyzico's callback and looks up the payment.
  const payment = await getPayment(paymentId)
  const isSuccess = payment.status === 'success' && paymentId !== 'fail'

  if (!isSuccess) {
    // E5 — Failure
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
        {/* Header */}
        <div className="px-5 py-6 border-b-2 border-brand-black flex flex-col gap-2.5 items-center text-center">
          <div className="w-[52px] h-[52px] border-[3px] border-brand-grey-dark rounded-full flex items-center justify-center text-[28px] text-brand-grey-dark">
            !
          </div>
          <p className="text-[26px] leading-snug text-brand-black">{s.failTitle}</p>
          <p className="text-[18px] leading-snug text-brand-grey-dark">{s.failDesc}</p>
        </div>

        {/* Details */}
        <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-2 text-[17px] text-brand-grey-dark">
          <div className="flex justify-between">
            <span>{s.triedAmount}</span>
            <span>{formatTL(payment.amount + payment.tip)}</span>
          </div>
          <div className="flex justify-between">
            <span>{s.table}</span>
            <span>{payment.tableName}</span>
          </div>
        </div>

        <div className="flex-1 px-5 py-4 flex flex-col gap-2.5">
          <div className="p-3 border-2 border-dashed border-brand-border rounded-lg text-base leading-relaxed text-brand-grey-dark">
            {s.failNote}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface flex flex-col gap-2.5">
          <Link
            href={`/table/${payment.tableId}/pay`}
            className="w-full h-[70px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[23px] bg-brand-black text-white"
          >
            {s.retry}
          </Link>
          <Link
            href={`/table/${payment.tableId}`}
            className="w-full h-[56px] border-2 border-dashed border-brand-grey-mid rounded-lg flex items-center justify-center text-[19px] text-brand-grey-dark"
          >
            {s.backToBill}
          </Link>
        </div>
      </main>
    )
  }

  // E5 — Success / Receipt
  const tableRemaining = 781.67 // mock: in T08+ comes from the server response
  const tableRemainingPeople = 2

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Header */}
      <div className="px-5 py-6 border-b-2 border-brand-black flex flex-col gap-2 items-center text-center">
        <div className="w-[52px] h-[52px] border-[3px] border-brand-black rounded-full flex items-center justify-center text-[26px]">
          ✓
        </div>
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.successLabel}</p>
        <p className="text-[48px] leading-none text-brand-black">
          {formatTL(payment.amount + payment.tip)}
        </p>
      </div>

      {/* Receipt rows */}
      <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-2 text-[17px] text-brand-grey-dark">
        <div className="flex justify-between">
          <span>{s.billShare}</span>
          <span>{formatTLNoUnit(payment.amount)}</span>
        </div>
        {payment.tip > 0 && (
          <div className="flex justify-between">
            <span>{s.tip(payment.tipPercent)}</span>
            <span>{formatTLNoUnit(payment.tip)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>{s.table}</span>
          <span>{payment.tableName}</span>
        </div>
        <div className="flex justify-between">
          <span>{s.date}</span>
          <span>{formatDateTime(payment.createdAt)}</span>
        </div>
        <div className="flex justify-between">
          <span>{s.txNo}</span>
          <span>{payment.txRef}</span>
        </div>
      </div>

      {/* Paid items */}
      <div className="px-5 py-4 border-b border-brand-border flex flex-col gap-1.5">
        <p className="text-sm tracking-widest text-brand-grey-mid uppercase">{s.paidItemsLabel}</p>
        {payment.items.map((item, i) => (
          <div key={i} className="flex justify-between text-[17px] text-brand-grey-dark">
            <span>{item.name}</span>
            <span>{formatTLNoUnit(item.amount)}</span>
          </div>
        ))}
      </div>

      {/* Table status + receipt note */}
      <div className="flex-1 min-h-0 px-5 py-4 flex flex-col gap-2">
        <div className="p-3 border-2 border-dashed border-brand-border rounded-lg text-base leading-relaxed text-brand-grey-dark">
          {s.tableStatus(formatTL(tableRemaining), tableRemainingPeople)}
        </div>
        <p className="text-[15px] text-brand-grey-mid leading-relaxed">{s.receiptNote}</p>
      </div>

      {/* Back to bill */}
      <div className="border-t-2 border-brand-black px-5 py-3.5 bg-brand-surface">
        <Link
          href={`/table/${payment.tableId}`}
          className="w-full h-[64px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[21px] text-brand-black"
        >
          {s.backToBill}
        </Link>
      </div>
    </main>
  )
}
