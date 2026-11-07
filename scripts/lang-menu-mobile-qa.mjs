/**
 * QA: homepage language menu shows all locales on mobile + smooth switches.
 * Usage: node scripts/lang-menu-mobile-qa.mjs
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";

const BASE = process.env.QA_BASE_URL || "http://127.0.0.1:5173";
const OUT = process.env.QA_OUT_DIR || "/opt/cursor/artifacts";
mkdirSync(OUT, { recursive: true });

const LOCALES = [
  { code: "en", label: "English", path: "/" },
  { code: "he", label: "עברית", path: "/he" },
  { code: "es", label: "Español", path: "/es" },
  { code: "pt-BR", label: "Português (Brasil)", path: "/pt-br" },
  { code: "ar", label: "العربية", path: "/ar" },
];

async function openMenu(page) {
  // Soft locale hold clones the header; always drive the live #root trigger.
  await page.locator("#bizuply-locale-hold").waitFor({ state: "detached", timeout: 15000 }).catch(() => {});
  const trigger = page.locator("#root .site-header__end button[aria-haspopup='listbox']");
  await trigger.click({ force: false });
  const menu = page.locator("body > [role='listbox']");
  await menu.waitFor({ state: "visible", timeout: 5000 });
  return menu;
}

async function assertAllOptions(menu) {
  for (const locale of LOCALES) {
    const option = menu.getByRole("option", { name: locale.label, exact: true });
    if (!(await option.isVisible())) {
      throw new Error(`Missing visible option: ${locale.label}`);
    }
  }
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const results = [];

  // Mobile: open menu screenshot
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
    });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await page.waitForSelector(".site-header__end .site-header__lang-code", { timeout: 15000 });

    // Real pointer click — not JS .click()
    const box = await page.locator("#root .site-header__end button[aria-haspopup='listbox']").boundingBox();
    if (!box) throw new Error("Language trigger has no box");
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    const menu = page.locator("body > [role='listbox']");
    await menu.waitFor({ state: "visible", timeout: 5000 });
    await assertAllOptions(menu);

    const menuBox = await menu.boundingBox();
    if (!menuBox || menuBox.height < 180) {
      throw new Error(`Menu too short / clipped: ${JSON.stringify(menuBox)}`);
    }
    if (menuBox.y < 40) {
      throw new Error(`Menu anchored near top (likely wrong trigger): y=${menuBox.y}`);
    }

    const shot = join(OUT, "lang-menu-mobile-open.png");
    await page.screenshot({ path: shot, fullPage: false });
    results.push({ case: "mobile-open-all-five", ok: true, shot, menuBox });

    // Narrow iPhone SE
    await page.setViewportSize({ width: 320, height: 568 });
    await page.mouse.click(1, 1);
    await page.waitForTimeout(200);
    const narrowMenu = await openMenu(page);
    await assertAllOptions(narrowMenu);
    const narrowShot = join(OUT, "lang-menu-mobile-320.png");
    await page.screenshot({ path: narrowShot, fullPage: false });
    results.push({ case: "mobile-320", ok: true, shot: narrowShot });

    await context.close();
  }

  // Mobile language chain with video
  {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      deviceScaleFactor: 2,
      isMobile: true,
      hasTouch: true,
      recordVideo: { dir: OUT, size: { width: 390, height: 844 } },
    });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });

    const chain = ["עברית", "Español", "Português (Brasil)", "العربية", "English"];
    const paths = ["/he", "/es", "/pt-br", "/ar", "/"];
    for (let i = 0; i < chain.length; i++) {
      const menu = await openMenu(page);
      await assertAllOptions(menu);
      await menu.getByRole("option", { name: chain[i], exact: true }).click();
      await page.waitForURL((url) => {
        const path = url.pathname.replace(/\/$/, "") || "/";
        const expected = paths[i].replace(/\/$/, "") || "/";
        return path === expected;
      }, { timeout: 10000 });
      // Soft nav must keep SPA root alive (no blank purple document reload)
      const hasRoot = await page.locator("#root").evaluate((el) => el && el.children.length > 0);
      if (!hasRoot) throw new Error(`#root emptied after switch to ${chain[i]}`);
      const purpleBlank = await page.evaluate(() => {
        const root = document.querySelector("#root");
        if (!root) return true;
        const text = (root.innerText || "").trim();
        return text.length < 20;
      });
      if (purpleBlank) throw new Error(`Suspiciously empty root after ${chain[i]}`);
      await page.waitForTimeout(400);
    }

    const videoPath = await page.video().path();
    await context.close();
    results.push({ case: "mobile-locale-chain", ok: true, video: videoPath });
  }

  // Desktop
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    await openMenu(page);
    await assertAllOptions(page.locator("[role='listbox']"));
    const deskShot = join(OUT, "lang-menu-desktop-open.png");
    await page.screenshot({ path: deskShot, fullPage: false });

    await page.locator("body > [role='listbox']").getByRole("option", { name: "עברית", exact: true }).click();
    await page.waitForURL("**/he");
    await page.locator("#bizuply-locale-hold").waitFor({ state: "detached", timeout: 15000 }).catch(() => {});
    await openMenu(page);
    await page.locator("body > [role='listbox']").getByRole("option", { name: "English", exact: true }).click();
    await page.waitForURL((url) => url.pathname === "/");
    results.push({ case: "desktop", ok: true, shot: deskShot });
    await context.close();
  }

  await browser.close();
  console.log(JSON.stringify({ ok: true, results }, null, 2));
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
