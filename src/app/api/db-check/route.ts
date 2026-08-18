// T02 acceptance criteria test endpoint — DELETE after T02 is verified.
// GET /api/db-check → returns schema + seed summary as JSON.

import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [menuCount, tableCount, tables] = await Promise.all([
    prisma.menuItem.count(),
    prisma.table.count(),
    prisma.table.findMany({ select: { name: true, token: true } }),
  ])

  // Verify token looks like a UUID (unguessable — R9)
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  const allTokensAreUuids = tables.every((t) => uuidPattern.test(t.token))

  return Response.json({
    ok: true,
    menuItems: menuCount,
    tables: tableCount,
    tableTokensAreUnguessable: allTokensAreUuids,
    // Show token prefix only — never log full tokens
    tokenPreviews: tables.map((t) => ({
      name: t.name,
      tokenPrefix: t.token.slice(0, 8) + '…',
    })),
  })
}
