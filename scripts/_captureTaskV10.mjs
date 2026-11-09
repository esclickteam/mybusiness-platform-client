/**
 * Finish V10 capture for task + build hero/mobile/process from all masters.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const OUT = "/tmp/bizuply-films/v10";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = 1920;
const VH = 1080;

const CLEAN = `
  html, body { background: #eef1f8 !important; }
  aside, [data-sidebar], [class*="Sidebar"], [class*="sidebar"]:not(main *):not([role="dialog"] *),
  nav[class*="side"], [class*="TopBar"], [class*="topbar"], [class*="DashboardHeader"], [class*="AppHeader"],
  [class*="cookie"], [id*="cookie"], [class*="Cookie"], [class*="PushAlert"], [class*="push-alert"],
  [class*="FloatingAssistant"], [class*="assistant-fab"], button[aria-label*="AI"],
  [class*="chat-widget"], [class*="ChatWidget"] {
    display: none !important; visibility: hidden !important; pointer-events: none !important;
  }
  [class*="with-sidebar"], [class*="layout"], [class*="Layout"] {
    padding-inline-start: 0 !important; margin-inline-start: 0 !important;
  }
  main, [class*="MainContent"], [class*="main-content"], [class*="page-content"],
  [class*="DashboardMain"], [class*="content-area"] {
    margin: 0 !important; padding: 16px 20px !important; max-width: none !important; width: 100% !important;
  }
`;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => { err += d.toString(); });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-1600)))));
  });
}

async function webmToMp4(webm, mp4) {
  await run("ffmpeg", [
    "-y", "-i", webm, "-an", "-vf", "fps=30,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-movflags", "+faststart", mp4,
  ]);
}

async function extractPoster(mp4, jpg, at = "1.0") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function waitLoadingGone(page, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const busy = await page.evaluate(() => /טוען|Loading|Please wait/i.test((document.body?.innerText || "").slice(0, 400)));
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

async function humanMove(page, locator, { click = false, steps = 20, pause = 400, after = 500 } = {}) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return false;
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.5, { steps });
  await page.waitForTimeout(pause);
  if (click) {
    await page.mouse.down();
    await page.waitForTimeout(70);
    await page.mouse.up();
    await page.waitForTimeout(after);
  }
  return true;
}

async function masterClip(src, dest, poster, trimStart, duration) {
  await run("ffmpeg", [
    "-y", "-ss", String(trimStart), "-t", String(duration), "-i", src, "-an",
    "-vf", "fps=30,format=yuv420p,setsar=1",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-movflags", "+faststart", dest,
  ]);
  await extractPoster(dest, poster, "0.6");
}

async function mobilePanel(src, dest, poster, { trimStart, duration, crop }) {
  const vf = [
    `trim=start=${trimStart}:duration=${duration}`,
    "setpts=PTS-STARTPTS",
    `crop=${crop}`,
    "scale='min(1080,iw)':'min(1350,ih)':force_original_aspect_ratio=decrease:flags=lanczos",
    "pad=1080:1350:(ow-iw)/2:(oh-ih)/2:#12061f",
    "fps=30", "format=yuv420p", "setsar=1",
  ].join(",");
  await run("ffmpeg", [
    "-y", "-i", src, "-an", "-vf", vf,
    "-c:v", "libx264", "-preset", "slow", "-crf", "16", "-movflags", "+faststart", dest,
  ]);
  await extractPoster(dest, poster, "0.5");
}

function publish(mp4, jpg) {
  fs.copyFileSync(mp4, path.join(PUBLIC, path.basename(mp4)));
  fs.copyFileSync(jpg, path.join(PUBLIC, path.basename(jpg)));
  console.log("pub", path.basename(mp4), fs.statSync(mp4).size);
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: 1,
  locale: "he-IL",
  colorScheme: "light",
  storageState: AUTH,
  recordVideo: { dir: OUT, size: { width: VW, height: VH } },
});
const page = await context.newPage();
await page.addInitScript(() => {
  try {
    localStorage.setItem("i18nextLng", "he");
    localStorage.setItem("bizuply.lang", "he");
  } catch { /* ignore */ }
});

