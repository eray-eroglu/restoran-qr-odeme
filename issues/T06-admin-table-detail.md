# T06 — Admin console: table detail (S9)

**Blocked by:** #6 (T05)
**Reference:** PRODUCT.md S9, R1, R3, R9; CONTEXT.md D21

---

## Goal

Build a table's bill, open it for payment, get its QR, and close it manually if needed.

---

## Scope

- Add and remove items by **tapping** the demo menu (the ~20-item fixed menu from T02)
- The table's current bill and total
- **"Open for payment"** — from this moment the table is visible over the QR (R9)
- **Show the QR link** — both as a URL and as a scannable QR image on screen (during the friend
  test you will have people scan it off the screen rather than sticking paper to a table)
- **Payment breakdown** — for each payment, **bill amount and tip listed separately** (R3)
- **"Close table manually"** — the escape hatch: the remaining balance is treated as collected
  by other means and the table closes. Must ask for confirmation (irreversible)

## Important rule

The bill can grow **after** payment has started (R1). This screen must allow that; item entry
must not close just because payment began.

---

## Acceptance criteria

- [ ] Items are added/removed by tapping the menu and the total updates immediately
- [ ] After "Open for payment" the QR link works and opens the guest side
- [ ] The QR image on screen is scannable
- [ ] Items can still be added mid-payment and the remaining balance grows correctly
- [ ] Manual close works and asks for confirmation
- [ ] The payment breakdown shows bill amount and tip separately
