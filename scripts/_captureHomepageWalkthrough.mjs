/**
 * Capture clean marketing walkthrough films from the staging demo workspace.
 * Auth + page warm-up happen before video recording so login/loading chrome
 * never appear in the exported clips.
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
    padding: 12px 16px !important;
    max-width: none !important;
    width: 100% !important;
  }
`;

const FOCUS = {
  lead: `
    ${CLEAN}
    main, [class*="MainContent"], [class*="page-content"] {
      transform: scale(1.42);
      transform-origin: top center;
    }
    table th:nth-child(n+6), table td:nth-child(n+6) { display: none !important; }
  `,
  card: `
    ${CLEAN}
    [role="dialog"], [class*="Modal"], [class*="Drawer"], [class*="drawer"], [class*="Sheet"] {
      transform: scale(1.18);
      transform-origin: center top;
    }
  `,
  cardTight: `
    ${CLEAN}
    [role="dialog"], [class*="Modal"], [class*="Drawer"], [class*="drawer"], [class*="Sheet"] {
      transform: scale(1.28);
      transform-origin: center 18%;
    }
  `,
  wa: `
    ${CLEAN}
    main, [class*="MainContent"], [class*="page-content"] {
      transform: scale(1.28);
      transform-origin: top center;
    }
  `,
  auto: `
    ${CLEAN}
    main, [class*="MainContent"], [class*="page-content"] {
      transform: scale(1.22);
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
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-1200)))));
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
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    mp4,
  ]);
}

async function extractPoster(mp4, jpg, ss = "1.2") {
  await run("ffmpeg", ["-y", "-ss", ss, "-i", mp4, "-frames:v", "1", "-q:v", "2", "-update", "1", jpg]);
}

async function humanMove(page, selector, opts = {}) {
  try {
    const loc = typeof selector === "string" ? page.locator(selector).first() : selector;
    await loc.waitFor({ state: "visible", timeout: opts.timeout || 14000 });
    const box = await loc.boundingBox();
    if (!box) return false;
    const x = box.x + box.width * (opts.x || 0.5);
    const y = box.y + box.height * (opts.y || 0.45);
    await page.mouse.move(x, y, { steps: opts.steps || 28 });
    await page.waitForTimeout(opts.pause || 280);
    if (opts.click !== false) {
      await page.mouse.down();
      await page.waitForTimeout(80);
      await page.mouse.up();
      await page.waitForTimeout(opts.after || 650);
    }
    return true;
  } catch {
    return false;
  }
}

async function waitLoadingGone(page, timeout = 35000) {
  const loading = page.locator("text=/^טוען\\.?\\.\\.|^Loading\\.?\\.\\./i");
  const start = Date.now();
  while (Date.now() - start < timeout) {
    const visible = await loading
      .first()
      .isVisible()
      .catch(() => false);
    if (!visible) {
      await page.waitForTimeout(350);
      const again = await loading
        .first()
        .isVisible()
        .catch(() => false);
      if (!again) return true;
    }
    await page.waitForTimeout(400);
  }
  return false;
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
  await page.waitForURL("**/dashboard/**", { timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page, 25000);
  await context.storageState({ path: AUTH });
  await browser.close();
  console.log("auth saved", AUTH);
}

/**
 * Warm navigation without recording, then open a recording context on a blank
 * page and jump to the already-warm URL path via storageState + goto with
 * cache-hot assets. Still may flash; prefer waitLoadingGone + ffmpeg trim.
 */
async function withRecording(name, action) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: "he-IL",
    colorScheme: "light",
    storageState: AUTH,
    recordVideo: { dir: OUT, size: { width: 1440, height: 900 } },
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
  console.log("raw", name, fs.statSync(mp4).size);
  return mp4;
}

