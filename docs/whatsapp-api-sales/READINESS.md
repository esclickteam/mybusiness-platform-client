# WhatsApp API launch readiness (test env)

Date: 2026-10-30 (Asia/Jerusalem). No merge, no production deploy, no live Lemon charge, no WhatsApp send.

## Product repo

Branch `cursor/whatsapp-api-sales-62be` on `mybusiness-platform-client`, PR [#983](https://github.com/esclickteam/mybusiness-platform-client/pull/983).

Price remains `$29/month` per connected number (`PRICE_PER_NUMBER_USD = 29`). Signup is still Get Started → existing Google/Microsoft/email → Lemon Squeezy. Connection is still Meta Embedded Signup on WhatsApp → Connection.

Get Started no longer falls back to the sales-request form when `/whatsapp-api/availability` is slow or down. Self-serve checkout stays on screen unless the server has loaded and explicitly closed it (`selfServe: false` kill switch). Production and staging currently return `selfServe: true`.

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

## Funnel test (mock payment only, no send)

`node scripts/qa-whatsapp-api-funnel.mjs` against local Vite (`VITE_API_PROXY_TARGET=http://127.0.0.1:59999`).

- Signup POST is fulfilled with a mock Lemon URL. The Lemon host is intercepted with a $29 / no-trial / test-mode page. Pay returns to `/whatsapp-api/login` with `checkout=whatsapp_api`. `signup-status` is mocked `ready`.
- OAuth start, Facebook Graph, and live Lemon are never reached. Meta Embedded Signup is not opened. No template send.
- Result: **35/35 PASS** (includes Get Started still self-serve when availability is down, mock checkout $29, activation banner `ready`).
- Saved: `docs/whatsapp-api-sales/funnel-qa.json`
- Vitest: Get Started, auth config, landing copy, host SEO, setup steps, login.

## Server billing (existing `mybusiness-platform-server`, no product PR)

`node --test tests/whatsappApiBilling.mongo.test.js` on current server `main`: **39/39 PASS** after aligning one stale assertion (`User.lemonSubscriptionId` is the platform plan; the WhatsApp Lemon id lives on `WhatsAppApiSubscription`). That assertion was not committed — product behavior was already correct.

Covered with mock Lemon webhooks: signup create, renewal, cancel-until-period-end, resume, payment failure + 7-day grace then block, recovery, expiry, refund, duplicate refund, existing Bizuply plan customers keep WhatsApp without this $29 add-on.

Catalog: `whatsapp_api_monthly` = 2900 USD cents, `trialDays: 0`.

No server code change required for this launch path.

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

- LinkedIn company pages mapped: 200/200.
- Named people from company team/about/press pages: 11 companies (owners, CEOs, BD).
- Public person LinkedIn URLs: 3 (only URLs already public).
- Public business emails: 12. Public phones: 1 (Makeitfuture UK/RO).
- Personalized English message; greeting uses the named person when known.
- `doNotMailUntilApproved: true`. Nothing was sent.

Segments: 70 automation agencies, 50 WhatsApp implementers, 30 sales teams, 50 high-volume inboxes.

## Not done (needs your approval)

- Push/PR on `mybusiness-platform-client` if this bot still has 403
- Merge or production deploy
- Live Lemon billing
- Any outbound email/LinkedIn/WhatsApp
