// E1 — Bill screen (layout: 1b)
// States:
//   E1-a  status='no_bill'  → no open bill message
//   E1-b  status='open', mode='none'  → bill list + 3 mode buttons
//   E1-c  status='open', mode≠'none'  → bill list + progress + pay button
//   E1-d  status='closed'  → table closed screen (E6)

import Link from 'next/link'
import { getTableBill } from '@/lib/mock'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'
import ProgressBar from '@/components/ProgressBar'

type Props = { params: Promise<{ tableId: string }> }

export default async function TablePage({ params }: Props) {
  const { tableId } = await params
  const bill = await getTableBill(tableId)
  const s = strings.bill

  // ── E6: Table closed ───────────────────────────────────────────────────
  if (bill.status === 'closed') {
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b-2 border-brand-black flex flex-col gap-2.5">
          <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
            {bill.tableName} · {strings.closed.remainingLabel.split('·')[1]?.trim()}
          </p>
          <p className="text-[52px] leading-none text-brand-black">{strings.closed.zeroAmount}</p>
          <ProgressBar
            total={bill.splitPeople ?? 3}
            paid={bill.splitPeople ?? 3}
          />
          <p className="text-lg text-brand-black">{strings.closed.closedMessage}</p>
        </div>
        {/* Body */}
        <div className="flex-1 px-5 py-4 flex flex-col gap-3">
          <div className="flex flex-col gap-2 text-[17px] text-brand-grey-dark">
            <div className="flex justify-between">
              <span>{strings.closed.billTotal}</span>
              <span>{formatTLNoUnit(bill.totalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>{strings.closed.totalPaid}</span>
              <span>{formatTLNoUnit(bill.paidAmount)}</span>
            </div>
          </div>
          <div className="p-3 border-2 border-dashed border-brand-border rounded-lg text-base leading-relaxed text-brand-grey-dark">
            {strings.closed.hint}
          </div>
          <div className="flex flex-col gap-1.5 mt-1">
            <p className="text-sm tracking-widest text-brand-grey-mid uppercase">
              {strings.closed.yourPayment}
            </p>
            <div className="border-2 border-brand-black rounded-lg px-3.5 py-3.5 flex justify-between items-center text-[19px]">
              <span>{strings.closed.receipt(formatTL(bill.paidAmount / (bill.splitPeople ?? 1)))}</span>
              <span>›</span>
            </div>
          </div>
        </div>
        {/* Footer */}
        <div className="border-t-2 border-brand-black px-5 py-4 bg-brand-surface text-center text-base text-brand-grey-mid">
          {strings.closed.farewell}
        </div>
      </main>
    )
  }

  // ── E1-a: No open bill ─────────────────────────────────────────────────
  if (bill.status === 'no_bill') {
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto justify-end gap-3.5 px-6 pb-10">
        <div className="h-[120px] border-2 border-dashed border-brand-border rounded-xl flex items-center justify-center text-base text-brand-grey-mid">
          — boş —
        </div>
        <p className="text-[26px] leading-snug text-brand-black">{s.noOpenBill}</p>
        <p className="text-base text-brand-grey-mid">
          {bill.tableName} · {s.askServer}
        </p>
      </main>
    )
  }

  // ── E1-b / E1-c: Open bill ─────────────────────────────────────────────
  const hasMode = bill.mode && bill.mode !== 'none'
  const shareAmount = hasMode && bill.mode === 'equal_split' && bill.splitPeople
    ? (bill.totalAmount - bill.paidAmount) / (bill.splitPeople - (bill.splitPaidCount ?? 0))
    : bill.totalAmount - bill.paidAmount

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto">
      {/* Bill list header */}
      <div className="px-5 py-4 flex justify-between items-baseline border-b border-brand-border">
        <span className="text-[19px] text-brand-black">
          {bill.tableName} · {s.billLabel}
        </span>
        <span className="text-base text-brand-grey-mid">
          {hasMode && bill.mode === 'equal_split' && bill.splitPeople
            ? s.equalSplitMode(bill.splitPeople)
            : s.itemCount(bill.items.length)}
        </span>
      </div>

      {/* Scrollable bill items */}
      <div className="flex-1 overflow-y-auto px-5 py-3.5 flex flex-col gap-3">
        {bill.items.map((item) =>
          Array.from({ length: item.quantity }).map((_, unitIdx) => {
            const isPaid = unitIdx < (item.paidQuantity ?? 0)
            return (
              <div
                key={`${item.id}-${unitIdx}`}
                className="flex justify-between gap-3 text-[20px] text-brand-black"
              >
                <span className={isPaid ? 'line-through text-brand-grey-mid' : ''}>
                  {item.name}
                </span>
                <span className={isPaid ? 'line-through text-brand-grey-mid' : ''}>
                  {formatTLNoUnit(item.pricePerUnit)}
                </span>
              </div>
            )
          })
        )}
        <div className="mt-1 pt-3 border-t border-brand-border flex justify-between gap-3 text-[22px] text-brand-black">
          <span>{s.totalRow}</span>
          <span>{formatTL(bill.totalAmount)}</span>
        </div>
      </div>

      {/* Fixed bottom action card */}
      <div className="border-2 border-brand-black rounded-t-2xl px-5 pt-4 pb-5 flex flex-col gap-2.5 bg-brand-surface shadow-[0_-6px_0_rgba(0,0,0,0.04)]">
        {!hasMode ? (
          // E1-b: mode not selected
          <>
            <div className="flex justify-between items-baseline">
              <span className="text-[17px] text-brand-grey-dark">{s.amountLabel}</span>
              <span className="text-[34px] text-brand-black">{formatTL(bill.totalAmount)}</span>
            </div>
            <div className="flex gap-2.5">
              <Link
                href={`/table/${tableId}/pay?mode=full`}
                className="flex-1 h-[78px] border-2 border-brand-black rounded-lg flex items-center justify-center text-center text-[17px] leading-snug px-1.5"
              >
                {s.payFull}
              </Link>
              <Link
                href={`/table/${tableId}/split`}
                className="flex-1 h-[78px] border-2 border-brand-black rounded-lg flex items-center justify-center text-center text-[17px] leading-snug px-1.5"
              >
                {s.splitEqual}
              </Link>
              <Link
                href={`/table/${tableId}/items`}
                className="flex-1 h-[78px] border-2 border-brand-black rounded-lg flex items-center justify-center text-center text-[17px] leading-snug px-1.5"
              >
                {s.selectItems}
              </Link>
            </div>
          </>
        ) : (
          // E1-c: mode selected, payment in progress
          <>
            <ProgressBar
              total={bill.splitPeople ?? 1}
              paid={bill.splitPaidCount ?? 0}
            />
            <div className="flex justify-between items-baseline">
              <span className="text-[17px] text-brand-grey-dark">
                {s.progressPaid(bill.splitPaidCount ?? 0, bill.splitPeople ?? 1)}
              </span>
              <span className="text-[17px] text-brand-grey-dark">
                {s.progressRemaining(formatTLNoUnit(bill.totalAmount - bill.paidAmount))}
              </span>
            </div>
            <Link
              href={`/table/${tableId}/pay?mode=${bill.mode}&people=${bill.splitPeople}`}
              className="h-[76px] border-2 border-brand-black rounded-lg flex flex-col items-center justify-center bg-brand-black text-white gap-0.5"
            >
              <span className="text-[26px]">{s.payMyShare}</span>
              <span className="text-[19px] opacity-75">{formatTL(shareAmount)}</span>
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
