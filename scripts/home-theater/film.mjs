/**
 * Records the six-step BizUply process film on the staging demo workspace.
 *   LANG_UI=he|en MOBILE=0|1 [DRY=1] [FILM_BASE=...] node scripts/home-theater/film.mjs
 * Opens the marked demo lead that is already in the account. It does not call Meta or a webhook.
 * Every step asserts its real server response / UI result; nothing is faked.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { cursorScript, createRecorder, segmentsToMp4, joinChapters, glide, run, login } from "./recorder.mjs";

const LANG = process.env.LANG_UI || "he";
const MOBILE = process.env.MOBILE === "1";
const DRY = process.env.DRY === "1";
const BASE = process.env.FILM_BASE || "https://mybusiness-platform-client-staging.vercel.app";
const API = "https://server-staging-15bb.up.railway.app/api";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = process.env.AUTO_ID || "6af1e65d76c39b752eefa9e4";
const TAG = `${LANG}-${MOBILE ? "mobile" : "desktop"}`;
const OUT = `${process.env.CAPTURE_DIR || "/tmp/home-theater"}/film-${TAG}`;
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(process.env.CAPTURE_DIR || "/tmp/home-theater", { recursive: true });

const CSS_W = MOBILE ? 390 : 1680;
const CSS_H = MOBILE ? 844 : 1000;
const DPR = MOBILE ? 3 : 1;
const PX_W = Math.round(CSS_W * DPR);
const PX_H = Math.round(CSS_H * DPR);

const C = JSON.parse(fs.readFileSync(process.env.CUSTOMER || new URL(`./customers/customer-${TAG}.json`, import.meta.url), "utf8"));
const L = {
  he: {
    notesTab: "הערות ופעילות", tasksTab: "משימות", meetingsTab: "פגישות", meetingTitle: "כותרת פגישה", addMeeting: "הוספת פגישה", taskQuick: "משימה", noteSave: "שמור הערה", addTask: "הוספת משימה",
    reply: "תשובה", test: "בדיקה", runTest: "הרצת בדיקה", close: "סגירה",
  },
  en: {
    notesTab: "Notes and activity", tasksTab: "Tasks", meetingsTab: "Meetings", meetingTitle: "Meeting title", addMeeting: "Add meeting", taskQuick: "Task", noteSave: "Save note", addTask: "Add task",
    reply: "Reply", test: "Test", runTest: "Run a test", close: "Close",
  },
}[LANG];
if (process.env.LABELS) Object.assign(L, JSON.parse(process.env.LABELS));

const log = (...a) => console.log(`[${TAG}]`, ...a);
const conversationPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("972") || digits.startsWith("1")) return digits;
  return "972" + digits.replace(/^0/, "");
};
const fail = (msg) => { throw new Error(`[${TAG}] ${msg}`); };

const browser = await chromium.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: [
    ...(MOBILE ? [`--force-device-scale-factor=${DPR}`] : []),
    MOBILE ? "--window-size=500,1000" : `--window-size=${CSS_W},${CSS_H}`,
    "--hide-scrollbars",
    `--lang=${LANG === "he" ? "he-IL" : "en-US"}`,
  ],
});
const ctx = await browser.newContext({
  viewport: { width: CSS_W, height: CSS_H },
  deviceScaleFactor: DPR,
  isMobile: MOBILE,
  hasTouch: MOBILE,
  locale: LANG === "he" ? "he-IL" : "en-US",
  timezoneId: "Asia/Jerusalem",
  userAgent: MOBILE
    ? "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1"
    : undefined,
});
await ctx.addInitScript(cursorScript(MOBILE ? "touch" : "desktop"));
const FILM_CSS = `
  header.fixed.z-30 { display: none !important; }
  main[data-testid="business-dashboard-main"] { padding-top: 0 !important; }
  .bizuply-chat-launcher,
  section.fixed.bottom-6.right-6,
  .cookie-banner { display: none !important; }
`;
await ctx.addInitScript((css) => {
  const install = () => {
    const root = document.head || document.documentElement;
    if (!root || document.getElementById("film-chrome")) return;
    const style = document.createElement("style");
    style.id = "film-chrome";
    style.textContent = css;
    root.appendChild(style);
  };
  install();
  document.addEventListener("DOMContentLoaded", install);
}, FILM_CSS);
await ctx.addInitScript((lang) => {
  localStorage.setItem("i18nextLng", lang);
  localStorage.setItem("bizuply.lang", lang);
  localStorage.setItem("bizuply_lang_preference", lang);
  localStorage.setItem("bizuply_lang_resolved", lang);
}, LANG);
await ctx.addCookies([{ name: "bizuply_tracking", value: "v2:none:2026-11-07", url: BASE }]);
const page = await ctx.newPage();
page.setDefaultTimeout(30000);
await login(page, BASE, LANG);
await page.getByRole("button", { name: /חיוניות בלבד|Essential cookies only|Solo cookies esenciales|Somente cookies essenciais|الضرورية فقط/ }).click({ timeout: 2500 }).catch(() => {});
await ctx.storageState({ path: (process.env.CAPTURE_DIR || "/tmp/home-theater") + "/auth.json" });
{
  const token = await page.evaluate(() => localStorage.getItem("token"));
  const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-business-id": BIZ, Origin: BASE };
  const own = conversationPhone(C.phone);
  for (const ph of (process.env.CLEAN_PHONES || "").split(",").filter(Boolean)) {
    if (ph === own) continue;
    const r = await fetch(`${API}/whatsapp/conversations/${ph}`, { method: "DELETE", headers: H });
    log("cleanup thread", ph, r.status);
  }
}
const replies = [];
page.on("response", async (r) => {
  if (/\/whatsapp\/conversations\/[^/]+\/reply$/.test(r.url())) {
    try { replies.push(await r.json()); } catch { replies.push({ unreadable: true }); }
  }
});

process.on("exit", () => { try { fs.writeFileSync(`${OUT}/partial.json`, JSON.stringify({ chapters, C })); } catch {} });
process.on("unhandledRejection", async (e) => { console.error("FAIL", e?.message?.slice(0, 400)); try { await page.screenshot({ path: `${OUT}/fail.png` }); console.error("url", page.url()); } catch {} process.exit(1); });
const cur = { x: CSS_W * 0.55, y: CSS_H * 0.6 };
const rec = await createRecorder(page, path.join(OUT, "frames"), { width: PX_W, height: PX_H });
const chapters = [];
let chapter = null;

function beginChapter(id) {
  cut();
  chapter = { id, firstSeg: rec.segmentCount };
  chapters.push(chapter);
}
async function keep() { await rec.resume(); }
function cut() {
  if (!rec.keeping) return;
  rec.pause();
}
async function endChapter() {
  cut();
}

const dashboard = (p) => `${BASE}${LANG === "he" ? "/he" : ""}/business/${BIZ}/dashboard/${p}`;
const AUTO = process.env.AUTO_ID || (LANG === "he" ? "6af1e65d76c39b752eefa9e4" : "6af1ed4e76c39b752eefb2b2");

/** Compile the dashboard routes before the film, so the take does not sit on the loading screen. */
for (const path of ["crm/leads", "whatsapp/inbox"]) {
  await page.goto(dashboard(path), { waitUntil: "domcontentloaded", timeout: 120000 });
  await page.locator("aside, .ht-root, .crm-leads, .react-flow").first().waitFor({ timeout: 90000 }).catch(() => {});
  await page.waitForTimeout(1200);
  log("warmed", path, page.url());
}

