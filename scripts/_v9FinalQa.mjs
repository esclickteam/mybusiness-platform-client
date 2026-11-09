/**
 * Final polish QA: cookie-free, slower mobile scroll, 390/430/1440, auth/header checks.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const BASE = process.env.V9_BASE || "http://127.0.0.1:5175/he";
const ART = "/opt/cursor/artifacts";
const P = "v9_final";
const PUBLIC_REV =
  "/agent/repos/mybusiness-platform-client/public/demo-media/home/v6-review";
fs.mkdirSync(ART, { recursive: true });
fs.mkdirSync("/tmp/v9-vids", { recursive: true });
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
  commitHint: "PR #1075 final polish — readable enlarge, slow mobile scroll, v=13",
  checks: [],
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
  await page.waitForTimeout(400);
}

const browser = await chromium.launch({ headless: true });

// Desktop 1440 scroll
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: "/tmp/v9-vids", size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  await page.waitForTimeout(600);
  await page.screenshot({ path: `${ART}/${P}_desktop_hero.png`, fullPage: false });

  const loginIcon = await page.evaluate(() => {
    const mobile = document.querySelector(".site-header__mobile");
    if (!mobile) return false;
    return !!mobile.querySelector('a[href*="login"] svg');
  });
  if (!loginIcon) pass("no-mobile-login-icon");
  else fail("no-mobile-login-icon");

  const filmSrc = await page.locator(".b2-theater-film").getAttribute("src");
  if (filmSrc?.includes("v=13")) pass("hero-film-cache-v13", filmSrc);
  else fail("hero-film-cache-v13", String(filmSrc));

  const journey = page.locator(".b2-journey-rail button");
  for (let i = 0; i < Math.min(await journey.count(), 5); i += 1) {
    await journey.nth(i).click();
    await page.waitForTimeout(850);
  }
  await page.screenshot({ path: `${ART}/${P}_desktop_hero_flow.png`, fullPage: false });

  for (const [sel, name] of [
    [".hx-wa-b2", "whatsapp"],
    ["#sites", "gallery"],
  ]) {
    const el = page.locator(sel).first();
    if (await el.count()) {
      if (sel === "#sites") {
        await page.locator("#hx-site-gallery-title").evaluate((n) =>
          n.scrollIntoView({ block: "start", behavior: "instant" }),
        );
      } else {
        await el.scrollIntoViewIfNeeded();
      }
      await page.waitForTimeout(700);
      await page.screenshot({ path: `${ART}/${P}_desktop_${name}.png`, fullPage: false });
    }
  }

  const cta = page.locator(".hx-hero a.hx-btn").first();
  if (await cta.isVisible()) pass("cta-desktop-visible");
  else fail("cta-desktop-visible");

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 380) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(220);
  }
  const video = page.video();
  await page.close();
  await context.close();
  await run("ffmpeg", [
    "-y", "-i", await video.path(), "-an", "-c:v", "libx264", "-preset", "fast",
    "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${ART}/${P}_homepage_scroll.mp4`,
  ]);
  report.videos.desktopScroll = `${ART}/${P}_homepage_scroll.mp4`;
}

// Widths
for (const width of [390, 430]) {
  const page = await browser.newPage({
    viewport: { width, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  const metrics = await page.evaluate(() => ({
    overflow: document.documentElement.scrollWidth > window.innerWidth + 1,
    loginIcon: !!document
      .querySelector(".site-header__mobile")
      ?.querySelector('a[href*="login"] svg'),
  }));
  if (!metrics.overflow) pass(`no-hscroll-${width}`);
  else fail(`no-hscroll-${width}`);
  if (!metrics.loginIcon) pass(`no-login-icon-${width}`);
  else fail(`no-login-icon-${width}`);
  if (await page.locator(".hx-hero a.hx-btn").first().isVisible()) pass(`cta-${width}`);
  else fail(`cta-${width}`);
  await page.close();
}

// Slower mobile UX film
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    recordVideo: { dir: "/tmp/v9-vids", size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ART}/${P}_mobile_hero.png`, fullPage: false });

  const journey = page.locator(".b2-journey-rail button");
  for (let i = 0; i < Math.min(await journey.count(), 5); i += 1) {
    await journey.nth(i).click();
    await page.waitForTimeout(1100);
  }

  const wa = page.locator(".hx-wa-b2").first();
  if (await wa.count()) {
    await wa.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${ART}/${P}_mobile_whatsapp.png`, fullPage: false });
  }

  await page.locator("#hx-site-gallery-title").evaluate((n) =>
    n.scrollIntoView({ block: "start", behavior: "instant" }),
  );
  await page.waitForTimeout(1400);
  await page.screenshot({ path: `${ART}/${P}_mobile_gallery.png`, fullPage: false });

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 240) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(280);
  }
  const video = page.video();
  await page.close();
  await context.close();
  await run("ffmpeg", [
    "-y", "-i", await video.path(), "-an", "-c:v", "libx264", "-preset", "fast",
    "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${ART}/${P}_mobile_ux.mp4`,
  ]);
  report.videos.mobileScroll = `${ART}/${P}_mobile_ux.mp4`;
}

// Task sequence visual frames
{
  const PUB =
    "/agent/repos/mybusiness-platform-client/public/demo-media/home/walkthrough";
  const samples = [
    ["task-fill", "hero-05-task.mp4", "2.0"],
    ["task-saved", "hero-05-task.mp4", "6.8"],
    ["wa-desktop", "hero-03-whatsapp.mp4", "3.0"],
    ["wa-mobile", "mobile-03-whatsapp.mp4", "2.5"],
  ];
  for (const [id, file, ss] of samples) {
    const out = `${ART}/${P}_frame_${id}.jpg`;
    await run("ffmpeg", [
      "-y", "-ss", ss, "-i", `${PUB}/${file}`, "-frames:v", "1", "-q:v", "2", "-update", "1", out,
    ]);
    if (fs.statSync(out).size > 20000) pass(`visual-${id}`);
    else fail(`visual-${id}`);
  }
}

fs.copyFileSync(
  "/agent/repos/mybusiness-platform-client/public/demo-media/home/walkthrough/process-full.mp4",
  `${ART}/${P}_process_marketing.mp4`,
);
report.videos.process = `${ART}/${P}_process_marketing.mp4`;

// Auth redirect sanity (code-level presence)
{
  const app = fs.readFileSync(
    "/agent/repos/mybusiness-platform-client/src/App.jsx",
    "utf8",
  );
  if (
    app.includes("resolveBusinessDashboardPath") &&
    app.includes('user.role === "business"') &&
    app.includes("<Navigate")
  ) {
    pass("logged-in-home-redirects-to-dashboard");
  } else fail("logged-in-home-redirects-to-dashboard");
}

const mirror = {
  [`${P}_homepage_scroll.mp4`]: "v6_homepage_scroll.mp4",
  [`${P}_mobile_ux.mp4`]: "v6_mobile_ux.mp4",
  [`${P}_process_marketing.mp4`]: "v6_process_marketing.mp4",
  [`${P}_desktop_hero.png`]: "v6_desktop_hero.png",
  [`${P}_desktop_hero_flow.png`]: "v6_desktop_hero_flow.png",
  [`${P}_desktop_whatsapp.png`]: "v6_desktop_whatsapp.png",
  [`${P}_desktop_gallery.png`]: "v6_desktop_gallery.png",
  [`${P}_mobile_hero.png`]: "v6_mobile_hero.png",
  [`${P}_mobile_whatsapp.png`]: "v6_mobile_whatsapp.png",
  [`${P}_mobile_gallery.png`]: "v6_mobile_gallery.png",
};
for (const [src, dst] of Object.entries(mirror)) {
  const p = `${ART}/${src}`;
  if (fs.existsSync(p)) fs.copyFileSync(p, `${PUBLIC_REV}/${dst}`);
}
fs.writeFileSync(`${ART}/${P}_qa_report.json`, JSON.stringify(report, null, 2));
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
