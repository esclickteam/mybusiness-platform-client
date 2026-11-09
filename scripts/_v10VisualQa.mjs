/**
 * Visual QA for V10 media rebuild: desktop + mobile homepage, gallery, films.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const BASE = process.env.V10_BASE || "http://127.0.0.1:5175/he";
const ART = "/opt/cursor/artifacts";
fs.mkdirSync(ART, { recursive: true });
fs.mkdirSync("/tmp/v10-vids", { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => { err += d.toString(); });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-600)))));
  });
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

const report = { pass: 0, fail: 0, checks: [] };
function pass(id, detail = "") { report.pass += 1; report.checks.push({ id, result: "PASS", detail }); }
function fail(id, detail = "") { report.fail += 1; report.checks.push({ id, result: "FAIL", detail }); }

const browser = await chromium.launch({ headless: true });

// Desktop
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: "/tmp/v10-vids", size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ART}/v10_desktop_home.png`, fullPage: false });

  const filmSrc = await page.locator(".b2-theater-film").first().getAttribute("src");
  if (filmSrc?.includes("v=20") && filmSrc.includes("1920") === false) {
    // src is path with v=20; resolution checked offline
    pass("film-cache-v20", filmSrc);
  } else if (filmSrc?.includes("v=20")) pass("film-cache-v20", filmSrc);
  else fail("film-cache-v20", String(filmSrc));

  const fit = await page.evaluate(() => {
    const v = document.querySelector(".b2-theater-film");
    if (!v) return null;
    return getComputedStyle(v).objectFit;
  });
  if (fit === "contain") pass("theater-object-fit-contain", fit);
  else fail("theater-object-fit-contain", String(fit));

  const ken = await page.evaluate(() => {
    const v = document.querySelector(".b2-theater-film");
    return v ? getComputedStyle(v).animationName : null;
  });
  if (!ken || ken === "none") pass("no-ken-burns");
  else fail("no-ken-burns", String(ken));

  // step through journey
  const rail = page.locator(".b2-journey-rail button");
  for (let i = 0; i < Math.min(await rail.count(), 5); i += 1) {
    await rail.nth(i).click();
    await page.waitForTimeout(900);
  }
  await page.screenshot({ path: `${ART}/v10_desktop_hero_flow.png`, fullPage: false });

  await page.locator("#sites").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${ART}/v10_desktop_gallery.png`, fullPage: false });
  const gallerySrc = await page.locator(".hx-site-gallery .pm-site-desktop img").getAttribute("src");
  if (gallerySrc?.includes("gallery-heroes") && gallerySrc.includes("-desktop.jpg")) {
    pass("gallery-desktop-hero", gallerySrc);
  } else fail("gallery-desktop-hero", String(gallerySrc));

  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += 420) {
    await page.evaluate((yy) => window.scrollTo({ top: yy, behavior: "instant" }), y);
    await page.waitForTimeout(200);
  }
  const video = page.video();
  await page.close();
  await context.close();
  await run("ffmpeg", [
    "-y", "-i", await video.path(), "-an", "-c:v", "libx264", "-preset", "fast",
    "-crf", "20", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    `${ART}/v10_final_homepage_scroll.mp4`,
  ]);
}

// Mobile
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    recordVideo: { dir: "/tmp/v10-vids", size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle", timeout: 90000 });
  await dismissCookie(page);
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${ART}/v10_mobile_home.png`, fullPage: false });

  const loginInMobile = await page.evaluate(() => {
    const m = document.querySelector(".site-header__mobile");
    return m ? !!m.querySelector('a[href*="login"]') : null;
  });
  if (!loginInMobile) pass("no-mobile-login-icon");
  else fail("no-mobile-login-icon");

  const filmSrc = await page.locator(".b2-theater-film").first().getAttribute("src");
  if (filmSrc?.includes("mobile-") && filmSrc.includes("v=20")) pass("mobile-dedicated-film", filmSrc);
  else fail("mobile-dedicated-film", String(filmSrc));

  await page.locator("#sites").scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  await page.screenshot({ path: `${ART}/v10_mobile_gallery.png`, fullPage: false });

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
    `${ART}/v10_final_mobile_ux.mp4`,
  ]);
}

// Process film copy
fs.copyFileSync(
  "public/demo-media/home/walkthrough/process-full.mp4",
  `${ART}/v10_final_process_marketing.mp4`,
);

await browser.close();
fs.writeFileSync(`${ART}/v10_qa_report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
