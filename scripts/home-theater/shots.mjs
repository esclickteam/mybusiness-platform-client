/**
 * Crisp product screenshots from the staging demo workspace.
 *   LANG_UI=he|en MOBILE=0|1 ONLY=crm-list,ai node shots.mjs
 */
import { chromium } from "playwright";
import fs from "node:fs";
import { login } from "./recorder.mjs";

const LANG = process.env.LANG_UI || "he";
const MOBILE = process.env.MOBILE === "1";
const ONLY = (process.env.ONLY || "").split(",").filter(Boolean);
const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const OUT = `${process.env.CAPTURE_DIR || "/tmp/home-theater"}/screens`;
fs.mkdirSync(OUT, { recursive: true });
const TAG = `${LANG}-${MOBILE ? "mobile" : "desktop"}`;
const C = {
  he: { name: "שירה מזרחי", phone: "972525551917", auto: "6af1e65d76c39b752eefa9e4", notes: "הערות ופעילות", test: "בדיקה", run: "הרצת בדיקה", ask: "מה כדאי לי לעשות היום", reply: "תשובה", replyPh: "כתבו תשובה" },
  en: { name: "Emma Collins", phone: "972525551871", auto: "6af1ed4e76c39b752eefb2b2", notes: "Notes and activity", test: "Test", run: "Run a test", ask: "What should I do today", reply: "Reply", replyPh: "Type a reply",
    replyText: "Hi Emma, thanks for reaching out! I'll send over the family session package. Does Thursday at 10:30 work for a quick call?" },
}[LANG];

const browser = await chromium.launch({ executablePath: "/usr/local/bin/google-chrome", headless: true, args: [`--lang=${LANG === "he" ? "he-IL" : "en-US"}`] });
const ctx = await browser.newContext({
  viewport: MOBILE ? { width: 390, height: 844 } : { width: 1440, height: 900 },
  deviceScaleFactor: MOBILE ? 3 : 2,
  isMobile: MOBILE,
  hasTouch: MOBILE,
  locale: LANG === "he" ? "he-IL" : "en-US",
  timezoneId: "Asia/Jerusalem",
});
await ctx.addInitScript((lang) => {
  for (const k of ["i18nextLng", "bizuply.lang", "bizuply_lang_preference", "bizuply_lang_resolved"]) localStorage.setItem(k, lang);
}, LANG);
const page = await ctx.newPage();
page.setDefaultTimeout(45000);
await login(page, BASE, LANG);
const dash = (p) => `${BASE}${LANG === "he" ? "/he" : ""}/business/${BIZ}/dashboard/${p}`;
async function open(p, ready) {
  await page.goto(dash(p), { waitUntil: "domcontentloaded", timeout: 90000 });
  await ready();
  await page.mouse.move(-10, -10);
  await page.waitForTimeout(1500);
}
async function shot(name) {
  const file = `${OUT}/${TAG}-${name}.png`;
  await page.screenshot({ path: file });
  console.log("saved", file);
}
const want = (n) => !ONLY.length || ONLY.includes(n);
const row = () => page.locator("table tbody tr").filter({ hasText: C.name }).first();

if (want("crm-list")) {
  await open("crm/leads", () => row().waitFor());
  await shot("crm-list");
}
if (want("crm-card")) {
  await open("crm/leads", () => row().waitFor());
  await row().locator("td").nth(1).click();
  await page.getByRole("button", { name: C.notes, exact: true }).waitFor();
  await page.getByRole("button", { name: C.notes, exact: true }).evaluate((el) => el.scrollIntoView({ block: "nearest", inline: "center" }));
  await page.getByRole("button", { name: C.notes, exact: true }).click();
  await page.waitForTimeout(2200);
  await page.mouse.move(-10, -10);
  await shot("crm-card");
}
if (want("whatsapp")) {
  await open(`whatsapp/inbox?phone=${C.phone}`, () => page.locator(`[placeholder^="${C.replyPh}"]`).first().waitFor());
  await page.waitForTimeout(2500);
  if (C.replyText && !(await page.getByText(C.replyText.slice(0, 20)).count())) {
    await page.locator(`[placeholder^="${C.replyPh}"]`).first().fill(C.replyText);
    await page.getByRole("button", { name: C.reply, exact: true }).click();
    await page.getByText(C.replyText.slice(0, 20)).first().waitFor();
    await page.waitForTimeout(1500);
  }
  if (MOBILE) {
    await page.locator(`[placeholder^="${C.replyPh}"]`).first().evaluate((el) => el.scrollIntoView({ block: "end" }));
    await page.waitForTimeout(800);
  }
  await page.mouse.move(-10, -10);
  await shot("whatsapp");
}
if (want("automation")) {
  await open(`automations/${C.auto}`, () => page.locator(".react-flow__node").first().waitFor());
  await page.getByRole("button", { name: C.test, exact: true }).click();
  await page.getByRole("button", { name: C.run, exact: true }).click();
  await page.getByText("completed").first().waitFor();
  await page.waitForTimeout(1200);
  if (MOBILE) {
    for (let i = 0; i < 3; i++) { await page.locator(".react-flow__controls-zoomin").click(); await page.waitForTimeout(350); }
    await page.waitForTimeout(800);
  }
  await page.mouse.move(-10, -10);
  await shot("automation");
}
if (want("campaigns")) {
  await open("meta-campaigns", async () => { await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {}); });
  await page.waitForTimeout(3500);
  await shot("campaigns");
}
if (want("ai")) {
  await open("BizUply", async () => { await page.getByText(C.ask).first().waitFor(); });
  const before = await page.locator("body").innerText();
  await page.getByText(C.ask).first().click();
  const start = Date.now();
  let settled = 0, last = "";
  while (Date.now() - start < 90000) {
    await page.waitForTimeout(1500);
    const now = await page.locator("body").innerText();
    if (now.length > before.length + 200 && now === last) { if (++settled >= 2) break; } else settled = 0;
    last = now;
  }
  console.log("ai answer grew by", last.length - before.length);
  if (MOBILE) {
    await page.getByText(LANG === "he" ? "צ׳אט עם היועץ העסקי" : /Chat with (the )?Business Advisor/i).first().evaluate((el) => { el.scrollIntoView({ block: "start" }); window.scrollBy(0, -72); }).catch((e) => console.log("chat head", e.message.slice(0, 80)));
    await page.waitForTimeout(600);
  }
  await page.mouse.move(-10, -10);
  await shot("ai");
}
if (want("dashboard")) {
  await open("dashboard", async () => { await page.waitForLoadState("networkidle", { timeout: 30000 }).catch(() => {}); });
  await page.waitForTimeout(3000);
  await shot("dashboard");
}
await browser.close();
