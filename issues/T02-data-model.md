# T02 — Data model and schema

**Blocked by:** #2 (T01)
**Reference:** PRODUCT.md section 3 (Glossary), R1–R3, R5–R7, R9

---

## Goal

Postgres connectivity and a schema that carries all of v1.

## Why a real database is mandatory

Several phones share one table; state cannot live in memory.

---

## Scope

Concepts (use exactly the naming from PRODUCT.md section 3):

- **Table** — permanent, carries an **unguessable random token** (R9; guessable values like
  "table-7" are forbidden)
- **Bill** — belongs to a table, has open/closed state; split mode and (for equal splits) the
  headcount live here
- **Bill item** — name and price. **Every unit must be individually selectable** (R6): "2x Köfte"
  behaves as two separate selectable units
- **Session** — a phone's anonymous browser session. Not an identity, no name (R10). Stores a
  last-seen timestamp (for R7)
- **Payment** — **two separate amounts**: bill amount and tip (R3). Status: pending / succeeded /
  failed
- **Item lock** — which unit is held by which session, and whether it has been paid

Also:
- Store all amounts as **integers in the minor unit** (no floating point)
- Set up migrations / schema management
- Seed a fixed demo menu (~20 items)

## Out of scope

UI and business logic. Schema and connectivity only.

---

## Acceptance criteria

- [ ] The deployed app connects to the database
- [ ] Every concept above has a representation in the schema
- [ ] A payment's bill amount and tip live in **two separate columns**
- [ ] Amounts are integers in the minor unit
- [ ] The demo menu is in the database
- [ ] Table tokens are unguessable (randomly generated)
