# T07 — Bill screen and polling (S1)

**Blocked by:** #3 (T02), #7 (T06)
**Reference:** PRODUCT.md S1 (all three states), R1, R4, R9, R10; CONTEXT.md D24
**Design:** the S1 wireframe

---

## Goal

The main guest screen that opens on scanning the QR. The heart of the product.

---

## Scope

The `/t/<token>` route, with all three states handled separately:

- **S1-a — No open bill:** "There is no open bill at this table right now." Nothing else.
- **S1-b — Bill open, no mode chosen:** bill items plus the three mode buttons
  (*Pay the whole bill* · *Split equally* · *Pick my items*)
- **S1-c — Mode chosen:** bill items plus progress ("2 of 3 shares paid · 160.00 TL remaining")
  plus the guest's own action button

Also:
- **Split mode applies table-wide** (R4). Changeable until the first payment succeeds, then locked
- **Polling** (D24): ~5s on this screen; plus an immediate refresh after the guest's own action
  and **on tab refocus**
- Polling doubles as the session's "I'm still here" signal (updates last-seen for R7)
- An anonymous session cookie is created — **no name, no email, no fields at all** (R10)

## Out of scope

The payment flow (T08), item selection (T10), equal split (T09).
Mode buttons may render here without leading anywhere yet.

---

## Acceptance criteria

- [ ] The QR link opens on a phone and shows the correct bill and total
- [ ] All three states (a/b/c) render under the right conditions
- [ ] Adding an item from the admin console updates the guest screen within ~5s, unprompted
- [ ] Switching tabs and coming back refreshes immediately
- [ ] Refreshes do not cause a "loading" flash; numbers update calmly
- [ ] There are no form fields anywhere
- [ ] Closing the table drops the link to state S1-a
