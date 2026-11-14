/**
 * Locale-switch QA: assert no empty-purple frames during EN↔HE (and all locales).
 * Runs against local Vite (default http://127.0.0.1:3000).
 */
import { chromium, devices } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://127.0.0.1:3000";
const OUT = process.env.QA_OUT || "/opt/cursor/artifacts/locale-switch-fix";
const LOCALES = [
  { code: "en", path: "/", label: "English" },
  { code: "he", path: "/he", label: "עברית" },
  { code: "es", path: "/es", label: "Español" },
  { code: "pt-BR", path: "/pt-br", label: "Português (Brasil)" },
  { code: "ar", path: "/ar", label: "العربية" },
];

mkdirSync(OUT, { recursive: true });

function isEmptyPurpleSample(sample) {
  // Purple-dominant with no product media / almost no text → bad frame.
  if (!sample) return true;
  if (sample.hasHold) return false; // intentional visual hold of previous hero
  if (sample.hasShot && sample.shotVisible) return false;
  if (sample.hasHero && sample.heroTextLen > 20 && sample.maxOpacity > 0.2) return false;
  if (sample.purpleRatio > 0.55 && sample.heroTextLen < 8 && !sample.hasShot) return true;
  if (sample.purpleRatio > 0.7 && !sample.hasHero) return true;
  return false;
}

async function paintProbe(page) {
  return page.evaluate(() => {
    const hold = document.getElementById("bizuply-locale-hold");
    const hero = document.querySelector("#root .hx-hero") || document.querySelector(".hx-hero");
    const shot =
      document.querySelector("#root .hx-hero-shot-1") ||
      document.querySelector("#root .hx-hero-frame img") ||
      document.querySelector("#bizuply-locale-hold .hx-hero-shot-1") ||
      document.querySelector("#bizuply-locale-hold img");
    const root = document.getElementById("root");
    const loaderText = Array.from(document.querySelectorAll("body *"))
      .map((n) => (n.childElementCount === 0 ? (n.textContent || "").trim() : ""))
      .filter((t) => /^loading(\s+bizuply)?/i.test(t));
    let purple = 0;
    let total = 0;
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 40;
      canvas.height = 24;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      // Approximate via computed backgrounds of hero / hold / html
      const bg =
        getComputedStyle(hold || hero || document.documentElement).backgroundColor || "";
      const m = bg.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (m) {
        const r = +m[1];
        const g = +m[2];
        const b = +m[3];
        // #5b21b6 ≈ 91,33,182
        const dist = Math.hypot(r - 91, g - 33, b - 182);
        purple = dist < 80 ? 1 : 0;
        total = 1;
      }
    } catch {
      /* ignore */
    }
    const shotVisible = (() => {
      if (!shot) return false;
      if (shot instanceof HTMLImageElement) return shot.complete && shot.naturalWidth > 0;
      if (shot instanceof HTMLVideoElement) return shot.readyState >= 2 || Boolean(shot.poster);
      const r = shot.getBoundingClientRect();
      return r.width > 40 && r.height > 40;
    })();
    const heroRect = hero?.getBoundingClientRect();
    const style = hero ? getComputedStyle(hero) : null;
    return {
      path: location.pathname,
      lang: document.documentElement.lang,
      dir: document.documentElement.dir,
      hasHold: Boolean(hold),
      hasHero: Boolean(hero && heroRect && heroRect.width > 40),
      heroTextLen: (hero?.innerText || "").trim().length,
      hasShot: Boolean(shot),
      shotVisible,
      maxOpacity: style ? Number(style.opacity || 1) : 0,
      rootHidden: root?.style?.visibility === "hidden" || root?.hasAttribute("hidden"),
      softPending: root?.dataset?.softLocalePending === "1",
      loaderText,
      purpleRatio: total ? purple / total : 0,
      fullReloadMarker: window.__bizuplyBootId || null,
    };
  });
}

async function sampleDuringSwitch(page, ms = 1800, every = 50) {
  const frames = [];
  const started = Date.now();
  while (Date.now() - started < ms) {
    frames.push({ t: Date.now() - started, ...(await paintProbe(page)) });
    await page.waitForTimeout(every);
  }
  return frames;
}

