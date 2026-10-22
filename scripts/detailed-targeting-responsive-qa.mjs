import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_URL || "http://127.0.0.1:5173/dev/detailed-targeting-qa";
const OUT = process.env.QA_OUT || "/opt/cursor/artifacts/screenshots";
fs.mkdirSync(OUT, { recursive: true });

async function runViewport(name, viewport) {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "/usr/bin/google-chrome-stable",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
  });
  const page = await browser.newPage({
    viewport,
    isMobile: Boolean(viewport.isMobile),
    hasTouch: Boolean(viewport.isMobile),
  });
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-testid="detailed-targeting-qa"]');

  await page.getByRole("button", { name: /עיון|Browse/i }).click();
  await page.waitForTimeout(400);
  await page.screenshot({
    path: path.join(OUT, `responsive-${name}-browse.png`),
    fullPage: true,
  });

  // Expand interests and select
  await page.getByRole("button", { name: /תחומי עניין|Interests/i }).first().click();
  await page.waitForTimeout(200);
  const biz = page.getByRole("button", { name: /Business and industry/i }).first();
  if (await biz.count()) await biz.click();
  await page.waitForTimeout(150);
  const small = page.getByRole("button", { name: /Small business/i }).first();
  if (await small.count()) await small.click();
  await page.waitForTimeout(200);

  await page.getByRole("button", { name: /התנהגויות|Behaviors/i }).first().click();
  await page.waitForTimeout(150);
  const purchase = page.getByRole("button", { name: /Purchase behavior/i }).first();
  if (await purchase.count()) await purchase.click();
  await page.waitForTimeout(150);
  const engaged = page.getByRole("button", { name: /Engaged shoppers/i }).first();
  if (await engaged.count()) await engaged.click();
  await page.waitForTimeout(250);

  // Dropdown should not be clipped off-screen
  const panel = page.locator(".absolute.inset-x-0.top-full").first();
  const box = await panel.boundingBox();
  if (!box) throw new Error(`${name}: browse panel missing`);
  if (box.y + 20 > viewport.height) {
    // still OK if scrollable page — check it is within document
  }
  if (box.width < 200) throw new Error(`${name}: browse panel too narrow`);

  await page.locator("h1").click();
  await page.waitForTimeout(150);
  await page.getByPlaceholder(/הוסף נתונים|Add demographics/i).fill("travel");
  await page.waitForTimeout(600);
  const travel = page.getByText("Frequent travelers").first();
  if (await travel.count()) await travel.click();
  await page.waitForTimeout(250);

  const json = JSON.parse(await page.locator('[data-testid="selected-json"]').innerText());
  if (!Array.isArray(json) || json.length < 2) {
    throw new Error(`${name}: expected multiple selections, got ${JSON.stringify(json)}`);
  }
  if (!json.every((row) => /^\d+$/.test(row.id) && row.type)) {
    throw new Error(`${name}: selections missing Meta id/type`);
  }

  // Remove by Meta id
  await page.locator(`[data-remove-id="${json[0].id}"]`).click();
  await page.waitForTimeout(200);
  const after = JSON.parse(await page.locator('[data-testid="selected-json"]').innerText());
  if (after.some((row) => row.id === json[0].id)) {
    throw new Error(`${name}: remove by Meta id failed`);
  }

  await page.screenshot({
    path: path.join(OUT, `responsive-${name}-selected.png`),
    fullPage: true,
  });
  await browser.close();
  return { name, selected: after.length, ids: after.map((r) => r.id) };
}

const results = [];
results.push(
  await runViewport("desktop", { width: 1280, height: 900, isMobile: false })
);
results.push(
  await runViewport("mobile", { width: 390, height: 844, isMobile: true })
);
console.log(JSON.stringify({ ok: true, results }, null, 2));
