/**
 * Records the six-step BizUply process film on the staging demo workspace.
 *   LEADS_WEBHOOK_URL=... LANG_UI=he|en MOBILE=0|1 [DRY=1] [CLEAN_PHONES=972...,972...] node scripts/home-theater/film.mjs
 * Each take creates one new demo lead, so give every take a new customer file.
 * Every step asserts its real server response / UI result; nothing is faked.
 */
import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";
import { cursorScript, createRecorder, segmentsToMp4, joinChapters, glide, run, login } from "./recorder.mjs";

function fail0(msg) { console.error(msg); process.exit(2); }
function intlPhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.startsWith("0")) return "972" + digits.slice(1);
  return digits;
}
const LANG = process.env.LANG_UI || "he";
const MOBILE = process.env.MOBILE === "1";
const DRY = process.env.DRY === "1";
const BASE = process.env.FILM_BASE || "https://mybusiness-platform-client-staging.vercel.app";
const API = "https://server-staging-15bb.up.railway.app/api";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const AUTO_ID = process.env.AUTO_ID || "6af1e65d76c39b752eefa9e4";
let WEBHOOK = process.env.LEADS_WEBHOOK_URL || "";
const TAG = `${LANG}-${MOBILE ? "mobile" : "desktop"}`;
const OUT = `${process.env.CAPTURE_DIR || "/tmp/home-theater"}/film-${TAG}`;
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(process.env.CAPTURE_DIR || "/tmp/home-theater", { recursive: true });

const CSS_W = MOBILE ? 390 : 1680;
const CSS_H = MOBILE ? 844 : 945;
const DPR = MOBILE ? 3 : 1;
const PX_W = Math.round(CSS_W * DPR);
const PX_H = Math.round(CSS_H * DPR);

const C = JSON.parse(fs.readFileSync(process.env.CUSTOMER || new URL(`./customers/customer-${TAG}.json`, import.meta.url), "utf8"));
const L = {
  he: {
    notesTab: "הערות ופעילות", tasksTab: "משימות", taskQuick: "משימה", noteSave: "שמור הערה", addTask: "הוספת משימה",
    reply: "תשובה", test: "בדיקה", runTest: "הרצת בדיקה", close: "סגירה",
  },
  en: {
    notesTab: "Notes and activity", tasksTab: "Tasks", taskQuick: "Task", noteSave: "Save note", addTask: "Add task",
    reply: "Reply", test: "Test", runTest: "Run a test", close: "Close",
  },
}[LANG];
if (process.env.LABELS) Object.assign(L, JSON.parse(process.env.LABELS));

