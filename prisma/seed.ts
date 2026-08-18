/**
 * T02 — Database seed
 * Populates: demo restaurant tables + full menu (~25 items)
 * Run: npx prisma db seed
 */

import { config } from 'dotenv'
config({ path: '.env.local' })
config({ path: '.env' })

import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const MENU_ITEMS = [
  // Başlangıçlar
  { name: 'Mercimek Çorbası',         priceKurus:  6500, category: 'Başlangıçlar' },
  { name: 'Ezogelin Çorbası',          priceKurus:  6500, category: 'Başlangıçlar' },
  { name: 'Kremalı Mantar Çorbası',    priceKurus:  7500, category: 'Başlangıçlar' },
  { name: 'Cacık',                     priceKurus:  5500, category: 'Başlangıçlar' },
  { name: 'Sigara Böreği (4 adet)',    priceKurus:  8500, category: 'Başlangıçlar' },
  // Salatalar
  { name: 'Çoban Salatası',            priceKurus:  7500, category: 'Salatalar' },
  { name: 'Mevsim Salatası',           priceKurus:  8500, category: 'Salatalar' },
  { name: 'Akdeniz Salatası',          priceKurus:  9500, category: 'Salatalar' },
  // Ana Yemekler
  { name: 'Izgara Köfte',              priceKurus: 18000, category: 'Ana Yemekler' },
  { name: 'Adana Kebap',               priceKurus: 22000, category: 'Ana Yemekler' },
  { name: 'Urfa Kebap',                priceKurus: 22000, category: 'Ana Yemekler' },
  { name: 'Tavuk Şiş',                 priceKurus: 19000, category: 'Ana Yemekler' },
  { name: 'Karışık Izgara (2 kişilik)',priceKurus: 38000, category: 'Ana Yemekler' },
  { name: 'Lahmacun',                  priceKurus:  9000, category: 'Ana Yemekler' },
  { name: 'Karışık Pide',              priceKurus: 14500, category: 'Ana Yemekler' },
  { name: 'İskender Kebap',            priceKurus: 24500, category: 'Ana Yemekler' },
  // İçecekler
  { name: 'Ayran',                     priceKurus:  3000, category: 'İçecekler' },
  { name: 'Kola (0.33L)',              priceKurus:  4000, category: 'İçecekler' },
  { name: 'Su (0.5L)',                 priceKurus:  1500, category: 'İçecekler' },
  { name: 'Çay',                       priceKurus:  2000, category: 'İçecekler' },
  { name: 'Türk Kahvesi',              priceKurus:  4500, category: 'İçecekler' },
  { name: 'Şalgam',                    priceKurus:  3500, category: 'İçecekler' },
  // Tatlılar
  { name: 'Fırın Sütlaç',             priceKurus:  9000, category: 'Tatlılar' },
  { name: 'Künefe (küçük)',            priceKurus: 14500, category: 'Tatlılar' },
  { name: 'Baklava (2 dilim)',         priceKurus: 12500, category: 'Tatlılar' },
]

const TABLES = [
  'Masa 1', 'Masa 2', 'Masa 3', 'Masa 4',
  'Teras 1', 'Teras 2',
  'Özel Salon',
  'Bar 1',
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('Seeding database…')

  // Wipe existing seed data so the script is re-runnable
  await prisma.itemLock.deleteMany()
  await prisma.billItem.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.session.deleteMany()
  await prisma.bill.deleteMany()
  await prisma.menuItem.deleteMany()
  await prisma.table.deleteMany()

  // Menu items
  await prisma.menuItem.createMany({ data: MENU_ITEMS })
  console.log(`  ✓ ${MENU_ITEMS.length} menu items`)

  // Tables (token is auto-generated as UUID per schema default)
  await prisma.table.createMany({
    data: TABLES.map((name) => ({ name })),
  })
  console.log(`  ✓ ${TABLES.length} tables`)

  console.log('Done.')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
