// T03 — Step 1: initiate a 3D Secure payment.
//
// Base URL is derived from request.url — no NEXT_PUBLIC_BASE_URL dependency.
// This means the callback URL sent to iyzico always matches the actual host.

import { type NextRequest } from 'next/server'
import crypto from 'crypto'
import { initiate3DS } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Derive origin from the request itself — works on Vercel, preview branches, and localhost.
  const origin = new URL(request.url).origin

  function resultUrl(params: Record<string, string>) {
    const u = new URL('/test-pay/result', origin)
    Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
    return u.toString()
  }

  try {
    const formData = await request.formData()

    const card = {
      cardHolderName: String(formData.get('cardHolderName') ?? ''),
      cardNumber:     String(formData.get('cardNumber') ?? ''),
      expireMonth:    String(formData.get('expireMonth') ?? ''),
      expireYear:     String(formData.get('expireYear') ?? ''),
      cvc:            String(formData.get('cvc') ?? ''),
    }

    const conversationId = crypto.randomUUID()
    // Callback URL: iyzico will POST here after 3DS. Must be public HTTPS.
    const callbackUrl = `${origin}/api/payment/callback`

    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
      request.headers.get('x-real-ip') ??
      '127.0.0.1'

    const result = await initiate3DS({
      conversationId,
      amountDecimal: '1.0',
      callbackUrl,
      card,
      buyerIp: ip,
    })

    if (result.status !== 'success' || !result.threeDSHtmlContent) {
      console.error('[T03] iyzico init failure:', JSON.stringify(result))
      return Response.redirect(
        resultUrl({
          status: 'failure',
          error: result.errorMessage ?? 'Ödeme başlatılamadı',
          code: result.errorCode ?? '',
        }),
        303,
      )
    }

    const html = Buffer.from(result.threeDSHtmlContent, 'base64').toString('utf-8')
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T03] unhandled error in initiate route:', message)
    return Response.redirect(
      resultUrl({ status: 'failure', error: `Sunucu hatası: ${message}` }),
      303,
    )
  }
}
