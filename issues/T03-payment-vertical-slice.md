# T03 — Payment vertical slice (highest-risk work)

**Blocked by:** #2 (T01)
**Reference:** PRODUCT.md R8, section 9; CONTEXT.md D30, D33

---

## Goal

Complete **one** payment end to end in the deployed environment against the iyzico sandbox,
including 3D Secure, and verify the result **server-side**.

## Why this early

This is the riskiest part of the project. If something blocks here (the 3D Secure return,
sandbox behaviour, card form constraints), the whole plan changes. That needs to surface in
week one, not week six — which is why it comes before the data model.

This is a **vertical slice**: no design, no polished screen, not even a database — just make
the flow work.

---

## Scope

- A bare test page: a fixed **1.00 TL** amount and a "Pay" button
- Initiate payment via the iyzico sandbox
- Redirect to 3D Secure and handle the return URL
- **Server-side verification:** on return, the browser is not trusted; the server asks the
  provider directly for the payment status (R8)
- Show the outcome on screen: success / failure
- All payment integration lives **behind one file/layer** so swapping providers touches one
  place (CONTEXT.md D30)

## Out of scope

Tables, bills, shares, tips, design. None of it.

---

## Acceptance criteria

- [ ] A 1.00 TL payment completes on a real phone against the deployed URL using a test card
- [ ] The 3D Secure screen appears and the return is handled correctly
- [ ] The outcome is determined by **the server asking the provider**, not by anything the
      browser reports
- [ ] Even if the user closes the browser on the 3D Secure screen, the server reports the true
      payment state when asked
- [ ] A failed payment (wrong test card) produces a clean error
- [ ] All provider-facing code is contained in a single layer
