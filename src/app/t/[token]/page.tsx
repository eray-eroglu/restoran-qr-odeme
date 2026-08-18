/**
 * /t/[token] — Guest bill screen (T07 — real DB + polling)
 *
 * Three states (PRODUCT.md S1):
 *   S1-a  No open bill       → "No open bill at this table."
 *   S1-b  Bill open, NONE    → item list + three mode buttons
 *   S1-c  Bill open, mode≠NONE → item list + progress + action button
 *
 * The Poller client component handles ~5 s polling and tab-focus refresh.
 * router.refresh() re-fetches this server component; React reconciles the DOM
 * without unmounting anything → no loading flash (D24).
 */

import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'
import ProgressBar from '@/components/ProgressBar'
import Poller from './Poller'
import { setByItemMode } from './items/actions'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ token: string }>
  searchParams: Promise<{ payFailed?: string; error?: string }>
}

async function getBillData(token: string) {
  const table = await prisma.table.findUnique({
    where: { token },
    include: {
      bills: {
        where: { status: 'OPEN' },
        orderBy: { createdAt: 'desc' },
        take: 1,
        include: {
          items: { orderBy: { createdAt: 'asc' } },
          payments: { where: { status: 'SUCCEEDED' } },
        },
      },
    },
  })
  return table
}