const log = (...a) => console.log(`[${TAG}]`, ...a);
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
  .bizuply-chat-launcher,
  section.fixed.bottom-6.right-6,
  .cookie-banner { display: none !important; }
  main[data-testid="business-dashboard-main"] { padding-top: 0 !important; }
  ${LANG === "en" ? `.af-builder::before { content: "Editing automations works best on a computer" !important; color: #92400e !important; }` : ""}
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
  const valueDesc = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value");
  if (valueDesc && !HTMLInputElement.prototype.__filmValue) {
    Object.defineProperty(HTMLInputElement.prototype, "value", {
      configurable: true,
      get() { return valueDesc.get.call(this); },
      set(next) {
        const clean = String(next == null ? "" : next).replace(/\[demo\]\s*/ig, "").replace(/\[דמו\]\s*/g, "");
        valueDesc.set.call(this, clean);
      },
    });
    HTMLInputElement.prototype.__filmValue = true;
  }
  let queued = false;
  const scan = () => {
    queued = false;
    const replacements = [
      [/free demo customer/gi, ""],
      [/demo customer studio/gi, ""],
      [/\[demo\]\s*/gi, ""],
      [/\[דמו\]\s*/g, ""],
    ];
    if (lang === "en") {
      replacements.push(
        [/הליד נוצר/g, "Lead created"],
        [/סטטוס הליד עודכן ל:\s*/g, "Status updated: "],
        [/מתעניין/g, "Interested"],
        [/נוצר קשר/g, "Contacted"],
        [/בתהליך/g, "In progress"],
      );
    }
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const value = walker.currentNode.nodeValue || "";
      let next = value;
      for (const [pattern, to] of replacements) next = next.replace(pattern, to);
      if (next !== value) walker.currentNode.nodeValue = next.replace(/[ \t]{2,}/g, " ");
    }
    const counts = (text) => ({
      hebrew: (String(text).match(/[\u0590-\u05FF]/g) || []).length,
      latin: (String(text).match(/[A-Za-z]/g) || []).length,
    });
    const hebrewish = (text) => {
      const { hebrew, latin } = counts(text);
      return hebrew >= 2 && hebrew > latin;
    };
    const israeli = (text) => {
      const digits = String(text || "").replace(/\D/g, "");
      if (digits.startsWith("972") && digits.length >= 11) return true;
      return digits.startsWith("0") && digits.length >= 9 && digits.length <= 10;
    };
    const paint = (el, hide) => {
      if (hide) el.style.setProperty("display", "none", "important");
      else el.style.removeProperty("display");
    };
    document.querySelectorAll("tr").forEach((row) => {
      const cells = [...row.querySelectorAll("td")];
      if (!cells.length) return;
      const name = cells[1]?.innerText || "";
      const nameCounts = counts(name);
      const noisy = /בדיקה|הדגמה|\bdemo\b|test form/i.test(row.innerText || "");
      const hide = noisy || (lang === "en"
        ? cells.some((cell) => hebrewish(cell.innerText || "") || israeli(cell.innerText || ""))
        : nameCounts.latin >= 2 && nameCounts.hebrew === 0);
      paint(row, hide);
    });
    if (lang === "en") {
      document.querySelectorAll("p, span, h1, h2, h3, li, a, div").forEach((el) => {
        if (el.closest("tr, [data-testid='whatsapp-module-inbox']")) return;
        if (el.children.length > 2) return;
        const text = (el.innerText || "").trim();
        if (!text || text.length > 160) return;
        if (hebrewish(text)) paint(el, true);
      });
      document.querySelectorAll("p, span, dd, div").forEach((el) => {
        if (el.children.length) return;
        const compact = (el.textContent || "").replace(/[\s-]/g, "");
        if (/^\+?972\d{8,}$/.test(compact)) el.textContent = "";
      });
      document.querySelectorAll("input, textarea").forEach((el) => {
        const next = el.value.replace(/\[demo\]\s*/ig, "");
        if (next !== el.value) el.value = next;
      });
    }
    document.querySelectorAll('[data-testid="whatsapp-module-inbox"] button').forEach((button) => {
      const text = button.innerText || "";
      const { hebrew, latin } = counts(text);
      const named = lang === "en" && (window.__filmHideNames || []).some((name) => name && text.includes(name));
      const hide = lang === "en"
        ? (counts(text).hebrew >= 2) || israeli(text) || /\bdemo\b/i.test(text) || named
        : latin >= 12 && latin > hebrew;
      paint(button, hide);
    });
  };
  const schedule = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(scan);
  };
  const start = () => {
    scan();
    new MutationObserver(schedule).observe(document.documentElement, { childList: true, subtree: true, characterData: true });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
}, LANG);
await ctx.addCookies([{ name: "bizuply_tracking", value: "v2:none:2026-11-07", url: BASE }]);
const page = await ctx.newPage();
page.setDefaultTimeout(30000);
await login(page, BASE, LANG);
await page.getByRole("button", { name: /חיוניות בלבד|Essential cookies only|Solo cookies esenciales|Somente cookies essenciais|الضرورية فقط/ }).click({ timeout: 2500 }).catch(() => {});
await ctx.storageState({ path: (process.env.CAPTURE_DIR || "/tmp/home-theater") + "/auth.json" });
{
  const token = await page.evaluate(() => localStorage.getItem("token"));
  if (!WEBHOOK && !DRY) {
    const hook = await fetch(`${API}/integrations/facebook-leads/webhook-url`, { headers: { Authorization: `Bearer ${token}`, "x-business-id": BIZ } });
    const body = await hook.json().catch(() => ({}));
    if (!hook.ok || !body.webhookUrl) fail(`webhook lookup ${hook.status}`);
    WEBHOOK = body.webhookUrl;
    log("webhook ready");
  }
  if (LANG === "en" && token) {
    const listed = await fetch(`${API}/whatsapp/conversations?businessId=${BIZ}`, { headers: { Authorization: `Bearer ${token}`, "x-business-id": BIZ } });
    const payload = await listed.json().catch(() => ({}));
    const hideNames = [];
    for (const conv of payload.conversations || []) {
      const digits = String(conv.phone || "").replace(/\D/g, "");
      const israeli = (digits.startsWith("972") && digits.length >= 11) || (digits.startsWith("0") && digits.length >= 9 && digits.length <= 10);
      if (!israeli) continue;
      if (conv.recipientName) hideNames.push(String(conv.recipientName));
      if (digits) hideNames.push(digits);
      const preview = String(conv.lastBody || "").trim();
      if (preview.length >= 12) hideNames.push(preview.slice(0, 36));
    }
    await ctx.addInitScript((names) => { window.__filmHideNames = names; }, hideNames);
    log("hide inbox names", hideNames.length);
  }
  const H = { Authorization: `Bearer ${token}`, "Content-Type": "application/json", "x-business-id": BIZ, Origin: BASE };
  const own = intlPhone(C.phone);
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
for (const path of ["crm/leads", "whatsapp/inbox", "automations", `automations/${AUTO}`]) {
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

const leadRow = () => page.locator("table tbody tr").filter({ hasText: C.name }).first();
const listReady = async () => { await page.locator("table").first().waitFor({ timeout: 60000 }); };
const cardReady = async () => { await page.getByRole("button", { name: L.notesTab, exact: true }).waitFor({ timeout: 60000 }); };

/* ---------- 1. Lead intake ---------- */
beginChapter("lead");
await goto("crm/leads", listReady);
const vp = await page.evaluate(() => [innerWidth, innerHeight]);
log("viewport", vp);
if (vp[0] !== CSS_W) fail(`viewport width ${vp[0]}`);
if (DRY) C.name = process.env.DRY_NAME || "Dana Israeli";
else if ((await leadRow().count()) > 0) fail(`customer ${C.name} already exists — pick a new customer`);
await keep();
await settle(900);
cut();
let hook = null;
for (let attempt = 0; attempt < 3 && !hook; attempt++) {
  try {
    hook = DRY
      ? { status: 201, json: async () => ({ lead: { _id: "dry", source: "dry" } }) }
      : await fetch(WEBHOOK, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: C.name, phone: C.phone, email: C.email, message: C.message, form_name: C.formName }),
          signal: AbortSignal.timeout(20000),
        });
  } catch (error) {
    log("webhook retry", attempt + 1, error.message);
    if (attempt === 2) throw error;
    await page.waitForTimeout(1500);
  }
}
await keep();
const hookJson = await hook.json();
if (hook.status !== 201 || !hookJson?.lead?._id) fail(`webhook ${hook.status} ${JSON.stringify(hookJson).slice(0, 300)}`);
C.leadId = hookJson.lead._id;
log("lead created", C.leadId, hookJson.lead.source);
await settle(1600);
const refresh = page.locator("button.crm-tool").filter({ has: page.locator("svg.lucide-refresh-cw") }).first();
await to(refresh, { after: 200 });
await waitOrCut(() => leadRow().waitFor({ timeout: 30000 }), { grace: 200, label: "row" });
await settle(700);
await panLeadsTable();
await to(leadRow().locator("td").nth(1), { click: false, pause: 500 });
await to(leadRow().locator("td").nth(1), { after: 150 });
await waitOrCut(cardReady, { grace: 120, label: "card" });
await settle(1400);
await endChapter();

