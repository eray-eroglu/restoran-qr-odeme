// T03 — Payment result page.
// Server component; reads outcome from URL search params set by the callback handler.

import Link from 'next/link'

type Props = {
  searchParams: Promise<{ status?: string; paymentId?: string; error?: string; code?: string }>
}

export default async function TestPayResultPage({ searchParams }: Props) {
  const { status, paymentId, error, code } = await searchParams
  const success = status === 'success'

  return (
    <main className="min-h-screen bg-brand-surface-off flex items-center justify-center px-4">
      <div className="w-full max-w-[380px] flex flex-col items-center gap-5 text-center">
        {/* Outcome circle */}
        <div
          className={`w-16 h-16 rounded-full border-4 flex items-center justify-center text-2xl ${
            success
              ? 'border-brand-black text-brand-black'
              : 'border-brand-grey-mid text-brand-grey-mid'
          }`}
        >
          {success ? '✓' : '!'}
        </div>

        <div>
          <h1 className="text-[24px] text-brand-black">
            {success ? 'Ödeme Başarılı' : 'Ödeme Başarısız'}
          </h1>
          {success && paymentId && (
            <p className="text-[14px] text-brand-grey-mid mt-1 font-mono">
              iyzico ID: {decodeURIComponent(paymentId)}
            </p>
          )}
          {!success && error && (
            <p className="text-[15px] text-brand-grey-dark mt-2">
              {decodeURIComponent(error)}
              {code && <span className="text-brand-grey-light ml-1">({code})</span>}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 w-full mt-2">
          <Link
            href="/test-pay"
            className="h-[52px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[17px] bg-brand-black text-white hover:bg-brand-grey-dark hover:border-brand-grey-dark transition-colors"
          >
            Tekrar dene
          </Link>
          <Link
            href="/"
            className="h-[52px] border-2 border-brand-border rounded-lg flex items-center justify-center text-[17px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors"
          >
            Ana sayfa
          </Link>
        </div>

        <p className="text-[12px] text-brand-grey-light mt-2">
          T03 dikey dilim · sandbox ortamı
        </p>
      </div>
    </main>
  )
}
