// T03 — Step 2: 3D Secure callback handler.
//
// iyzico (via the bank) POSTs to this URL after 3DS authentication.
// We do NOT trust anything the browser reports — the server verifies the
// payment status directly with iyzico (R8 requirement).

import { type NextRequest } from 'next/server'
import { verify3DS } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const origin = new URL(request.url).origin

  function resultUrl(params: Record<string, string>) {
    const u = new URL('/test-pay/result', origin)
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
    return u.toString()
  }

  try {
    const formData = await request.formData()

    const paymentId      = String(formData.get('paymentId') ?? '')
    const conversationId = String(formData.get('conversationId') ?? '')
    const conversationData = String(formData.get('conversationData') ?? '')

    if (!paymentId || !conversationId) {
      console.error('[T03] callback missing paymentId or conversationId', { paymentId, conversationId })
      return Response.redirect(
        resultUrl({ status: 'failure', error: 'Geçersiz callback — ödeme ID eksik' }),
        303,
      )
    }

    // Server-side verification: ask iyzico for the true payment status.
    const verifyResult = await verify3DS({ conversationId, paymentId, conversationData })
    console.log('[T03] verify result:', JSON.stringify(verifyResult))

    if (verifyResult.status === 'success') {
      return Response.redirect(
        resultUrl({
          status: 'success',
          paymentId: verifyResult.paymentId ?? paymentId,
        }),
        303,
      )
    }

    return Response.redirect(
      resultUrl({
        status: 'failure',
        error: verifyResult.errorMessage ?? 'Ödeme reddedildi',
        code: verifyResult.errorCode ?? '',
      }),
      303,
    )

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T03] unhandled error in callback route:', message)
    return Response.redirect(
      resultUrl({ status: 'failure', error: `Doğrulama hatası: ${message}` }),
      303,
    )
  }
}

// iyzico occasionally sends GET requests for health checks.
export async function GET() {
  return new Response('OK', { status: 200 })
}
