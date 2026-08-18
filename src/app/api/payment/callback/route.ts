// T03 — 3D Secure callback handler.
//
// iyzico redirects the browser here after 3DS. In sandbox (and some live banks)
// this arrives as a GET redirect with query params; in others as a POST with form data.
// We handle both — but in both cases the server verifies status with iyzico (R8).

import { type NextRequest } from 'next/server'
import { verify3DS } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

function makeResultUrl(origin: string, params: Record<string, string>) {
  const u = new URL('/test-pay/result', origin)
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  return u.toString()
}

async function handleCallback(
  origin: string,
  paymentId: string,
  conversationId: string,
  conversationData: string,
) {
  if (!paymentId || !conversationId) {
    console.error('[T03] callback: missing paymentId or conversationId')
    return Response.redirect(
      makeResultUrl(origin, { status: 'failure', error: 'Geçersiz callback — ödeme ID eksik' }),
      303,
    )
  }

  try {
    const result = await verify3DS({ conversationId, paymentId, conversationData })
    console.log('[T03] verify result:', JSON.stringify(result))

    if (result.status === 'success') {
      return Response.redirect(
        makeResultUrl(origin, { status: 'success', paymentId: result.paymentId ?? paymentId }),
        303,
      )
    }

    return Response.redirect(
      makeResultUrl(origin, {
        status: 'failure',
        error: result.errorMessage ?? 'Ödeme reddedildi',
        code: result.errorCode ?? '',
      }),
      303,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T03] verify error:', message)
    return Response.redirect(
      makeResultUrl(origin, { status: 'failure', error: `Doğrulama hatası: ${message}` }),
      303,
    )
  }
}

// iyzico sandbox redirects the browser via GET with query params.
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const origin = url.origin

  const paymentId      = url.searchParams.get('paymentId') ?? ''
  const conversationId = url.searchParams.get('conversationId') ?? ''
  const conversationData = url.searchParams.get('conversationData') ?? ''

  // No payment params → plain health check
  if (!paymentId && !conversationId) {
    return new Response('OK', { status: 200 })
  }

  return handleCallback(origin, paymentId, conversationId, conversationData)
}

// Some banks/configurations POST the callback data as form fields.
export async function POST(request: NextRequest) {
  const origin = new URL(request.url).origin

  try {
    const formData = await request.formData()
    const paymentId      = String(formData.get('paymentId') ?? '')
    const conversationId = String(formData.get('conversationId') ?? '')
    const conversationData = String(formData.get('conversationData') ?? '')

    return handleCallback(origin, paymentId, conversationId, conversationData)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T03] POST callback parse error:', message)
    return Response.redirect(
      makeResultUrl(origin, { status: 'failure', error: `Callback hatası: ${message}` }),
      303,
    )
  }
}
