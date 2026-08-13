# T11 — Tips and receipt

**Blocked by:** #9 (T08)
**Reference:** PRODUCT.md S4, S5, R3; CONTEXT.md D22, D23, D32

---

## Goal

Add the tip row to the payment screen and the two separate amounts to the receipt.

---

## Scope

**Tips (S4):**
- A **single row** on the payment screen: 5% / 10% / 15% / None
- **Nothing preselected**, skippable
- **Not a separate screen, not a separate step**
- Selecting updates the total immediately
- Two numbers shown separately on screen: **bill share** and **tip**

**Receipt (S5):**
- Amount paid, tip, timestamp, table
- **Permanent URL**
- Below it, the table's current state ("160.00 TL remaining") and a way back to the bill screen
- **This is a receipt, not a fiscal receipt** — that must be clear on screen. The fiscal receipt
  is issued by the restaurant's own register.

## Critical rule — R3

> **Tips are independent of the balance.** Only the bill amount is deducted from the remaining
> balance. Table closing ignores tips.

If this rule breaks, the bill closes short and the restaurant does not get paid in full.

---

## Acceptance criteria

- [ ] Paying with a 10% tip deducts **only the bill share** from the remaining balance
- [ ] Paying without a tip works cleanly (the default state)
- [ ] The receipt shows bill share and tip separately
- [ ] The admin console payment breakdown shows them separately too (T06)
- [ ] The receipt URL works after being closed and reopened
- [ ] The "not a fiscal receipt" notice is present on screen
- [ ] The tip row adds no extra step to the payment flow
