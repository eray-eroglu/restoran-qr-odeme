// E9 — Admin: table detail (desktop)
// Three panels side by side: bill items / QR code / payment breakdown

import Link from 'next/link'
import { getAdminTableDetail } from '@/lib/mock'
import { strings, formatTL, formatTLNoUnit } from '@/lib/strings'

type Props = { params: Promise<{ tableId: string }> }

export default async function AdminTableDetailPage({ params }: Props) {
  const { tableId } = await params
  const bill = await getAdminTableDetail(tableId)
  const s = strings.admin.tableDetail

  const remaining = bill.totalAmount - bill.paidAmount

  return (
    <div className="min-h-screen bg-brand-surface-off">
      {/* Top bar */}
      <header className="bg-white border-b border-brand-border px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/admin/tables" className="text-[17px] text-brand-grey-dark hover:text-brand-black">
            ‹ Masalar
          </Link>
          <span className="text-brand-border">·</span>
          <h1 className="text-[20px] text-brand-black">{bill.tableName}</h1>
          <span className={`text-sm px-2 py-0.5 rounded-full border ${
            bill.status === 'open'
              ? 'border-brand-black text-brand-black'
              : bill.status === 'closed'
              ? 'border-brand-border text-brand-grey-mid'
              : 'border-brand-border text-brand-grey-light'
          }`}>
            {bill.status === 'open' ? 'açık' : bill.status === 'closed' ? 'kapalı' : 'hesap yok'}
          </span>
        </div>
        <div className="flex gap-2">
          {bill.status === 'no_bill' && (
            <button className="h-9 px-4 border-2 border-brand-black rounded-lg text-[15px] text-brand-black hover:bg-brand-black hover:text-white transition-colors">
              {s.openBill}
            </button>
          )}
          {bill.status === 'open' && (
            <button className="h-9 px-4 border-2 border-brand-grey-mid rounded-lg text-[15px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors">
              {s.closeBill}
            </button>
          )}
        </div>
      </header>

      {/* Three-panel layout */}
      <div className="p-8 flex gap-6 items-start">
        {/* Panel 1: Bill items */}
        <div className="flex-1 bg-white border-2 border-brand-black rounded-xl overflow-hidden">
          <div className="px-5 py-3.5 border-b border-brand-border flex justify-between items-center">
            <h2 className="text-[17px] text-brand-black">{s.menu}</h2>
            {bill.status === 'open' && (
              <button className="h-8 px-3 border border-brand-border rounded-md text-[14px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors">
                {s.addItem}
              </button>
            )}
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            {bill.items.length === 0 ? (
              <p className="text-brand-grey-mid text-base py-4">Adisyon boş.</p>
            ) : (
              <>
                {bill.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-[17px]">
                    <div className="flex flex-col">
                      <span className="text-brand-black">
                        {item.quantity}x {item.name}
                      </span>
                      {(item.paidQuantity ?? 0) > 0 && (
                        <span className="text-sm text-brand-grey-mid">
                          {item.paidQuantity}/{item.quantity} ödendi
                        </span>
                      )}
                    </div>
                    <span className="text-brand-grey-dark">
                      {formatTLNoUnit(item.pricePerUnit * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="pt-3 border-t border-brand-border flex justify-between text-[19px] font-medium">
                  <span className="text-brand-black">Toplam</span>
                  <span className="text-brand-black">{formatTL(bill.totalAmount)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Panel 2: QR code */}
        <div className="w-[240px] bg-white border-2 border-brand-black rounded-xl overflow-hidden flex-none">
          <div className="px-5 py-3.5 border-b border-brand-border">
            <h2 className="text-[17px] text-brand-black">{s.qr}</h2>
          </div>
          <div className="px-5 py-8 flex flex-col items-center gap-4">
            {/* QR placeholder — replaced by real QR in T06 */}
            <div className="w-[140px] h-[140px] border-2 border-brand-border rounded-lg flex items-center justify-center text-sm text-brand-grey-mid text-center leading-snug">
              QR kodu<br />burada
            </div>
            <p className="text-sm text-brand-grey-mid text-center">
              /table/{tableId}
            </p>
            <button className="w-full h-9 border border-brand-border rounded-lg text-[14px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors">
              İndir
            </button>
          </div>
        </div>

        {/* Panel 3: Payment breakdown */}
        <div className="w-[260px] bg-white border-2 border-brand-black rounded-xl overflow-hidden flex-none">
          <div className="px-5 py-3.5 border-b border-brand-border">
            <h2 className="text-[17px] text-brand-black">{s.breakdown}</h2>
          </div>
          <div className="px-5 py-4 flex flex-col gap-3">
            <div className="flex justify-between text-[17px] text-brand-grey-dark">
              <span>Toplam</span>
              <span>{formatTL(bill.totalAmount)}</span>
            </div>
            <div className="flex justify-between text-[17px] text-brand-grey-dark">
              <span>Ödenen</span>
              <span>{formatTL(bill.paidAmount)}</span>
            </div>
            <div className="pt-3 border-t border-brand-border flex justify-between text-[19px] text-brand-black">
              <span>Kalan</span>
              <span>{formatTL(remaining)}</span>
            </div>
            {bill.mode && bill.mode !== 'none' && (
              <div className="p-3 border border-brand-border rounded-lg text-[15px] text-brand-grey-dark">
                Mod: {bill.mode === 'equal_split' ? `Eşit böl · ${bill.splitPeople} kişi` : bill.mode}
                {bill.splitPaidCount !== undefined && (
                  <span className="block text-sm text-brand-grey-mid">
                    {bill.splitPaidCount}/{bill.splitPeople} ödendi
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
