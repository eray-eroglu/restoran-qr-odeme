/**
 * /t/[token] — Guest entry point via QR code (R9).
 *
 * The table's `token` field is an unguessable UUID, used in QR codes so
 * sequential table IDs are never exposed to guests.
 *
 * T06: Looks up the table by token and redirects to the existing guest
 * bill screen. The guest bill screen will be rebuilt with real DB data in T07.
 */

import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'

type Props = { params: Promise<{ token: string }> }

export default async function GuestEntryPage({ params }: Props) {
  const { token } = await params

  const table = await prisma.table.findUnique({ where: { token } })
  if (!table) notFound()

  // Redirect to the existing guest bill screen (rebuilt with real DB in T07)
  redirect(`/table/${table.id}`)
}
