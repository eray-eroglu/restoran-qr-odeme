# T05 — Admin console: table list (S8)

**Blocked by:** #3 (T02), #5 (T04)
**Reference:** PRODUCT.md S8, R1

---

## Goal

See and create tables.

## Why here in the order

You cannot test anything on the guest side until you can create a table.

---

## Scope

- A list of open tables; each row shows table name, total, paid, **remaining balance**, split mode
- A **"New table"** button
- A **"Create sample table"** button — produces a pre-filled table in one click (a few items
  from the demo menu). This is for repeat testing; without it you would hand-enter items on
  every single test run
- Clicking a row opens the table detail (T06)

## Out of scope

Visual polish. Functional is enough.

---

## Acceptance criteria

- [ ] A new table can be created and appears in the list
- [ ] "Create sample table" produces a pre-filled table in one click
- [ ] The remaining balance in the list is correct (R1: current total − amount paid)
- [ ] Closed tables are visually separated from open ones
