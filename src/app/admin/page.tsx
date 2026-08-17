'use client'
// E7 — Admin: password gate

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { strings } from '@/lib/strings'

const MOCK_PASSWORD = 'admin123' // replaced by env var check in T04

export default function AdminPage() {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const router = useRouter()
  const s = strings.admin.password

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (value === MOCK_PASSWORD) {
      router.push('/admin/tables')
    } else {
      setError(true)
      setValue('')
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
          onChange={(e) => { setValue(e.target.value); setError(false) }}
          autoFocus
          className="h-[60px] border-2 border-brand-black rounded-lg px-4 text-[19px] text-brand-black placeholder:text-brand-grey-light focus:outline-none bg-white"
        />
        {error && (
          <p className="text-[15px] text-brand-grey-dark">{s.wrong}</p>
        )}
        <button
          type="submit"
          className="h-[60px] border-2 border-brand-black rounded-lg flex items-center justify-center text-[19px] bg-brand-black text-white"
        >
          {s.enter}
        </button>
      </form>
    </main>
  )
}
