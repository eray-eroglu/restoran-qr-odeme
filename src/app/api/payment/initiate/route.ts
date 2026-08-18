/**
 * POST /api/payment/initiate
 *
 * Receives the card form, creates a Payment(PENDING) record, calls iyzico
 * initiate3DS, and returns the bank's 3DS HTML directly so the browser
 * auto-submits to the 3DS page.
 *
 * R8: Amount is re-computed server-side from DB; the client-submitted
 * amountKurus field is used only as a sanity reference and is never trusted.
 */

import { type NextRequest } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'
import { initiate3DS } from '@/lib/iyzico'

export const dynamic = 'force-dynamic'

function kurusToDecimal(k: number): string {
  return Math.floor(k / 100) + '.' + String(k % 100).padStart(2, '0')
}

function parseExpiry(raw: string): { month: string; year: string } | null {
  const clean = raw.replace(/\s/g, '')
  const m = clean.match(/^(\d{2})\/(\d{2,4})$/)
  if (!m) return null
  const month = m[1]
  const year  = m[2].length === 2 ? '20' + m[2] : m[2]
  return { month, year }
}

export async function POST(request: NextRequest) {
  const origin = new URL(request.url).origin

  function failHtml(message: string) {
    const url = `${origin}/t/error?error=${encodeURIComponent(message)}`
    return new Response(
      `<!doctype html><html><head><meta http-equiv="refresh" content="0;url=${url}"></head>
       <body><a href="${url}">Devam et</a></body></html>`,
      { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } },
    )
  }

  try {
    const formData = await request.formData()
    const tableToken     = String(formData.get('tableToken')     ?? '')
    const billId         = String(formData.get('billId')         ?? '')
    const cardHolderName = String(formData.get('cardHolderName') ?? '').trim()
    const cardNumber     = String(formData.get('cardNumber')     ?? '').replace(/\s/g, '')
    const expiry         = String(formData.get('expiry')         ?? '')
    const cvc            = String(formData.get('cvc')            ?? '').trim()

    if (!tableToken || !billId || !cardNumber || !expiry || !cvc) {
      return failHtml('Eksik form alanı.')
    }

    const parsedExpiry = parseExpiry(expiry)
    if (!parsedExpiry) return failHtml('Geçersiz son kullanma tarihi.')

    // ── Re-compute amount from DB (R8) ───────────────────────────────────
    const bill = await prisma.bill.findUnique({
      where: { id: billId, status: 'OPEN' },
      include: {
        items:    { select: { priceKurus: true } },
        payments: { where: { status: 'SUCCEEDED' }, select: { amountKurus: true } },
        table:    { select: { token: true } },
      },
    })

    if (!bill || bill.table.token !== tableToken) {
      return failHtml('Hesap bulunamadı veya kapalı.')
    }

    const totalKurus     = bill.items.reduce((s, i) => s + i.priceKurus, 0)
    const paidKurus      = bill.payments.reduce((s, p) => s + p.amountKurus, 0)
    const remainingKurus = totalKurus - paidKurus

    // R2 (server-side, R8 — never trust client amount): for EQUAL_SPLIT,
    // compute this guest's share. Non-last shares = floor(remaining / unpaid);
    // last share = full remaining so the bill reaches exactly 0.
    let amountKurus = remainingKurus
    if (bill.mode === 'EQUAL_SPLIT' && bill.splitPeople) {
      const unpaid = Math.max(1, bill.splitPeople - bill.payments.length)
      const isLast = unpaid === 1
      amountKurus  = isLast ? remainingKurus : Math.floor(remainingKurus / unpaid)
    }

    if (amountKurus <= 0) return failHtml('Ödeme gereken tutar 0.')

    // ── Find/create guest session ─────────────────────────────────────────
    let sessionId: string | null = null
    const guestToken = request.cookies.get('guest_session')?.value
    if (guestToken) {
      const session = await prisma.session.findUnique({ where: { token: guestToken } })
      if (session && session.billId === billId) sessionId = session.id
    }

    // ── Create Payment(PENDING) in DB ─────────────────────────────────────
    const payment = await prisma.payment.create({
      data: {
        billId,
        sessionId,
        amountKurus,
        tipKurus: 0,
        status: 'PENDING',
        // conversationId will be set to payment.id below (needs the id first)
      },
    })

    // Use the payment's own CUID as conversationId (unique, DB-traceable)
    await prisma.payment.update({
      where: { id: payment.id },
      data: { conversationId: payment.id },
    })

    // ── Buyer IP ──────────────────────────────────────────────────────────
    const headersList = await headers()
    const buyerIp = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'

    // ── Call iyzico initiate3DS ───────────────────────────────────────────
    const callbackUrl = `${origin}/api/payment/callback`

    const result = await initiate3DS({
      conversationId: payment.id,
      amountDecimal:  kurusToDecimal(amountKurus),
      callbackUrl,
      card: {
        cardHolderName: cardHolderName || 'Misafir Müşteri',
        cardNumber,
        expireMonth: parsedExpiry.month,
        expireYear:  parsedExpiry.year,
        cvc,
      },
      buyerIp,
    })

    if (result.status !== 'success' || !result.threeDSHtmlContent) {
      // Mark payment as failed immediately
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'FAILED' },
      })
      return failHtml(result.errorMessage ?? 'Ödeme başlatılamadı.')
    }

    // ── Return the bank's 3DS HTML ────────────────────────────────────────
    const html = Buffer.from(result.threeDSHtmlContent, 'base64').toString('utf-8')
    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T08] initiate error:', message)
    return failHtml(`Ödeme hatası: ${message}`)
  }
}
