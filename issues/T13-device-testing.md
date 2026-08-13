# T13 — Real-device testing and polish

**Blocked by:** #10 (T09), #11 (T10), #12 (T11), #13 (T12)
**Owner:** Agent + **you** (the real test is yours)
**Reference:** PRODUCT.md section 2 (success criterion); CONTEXT.md D16

---

## Goal

Be sure it works in your own hands **before** the friend test.

---

## Scope

**1. Multi-device dry run**
Using every phone/browser you have (at least 3 separate sessions), split and pay a table end to
end. Try all three modes separately.

**2. Real conditions**
- Try it on a slow connection (mobile data, wifi off)
- Lock the screen and come back two minutes later (R7 lock release)
- Press back and close the browser on the 3D Secure screen (R8)
- Try a 12-item bill — do the primary buttons disappear?

**3. Polish**
- Fill in whatever the wireframes call for and the build missed
- Verify all copy lives in the single strings file (D27)
- Verify amounts are formatted identically everywhere (`1,960.00 TL`)

**4. Friend-test preparation**
- Keep the iyzico test card number somewhere legible
- Prepare the QR to put on the table (printed or on screen)
- **Short survey:** 3–4 questions. "Did you get stuck anywhere?", "Would you use it again?",
  "Was anything unclear?"
- During the test, **do not help and do not talk** — the success criterion is completion
  *without help*

---

## Acceptance criteria

- [ ] All three modes work end to end across 3 devices
- [ ] Usable on a slow connection
- [ ] Primary buttons stay reachable with a long bill
- [ ] No run left a table stuck
- [ ] Test card, QR and survey are ready
