'use client'
/**
 * T06 — "Hesabı Kapat" button with confirmation dialog.
 * Confirmation is required (irreversible action per spec).
 */

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { closeBill } from './actions'

type Props = { billId: string; tableId: string }

export default function CloseButton({ billId, tableId }: Props) {
  const [pending, startTransition] = useTransition()
  const router = useRouter()

  function handleClose() {
    const confirmed = window.confirm(
      'Hesabı kapat ve kalan bakiyeyi sıfırla?\n\nBu işlem geri alınamaz.',
    )
    if (!confirmed) return

    startTransition(async () => {
      const fd = new FormData()
      fd.set('billId', billId)
      fd.set('tableId', tableId)
      await closeBill(fd)
      router.refresh()
    })
  }

  return (
    <button
      onClick={handleClose}
      disabled={pending}
      className="h-9 px-4 border-2 border-brand-grey-mid rounded-lg text-[15px] text-brand-grey-dark hover:border-brand-black hover:text-brand-black transition-colors disabled:opacity-40"
    >
      {pending ? '…' : 'Hesabı Kapat'}
    </button>
  )
}
