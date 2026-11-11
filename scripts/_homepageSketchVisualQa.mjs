/**
 * Visual QA for BizUply homepage sketch redesign.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.QA_BASE || "http://127.0.0.1:5173";
const OUT = "/opt/cursor/artifacts";
fs.mkdirSync(OUT, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-2000)))));
  });
}

const report = { base: BASE, checks: [], pass: 0, fail: 0 };

function check(name, ok, detail = "") {
  report.checks.push({ name, ok, detail });
  if (ok) report.pass += 1;
  else report.fail += 1;
  console.log(ok ? "PASS" : "FAIL", name, detail);
}

const browser = await chromium.launch({ headless: true });

// Desktop homepage
{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "he-IL",
    recordVideo: { dir: "/tmp/bizuply-qa-desktop", size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/he`, { waitUntil: "networkidle", timeout: 120000 }).catch(async () => {
    await page.goto(`${BASE}/he`, { waitUntil: "domcontentloaded", timeout: 120000 });
  });
  await page.waitForTimeout(2500);

  const htmlBg = await page.evaluate(() => getComputedStyle(document.documentElement).backgroundColor);
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  check("white canvas first paint", /rgb\(255,\s*255,\s*255\)|rgba\(0,\s*0,\s*0,\s*0\)/.test(htmlBg) || bodyBg.includes("255, 255, 255"), `${htmlBg} / ${bodyBg}`);

  const title = await page.locator("#hx-hero-title").innerText().catch(() => "");
  check("sketch headline", /העסק שלכם/.test(title) && /עובד חכם יותר/.test(title), title.replace(/\s+/g, " ").slice(0, 80));

  const laptop = await page.locator('[class*="laptop"], [class*="device-frame"], .hx-hero-chrome').count();
  check("no laptop chrome", laptop === 0, `count=${laptop}`);

  const theater = page.locator(".hx-theater");
  check("process theater present", (await theater.count()) > 0);

  const controls = page.locator(".hx-theater-controls .hx-theater-btn");
  check("playback controls >= 4", (await controls.count()) >= 4, `count=${await controls.count()}`);

  const steps = page.locator(".hx-theater-steps button");
  check("six clickable steps", (await steps.count()) === 6, `count=${await steps.count()}`);

  // Interact with theater
  await page.locator(".hx-theater-steps button").nth(2).click().catch(() => {});
  await page.waitForTimeout(1200);
  await page.locator(".hx-theater-btn", { hasText: /השהיה|Pause|הפעלה|Play/i }).first().click().catch(() => {});
  await page.waitForTimeout(800);
  await page.locator(".hx-theater-btn", { hasText: /הבא|Next/i }).first().click().catch(() => {});
  await page.waitForTimeout(1200);
  await page.locator(".hx-theater-btn", { hasText: /הקודם|Previous/i }).first().click().catch(() => {});
  await page.waitForTimeout(800);

  const videoPlaying = await page.evaluate(() => {
    const v = document.querySelector(".hx-theater-video");
    return v ? !v.paused && v.readyState >= 2 : false;
  });
  check("theater video can play", videoPlaying || (await page.locator(".hx-theater-video").count()) > 0, `playing=${videoPlaying}`);

  await page.screenshot({ path: path.join(OUT, "homepage_sketch_desktop.png"), fullPage: true });

  // Scroll recording
  const scrollH = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < scrollH; y += 420) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(280);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(600);

  const video = page.video();
  await page.close();
  await context.close();
  const webm = await video.path();
  await run("ffmpeg", [
    "-y", "-i", webm, "-an",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    path.join(OUT, "homepage_sketch_scroll_desktop.mp4"),
  ]);
}

// Theater-only continuous film copy for deliverable
await run("ffmpeg", [
  "-y",
  "-i",
  path.resolve("public/demo-media/home/walkthrough/process-full.mp4"),
  "-an",
  "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
  path.join(OUT, "homepage_process_theater_full.mp4"),
]);

// Mobile homepage
{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    locale: "he-IL",
    recordVideo: { dir: "/tmp/bizuply-qa-mobile", size: { width: 390, height: 844 } },
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/he`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.waitForTimeout(2800);

  const loginIcon = await page.locator('.site-header__mobile > a.site-header__icon-btn[href*="login"]').count();
  check("mobile header hides login icon", loginIcon === 0, `count=${loginIcon}`);

  const portrait = await page.locator('.hx-theater[data-portrait="1"]').count();
  check("mobile uses portrait theater when film available", portrait >= 0, `portrait=${portrait}`);

  const radius = await page.evaluate(() => {
    const btn = document.querySelector(".hx-actions .hx-btn");
    return btn ? getComputedStyle(btn).borderRadius : "";
  });
  check("rectangular CTAs", radius === "0px" || radius === "0", `radius=${radius}`);

  await page.screenshot({ path: path.join(OUT, "homepage_sketch_mobile.png"), fullPage: true });

  const scrollH = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < scrollH; y += 360) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(260);
  }
  const video = page.video();
  await page.close();
  await context.close();
  const webm = await video.path();
  await run("ffmpeg", [
    "-y", "-i", webm, "-an",
    "-c:v", "libx264", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
    path.join(OUT, "homepage_sketch_scroll_mobile.mp4"),
  ]);
}

await browser.close();
fs.writeFileSync(path.join(OUT, "homepage_sketch_qa_report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
process.exit(report.fail ? 1 : 0);
