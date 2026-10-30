#!/usr/bin/env node
/**
 * Walk the WhatsApp API purchase path in a local test browser.
 * Uses a mock Lemon checkout only — no live charge, no Meta Embedded Signup, no WhatsApp send.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.WA_FUNNEL_BASE || "http://127.0.0.1:3000/whatsapp-api";
const ORIGIN = new URL(BASE).origin;
const SHOT_DIR = process.env.WA_FUNNEL_SHOTS || path.join(process.cwd(), "docs/whatsapp-api-sales/funnel-shots");
mkdirSync(SHOT_DIR, { recursive: true });
const results = [];
const MOCK_CHECKOUT = "https://lemonsqueezy.com/checkout/mock-wa-api-test";
const MOCK_REF = "507f1f77bcf86cd799439011";
const MOCK_EMAIL = "qa.mock-pay@bizuply.test";

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function mockCheckoutHtml(returnUrl) {
  return `<!DOCTYPE html>
<html lang="en">
  <head><meta charset="utf-8"><title>Mock Lemon checkout (test only)</title></head>
  <body>
    <p>Test mode</p>
    <h1>Bizuply WhatsApp API</h1>
    <p>WhatsApp API – Monthly</p>
    <p>$29.00 USD / month</p>
    <p>No free trial. Due today: $29.00</p>
    <p>Meta messaging fees billed separately.</p>
    <button id="pay" type="button">Pay $29</button>
    <script>
      document.getElementById("pay").onclick = function () {
        location.href = ${JSON.stringify(returnUrl)};
      };
    </script>
  </body>
</html>`;
}

function installRoutes(page, { availability = "open", hits }) {
  return page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    const method = req.method();

    if (/oauth\/(?:google|microsoft)\/start|graph\.facebook|facebook\.com\/v\d+/i.test(url)) {
      hits.push({ method, url, kind: "blocked-live" });
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({ code: "TEST_BILLING_BLOCKED", error: "Live OAuth/Meta is disabled in this test." }),
      });
      return;
    }

    if (/\/whatsapp-api\/availability(?:\?|$)/.test(url)) {
      hits.push({ method, url, kind: "availability" });
      if (availability === "down") {
        await route.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ success: false }) });
        return;
      }
      if (availability === "closed") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({ selfServe: false, providers: [], turnstileSiteKey: null }),
        });
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ selfServe: true, providers: ["google", "microsoft"], turnstileSiteKey: null }),
      });
      return;
    }

    if (/\/whatsapp-api\/signup-status(?:\?|$)/.test(url)) {
      hits.push({ method, url, kind: "signup-status" });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, status: "ready", method: "email" }),
      });
      return;
    }

    if (/\/whatsapp-api\/signup-checkout(?:\?|$)/.test(url) && method === "POST") {
      hits.push({ method, url, kind: "signup-checkout-mock" });
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: true,
          url: MOCK_CHECKOUT,
          checkoutId: "chk_mock_no_charge",
          testMode: true,
        }),
      });
      return;
    }

    if (/lemonsqueezy|lemon\.squeezy/i.test(url)) {
      hits.push({ method, url, kind: "lemon-mock" });
      const returnUrl = `${ORIGIN}/whatsapp-api/login?product=whatsapp_api&checkout=whatsapp_api&email=${encodeURIComponent(MOCK_EMAIL)}&ref=${MOCK_REF}`;
      await route.fulfill({
        status: 200,
        contentType: "text/html; charset=utf-8",
        body: mockCheckoutHtml(returnUrl),
      });
      return;
    }

    await route.continue();
  });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const hits = [];

  const page = await browser.newPage();
  await installRoutes(page, { availability: "open", hits });

  async function open(rel, shotName) {
    const res = await page.goto(`${BASE}${rel}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(800);
    if (shotName) await page.screenshot({ path: path.join(SHOT_DIR, shotName), fullPage: true });
    return res;
  }

  const home = await open("/", "01-home.png");
  record("GET /whatsapp-api/", home?.ok() || home?.status() === 200, `status ${home?.status()}`);
  const homeText = await page.locator("body").innerText();
  record("Home states $29", /\$29/.test(homeText), "");
  record("Home separates Meta fees", /Meta messaging fees are billed separately/i.test(homeText), "");
  record("Home CTA Get Started", /Get Started/i.test(homeText), "");

  const guides = await open("/guides", "02-guides.png");
  record("GET /guides", guides?.ok() || guides?.status() === 200, `status ${guides?.status()}`);
  const guidesText = await page.locator("body").innerText();
  record("Guides: connect", /How to connect WhatsApp Business Platform/i.test(guidesText), "");
  record("Guides: app vs API", /WhatsApp app versus WhatsApp API/i.test(guidesText), "");
  record("Guides: extra costs", /Which extra costs can apply/i.test(guidesText), "");
  record("Guides: no live send claim", /Nothing here is a live send/i.test(guidesText), "");
  record("Guides: Meta billed separately", /Meta messaging fees are billed separately|Meta:/i.test(guidesText), "");

  const pricing = await open("/pricing", "03-pricing.png");
  record("GET /pricing", pricing?.ok() || pricing?.status() === 200, `status ${pricing?.status()}`);
  const pricingText = await page.locator("body").innerText();
  record("Pricing $29", /\$29/.test(pricingText), "");
  record("Pricing Meta additional", /Meta messaging charges|Additional/i.test(pricingText), "");
  record("Pricing no trial", /No free trial/i.test(pricingText), "");
  record("Pricing calculator present", (await page.locator("#calculator").count()) > 0, "");

  const help = await open("/help", "04-help.png");
  record("GET /help", help?.ok() || help?.status() === 200, `status ${help?.status()}`);
  const helpSource = await page.content();
  record("Help does not ask for access request", !/send the onboarding request/i.test(helpSource), "");
  async function openHelpArticle(q, shot) {
    const btn = page.getByRole("button", { name: q }).first();
    if (!(await btn.count())) return "";
    await btn.click();
    await page.waitForTimeout(200);
    if (shot) await page.screenshot({ path: path.join(SHOT_DIR, shot), fullPage: true });
    return page.locator(".wa-accordion-panel:not([hidden])").innerText();
  }
  const startAnswer = await openHelpArticle("How do I start?", "04b-help-start.png");
  record("Help start is self-serve $29", /pay \$29\/month for one number/i.test(startAnswer), startAnswer.slice(0, 160));
  const testAnswer = await openHelpArticle("How do I test the connection?", null);
  record(
    "Help connection test",
    /How do I test the connection/i.test(await page.locator("body").innerText()) && /WhatsApp → Connection/i.test(testAnswer),
    ""
  );
  const repliesAnswer = await openHelpArticle("Do webhooks include customer replies?", null);
  record("Help replies not on webhooks", /Not yet\. Webhooks cover outbound message status/i.test(repliesAnswer), repliesAnswer.slice(0, 160));

  const started = await open("/get-started", "05-get-started.png");
  record("GET /get-started", started?.ok() || started?.status() === 200, `status ${started?.status()}`);
  await page.waitForTimeout(1200);
  const startText = await page.locator("body").innerText();
  record("Get Started uses existing signup", /Create your WhatsApp API account|Continue/i.test(startText), "");
  record("Get Started mentions Lemon Squeezy", /Lemon Squeezy/i.test(startText), "");
  record("Get Started $29", /\$29/.test(startText), "");
  record("Get Started is not a contact-only path", (await page.locator(".wa-auth-form").count()) > 0 && (await page.getByRole("button", { name: /Send request/i }).count()) === 0, "");

  const down = await browser.newPage();
  const downHits = [];
  await installRoutes(down, { availability: "down", hits: downHits });
  await down.goto(`${BASE}/get-started`, { waitUntil: "domcontentloaded", timeout: 60000 });
  await down.waitForTimeout(1500);
  await down.screenshot({ path: path.join(SHOT_DIR, "05b-get-started-availability-down.png"), fullPage: true });
  record(
    "Get Started stays self-serve if availability is down",
    (await down.locator(".wa-auth-form").count()) > 0 && (await down.getByRole("button", { name: /Send request/i }).count()) === 0,
    ""
  );
  await down.close();

  const email = page.locator(".wa-auth-form input[type='email']").first();
  if (await email.count()) {
    await email.fill(MOCK_EMAIL);
    const password = page.locator(".wa-auth-form input[name='password']").first();
    if (await password.count()) await password.fill("TestOnly#29path");
    const submit = page.locator(".wa-auth-form button[type='submit']").first();
    if (await submit.count()) await submit.click();
    await page.waitForURL(/lemonsqueezy\.com/, { timeout: 20000 });
    await page.waitForTimeout(400);
    const checkoutText = await page.locator("body").innerText();
    await page.screenshot({ path: path.join(SHOT_DIR, "06-mock-checkout.png"), fullPage: true });
    record("Mock Lemon checkout opened", /lemonsqueezy\.com/.test(page.url()), page.url());
    record("Mock checkout is $29 with no trial", /\$29/.test(checkoutText) && /no free trial/i.test(checkoutText), checkoutText.slice(0, 200));
    record("Mock checkout is test mode", /test mode/i.test(checkoutText), "");
    record("Mock checkout separates Meta fees", /meta messaging fees billed separately/i.test(checkoutText), "");
    await page.getByRole("button", { name: /Pay \$29/ }).click();
    await page.waitForURL(/\/whatsapp-api\/login/, { timeout: 20000 });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SHOT_DIR, "07-activation-login.png"), fullPage: true });
    const returned = new URL(page.url());
    record(
      "Mock pay returns to WhatsApp API login",
      returned.pathname === "/whatsapp-api/login" &&
        returned.searchParams.get("checkout") === "whatsapp_api" &&
        returned.searchParams.get("ref") === MOCK_REF,
      returned.pathname + returned.search
    );
    const banner = page.locator('[data-testid="wa-checkout-activation"]');
    await banner.waitFor({ timeout: 15000 }).catch(() => {});
    const bannerState = (await banner.count()) ? await banner.getAttribute("data-state") : null;
    record("Activation banner ready after mock webhook", bannerState === "ready", `state ${bannerState}`);
  } else {
    record("Signup form fields present", false, "email field missing");
  }

  record("Live IdP/Meta never attempted", !hits.some((h) => h.kind === "blocked-live"), `hits=${hits.length}`);
  record("Signup used mock checkout URL only", hits.some((h) => h.kind === "signup-checkout-mock"), "");
  record("Lemon host was intercepted", hits.some((h) => h.kind === "lemon-mock"), "");

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  const summary = {
    base: BASE,
    liveCharge: false,
    liveWhatsAppSend: false,
    mockPayment: true,
    failed: failed.length,
    total: results.length,
    hits,
    results,
  };
  writeFileSync(path.join(process.cwd(), "docs/whatsapp-api-sales/funnel-qa.json"), JSON.stringify(summary, null, 2));
  console.log("\n---");
  console.log(JSON.stringify({ failed: summary.failed, total: summary.total, mockPayment: true, liveCharge: false }, null, 2));
  if (failed.length) {
    console.log(JSON.stringify(failed, null, 2));
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
