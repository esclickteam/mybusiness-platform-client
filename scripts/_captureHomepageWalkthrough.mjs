/**
 * Capture clean marketing walkthrough films from the staging demo workspace.
 * Auth happens outside video recording so login chrome never appears.
 *
 * Usage: node scripts/_captureHomepageWalkthrough.mjs
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = "6ab62f675ba1a92f3046b726";
const OUT = "/tmp/bizuply-films";
const PUBLIC = path.resolve("public/demo-media/home/walkthrough");
const AUTH = "/tmp/bizuply-demo-auth.json";

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
  /* Collapse sidebar layout offset */
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

const FOCUS = {
  lead: `
    ${CLEAN}
    main, [class*="MainContent"], [class*="page-content"] {
      transform: scale(1.32);
      transform-origin: top center;
    }
    table th:nth-child(n+7), table td:nth-child(n+7) { display: none !important; }
  `,
  card: `
    ${CLEAN}
    [role="dialog"], [class*="Modal"], [class*="Drawer"] {
      transform: scale(1.1);
      transform-origin: center center;
    }
  `,
  wa: `
    ${CLEAN}
    main, [class*="MainContent"], [class*="page-content"] {
      transform: scale(1.2);
      transform-origin: top center;
    }
  `,
  auto: `
    ${CLEAN}
    main, [class*="MainContent"], [class*="page-content"] {
      transform: scale(1.16);
      transform-origin: top right;
    }
  `,
};

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

async function webmToMp4(webm, mp4) {
  await run("ffmpeg", [
    "-y",
    "-i",
    webm,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "19",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mp4,
  ]);
}

async function extractPoster(mp4, jpg, ss = "1.2") {
  await run("ffmpeg", ["-y", "-ss", ss, "-i", mp4, "-frames:v", "1", "-q:v", "3", "-update", "1", jpg]);
}

async function humanMove(page, selector, opts = {}) {
  try {
    const loc = typeof selector === "string" ? page.locator(selector).first() : selector;
    await loc.waitFor({ state: "visible", timeout: opts.timeout || 12000 });
    const box = await loc.boundingBox();
    if (!box) return false;
    const x = box.x + box.width * (opts.x || 0.5);
    const y = box.y + box.height * (opts.y || 0.45);
    await page.mouse.move(x, y, { steps: opts.steps || 26 });
    await page.waitForTimeout(opts.pause || 320);
    if (opts.click !== false) {
      await page.mouse.down();
      await page.waitForTimeout(70);
      await page.mouse.up();
      await page.waitForTimeout(opts.after || 700);
    }
    return true;
  } catch {
    return false;
  }
}

async function ensureAuth() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1360, height: 820 },
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
  await page.waitForURL("**/dashboard/**", { timeout: 45000 });
  await page.waitForTimeout(1500);
  await page.evaluate(() => {
    try {
      localStorage.setItem("i18nextLng", "he");
    } catch {
      /* ignore */
    }
  });
  // Warm CRM so first recorded navigation is fast
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "domcontentloaded",
    timeout: 90000,
  });
  await page.waitForTimeout(1000);
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth saved", AUTH);
}

async function withRecording(name, action) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1360, height: 820 },
    deviceScaleFactor: 1,
    locale: "he-IL",
    colorScheme: "light",
    storageState: AUTH,
    recordVideo: { dir: OUT, size: { width: 1360, height: 820 } },
  });
  const page = await context.newPage();
  await page.addInitScript(() => {
    try {
      localStorage.setItem("i18nextLng", "he");
      localStorage.setItem("bizuply.lang", "he");
    } catch {
      /* ignore */
    }
  });

  await action(page);
  if (page.url().includes("/login")) {
    throw new Error(`Auth failed for ${name}: ended on login`);
  }

  const video = page.video();
  await page.close();
  await context.close();
  await browser.close();
  const webm = await video.path();
  const destWebm = path.join(OUT, `${name}.webm`);
  fs.renameSync(webm, destWebm);
  const mp4 = path.join(OUT, `${name}.mp4`);
  await webmToMp4(destWebm, mp4);
  const poster = path.join(OUT, `${name}.jpg`);
  await extractPoster(mp4, poster, "1.4");
  fs.copyFileSync(mp4, path.join(PUBLIC, `${name}.mp4`));
  fs.copyFileSync(poster, path.join(PUBLIC, `${name}.jpg`));
  console.log("OK", name, fs.statSync(mp4).size);
  return mp4;
}

await ensureAuth();

await withRecording("01-lead", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(1200);
  await page.addStyleTag({ content: FOCUS.lead });
  await page.waitForTimeout(400);
  const search = page.getByPlaceholder(/Search|חיפוש/i).first();
  await humanMove(page, search, { click: false, steps: 18, pause: 400 });
  const newLead = page.locator("table tbody tr").filter({ hasText: /New|חדש/i }).first();
  await humanMove(page, newLead, { click: false, steps: 30, pause: 650 });
  await humanMove(page, newLead, { click: true, steps: 12, after: 1700 });
  await page.addStyleTag({ content: FOCUS.card });
  await humanMove(page, page.getByRole("button", { name: /WhatsApp/i }).first(), {
    click: false,
    steps: 22,
    pause: 900,
  });
  await page.waitForTimeout(900);
});

