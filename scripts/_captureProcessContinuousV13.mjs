/**
 * Continuous BizUply process film @ 1920×1080 (+ optional mobile).
 * Logs chapter marks to process-marks.json. Aborts if login UI appears.
 *
 * Usage:
 *   FORCE_AUTH=1 node scripts/_captureProcessContinuousV13.mjs
 *   CAPTURE_MOBILE=1 FORCE_AUTH=1 node scripts/_captureProcessContinuousV13.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BIZUPLY_CAPTURE_BASE || "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = process.env.BIZUPLY_CAPTURE_BIZ || "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = process.env.BIZUPLY_CAPTURE_AUTO || "6ab62f675ba1a92f3046b726";
const MOBILE = process.env.CAPTURE_MOBILE === "1";
const OUT = MOBILE ? "/tmp/bizuply-films/v13-mobile" : "/tmp/bizuply-films/v13";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = MOBILE ? 390 : 1920;
const VH = MOBILE ? 844 : 1080;
const FILENAME = MOBILE ? "process-full-mobile" : "process-full";

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
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-2000)))));
  });
}

async function webmToMp4(webm, mp4) {
  await run("ffmpeg", [
    "-y",
    "-i",
    webm,
    "-an",
    "-vf",
    "fps=30,format=yuv420p,setsar=1",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "16",
    "-movflags",
    "+faststart",
    mp4,
  ]);
}

async function extractPoster(mp4, jpg, at = "1.5") {
  await run("ffmpeg", ["-y", "-ss", at, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function waitLoadingGone(page, timeout = 35000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const busy = await page.evaluate(() => {
      const text = (document.body?.innerText || "").slice(0, 800);
      return /טוען|Loading|Please wait|טוען את וואטסאפ/i.test(text);
    });
    if (!busy) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

async function assertNotLogin(page, label) {
  const url = page.url();
  if (/\/login/i.test(url)) throw new Error(`Login URL at ${label}: ${url}`);
  const hasLoginCard = await page.locator("text=המשיכו עם Google").count().catch(() => 0);
  if (hasLoginCard > 0) throw new Error(`Login card visible at ${label}`);
}

async function humanMove(page, locator, { click = false, steps = 20, pause = 350, after = 600 } = {}) {
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

async function ensureAuth() {
  if (fs.existsSync(AUTH) && !process.env.FORCE_AUTH) {
    console.log("reuse auth");
    return;
  }
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "he-IL",
  });
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
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await waitLoadingGone(page);
  await assertNotLogin(page, "ensureAuth leads");
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth saved");
}

await ensureAuth();

const marks = [];
const startedAt = Date.now();
const mark = (id) => {
  const at = Number(((Date.now() - startedAt) / 1000).toFixed(2));
  marks.push({ id, at });
  console.log("mark", id, at);
};

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: VW, height: VH },
  deviceScaleFactor: MOBILE ? 2 : 1,
  isMobile: MOBILE,
  hasTouch: MOBILE,
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
  await page.waitForTimeout(700);
}

// 1 Lead intake — list + open card
await go(`/business/${BIZ}/dashboard/crm/leads`, "leads");
mark("Lead in");
await page.waitForTimeout(1200);
const leadRow = page.locator("table tbody tr").first();
await humanMove(page, leadRow, { click: true, steps: 26, pause: 450, after: 1400 });
await waitLoadingGone(page, 45000);
await assertNotLogin(page, "lead card");
await page.waitForTimeout(1100);

// 2 Lead management — notes / activity
mark("CRM");
const notes = page
  .getByRole("tab", { name: /Notes|הערות|Activity|פעילות|Details|פרטים/i })
  .or(page.locator("button,a,[role='tab']").filter({ hasText: /הערות|Notes|פעילות|פרטים|Details/i }))
  .first();
await humanMove(page, notes, { click: true, steps: 18, after: 1100 }).catch(() => {});
await page.waitForTimeout(900);
const status = page
  .locator("button,select,[role='combobox']")
  .filter({ hasText: /סטטוס|Status|חדש|New|מעוניין/i })
  .first();
await humanMove(page, status, { click: true, steps: 14, after: 900 }).catch(() => {});
await page.waitForTimeout(800);

// 3 WhatsApp conversation
mark("WhatsApp");
await go(`/business/${BIZ}/dashboard/whatsapp/inbox`, "whatsapp");
await waitLoadingGone(page, 45000);
await page.waitForTimeout(900);
const thread = page
  .locator('[class*="thread"], [class*="conversation"], [class*="chat"] li, [role="listitem"], table tbody tr')
  .first();
await humanMove(page, thread, { click: true, steps: 18, after: 1200 }).catch(() => {});
await waitLoadingGone(page, 30000);
const reply = page.getByPlaceholder(/reply|תשובה|כתבו|Type|הודעה|message/i).first();
await humanMove(page, reply, { click: true, steps: 14, after: 500 }).catch(() => {});
if ((await reply.count()) > 0) {
  await reply.fill("הודעת הדגמה — לא נשלחת ללקוח אמיתי");
  await page.waitForTimeout(500);
  await humanMove(page, page.getByRole("button", { name: /Send|שלח|Reply|תשובה/i }).first(), {
    click: true,
    steps: 12,
    after: 1200,
  }).catch(() => {});
}
await page.waitForTimeout(1000);

// 4 Meeting & task
mark("Meeting");
await go(`/business/${BIZ}/dashboard/crm/leads`, "leads2");
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 18, after: 1200 });
await waitLoadingGone(page, 45000);
const taskBtn = page.getByRole("button", { name: /Task|משימה|Meeting|פגישה|Appointment/i }).first();
await humanMove(page, taskBtn, { click: true, steps: 16, after: 1100 }).catch(() => {});
await page.waitForTimeout(700);
const titleField = page
  .locator('input[name*="title" i], input[placeholder*="כותרת"], input[placeholder*="Title"], textarea')
  .first();
if ((await titleField.count()) > 0) {
  await humanMove(page, titleField, { click: true, steps: 12, after: 300 });
  await titleField.fill("פגישת הדגמה — BizUply");
  await page.waitForTimeout(400);
}
await humanMove(page, page.getByRole("button", { name: /Save|שמור|Create|צור|הוסף/i }).first(), {
  click: true,
  steps: 14,
  after: 1300,
}).catch(() => {});
await page.waitForTimeout(900);

// 5 Automations
mark("Auto");
await go(`/business/${BIZ}/dashboard/automations/${AUTO_ID}`, "automation");
await waitLoadingGone(page, 45000);
await page.waitForTimeout(900);
await humanMove(page, page.locator('[class*="canvas"], [class*="flow"], [class*="editor"], main').first(), {
  click: false,
  steps: 16,
  pause: 600,
});
await page.mouse.wheel(0, MOBILE ? 240 : 220);
await page.waitForTimeout(1400);

// 6 Back to updated customer card
mark("Done");
await go(`/business/${BIZ}/dashboard/crm/leads`, "leads3");
await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 18, after: 1400 });
await waitLoadingGone(page, 45000);
await assertNotLogin(page, "final");
await page.waitForTimeout(1600);

const video = page.video();
await page.close();
await context.close();
await browser.close();

const webm = await video.path();
const destWebm = path.join(OUT, `${FILENAME}.webm`);
fs.renameSync(webm, destWebm);
const mp4 = path.join(OUT, `${FILENAME}.mp4`);
await webmToMp4(destWebm, mp4);
const jpg = path.join(OUT, `${FILENAME}.jpg`);
await extractPoster(mp4, jpg, "2.2");

// Normalize marks relative to first chapter, clamp to film duration via ffprobe later
const marksPath = path.join(OUT, `${FILENAME}-marks.json`);
const marksPublic = path.join(PUBLIC, MOBILE ? "process-marks-mobile.json" : "process-marks.json");
const baseAt = marks[0]?.at || 0;
const normalized = marks.map((m) => ({ id: m.id, at: Number(Math.max(0, m.at - baseAt).toFixed(2)) }));
fs.writeFileSync(marksPath, JSON.stringify({ viewport: [VW, VH], marks: normalized }, null, 2));
fs.copyFileSync(mp4, path.join(PUBLIC, `${FILENAME}.mp4`));
fs.copyFileSync(jpg, path.join(PUBLIC, `${FILENAME}.jpg`));
fs.copyFileSync(marksPath, marksPublic);

const probe = await new Promise((resolve) => {
  const child = spawn("ffprobe", [
    "-v",
    "error",
    "-select_streams",
    "v:0",
    "-show_entries",
    "stream=width,height,duration",
    "-of",
    "csv=p=0",
    mp4,
  ]);
  let out = "";
  child.stdout.on("data", (d) => {
    out += d.toString();
  });
  child.on("close", () => resolve(out.trim()));
});
console.log("published", FILENAME, probe, fs.statSync(path.join(PUBLIC, `${FILENAME}.mp4`)).size);
console.log("marks", JSON.stringify(normalized));
