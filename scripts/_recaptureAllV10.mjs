/**
 * Robust V10 re-capture: wait for real demo content, hide chrome via DOM,
 * 1920×1080, no CSS scale, no crop-zoom. Rebuild hero/mobile/process.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = "6ab62f675ba1a92f3046b726";
const OUT = "/tmp/bizuply-films/v10b";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = 1920;
const VH = 1080;

fs.mkdirSync(OUT, { recursive: true });

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
    "-c:v", "libx264", "-preset", "slow", "-crf", "15",
    "-movflags", "+faststart", mp4,
  ]);
}

async function extractPoster(mp4, jpg, at = "1.0") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function masterClip(src, dest, poster, trimStart, duration) {
  await run("ffmpeg", [
    "-y", "-ss", String(trimStart), "-t", String(duration), "-i", src, "-an",
    "-vf", "fps=30,format=yuv420p,setsar=1",
    "-c:v", "libx264", "-preset", "slow", "-crf", "15",
    "-movflags", "+faststart", dest,
  ]);
  await extractPoster(dest, poster, "0.5");
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
    "-c:v", "libx264", "-preset", "slow", "-crf", "15",
    "-movflags", "+faststart", dest,
  ]);
  await extractPoster(dest, poster, "0.4");
}

function publish(mp4, jpg) {
  fs.copyFileSync(mp4, path.join(PUBLIC, path.basename(mp4)));
  fs.copyFileSync(jpg, path.join(PUBLIC, path.basename(jpg)));
  console.log("pub", path.basename(mp4), fs.statSync(mp4).size);
}

async function hideChrome(page) {
  await page.evaluate(() => {
    const kill = (el) => {
      if (!el) return;
      el.style.setProperty("display", "none", "important");
      el.style.setProperty("visibility", "hidden", "important");
      el.style.setProperty("pointer-events", "none", "important");
    };
    document.querySelectorAll("aside, [data-sidebar], [class*='Sidebar'], [class*='sidebar']").forEach(kill);
    document.querySelectorAll("[class*='cookie'], [id*='cookie'], [class*='Cookie']").forEach(kill);
    document.querySelectorAll("[class*='FloatingAssistant'], [class*='assistant-fab'], [class*='PushAlert']").forEach(kill);
    document.querySelectorAll("button[aria-label*='AI'], [class*='chat-widget']").forEach(kill);
    // Expand main
    document.querySelectorAll("main, [class*='MainContent'], [class*='page-content']").forEach((el) => {
      el.style.setProperty("margin", "0", "important");
      el.style.setProperty("padding", "12px 16px", "important");
      el.style.setProperty("width", "100%", "important");
      el.style.setProperty("max-width", "none", "important");
    });
    document.documentElement.style.background = "#eef1f8";
    document.body.style.background = "#eef1f8";
  });
}

async function waitRows(page, min = 1, timeout = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const n = await page.locator("table tbody tr").count().catch(() => 0);
    if (n >= min) return n;
    await page.waitForTimeout(400);
  }
  throw new Error(`Expected >=${min} table rows`);
}

async function waitText(page, re, timeout = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const ok = await page.evaluate((pattern) => new RegExp(pattern, "i").test(document.body?.innerText || ""), re.source);
    if (ok) return true;
    await page.waitForTimeout(400);
  }
  throw new Error(`Timeout waiting for ${re}`);
}

async function humanMove(page, locator, { click = false, steps = 18, pause = 350, after = 500 } = {}) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return false;
  await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5, { steps });
  await page.waitForTimeout(pause);
  if (click) {
    await page.mouse.down();
    await page.waitForTimeout(60);
    await page.mouse.up();
    await page.waitForTimeout(after);
  }
  return true;
}

async function ensureAuth() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: VW, height: VH }, locale: "he-IL" });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    try { localStorage.setItem("i18nextLng", "he"); localStorage.setItem("bizuply.lang", "he"); } catch {}
  });
  await page.locator('input[type="email"]').fill("customer-free-demo@bizuply.test");
  await page.locator('input[type="password"]').fill("DemoCustomer#2026");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard/**", { timeout: 45000 });
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, { waitUntil: "networkidle", timeout: 90000 });
  await waitRows(page, 1, 60000);
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth ok");
}

async function withRecording(name, action) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    locale: "he-IL",
    colorScheme: "light",
    storageState: AUTH,
    recordVideo: { dir: OUT, size: { width: VW, height: VH } },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    try { localStorage.setItem("i18nextLng", "he"); localStorage.setItem("bizuply.lang", "he"); } catch {}
  });
  await action(page);
  if (page.url().includes("/login")) throw new Error(`login for ${name}`);
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();
  const webm = await video.path();
  const dest = path.join(OUT, `${name}.webm`);
  fs.renameSync(webm, dest);
  const mp4 = path.join(OUT, `${name}.mp4`);
  await webmToMp4(dest, mp4);
  console.log("raw", name, fs.statSync(mp4).size);
  return mp4;
}

await ensureAuth();

await withRecording("01-lead", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, { waitUntil: "networkidle", timeout: 90000 });
  await waitRows(page, 3, 60000);
  await hideChrome(page);
  await page.waitForTimeout(800);
  const search = page.getByPlaceholder(/Search|חיפוש/i).first();
  await humanMove(page, search, { click: false, pause: 400 });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana|חדש|New/i }).first();
  await humanMove(page, row, { click: false, pause: 500 });
  await humanMove(page, row, { click: true, after: 1200 });
  await waitText(page, /WhatsApp|משימה|Task|סגירה/);
  await hideChrome(page);
  await humanMove(page, page.getByRole("button", { name: /WhatsApp/i }).first(), { click: false, pause: 700 });
  await humanMove(page, page.getByRole("button", { name: /Task|משימה/i }).first(), { click: false, pause: 800 });
  await page.waitForTimeout(1000);
});

await withRecording("02-crm", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, { waitUntil: "networkidle", timeout: 90000 });
  await waitRows(page, 3, 60000);
  await hideChrome(page);
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana/i }).first();
  await humanMove(page, row, { click: true, after: 1000 });
  await waitText(page, /סגירה|Close|WhatsApp/);
  await hideChrome(page);
  for (const name of [/WhatsApp/i, /Task|משימה/i, /Meeting|פגישה/i]) {
    await humanMove(page, page.getByRole("button", { name }).first(), { click: false, pause: 450 });
  }
  await page.getByText(/הערות ופעילות|Notes/i).first().click().catch(() => {});
  await page.waitForTimeout(1200);
  await hideChrome(page);
  await page.waitForTimeout(900);
});

await withRecording("03-whatsapp", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/whatsapp/inbox`, { waitUntil: "domcontentloaded", timeout: 90000 });
  // Wait until loading is gone and a chat/message is visible
  await waitText(page, /נקרא|התקבל|נמסר|Write a reply|כתבו תשובה|Yael|יעל|Abraham|אברהם/, 90000);
  await page.waitForTimeout(1000);
  await hideChrome(page);
  await page.waitForTimeout(600);
  // click a conversation if list present
  const item = page.locator('[role="listitem"], [class*="conversation"], [class*="thread"]').first();
  if (await item.count()) await humanMove(page, item, { click: true, after: 800 });
  await waitText(page, /כתבו תשובה|Write a reply|נקרא|התקבל/, 30000);
  await hideChrome(page);
  const reply = page.getByPlaceholder(/reply|תשובה|כתבו/i).first();
  await humanMove(page, reply, { click: false, pause: 900 });
  await page.waitForTimeout(1600);
});

await withRecording("04-automation", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/automations/${AUTO_ID}`, { waitUntil: "networkidle", timeout: 90000 });
  await waitText(page, /WhatsApp|CRM|פרסם|Publish|שמור|Delay|שעות/, 60000);
  await hideChrome(page);
  await page.waitForTimeout(900);
  await page.mouse.move(1100, 520, { steps: 20 });
  await page.waitForTimeout(500);
  await page.mouse.wheel(0, 160);
  await page.waitForTimeout(700);
  const pub = page.getByRole("button", { name: /פרסם|Publish|שמור|Save/i }).first();
  await humanMove(page, pub, { click: false, pause: 1000 });
  await page.waitForTimeout(1200);
});

await withRecording("05-task", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, { waitUntil: "networkidle", timeout: 90000 });
  await waitRows(page, 3, 60000);
  await hideChrome(page);
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana/i }).first();
  await humanMove(page, row, { click: true, after: 1000 });
  await waitText(page, /סגירה|Close/);
  await page.getByText(/^משימות$/).first().click();
  await page.waitForTimeout(700);
  const input = page.getByPlaceholder(/כתבו את המשימה לביצוע/i).first();
  await input.waitFor({ state: "visible", timeout: 20000 });
  await hideChrome(page);
  await humanMove(page, input, { click: true, after: 250 });
  await input.fill("שיחת חזרה — מעקב ליד חדש");
  await page.waitForTimeout(350);
  await page.locator('input[type="datetime-local"]').first().fill("2026-11-10T10:30");
  await page.waitForTimeout(450);
  await humanMove(page, page.getByRole("button", { name: /הוספת משימה/i }).first(), { click: true, after: 1600 });
  await waitText(page, /נשמר|Saved/, 20000).catch(() => {});
  await page.waitForTimeout(2200);
});

const masters = {
  "01-lead": { start: 3.5, dur: 7.0 },
  "02-crm": { start: 3.5, dur: 7.0 },
  "03-whatsapp": { start: 4.0, dur: 7.0 },
  "04-automation": { start: 2.5, dur: 6.5 },
  "05-task": { start: 4.0, dur: 11.0 },
};

for (const [name, t] of Object.entries(masters)) {
  const outMp4 = path.join(OUT, `hero-${name}.mp4`);
  const outJpg = path.join(OUT, `hero-${name}.jpg`);
  await masterClip(path.join(OUT, `${name}.mp4`), outMp4, outJpg, t.start, t.dur);
  publish(outMp4, outJpg);
}

const mobileSpecs = {
  "01-lead": { trimStart: 6.0, duration: 5.5, crop: "min(iw*0.78\\,1500):min(ih*0.88\\,980):(iw-ow)/2:(ih-oh)*0.1" },
  "02-crm": { trimStart: 5.5, duration: 5.5, crop: "min(iw*0.7\\,1400):min(ih*0.9\\,1000):(iw-ow)/2:(ih-oh)*0.06" },
  "03-whatsapp": { trimStart: 5.0, duration: 6.0, crop: "min(iw*0.58\\,1200):min(ih*0.92\\,1000):(iw-ow)*0.62:(ih-oh)*0.04" },
  "04-automation": { trimStart: 3.5, duration: 5.5, crop: "min(iw*0.88\\,1680):min(ih*0.78\\,900):(iw-ow)/2:(ih-oh)*0.18" },
  "05-task": { trimStart: 6.0, duration: 9.0, crop: "min(iw*0.68\\,1300):min(ih*0.9\\,1000):(iw-ow)/2:(ih-oh)*0.08" },
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
  await masterClip(path.join(OUT, `${name}.mp4`), part, path.join(OUT, `proc-${name}.jpg`), t.start, Math.min(t.dur, 5.8));
  parts.push(part);
}
fs.writeFileSync(path.join(OUT, "concat.txt"), parts.map((p) => `file '${p}'`).join("\n"));
const processMp4 = path.join(OUT, "process-full.mp4");
const processJpg = path.join(OUT, "process-full.jpg");
await run("ffmpeg", [
  "-y", "-f", "concat", "-safe", "0", "-i", path.join(OUT, "concat.txt"), "-an",
  "-c:v", "libx264", "-preset", "slow", "-crf", "15",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", processMp4,
]);
await extractPoster(processMp4, processJpg, "2.5");
publish(processMp4, processJpg);

for (const name of Object.keys(masters)) {
  fs.copyFileSync(path.join(OUT, `${name}.mp4`), path.join(PUBLIC, `${name}.mp4`));
  await extractPoster(path.join(OUT, `${name}.mp4`), path.join(PUBLIC, `${name}.jpg`), "3.0");
}

console.log("V10b complete");
