# T09 — Split equally (S2)

**Blocked by:** #9 (T08)
**Reference:** PRODUCT.md S2, R2, R5

---

## Goal

Pay by splitting the bill equally across a headcount.

---

## Scope

- **S2 headcount screen:** shown only when "Split equally" is chosen, and **only to the first
  guest**. One question: "How many people are at the table?"
- The count is fixed to the table and **cannot change after the first payment** (R5)
- Later guests never see this screen; they go straight to "Pay my share"
- Progress on S1-c: "2 of 3 shares paid · 160.00 TL remaining"

## Critical rule — R2 (share calculation)

> **Payment amount = remaining balance ÷ number of unpaid shares (rounded to the minor unit).
> The last remaining share is the entire remaining balance.**

This single rule handles three things:
- **Rounding remainder:** 100.00 TL ÷ 3 → 33.33 / 33.33 / **33.34**. The table always reaches zero.
- **A growing bill:** if items are added mid-payment, the remaining shares recalculate themselves.
- **"I'll cover the rest":** a special case of the same rule.

The system **does not know who paid**; it only **counts paid shares** (R5, R10).

---

## Acceptance criteria

- [ ] The first guest enters the headcount; the second guest never sees that screen
- [ ] The headcount cannot be changed after the first payment
- [ ] **100.00 TL / 3 people test:** after three payments the remaining balance is exactly 0.00
      and the table closes
- [ ] After one person pays, adding an item from the admin console correctly increases the
      remaining shares
- [ ] The progress indicator counts correctly
