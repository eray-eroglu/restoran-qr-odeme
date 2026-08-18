// E9 — Admin: table detail (T06 — real DB)
// Replaces mock data with live Prisma queries.
// Three-panel layout: bill items editor / QR code / payment breakdown.

import Link from 'next/link'
import { headers } from 'next/headers'
import QRCode from 'qrcode'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import { formatTL, formatTLNoUnit, formatDateTime } from '@/lib/strings'
import { openBillForTable } from './actions'
import BillEditor from './BillEditor'
import CloseButton from './CloseButton'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ tableId: string }> }

async function getData(tableId: string) {
  const [table, menu] = await Promise.all([
    prisma.table.findUnique({
      where: { id: tableId },
      include: {
        bills: {
          where: { status: 'OPEN' },
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            items: { orderBy: { createdAt: 'asc' } },
            payments: {
              where: { status: 'SUCCEEDED' },
              orderBy: { createdAt: 'asc' },
            },
          },
        },
      },
    }),
    prisma.menuItem.findMany({
      where: { isActive: true },
      orderBy: [{ category: 'asc' }, { name: 'asc' }],
    }),
  ])

  return { table, menu }
}

export default async function AdminTableDetailPage({ params }: Props) {
  const { tableId } = await params
  const { table, menu } = await getData(tableId)

  if (!table) notFound()

  const bill = table.bills[0] ?? null
  const hasBill = bill !== null

  // Derive totals from bill items / payments (all in kuruş)
  // R3: only bill share (amountKurus) counts toward balance — tips excluded from remaining
  const totalKurus     = bill ? bill.items.reduce((s, i) => s + i.priceKurus, 0) : 0
  const paidKurus      = bill ? bill.payments.reduce((s, p) => s + p.amountKurus, 0) : 0
  const remainingKurus = totalKurus - paidKurus

  // Derive bill status label
  const statusLabel = !hasBill ? 'hesap yok' : 'açık'

  // Guest URL uses the table's unguessable token (R9)
  const headersList = await headers()
  const host = headersList.get('host') ?? 'localhost:3000'
  const proto = host.startsWith('localhost') ? 'http' : 'https'
  const guestUrl = `${proto}://${host}/t/${table.token}`

  // Generate QR code as a data URL (PNG, 200×200)
  const qrDataUrl = hasBill
    ? await QRCode.toDataURL(guestUrl, { width: 200, margin: 2 })
    : null

  return (
    <div className="min-h-screen bg-brand-surface-off">
      {/* Top bar */}
      <header className="bg-white border-b border-brand-border px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/tables"
            className="text-[17px] text-brand-grey-dark hover:text-brand-black"
          >
            ‹ Masalar
          </Link>
          <span className="text-brand-border">·</span>
          <h1 className="text-[20px] text-brand-black">{table.name}</h1>
          <span className="text-sm px-2 py-0.5 rounded-full border border-brand-border text-brand-grey-mid">
            {statusLabel}
          </span>
        </div>
        <div className="flex gap-2">
          {!hasBill && (
            <form action={openBillForTable}>
              <input type="hidden" name="tableId" value={table.id} />
              <button
                type="submit"
                className="h-9 px-4 border-2 border-brand-black rounded-lg text-[15px] text-brand-black hover:bg-brand-black hover:text-white transition-colors"
              >
                Ödemeye Aç
              </button>
            </form>
          )}
          {hasBill && <CloseButton billId={bill.id} tableId={table.id} />}
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="p-8 flex gap-6 items-start">
        {/* Panel 1: Bill items + menu */}
        <div className="flex-1 bg-white border-2 border-brand-black rounded-xl overflow-hidden min-w-0">
          <div className="px-5 py-3.5 border-b border-brand-border">
            <h2 className="text-[17px] text-brand-black">Adisyon</h2>
          </div>
          <div className="px-5 py-4">
            {hasBill ? (
              <BillEditor
                billId={bill.id}
                tableId={table.id}
                items={bill.items.map((i) => ({
                  id: i.id,
                  name: i.name,
                  priceKurus: i.priceKurus,
                  isPaid: i.isPaid,
                }))}
                menu={menu.map((m) => ({
                  id: m.id,
                  name: m.name,
                  priceKurus: m.priceKurus,
                  category: m.category,
                }))}
                totalKurus={totalKurus}
                canEdit={true}
              />
            ) : (
              <p className="text-brand-grey-mid py-4 text-base">
                Henüz adisyon açılmamış. "Ödemeye Aç" butonunu kullan.
              </p>
            )}
          </div>
        </div>

        {/* Panel 2: QR code */}
        <div className="w-[240px] bg-white border-2 border-brand-black rounded-xl overflow-hidden flex-none">
          <div className="px-5 py-3.5 border-b border-brand-border">
            <h2 className="text-[17px] text-brand-black">QR Kodu</h2>
          </div>
          <div className="px-5 py-6 flex flex-col items-center gap-4">
            {qrDataUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrDataUrl}
                  alt="Misafir QR kodu"
                  width={200}
                  height={200}
                  className="rounded-lg"
                />
                <a
                  href={guestUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-grey-mid text-center break-all hover:text-brand-black transition-colors"
                >
                  {guestUrl}
                </a>
              </>
            ) : (
              <div className="w-[160px] h-[160px] border-2 border-brand-border rounded-lg flex items-center justify-center text-sm text-brand-grey-light text-center leading-snug">
                Adisyon açıldığında QR burada görünür
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Payment breakdown */}
        <div className="w-[260px] bg-white border-2 border-brand-black rounded-xl overflow-hidden flex-none">
          <div className="px-5 py-3.5 border-b border-brand-border">
            <h2 className="text-[17px] text-brand-black">Döküm</h2>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            {hasBill ? (
              <>
                <div className="flex justify-between text-[17px] text-brand-grey-dark">
                  <span>Toplam</span>
                  <span>{formatTL(totalKurus / 100)}</span>
                </div>
                <div className="flex justify-between text-[17px] text-brand-grey-dark">
                  <span>Ödenen</span>
                  <span>{formatTL(paidKurus / 100)}</span>
                </div>
                <div className="pt-3 border-t border-brand-border flex justify-between text-[19px] text-brand-black font-medium">
                  <span>Kalan</span>
                  <span>{formatTL(remainingKurus / 100)}</span>
                </div>

                {/* Per-payment breakdown — bill amount and tip listed separately (R3) */}
                {bill.payments.length > 0 && (
                  <div className="pt-3 border-t border-brand-border flex flex-col gap-3">
                    <p className="text-xs font-medium tracking-wider uppercase text-brand-grey-mid">
                      Ödemeler
                    </p>
                    {bill.payments.map((pay, i) => (
                      <div key={pay.id} className="text-[14px] text-brand-grey-dark flex flex-col gap-0.5">
                        <div className="flex justify-between">
                          <span className="text-brand-grey-mid">#{i + 1} hesap payı</span>
                          <span>{formatTLNoUnit(pay.amountKurus / 100)}</span>
                        </div>
                        {pay.tipKurus > 0 && (
                          <div className="flex justify-between">
                            <span className="text-brand-grey-mid">bahşiş</span>
                            <span>{formatTLNoUnit(pay.tipKurus / 100)}</span>
                          </div>
                        )}
                        <div className="flex justify-between font-medium text-brand-black">
                          <span>toplam</span>
                          <span>
                            {formatTLNoUnit((pay.amountKurus + pay.tipKurus) / 100)}
                          </span>
                        </div>
                        {i < bill.payments.length - 1 && (
                          <div className="mt-1 border-b border-brand-border" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-brand-grey-mid text-sm py-2">
                Adisyon açıldığında döküm burada görünür.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
