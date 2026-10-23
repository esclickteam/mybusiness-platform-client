/**
 * Local UI smoke for /dev/detailed-targeting-qa (Playwright).
 *   QA_BASE=http://127.0.0.1:5174 node scripts/qa-detailed-targeting-ui.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://127.0.0.1:5174";
const OUT = process.env.QA_OUT || "/tmp/detailed-targeting-ui-qa";
fs.mkdirSync(OUT, { recursive: true });

const report = { ok: true, checks: {}, screenshots: [] };

function mark(name, pass, detail = {}) {
  report.checks[name] = { ok: Boolean(pass), ...detail };
  if (!pass) report.ok = false;
}

async function clickFirst(page, re) {
  const btn = page.getByRole("button", { name: re });
  if (!(await btn.count())) return false;
  await btn.first().click({ force: true });
  await page.waitForTimeout(220);
  return true;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(`${BASE}/dev/detailed-targeting-qa`, { waitUntil: "networkidle" });
  await clickFirst(page, /^HE$/i);
  const dir = await page.evaluate(
    () => document.documentElement.dir || document.body.dir
  );
  mark("rtl", dir === "rtl", { dir });

  await clickFirst(page, /^עיון$|^Browse$/i);
  mark(
    "browseOpen",
    await page.getByRole("button", { name: /^דמוגרפיה$|^Demographics$/i }).isVisible()
  );

  await clickFirst(page, /^דמוגרפיה$|^Demographics$/i);
  await clickFirst(page, /^תחומי עניין$|^Interests$/i);
  await clickFirst(page, /^התנהגויות$|^Behaviors$/i);
  mark(
    "categoryNavigation",
    (await page.getByRole("button", { name: /Business and industry/i }).count()) > 0 &&
      (await page.getByRole("button", { name: /Education/i }).count()) > 0 &&
      (await page.getByRole("button", { name: /Purchase behavior/i }).count()) > 0
  );

  await clickFirst(page, /Education/i);
  await clickFirst(page, /Other/i);
  await clickFirst(page, /Life Events/i);
  await clickFirst(page, /Business and industry/i);
  await clickFirst(page, /Purchase behavior/i);
  await clickFirst(page, /Shopping and fashion/i);

  const unsupportedText = await page
    .getByText(
      /לא נתמך לשמירה|not supported for Meta flexible_spec|קטגוריה לעיון בלבד|Browse category only/i
    )
    .count();
  mark("unsupportedHint", unsupportedText > 0, {
    unsupportedCount: unsupportedText,
  });

  await clickFirst(page, /Small business/i);
  await clickFirst(page, /Engaged shoppers/i);
  await clickFirst(page, /Newlywed/i);
  let chipCount = await page.locator("[data-remove-id]").count();
  mark("multiSelect", chipCount >= 2, { chipCount });

  if (chipCount >= 1) {
    const before = chipCount;
    await page.locator("[data-remove-id]").first().click({ force: true });
    await page.waitForTimeout(200);
    const after = await page.locator("[data-remove-id]").count();
    mark("removeChip", after === before - 1, { before, after });
    chipCount = after;
  } else {
    mark("removeChip", false, { reason: "no chips" });
  }

  await page.screenshot({
    path: path.join(OUT, "desktop-browse-selected.png"),
    fullPage: true,
  });
  report.screenshots.push("desktop-browse-selected.png");

  // Search HE
  await page.keyboard.press("Escape").catch(() => {});
  await page.waitForTimeout(150);
  const input = page.locator("input").first();
  await input.click();
  await input.fill("יופי");
  await page.waitForTimeout(700);
  const heHit = await page.getByRole("button", { name: /יופי/ }).count();
  mark("searchHebrew", heHit > 0, { heHit });
  if (heHit) {
    await page.getByRole("button", { name: /יופי/ }).first().click();
    await page.waitForTimeout(200);
  }

  await input.fill("wedding");
  await page.waitForTimeout(500);
  mark("searchEnglishTyped", (await input.inputValue()) === "wedding");
  // English fixture names containing wedding? none — also try "shop"
  await input.fill("shop");
  await page.waitForTimeout(700);
  const enHit = await page.getByRole("button", { name: /shop/i }).count();
  mark("searchEnglish", enHit > 0, { enHit });

  await page.screenshot({
    path: path.join(OUT, "desktop-search.png"),
    fullPage: true,
  });
  report.screenshots.push("desktop-search.png");

  mark(
    "chipsPersistInSession",
    (await page.locator("[data-remove-id]").count()) >= 1
  );

  // Mobile
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/dev/detailed-targeting-qa`, { waitUntil: "networkidle" });
  await clickFirst(page, /^HE$/i);
  await clickFirst(page, /^עיון$|^Browse$/i);
  await clickFirst(page, /^תחומי עניין$|^Interests$/i);
  await clickFirst(page, /Business and industry/i);
  const overflow = await page.evaluate(() => ({
    bodyScrollWidth: document.body.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  mark(
    "mobileNoHorizontalOverflow",
    overflow.bodyScrollWidth <= overflow.clientWidth + 2,
    overflow
  );
  const panelBox = await page.locator("div.absolute").first().boundingBox();
  mark(
    "mobilePanelNotClipped",
    Boolean(panelBox && panelBox.width <= 390 && panelBox.x >= -1),
    panelBox || {}
  );
  await page.screenshot({
    path: path.join(OUT, "mobile-browse.png"),
    fullPage: true,
  });
  report.screenshots.push("mobile-browse.png");

  await browser.close();
  fs.writeFileSync(path.join(OUT, "report.json"), JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report, null, 2));
  process.exit(report.ok ? 0 : 2);
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: String(error) }));
  process.exit(1);
});
