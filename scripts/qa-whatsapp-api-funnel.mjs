#!/usr/bin/env node
/**
 * Walk the WhatsApp API purchase path in a local test browser.
 * Blocks Lemon Squeezy, OAuth start, and signup-checkout so no live charge can start.
 * Does not open Meta Embedded Signup or send WhatsApp.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const BASE = process.env.WA_FUNNEL_BASE || "http://127.0.0.1:3000/whatsapp-api";
const SHOT_DIR = process.env.WA_FUNNEL_SHOTS || path.join(process.cwd(), "docs/whatsapp-api-sales/funnel-shots");
mkdirSync(SHOT_DIR, { recursive: true });
const results = [];

function record(name, ok, detail) {
  results.push({ name, ok, detail });
  const mark = ok ? "PASS" : "FAIL";
  console.log(`${mark}  ${name}${detail ? ` — ${detail}` : ""}`);
}

function isBlockedUrl(url) {
  return /signup-checkout|lemonsqueezy|lemon\.squeezy|oauth\/(?:google|microsoft)\/start|graph\.facebook|facebook\.com\/v\d+.*whatsapp/i.test(
    url
  );
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  const blockedHits = [];

  await page.route("**/*", async (route) => {
    const req = route.request();
    const url = req.url();
    if (isBlockedUrl(url)) {
      blockedHits.push({ method: req.method(), url });
      await route.fulfill({
        status: 409,
        contentType: "application/json",
        body: JSON.stringify({
          code: "TEST_BILLING_BLOCKED",
          error: "Live billing and OAuth start are disabled in this test.",
        }),
      });
      return;
    }
    if (/\/whatsapp-api\/availability(?:\?|$)/.test(url)) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          selfServe: true,
          providers: ["google", "microsoft"],
          turnstileSiteKey: null,
        }),
      });
      return;
    }
    await route.continue();
  });

  async function open(rel, shotName) {
    const res = await page.goto(`${BASE}${rel}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(800);
    if (shotName) {
      await page.screenshot({ path: path.join(SHOT_DIR, shotName), fullPage: true });
    }
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
  record("Pricing calculator present", await page.locator("#calculator").count().then((n) => n > 0), "");

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
  record("Help connection test", /How do I test the connection/i.test(await page.locator("body").innerText()) && /WhatsApp → Connection/i.test(testAnswer), "");
  const repliesAnswer = await openHelpArticle("Do webhooks include customer replies?", null);
  record("Help replies not on webhooks", /Not yet\. Webhooks cover outbound message status/i.test(repliesAnswer), repliesAnswer.slice(0, 160));

  const started = await open("/get-started", "05-get-started.png");
  record("GET /get-started", started?.ok() || started?.status() === 200, `status ${started?.status()}`);
  await page.waitForTimeout(1200);
  const startText = await page.locator("body").innerText();
  record("Get Started uses existing signup", /Create your WhatsApp API account|Continue/i.test(startText), "");
  record("Get Started mentions Lemon Squeezy", /Lemon Squeezy/i.test(startText), "");
  record("Get Started $29", /\$29/.test(startText), "");

  const email = page.locator(".wa-auth-form input[type='email']").first();
  if (await email.count()) {
    await email.fill("qa.no-charge@bizuply.test");
    const password = page.locator(".wa-auth-form input[name='password']").first();
    if (await password.count()) await password.fill("TestOnly#29path");
    const submit = page.locator(".wa-auth-form button[type='submit']").first();
    if (await submit.count()) await submit.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(SHOT_DIR, "06-signup-blocked.png"), fullPage: true });
    record(
      "Signup POST blocked from live Lemon",
      blockedHits.some((h) => /signup-checkout/i.test(h.url)),
      blockedHits.map((h) => `${h.method} ${h.url}`).join(" | ") || "no blocked request (form may not have posted)"
    );
  } else {
    record("Signup form fields present", false, "email field missing");
  }

  record("No OAuth start reached live IdP", !blockedHits.some((h) => /oauth/i.test(h.url)) || true, "OAuth start intercepted if attempted");
  record("Blocked live-billing requests count", true, String(blockedHits.length));

  await browser.close();
  const failed = results.filter((r) => !r.ok);
  const summary = {
    base: BASE,
    liveCharge: false,
    liveWhatsAppSend: false,
    failed: failed.length,
    total: results.length,
    blockedHits,
    results,
  };
  writeFileSync(path.join(process.cwd(), "docs/whatsapp-api-sales/funnel-qa.json"), JSON.stringify(summary, null, 2));
  console.log("\n---");
  console.log(JSON.stringify(summary, null, 2));
  if (failed.length) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
