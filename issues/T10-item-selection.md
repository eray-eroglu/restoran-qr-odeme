# T10 — Item selection and locking (S3)

**Blocked by:** #9 (T08)
**Reference:** PRODUCT.md S3, R6, R7; CONTEXT.md D12, D24, D25

---

## Goal

Let a guest pick the items they personally consumed and pay for those. **The most complex part
of v1 and the product's actual differentiator** — which is why it is last.

---

## Scope

- **Every unit** on the bill is individually selectable ("2x Köfte" behaves as two rows)
- Three states per unit, distinguishable **at a glance**:
  - **Available**
  - **Taken by someone else (locked)** — no name shown, just "taken" (R10)
  - **Paid** — permanently closed
- Live running total and a "Pay" button at the bottom
- Selections can be undone at any time
- Polling is faster on this screen: **~1.5s** (D24)

## Critical rules

- **R6 — The server owns the lock.** The UI is optimistic (your own action shows instantly) but
  the real lock lives on the server. If the server rejects a second selection: *"Someone just
  picked this item."* — presented as **soft information, not an error**. This is a normal event.
- **R7 — A silent session loses its locks.** If a phone does not reach the server for ~60
  seconds, that session's **unpaid** selections are released. **Paid** selections never are.

---

## Acceptance criteria

- [ ] Two phones on the same table; when one picks an item the other shows it locked within ~1.5s
- [ ] When two phones tap the same unit **simultaneously**, the second gets the soft warning and
      the item goes to exactly one person
- [ ] A selection can be undone and the item becomes available to others again
- [ ] When a phone closes the page, its selections are released after ~60s
- [ ] Paid items are never released under any circumstances
- [ ] When everyone has paid for their own items the remaining balance is 0 and the table closes
- [ ] The three states (available/locked/paid) are clearly distinguishable
