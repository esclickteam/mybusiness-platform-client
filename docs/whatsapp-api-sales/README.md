# WhatsApp API sales kit (not production deploy)

Goal: 30 new $29/month numbers in 60 days without paid ads. Do not merge this to production without approval. Do not run live checkout, Meta permission changes, or customer messages from this branch.

## Purchase path (checked in HE + EN)

1. https://whatsapp.bizuply.com/ — offer, $29, Meta fees separate.
2. /guides — how connect, inbox, CRM, automations, templates, app vs API, extra costs.
3. /pricing — subscription vs Meta calculator.
4. /get-started — account + Lemon Squeezy $29 (self-serve). Help no longer tells new users to “request access”.
5. Portal: subscription → business details → Connection (Embedded Signup) → API key → webhook → **test send on Connection**.
6. Inbox + templates for daily use. Webhooks are **status only**; replies stay in the inbox.

Hebrew uses the language switcher on the WhatsApp host (there is no `/he` path on whatsapp.bizuply.com; that 404 is expected). Help, pricing, guides, overview and get-started are localized.

## Fixes in this branch

- Help “How do I start?” pointed at a waitlist form. It now points at $29 self-serve checkout.
- Setup “first message” linked to Developers while the test template form lives on Connection.
- Portal copy claimed webhooks include customer replies. They do not.

## Files

- `prospects.json` / `prospects.csv` — 200 public websites, not mailed.
- `outreach-templates.md` — English templates A–D. Send only after approval.