async function settle(ms = 600) { await page.waitForTimeout(ms); }

async function goto(p, ready) {
  cut();
  await page.goto(dashboard(p), { waitUntil: "domcontentloaded", timeout: 90000 });
  await rec.restart();
  await ready();
  await page.addStyleTag({ content: FILM_CSS }).catch(() => {});
  await hideAssistant();
  await page.getByRole("button", { name: /חיוניות בלבד|Essential cookies only|Solo cookies esenciales|Somente cookies essenciais|الضرورية רק|الضرورية فقط/ }).click({ timeout: 800 }).catch(() => {});
  await page.mouse.move(cur.x, cur.y);
  await settle(700);
}

/** Wait for a condition; if it takes longer than `grace` ms, the wait is cut from the film. */
async function waitOrCut(fn, { grace = 650, timeout = 45000, label = "" } = {}) {
  const started = Date.now();
  let done = false;
  const p = fn().then(() => { done = true; });
  while (!done && Date.now() - started < grace) await page.waitForTimeout(50);
  if (!done) {
    cut();
    await Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout " + label)), timeout))]);
    await settle(450);
    await keep();
  } else {
    await p;
  }
}

async function hideAssistant() {
  await page.evaluate(() => {
    document.querySelectorAll(".bizuply-chat-launcher").forEach((node) => node.remove());
    for (const button of document.querySelectorAll("button[aria-label]")) {
      const label = button.getAttribute("aria-label") || "";
      if (label === "Close chat" || label.includes("הצ'אט") || label.includes("הצ׳אט")) button.click();
    }
  }).catch(() => {});
}

