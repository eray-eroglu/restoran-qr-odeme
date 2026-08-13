# Product Definition — Restaurant QR Bill Splitting & Payment (v1)

> This is the **locked v1 definition**, ready to hand to design and development.
> For the reasoning behind each decision, see [CONTEXT.md](CONTEXT.md).
> Date: 2026-08-13

---

## 1. What this is

Every table in the restaurant has a permanent QR code. Guests scan it with their phones —
**no app to install, no sign-up, no information to enter** — see the table's current bill, and
pay it in one of three ways:

1. **Pay the whole bill**
2. **Split equally by number of people**
3. **Pick the items they personally consumed and pay for those**

Each guest pays their own share independently from their own phone. When the bill is fully
paid, the table closes automatically.

**The problem it solves:** closing the bill at a crowded table. The server carries the card
terminal to the table over and over, everyone hands over a card in turn, the "who ate what"
negotiation drags on, and the table doesn't turn over for 15–20 minutes. This product removes
that round trip entirely.

**Who it is sold to (later):** sit-down venues with large tables — taverns, bars, brunch
places, pubs. Revenue model is a **monthly subscription per venue**; no transaction
commission. The sales argument is not saved commission, it is **table turnover**.

**Market:** Turkey, starting with Istanbul.

**Positioning (deliberate):** Most competitors ask the restaurant to change how it operates —
move your ordering flow, drop your POS, learn a new system. This product does not:

> **"We don't change anything you do. We just delete the bill-closing round trip."**

Looking narrower on a feature list is intentional; it shrinks the commitment asked of the
restaurant and makes "yes" easier. (Ordering arrives in v2, but this positioning stays.)

---

## 2. What v1 is trying to prove

**v1 is not a restaurant product.** It is a tool for validating the guest experience, tested
by the developer with their own group of friends. There is therefore no restaurant, no server,
and no POS in v1.

**Success criterion:**

> A group of friends (4–5 people) can split and pay the bill quickly, **with no help from the
> developer**, and afterwards say they were happy with the experience.

This criterion arbitrates every scope argument: **if the criterion is still met without a
given feature, that feature does not go into v1.** The primary design goal is speed and
clarity; visual ambition is secondary.

**The step after v1:** put the product in front of real restaurants and collect their feedback.

---

## 3. Glossary

| Term | Definition |
|---|---|
| **Table** | A physical table. Owns a permanent, unchanging QR code. |
| **Bill** | The item list and total belonging to a table. One table sees many bills per day. |
| **Session** | A browser session started when someone scans the QR. Not an identity; anonymous. |
| **Share** | The amount one person commits to paying. |
| **Split mode** | One of the three methods, chosen once per table. |
| **Remaining balance** | Current total − amount paid. The table's closing condition. |
| **Receipt** | The digital proof shown after payment. **Not a fiscal receipt.** |
| **Fiscal receipt** | The legally required document, issued by the restaurant's own certified register. |
| **Admin console** | Because there is no restaurant in v1, this is where the developer creates tables and bills. |

---

## 4. Actors

- **Guest** — a person sitting at the table, on mobile web. No sign-up, no name, no app.
- **Developer (stands in for the restaurant in v1)** — creates the table and bill from the
  admin console.

---

## 5. End-to-end scenario

1. The developer creates a table in the admin console, adds items by tapping them from the
   demo menu, and **opens the table for payment**.
2. The first guest scans the QR. The **bill screen** opens: bill items, total, three mode
   buttons.
3. The first guest picks a mode. That mode applies **to the whole table**; it can be changed
   until the first payment goes through, then it locks.
4. Everyone else scans the QR and sees the same table, in the same mode, with live progress.
5. Each guest pays their share (3D Secure). Whoever pays sees a receipt.
6. When the remaining balance hits 0, the table **closes automatically** and everyone's screen
   moves to "bill fully paid". From that moment the QR shows "no open bill at this table".

---

## 6. Screens (9 total in v1)

### Guest side — mobile web, portrait, one-handed

#### S1. Bill screen
The screen that opens on scanning the QR. Guests return here repeatedly; this is the heart of
the product.

