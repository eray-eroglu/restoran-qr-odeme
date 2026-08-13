# T01 — Project skeleton and first deploy

**Blocked by:** #1 (T00)
**Reference:** PRODUCT.md section 9 (Technical constraints), CONTEXT.md D29

---

## Goal

An empty Next.js application, **live and reachable over HTTPS**.

## Why this comes first

The 3D Secure return requires a public HTTPS URL. The project therefore has to be **deployed
from day one**; the friend test cannot run on localhost. Leaving deployment to the end means
piling up code you cannot test.

---

## Scope

- Set up a Next.js (App Router) + TypeScript project
- Connect this local repo to the GitHub remote and push
- Connect Vercel, enable automatic deploys
- Create `.env.local` and an `.env.example` template (for the values from T00)
- Make sure `.env.local` is in `.gitignore`
- One line of text on the home page: "Restaurant QR Payment — v1"
- Create a single file for UI strings (`lib/strings.ts`) — per CONTEXT.md D27, copy is never
  inlined in components

## Out of scope

Design, database, payments. Skeleton only.

---

## Acceptance criteria

- [ ] `https://<project>.vercel.app` opens on a phone and shows the text
- [ ] A `git push` triggers an automatic Vercel deploy
- [ ] `.env.local` is not committed; `.env.example` is
- [ ] The strings file exists and the home page text comes from it