async function to(locator, { click = true, pause = 220, after = 380, dx = 0.5, dy = 0.5 } = {}) {
  await hideAssistant();
  await locator.waitFor({ state: "visible" });
  const pre = await locator.boundingBox();
  if (pre && (pre.y < 56 || pre.y + pre.height > CSS_H - 24 || pre.x < 0 || pre.x + pre.width > CSS_W)) {
    await locator.evaluate((el) => el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" }));
    await page.waitForTimeout(800);
  }
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) fail("no box");
  const x = box.x + box.width * dx, y = box.y + box.height * dy;
  await glide(page, cur, x, y);
  await page.waitForTimeout(pause);
  if (click) {
    await page.mouse.down();
    await page.waitForTimeout(70);
    await page.mouse.up();
    await page.waitForTimeout(after);
  }
}

/** Mobile tables are wider than the phone. Glide the real overflow so every column is shown, then return to the name. */
async function panLeadsTable() {
  if (!MOBILE) return;
  await page.evaluate(async () => {
    const el = document.querySelector(".crm-leads-table");
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    if (max < 24) return;
    const start = el.scrollLeft;
    el.scrollLeft = start + 8;
    const positive = el.scrollLeft > start + 1;
    el.scrollLeft = start;
    const end = positive ? start + max : start - max;
    const glideTo = (from, to, ms) => new Promise((resolve) => {
      const t0 = performance.now();
      const frame = (now) => {
        const p = Math.min(1, (now - t0) / ms);
        const eased = 1 - (1 - p) ** 3;
        el.scrollLeft = from + (to - from) * eased;
        if (p < 1) requestAnimationFrame(frame);
        else resolve();
      };
      requestAnimationFrame(frame);
    });
    await glideTo(start, end, 1500);
    await new Promise((resolve) => setTimeout(resolve, 900));
    await glideTo(el.scrollLeft, start, 1200);
  });
  await settle(350);
}

async function typeText(text, delay = 15) {
  await page.keyboard.type(text, { delay });
}

const leadRow = () => page.locator("table tbody tr").filter({ hasText: C.phone }).first();
const listReady = async () => { await page.locator("table").first().waitFor({ timeout: 60000 }); };
const cardReady = async () => { await page.getByRole("button", { name: L.notesTab, exact: true }).waitFor({ timeout: 60000 }); };
const card = () => page.locator(".crm-dossier");

async function revealLeadRow() {
  await leadRow().evaluate((row) => row.scrollIntoView({ behavior: "smooth", block: "center" }));
  await settle(1100);
}

async function assertLeadRow() {
  await waitOrCut(() => leadRow().waitFor({ timeout: 30000 }), { grace: 400, label: "row" });
  const rowText = await leadRow().innerText();
  if (!rowText.includes(C.name) || !rowText.includes(C.campaignName) || !rowText.includes(C.formName) || !rowText.includes("Meta Lead Ads")) {
    fail(`demo row mismatch ${rowText.slice(0, 240)}`);
  }
  log("demo lead row", C.phone);
}