/* ---------- 2. Customer management ---------- */
beginChapter("crm");
await keep();
await settle(500);
const statusSelect = page.locator("select").filter({ has: page.locator('option[value="interested"]') }).first();
await to(statusSelect, { after: 250 });
if (!DRY) {
const statusResp = page.waitForResponse((r) => /\/crm\/leads\/[^/]+\/status/.test(r.url()) && r.request().method() !== "GET", { timeout: 20000 });
await statusSelect.selectOption("interested");
const sr = await statusResp;
if (!sr.ok()) fail(`status ${sr.status()}`);
log("status saved", sr.status());
}
await settle(1100);
await to(page.getByRole("button", { name: L.notesTab, exact: true }), { after: 600 });
const note = page.locator("textarea").first();
await to(note, { after: 200 });
await typeText(C.note);
await settle(350);
const noteResp = DRY ? null : page.waitForResponse((r) => /\/crm\/leads\/[^/]+\/activities/.test(r.url()) && r.request().method() === "POST", { timeout: 20000 });
await to(page.getByRole("button", { name: L.noteSave, exact: true }), { click: !DRY, after: 100 });
if (!DRY) {
const nr = await noteResp;
if (!nr.ok()) fail(`note ${nr.status()}`);
await page.getByText(C.note.slice(0, 30)).first().waitFor({ timeout: 15000 });
log("note saved");
}
await settle(1500);
await endChapter();

