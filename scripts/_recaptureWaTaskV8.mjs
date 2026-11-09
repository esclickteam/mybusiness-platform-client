/**
 * Recapture WhatsApp + Task with mild framing (no over-zoom),
 * full chat bubbles, and clear task create → datetime → save → list.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";

const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const OUT = "/tmp/bizuply-films";
const AUTH = "/tmp/bizuply-demo-auth.json";

fs.mkdirSync(OUT, { recursive: true });

const CLEAN = `
  html, body { background: #eef1f8 !important; }
  aside, [data-sidebar], [class*="Sidebar"], [class*="sidebar"]:not(main *):not([role="dialog"] *),
  nav[class*="side"], [class*="TopBar"], [class*="topbar"], [class*="DashboardHeader"],
  [class*="AppHeader"], [class*="cookie"], [id*="cookie"], [class*="Cookie"],
  [class*="PushAlert"], [class*="push-alert"], [class*="FloatingAssistant"],
  [class*="assistant-fab"], button[aria-label*="AI"], [class*="chat-widget"], [class*="ChatWidget"] {
    display: none !important; visibility: hidden !important; pointer-events: none !important;
  }
  main, [class*="MainContent"], [class*="main-content"], [class*="page-content"] {
    margin: 0 !important; padding: 12px 18px !important; max-width: none !important; width: 100% !important;
  }
`;

const WA_FOCUS = `
  ${CLEAN}
  /* Mild framing only — keep full bubbles readable */
  main, [class*="MainContent"], [class*="page-content"] {
    transform: scale(1.06);
    transform-origin: top center;
  }
  [class*="message"], [class*="Message"], [class*="bubble"], [class*="Bubble"] {
    max-width: 100% !important;
    overflow: visible !important;
  }
`;

const TASK_FOCUS = `
  ${CLEAN}
  [role="dialog"], [class*="Modal"], [class*="Drawer"], [class*="drawer"], [class*="Sheet"] {
    transform: scale(1.08);
    transform-origin: center top;
  }
`;

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-900)))));
  });
}

async function waitLoadingGone(page, timeout = 25000) {
  const deadline = Date.now() + timeout;
  while (Date.now() < deadline) {
    const busy = await page.evaluate(() => {
      const t = document.body?.innerText || "";
      return /טוען|Loading|Please wait/i.test(t) && !/נשמר|Saved/i.test(t);
    });
    if (!busy) return;
    await page.waitForTimeout(250);
  }
}

async function ensureAuth() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "he-IL",
    colorScheme: "light",
  });
  const page = await context.newPage();
  await page.goto(`${BASE}/login`, { waitUntil: "domcontentloaded", timeout: 90000 });
  await page.evaluate(() => {
    try {
      localStorage.setItem("i18nextLng", "he");
      localStorage.setItem("bizuply.lang", "he");
    } catch {
      /* ignore */
    }
  });
  await page.locator('input[type="email"]').fill("customer-free-demo@bizuply.test");
  await page.locator('input[type="password"]').fill("DemoCustomer#2026");
  await page.locator('button[type="submit"]').click();
  await page.waitForURL("**/dashboard/**", { timeout: 60000 });
  await page.waitForTimeout(1000);
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page, 30000);
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth ok");
}

async function humanMove(page, locator, { click = false, steps = 16, after = 400, pause = 0 } = {}) {
  try {
    if (!(await locator.count()) || !(await locator.first().isVisible().catch(() => false))) return false;
    const box = await locator.first().boundingBox();
    if (!box) return false;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps });
    if (pause) await page.waitForTimeout(pause);
    if (click) await locator.first().click({ timeout: 8000 });
    if (after) await page.waitForTimeout(after);
    return true;
  } catch {
    return false;
  }
}

async function record(name, action) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    locale: "he-IL",
    colorScheme: "light",
    storageState: AUTH,
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
  });
  const page = await context.newPage();
  await action(page);
  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();
  const webm = await video.path();
  const mp4 = `${OUT}/${name}.mp4`;
  await run("ffmpeg", [
    "-y",
    "-i",
    webm,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "slow",
    "-crf",
    "15",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mp4,
  ]);
  console.log("saved", mp4, fs.statSync(mp4).size);
}

await ensureAuth();

await record("03-whatsapp", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/whatsapp/inbox`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page, 35000);
  await page
    .locator("text=/טוען את וואטסאפ|Loading WhatsApp/i")
    .first()
    .waitFor({ state: "hidden", timeout: 40000 })
    .catch(() => undefined);
  await page.addStyleTag({ content: WA_FOCUS });
  await page.waitForTimeout(400);
  const chat = page.locator("text=/יעל|Yael|עומר|Omer/").first();
  await humanMove(page, chat, { click: true, steps: 22, after: 800 });
  await waitLoadingGone(page, 30000);
  await page
    .locator("text=/טוען את וואטסאפ|Loading WhatsApp/i")
    .first()
    .waitFor({ state: "hidden", timeout: 30000 })
    .catch(() => undefined);
  // Hold on full conversation — prefer professional Hebrew draft, no truncated English crops
  await page.waitForTimeout(900);
  const reply = page.getByPlaceholder(/Type a reply|הקלד|כתוב|תשובה/i).first();
  if (await humanMove(page, reply, { click: true, steps: 18, after: 250 })) {
    await reply.fill("");
    await reply.type("שלום יעל, נשמח לתאם שיחת היכרות קצרה מחר ב־10:00", { delay: 24 });
    await page.waitForTimeout(700);
    await humanMove(page, page.getByRole("button", { name: /Reply|שלח|תשובה|Send/i }).first(), {
      click: false,
      steps: 14,
      pause: 900,
    });
  }
  await page.waitForTimeout(800);
});