async function polishClip({
  src,
  dest,
  poster,
  trimStart = 1.2,
  duration = 6.2,
  crop = "in_w*0.72:in_h*0.72:(in_w-out_w)/2:(in_h-out_h)*0.18",
  scale = "1280:720",
  zoomEnd = 1.08,
}) {
  // Crop → scale → subtle zoompan for action readability, then trim
  const vf = [
    `trim=start=${trimStart}:duration=${duration}`,
    "setpts=PTS-STARTPTS",
    `crop=${crop}`,
    `scale=${scale}:flags=lanczos`,
    `zoompan=z='min(zoom+0.00055,${zoomEnd})':x='iw/2-(iw/zoom/2)':y='ih*0.32-(ih/zoom/2)':d=1:s=${scale.replace(":", "x")}:fps=30`,
    "format=yuv420p",
  ].join(",");
  await run("ffmpeg", [
    "-y",
    "-i",
    src,
    "-an",
    "-vf",
    vf,
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "18",
    "-movflags",
    "+faststart",
    dest,
  ]);
  await extractPoster(dest, poster, "0.8");
  fs.copyFileSync(dest, path.join(PUBLIC, path.basename(dest)));
  fs.copyFileSync(poster, path.join(PUBLIC, path.basename(poster)));
  console.log("OK", path.basename(dest), fs.statSync(dest).size);
}

async function polishMobile({ src, dest, poster, trimStart = 1.4, duration = 5.8 }) {
  // Tighter portrait-friendly crop of the action area
  await polishClip({
    src,
    dest,
    poster,
    trimStart,
    duration,
    crop: "in_w*0.58:in_h*0.62:(in_w-out_w)/2:(in_h-out_h)*0.12",
    scale: "720:900",
    zoomEnd: 1.1,
  });
}

await ensureAuth();

await withRecording("01-lead", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: FOCUS.lead });
  await page.waitForTimeout(500);
  const search = page.getByPlaceholder(/Search|חיפוש/i).first();
  await humanMove(page, search, { click: false, steps: 18, pause: 350 });
  const newLead = page.locator("table tbody tr").filter({ hasText: /New|חדש/i }).first();
  await humanMove(page, newLead, { click: false, steps: 28, pause: 550 });
  await humanMove(page, newLead, { click: true, steps: 12, after: 900 });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: FOCUS.card });
  await humanMove(page, page.getByRole("button", { name: /WhatsApp/i }).first(), {
    click: false,
    steps: 22,
    pause: 700,
  });
  await humanMove(page, page.getByRole("button", { name: /Task|משימה/i }).first(), {
    click: false,
    steps: 16,
    pause: 700,
  });
  await page.waitForTimeout(700);
});

await withRecording("02-crm", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana|New|חדש|שחר|michal/i }).first();
  await humanMove(page, row, { click: true, steps: 24, after: 500 });
  await waitLoadingGone(page, 45000);
  await page.addStyleTag({ content: FOCUS.cardTight });
  await page.waitForTimeout(400);
  for (const name of [/WhatsApp/i, /Task|משימה/i, /Meeting|פגישה/i]) {
    await humanMove(page, page.getByRole("button", { name }).first(), {
      click: false,
      steps: 18,
      pause: 420,
    });
  }
  const status = page.getByRole("button", { name: /הומר|Converted|מעוניין|Interested|חדש|New/i }).first();
  await humanMove(page, status, { click: false, steps: 16, pause: 500 });
  const notesTab = page
    .getByRole("tab", { name: /Notes|הערות|Activity|פעילות/i })
    .or(page.locator("button,a").filter({ hasText: /הערות ופעילות|Notes/i }))
    .first();
  await humanMove(page, notesTab, { click: true, steps: 18, after: 900 });
  await waitLoadingGone(page, 20000);
  await page.waitForTimeout(900);
});

