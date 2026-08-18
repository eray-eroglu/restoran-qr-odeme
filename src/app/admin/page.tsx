'use client'
// E7 — Admin: password gate (T04)
// Submits to POST /api/admin/login; on success, hard-navigates to /admin/tables
// so the middleware sees the session cookie set by the API.

import { useState } from 'react'
import { strings } from '@/lib/strings'

export default function AdminPage() {
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const s = strings.admin.password

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: value }),
      })

      if (res.ok) {
        // Mark this tab as authenticated in sessionStorage.
        // sessionStorage is cleared when the tab is closed, so the layout guard
        // in /admin/tables will force re-login on every new tab/browser open.
        sessionStorage.setItem('admin_auth', '1')
        // Hard navigate so the middleware evaluates the new cookie
        window.location.href = '/admin/tables'
        return
      }

      const data = await res.json().catch(() => ({}))
      setError(data.error ?? s.wrong)
      setValue('')
    } catch {
      setError(s.wrong)
      setValue('')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-surface-off px-6">
      <form onSubmit={submit} className="w-full max-w-[320px] flex flex-col gap-3">
        <h1 className="text-[26px] text-brand-black">{s.title}</h1>
        <input
          type="password"
          placeholder={s.placeholder}
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(null) }}
          autoFocus
          disabled={loading}
          className="h-[60px] border-2 border-brand-black rounded-lg px-4 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white disabled:opacity-50"
        />
        {error && (
          <p className="text-[15px] text-brand-grey-dark">{error}</p>
        )}
        <button
          type="submit"
          disabled={loading || !value}
          className="h-[60px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[19px] bg-brand-black text-white disabled:opacity-50"
        >
          {loading ? '...' : s.enter}
        </button>
      </form>
    </main>
  )
}