await withRecording("02-crm", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(1000);
  await page.addStyleTag({ content: CLEAN });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana|New|חדש/i }).first();
  await humanMove(page, row, { click: true, steps: 24, after: 1600 });
  await page.addStyleTag({ content: FOCUS.card });
  for (const name of [/Call|שיחה|התקשר/i, /WhatsApp/i, /Task|משימה/i]) {
    await humanMove(page, page.getByRole("button", { name }).first(), {
      click: false,
      steps: 16,
      pause: 380,
    });
  }
  const tasksTab = page
    .getByRole("tab", { name: /Tasks|משימות/i })
    .or(page.locator("button,a").filter({ hasText: /^Tasks$|^משימות$/ }))
    .first();
  await humanMove(page, tasksTab, { click: true, steps: 18, after: 1400 });
  await page.waitForTimeout(900);
});

await withRecording("03-whatsapp", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/whatsapp/inbox`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(1800);
  await page.addStyleTag({ content: FOCUS.wa });
  const chat = page.locator("text=/יעל|Yael|עומר/").first();
  await humanMove(page, chat, { click: true, steps: 26, after: 800 });
  await page
    .locator("text=/טוען את וואטסאפ|Loading WhatsApp/i")
    .first()
    .waitFor({ state: "hidden", timeout: 25000 })
    .catch(() => undefined);
  await page.waitForTimeout(1000);
  await humanMove(page, page.locator("text=/family shoot|Sunday|session|תודה|בוקר/i").first(), {
    click: false,
    steps: 18,
    pause: 700,
  });
  const reply = page.getByPlaceholder(/Type a reply|הקלד|כתוב|תשובה/i).first();
  if (await humanMove(page, reply, { click: true, steps: 20, after: 350 })) {
    await reply.fill("");
    await reply.type("נשמח לתאם שיחת היכרות קצרה מחר בבוקר", { delay: 24 });
    await page.waitForTimeout(700);
    await humanMove(page, page.getByRole("button", { name: /Reply|שלח|תשובה|Send/i }).first(), {
      click: false,
      steps: 16,
      pause: 900,
    });
  }
  await page.waitForTimeout(800);
});

await withRecording("04-automation", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/automations/${AUTO_ID}`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(1600);
  await page.addStyleTag({ content: FOCUS.auto });
  await page.waitForTimeout(400);
  const nodes = page.locator(".react-flow__node");
  const count = await nodes.count();
  for (let i = 0; i < Math.min(count, 5); i += 1) {
    await humanMove(page, nodes.nth(i), { click: false, steps: 16, pause: 420 });
  }
  const canvas = page.locator(".react-flow__viewport, .react-flow, main").first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5, { steps: 8 });
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.48, { steps: 28 });
    await page.mouse.up();
    await page.waitForTimeout(700);
  }
  await humanMove(page, page.getByRole("button", { name: /Publish|פרסם/i }).first(), {
    click: false,
    steps: 18,
    pause: 900,
  });
  await page.waitForTimeout(900);
});

await withRecording("05-task", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await page.waitForTimeout(1000);
  await page.addStyleTag({ content: CLEAN });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana|New|חדש/i }).first();
  await humanMove(page, row, { click: true, steps: 22, after: 1500 });
  await page.addStyleTag({ content: FOCUS.card });
  const taskBtn = page.getByRole("button", { name: /Task|משימה/i }).first();
  if (!(await humanMove(page, taskBtn, { click: true, steps: 20, after: 1600 }))) {
    await humanMove(page, page.getByRole("tab", { name: /Tasks|משימות/i }).first(), {
      click: true,
      steps: 18,
      after: 1400,
    });
  }
  const title = page.getByPlaceholder(/title|כותרת|Task|משימה/i).first();
  if (await title.count()) {
    await humanMove(page, title, { click: true, steps: 14, after: 280 });
    await title.fill("שיחת חזרה — מעקב ליד חדש");
    await page.waitForTimeout(900);
  }
  await page.waitForTimeout(1100);
});

const concatPath = path.join(OUT, "concat.txt");
fs.writeFileSync(
  concatPath,
  ["01-lead", "02-crm", "03-whatsapp", "04-automation", "05-task"]
    .map((n) => `file '${path.join(OUT, `${n}.mp4`)}'`)
    .join("\n"),
);
const processMp4 = path.join(PUBLIC, "process-full.mp4");
await run("ffmpeg", [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  concatPath,
  "-c:v",
  "libx264",
  "-preset",
  "fast",
  "-crf",
  "19",
  "-pix_fmt",
  "yuv420p",
  "-movflags",
  "+faststart",
  processMp4,
]);
await extractPoster(processMp4, path.join(PUBLIC, "process-full.jpg"), "2.0");
console.log("process-full", fs.statSync(processMp4).size);
console.log("All walkthrough films ready");
