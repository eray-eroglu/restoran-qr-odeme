# T12 — Edge cases and escape hatches

**Blocked by:** #9 (T08)
**Reference:** PRODUCT.md R1, R2, R4; CONTEXT.md D20, D21

---

## Goal

Close off every situation that could leave a table stuck.

## Why this is its own issue

Each of these is small, but **any one of them can stop a table from ever closing**. During the
friend test a stuck table ruins the test itself.

---

## Scope

**1. "I'll cover the rest"**
Anyone at the table can take on the entire remaining balance. A button on S1-c.
This is a special case of R2 — do not write a separate calculation for it.

**2. Split mode lock (R4)**
The mode applies table-wide; changeable **until the first payment succeeds**, then locked.
Changing the mode clears any **unpaid** selections made so far.

**3. Manual table close**
Built in T06; verified end to end here: can a table with a remaining balance > 0 be closed, and
do the guest screens move to S6 when it is?

**4. Bill growing during payment**
Items added from the admin console while payment is in progress. Paid amounts are never
reversed, the remaining balance grows, the table does not close (R1).

**5. The same person paying twice**
A session that has already paid must be able to pay again via "I'll cover the rest".

---

## Acceptance criteria

- [ ] The remaining balance can be paid in one go and the table closes
- [ ] The mode can be changed before the first payment and not after
- [ ] Changing the mode clears unpaid selections and **preserves paid ones**
- [ ] A table with remaining balance > 0 can be closed manually and guest screens move to S6
- [ ] Items added mid-payment increase the remaining balance correctly
- [ ] The same session can pay a second time
- [ ] **No scenario leaves a table stuck in an unclosable state**