await withRecording("03-whatsapp", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/whatsapp/inbox`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page);
  await page
    .locator("text=/טוען את וואטסאפ|Loading WhatsApp/i")
    .first()
    .waitFor({ state: "hidden", timeout: 35000 })
    .catch(() => undefined);
  await page.addStyleTag({ content: FOCUS.wa });
  await page.waitForTimeout(500);
  const chat = page.locator("text=/יעל|Yael|עומר|Omer|דנה|Dana/").first();
  await humanMove(page, chat, { click: true, steps: 26, after: 700 });
  await waitLoadingGone(page);
  await page
    .locator("text=/טוען את וואטסאפ|Loading WhatsApp/i")
    .first()
    .waitFor({ state: "hidden", timeout: 25000 })
    .catch(() => undefined);
  await humanMove(page, page.locator("text=/family shoot|Sunday|session|תודה|בוקר|שלום/i").first(), {
    click: false,
    steps: 18,
    pause: 650,
  });
  const reply = page.getByPlaceholder(/Type a reply|הקלד|כתוב|תשובה/i).first();
  if (await humanMove(page, reply, { click: true, steps: 20, after: 280 })) {
    await reply.fill("");
    await reply.type("נשמח לתאם שיחת היכרות קצרה מחר בבוקר", { delay: 22 });
    await page.waitForTimeout(500);
    await humanMove(page, page.getByRole("button", { name: /Reply|שלח|תשובה|Send/i }).first(), {
      click: false,
      steps: 16,
      pause: 800,
    });
  }
  await page.waitForTimeout(700);
});

await withRecording("04-automation", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/automations/${AUTO_ID}`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: FOCUS.auto });
  await page.waitForTimeout(500);
  const nodes = page.locator(".react-flow__node");
  const count = await nodes.count();
  for (let i = 0; i < Math.min(count, 5); i += 1) {
    await humanMove(page, nodes.nth(i), { click: i === 2, steps: 16, pause: 380, after: 700 });
  }
  const canvas = page.locator(".react-flow__viewport, .react-flow, main").first();
  const box = await canvas.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.35, box.y + box.height * 0.5, { steps: 8 });
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.62, box.y + box.height * 0.48, { steps: 30 });
    await page.mouse.up();
    await page.waitForTimeout(600);
  }
  await humanMove(page, page.getByRole("button", { name: /Publish|פרסם/i }).first(), {
    click: false,
    steps: 18,
    pause: 850,
  });
  await page.waitForTimeout(700);
});

await withRecording("05-task", async (page) => {
  await page.goto(`${BASE}/business/${BIZ}/dashboard/crm/leads`, {
    waitUntil: "networkidle",
    timeout: 90000,
  });
  await waitLoadingGone(page);
  await page.addStyleTag({ content: CLEAN });
  const row = page.locator("table tbody tr").filter({ hasText: /דנה|Dana|New|חדש|שחר|michal/i }).first();
  await humanMove(page, row, { click: true, steps: 22, after: 500 });
  await waitLoadingGone(page, 45000);
  await page.addStyleTag({ content: FOCUS.cardTight });
  const taskBtn = page.getByRole("button", { name: /Task|משימה/i }).first();
  await humanMove(page, taskBtn, { click: true, steps: 20, after: 600 });
  await waitLoadingGone(page, 25000);
  // Prefer tasks tab content if modal/form opened empty
  const tasksTab = page
    .getByRole("tab", { name: /Tasks|משימות/i })
    .or(page.locator("button,a").filter({ hasText: /^Tasks$|^משימות$/ }))
    .first();
  await humanMove(page, tasksTab, { click: true, steps: 16, after: 700 });
  await waitLoadingGone(page, 20000);
  const title = page
    .getByPlaceholder(/title|כותרת|Task|משימה|לביצוע/i)
    .or(page.locator('input[name*="title" i], textarea[name*="title" i]'))
    .first();
  if (await title.count()) {
    await humanMove(page, title, { click: true, steps: 14, after: 220 });
    await title.fill("");
    await title.type("שיחת חזרה — מעקב ליד חדש", { delay: 28 });
    await page.waitForTimeout(500);
  }
  const save = page.getByRole("button", { name: /Save|שמור|Create|צור|Add|הוסף/i }).first();
  if (await save.isVisible().catch(() => false)) {
    await humanMove(page, save, { click: true, steps: 12, after: 1000 });
  }
  await waitLoadingGone(page, 15000);
  await page.waitForTimeout(900);
});

