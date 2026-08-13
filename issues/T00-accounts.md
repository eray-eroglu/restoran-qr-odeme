# T00 — Account setup

**Blocked by:** nothing
**Owner:** **You.** These are sign-ups and identity steps; the agent has no access.
**Estimate:** ~1 hour (longer if iyzico approval lags)

---

## Why this comes first

Everything from T01 onward depends on it. And if something unexpected blocks the iyzico side,
you need to find out **today**, not in week six.

---

## Steps

### 1. iyzico sandbox account
- Register with an email address at `https://sandbox-merchant.iyzipay.com/auth/register`
- In the panel, go to **Settings → Company Settings** and copy the **API Key** and **Secret Key**
- Save both (they go into `.env.local` during T01)
- Note the test card numbers from the docs: `https://docs.iyzico.com/on-hazirliklar/sandbox`

> No real money moves and no company/tax number is required. See CONTEXT.md D17, D30.

### 2. Vercel account
- Sign up at `vercel.com` with your GitHub account (free tier is enough)

### 3. GitHub repository — ✅ DONE, nothing for you to do
`https://github.com/eray-eroglu/restoran-qr-odeme` (private) is created and the docs are pushed.

### 4. Database
- Create a free Postgres database at `neon.tech` or `supabase.com`
- Copy the **connection string** and save it

### 5. Domain (optional)
- Vercel provides a free `*.vercel.app` URL, which is enough for v1
- Buy your own domain now if you want one, but it is not required

---

## What you should have at the end

```
IYZICO_API_KEY=...
IYZICO_SECRET_KEY=...
DATABASE_URL=...
```

Have these ready when T01 starts. **Do not paste them into chat** — you will enter them into
`.env.local` yourself during T01.

---

## Acceptance criteria

- [ ] I can log into the iyzico sandbox panel and I have my API keys
- [ ] I have a Vercel account
- [x] GitHub repository is ready
- [ ] I have my Postgres connection string