**Content:** bill items (name, quantity, amount) · total · **amount paid and remaining
balance** · progress indicator · split mode selection.

**States:**
- **S1-a — No open bill:** "There is no open bill at this table right now." Nothing else.
- **S1-b — Bill open, no mode chosen:** bill items plus three large buttons:
  *Pay the whole bill* · *Split equally* · *Pick my items*
- **S1-c — Mode chosen, payment in progress:** bill items plus progress
  ("**2 of 3 shares paid** · 160.00 TL remaining") plus the guest's own action button
  ("Pay my share" / "Pick my items" / "I'll cover the rest").

**Note:** this screen refreshes itself every ~1.5–5 seconds, so other people's payments and
selections appear to flow in live. That flow must feel calm — numbers should not jump and
refreshes must not read as "loading".

#### S2. Number of people
Shown **only** when **"Split equally"** is chosen, and **only to the first guest**. One
question: "How many people are at the table?" The number is fixed to the table and cannot be
changed once the first payment succeeds. Later guests never see this screen.

*May be designed as a step inside S1 rather than a separate screen.*

#### S3. Item selection
Only in **"Pick my items"** mode. Every unit on the bill is individually selectable ("2x
Köfte" behaves as two separate rows).

**Each unit has three states, and they must be unmistakably distinct:**
- **Available** — tappable
- **Taken by someone else (locked)** — not tappable; no name shown, just "taken"
- **Paid** — permanently closed

Live running total and a "Pay" button at the bottom. A guest can undo a selection at any time.

**Conflict case:** if two people tap the same unit at almost the same moment, the second one
sees a polite message: *"Someone just picked this item."* This is not an error, it is a normal
occurrence — and it should be designed that way (soft information, not a red error).

#### S4. Payment
**Content:**
- Amount due (large, unambiguous)
- **Tip row:** 5% / 10% / 15% / None — a single row, nothing preselected, skippable.
  Selecting one updates the total immediately.
- Card form (number, expiry, CVC)
- "Pay" → redirect to 3D Secure

The total is always shown as two explicit numbers: **bill share** and **tip**.

#### S5. Result
- **Success:** receipt — amount paid, tip, timestamp, table. Its URL is **permanent**; the
  guest can screenshot it or keep the link. Below it, the table's current state
  ("160.00 TL remaining") and a way back to the bill screen.
- **Failure:** what happened, in plain language, plus "Try again". Any selected items are
  released.

> **Legal note:** this is a **receipt, not a fiscal receipt.** That must be clear on screen;
> the fiscal receipt is issued by the restaurant's own register.

#### S6. Bill fully paid
When the remaining balance reaches 0, everyone's screen moves here: "The bill is fully paid.
Thank you."

*May be designed as a state of S1 rather than a separate screen.*

---

### Admin side — the developer's console, desktop/tablet

These three screens have no visual ambition; being functional and fast is enough. They are the
seed of the future restaurant panel.

#### S7. Password entry
A single field, one shared password held in an environment variable. No user accounts, no
sign-up, no password reset.

#### S8. Table list
Open tables; each row shows total, paid, remaining balance and split mode. At the top:
**"New table"** and **"Create sample table"** (produces a pre-filled table in one click, for
repeat testing).

#### S9. Table detail
- Add/remove items by tapping the demo menu
- **Open table for payment**
- **Show the QR link** — both as a URL and as a scannable QR image on screen
- Payment breakdown: **bill share and tip listed separately** for each payment
- **Close table manually** (escape hatch — the remaining balance is treated as collected by
  other means)

---

## 7. Business rules (firm, non-negotiable)

**R1 — Balance rule.**
Paid amounts are never reversed. The bill may grow while payment is in progress.
`Remaining balance = current total − amount paid`.
The table closes automatically **only when the remaining balance is 0**.

**R2 — Share calculation and rounding remainder.**
`Payment amount = remaining balance ÷ number of unpaid shares` (rounded to the minor unit).
**The last remaining share is the entire remaining balance.**
This single rule handles rounding remainders (100 ÷ 3), a bill growing mid-payment, and
"I'll cover the rest" all at once.

**R3 — Tips are independent of the balance.**
Every payment carries two separate numbers: the bill amount and the tip. **Only** the bill
amount is deducted from the remaining balance. Table closing ignores tips.

**R4 — Split mode is locked table-wide.**
One mode applies to the whole table. It can be changed until the first payment succeeds, then
it locks. Mixing modes (some split equally, some pick items) is **not possible** in v1.

**R5 — The first guest sets the number of people.**
In split-equally mode the count is entered by the first guest and fixed to the table; it cannot
change after the first payment. The system does not know *who* paid — it **counts how many
shares are paid**.

**R6 — The server owns the lock.**
Item selection appears instantly in the UI (optimistic), but the real lock lives on the server.
If the server rejects a second selection, the guest is told someone just took it.

**R7 — A silent session loses its locks.**
If a phone does not reach the server for ~60 seconds (page closed, screen locked), that
session's **unpaid** selections are released. **Paid** selections are never released.

**R8 — Payment verification happens server-side.**
A share counts as paid only after the server has confirmed it directly with the payment
provider. Anything coming back from the browser is only a trigger to go and check. Even if the
guest never returns from the 3D Secure page, the share resolves correctly.

**R9 — The QR is permanent, its content is not.**
The QR points at a fixed URL: `/t/<unguessable-random-token>`. Guessable values like "table-7"
are **not used**. The server checks whether the table has a bill open for payment; if not, it
shows S1-a. When the table closes the link goes dead, and it comes back to life with the next bill.

**R10 — Zero form fields.**
v1 collects no personal information at all: no name, no email, no phone, no sign-up, no SMS
verification. The only thing a guest ever types is card details.

---

## 8. Explicitly OUT of scope for v1

These are not oversights — they are **deliberate exclusions**. The design must contain no
screen, button, or placeholder for them.

| Out of scope | When |
|---|---|
| Ordering via QR | v2 |
| Menu browsing | v1.5 |
| POS / bill-system integration | v2 |
| Per-person fiscal receipts | v2 (together with POS integration) |
| Restaurant / server panel | With the first pilot restaurant |
| Real money (sandbox is used) | With the first pilot restaurant |
| Receipt by email | v1.5 |
| Refund flow | When real money starts |
| Apple Pay / Google Pay | v1.5 |
| English and other languages | v1.5 |
| Splitting one item across several people (a bottle of wine) | v2 |
| Mixed split modes | v2 / v3 |
| Merging/moving tables, guests joining late | v2 |
| Guest accounts, history, loyalty | Never |

---

## 9. Technical constraints

- **Stack:** Next.js + Postgres + Vercel. Guest site and admin console share **one codebase**
  and one deployment.
- **v1 must be live from day one.** The 3D Secure return requires a public HTTPS URL; the
  friend test cannot run on localhost.
- **A real database is required.** Several phones share one table; state cannot live in memory.
- **Payment provider:** iyzico **sandbox**. The test account is opened with an email address,
  test cards are used, no real money moves, no company registration needed. All payment code
  sits **behind a single layer** so that swapping providers touches one place.
- **Updates:** there is **no** realtime connection (no WebSocket/SSE). Polling: ~1.5s on the
  item-selection screen, ~5s elsewhere; plus an immediate refresh after the guest's own action
  and on tab refocus.
- **Interface language:** Turkish only in v1, but **all UI strings live in a single file** and
  are never inlined in components.
- **Currency:** Turkish Lira. All amounts are stored as integers in the minor unit (kuruş).

---

## 10. Roadmap

| Release | Contents |
|---|---|
| **v1** | This document. Friend test, sandbox, admin console. |
| **v1.5** | Menu browsing · email receipts · English · Apple/Google Pay |
| **v2** | First pilot restaurant: real money, restaurant/server panel, POS integration, per-person fiscal receipts, refunds, item splitting, **ordering via QR** |
| **v3** | Mixed split modes, multi-venue management |

> **Note:** v2 as scoped above is a very large release. Once a pilot restaurant is on board it
> will likely need to be halved (real money + restaurant panel first, then POS integration and
> ordering). That call depends on what the pilot restaurant actually needs.
