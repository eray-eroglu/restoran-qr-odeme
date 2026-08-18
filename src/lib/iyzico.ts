/**
 * iyzico payment provider layer.
 * All provider-specific code lives in this file — swap it to change payment providers.
 *
 * Auth scheme: IYZWSv2 (HMAC-SHA256, base64)
 * Docs: https://dev.iyzipay.com
 */

import crypto from 'crypto'

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const BASE_URL = process.env.IYZICO_BASE_URL ?? 'https://sandbox-api.iyzipay.com'
const API_KEY = process.env.IYZICO_API_KEY ?? ''
const SECRET_KEY = process.env.IYZICO_SECRET_KEY ?? ''

// ---------------------------------------------------------------------------
// Internal: auth header + HTTP
// ---------------------------------------------------------------------------

/**
 * Builds the IYZWSv2 Authorization header value.
 *
 * Signature: HMAC-SHA256(randomString + uri + JSON.stringify(body), secretKey) → hex
 * Encoded:   base64("apiKey:<k>&randomKey:<r>&signature:<s>")
 */
function buildAuth(uri: string, body: object, randomKey: string): string {
  const sig = crypto
    .createHmac('sha256', SECRET_KEY)
    .update(randomKey + uri + JSON.stringify(body))
    .digest('hex')

  const payload = [`apiKey:${API_KEY}`, `randomKey:${randomKey}`, `signature:${sig}`].join('&')
  return `IYZWSv2 ${Buffer.from(payload).toString('base64')}`
}

async function iyziPost<T>(path: string, body: object): Promise<T> {
  const randomKey = crypto.randomBytes(8).toString('hex')
  const auth = buildAuth(path, body, randomKey)

  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: auth,
      'x-iyzi-rnd': randomKey,
      'x-iyzi-client-version': 'iyzipay-node-2.0.69',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`iyzico ${path} → HTTP ${res.status}: ${text.slice(0, 300)}`)
  }

  return res.json() as Promise<T>
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CardInput {
  cardHolderName: string
  cardNumber: string
  expireMonth: string // "06"
  expireYear: string  // "2030"
  cvc: string
}

export interface ThreeDSInitResult {
  status: 'success' | 'failure'
  errorCode?: string
  errorMessage?: string
  errorGroup?: string
  /** Base64-encoded HTML that auto-submits to the bank's 3DS URL. */
  threeDSHtmlContent?: string
  conversationId?: string
  paymentId?: string
}

export interface ThreeDSAuthResult {
  status: 'success' | 'failure'
  errorCode?: string
  errorMessage?: string
  errorGroup?: string
  conversationId?: string
  paymentId?: string
  price?: string
  paidPrice?: string
  currency?: string
  /** 1 = not fraudulent, -1 = fraudulent, 0 = pending */
  fraudStatus?: number
  paymentStatus?: string
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Step 1: Initialise a 3D Secure payment.
 * On success, decode threeDSHtmlContent from base64 and serve it to the browser.
 * The page auto-submits to the bank's 3DS URL.
 */
export async function initiate3DS(params: {
  conversationId: string
  /** Decimal string, e.g. "1.0" for 1 TL */
  amountDecimal: string
  callbackUrl: string
  card: CardInput
  buyerIp: string
}): Promise<ThreeDSInitResult> {
  const body = {
    locale: 'tr',
    conversationId: params.conversationId,
    price: params.amountDecimal,
    paidPrice: params.amountDecimal,
    currency: 'TRY',
    installment: '1',
    paymentChannel: 'WEB',
    paymentGroup: 'PRODUCT',
    callbackUrl: params.callbackUrl,
    paymentCard: {
      cardHolderName: params.card.cardHolderName,
      cardNumber: params.card.cardNumber,
      expireMonth: params.card.expireMonth,
      expireYear: params.card.expireYear,
      cvc: params.card.cvc,
      registerCard: '0',
    },
    // For anonymous restaurant guests — iyzico still requires buyer info.
    buyer: {
      id: `guest-${params.conversationId.slice(0, 8)}`,
      name: 'Misafir',
      surname: 'Müşteri',
      gsmNumber: '+905000000000',
      email: 'misafir@example.com',
      // Standard test identity number from iyzico sandbox docs
      identityNumber: '74300864791',
      lastLoginDate: '2026-01-01 00:00:00',
      registrationDate: '2026-01-01 00:00:00',
      registrationAddress: 'Restoran',
      ip: params.buyerIp,
      city: 'Istanbul',
      country: 'Turkey',
      zipCode: '34000',
    },
    shippingAddress: {
      contactName: 'Misafir Müşteri',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Restoran',
      zipCode: '34000',
    },
    billingAddress: {
      contactName: 'Misafir Müşteri',
      city: 'Istanbul',
      country: 'Turkey',
      address: 'Restoran',
      zipCode: '34000',
    },
    basketItems: [
      {
        id: `item-${params.conversationId.slice(0, 8)}`,
        name: 'Restoran Hesabı',
        category1: 'Yiyecek ve İçecek',
        itemType: 'VIRTUAL',
        price: params.amountDecimal,
      },
    ],
    basketId: params.conversationId,
  }

  return iyziPost<ThreeDSInitResult>('/payment/3dsecure/initialize', body)
}

/**
 * Step 2: Verify the 3D Secure result server-side.
 * Called from the callback handler after the bank redirects back.
 * The browser is NOT trusted — we ask the provider directly for the true status.
 */
export async function verify3DS(params: {
  conversationId: string
  paymentId: string
  conversationData: string
}): Promise<ThreeDSAuthResult> {
  const body = {
    locale: 'tr',
    conversationId: params.conversationId,
    paymentId: params.paymentId,
    conversationData: params.conversationData,
  }

  return iyziPost<ThreeDSAuthResult>('/payment/3dsecure/auth', body)
}
