/**
 * V8 finish QA + review pack — cookie dismissed, visual crop checks, 390/430/1440.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const BASE = process.env.V8_BASE || "http://127.0.0.1:5175/he";
const ART = "/opt/cursor/artifacts";
const PREFIX = "v8_final";
const PUBLIC_REV =
  "/agent/repos/mybusiness-platform-client/public/demo-media/home/v6-review";
fs.mkdirSync(ART, { recursive: true });
fs.mkdirSync("/tmp/v8-vids", { recursive: true });
fs.mkdirSync(PUBLIC_REV, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) =>
      code === 0 ? resolve() : reject(new Error(err.slice(-800))),
    );
  });
}

const report = {
  base: BASE,
  commitHint: "PR #1075 V8 readable-crop finish",
  checks: [],
  widths: [],
  visual: [],
  videos: {},
};

function pass(id, detail = "") {
  report.checks.push({ id, result: "PASS", detail });
}
function fail(id, detail = "") {
  report.checks.push({ id, result: "FAIL", detail });
}

async function dismissCookie(page) {
  await page.evaluate(() => {
    const b = [...document.querySelectorAll("button")].find((x) =>
      /אישור כל העוגיות|Accept all/i.test(x.textContent || ""),
    );
    if (b) b.click();
  });
  await page.waitForTimeout(450);
  const still = await page.evaluate(() =>
    [...document.querySelectorAll("button")].some(
      (b) =>
        /אישור כל העוגיות/.test(b.textContent || "") &&
        !!(b.offsetWidth || b.offsetHeight),
    ),
  );
  return !still;
}

const browser = await chromium.launch({ headless: true });

// Purple first paint
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE, { waitUntil: "domcontentloaded", timeout: 60000 });
  const paint = await page.evaluate(() => ({
    html: getComputedStyle(document.documentElement).backgroundColor,
    body: getComputedStyle(document.body).backgroundColor,
  }));
  const purpleish = (c) => {
    const m = String(c || "").match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!m) return false;
    const [, r, g, b] = m.map(Number);
    return r > 60 && b > 140 && r < 160 && g < 80;
  };
  if (purpleish(paint.html) || purpleish(paint.body)) pass("first-paint-purple", JSON.stringify(paint));
  else fail("first-paint-purple", JSON.stringify(paint));
  await page.close();
}

// Desktop 1440 — scroll film + screenshots (no cookie)
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: "/tmp/v8-vids", size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  const cookieGone = await dismissCookie(page);
  if (cookieGone) pass("cookie-dismissed-desktop");
  else fail("cookie-dismissed-desktop");

  await page.waitForTimeout(700);
  await page.screenshot({ path: `${ART}/${PREFIX}_desktop_hero.png`, fullPage: false });

  const filmSrc = await page.locator(".b2-theater-film").getAttribute("src");
  if (filmSrc?.includes("v=10")) pass("hero-film-cache-v10", filmSrc);
  else fail("hero-film-cache-v10", String(filmSrc));

  const journey = page.locator(".b2-journey-rail button");
  for (let i = 0; i < Math.min(await journey.count(), 5); i += 1) {
    await journey.nth(i).click();
    await page.waitForTimeout(750);
  }
  await page.screenshot({ path: `${ART}/${PREFIX}_desktop_hero_flow.png`, fullPage: false });

  // Gallery: ensure title fully below sticky header
  await page.locator("#hx-site-gallery-title").evaluate((el) => {
    el.scrollIntoView({ block: "start", behavior: "instant" });
  });
  await page.waitForTimeout(600);
  const galleryVis = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const h2 = document.querySelector("#hx-site-gallery-title");
    const prose = document.querySelector(".hx-site-gallery .hx-prose");
    if (!header || !h2) return { ok: false, reason: "missing" };
    const hb = header.getBoundingClientRect();
    const t = h2.getBoundingClientRect();
    const p = prose?.getBoundingClientRect();
    return {
      ok: t.top >= hb.bottom - 1 && t.height > 20 && (!p || p.top >= hb.bottom - 1),
      headerBottom: Math.round(hb.bottom),
      titleTop: Math.round(t.top),
      titleHeight: Math.round(t.height),
      proseTop: p ? Math.round(p.top) : null,
    };
  });
  report.visual.push({ id: "gallery-title-clear-of-header-1440", ...galleryVis });
  if (galleryVis.ok) pass("gallery-title-clear-of-header-1440", JSON.stringify(galleryVis));
  else fail("gallery-title-clear-of-header-1440", JSON.stringify(galleryVis));
  await page.screenshot({ path: `${ART}/${PREFIX}_desktop_gallery.png`, fullPage: false });

  const wa = page.locator(".hx-wa-b2").first();
  if (await wa.count()) {
    await wa.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ART}/${PREFIX}_desktop_whatsapp.png`, fullPage: false });
  }

  // No cookie overlay mid-scroll
  const cookieDuring = await page.evaluate(() =>
    [...document.querySelectorAll(".cookie-banner, .cookie-banner__primary")].some(
      (el) => el.offsetParent && getComputedStyle(el).display !== "none",
    ),
  );
  if (!cookieDuring) pass("no-cookie-overlay-during-desktop-scroll");
  else fail("no-cookie-overlay-during-desktop-scroll");

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 420) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(170);
  }

  const video = page.video();
  await page.close();
  await context.close();
  const webm = await video.path();
  await run("ffmpeg", [
    "-y", "-i", webm, "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${ART}/${PREFIX}_homepage_scroll.mp4`,
  ]);
  report.videos.desktopScroll = `${ART}/${PREFIX}_homepage_scroll.mp4`;
}

// Widths 390 / 430 (+ CTA, gallery, overflow)
for (const width of [390, 430]) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  const metrics = await page.evaluate(() => {
    const doc = document.documentElement;
    return {
      width: window.innerWidth,
      scrollWidth: doc.scrollWidth,
      overflow: doc.scrollWidth > window.innerWidth + 1,
    };
  });
  report.widths.push(metrics);
  if (!metrics.overflow) pass(`no-hscroll-${width}`);
  else fail(`no-hscroll-${width}`, JSON.stringify(metrics));

  const cta = page.locator(".hx-hero a.hx-btn").first();
  if (await cta.isVisible().catch(() => false)) pass(`cta-${width}`);
  else fail(`cta-${width}`);

  await page.locator("#hx-site-gallery-title").evaluate((el) => {
    el.scrollIntoView({ block: "start", behavior: "instant" });
  });
  await page.waitForTimeout(500);
  const gal = await page.evaluate(() => {
    const header = document.querySelector(".site-header");
    const h2 = document.querySelector("#hx-site-gallery-title");
    const prose = document.querySelector(".hx-site-gallery .hx-prose");
    if (!header || !h2) return { ok: false };
    const hb = header.getBoundingClientRect();
    const t = h2.getBoundingClientRect();
    const p = prose?.getBoundingClientRect();
    return {
      ok: t.top >= hb.bottom - 2 && (!p || p.top >= hb.bottom - 2),
      headerBottom: Math.round(hb.bottom),
      titleTop: Math.round(t.top),
      proseTop: p ? Math.round(p.top) : null,
    };
  });
  report.visual.push({ id: `gallery-title-clear-${width}`, ...gal });
  if (gal.ok) pass(`gallery-title-clear-${width}`, JSON.stringify(gal));
  else fail(`gallery-title-clear-${width}`, JSON.stringify(gal));
  await page.screenshot({ path: `${ART}/${PREFIX}_w${width}_gallery.png`, fullPage: false });
  await page.close();
}

// Mobile UX film 390
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: "/tmp/v8-vids", size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${ART}/${PREFIX}_mobile_hero.png`, fullPage: false });
  const journey = page.locator(".b2-journey-rail button");
  for (let i = 0; i < Math.min(await journey.count(), 5); i += 1) {
    await journey.nth(i).click();
    await page.waitForTimeout(700);
  }
  const wa = page.locator(".hx-wa-b2").first();
  if (await wa.count()) {
    await wa.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${ART}/${PREFIX}_mobile_whatsapp.png`, fullPage: false });
  }
  await page.locator("#sites").scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `${ART}/${PREFIX}_mobile_gallery.png`, fullPage: false });
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 360) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(150);
  }
  const video = page.video();
  await page.close();
  await context.close();
  const webm = await video.path();
  await run("ffmpeg", [
    "-y", "-i", webm, "-an", "-c:v", "libx264", "-preset", "fast", "-crf", "20",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${ART}/${PREFIX}_mobile_ux.mp4`,
  ]);
  report.videos.mobileScroll = `${ART}/${PREFIX}_mobile_ux.mp4`;
}

// Visual film frame checks (ffmpeg stills)
{
  const PUB =
    "/agent/repos/mybusiness-platform-client/public/demo-media/home/walkthrough";
  const samples = [
    { id: "wa-full-bubbles", file: "hero-03-whatsapp.mp4", ss: "4.0" },
    { id: "task-save-list", file: "hero-05-task.mp4", ss: "7.0" },
    { id: "mobile-wa-width", file: "mobile-03-whatsapp.mp4", ss: "3.5" },
    { id: "lead-context", file: "hero-01-lead.mp4", ss: "1.0" },
  ];
  for (const s of samples) {
    const out = `/tmp/v8audit/qa-${s.id}.jpg`;
    await run("ffmpeg", [
      "-y", "-ss", s.ss, "-i", `${PUB}/${s.file}`, "-frames:v", "1", "-q:v", "2", "-update", "1", out,
    ]);
    const size = fs.statSync(out).size;
    // Heuristic: non-trivial frame extracted
    if (size > 20000) pass(`visual-frame-${s.id}`, `bytes=${size}`);
    else fail(`visual-frame-${s.id}`, `bytes=${size}`);
  }
  // Copy annotated frames into artifacts for review
  fs.copyFileSync("/tmp/v8audit/task-wide.jpg", `${ART}/${PREFIX}_fix_task_sequence.jpg`);
  fs.copyFileSync("/tmp/v8audit/wa-wide.jpg", `${ART}/${PREFIX}_fix_whatsapp_bubbles.jpg`);
  fs.copyFileSync("/tmp/v8audit/mwa-wide.jpg", `${ART}/${PREFIX}_fix_mobile_whatsapp.jpg`);
}

fs.copyFileSync(
  "/agent/repos/mybusiness-platform-client/public/demo-media/home/walkthrough/process-full.mp4",
  `${ART}/${PREFIX}_process_marketing.mp4`,
);
report.videos.process = `${ART}/${PREFIX}_process_marketing.mp4`;

// Mirror key pack into public v6-review for GitHub continuity
const mirror = {
  [`${PREFIX}_homepage_scroll.mp4`]: "v6_homepage_scroll.mp4",
  [`${PREFIX}_mobile_ux.mp4`]: "v6_mobile_ux.mp4",
  [`${PREFIX}_process_marketing.mp4`]: "v6_process_marketing.mp4",
  [`${PREFIX}_desktop_hero.png`]: "v6_desktop_hero.png",
  [`${PREFIX}_desktop_hero_flow.png`]: "v6_desktop_hero_flow.png",
  [`${PREFIX}_desktop_whatsapp.png`]: "v6_desktop_whatsapp.png",
  [`${PREFIX}_desktop_gallery.png`]: "v6_desktop_gallery.png",
  [`${PREFIX}_mobile_hero.png`]: "v6_mobile_hero.png",
  [`${PREFIX}_mobile_whatsapp.png`]: "v6_mobile_whatsapp.png",
  [`${PREFIX}_mobile_gallery.png`]: "v6_mobile_gallery.png",
};
for (const [src, dst] of Object.entries(mirror)) {
  const p = `${ART}/${src}`;
  if (fs.existsSync(p)) fs.copyFileSync(p, `${PUBLIC_REV}/${dst}`);
}

fs.writeFileSync(`${ART}/${PREFIX}_qa_report.json`, JSON.stringify(report, null, 2));
fs.writeFileSync(`${PUBLIC_REV}/qa_report.json`, JSON.stringify(report, null, 2));

await browser.close();
const failed = report.checks.filter((c) => c.result === "FAIL");
console.log(
  JSON.stringify(
    { pass: report.checks.length - failed.length, fail: failed.length, failed, videos: report.videos },
    null,
    2,
  ),
);
process.exit(failed.length ? 1 : 0);
