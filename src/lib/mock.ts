// Mock data for UI development. Replaced by real API calls in T02+.
// Every function returns a Promise to make the swap to fetch() trivial.

export type BillItem = {
  id: string
  name: string
  pricePerUnit: number // in TL
  quantity: number
  // runtime state (not in DB, computed from payments)
  paidQuantity?: number       // how many units are fully paid
  lockedBy?: string | null    // session token that has this unit in-flight
}

export type TableBill = {
  tableId: string
  tableName: string
  status: 'no_bill' | 'open' | 'closed'
  totalAmount: number
  paidAmount: number
  mode: 'none' | 'full' | 'equal_split' | 'items' | null
  splitPeople?: number
  splitPaidCount?: number
  items: BillItem[]
}

export type Payment = {
  id: string
  tableId: string
  tableName: string
  amount: number
  tip: number
  tipPercent: number
  items: { name: string; amount: number }[]
  status: 'success' | 'failure'
  createdAt: Date
  txRef: string
}

export type AdminTable = {
  id: string
  name: string
  status: 'no_bill' | 'open' | 'closed'
  totalAmount: number | null
  paidAmount: number | null
  mode: string | null
}

// ── Mock data ──────────────────────────────────────────────────────────────

const MOCK_BILL: TableBill = {
  tableId: '7',
  tableName: 'Masa 7',
  status: 'open',
  totalAmount: 1960,
  paidAmount: 653.33,
  mode: 'equal_split',
  splitPeople: 3,
  splitPaidCount: 1,
  items: [
    { id: 'i1', name: 'Adana Kebap', pricePerUnit: 480, quantity: 2, paidQuantity: 1 },
    { id: 'i2', name: 'İçli Köfte', pricePerUnit: 220, quantity: 1, paidQuantity: 0 },
    { id: 'i3', name: 'Ayran', pricePerUnit: 45, quantity: 3, paidQuantity: 0, lockedBy: 'other-session' },
    { id: 'i4', name: 'Efes (50cl)', pricePerUnit: 190, quantity: 2, paidQuantity: 0 },
    { id: 'i5', name: 'Künefe', pricePerUnit: 265, quantity: 1, paidQuantity: 0 },
  ],
}

const MOCK_NO_BILL: TableBill = {
  tableId: '3',
  tableName: 'Masa 3',
  status: 'no_bill',
  totalAmount: 0,
  paidAmount: 0,
  mode: null,
  items: [],
}

const MOCK_CLOSED: TableBill = {
  tableId: '5',
  tableName: 'Masa 5',
  status: 'closed',
  totalAmount: 1960,
  paidAmount: 1960,
  mode: 'equal_split',
  splitPeople: 3,
  splitPaidCount: 3,
  items: [
    { id: 'i1', name: 'Adana Kebap', pricePerUnit: 480, quantity: 2, paidQuantity: 2 },
    { id: 'i2', name: 'İçli Köfte', pricePerUnit: 220, quantity: 1, paidQuantity: 1 },
    { id: 'i3', name: 'Ayran', pricePerUnit: 45, quantity: 3, paidQuantity: 3 },
    { id: 'i4', name: 'Efes (50cl)', pricePerUnit: 190, quantity: 2, paidQuantity: 2 },
    { id: 'i5', name: 'Künefe', pricePerUnit: 265, quantity: 1, paidQuantity: 1 },
  ],
}

const MOCK_PAYMENT_SUCCESS: Payment = {
  id: 'pay-7f289104',
  tableId: '7',
  tableName: 'Masa 7',
  amount: 525,
  tip: 52.5,
  tipPercent: 10,
  items: [
    { name: '1x Adana Kebap', amount: 480 },
    { name: '1x Ayran', amount: 45 },
  ],
  status: 'success',
  createdAt: new Date('2026-08-13T21:14:00'),
  txRef: '7F-2891-04',
}

const MOCK_ADMIN_TABLES: AdminTable[] = [
  { id: '1', name: 'Masa 1', status: 'no_bill', totalAmount: null, paidAmount: null, mode: null },
  { id: '2', name: 'Masa 2', status: 'open', totalAmount: 840, paidAmount: 0, mode: 'none' },
  { id: '3', name: 'Masa 3', status: 'no_bill', totalAmount: null, paidAmount: null, mode: null },
  { id: '4', name: 'Masa 4', status: 'open', totalAmount: 2300, paidAmount: 766.67, mode: 'equal_split' },
  { id: '5', name: 'Masa 5', status: 'closed', totalAmount: 1960, paidAmount: 1960, mode: 'equal_split' },
  { id: '6', name: 'Masa 6', status: 'open', totalAmount: 450, paidAmount: 0, mode: 'none' },
  { id: '7', name: 'Masa 7', status: 'open', totalAmount: 1960, paidAmount: 653.33, mode: 'equal_split' },
]

// ── API stubs ──────────────────────────────────────────────────────────────

export async function getTableBill(tableId: string): Promise<TableBill> {
  await delay(200)
  if (tableId === '3') return MOCK_NO_BILL
  if (tableId === '5') return MOCK_CLOSED
  return { ...MOCK_BILL, tableId, tableName: `Masa ${tableId}` }
}

export async function getPayment(paymentId: string): Promise<Payment> {
  await delay(200)
  return MOCK_PAYMENT_SUCCESS
}

export async function getAdminTables(): Promise<AdminTable[]> {
  await delay(200)
  return MOCK_ADMIN_TABLES
}

export async function getAdminTableDetail(tableId: string): Promise<TableBill> {
  return getTableBill(tableId)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