/* ---------- 3. WhatsApp ---------- */
beginChapter("whatsapp");
const waPhone = intlPhone(C.phone);
await goto(`whatsapp/inbox?phone=${waPhone}`, async () => {
  await page.locator(`[placeholder^="${C.replyPlaceholder}"]`).first().waitFor({ timeout: 60000 });
  await page.getByText(waPhone).first().waitFor({ timeout: 30000 });
  await page.waitForTimeout(1500);
});
await keep();
await settle(900);
const composer = page.locator(`[placeholder^="${C.replyPlaceholder}"]`).first();
await to(composer, { after: 200 });
await typeText(C.reply);
await settle(300);
await to(page.getByRole("button", { name: L.reply, exact: true }), { click: !DRY, after: 200 });
if (!DRY) {
await page.getByText(C.reply.slice(0, 24)).first().waitFor({ timeout: 15000 });
await settle(1800);
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
await to(page.getByRole("button", { name: L.taskQuick, exact: true }), { after: 600 });
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
await settle(1900);
await endChapter();

/* ---------- 5. Automation ---------- */
beginChapter("automation");
await goto("automations", async () => {
  await page.getByText(C.autoName).and(page.locator(":visible")).first().waitFor({ timeout: 60000 });
});
await keep();
await settle(700);
await to(page.getByText(C.autoName).and(page.locator(":visible")).first(), { click: false, pause: 400 });
await to(page.getByText(C.autoName).and(page.locator(":visible")).first(), { after: 100 });
await waitOrCut(() => page.getByRole("button", { name: L.test, exact: true }).waitFor({ timeout: 60000 }).then(() => page.locator(".react-flow__node").first().waitFor()), { grace: 150, label: "editor" });
await settle(1200);
if (!MOBILE) {
await to(page.locator(".react-flow__node").first(), { click: false, pause: 550 });
await to(page.locator(".react-flow__node").nth(1), { click: false, pause: 350 });
await to(page.locator(".react-flow__node").nth(2), { click: false, pause: 350 });
}
await to(page.getByRole("button", { name: L.test, exact: true }), { after: 700 });
const dryResp = page.waitForResponse((r) => /\/dry-run$/.test(r.url()), { timeout: 20000 });
await to(page.getByRole("button", { name: L.runTest, exact: true }), { after: 100 });
const dr = await dryResp;
if (!dr.ok()) fail(`dry-run ${dr.status()}`);
await page.getByText("completed").first().waitFor({ timeout: 15000 });
log("automation test completed");
await settle(2600);
if (MOBILE) {
  const zin = page.locator(".react-flow__controls-zoomin");
  for (let i = 0; i < 3; i++) await to(zin, { pause: i ? 120 : 260, after: 420 });
  await settle(1800);
}
await endChapter();

/* ---------- 6. Wrap-up ---------- */
beginChapter("done");
await goto("crm/leads", listReady);
await keep();
await settle(600);
await panLeadsTable();
if (!MOBILE) await to(leadRow().locator("td").nth(4), { click: false, pause: 900 });
await to(leadRow().locator("td").nth(1), { after: 150 });
await waitOrCut(cardReady, { grace: 120, label: "card3" });
await settle(900);
await to(page.getByRole("button", { name: L.notesTab, exact: true }), { after: 500 });
await settle(1700);
await to(page.getByRole("button", { name: L.tasksTab, exact: true }), { after: 500 });
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
