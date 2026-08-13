# Restaurant QR Payment — CONTEXT

> The single source of truth for **decisions made** and **why**.
> Final output: [PRODUCT.md](PRODUCT.md) — the locked v1 product definition.
> Last updated: 2026-08-13. **All rounds complete; no open questions.**

---

## 1. One-paragraph summary

Every table has a QR code. Guests scan it, see the table's current bill **without installing
an app**, and pay one of three ways: the whole bill, an equal split by headcount, or only the
items they consumed. Everyone pays independently; the table closes when the bill is fully paid.

---

## 2. Decisions

### D1 — Market: Turkey / Istanbul
First market Turkey, Istanbul-weighted. Regulation (certified fiscal registers, mandatory
fiscal receipts) and the POS ecosystem are designed around this.

### D2 — Scope: payment only (v1)
v1 is **payment only**. Ordering is out of scope.
Path: **v1 payment → v1.5 menu browsing → v2 ordering via QR**.

### D3 — Target segment: flexible, large-table venues
The segment is not locked; it can be sold to anyone who needs it. But the product is designed
around **venues with large tables** (taverns/bars/brunch/pubs), where the bill-splitting pain
is highest.

### D4 — Bill source: manual in v1, POS integration in v2
No POS integration in v1. Rationale: keep cost low, ship fast, test whether restaurants accept
the product at all.
**Accepted risk:** double data entry. How to mitigate it → see D10.

### D5 — Money flow: direct model (the restaurant's own merchant account)
Money never passes through us. Each restaurant opens **its own** merchant account with a
provider (iyzico/PayTR); payment goes straight to the restaurant. We only drive the flow.
Rationale: since revenue is subscription-based, there is no need to deduct commission — which
removes the only real advantage of being an aggregator. Zero regulatory burden, no payment
institution licence required.
**Accepted cost:** merchant onboarding per restaurant (1–3 days). At 10+ restaurants, a
marketplace / sub-merchant model gets reconsidered.

### D6 — Revenue model: monthly subscription *(superseded in status by D35)*
Fixed monthly subscription per venue. No transaction commission.
Sales argument: **table turnover**, not commission savings.

### D7 — Tips: optional, on the payment screen
A "leave a tip" option on the payment screen. Not mandatory.
Whether the tip goes to the server or into a pool is **the venue's own decision**; the product
exposes it as a setting and does not manage distribution.

### D8 — Team and goal: solo developer, simplest possible v1
One person. Goal: the simplest working version that measures whether restaurants would adopt
this. Complexity comes later.

### D9 — Fiscal receipts: digital receipt in v1, fiscal receipt stays with the restaurant
v1 shows a **digital receipt** (not a legal document). The fiscal receipt is issued by the
restaurant's certified register as usual. **Per-person fiscal receipts are out of scope for
v1** and arrive in v2 with POS integration.

### D10 — No restaurant side in v1; the developer creates the bill
**Reframing:** v1 is not a restaurant product, it is a **guest-experience validation tool**.
The developer will test it with a group of friends. So v1 has no POS integration, no server
panel, and no double-entry problem; the developer enters the bill from a simple console.
How the restaurant side works (integration vs manual panel) gets decided **when the first pilot
restaurant is found** — at which point which POS they run is also known.
Target state (v2+): the server enters data once, integrated with the kitchen/POS.

### D11 — Identity: fully anonymous, no names
No name or nickname is requested. Coordination at the table is left to the people at it.
No SMS verification, no accounts, no app. *(Revised by D23: no email either.)*

### D12 — Concurrency: per-unit locking
When a guest adds a unit to their share, that unit locks for everyone else. "2x Köfte" behaves
as two separately selectable units. v1 has **no splitting of a single item across people** (v2).
Locks must expire.

### D13 — Balance rule (the most critical rule in v1)
> **Paid amounts are never reversed. The bill may grow during payment.
> Remaining balance = current total − amount paid. The table closes only at zero.**

### D14 — Payment: cards only, 3D Secure mandatory
Cards only, 3D Secure required. No Apple Pay / Google Pay (not widespread in Turkey). A failed
3D Secure attempt releases any locked items.

### D15 — QR: permanent table QR + session gating
One permanent QR per table carrying an **unguessable random token** (`/t/<token>`; never a
guessable value like "table-7"). The server checks whether the table has a bill open for
payment; if not, it shows the empty state. Closing the table kills the link; opening a new bill
revives the same QR.

