import { config } from 'dotenv'
// Load .env.local first (gitignored — real credentials for local dev)
// then fall back to .env (tracked — placeholder values only)
config({ path: '.env.local' })
config({ path: '.env' })

import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env['DATABASE_URL'],
  },
})
