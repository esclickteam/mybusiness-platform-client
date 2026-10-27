# Invistimo WhatsApp acceptance (read-only)

Runs the 10 hub modules plus optional other-tenant isolation.

The **Cursor Browser session is not used**. You sign in once in a local Chromium window. Auth stays in `.auth/` on your machine and is gitignored. The script never prints cookies, tokens, or passwords.

It does **not** send WhatsApp, change Meta, disconnect Dialog, or run cutover. After login it **aborts** mutating `/api/whatsapp` requests. It confirms the connected account is **Invistimo** before any module runs. It will **not** log in again automatically or bypass access. One module failure is recorded and the rest continue.

## Run from Cursor (preferred)

In the `mybusiness-platform-client` folder, one command:

```bash
npm run test:invistimo-accept
```

First time on this machine only:

```bash
npm ci
npx playwright install chromium
```

Then:

1. Chromium opens `https://bizuply.com/whatsapp-api/login`.
2. Sign in as **support@invistimo.com** (existing tenant only).
3. Wait until you land on the Invistimo WhatsApp hub. The run confirms Invistimo, then checks modules by itself.
4. Open `e2e/invistimo-whatsapp-acceptance/results/report.md`.

Later runs reuse `.auth/` until you delete that folder. If the saved session is not Invistimo, the runner stops and does not try another login.

## Isolation (optional)

Only if you have a **separate authorized** non-Invistimo business:

```bash
INVISTIMO_OTHER_BUSINESS_ID='<other-business-id>' npm run test:invistimo-accept
```

Without that env var the isolation row is **SKIP**.

## Output

- `results/report.md` — PASS/FAIL per module
- `results/report.json`
- `results/screenshots/<module>.png`

Do not commit `.auth/` or `results/`. Password fields are masked in screenshots. Reports redact tokens and cookies.