async function switchViaUi(page, label) {
  // Aria label is localized ("Change language" / "החלפת שפה" / …).
  // Close any leftover mobile drawer so it cannot intercept clicks.
  const mobileDrawer = page.locator(".site-mobile[aria-modal='true'], .site-mobile[role='dialog']");
  if (await mobileDrawer.isVisible().catch(() => false)) {
    await page.keyboard.press("Escape").catch(() => {});
    await page.waitForTimeout(150);
  }

  let visibleLang = page
    .locator("button[aria-haspopup='listbox']")
    .filter({ visible: true })
    .first();
  if (!(await visibleLang.isVisible().catch(() => false))) {
    const burger = page.locator(".site-header__burger").filter({ visible: true }).first();
    await burger.click({ timeout: 5000 });
    await page.waitForTimeout(200);
    visibleLang = page
      .locator(".site-mobile button[aria-haspopup='listbox'], button[aria-haspopup='listbox']")
      .filter({ visible: true })
      .first();
  }
  await visibleLang.click({ timeout: 8000 });
  const menu = page.locator("[role='listbox']").filter({ visible: true }).first();
  const option = menu.getByRole("option", {
    name: new RegExp(`^${label.replace(/[()]/g, "\\$&")}$`),
  });
  await option.click({ timeout: 8000 });
}

async function waitHomeReady(page, expectedPath) {
  await page.waitForFunction(
    (p) => {
      const pathOk = location.pathname === p || (p === "/" && location.pathname === "/");
      const hero = document.querySelector("#root .hx-hero");
      const shot =
        document.querySelector("#root .bj-window") ||
        document.querySelector("#root .bj-title") ||
        document.querySelector("#root .hx-hero-shot-1") ||
        document.querySelector("#root .hx-hero-frame img");
      const hold = document.getElementById("bizuply-locale-hold");
      if (!pathOk) return false;
      if (hold) return false;
      if (!hero) return false;
      if (shot instanceof HTMLImageElement) return shot.complete && shot.naturalWidth > 0;
      return Boolean(shot);
    },
    expectedPath,
    { timeout: 20000 },
  );
}

async function runMatrix(browser, name, contextOptions, pairs) {
  const context = await browser.newContext(contextOptions);
  await context.addCookies([
    { name: "bizuply_lang", value: "en", domain: "127.0.0.1", path: "/" },
    { name: "bizuply_lang_preference", value: "en", domain: "127.0.0.1", path: "/" },
  ]);
  const page = await context.newPage();
  await page.addInitScript(() => {
    window.__bizuplyBootId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    try {
      localStorage.setItem("bizuply_lang_preference", "en");
    } catch {
      /* ignore */
    }
  });

  const results = [];
  await page.goto(`${BASE}/`, { waitUntil: "networkidle", timeout: 60000 });
  await waitHomeReady(page, "/");
  const bootId = await page.evaluate(() => window.__bizuplyBootId);

  for (const { from, to } of pairs) {
    if (page.url().includes(from.path) === false && from.path !== "/") {
      await page.goto(`${BASE}${from.path}`, { waitUntil: "networkidle" });
      await waitHomeReady(page, from.path);
    } else if (from.path === "/" && new URL(page.url()).pathname !== "/") {
      // soft-nav back to EN via UI when needed
    }

    const before = await paintProbe(page);
    const sampling = sampleDuringSwitch(page, 2200, 40);
    await switchViaUi(page, to.label);
    const frames = await sampling;
    await waitHomeReady(page, to.path);
    const after = await paintProbe(page);
    const afterBoot = await page.evaluate(() => window.__bizuplyBootId);
    const emptyPurple = frames.filter((f) => isEmptyPurpleSample(f));
    const sawLoader = frames.some((f) => (f.loaderText || []).length > 0);
    const fullReload = afterBoot !== bootId;
    const row = {
      name,
      from: from.path,
      to: to.path,
      beforePath: before.path,
      afterPath: after.path,
      afterLang: after.lang,
      emptyPurple: emptyPurple.length,
      sawLoader,
      fullReload,
      holdSeen: frames.some((f) => f.hasHold),
      sampleBad: emptyPurple.slice(0, 3),
    };
    results.push(row);
    console.log(JSON.stringify(row));
    if (emptyPurple.length || sawLoader || fullReload || after.path !== to.path) {
      const shot = path.join(OUT, `${name}-${from.code}-to-${to.code}-fail.png`);
      await page.screenshot({ path: shot, fullPage: false });
    }
  }

  await context.close();
  return results;
}

