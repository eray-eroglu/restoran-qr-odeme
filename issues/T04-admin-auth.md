# T04 — Admin console: password gate (S7)

**Blocked by:** #2 (T01)
**Reference:** PRODUCT.md S7; CONTEXT.md D26

---

## Goal

Protect the admin console with a single shared password.

## Why it is needed

The admin console lives on the **same site** your friends connect to. Anyone who sees the URL
could delete a table or close a bill. You will be opening this console right next to them
during the test.

---

## Scope

- Every page under `/admin` is protected
- A single-field password screen; the password lives in an environment variable (`ADMIN_PASSWORD`)
- On success the session is held in a cookie, valid until the browser closes

## Out of scope

User accounts, sign-up, password reset, roles. **None of it.**

---

## Acceptance criteria

- [ ] Visiting `/admin` without a session shows the password screen
- [ ] The correct password grants access; a wrong one is rejected
- [ ] The password is in an environment variable, not in code
- [ ] The guest side (`/t/<token>`) is **unaffected** by this gate