await record("05-task", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page, 30000);
  await page.addStyleTag({ content: CLEAN });
  const row = page
    .locator("table tbody tr")
    .filter({ hasText: /דנה|Dana|New|חדש|Michal|שחר/i })
    .first();
  await humanMove(page, row, { click: true, steps: 20, after: 600 });
  await waitLoadingGone(page, 45000);
  await page.addStyleTag({ content: TASK_FOCUS });
  const taskBtn = page.getByRole("button", { name: /Task|משימה/i }).first();
  await humanMove(page, taskBtn, { click: true, steps: 18, after: 700 });
  await waitLoadingGone(page, 25000);
  const tasksTab = page
    .getByRole("tab", { name: /Tasks|משימות/i })
    .or(page.locator("button,a").filter({ hasText: /^Tasks$|^משימות$/ }))
    .first();
  await humanMove(page, tasksTab, { click: true, steps: 14, after: 700 });
  await waitLoadingGone(page, 20000);

  const title = page
    .getByPlaceholder(/title|כותרת|Task|משימה|לביצוע/i)
    .or(page.locator('input[name*="title" i], textarea[name*="title" i]'))
    .first();
  if (await title.count()) {
    await humanMove(page, title, { click: true, steps: 12, after: 200 });
    await title.fill("");
    await title.type("שיחת חזרה — מעקב ליד חדש", { delay: 26 });
    await page.waitForTimeout(450);
  }

  const dt = page.locator('input[type="datetime-local"]').first();
  if (await dt.count()) {
    await humanMove(page, dt, { click: true, steps: 10, after: 200 });
    const stamp = "2026-11-10T10:30";
    await dt.fill(stamp);
    await page.waitForTimeout(500);
  } else {
    const anyDate = page
      .locator('input[type="date"], input[type="datetime-local"], input[placeholder*="yyyy" i]')
      .first();
    if (await anyDate.count()) {
      await humanMove(page, anyDate, { click: true, steps: 10, after: 200 });
      await anyDate.fill("2026-11-10T10:30").catch(async () => {
        await anyDate.evaluate((el) => {
          el.value = "2026-11-10T10:30";
          el.dispatchEvent(new Event("input", { bubbles: true }));
          el.dispatchEvent(new Event("change", { bubbles: true }));
        });
      });
      await page.waitForTimeout(500);
    }
  }

  const save = page
    .getByRole("button", { name: /הוספת משימה|Save|שמור|Create|צור|Add|הוסף/i })
    .first();
  await humanMove(page, save, { click: true, steps: 12, after: 900 });
  await waitLoadingGone(page, 20000);
  // Hold on saved toast + list item
  await page
    .locator("text=/נשמר|Saved|שיחת חזרה|מעקב ליד/i")
    .first()
    .waitFor({ state: "visible", timeout: 12000 })
    .catch(() => undefined);
  await page.waitForTimeout(1600);
});

console.log("done wa+task recapture");
