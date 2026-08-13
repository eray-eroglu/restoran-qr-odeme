# Work Breakdown (v1)

The v1 definition in `PRODUCT.md`, split into individually buildable pieces.
These files mirror the GitHub issues — issue `#N` corresponds to `T(N-1)`.

## How to work through this

- **Do not start an issue whose blockers are still open.** Each issue states its blockers.
- **One issue per session.** Clear the context between issues; each issue is self-contained and,
  read alongside `PRODUCT.md`, is enough on its own.
- Labels carry the status: `status: ready` · `status: in-progress` · `status: blocked`.
  Extra tags: `owner: human` · `high-risk`.

## Order and dependencies

```
#1 T00 ─ #2 T01 ─┬─ #4  T03 ──────────────────────┐
                 ├─ #3  T02 ─┬─ #6 T05 ─ #7 T06 ─ #8 T07 ─┴─ #9 T08 ─┬─ #10 T09 ─┐
                 └─ #5  T04 ─┘                                        ├─ #11 T10 ─┼─ #14 T13
                                                                      ├─ #12 T11 ─┤
                                                                      └─ #13 T12 ─┘
```

**#9 (T08) is the milestone:** at that point you have an incomplete but genuinely working
end-to-end product.

## List

| Issue | Title | Blocked by | Owner |
|---|---|---|---|
| [#1](../../../issues/1) | [T00 — Account setup](T00-accounts.md) | — | **You** |
| [#2](../../../issues/2) | [T01 — Project skeleton and first deploy](T01-skeleton.md) | #1 | Agent |
| [#3](../../../issues/3) | [T02 — Data model and schema](T02-data-model.md) | #2 | Agent |
| [#4](../../../issues/4) | [T03 — Payment vertical slice](T03-payment-vertical-slice.md) | #2 | Agent |
| [#5](../../../issues/5) | [T04 — Admin console: password gate](T04-admin-auth.md) | #2 | Agent |
| [#6](../../../issues/6) | [T05 — Admin console: table list](T05-admin-table-list.md) | #3, #5 | Agent |
| [#7](../../../issues/7) | [T06 — Admin console: table detail](T06-admin-table-detail.md) | #6 | Agent |
| [#8](../../../issues/8) | [T07 — Bill screen and polling](T07-bill-screen.md) | #3, #7 | Agent |
| [#9](../../../issues/9) | [T08 — Pay the whole bill (end-to-end)](T08-pay-full.md) | #4, #8 | Agent |
| [#10](../../../issues/10) | [T09 — Split equally](T09-split-equally.md) | #9 | Agent |
| [#11](../../../issues/11) | [T10 — Item selection and locking](T10-item-selection.md) | #9 | Agent |
| [#12](../../../issues/12) | [T11 — Tips and receipt](T11-tip-and-receipt.md) | #9 | Agent |
| [#13](../../../issues/13) | [T12 — Edge cases and escape hatches](T12-edge-cases.md) | #9 | Agent |
| [#14](../../../issues/14) | [T13 — Real-device testing and polish](T13-device-testing.md) | #10–#13 | Agent + **You** |
