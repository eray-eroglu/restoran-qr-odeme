// T03 — Step 1: initiate a 3D Secure payment.

import { type NextRequest } from 'next/server'
import crypto from 'crypto'
import { initiate3DS } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'

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
    const callbackUrl = `${baseUrl}/api/payment/callback`

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
      const msg = encodeURIComponent(result.errorMessage ?? 'Ödeme başlatılamadı')
      const code = result.errorCode ?? ''
      console.error('[T03] iyzico init failure:', result)
      return Response.redirect(
        `${baseUrl}/test-pay/result?status=failure&error=${msg}&code=${code}`,
        303,
      )
    }

    const html = Buffer.from(result.threeDSHtmlContent, 'base64').toString('utf-8')
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })

  } catch (err) {
    // Surface the real error instead of returning a generic 500.
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T03] unhandled error in initiate route:', message)
    const msg = encodeURIComponent(`Sunucu hatası: ${message}`)
    return Response.redirect(
      `${baseUrl}/test-pay/result?status=failure&error=${msg}`,
      303,
    )
  }
}
