/**
 * Continuous BizUply product process film at 1920×1080.
 * No CSS scale, no crop-zoom polish. Visible cursor via Playwright mouse moves.
 *
 * Usage: node scripts/_captureProcessContinuousV11.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BIZUPLY_CAPTURE_BASE || "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = process.env.BIZUPLY_CAPTURE_BIZ || "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = process.env.BIZUPLY_CAPTURE_AUTO || "6ab62f675ba1a92f3046b726";
const OUT = "/tmp/bizuply-films/v11";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = 1920;
const VH = 1080;

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PUBLIC, { recursive: true });

const CLEAN = `
  html, body { background: #eef1f8 !important; }
  [class*="cookie"], [id*="cookie"], [class*="Cookie"],
  [class*="PushAlert"], [class*="push-alert"],
  [class*="FloatingAssistant"], [class*="assistant-fab"],
  button[aria-label*="AI"], [class*="chat-widget"], [class*="ChatWidget"] {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
  }
`;

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

async function webmToMp4(webm, mp4) {
  await run("ffmpeg", [
    "-y", "-i", webm, "-an",
    "-vf", "fps=30,format=yuv420p,setsar=1",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-movflags", "+faststart", mp4,
  ]);
}

async function extractPoster(mp4, jpg, at = "1.2") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function waitLoadingGone(page, timeout = 35000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const busy = await page.evaluate(() => {
      const t = document.body?.innerText || "";
      return /טוען|Loading|Please wait/i.test(t.slice(0, 500));
    });
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

async function humanMove(page, locator, { click = false, steps = 22, pause = 450, after = 700 } = {}) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return false;
  const x = box.x + Math.min(box.width * 0.55, Math.max(12, box.width - 12));
  const y = box.y + Math.min(box.height * 0.5, Math.max(10, box.height - 10));
  await page.mouse.move(x, y, { steps });
  await page.waitForTimeout(pause);
  if (click) {
    await page.mouse.down();
    await page.waitForTimeout(80);
    await page.mouse.up();
    await page.waitForTimeout(after);
  }
  return true;
}

async function ensureAuth() {
  if (fs.existsSync(AUTH) && !process.env.FORCE_AUTH) {
    console.log("reuse auth", AUTH);
    return;
  }
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
  await page.waitForURL(/dashboard|business/i, { timeout: 60000 });
  await page.waitForTimeout(1200);
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth saved");
}

await ensureAuth();

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

// Step 1 — lead list → open lead
await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
  waitUntil: "networkidle",
  timeout: 120000,
});
await waitLoadingGone(page);
await page.addStyleTag({ content: CLEAN });
await page.waitForTimeout(900);
const row = page.locator("table tbody tr").first();
await humanMove(page, row, { click: true, steps: 26, after: 1200 });
await waitLoadingGone(page, 45000);
await page.waitForTimeout(900);

// Step 2 — customer management: notes / status
const notes = page
  .getByRole("tab", { name: /Notes|הערות|Activity|פעילות/i })
  .or(page.locator("button,a").filter({ hasText: /הערות|Notes|פעילות/i }))
  .first();
await humanMove(page, notes, { click: true, steps: 18, after: 1100 }).catch(() => {});
await page.waitForTimeout(1000);
const status = page.locator("button,select,[role='combobox']").filter({ hasText: /סטטוס|Status|חדש|New|בטיפול/i }).first();
await humanMove(page, status, { click: false, steps: 16, pause: 700 }).catch(() => {});
await page.waitForTimeout(800);

// Step 3 — WhatsApp
await page.goto(`${BASE}/business/${BIZ}/dashboard/whatsapp/inbox`, {
  waitUntil: "networkidle",
  timeout: 120000,
});
await waitLoadingGone(page);
await page.addStyleTag({ content: CLEAN });
await page.waitForTimeout(800);
const thread = page.locator('[class*="thread"], [class*="conversation"], [class*="chat"] li, [role="listitem"], table tbody tr').first();
await humanMove(page, thread, { click: true, steps: 20, after: 1000 }).catch(() => {});
await page.waitForTimeout(700);
const reply = page.getByPlaceholder(/reply|תשובה|כתבו|Type|הודעה/i).first();
await humanMove(page, reply, { click: true, steps: 18, after: 500 }).catch(() => {});
if (await reply.count()) {
  await reply.fill("הודעת הדגמה — לא נשלחת ללקוח אמיתי");
  await page.waitForTimeout(600);
  const send = page.getByRole("button", { name: /Send|שלח|Reply/i }).first();
  await humanMove(page, send, { click: true, steps: 14, after: 1200 }).catch(() => {});
}
await page.waitForTimeout(1000);

// Step 4 — task / meeting
await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
  waitUntil: "networkidle",
  timeout: 120000,
});
await waitLoadingGone(page);
await page.addStyleTag({ content: CLEAN });
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 20, after: 1000 });
await waitLoadingGone(page, 45000);
const taskBtn = page.getByRole("button", { name: /Task|משימה|Meeting|פגישה/i }).first();
await humanMove(page, taskBtn, { click: true, steps: 18, after: 1000 }).catch(() => {});
await page.waitForTimeout(700);
const save = page.getByRole("button", { name: /Save|שמור|Create|צור/i }).first();
await humanMove(page, save, { click: true, steps: 16, after: 1400 }).catch(() => {});
await page.waitForTimeout(1000);

// Step 5 — automation
await page.goto(`${BASE}/business/${BIZ}/dashboard/automations/${AUTO_ID}`, {
  waitUntil: "networkidle",
  timeout: 120000,
});
await waitLoadingGone(page, 45000);
await page.addStyleTag({ content: CLEAN });
await page.waitForTimeout(900);
const canvas = page.locator('[class*="canvas"], [class*="flow"], [class*="editor"], main').first();
await humanMove(page, canvas, { click: false, steps: 18, pause: 700 });
await page.mouse.wheel(0, 220);
await page.waitForTimeout(1100);

// Step 6 — back to lead card
await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
  waitUntil: "networkidle",
  timeout: 120000,
});
await waitLoadingGone(page);
await page.addStyleTag({ content: CLEAN });
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 20, after: 1200 });
await waitLoadingGone(page, 45000);
await page.waitForTimeout(1600);

const video = page.video();
await page.close();
await context.close();
await browser.close();
const webm = await video.path();
const destWebm = path.join(OUT, "process-full.webm");
fs.renameSync(webm, destWebm);
const mp4 = path.join(OUT, "process-full.mp4");
await webmToMp4(destWebm, mp4);
const jpg = path.join(OUT, "process-full.jpg");
await extractPoster(mp4, jpg, "2.0");
fs.copyFileSync(mp4, path.join(PUBLIC, "process-full.mp4"));
fs.copyFileSync(jpg, path.join(PUBLIC, "process-full.jpg"));
const probe = await new Promise((resolve) => {
  const child = spawn("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,duration", "-of", "csv=p=0", mp4]);
  let out = "";
  child.stdout.on("data", (d) => {
    out += d.toString();
  });
  child.on("close", () => resolve(out.trim()));
});
console.log("published process-full", probe, fs.statSync(path.join(PUBLIC, "process-full.mp4")).size);
