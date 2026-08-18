// T03 — Step 1: initiate a 3D Secure payment.
//
// Receives card data from the test-pay form (multipart/form-data).
// Calls iyzico; on success, returns the decoded 3DS HTML for the browser to render.
// On failure, redirects to the result page with an error.

import { type NextRequest } from 'next/server'
import crypto from 'crypto'
import { initiate3DS } from '@/lib/iyzico'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  const card = {
    cardHolderName: (formData.get('cardHolderName') ?? '') as string,
    cardNumber:     (formData.get('cardNumber') ?? '') as string,
    expireMonth:    (formData.get('expireMonth') ?? '') as string,
    expireYear:     (formData.get('expireYear') ?? '') as string,
    cvc:            (formData.get('cvc') ?? '') as string,
  }

  const conversationId = crypto.randomUUID()
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
  const callbackUrl = `${baseUrl}/api/payment/callback`

  // Best-effort IP extraction for iyzico (required field)
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    '127.0.0.1'

  let result
  try {
    result = await initiate3DS({
      conversationId,
      amountDecimal: '1.0', // 1.00 TL — fixed for the T03 vertical slice
      callbackUrl,
      card,
      buyerIp: ip,
    })
  } catch (err) {
    const msg = encodeURIComponent(err instanceof Error ? err.message : 'İstek başarısız')
    return Response.redirect(`${baseUrl}/test-pay/result?status=failure&error=${msg}`, 303)
  }

  if (result.status !== 'success' || !result.threeDSHtmlContent) {
    const msg = encodeURIComponent(result.errorMessage ?? 'Ödeme başlatılamadı')
    return Response.redirect(`${baseUrl}/test-pay/result?status=failure&error=${msg}`, 303)
  }

  // iyzico returns the 3DS page as a base64-encoded HTML document.
  // Decode it and serve it directly — the page contains an auto-submitting form
  // that takes the user through the bank's 3D Secure flow.
  const html = Buffer.from(result.threeDSHtmlContent, 'base64').toString('utf-8')
  return new Response(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