### D16 — v1 success criterion
> **A group of friends (4–5) completes splitting and paying quickly with no help from the
> developer, and afterwards reports being happy (short survey).**

This criterion arbitrates scope: if it holds without a feature, that feature is out.
Next step after v1: put it in front of real restaurants.

### D17 — Payment: sandbox (test mode)
No real money in v1. The provider's test environment is used; the full flow including 3D Secure
works end to end with test cards.
Consequence: company registration and merchant onboarding are **deferred to the first pilot
restaurant**.

### D18 — Bill setup: fixed menu + tap to add + sample table
A small fixed demo menu (~20 items). The developer builds a table by tapping items. A
**"Create sample table"** button produces a pre-filled table in one click (for repeat testing).
This console is used only by the developer; it needs no visual polish.

### D19 — Split equally: the first guest sets the headcount
The first guest to arrive sets the number of people; it is fixed to the table and cannot change
after the first payment. The system does not need to know who paid — **counting paid shares is
enough**. Everyone sees "2 of 3 shares paid · 160.00 TL remaining".
Guests joining late are **out of scope** (if the bill is being paid, people are leaving).

### D20 — Split mode is locked table-wide (v1)
One mode per table, chosen once: **pay in full / split equally / pick my items**. Changeable
**until the first payment**, then locked. Mixed modes are **out of scope for v1** — reconsidered
in v2/v3.

### D21 — Table closing and unpaid remainder
The table closes automatically **only at zero remaining balance**. Two escape routes exist in v1:
1. **"I'll cover the rest"** — anyone at the table can take on the entire remaining balance.
2. **Manual close (escape hatch)** — the remainder is treated as collected another way
   (cash/terminal) and the table is closed from the admin console.

The product only cares whether the bill closed; how it closed is flexible.

### D22 — Tips are in v1
A **single row** on the payment screen: 5% / 10% / 15% / None. Nothing preselected, skippable,
not a separate screen. Distribution is not the product's problem (see D7).

### D23 — Receipt: on screen only, permanent URL. No email.
The receipt is shown on screen at a permanent URL (screenshot or keep the link). **No email in
v1.**
→ This revises D11: **v1 collects nothing from the guest** — no name, no email, no phone. Zero
form fields. That feeling is exactly what is being tested.

### D24 — Updates: polling, server as referee
No realtime connection (WebSocket/SSE). Polling: ~1.5s on the item-selection screen, ~5s
elsewhere; plus an immediate refresh after the guest's own action and on tab refocus.
**Rule: the server owns the lock.** The UI is optimistic (your own action shows instantly); if
the server rejects, the guest is told someone just took it.
Rationale: the delay only applies to seeing *other people's* actions, which is imperceptible for
people sitting at the same table. The same-instant race exists with a realtime connection too;
what solves it is the server being the referee.

### D25 — Undo and lock expiry
A guest can undo a selection at any time. If a phone does not reach the server for ~60 seconds
(page closed, screen locked), that session's **unpaid** selections are released. Polling doubles
as the "I'm still here" signal, so no separate timer is needed. **Paid** selections are never
released (D13).

### D26 — Admin console: definition and protection
Because v1 has no restaurant or server, the **admin console** is the developer's management
screen: create table · add items by tapping the demo menu · create sample table · open table
for payment · show the table's QR link · close table manually (D21 escape hatch).
It is served from the **same domain** as the guest site, so it is protected by a **single shared
password** in an environment variable. No user accounts.
This console is the seed of the future restaurant panel.

### D27 — Interface language: Turkish only
v1 ships in Turkish. But **all UI strings live in one file**, never inlined in components, so
adding English later is a file copy rather than a code sweep.

### D28 — v1 screen inventory: 9 screens
Six on the guest side, three on the admin side. Full list in PRODUCT.md section 6.
"Number of people" and "bill fully paid" may be designed as states of the bill screen rather
than separate screens.

### D29 — Stack: Next.js + Postgres + Vercel
One codebase (guest site + admin console), one deploy, HTTPS out of the box.
Deciding constraints: the 3D Secure return needs a public HTTPS URL (so the project must be
live from day one; the friend test cannot run on localhost), and several phones sharing one
table means a real database is mandatory.

