'use client'
/**
 * T07 — Guest-side session + polling.
 *
 * Responsibilities:
 *   1. On mount (and whenever billId changes): POST /api/session to create or
 *      refresh the anonymous session. This is the "I'm still here" heartbeat
 *      that updates Session.lastSeenAt (R7).
 *   2. Poll every POLL_MS (≈5 s) so the bill screen stays fresh. When the
 *      admin adds an item or another guest pays, it shows up within ~5 s.
 *   3. Trigger an immediate refresh when the tab regains focus (visibilitychange).
 *
 * Renders nothing — pure side-effect component mounted at the bottom of the page.
 *
 * router.refresh() re-fetches the server component tree without unmounting
 * client components, so numbers update calmly with no loading flash (D24).
 * startTransition keeps the old UI visible while the new data loads.
 */

import { useEffect, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const POLL_MS = 5_000

type Props = {
  billId: string | null // null = no open bill on this table
}

export default function Poller({ billId }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()

  useEffect(() => {
    let cancelled = false

    async function ping() {
      // Update session lastSeenAt (or create session on first call)
      if (billId) {
        await fetch('/api/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ billId }),
        }).catch(() => {}) // never crash the poll loop on network error
      }

      if (!cancelled) {
        startTransition(() => {
          router.refresh()
        })
      }
    }

    // Immediate first ping
    ping()

    // Interval (≈5 s)
    const interval = setInterval(ping, POLL_MS)

    // Refresh on tab refocus
    function onVisibility() {
      if (document.visibilityState === 'visible') ping()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [billId]) // restart if billId changes (admin opens a bill while guest watches)

  return null
}