/** A product-tour form. It never posts to Meta or to a webhook. */
async function showDemoForm() {
  await page.evaluate((copy) => {
    document.getElementById("demo-form-sim")?.remove();
    const wrap = document.createElement("div");
    wrap.id = "demo-form-sim";
    wrap.setAttribute("dir", copy.dir);
    const aside = document.querySelector("aside");
    const box = aside ? aside.getBoundingClientRect() : null;
    const overlap = box ? Math.min(box.right, innerWidth) - Math.max(box.left, 0) : 0;
    const visible = overlap > 40;
    const onRight = visible && box.left > innerWidth / 2;
    const gap = visible ? Math.ceil(overlap) : 0;
    const narrow = innerWidth < 520;
    wrap.style.cssText = `position:fixed;top:0;bottom:0;z-index:80;display:flex;align-items:center;justify-content:center;background:rgba(33,23,47,.46);padding:${narrow ? 12 : 24}px;${onRight ? `left:0;right:${gap}px;` : `right:0;left:${gap}px;`}`;
    wrap.innerHTML = `
      <form id="demo-form-card" style="width:min(540px,100%);max-height:calc(100vh - 24px);overflow:auto;background:#fff;border-radius:${narrow ? 18 : 24}px;padding:${narrow ? "18px 16px 16px" : "28px 28px 22px"};box-shadow:0 24px 70px rgba(33,23,47,.28);color:#21172f;font-family:Assistant,Arial,sans-serif;">
        <p style="margin:0;color:#6d28d9;font-size:13px;font-weight:800;letter-spacing:.02em;">${copy.kicker}</p>
        <h2 style="margin:8px 0 6px;font-size:28px;line-height:1.2;">${copy.title}</h2>
        <p style="margin:0 0 14px;color:#5b5568;font-size:14px;line-height:1.5;">${copy.note}</p>
        <p style="margin:0 0 16px;padding:8px 12px;border-radius:12px;background:#f6f3ff;color:#5b21b6;font-size:13px;font-weight:700;">${copy.campaign}</p>
        <label style="display:block;margin-bottom:10px;font-size:13px;font-weight:800;">${copy.name}<input id="demo-lead-name" style="display:block;width:100%;margin-top:4px;padding:10px 12px;border:1px solid #e7e3f5;border-radius:12px;font:inherit;font-weight:600;"></label>
        <label style="display:block;margin-bottom:10px;font-size:13px;font-weight:800;">${copy.phone}<input id="demo-lead-phone" dir="ltr" style="display:block;width:100%;margin-top:4px;padding:10px 12px;border:1px solid #e7e3f5;border-radius:12px;font:inherit;font-weight:600;text-align:left;"></label>
        <label style="display:block;margin-bottom:10px;font-size:13px;font-weight:800;">${copy.email}<input id="demo-lead-email" dir="ltr" style="display:block;width:100%;margin-top:4px;padding:10px 12px;border:1px solid #e7e3f5;border-radius:12px;font:inherit;font-weight:600;text-align:left;"></label>
        <label style="display:block;margin-bottom:16px;font-size:13px;font-weight:800;">${copy.message}<textarea id="demo-lead-message" rows="2" style="display:block;width:100%;margin-top:4px;padding:10px 12px;border:1px solid #e7e3f5;border-radius:12px;font:inherit;font-weight:600;resize:none;"></textarea></label>
        <button id="demo-lead-submit" type="button" style="border:0;border-radius:14px;background:#6d28d9;color:#fff;font:inherit;font-weight:800;padding:12px 18px;cursor:pointer;">${copy.submit}</button>
      </form>`;
    wrap.querySelector("#demo-lead-submit").addEventListener("click", (event) => {
      event.preventDefault();
      wrap.remove();
    });
    document.body.appendChild(wrap);
  }, LANG === "he" ? {
    dir: "rtl",
    kicker: "הדמיית טופס לידים",
    title: C.formName,
    note: "סיור במוצר בלבד. הטופס לא נשלח לפייסבוק ולא נוצרת פנייה אמיתית.",
    campaign: `קמפיין: ${C.campaignName}`,
    name: "שם",
    phone: "טלפון",
    email: "אימייל",
    message: "הודעה",
    submit: "שליחה להדגמה",
  } : {
    dir: "ltr",
    kicker: "Lead form simulation",
    title: C.formName,
    note: "Product tour only. This form is not sent to Facebook and no real enquiry is created.",
    campaign: `Campaign: ${C.campaignName}`,
    name: "Name",
    phone: "Phone",
    email: "Email",
    message: "Message",
    submit: "Submit demo",
  });
}

async function playDemoForm() {
  await settle(800);
  for (const [sel, value] of [
    ["#demo-lead-name", C.name],
    ["#demo-lead-phone", C.phone],
    ["#demo-lead-email", C.email],
    ["#demo-lead-message", C.message],
  ]) {
    await to(page.locator(sel), { after: 160 });
    await typeText(value, 34);
    await settle(240);
  }
  await settle(500);
  await to(page.locator("#demo-lead-submit"), { after: 250 });
  await page.locator("#demo-form-sim").waitFor({ state: "detached", timeout: 5000 });
  await settle(900);
}

