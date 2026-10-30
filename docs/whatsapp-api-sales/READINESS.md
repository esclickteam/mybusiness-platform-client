# WhatsApp API launch readiness (test env)

Date: 2026-10-30 (Asia/Jerusalem). No merge, no production deploy, no live Lemon charge, no WhatsApp send.

## Product repo

Branch `cursor/whatsapp-api-sales-62be` was rebased onto `origin/main` (`b60faa3`, includes PR #982 automation-basic). File overlap with that main commit: none. Merge-tree vs current main is clean.

Price remains `$29/month` per connected number (`PRICE_PER_NUMBER_USD = 29`). Signup is still Get Started → existing Google/Microsoft/email → Lemon Squeezy. Connection is still Meta Embedded Signup on WhatsApp → Connection.

Tests below ran in the original clone (`/tmp/bizuply-main` tracking `esclickteam/mybusiness-platform-client`), not a file-copy tree.

Push of this branch by `cursor[bot]` is still **403**. Open the product PR from an account with write access after applying the BeautyFlow bundle:

```bash
docs/whatsapp-api-sales/apply-to-mybusiness.sh /path/to/mybusiness-platform-client
git -C /path/to/mybusiness-platform-client push -u origin cursor/whatsapp-api-sales-62be
```

Do not merge to production without explicit approval.

## Preview

Local (this run, Vite on 127.0.0.1:3000, API proxy to a dead 59999 host so production is not called):

- http://127.0.0.1:3000/whatsapp-api/
- http://127.0.0.1:3000/whatsapp-api/guides
- http://127.0.0.1:3000/whatsapp-api/pricing
- http://127.0.0.1:3000/whatsapp-api/help
- http://127.0.0.1:3000/whatsapp-api/get-started

Production (unchanged until the product branch is deployed):

- https://whatsapp.bizuply.com/
- https://whatsapp.bizuply.com/guides (404 until this branch is live)
- https://whatsapp.bizuply.com/pricing
- https://whatsapp.bizuply.com/help
- https://whatsapp.bizuply.com/get-started

Hebrew is the language switcher, not `/he` (that URL 404s by design).

## Funnel test (no live charge, no send)

`node scripts/qa-whatsapp-api-funnel.mjs`

- Intercepts `signup-checkout`, Lemon Squeezy, OAuth start, and Facebook/WhatsApp graph URLs with HTTP 409 `TEST_BILLING_BLOCKED`.
- Result: **27/27 PASS**. Signup POST was issued to the local dead API (`POST http://127.0.0.1:59999/api/whatsapp-api/signup-checkout`) and blocked. Lemon checkout never opened. Meta Embedded Signup never opened. No template send.
- Saved: `docs/whatsapp-api-sales/funnel-qa.json`
- Vitest copy/funnel tests: 27 passed in 3 files (landing, host SEO, setup steps).

Connection after pay was not driven live: that step is the existing portal Embedded Signup. Opening it would hit Meta. The Connection test CTA and first-message step now point at `/connection`, not Developers.

## Copy vs shipped product

| Claim | Matches product |
| --- | --- |
| $29/month per connected number | Yes. Unchanged. |
| Meta messaging billed separately to the WABA | Yes. Pricing calculator + Help “What does Meta charge separately?” |
| No trial | Yes. |
| Existing signup + Lemon + Embedded Signup | Yes. Not rebuilt. |
| REST API, signed status webhooks, templates, inbox, dashboard | Yes. |
| Replies on webhooks | **No — copy now says not yet.** Replies stay in the Bizuply inbox. |
| Agency console / one screen for every client number | **Not shipped.** Copy says so. |
| CRM connectors out of the box | **Not shipped.** REST/middleware only. |
| Connection test send | Real send; Meta may charge. QA did not run it. |

## Prospects

200 rows in `prospects-enriched.json` / `.csv`.

- LinkedIn company pages mapped: 200/200 (company slug, not a person).
- Public business emails: 12 (only listed addresses).
- Public phone: 1 (Makeitfuture).
- Personalized English message per row using that company’s `why` + segment.
- `doNotMailUntilApproved: true`. Nothing was sent.

Segments: 70 automation agencies, 50 WhatsApp implementers, 30 sales teams, 50 high-volume inboxes.

## Not done (needs your approval)

- Push/PR on `mybusiness-platform-client` if this bot still has 403
- Merge or production deploy
- Live Lemon billing
- Any outbound email/LinkedIn/WhatsApp
