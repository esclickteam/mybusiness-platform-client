/**
 * Capture English guided-demo product screens for Module 1 Academy PDF.
 * Uses a public English demo sandbox (Noa Studio) — not live customer accounts.
 */
import { chromium } from "playwright";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(
  here,
  "../../../mybusiness-platform-server/_wt_guided_demo_ux/server/assets/partnerCenter/module1-en"
);
const DEMO_URL = process.env.MODULE1_DEMO_URL || "";
const HEBREW = /[\u0590-\u05FF]/;
const SHOTS = [
  { id: "dashboard", path: "dashboard", wait: "text=Hello" },
  { id: "leads", path: "dashboard/crm", wait: "text=Lead Management" },
  { id: "crm-profile", path: "dashboard/crm/clients", wait: "text=Clients", openRow: /Sarah Cohen/ },
  { id: "inbox", path: "dashboard/whatsapp/inbox", wait: "text=Inbox" },
  { id: "appointments", path: "dashboard/crm/appointments", wait: "text=Appointments" },
  { id: "automations", path: "dashboard/automations", wait: "text=Automations" },
  { id: "website", path: "dashboard/website/templates", wait: "text=template" },
  { id: "website-editor", path: "dashboard/website/templates", wait: "text=template", editEnglish: true },
  { id: "permissions", path: "dashboard/crm/settings", wait: "text=Settings", clickTab: /Security/, scroll: "security" },
  { id: "reports", path: "dashboard", wait: "text=Performance", scroll: "performance" },
  { id: "wa-templates", path: "dashboard/whatsapp/templates", wait: "text=Template" },
  { id: "wa-compose", path: "dashboard/whatsapp/messages/compose", wait: "text=Send" },
];
const ONLY = (process.env.CAPTURE_ONLY || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const ACTIVE_SHOTS = ONLY.length ? SHOTS.filter((s) => ONLY.includes(s.id)) : SHOTS;

if (!DEMO_URL) throw new Error("MODULE1_DEMO_URL is required");
fs.mkdirSync(OUT, { recursive: true });

function hideChromeCss() {
  return `
    [class*="2147483000"], [class*="2147483001"], [class*="2147483002"],
    [class*="2147483003"], [class*="2147483004"], [class*="2147483005"], [class*="2147483006"],
    [role="status"], .Toastify, [data-sonner-toast],
    [aria-label="Open the Bizuply smart assistant"],
    button[aria-label="Open the Bizuply smart assistant"] { display: none !important; }
  `;
}

async function clickText(page, re) {
  return page.evaluate((source) => {
    const rx = new RegExp(source, "i");
    const nodes = [...document.querySelectorAll("button, a")];
    const el = nodes.find((n) => rx.test((n.innerText || "").trim()));
    el?.click();
    return el ? el.innerText.trim() : "";
  }, re.source);
}

async function dismissTour(page) {
  for (let i = 0; i < 24; i++) {
    const skipped = await clickText(page, /Skip this module/);
    if (!skipped) break;
    await page.waitForTimeout(900);
  }
  await clickText(page, /Skip tour/);
  await page.waitForTimeout(400);
  await clickText(page, /^Hide$/);
  await page.addStyleTag({ content: hideChromeCss() });
}

async function enterDemo(page) {
  await page.goto(DEMO_URL, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.waitForTimeout(5000);
  const clicked = await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      /Enter the demo|Start the demo/i.test(b.innerText || "")
    );
    btn?.click();
    return btn ? btn.innerText.trim() : "";
  });
  if (!clicked) throw new Error("no enter button");
  await page.waitForURL(/\/business\//, { timeout: 90000, waitUntil: "domcontentloaded" });
  await page.waitForTimeout(5000);
  await clickText(page, /Start the demo/);
  await page.waitForTimeout(2000);
  await dismissTour(page);
}

async function businessBase(page) {
  const href = page.url();
  const m = href.match(/\/business\/[^/]+/);
  if (!m) throw new Error(`not in business workspace: ${href}`);
  return `https://bizuply.com${m[0]}`;
}

