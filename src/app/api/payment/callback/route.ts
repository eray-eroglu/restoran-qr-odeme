// T03 — Step 2: 3D Secure callback handler.
//
// iyzico (via the bank) POSTs to this URL after 3DS authentication.
// We do NOT trust anything the browser reports — the server verifies the
// payment status directly with iyzico (R8 requirement).
//
// After verification, we redirect to the result page with the outcome.

import { type NextRequest } from 'next/server'
import { verify3DS } from '@/lib/iyzico'

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

  let formData: FormData
  try {
    formData = await request.formData()
  } catch {
    return Response.redirect(`${baseUrl}/test-pay/result?status=failure&error=bad_callback`, 303)
  }

  const paymentId      = (formData.get('paymentId') ?? '') as string
  const conversationId = (formData.get('conversationId') ?? '') as string
  const conversationData = (formData.get('conversationData') ?? '') as string

  // If iyzico didn't give us a paymentId, something went very wrong.
  if (!paymentId || !conversationId) {
    const msg = encodeURIComponent('Geçersiz callback — ödeme ID eksik')
    return Response.redirect(`${baseUrl}/test-pay/result?status=failure&error=${msg}`, 303)
  }

  // Server-side verification: even if the browser reports success, we ask iyzico.
  let verifyResult
  try {
    verifyResult = await verify3DS({ conversationId, paymentId, conversationData })
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'Doğrulama başarısız')
    return Response.redirect(`${baseUrl}/test-pay/result?status=failure&error=${msg}`, 303)
  }

  if (verifyResult.status === 'success') {
    return Response.redirect(
      `${baseUrl}/test-pay/result?status=success&paymentId=${encodeURIComponent(verifyResult.paymentId ?? paymentId)}`,
      303,
    )
  }

  const msg = encodeURIComponent(verifyResult.errorMessage ?? 'Ödeme reddedildi')
  return Response.redirect(
    `${baseUrl}/test-pay/result?status=failure&error=${msg}&code=${verifyResult.errorCode ?? ''}`,
    303,
  )
}

// iyzico occasionally sends GET requests (e.g. for webhook retries or previews).
// Return 200 so it doesn't treat our endpoint as broken.
export async function GET() {
  return new Response('OK', { status: 200 })
}
