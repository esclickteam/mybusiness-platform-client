/**
 * V10 root-quality capture: 1920×1080 masters, no CSS scale, no crop-zoom polish.
 * Desktop clips keep full UI. Mobile clips are native-pixel action panels padded
 * into a vertical frame (never upscaled past source).
 *
 * Usage: node scripts/_captureHomepageWalkthroughV10.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = "6ab62f675ba1a92f3046b726";
const OUT = "/tmp/bizuply-films/v10";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = 1920;
const VH = 1080;

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PUBLIC, { recursive: true });

const CLEAN = `
  html, body { background: #eef1f8 !important; }
  aside,
  [data-sidebar],
  [class*="Sidebar"],
  [class*="sidebar"]:not(main *):not([role="dialog"] *),
  nav[class*="side"],
  [class*="TopBar"],
  [class*="topbar"],
  [class*="DashboardHeader"],
  [class*="AppHeader"],
  [class*="cookie"],
  [id*="cookie"],
  [class*="Cookie"],
  [class*="PushAlert"],
  [class*="push-alert"],
  [class*="FloatingAssistant"],
  [class*="assistant-fab"],
  button[aria-label*="AI"],
  [class*="chat-widget"],
  [class*="ChatWidget"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
  [class*="with-sidebar"],
  [class*="layout"],
  [class*="Layout"] {
    padding-inline-start: 0 !important;
    margin-inline-start: 0 !important;
  }
  main,
  [class*="MainContent"],
  [class*="main-content"],
  [class*="page-content"],
  [class*="DashboardMain"],
  [class*="content-area"] {
    margin: 0 !important;
    padding: 16px 20px !important;
    max-width: none !important;
    width: 100% !important;
  }
`;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-1600)))));
  });
}

async function webmToMp4(webm, mp4) {
  await run("ffmpeg", [
    "-y", "-i", webm, "-an",
    "-vf", "fps=30,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-movflags", "+faststart", mp4,
  ]);
}

async function extractPoster(mp4, jpg, at = "1.0") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function waitLoadingGone(page, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const busy = await page.evaluate(() => {
      const t = document.body?.innerText || "";
      return /טוען|Loading|Please wait/i.test(t.slice(0, 400));
    });
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

async function humanMove(page, locator, { click = false, steps = 20, pause = 400, after = 500 } = {}) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return false;
  const x = box.x + box.width * 0.55;
  const y = box.y + box.height * 0.5;
  await page.mouse.move(x, y, { steps });
  await page.waitForTimeout(pause);
  if (click) {
    await page.mouse.down();
    await page.waitForTimeout(70);
    await page.mouse.up();
    await page.waitForTimeout(after);
  }
  return true;
}

async function ensureAuth() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    locale: "he-IL",
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    try {
      localStorage.setItem("i18nextLng", "he");
      localStorage.setItem("bizuply.lang", "he");
    } catch { /* ignore */ }
  });
  await page.locator('input[type="email"]').fill("customer-free-demo@bizuply.test");
  await page.locator('input[type="password"]').fill("DemoCustomer#2026");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard/**", { timeout: 45000 });
  await page.waitForTimeout(1000);
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page, 25000);
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth saved");
}

async function withRecording(name, action) {
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
  await action(page);
  if (page.url().includes("/login")) throw new Error(`Auth failed for ${name}`);
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();
  const webm = await video.path();
  const destWebm = path.join(OUT, `${name}.webm`);
  fs.renameSync(webm, destWebm);
  const mp4 = path.join(OUT, `${name}.mp4`);
  await webmToMp4(destWebm, mp4);
  console.log("raw", name, fs.statSync(mp4).size);
  return mp4;
}

/** Trim only — never crop or upscale past source. */
async function masterClip(src, dest, poster, trimStart, duration) {
  await run("ffmpeg", [
    "-y", "-ss", String(trimStart), "-t", String(duration), "-i", src, "-an",
    "-vf", "fps=30,format=yuv420p,setsar=1",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-movflags", "+faststart", dest,
  ]);
  await extractPoster(dest, poster, "0.6");
}

/**
 * Mobile panel: crop action region at source pixels, then pad into 1080×1350
 * without upscaling (scale down only if the crop is wider than 1080).
 */
async function mobilePanel(src, dest, poster, { trimStart, duration, crop }) {
  const vf = [
    `trim=start=${trimStart}:duration=${duration}`,
    "setpts=PTS-STARTPTS",
    `crop=${crop}`,
    // fit inside 1080x1350 without enlarging
    "scale='min(1080,iw)':'min(1350,ih)':force_original_aspect_ratio=decrease:flags=lanczos",
    "pad=1080:1350:(ow-iw)/2:(oh-ih)/2:#12061f",
    "fps=30",
    "format=yuv420p",
    "setsar=1",
  ].join(",");
  await run("ffmpeg", [
    "-y", "-i", src, "-an", "-vf", vf,
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-movflags", "+faststart", dest,
  ]);
  await extractPoster(dest, poster, "0.5");
}