export default async function GuestPage({ params, searchParams }: Props) {
  const { token } = await params
  const { payFailed, error } = await searchParams
  const table = await getBillData(token)
  if (!table) notFound()

  const bill = table.bills[0] ?? null
  const s = strings.bill

  // ── S1-a: No open bill ────────────────────────────────────────────────────
  if (!bill) {
    return (
      <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto justify-end gap-3.5 px-6 pb-10">
        <p className="text-[26px] leading-snug text-brand-black">{s.noOpenBill}</p>
        <p className="text-base text-brand-grey-mid">
          {table.name} · {s.askServer}
        </p>
        {/* Poll even with no bill — admin may open one while guest watches */}
        <Poller billId={null} />
      </main>
    )
  }

  // ── Compute amounts (all kuruş → TL for display) ─────────────────────────
  const totalKurus = bill.items.reduce((s, i) => s + i.priceKurus, 0)
  const paidKurus = bill.payments.reduce((s, p) => s + p.amountKurus, 0)
  const remainingKurus = totalKurus - paidKurus

  const hasMode    = bill.mode !== 'NONE'
  const isEqualSplit = bill.mode === 'EQUAL_SPLIT'
  const isByItem     = bill.mode === 'BY_ITEM'

  // For EQUAL_SPLIT: each succeeded payment = one share paid
  const splitPaidCount = bill.payments.length
  const splitPeople    = bill.splitPeople ?? 1
  const unpaidPeople   = Math.max(1, splitPeople - splitPaidCount)
  const shareKurus     = isEqualSplit ? Math.ceil(remainingKurus / unpaidPeople) : remainingKurus

  // ── S1-b / S1-c: Open bill ───────────────────────────────────────────────
  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[390px] mx-auto" data-token={token}>
      {/* Header */}
      <div className="px-5 py-4 flex justify-between items-baseline border-b border-brand-border">
        <span className="text-[19px] text-brand-black">
          {table.name} · {s.billLabel}
        </span>
        <span className="text-base text-brand-grey-mid">
          {hasMode && isEqualSplit && bill.splitPeople
            ? s.equalSplitMode(bill.splitPeople)
            : isByItem
            ? s.byItemMode
            : s.itemCount(bill.items.length)}
        </span>
      </div>

      {/* Scrollable bill items */}
      <div className="flex-1 overflow-y-auto px-5 py-3.5 flex flex-col gap-3">
        {bill.items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between gap-3 text-[20px] text-brand-black"
          >
            <span className={item.isPaid ? 'line-through text-brand-grey-mid' : ''}>
              {item.name}
            </span>
            <span className={item.isPaid ? 'line-through text-brand-grey-mid' : ''}>
              {formatTLNoUnit(item.priceKurus / 100)}
            </span>
          </div>
        ))}
        <div className="mt-1 pt-3 border-t border-brand-border flex justify-between gap-3 text-[22px] text-brand-black">
          <span>{s.totalRow}</span>
          <span>{formatTL(totalKurus / 100)}</span>
        </div>
      </div>

      {/* Fixed bottom action card */}
      <div className="border-2 border-brand-black rounded-t-2xl px-5 pt-4 pb-5 flex flex-col gap-2.5 bg-brand-surface shadow-[0_-6px_0_rgba(0,0,0,0.04)]">
        {payFailed && (
          <div className="px-3 py-2 bg-white border border-brand-border rounded-lg text-[14px] text-brand-grey-dark">
            ⚠ {error ?? 'Ödeme başarısız. Tekrar dene.'}
          </div>
        )}
        {!hasMode ? (
          // ── S1-b: mode not yet chosen ─────────────────────────────────────
          <>
            <div className="flex justify-between items-baseline">
              <span className="text-[17px] text-brand-grey-dark">{s.amountLabel}</span>
              <span className="text-[34px] text-brand-black">{formatTL(totalKurus / 100)}</span>
            </div>
            {/* Mode buttons */}
            <div className="flex gap-2.5">
              {/* Pay whole bill — T08 */}
              <a
                href={`/t/${token}/pay`}
                className="flex-1 h-[78px] border-2 border-brand-black rounded-lg flex items-center justify-center text-center text-[17px] leading-snug px-1.5 active:bg-brand-surface transition-colors"
              >
                {s.payFull}
              </a>
              {/* Split equally — T09 */}
              <a
                href={`/t/${token}/split`}
                className="flex-1 h-[78px] border-2 border-brand-black rounded-lg flex items-center justify-center text-center text-[17px] leading-snug px-1.5 active:bg-brand-surface transition-colors"
              >
                {s.splitEqual}
              </a>
              {/* Pick my items — T10 */}
              <form action={setByItemMode} className="flex-1">
                <input type="hidden" name="billId"     value={bill.id} />
                <input type="hidden" name="tableToken" value={token} />
                <button
                  type="submit"
                  className="w-full h-[78px] border-2 border-brand-black rounded-lg flex items-center justify-center text-center text-[17px] leading-snug px-1.5 active:bg-brand-surface transition-colors"
                >
                  {s.selectItems}
                </button>
              </form>
            </div>
          </>
        ) : (
          // ── S1-c: mode chosen, payment in progress ────────────────────────
          <>
            {isEqualSplit && bill.splitPeople && (
              <ProgressBar total={bill.splitPeople} paid={splitPaidCount} />
            )}
            <div className="flex justify-between items-baseline">
              <span className="text-[17px] text-brand-grey-dark">
                {isEqualSplit
                  ? s.progressPaid(splitPaidCount, splitPeople)
                  : s.amountLabel}
              </span>
              <span className="text-[17px] text-brand-grey-dark">
                {s.progressRemaining(formatTLNoUnit(remainingKurus / 100))}
              </span>
            </div>

            {isByItem ? (
              // BY_ITEM: link to item selection screen
              <a
                href={`/t/${token}/items`}
                className="h-[76px] border-2 border-brand-black rounded-lg flex flex-col items-center justify-center bg-brand-black text-white gap-0.5 active:opacity-80 transition-opacity"
              >
                <span className="text-[26px]">{s.selectItems}</span>
                <span className="text-[15px] opacity-70">{s.byItemHint}</span>
              </a>
            ) : (
              // EQUAL_SPLIT: pay my share directly
              <a
                href={`/t/${token}/pay`}
                className="h-[76px] border-2 border-brand-black rounded-lg flex flex-col items-center justify-center bg-brand-black text-white gap-0.5 active:opacity-80 transition-opacity"
              >
                <span className="text-[26px]">{s.payMyShare}</span>
                <span className="text-[19px] opacity-75">{formatTL(shareKurus / 100)}</span>
              </a>
            )}
          </>
        )}
      </div>

      {/* Polling + session (no visible output) */}
      <Poller billId={bill.id} />
    </main>
  )
}