async function shotMain(page, id) {
  await page.addStyleTag({ content: hideChromeCss() });
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("button, a, span")) {
      const t = (el.innerText || "").trim();
      if (t === "DEMO" || /^Hide$/i.test(t) || /end demo/i.test(t)) {
        el.style.setProperty("visibility", "hidden", "important");
      }
    }
    for (const el of document.querySelectorAll("p, div, button")) {
      const t = (el.innerText || "").trim();
      if (t.length > 8 && t.length < 90 && /demo message|not sent to a real customer/i.test(t)) {
        el.style.setProperty("display", "none", "important");
      }
    }
  });
  const dest = path.join(OUT, `${id}.png`);
  await page.screenshot({ path: dest, type: "png" });
  return dest;
}

async function hebrewOnPage(page) {
  return page.evaluate((reSource) => {
    const rx = new RegExp(reSource);
    const text = document.body.innerText || "";
    return rx.test(text);
  }, HEBREW.source);
}

async function openNamedRow(page, re) {
  const clicked = await page.evaluate((source) => {
    const rx = new RegExp(source);
    const open = [...document.querySelectorAll("button, a")].find((el) =>
      /open/i.test(el.innerText || "") && rx.test(el.closest("tr")?.innerText || el.innerText || "")
    );
    if (open) {
      open.click();
      return open.innerText;
    }
    const row = [...document.querySelectorAll("tr, button, a")].find((el) => rx.test(el.innerText || ""));
    row?.click();
    return row ? (row.innerText || "").slice(0, 80) : "";
  }, re.source);
  if (clicked) await page.waitForTimeout(2500);
  return clicked;
}

const browser = await chromium.launch({ channel: "msedge", headless: true });
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  locale: "en-US",
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
const report = { files: [], hebrew: {}, hrefs: {}, errors: [] };

try {
  await enterDemo(page);
  const base = await businessBase(page);

  for (const shot of ACTIVE_SHOTS) {
    await page.goto(`${base}/${shot.path}`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(4000);
    await dismissTour(page);
    await page.waitForTimeout(800);
    await page.locator(shot.wait).first().waitFor({ timeout: 15000 }).catch(() => {});
    if (shot.scroll === "performance") {
      const chart = page.locator("[data-demo-target='dashboard-performance-chart']");
      if (await chart.count()) await chart.first().scrollIntoViewIfNeeded().catch(() => {});
    }
    if (shot.clickTab) await clickText(page, shot.clickTab);
    if (shot.clickTab) await page.waitForTimeout(1200);
    if (shot.scroll === "security") {
      await page.evaluate(() => {
        const heading = [...document.querySelectorAll("h1, h2, h3, p, div")].find((n) =>
          /^CRM protection and permissions$/.test((n.innerText || "").trim())
        );
        heading?.scrollIntoView({ block: "start" });
      });
      await page.waitForTimeout(600);
    }
    if (shot.editEnglish) {
      await page.evaluate(() => {
        const hebrew = /[\u0590-\u05FF]/;
        const cards = [...document.querySelectorAll("button, a")].filter((el) =>
          /^Edit$/i.test((el.innerText || "").trim())
        );
        const pick = cards.find((el) => !hebrew.test(el.closest("div")?.innerText || ""));
        (pick || cards[1] || cards[0])?.click();
      });
      await page.waitForTimeout(5000);
      await page.waitForURL(/edit|studio|builder|preview/i, { timeout: 20000 }).catch(() => {});
      await page.waitForTimeout(3000);
    }
    if (shot.openRow) await openNamedRow(page, shot.openRow);
    report.hrefs[shot.id] = page.url();
    const hebrew = await hebrewOnPage(page);
    report.hebrew[shot.id] = hebrew;
    if (hebrew) report.errors.push(`hebrew visible on ${shot.id}`);
    const file = await shotMain(page, shot.id);
    report.files.push({ id: shot.id, file, bytes: fs.statSync(file).size, href: page.url() });
  }

  fs.writeFileSync(path.join(OUT, "capture-report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  if (report.errors.length) process.exitCode = 1;
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await browser.close();
}
