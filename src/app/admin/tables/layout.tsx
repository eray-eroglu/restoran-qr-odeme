'use client'
/**
 * T04 — Client-side session guard for all /admin/tables/* pages.
 *
 * Why this exists alongside the middleware cookie check:
 *   Modern browsers (Chrome, Edge, Firefox) restore "session" cookies when a
 *   closed tab or window is reopened via session-restore. The middleware only
 *   sees the cookie, so it lets those requests through. This layout adds a
 *   second layer: it checks sessionStorage, which browsers always clear when
 *   a tab is truly closed. If the flag is missing the layout immediately
 *   revokes the cookie and sends the user back to the password screen.
 *
 * Flow:
 *   Login (/admin/page.tsx) → sets sessionStorage.admin_auth = '1'
 *                           → hard-navigates to /admin/tables
 *   This layout mounts      → sessionStorage check passes → show content
 *   Tab closed              → sessionStorage cleared (browser guarantee)
 *   Tab reopened            → cookie still exists, middleware passes through
 *                           → this layout mounts → no sessionStorage flag
 *                           → logout API clears cookie → redirect to /admin
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const SESSION_KEY = 'admin_auth'

export default function AdminTablesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [authorized, setAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') {
      setAuthorized(true)
    } else {
      // Revoke the persistent cookie so the next visit also shows the login screen
      fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
      router.replace('/admin')
    }
  }, [router])

  // Render nothing until the check passes — prevents any flash of protected content
  if (!authorized) return null

  return <>{children}</>
}