// Copy raw sources into public as full-length reference clips
for (const name of ["01-lead", "02-crm", "03-whatsapp", "04-automation", "05-task"]) {
  const mp4 = path.join(OUT, `${name}.mp4`);
  fs.copyFileSync(mp4, path.join(PUBLIC, `${name}.mp4`));
  await extractPoster(mp4, path.join(PUBLIC, `${name}.jpg`), "2.5");
}

// Hero (desktop) polished clips — trim loading, zoom action
const heroSpecs = {
  "01-lead": { trimStart: 2.2, duration: 5.6, crop: "in_w*0.70:in_h*0.68:(in_w-out_w)/2:(in_h-out_h)*0.10" },
  "02-crm": { trimStart: 3.5, duration: 6.0, crop: "in_w*0.62:in_h*0.64:(in_w-out_w)/2:(in_h-out_h)*0.08" },
  "03-whatsapp": { trimStart: 2.8, duration: 6.4, crop: "in_w*0.68:in_h*0.70:(in_w-out_w)/2:(in_h-out_h)*0.12" },
  "04-automation": { trimStart: 2.4, duration: 6.2, crop: "in_w*0.74:in_h*0.70:(in_w-out_w)*0.15:(in_h-out_h)*0.10" },
  "05-task": { trimStart: 4.0, duration: 5.8, crop: "in_w*0.60:in_h*0.62:(in_w-out_w)/2:(in_h-out_h)*0.10" },
};

for (const [name, spec] of Object.entries(heroSpecs)) {
  const src = path.join(OUT, `${name}.mp4`);
  const dest = path.join(OUT, `hero-${name}.mp4`);
  const poster = path.join(OUT, `hero-${name}.jpg`);
  await polishClip({ src, dest, poster, ...spec, scale: "1280:720", zoomEnd: 1.09 });
}

for (const [name, spec] of Object.entries(heroSpecs)) {
  const src = path.join(OUT, `${name}.mp4`);
  const dest = path.join(OUT, `mobile-${name}.mp4`);
  const poster = path.join(OUT, `mobile-${name}.jpg`);
  await polishMobile({
    src,
    dest,
    poster,
    trimStart: spec.trimStart + 0.3,
    duration: Math.max(5.2, spec.duration - 0.4),
  });
}

// Continuous process film with crossfades (no hard jumps)
const processParts = ["01-lead", "02-crm", "03-whatsapp", "04-automation", "05-task"].map((n) =>
  path.join(OUT, `hero-${n}.mp4`),
);
const processOut = path.join(PUBLIC, "process-full.mp4");
// xfade chain
let filter = "";
let last = "[0:v]";
const inputs = [];
for (const p of processParts) inputs.push("-i", p);
for (let i = 1; i < processParts.length; i += 1) {
  const out = i === processParts.length - 1 ? "[vout]" : `[v${i}]`;
  // offset approx duration-0.45; use short xfade
  filter += `${last}[${i}:v]xfade=transition=fade:duration=0.45:offset=${5.2 * i - 0.45}${out};`;
  last = out;
}
filter = filter.replace(/;$/, "");
try {
  await run("ffmpeg", [
    "-y",
    ...inputs,
    "-filter_complex",
    filter || "[0:v]null[vout]",
    "-map",
    "[vout]",
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "fast",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    processOut,
  ]);
} catch (err) {
  console.warn("xfade failed, falling back to concat", err.message.slice(0, 200));
  const concatPath = path.join(OUT, "concat-hero.txt");
  fs.writeFileSync(concatPath, processParts.map((p) => `file '${p}'`).join("\n"));
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
    "18",
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    processOut,
  ]);
}
await extractPoster(processOut, path.join(PUBLIC, "process-full.jpg"), "2.2");
console.log("process-full", fs.statSync(processOut).size);
console.log("All walkthrough films ready");
