# Design Request — v1 Wireframes

> Hand this over **together with** `PRODUCT.md`. PRODUCT.md says what the product is; this file
> says what is being asked for right now.

---

## What is being asked for

**Low-fidelity wireframes** of the 9 screens listed in `PRODUCT.md` section 6.

At this stage there is **no** request for a colour palette, typography, branding, icon set or
illustration. The only thing wanted is: **what information is on each screen, what matters most,
and which button the guest presses.** Grey boxes and real copy are enough.

---

## Constraints

- **Mobile first.** Guest screens (S1–S6) at 390px wide, portrait, usable **one-handed**. The
  primary action button sits within thumb reach at the bottom of the screen.
- **Used at a table, in a crowd, in a hurry.** The guest is not studying the screen, they are
  trying to understand it at a glance. Numbers must be large and unambiguous.
- **No sign-up, no forms.** Apart from card details there are no input fields at all
  (`PRODUCT.md` R10). Do **not** add name, email or phone fields.
- Admin screens (S7–S9) are desktop, functional, no visual ambition. **Do these last.**

---

## The two screens that matter most

The other seven are easy; these two decide whether the product works:

### S1 — Bill screen, information hierarchy
Four pieces of information compete: **bill items**, **total**, **remaining balance and
progress**, **mode buttons**. They are not equally important.

The expectation: in the first second, the guest should be able to answer **"how much am I
paying?"** — bill items come second, as reference. Treat that as a proposal and **try a few
alternative hierarchies**; the point is to see which one reads fastest.

### S3 — Item selection, three states
Each unit has three states that must be distinguishable **at a glance**:
**available** · **taken by someone else (locked)** · **paid**.

Locked items show **no name** (the system knows nobody), just "taken". These three states must
read clearly even in a wireframe — without colour, using form and texture alone.

---

## Draw the unhappy paths too, not just the happy one

This is what wireframes most often skip. These states are all required, separately:

| State | Where |
|---|---|
| No open bill at this table | S1-a |
| Bill open, no mode chosen yet | S1-b |
| Mode chosen, others still paying | S1-c |
| "Someone just picked this item" | S3 — soft information, not an error |
| Payment failed | S5 |
| Bill fully paid | S6 |

---

## Use this sample content

Draw with real content rather than empty boxes — hierarchy can only be tested with real copy.

**Table 7 — Bill**
- 2x Adana Kebap — 960.00 TL
- 1x İçli Köfte — 220.00 TL
- 3x Ayran — 135.00 TL
- 2x Efes (50cl) — 380.00 TL
- 1x Künefe — 265.00 TL

**Total: 1,960.00 TL** · Paid: 653.33 TL · **Remaining: 1,306.67 TL**
Progress: *1 of 3 shares paid*

---

## Deliverable

First, **2–3 alternatives for S1**. Once that is settled we move on to the rest — do not draw
all nine at once, because S1's hierarchy will drive the others.
