'use client'
/**
 * T05 — Header action area for the admin table list.
 * Handles "Masa oluştur" (with toggled name input) and "Örnek masa oluştur".
 * Kept as a client component so the show/hide toggle works without a full-page
 * reload; the actual mutations are server actions.
 */

import { useState, useTransition } from 'react'
import { createTable, createSampleTable } from './actions'
import { strings } from '@/lib/strings'

export default function NewTableForm() {
  const [showInput, setShowInput] = useState(false)
  const [pending, startTransition] = useTransition()
  const s = strings.admin.tables

  function handleSample() {
    startTransition(async () => {
      await createSampleTable()
    })
  }

  if (showInput) {
    return (
      <form
        action={createTable}
        onSubmit={() => setShowInput(false)}
        className="flex items-center gap-2"
      >
        <input
          name="name"
          autoFocus
          placeholder="Masa adı…"
          maxLength={40}
          required
          className="h-10 border-2 border-brand-black rounded-lg px-3 text-[15px] text-brand-black placeholder:text-brand-grey-light focus:outline-none"
        />
        <button
          type="submit"
          className="h-10 px-4 border-2 border-brand-black rounded-lg text-[15px] bg-brand-black text-white hover:opacity-80 transition-opacity"
        >
          Ekle
        </button>
        <button
          type="button"
          onClick={() => setShowInput(false)}
          className="h-10 px-3 border border-brand-border rounded-lg text-[15px] text-brand-grey-mid hover:text-brand-grey-dark transition-colors"
        >
          İptal
        </button>
      </form>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowInput(true)}
        className="h-10 px-5 border-2 border-brand-black rounded-lg text-[15px] text-brand-black hover:bg-brand-surface transition-colors"
      >
        {s.newTable}
      </button>
      <button
        onClick={handleSample}
        disabled={pending}
        className="h-10 px-5 border border-brand-border rounded-lg text-[15px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors disabled:opacity-40"
      >
        {pending ? '…' : s.sampleTable}
      </button>
    </div>
  )
}
