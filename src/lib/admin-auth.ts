/**
 * Admin session helpers — shared by middleware (Edge) and API routes (Node.js).
 * Uses Web Crypto (crypto.subtle) which is available in both runtimes.
 */

export const ADMIN_COOKIE = 'admin_session'

/**
 * Deterministic session token derived from ADMIN_PASSWORD.
 * Changing the env var immediately invalidates all existing sessions.
 */
export async function computeSessionToken(password: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode('admin:v1'))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}
