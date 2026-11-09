/**
 * Chapter-stitched continuous process film (desktop 1920×1080 or mobile 390×844).
 * Each chapter: navigate+wait (trimmed away) → live mouse actions kept in final cut.
 *
 * Usage:
 *   FORCE_AUTH=1 node scripts/_captureProcessContinuousV14.mjs
 *   CAPTURE_MOBILE=1 FORCE_AUTH=1 node scripts/_captureProcessContinuousV14.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = process.env.BIZUPLY_CAPTURE_BASE || "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = process.env.BIZUPLY_CAPTURE_BIZ || "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = process.env.BIZUPLY_CAPTURE_AUTO || "6ab62f675ba1a92f3046b726";
const MOBILE = process.env.CAPTURE_MOBILE === "1";
const OUT = MOBILE ? "/tmp/bizuply-films/v14-mobile" : "/tmp/bizuply-films/v14";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";
const VW = MOBILE ? 390 : 1920;
const VH = MOBILE ? 844 : 1080;
const FILENAME = MOBILE ? "process-full-mobile" : "process-full";
const CHAPTER_LEN = MOBILE ? 8 : 10;

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
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-2500)))));
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

async function waitLoadingGone(page, timeout = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const spinner = await page
      .locator("text=/טוען את וואטסאפ|טוען אוטומצ|טוען\\.\\.\\.|Loading dashboard/i")
      .count()
      .catch(() => 0);
    const ready = await page.evaluate(() => {
      const body = (document.body?.innerText || "").replace(/\s+/g, " ").trim();
      if (body.length < 80) return false;
      if (/Loading dashboard|טוען אוטומצ|טוען את וואטסאפ/i.test(body)) return false;
      return /לידים|Inbox|תיבת|אוטומצ|CRM|משימ|פגיש|WhatsApp|לקוח/i.test(body);
    });
    if (spinner === 0 && ready) return true;
    await page.waitForTimeout(250);
  }
  return false;
}

async function waitForLeadRows(page, timeout = 20000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const count = await page.locator("table tbody tr").count().catch(() => 0);
    if (count > 0) return true;
    await page.waitForTimeout(300);
  }
  return false;
}

async function assertNotLogin(page, label) {
  const url = page.url();
  if (/\/login/i.test(url)) throw new Error(`Login URL at ${label}: ${url}`);
  if ((await page.locator("text=המשיכו עם Google").count().catch(() => 0)) > 0) {
    throw new Error(`Login card visible at ${label}`);
  }
  if ((await page.locator('input[type="password"]').count().catch(() => 0)) > 0) {
    throw new Error(`Password field visible at ${label}`);
  }
}

async function humanMove(page, locator, { click = false, steps = 18, pause = 280, after = 500 } = {}) {
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
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "he-IL" });
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
  await assertNotLogin(page, "ensureAuth");
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth saved");
}

await ensureAuth();

async function recordChapter(id, setupPath, act) {
  const slug = id.replace(/\s+/g, "-").toLowerCase();
  const chapterDir = path.join(OUT, slug);
  fs.mkdirSync(chapterDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: MOBILE ? 2 : 1,
    isMobile: MOBILE,
    hasTouch: MOBILE,
    locale: "he-IL",
    colorScheme: "light",
    storageState: AUTH,
    recordVideo: { dir: chapterDir, size: { width: VW, height: VH } },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem("i18nextLng", "he");
    localStorage.setItem("bizuply.lang", "he");
  });

  await page.goto(`${BASE}${setupPath}`, { waitUntil: "domcontentloaded", timeout: 120000 });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  await assertNotLogin(page, id);
  await page.waitForTimeout(500);

  const actStarted = Date.now();
  await act(page);
  const elapsed = Date.now() - actStarted;
  const remain = CHAPTER_LEN * 1000 - elapsed;
  if (remain > 200) await page.waitForTimeout(remain);
  else await page.waitForTimeout(400);

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();
  const webm = await video.path();
  const mp4 = path.join(OUT, `${slug}.mp4`);
  await webmToMp4(webm, mp4);

  const trimmed = path.join(OUT, `${slug}-trim.mp4`);
  await run("ffmpeg", [
    "-y",
    "-sseof", `-${CHAPTER_LEN}`,
    "-i", mp4,
    "-t", String(CHAPTER_LEN),
    "-an",
    "-c:v", "libx264", "-preset", "slow", "-crf", "16",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    trimmed,
  ]);
  console.log("chapter", id, trimmed);
  return trimmed;
}

const chapters = [];

chapters.push(
  await recordChapter("Lead in", `/business/${BIZ}/dashboard/crm/leads`, async (page) => {
    await waitForLeadRows(page);
    await humanMove(page, page.locator("table tbody tr").first(), { click: false, steps: 24, pause: 450 });
    await page.waitForTimeout(350);
    await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 16, after: 1500 });
    await waitLoadingGone(page);
    await page.waitForTimeout(800);
  }),
);

chapters.push(
  await recordChapter("CRM", `/business/${BIZ}/dashboard/crm/leads`, async (page) => {
    await waitForLeadRows(page);
    await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 16, after: 1300 });
    await waitLoadingGone(page);
    const tab = page
      .getByRole("tab", { name: /Notes|הערות|Activity|פעילות|Details|פרטים/i })
      .or(page.locator("button,a,[role='tab']").filter({ hasText: /הערות|Notes|פעילות|פרטים|Details/i }))
      .first();
    await humanMove(page, tab, { click: true, steps: 14, after: 1100 }).catch(() => {});
    const status = page.locator("button,select,[role='combobox']").filter({ hasText: /סטטוס|Status|חדש|מעוניין/i }).first();
    await humanMove(page, status, { click: true, steps: 12, after: 900 }).catch(() => {});
    await page.waitForTimeout(600);
  }),
);

chapters.push(
  await recordChapter("WhatsApp", `/business/${BIZ}/dashboard/whatsapp/inbox`, async (page) => {
    await waitLoadingGone(page, 60000);
    const thread = page
      .locator('[class*="thread"], [class*="conversation"], [class*="chat"] li, [role="listitem"], table tbody tr')
      .first();
    await humanMove(page, thread, { click: true, steps: 16, after: 1200 }).catch(() => {});
    await waitLoadingGone(page, 40000);
    const reply = page.getByPlaceholder(/reply|תשובה|כתבו|Type|הודעה|message/i).first();
    await humanMove(page, reply, { click: true, steps: 12, after: 400 }).catch(() => {});
    if ((await reply.count()) > 0) {
      await reply.fill("הודעת הדגמה — לא נשלחת ללקוח אמיתי");
      await page.waitForTimeout(450);
      await humanMove(page, page.getByRole("button", { name: /Send|שלח|Reply|תשובה/i }).first(), {
        click: true, steps: 10, after: 1000,
      }).catch(() => {});
    }
    await page.waitForTimeout(700);
  }),
);

chapters.push(
  await recordChapter("Meeting", `/business/${BIZ}/dashboard/crm/leads`, async (page) => {
    await waitForLeadRows(page);
    await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 14, after: 1200 });
    await waitLoadingGone(page);
    const meetingsTab = page.getByRole("tab", { name: /Meetings|פגישות|Tasks|משימות/i })
      .or(page.locator("button,a,[role='tab']").filter({ hasText: /פגישות|Meetings|משימות|Tasks/i }))
      .first();
    await humanMove(page, meetingsTab, { click: true, steps: 14, after: 1200 }).catch(() => {});
    await page.waitForTimeout(700);
    const taskBtn = page.getByRole("button", { name: /Task|משימה|Meeting|פגישה|Appointment|חדש|New/i }).first();
    await humanMove(page, taskBtn, { click: true, steps: 14, after: 1100 }).catch(() => {});
    const titleField = page
      .locator('input[name*="title" i], input[placeholder*="כותרת"], input[placeholder*="Title"], textarea')
      .first();
    if ((await titleField.count()) > 0) {
      await humanMove(page, titleField, { click: true, steps: 10, after: 250 });
      await titleField.fill("פגישת הדגמה — BizUply");
      await page.waitForTimeout(350);
    }
    await humanMove(page, page.getByRole("button", { name: /Save|שמור|Create|צור|הוסף/i }).first(), {
      click: true, steps: 12, after: 1200,
    }).catch(() => {});
    await page.waitForTimeout(500);
  }),
);

chapters.push(
  await recordChapter("Auto", `/business/${BIZ}/dashboard/automations`, async (page) => {
    await waitLoadingGone(page);
    const row = page
      .locator("table tbody tr")
      .filter({ hasText: /lead|ליד|follow|מעקב|Demo|הדגמ|welcome|אישור/i })
      .first()
      .or(page.locator("table tbody tr").first());
    // Stay on the automations list — detail editor can hang on staging.
    await humanMove(page, row, { click: false, steps: 16, pause: 500 });
    await page.waitForTimeout(450);
    await humanMove(page, row, { click: false, steps: 12, pause: 400 });
    await page.mouse.wheel(0, MOBILE ? 180 : 140);
    await page.waitForTimeout(900);
  }),
);

chapters.push(
  await recordChapter("Done", `/business/${BIZ}/dashboard/crm/leads`, async (page) => {
    await waitForLeadRows(page);
    await humanMove(page, page.locator("table tbody tr").first(), { click: true, steps: 16, after: 1400 });
    await waitLoadingGone(page);
    await page.waitForTimeout(1100);
  }),
);

const listFile = path.join(OUT, "chapters.txt");
fs.writeFileSync(listFile, chapters.map((file) => `file '${file}'`).join("\n"));
const concat = path.join(OUT, `${FILENAME}-raw.mp4`);
await run("ffmpeg", ["-y", "-f", "concat", "-safe", "0", "-i", listFile, "-c", "copy", concat]);
const finalMp4 = path.join(OUT, `${FILENAME}.mp4`);
await run("ffmpeg", [
  "-y", "-i", concat, "-an",
  "-c:v", "libx264", "-preset", "slow", "-crf", "16",
  "-pix_fmt", "yuv420p", "-movflags", "+faststart", finalMp4,
]);
const jpg = path.join(OUT, `${FILENAME}.jpg`);
await extractPoster(finalMp4, jpg, "1.4");

const marks = ["Lead in", "CRM", "WhatsApp", "Meeting", "Auto", "Done"].map((id, index) => ({
  id,
  at: Number((index * CHAPTER_LEN).toFixed(2)),
}));
const marksPath = path.join(OUT, `${FILENAME}-marks.json`);
fs.writeFileSync(marksPath, JSON.stringify({ viewport: [VW, VH], chapterLen: CHAPTER_LEN, marks }, null, 2));

fs.copyFileSync(finalMp4, path.join(PUBLIC, `${FILENAME}.mp4`));
fs.copyFileSync(jpg, path.join(PUBLIC, `${FILENAME}.jpg`));
fs.copyFileSync(marksPath, path.join(PUBLIC, MOBILE ? "process-marks-mobile.json" : "process-marks.json"));

const probe = await new Promise((resolve) => {
  const child = spawn("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height,duration", "-of", "csv=p=0", finalMp4,
  ]);
  let out = "";
  child.stdout.on("data", (d) => { out += d.toString(); });
  child.on("close", () => resolve(out.trim()));
});
console.log("published", FILENAME, probe, fs.statSync(path.join(PUBLIC, `${FILENAME}.mp4`)).size);
console.log("marks", JSON.stringify(marks));
