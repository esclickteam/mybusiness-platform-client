import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_URL || "http://127.0.0.1:5173/dev/detailed-targeting-qa";
const OUT = process.env.QA_OUT || "/tmp/detailed-targeting-qa";
fs.mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  headless: true,
  executablePath: "/usr/bin/google-chrome-stable",
  args: ["--no-sandbox", "--disable-dev-shm-usage"],
});
const page = await browser.newPage({ viewport: { width: 1100, height: 900 } });
page.on("console", (msg) => console.log("CONSOLE", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));

await page.goto(BASE, { waitUntil: "networkidle" });
await page.waitForSelector('[data-testid="detailed-targeting-qa"]');
await page.screenshot({ path: path.join(OUT, "01-loaded.png"), fullPage: true });

const browseBtn = page.getByRole("button", { name: /עיון|Browse/i });
await browseBtn.click();
await page.waitForTimeout(400);
await page.screenshot({ path: path.join(OUT, "02-browse-open.png"), fullPage: true });

const demo = page.getByRole("button", { name: /דמוגרפיה|Demographics/i }).first();
await demo.click();
await page.waitForTimeout(200);
// Expand Life Events folder via chevron/name button
const life = page.getByRole("button", { name: /Life Events|אירועים/i }).first();
if (await life.count()) {
  await life.click();
  await page.waitForTimeout(200);
}
const newlywed = page.getByRole("button", { name: /Newlywed/i }).first();
if (await newlywed.count()) {
  // click the checkbox near Newlywed row - click the name button which toggles select for leaves
  await newlywed.click();
} else {
  // fallback: click first selectable checkbox in open tree
  const checkbox = page.locator('button[aria-pressed]').first();
  await checkbox.click();
}
await page.waitForTimeout(200);

const interests = page.getByRole("button", { name: /תחומי עניין|Interests/i }).first();
await interests.click();
await page.waitForTimeout(150);
const biz = page.getByRole("button", { name: /Business and industry/i }).first();
if (await biz.count()) await biz.click();
await page.waitForTimeout(150);
const small = page.getByRole("button", { name: /Small business/i }).first();
if (await small.count()) await small.click();
await page.waitForTimeout(150);

const behaviors = page.getByRole("button", { name: /התנהגויות|Behaviors/i }).first();
await behaviors.click();
await page.waitForTimeout(150);
const purchase = page.getByRole("button", { name: /Purchase behavior/i }).first();
if (await purchase.count()) await purchase.click();
await page.waitForTimeout(150);
const engaged = page.getByRole("button", { name: /Engaged shoppers/i }).first();
if (await engaged.count()) await engaged.click();
await page.waitForTimeout(250);
await page.screenshot({ path: path.join(OUT, "03-multi-selected.png"), fullPage: true });

// Close browse by clicking outside
await page.locator("h1").click();
await page.waitForTimeout(200);

const input = page.getByPlaceholder(/הוסף נתונים|Add demographics/i);
await input.fill("travel");
await page.waitForTimeout(500);
await page.screenshot({ path: path.join(OUT, "04-search.png"), fullPage: true });
const travel = page.getByRole("button", { name: /Frequent travelers|הוסף|Add/i }).first();
if (await travel.count()) {
  await travel.click();
  await page.waitForTimeout(200);
}

const chips = page.locator("span.inline-flex");
const chipCount = await chips.count();
console.log("chipCount", chipCount);
if (chipCount > 0) {
  await chips.first().locator("button").click();
  await page.waitForTimeout(200);
}

await page.screenshot({ path: path.join(OUT, "05-after-remove.png"), fullPage: true });
const jsonText = await page.locator('[data-testid="selected-json"]').innerText();
console.log("SELECTED_JSON", jsonText);
const parsed = JSON.parse(jsonText);
if (!Array.isArray(parsed) || parsed.length < 1) {
  throw new Error(`Expected remaining selections, got ${jsonText}`);
}
for (const row of parsed) {
  if (!row.id || !row.name || !row.type) {
    throw new Error(`Selection missing id/name/type: ${JSON.stringify(row)}`);
  }
}
console.log("QA_OK", parsed.map((r) => `${r.type}:${r.name}`).join(", "));
await browser.close();