function publish(mp4, jpg) {
  fs.copyFileSync(mp4, path.join(PUBLIC, path.basename(mp4)));
  fs.copyFileSync(jpg, path.join(PUBLIC, path.basename(jpg)));
  console.log("pub", path.basename(mp4), fs.statSync(mp4).size);
}

await ensureAuth();

await withRecording("01-lead", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle", timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  await page.waitForTimeout(600);
  const search = page.getByPlaceholder(/Search|חיפוש/i).first();
  await humanMove(page, search, { click: false, steps: 18, pause: 400 });
  const newLead = page.locator("table tbody tr").filter({ hasText: /New|חדש/i }).first();
  await humanMove(page, newLead, { click: false, steps: 24, pause: 500 });
  await humanMove(page, newLead, { click: true, steps: 14, after: 1000 });
  await waitLoadingGone(page);
  await page.waitForTimeout(500);
  await humanMove(page, page.getByRole("button", { name: /WhatsApp/i }).first(), {
    click: false, steps: 20, pause: 700,
  });
  await humanMove(page, page.getByRole("button", { name: /Task|משימה/i }).first(), {
    click: false, steps: 16, pause: 700,
  });
  await page.waitForTimeout(900);
});

await withRecording("02-crm", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle", timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana|New|חדש|שחר|michal/i }).first();
  await humanMove(page, row, { click: true, steps: 22, after: 700 });
  await waitLoadingGone(page, 45000);
  await page.waitForTimeout(400);
  for (const name of [/WhatsApp/i, /Task|משימה/i, /Meeting|פגישה/i]) {
    await humanMove(page, page.getByRole("button", { name }).first(), {
      click: false, steps: 16, pause: 450,
    });
  }
  const notesTab = page
    .getByRole("tab", { name: /Notes|הערות|Activity|פעילות/i })
    .or(page.locator("button,a").filter({ hasText: /הערות ופעילות|Notes/i }))
    .first();
  await humanMove(page, notesTab, { click: true, steps: 16, after: 1000 });
  await waitLoadingGone(page, 20000);
  await page.waitForTimeout(1000);
});

await withRecording("03-whatsapp", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/whatsapp/inbox`, {
    waitUntil: "networkidle", timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  await page.waitForTimeout(700);
  const thread = page.locator('[class*="thread"], [class*="conversation"], [class*="chat"] li, [role="listitem"]').first();
  await humanMove(page, thread, { click: true, steps: 18, after: 800 }).catch(() => {});
  await page.waitForTimeout(600);
  const reply = page.getByPlaceholder(/reply|תשובה|כתבו/i).first();
  await humanMove(page, reply, { click: false, steps: 18, pause: 800 });
  await page.waitForTimeout(1400);
});

await withRecording("04-automation", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/automations/${AUTO_ID}`, {
    waitUntil: "networkidle", timeout: 90000,
  });
  await waitLoadingGone(page, 45000);
  await page.addStyleTag({ content: CLEAN });
  await page.waitForTimeout(800);
  const canvas = page.locator('[class*="canvas"], [class*="flow"], [class*="editor"], main').first();
  await humanMove(page, canvas, { click: false, steps: 20, pause: 600 });
  await page.mouse.wheel(0, 180);
  await page.waitForTimeout(700);
  await page.mouse.wheel(0, -80);
  const publish = page.getByRole("button", { name: /פרסם|Publish|שמור|Save/i }).first();
  await humanMove(page, publish, { click: false, steps: 18, pause: 900 });
  await page.waitForTimeout(1200);
});

await withRecording("05-task", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle", timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana/i }).first();
  await humanMove(page, row, { click: true, steps: 20, after: 800 });
  await waitLoadingGone(page, 45000);
  const tasksTab = page.getByRole("tab", { name: /Tasks|משימות/i }).first();
  await humanMove(page, tasksTab, { click: true, steps: 16, after: 700 });
  const input = page.getByPlaceholder(/כתבו את המשימה|Write the task/i).first();
  await humanMove(page, input, { click: true, steps: 14, after: 300 });
  await input.fill("שיחת חזרה — מעקב ליד חדש");
  await page.waitForTimeout(400);
  const dt = page.locator('input[type="datetime-local"]').first();
  if (await dt.count()) {
    await dt.fill("2026-11-10T10:30");
    await page.waitForTimeout(400);
  }
  const add = page.getByRole("button", { name: /הוספת משימה|Add Task/i }).first();
  await humanMove(page, add, { click: true, steps: 14, after: 1200 });
  await page.waitForTimeout(2200);
});