const pairs = [
  { from: LOCALES[0], to: LOCALES[1] }, // EN → HE
  { from: LOCALES[1], to: LOCALES[0] }, // HE → EN
  { from: LOCALES[0], to: LOCALES[2] }, // EN → ES
  { from: LOCALES[2], to: LOCALES[3] }, // ES → PT
  { from: LOCALES[3], to: LOCALES[4] }, // PT → AR
  { from: LOCALES[4], to: LOCALES[0] }, // AR → EN
];

const browser = await chromium.launch({ headless: true });
const all = [];

try {
  all.push(
    ...(await runMatrix(
      browser,
      "desktop",
      { viewport: { width: 1440, height: 900 }, locale: "en-US" },
      pairs,
    )),
  );
  all.push(
    ...(await runMatrix(
      browser,
      "mobile",
      { ...devices["iPhone 13"], locale: "en-US" },
      [
        { from: LOCALES[0], to: LOCALES[1] },
        { from: LOCALES[1], to: LOCALES[0] },
      ],
    )),
  );

  // Slow 4G EN→HE
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await page.addInitScript(() => {
      window.__bizuplyBootId = `slow-${Date.now()}`;
    });
    const client = await context.newCDPSession(page);
    await client.send("Network.emulateNetworkConditions", {
      offline: false,
      downloadThroughput: (1.6 * 1024 * 1024) / 8,
      uploadThroughput: (750 * 1024) / 8,
      latency: 150,
    });
    await page.goto(`${BASE}/`, { waitUntil: "domcontentloaded", timeout: 90000 });
    await waitHomeReady(page, "/");
    const bootId = await page.evaluate(() => window.__bizuplyBootId);
    const sampling = sampleDuringSwitch(page, 3500, 50);
    await switchViaUi(page, "עברית");
    const frames = await sampling;
    await waitHomeReady(page, "/he");
    const afterBoot = await page.evaluate(() => window.__bizuplyBootId);
    const emptyPurple = frames.filter((f) => isEmptyPurpleSample(f));
    const row = {
      name: "desktop-slow4g",
      from: "/",
      to: "/he",
      emptyPurple: emptyPurple.length,
      sawLoader: frames.some((f) => (f.loaderText || []).length > 0),
      fullReload: afterBoot !== bootId,
      holdSeen: frames.some((f) => f.hasHold),
      afterPath: (await paintProbe(page)).path,
    };
    all.push(row);
    console.log(JSON.stringify(row));
    await context.close();
  }

  // Hard refresh /he — preference must match URL or index.html early script
  // rewrites /he → / (pre-existing locale lock). Simulate a Hebrew visitor.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addCookies([
      { name: "bizuply_lang", value: "he", domain: "127.0.0.1", path: "/" },
      { name: "bizuply_lang_preference", value: "he", domain: "127.0.0.1", path: "/" },
    ]);
    const page = await context.newPage();
    await page.addInitScript(() => {
      try {
        localStorage.setItem("bizuply_lang_preference", "he");
        localStorage.setItem("bizuply_lang_manual", "he");
      } catch {
        /* ignore */
      }
    });
    await page.goto(`${BASE}/he`, { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForTimeout(120);
    const early = await paintProbe(page);
    await waitHomeReady(page, "/he");
    const ready = await paintProbe(page);
    const row = {
      name: "hard-refresh-he",
      path: ready.path,
      earlyHasHero: early.hasHero || early.hasHold,
      readyHasHero: ready.hasHero,
      readyHasShot: ready.shotVisible,
      lang: ready.lang,
    };
    all.push(row);
    console.log(JSON.stringify(row));
    await context.close();
  }
} finally {
  await browser.close();
}

const failed = all.filter(
  (r) =>
    (typeof r.emptyPurple === "number" && r.emptyPurple > 0) ||
    r.sawLoader ||
    r.fullReload ||
    (r.to && r.afterPath && r.afterPath !== r.to) ||
    (r.name === "hard-refresh-he" && (!r.readyHasHero || !r.readyHasShot)),
);

writeFileSync(path.join(OUT, "summary.json"), JSON.stringify({ all, failed }, null, 2));
console.log(JSON.stringify({ ok: failed.length === 0, failed: failed.length, out: OUT }));
process.exit(failed.length ? 1 : 0);