### D30 — Payment provider: iyzico (sandbox)
Test account opened by email (`sandbox-merchant.iyzipay.com/auth/register`), API keys from the
panel, test cards — no company or merchant application needed for sandbox. Moving to real money
stays with the same provider.
**Rule:** all payment code sits behind a single layer, so swapping providers touches one place.

### D31 — Share calculation and rounding remainder (single rule)
> **Payment amount = remaining balance ÷ number of unpaid shares (rounded to the minor unit).
> The last remaining share is the entire remaining balance.**

One rule covers three things: the rounding remainder (100 ÷ 3) always lands on the last payer
and the table always reaches zero; a bill that grows mid-payment recalculates shares by itself;
"I'll cover the rest" is a special case of the same rule.

### D32 — Tips are independent of the balance
Every payment carries two separate numbers: **bill amount** and **tip**. Only the bill amount is
deducted from the remaining balance. Table closing ignores tips. Both are shown separately on
the receipt and in the admin console.

### D33 — Payment verification is server-side
> **A share counts as paid only after the server confirms it with the payment provider.**

Anything returned by the browser is only a trigger to go and check. Even if the guest never
returns from the 3D Secure page, the share resolves correctly and the table closes properly.

### D34 — No refunds in v1
Refund flows are out of scope (no real money in sandbox). Mistakes are handled by closing the
table manually (D21). When real money starts, refunds and disputes get designed separately — at
which point "who is allowed to refund" becomes a serious authorization design.

### D35 — Revenue model deferred; subscription remains the default
D6 is now **provisional**. Pricing gets locked **after the first three restaurant conversations**;
until then the default is a monthly subscription. Rationale: deciding price with zero restaurant
conversations means copying competitors, not reading data.
Note: of the known competitors one uses commission and one uses subscription, so subscription is
not unproven in this market.

### D36 — Positioning: deliberately narrow
v1 stays payment-only (D2 upheld). But that is positioning, not a gap:

> **"We don't change anything you do. We just delete the bill-closing round trip."**

Competitors ask restaurants to change how they operate; this product does not, so the commitment
asked for is smaller and "yes" is easier. **Ordering will definitely ship in v2** (pulled forward
from v3), but the positioning message stays.

### D37 — Defensibility: experience first, partnership later
Priority is **experience**: POS vendors' DNA is back office, not front end — a genuinely good
guest experience is the thing they cannot copy. That is already the v1 success criterion (D16).
If the product gains attention later, **partnership**: position as the payment layer POS vendors
do not want to build, rather than as their competitor.

---

## 3. v1 design principle (explicit user requirement)

**The first version must be as simple as possible.** A solo developer testing with friends; if
they find it easy and comfortable, the next step is talking to restaurants. Therefore the
default answer to any feature question is "not in v1", and the burden of proof is on including it.

---

## 4. Competition (as of 2026-08-11)

| Competitor | What they do | Revenue model |
|---|---|---|
| **HesApp** | QR bill splitting/payment. Founded ~2 months ago, low visibility. | **1.75% transaction commission** |
| **Alman Hesabı** (almanhesabi.com) | QR **ordering + bill splitting**. Has press coverage. | **Subscription** (2,500–5,000 TL price anchor) |
| **QRPay** (qrpaytr.com) | **Near-identical positioning**: permanent table QR, equal/per-item/custom-amount splitting, POS-independent. Same sales arguments (table turnover, tips). | Unknown |
| **HesapPOS, YemeQr, Tabpad, Meniyo, …** | POS and QR-menu vendors; bill splitting and QR menus already exist. | — |

**Reading:** this is not a young two-competitor market, it is a **crowded** one. Competitors
existing is not bad news (it proves the problem is real), but two things must be accepted:
1. Nobody has won yet — they all appear to be at the website stage.
2. **The real threat is not the startups, it is the POS vendors.** Adisyo/Simpra/HesapPOS could
   ship this as a feature in a quarter and bundle it free with the POS.

**To do before writing code (~2 days):** find out whether these competitors have **any real
restaurants using them** (references, venue photos, Instagram tags, Google reviews). A company
with a website and a company earning revenue are different things. This directly affects the
pricing decision.

---

## 5. Status

**No open questions.** The product definition lives in `PRODUCT.md`, the design request in
`DESIGN-BRIEF.md`, and the work breakdown in `issues/`.