await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, { waitUntil: "networkidle", timeout: 90000 });
await waitLoadingGone(page);
await page.addStyleTag({ content: CLEAN });
const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana/i }).first();
await humanMove(page, row, { click: true, steps: 20, after: 1000 });
await waitLoadingGone(page, 45000);
await page.getByText(/^משימות$/).first().click();
await page.waitForTimeout(800);
const input = page.getByPlaceholder(/כתבו את המשימה לביצוע/i).first();
await input.waitFor({ state: "visible", timeout: 15000 });
await humanMove(page, input, { click: true, steps: 14, after: 300 });
await input.fill("שיחת חזרה — מעקב ליד חדש");
await page.waitForTimeout(400);
const dt = page.locator('input[type="datetime-local"]').first();
await dt.fill("2026-11-10T10:30");
await page.waitForTimeout(500);
const add = page.getByRole("button", { name: /הוספת משימה|Add Task/i }).first();
await humanMove(page, add, { click: true, steps: 14, after: 1500 });
await page.waitForTimeout(2500);

const video = page.video();
await page.close();
await context.close();
await browser.close();
const webm = await video.path();
const destWebm = path.join(OUT, "05-task.webm");
fs.renameSync(webm, destWebm);
await webmToMp4(destWebm, path.join(OUT, "05-task.mp4"));
console.log("raw 05-task", fs.statSync(path.join(OUT, "05-task.mp4")).size);

const masters = {
  "01-lead": { start: 2.0, dur: 6.5 },
  "02-crm": { start: 2.2, dur: 7.0 },
  "03-whatsapp": { start: 1.8, dur: 6.5 },
  "04-automation": { start: 1.6, dur: 6.0 },
  "05-task": { start: 3.0, dur: 11.0 },
};

for (const [name, t] of Object.entries(masters)) {
  const src = path.join(OUT, `${name}.mp4`);
  const outMp4 = path.join(OUT, `hero-${name}.mp4`);
  const outJpg = path.join(OUT, `hero-${name}.jpg`);
  await masterClip(src, outMp4, outJpg, t.start, t.dur);
  publish(outMp4, outJpg);
}

const mobileSpecs = {
  "01-lead": { trimStart: 4.5, duration: 5.5, crop: "min(iw\\,1400):min(ih\\,900):(iw-ow)/2:40" },
  "02-crm": { trimStart: 4.0, duration: 5.5, crop: "min(iw*0.72\\,1400):min(ih*0.88\\,980):(iw-ow)/2:(ih-oh)*0.08" },
  "03-whatsapp": { trimStart: 2.5, duration: 5.8, crop: "min(iw*0.62\\,1200):min(ih*0.92\\,1000):(iw-ow)*0.55:(ih-oh)*0.05" },
  "04-automation": { trimStart: 2.0, duration: 5.5, crop: "min(iw*0.85\\,1600):min(ih*0.75\\,900):(iw-ow)/2:(ih-oh)*0.2" },
  "05-task": { trimStart: 5.0, duration: 9.0, crop: "min(iw*0.7\\,1300):min(ih*0.9\\,1000):(iw-ow)/2:(ih-oh)*0.08" },
};

for (const [name, spec] of Object.entries(mobileSpecs)) {
  const outMp4 = path.join(OUT, `mobile-${name}.mp4`);
  const outJpg = path.join(OUT, `mobile-${name}.jpg`);
  await mobilePanel(path.join(OUT, `${name}.mp4`), outMp4, outJpg, spec);
  publish(outMp4, outJpg);
}

const parts = [];
for (const [name, t] of Object.entries(masters)) {
  const part = path.join(OUT, `proc-${name}.mp4`);
  await masterClip(path.join(OUT, `${name}.mp4`), part, path.join(OUT, `proc-${name}.jpg`), t.start, Math.min(t.dur, 5.5));
  parts.push(part);
}
const list = path.join(OUT, "concat.txt");
fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join("\n"));
const processMp4 = path.join(OUT, "process-full.mp4");
const processJpg = path.join(OUT, "process-full.jpg");
await run("ffmpeg", [
  "-y", "-f", "concat", "-safe", "0", "-i", list, "-an",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", processMp4,
]);
await extractPoster(processMp4, processJpg, "2.0");
publish(processMp4, processJpg);

for (const name of Object.keys(masters)) {
  fs.copyFileSync(path.join(OUT, `${name}.mp4`), path.join(PUBLIC, `${name}.mp4`));
  await extractPoster(path.join(OUT, `${name}.mp4`), path.join(PUBLIC, `${name}.jpg`), "2.0");
}

console.log("V10 build complete");