/* ---------- 1. Simulated lead form ---------- */
beginChapter("form");
await goto("crm/leads", listReady);
const vp = await page.evaluate(() => [innerWidth, innerHeight]);
log("viewport", vp);
if (vp[0] !== CSS_W) fail(`viewport width ${vp[0]}`);
if (DRY) C.name = process.env.DRY_NAME || "Dana Israeli";
C.meetingTitle = C.meetingTitle || (LANG === "he" ? "הדגמה אישית עם שירה מזרחי" : "Personal demo with Olivia Parker");
await showDemoForm();
await keep();
await playDemoForm();
await endChapter();

/* ---------- 2. The lead is in the CRM list ---------- */
beginChapter("list");
await keep();
await settle(400);
await revealLeadRow();
await assertLeadRow();
await panLeadsTable();
await to(leadRow().locator("td").nth(1), { click: false, pause: 800 });
await settle(700);
await endChapter();

/* ---------- 3. Open Shira's card ---------- */
beginChapter("card");
await keep();
await to(leadRow().locator("td").nth(1), { after: 180 });
await waitOrCut(cardReady, { grace: 120, label: "card" });
await settle(1600);
await endChapter();

/* ---------- 3. WhatsApp ---------- */
beginChapter("whatsapp");
const waPhone = conversationPhone(C.phone);
await goto(`whatsapp/inbox?phone=${waPhone}`, async () => {
  await page.locator(`[placeholder^="${C.replyPlaceholder}"]`).first().waitFor({ timeout: 60000 });
  await page.getByText(waPhone).first().waitFor({ timeout: 30000 });
  await page.getByText(LANG === "he" ? "טוען את וואטסאפ" : "Loading WhatsApp").first().waitFor({ state: "hidden", timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
});
await keep();
await settle(900);
const composer = page.locator(`[placeholder^="${C.replyPlaceholder}"]`).first();
await to(composer, { after: 200 });
await typeText(C.reply, 28);
await settle(300);
await to(page.getByRole("button", { name: L.reply, exact: true }), { click: !DRY, after: 200 });
if (!DRY) {
await page.getByText(C.reply.slice(0, 24)).first().waitFor({ timeout: 15000 });
const demoNote = LANG === "he"
  ? "הודעת הדמו נשמרה. היא לא נשלחה ללקוח אמיתי."
  : "Demo message saved. It was not sent to a real customer.";
await page.getByText(demoNote).first().waitFor({ timeout: 8000 });
await settle(2400);
const rj = replies[replies.length - 1];
if (!rj?.demoSafe) fail(`reply not demo-safe: ${JSON.stringify(rj).slice(0, 300)}`);
log("whatsapp reply demoSafe", rj.providerMessageId);
}
await endChapter();

/* ---------- 4. Task & meeting ---------- */
beginChapter("task");
await goto("crm/leads", listReady);
await keep();
await settle(500);
await to(leadRow().locator("td").nth(1), { after: 150 });
await waitOrCut(cardReady, { grace: 120, label: "card2" });
await settle(700);
await to(page.getByRole("button", { name: L.meetingsTab, exact: true }), { after: 500 });
if (await page.getByText(C.meetingTitle).count()) {
  log("meeting already on the card");
} else {
const meetingInput = page.getByPlaceholder(L.meetingTitle).first();
await to(meetingInput, { after: 150 });
await typeText(C.meetingTitle);
await page.locator(".crm-dossier input[type='datetime-local']").first().fill(C.taskValue);
await settle(300);
const meetingResp = DRY ? null : page.waitForResponse((r) => /\/crm\/workspace\/leads\/[^/]+\/meetings$/.test(r.url()) && r.request().method() === "POST", { timeout: 20000 });
await to(page.getByRole("button", { name: L.addMeeting, exact: true }), { click: !DRY, after: 100 });
if (!DRY) {
  const mr = await meetingResp;
  if (!mr.ok()) fail(`meeting ${mr.status()}`);
  await page.getByText(C.meetingTitle).first().waitFor({ timeout: 15000 });
  log("meeting saved");
}
}
await settle(900);
await to(page.getByRole("button", { name: L.taskQuick, exact: true }), { after: 600 });
if (await page.getByText(C.task).count()) {
  log("task already on the card");
} else {
const taskInput = page.locator(`input[placeholder^="${C.taskPlaceholder}"]`).first();
await to(taskInput, { after: 150 });
await typeText(C.task);
await settle(300);
const dt = page.locator('input[type="datetime-local"]:visible').first();
const dtBox = await dt.boundingBox();
await to(dt, { after: 150, dx: Math.min(0.2, 18 / dtBox.width) });
await typeText(C.taskDate, 60);
await page.keyboard.press("ArrowRight");
await typeText(C.taskTime, 60);
await settle(400);
const dtValue = await dt.inputValue();
if (dtValue !== C.taskValue) {
  log("datetime typed value", dtValue, "→ fill", C.taskValue);
  await dt.fill(C.taskValue);
}
await settle(500);
const taskResp = DRY ? null : page.waitForResponse((r) => /\/crm\/leads\/[^/]+\/activities/.test(r.url()) && r.request().method() === "POST", { timeout: 20000 });
await to(page.getByRole("button", { name: L.addTask, exact: true }), { click: !DRY, after: 100 });
if (!DRY) {
const tr = await taskResp;
if (!tr.ok()) fail(`task ${tr.status()} ${tr.url()}`);
const savedTask = page.getByText(C.task.slice(0, 24)).first();
await savedTask.waitFor({ state: "attached", timeout: 15000 });
await savedTask.scrollIntoViewIfNeeded();
log("task saved", tr.url());
}
}
await settle(700);
const statusSelect = card().locator("select").filter({ has: page.locator('option[value="interested"]') }).first();
await to(statusSelect, { after: 280 });
if (!DRY) {
  const statusResp = page.waitForResponse((r) => /\/crm\/leads\/[^/]+\/status/.test(r.url()) && r.request().method() !== "GET", { timeout: 20000 });
  await statusSelect.selectOption("interested");
  const sr = await statusResp;
  if (!sr.ok()) fail(`status ${sr.status()}`);
  log("status saved", sr.status());
}
await settle(1500);
await endChapter();

/* ---------- 8. Return to the updated card ---------- */
beginChapter("updated");
await keep();
await settle(400);
await to(card().locator(".crm-close"), { after: 400 });
await settle(500);
await revealLeadRow();
await to(leadRow().locator("td").nth(1), { click: false, pause: 700 });
await to(leadRow().locator("td").nth(1), { after: 160 });
await waitOrCut(cardReady, { grace: 120, label: "card3" });
await settle(800);
await to(card().getByRole("button", { name: L.meetingsTab, exact: true }), { after: 450 });
await card().getByText(C.meetingTitle).first().waitFor({ timeout: 10000 });
await settle(1400);
await to(card().getByRole("button", { name: L.tasksTab, exact: true }), { after: 450 });
await card().getByText(C.task.slice(0, 24)).first().waitFor({ timeout: 10000 });
await settle(1400);
await to(card().getByRole("button", { name: L.notesTab, exact: true }), { after: 450 });
await settle(2200);
await endChapter();

const { frames, segments } = await rec.stop();
await browser.close();

fs.writeFileSync(path.join(OUT, "raw.json"), JSON.stringify({ frames, segments, chapters, C }, null, 1));
log("frames", frames.length, "segments", segments.length);

const clips = [];
for (let i = 0; i < chapters.length; i++) {
  const segs = segments.slice(chapters[i].firstSeg, chapters[i + 1]?.firstSeg ?? segments.length);
  const clip = path.join(OUT, `ch${i + 1}-${chapters[i].id}.mp4`);
  const { duration } = await segmentsToMp4(frames, segs, clip, { width: PX_W, height: PX_H });
  log("chapter", chapters[i].id, duration.toFixed(2) + "s", segs.length, "segments");
  clips.push(clip);
}
const final = path.join(OUT, `process-${TAG}.mp4`);
const { marks, duration } = await joinChapters(clips, final, { crf: MOBILE ? 21 : 20 });
await run("ffmpeg", ["-y", "-ss", "1.0", "-i", final, "-frames:v", "1", "-q:v", "2", "-update", "1", path.join(OUT, `process-${TAG}.jpg`)]);
fs.writeFileSync(path.join(OUT, `process-${TAG}.json`), JSON.stringify({
  size: [PX_W, PX_H], duration: Number(duration.toFixed(2)),
  chapters: chapters.map((c, i) => ({ id: c.id, at: marks[i] })),
  customer: { name: C.name, leadId: C.leadId },
}, null, 2));
log("final", final, duration, JSON.stringify(marks));
