// T08 — 3D Secure callback handler (updated from T03).
//
// Lookup flow:
//   1. Find Payment record in DB by conversationId.
//   2. If found (T08 real payment): verify with iyzico → update DB → redirect.
//   3. If NOT found (T03 test payment): fall back to old test-pay result page.
//
// R8: Verification is always server-side — we ask iyzico for truth,
//     never trusting params that arrived from the browser.
// R1: After SUCCEEDED: sum all paid amounts; if ≥ total → close bill automatically.

import { type NextRequest } from 'next/server'
import { verify3DS } from '@/lib/iyzico'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// ── Helpers ──────────────────────────────────────────────────────────────────

function testResultUrl(origin: string, params: Record<string, string>) {
  const u = new URL('/test-pay/result', origin)
  Object.entries(params).forEach(([k, v]) => u.searchParams.set(k, v))
  return u.toString()
}

async function handleRealPayment(
  origin: string,
  dbPaymentId: string,
  iyzicoPaymentId: string,
  conversationId: string,
  conversationData: string,
) {
  // Fetch payment with its bill + items + table
  const payment = await prisma.payment.findUnique({
    where: { id: dbPaymentId },
    include: {
      bill: {
        include: {
          items: true,
          payments: { where: { status: 'SUCCEEDED' } },
          table: { select: { token: true } },
        },
      },
    },
  })

  if (!payment) {
    return Response.redirect(testResultUrl(origin, { status: 'failure', error: 'Ödeme kaydı bulunamadı' }), 303)
  }

  const tableToken = payment.bill.table.token

  try {
    const result = await verify3DS({ conversationId, paymentId: iyzicoPaymentId, conversationData })
    console.log('[T08] verify result:', JSON.stringify(result))

    if (result.status === 'success') {
      // ── Mark payment as SUCCEEDED ──────────────────────────────────────
      await prisma.payment.update({
        where: { id: payment.id },
        data: { status: 'SUCCEEDED', providerPaymentId: iyzicoPaymentId },
      })

      // ── Mark paid items — behaviour differs by split mode ─────────────
      if (payment.bill.mode === 'BY_ITEM' && payment.sessionId) {
        // BY_ITEM: only this session's locked (unpaid) items
        const myLocks = await prisma.itemLock.findMany({
          where: { billId: payment.billId, sessionId: payment.sessionId, isPaid: false },
        })
        if (myLocks.length > 0) {
          const lockItemIds = myLocks.map((l) => l.billItemId)
          await prisma.billItem.updateMany({
            where: { id: { in: lockItemIds } },
            data: { isPaid: true, paymentId: payment.id },
          })
          // Mark the locks as permanently paid (not subject to R7 stale cleanup)
          await prisma.itemLock.updateMany({
            where: { billItemId: { in: lockItemIds } },
            data: { isPaid: true },
          })
        }
      } else {
        // NONE (whole bill) or EQUAL_SPLIT: mark all currently unpaid items
        const unpaidItems = payment.bill.items.filter((i) => !i.isPaid)
        if (unpaidItems.length > 0) {
          await prisma.billItem.updateMany({
            where: { id: { in: unpaidItems.map((i) => i.id) } },
            data: { isPaid: true, paymentId: payment.id },
          })
        }
      }

      // ── Auto-close bill if fully paid (R1) ────────────────────────────
      const allItems = await prisma.billItem.findMany({
        where: { billId: payment.billId },
        select: { priceKurus: true },
      })
      const successPayments = await prisma.payment.aggregate({
        where: { billId: payment.billId, status: 'SUCCEEDED' },
        _sum: { amountKurus: true },
      })

      const totalKurus = allItems.reduce((s, i) => s + i.priceKurus, 0)
      const paidKurus  = successPayments._sum.amountKurus ?? 0

      if (paidKurus >= totalKurus) {
        await prisma.bill.update({
          where: { id: payment.billId },
          data: { status: 'CLOSED', closedAt: new Date() },
        })
      }

      // ── Redirect to permanent receipt ─────────────────────────────────
      return Response.redirect(new URL(`/receipt/${payment.id}`, origin).toString(), 303)
    }

    // ── Payment failed ─────────────────────────────────────────────────────
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'FAILED' },
    })

    const failUrl = new URL(`/t/${tableToken}`, origin)
    failUrl.searchParams.set('payFailed', '1')
    failUrl.searchParams.set('error', result.errorMessage ?? 'Ödeme reddedildi')
    return Response.redirect(failUrl.toString(), 303)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T08] verify error:', message)

    // Mark as failed on exception too
    await prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED' } }).catch(() => {})

    const failUrl = new URL(`/t/${tableToken}`, origin)
    failUrl.searchParams.set('payFailed', '1')
    failUrl.searchParams.set('error', message)
    return Response.redirect(failUrl.toString(), 303)
  }
}

// ── Main handler (shared by GET and POST) ─────────────────────────────────────

async function handleCallback(
  origin: string,
  iyzicoPaymentId: string,
  conversationId: string,
  conversationData: string,
) {
  if (!iyzicoPaymentId || !conversationId) {
    return new Response('OK', { status: 200 })
  }

  // The conversationId we set is always the DB Payment.id
  const dbPayment = await prisma.payment.findUnique({ where: { id: conversationId } }).catch(() => null)

  if (dbPayment) {
    // T08 real payment flow
    return handleRealPayment(origin, dbPayment.id, iyzicoPaymentId, conversationId, conversationData)
  }

  // T03 test-pay flow (no DB record) — fall back to old behavior
  try {
    const result = await verify3DS({ conversationId, paymentId: iyzicoPaymentId, conversationData })
    if (result.status === 'success') {
      return Response.redirect(
        testResultUrl(origin, { status: 'success', paymentId: result.paymentId ?? iyzicoPaymentId }),
        303,
      )
    }
    return Response.redirect(
      testResultUrl(origin, {
        status: 'failure',
        error: result.errorMessage ?? 'Ödeme reddedildi',
        code:  result.errorCode ?? '',
      }),
      303,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return Response.redirect(testResultUrl(origin, { status: 'failure', error: message }), 303)
  }
}

export async function GET(request: NextRequest) {
  const url    = new URL(request.url)
  const origin = url.origin
  return handleCallback(
    origin,
    url.searchParams.get('paymentId')      ?? '',
    url.searchParams.get('conversationId') ?? '',
    url.searchParams.get('conversationData') ?? '',
  )
}

export async function POST(request: NextRequest) {
  const origin = new URL(request.url).origin
  try {
    const fd = await request.formData()
    return handleCallback(
      origin,
      String(fd.get('paymentId')      ?? ''),
      String(fd.get('conversationId') ?? ''),
      String(fd.get('conversationData') ?? ''),
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[T08] POST callback parse error:', message)
    return Response.redirect(testResultUrl(origin, { status: 'failure', error: message }), 303)
  }
}