// Build desktop hero clips (full frame, no crop)
const masters = {
  "01-lead": { start: 2.0, dur: 6.5 },
  "02-crm": { start: 2.2, dur: 7.0 },
  "03-whatsapp": { start: 1.8, dur: 6.5 },
  "04-automation": { start: 1.6, dur: 6.0 },
  "05-task": { start: 3.5, dur: 10.0 },
};

for (const [name, t] of Object.entries(masters)) {
  const src = path.join(OUT, `${name}.mp4`);
  const hero = path.join(OUT, `hero-${name}.mp4`);
  const poster = path.join(OUT, `hero-${name}.jpg`);
  await masterClip(src, hero, poster, t.start, t.dur);
  // rename hero-01-lead style
  const id = name.replace(/^\d+-/, "");
  const map = {
    "01-lead": "01-lead",
    "02-crm": "02-crm",
    "03-whatsapp": "03-whatsapp",
    "04-automation": "04-automation",
    "05-task": "05-task",
  };
  const slug = map[name];
  const outMp4 = path.join(OUT, `hero-${slug}.mp4`);
  const outJpg = path.join(OUT, `hero-${slug}.jpg`);
  fs.copyFileSync(hero, outMp4);
  fs.copyFileSync(poster, outJpg);
  publish(outMp4, outJpg);
}

// Mobile panels — action regions only, padded, never upscaled
await mobilePanel(
  path.join(OUT, "01-lead.mp4"),
  path.join(OUT, "mobile-01-lead.mp4"),
  path.join(OUT, "mobile-01-lead.jpg"),
  { trimStart: 4.5, duration: 5.5, crop: "min(iw\\,1400):min(ih\\,900):(iw-ow)/2:40" },
);
await mobilePanel(
  path.join(OUT, "02-crm.mp4"),
  path.join(OUT, "mobile-02-crm.mp4"),
  path.join(OUT, "mobile-02-crm.jpg"),
  { trimStart: 4.0, duration: 5.5, crop: "min(iw*0.72\\,1400):min(ih*0.88\\,980):(iw-ow)/2:(ih-oh)*0.08" },
);
await mobilePanel(
  path.join(OUT, "03-whatsapp.mp4"),
  path.join(OUT, "mobile-03-whatsapp.mp4"),
  path.join(OUT, "mobile-03-whatsapp.jpg"),
  { trimStart: 2.5, duration: 5.8, crop: "min(iw*0.62\\,1200):min(ih*0.92\\,1000):(iw-ow)*0.55:(ih-oh)*0.05" },
);
await mobilePanel(
  path.join(OUT, "04-automation.mp4"),
  path.join(OUT, "mobile-04-automation.mp4"),
  path.join(OUT, "mobile-04-automation.jpg"),
  { trimStart: 2.0, duration: 5.5, crop: "min(iw*0.85\\,1600):min(ih*0.75\\,900):(iw-ow)/2:(ih-oh)*0.2" },
);
await mobilePanel(
  path.join(OUT, "05-task.mp4"),
  path.join(OUT, "mobile-05-task.mp4"),
  path.join(OUT, "mobile-05-task.jpg"),
  { trimStart: 5.0, duration: 8.5, crop: "min(iw*0.7\\,1300):min(ih*0.9\\,1000):(iw-ow)/2:(ih-oh)*0.08" },
);

for (const slug of ["01-lead", "02-crm", "03-whatsapp", "04-automation", "05-task"]) {
  publish(path.join(OUT, `mobile-${slug}.mp4`), path.join(OUT, `mobile-${slug}.jpg`));
}

// Process film: concat full-frame masters (trimmed), xfade lightly
const list = path.join(OUT, "concat.txt");
const parts = [];
for (const [name, t] of Object.entries(masters)) {
  const part = path.join(OUT, `proc-${name}.mp4`);
  await masterClip(path.join(OUT, `${name}.mp4`), part, path.join(OUT, `proc-${name}.jpg`), t.start, Math.min(t.dur, 5.2));
  parts.push(part);
}
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

// Also copy raw masters into public for reference
for (const name of Object.keys(masters)) {
  fs.copyFileSync(path.join(OUT, `${name}.mp4`), path.join(PUBLIC, `${name}.mp4`));
  await extractPoster(path.join(OUT, `${name}.mp4`), path.join(PUBLIC, `${name}.jpg`), "2.0");
}

console.log("V10 capture complete");
