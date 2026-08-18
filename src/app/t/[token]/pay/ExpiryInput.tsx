'use client'
/**
 * Expiry date input with auto-formatting: types "1230" → shows "12/30".
 * The "/" is inserted automatically after the 2nd digit so the user never
 * has to type it — the numeric keyboard on mobile has no "/" key anyway.
 */

import { useState } from 'react'

type Props = { className?: string }

export default function ExpiryInput({ className }: Props) {
  const [value, setValue] = useState('')

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    // Strip everything except digits, cap at 4
    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)

    // Format: 0–2 digits → raw; 3–4 digits → MM/YY
    const formatted = digits.length > 2
      ? digits.slice(0, 2) + '/' + digits.slice(2)
      : digits

    setValue(formatted)
  }

  return (
    <input
      name="expiry"
      type="text"
      inputMode="numeric"
      placeholder="AA/YY"
      autoComplete="cc-exp"
      maxLength={5}
      value={value}
      onChange={handleChange}
      required
      className={className}
    />
  )
}
