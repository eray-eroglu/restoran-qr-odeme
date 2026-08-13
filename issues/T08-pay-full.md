# T08 — "Pay the whole bill": first end-to-end flow (S4, S5, S6)

**Blocked by:** #4 (T03), #8 (T07)
**Reference:** PRODUCT.md S4, S5, S6, R1, R8; CONTEXT.md D13, D33

---

## Goal

**This issue is the turning point of the project.** When it lands you have an incomplete but
genuinely **working end-to-end product**: scan the QR → see the bill → pay → the table closes.

It starts with the simplest mode (pay in full); the other two modes (T09, T10) sit on top of
this skeleton.

---

## Scope

- **S4 payment screen:** amount due + card form + "Pay" → 3D Secure
  (the tip row is **not** in this issue; it arrives in T11)
- Wire in the payment layer built in T03
- **S5 result:** success (receipt at a **permanent URL**) / failure (error + try again)
- **S6 bill fully paid:** when the remaining balance hits 0, everyone's screen moves here

## Critical rules

- **R8 — Payment verification is server-side.** A share counts as paid only after the server
  confirms with iyzico. Even if the guest never returns from the 3D Secure page, the share must
  resolve correctly.
- **R1 — Balance rule.** `Remaining balance = current total − amount paid`. The table closes
  **only** at zero.
- Table closing is automatic; nobody presses a button.

---

## Acceptance criteria

- [ ] The same table is open on two phones; when one pays, the other updates within ~5s
- [ ] On completion the table closes automatically and both phones show S6
- [ ] The receipt URL still works after being closed and reopened
- [ ] After a failed payment the guest can retry and the table is unaffected
- [ ] **If the browser is closed on the 3D Secure screen:** the table still resolves as paid
- [ ] If an item is added from the admin console mid-payment, the remaining balance grows and
      the table does not close
