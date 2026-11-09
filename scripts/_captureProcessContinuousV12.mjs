/**
 * Continuous process film @ 1920×1080 — aborts if login UI appears.
 * Usage: FORCE_AUTH=1 node scripts/_captureProcessContinuousV12.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BIZUPLY_CAPTURE_BASE || "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = process.env.BIZUPLY_CAPTURE_BIZ || "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = process.env.BIZUPLY_CAPTURE_AUTO || "6ab62f675ba1a92f3046b726";
const OUT = "/tmp/bizuply-films/v12";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = 1920;
const VH = 1080;

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(PUBLIC, { recursive: true });

const CLEAN = `
  [class*="cookie"], [id*="cookie"], [class*="Cookie"],
  [class*="PushAlert"], [class*="push-alert"],
  [class*="FloatingAssistant"], [class*="assistant-fab"],
  button[aria-label*="AI"], [class*="chat-widget"], [class*="ChatWidget"] {
    display: none !important; visibility: hidden !important; pointer-events: none !important;
  }
`;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => { err += d.toString(); });
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

async function extractPoster(mp4, jpg, at = "1.5") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function waitLoadingGone(page, timeout = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const busy = await page.evaluate(() => /טוען|Loading|Please wait/i.test((document.body?.innerText || "").slice(0, 400)));
    if (!busy) return true;
    await page.waitForTimeout(200);
  }
  return false;
}

async function assertNotLogin(page, label) {
  const url = page.url();
  if (/\/login/i.test(url)) throw new Error(`Login URL at ${label}: ${url}`);
  const hasLoginCard = await page.locator('text=המשיכו עם Google').count().catch(() => 0);
  if (hasLoginCard > 0) throw new Error(`Login card visible at ${label}`);
}

async function humanMove(page, locator, { click = false, steps = 20, pause = 350, after = 600 } = {}) {
  const box = await locator.boundingBox().catch(() => null);
  if (!box) return false;
  await page.mouse.move(box.x + box.width * 0.55, box.y + box.height * 0.5, { steps });
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
  if (fs.existsSync(AUTH) && !process.env.FORCE_AUTH) {
    console.log("reuse auth");
    return;
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: VW, height: VH }, locale: "he-IL" });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    localStorage.setItem("i18nextLng", "he");
    localStorage.setItem("bizuply.lang", "he");
  });
  await page.locator('input[type="email"]').fill("customer-free-demo@bizuply.test");
  await page.locator('input[type="password"]').fill("DemoCustomer#2026");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/business\/.+\/dashboard/, { timeout: 60000 });
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await waitLoadingGone(page);
  await assertNotLogin(page, "ensureAuth leads");
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
  localStorage.setItem("i18nextLng", "he");
  localStorage.setItem("bizuply.lang", "he");
});

async function go(path, label) {
  await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  await assertNotLogin(page, label);
  await page.waitForTimeout(500);
}

// 1 Lead list → open card
await go(`/business/${BIZ}/dashboard/crm/leads`, "leads");
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 24, after: 1100 });
await waitLoadingGone(page, 45000);
await assertNotLogin(page, "lead card");
await page.waitForTimeout(900);

// 2 Notes / status
const notes = page.getByRole("tab", { name: /Notes|הערות|Activity|פעילות/i })
  .or(page.locator("button,a").filter({ hasText: /הערות|Notes|פעילות/i })).first();
await humanMove(page, notes, { click: true, steps: 16, after: 900 }).catch(() => {});
await page.waitForTimeout(900);

// 3 WhatsApp
await go(`/business/${BIZ}/dashboard/whatsapp/inbox`, "whatsapp");
const thread = page.locator('[class*="thread"], [class*="conversation"], [class*="chat"] li, [role="listitem"], table tbody tr').first();
await humanMove(page, thread, { click: true, steps: 18, after: 900 }).catch(() => {});
const reply = page.getByPlaceholder(/reply|תשובה|כתבו|Type|הודעה/i).first();
await humanMove(page, reply, { click: true, steps: 14, after: 400 }).catch(() => {});
if (await reply.count()) {
  await reply.fill("הודעת הדגמה — לא נשלחת ללקוח אמיתי");
  await page.waitForTimeout(400);
  await humanMove(page, page.getByRole("button", { name: /Send|שלח|Reply/i }).first(), { click: true, steps: 12, after: 1000 }).catch(() => {});
}
await page.waitForTimeout(800);

// 4 Task
await go(`/business/${BIZ}/dashboard/crm/leads`, "leads2");
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 18, after: 900 });
await waitLoadingGone(page, 45000);
await humanMove(page, page.getByRole("button", { name: /Task|משימה|Meeting|פגישה/i }).first(), { click: true, steps: 16, after: 900 }).catch(() => {});
await humanMove(page, page.getByRole("button", { name: /Save|שמור|Create|צור/i }).first(), { click: true, steps: 14, after: 1100 }).catch(() => {});
await page.waitForTimeout(700);

// 5 Automation
await go(`/business/${BIZ}/dashboard/automations/${AUTO_ID}`, "automation");
await humanMove(page, page.locator('[class*="canvas"], [class*="flow"], [class*="editor"], main').first(), { click: false, steps: 16, pause: 500 });
await page.mouse.wheel(0, 180);
await page.waitForTimeout(1000);

// 6 Back to lead
await go(`/business/${BIZ}/dashboard/crm/leads`, "leads3");
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 18, after: 1100 });
await waitLoadingGone(page, 45000);
await assertNotLogin(page, "final");
await page.waitForTimeout(1200);

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

// Sanity: poster must not look like marketing login — reject if ffmpeg first frame too early
await extractPoster(mp4, path.join(OUT, "check.jpg"), "0.8");
fs.copyFileSync(mp4, path.join(PUBLIC, "process-full.mp4"));
fs.copyFileSync(jpg, path.join(PUBLIC, "process-full.jpg"));
const probe = await new Promise((resolve) => {
  const child = spawn("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height,duration", "-of", "csv=p=0", mp4]);
  let out = "";
  child.stdout.on("data", (d) => { out += d.toString(); });
  child.on("close", () => resolve(out.trim()));
});
console.log("published", probe, fs.statSync(path.join(PUBLIC, "process-full.mp4")).size);
