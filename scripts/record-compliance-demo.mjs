import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { mkdir, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const base = process.env.DEMO_URL || "http://127.0.0.1:4178";
const out = path.resolve("public/media/compliance-demo");
const marks = [];

function cursorSource(kind) {
  return `(() => {
    const boot = () => {
      if (document.getElementById("rec-cursor")) return;
      const style = document.createElement("style");
      style.textContent = "#rec-cursor{position:fixed;z-index:2147483646;pointer-events:none;width:28px;height:28px;margin:-6px 0 0 -6px;border:3px solid #5b2cff;border-radius:50%;background:rgba(91,44,255,.28);box-shadow:0 0 0 6px rgba(91,44,255,.12)}#rec-cursor.click{transform:scale(.82)}.bizuply-a11y-trigger,[data-bizuply-accessibility-widget],.bizuply-a11y-root,.bizuply-chat-launcher{display:none!important}";
      document.head.appendChild(style);
      const el = document.createElement("div");
      el.id = "rec-cursor";
      el.className = ${JSON.stringify(kind)};
      document.body.appendChild(el);
      const place = (x, y) => { el.style.left = x + "px"; el.style.top = y + "px"; };
      window.addEventListener("mousemove", (event) => place(event.clientX, event.clientY), true);
      window.addEventListener("mousedown", () => el.classList.add("click"), true);
      window.addEventListener("mouseup", () => el.classList.remove("click"), true);
    };
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
    else boot();
  })();`;
}

async function point(page, locator) {
  const box = await locator.boundingBox();
  if (!box) throw new Error(`no box for ${locator}`);
  const x = Math.round(box.x + Math.min(box.width / 2, 180));
  const y = Math.round(box.y + box.height / 2);
  await page.mouse.move(x, y, { steps: 28 });
  await page.waitForTimeout(280);
  return { x, y };
}

async function press(page, locator) {
  await locator.evaluate((node) => node.scrollIntoView({ block: "center", inline: "nearest" }));
  await page.waitForTimeout(180);
  await point(page, locator);
  await locator.click({ delay: 140, noWaitAfter: true });
  await page.waitForTimeout(320);
}

async function shoot(page, name, locator) {
  await page.evaluate(() => document.getElementById("rec-cursor")?.style.setProperty("display", "none"));
  const target = locator || page.locator("main");
  await target.screenshot({ path: path.join(out, name), type: "png" });
  await page.evaluate(() => document.getElementById("rec-cursor")?.style.removeProperty("display"));
}

const NAMES = { he: "ישראל ישראלי", en: "Alex Morgan", es: "Ana Garcia", pt: "Ana Souza", ar: "ليلى أحمد" };
const LOCALES = { he: "he-IL", en: "en-US", es: "es-ES", pt: "pt-BR", ar: "ar" };
const LANG = { he: "he", en: "en", es: "es", pt: "pt-BR", ar: "ar" };
const PATHS = { he: "/he/compliance/demo", en: "/compliance/demo", es: "/es/compliance/demo", pt: "/pt-br/compliance/demo", ar: "/ar/compliance/demo" };

function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffmpeg", args, { stdio: "inherit" });
    child.on("exit", (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}`))));
  });
}

function cue(seconds) {
  const total = Math.max(0, Math.round(Number(seconds) * 1000));
  const hours = String(Math.floor(total / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((total % 3600000) / 60000)).padStart(2, "0");
  const secs = String(Math.floor((total % 60000) / 1000)).padStart(2, "0");
  const ms = String(total % 1000).padStart(3, "0");
  return `${hours}:${minutes}:${secs}.${ms}`;
}

async function record(code) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 1,
    recordVideo: { dir: out, size: { width: 1280, height: 720 } },
    locale: LOCALES[code],
  });
  await context.addInitScript(cursorSource(""));
  await context.addCookies([{ name: "bizuply_tracking", value: "v2:none:2026-11-07", url: base }]);
  const page = await context.newPage();
  await page.route("**/compliance/api/**", (route) => route.abort());
  await page.route("https://example.com/**", (route) => route.abort());
  await page.route("https://developer.mozilla.org/**", (route) => route.abort());
  const started = Date.now();
  const localMarks = [];
  const mark = (name) => {
    const at = ((Date.now() - started) / 1000).toFixed(1);
    localMarks.push([name, at]);
    marks.push(`${code} ${name} ${at}`);
  };
  const video = page.video();
  let failed = false;
  try {
    await run(page, code, mark);
  } catch (error) {
    failed = true;
    console.error("url", page.url());
    await page.screenshot({ path: path.join(out, `fail-${code}.png`), fullPage: false }).catch(() => {});
    console.error(error);
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
  const saved = await video.path();
  const target = path.join(out, failed ? `partial-${code}.webm` : `${code}.webm`);
  await unlink(target).catch(() => {});
  await rename(saved, target);
  if (failed) throw new Error(`recording failed: ${target}`);
  const mp4 = path.join(out, `${code}.mp4`);
  const formAt = Number((localMarks.find((item) => item[0] === "form") || [0, "0.4"])[1]);
  await ffmpeg(["-y", "-ss", String(formAt), "-i", target, "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-crf", "20", "-movflags", "+faststart", mp4]);
  await writeFile(path.join(out, `captions-${code}.vtt`), captions(code, localMarks), "utf8");
  await unlink(target).catch(() => {});
  return mp4;
}

const LINES = {
  he: ["מזינים שם וכתובת אתר", "הבדיקות מתקדמות: פרטיות, אבטחה, נגישות ומסמכים", "דוח ראשוני לדוגמה", "דוח מלא לדוגמה", "ממצא עם ראיה והמלצה", "תצוגת PDF לדוגמה"],
  en: ["Enter a name and a website address", "Checks move through privacy, security, accessibility and documents", "Sample first report", "Sample full report", "A finding with evidence and a recommendation", "Sample PDF preview"],
  es: ["Se escriben un nombre y una dirección", "Las pruebas avanzan: privacidad, seguridad, accesibilidad y documentos", "Informe inicial de ejemplo", "Informe completo de ejemplo", "Un hallazgo con prueba y recomendación", "Vista previa del PDF de ejemplo"],
  pt: ["Informar um nome e um endereço", "Os testes avançam: privacidade, segurança, acessibilidade e documentos", "Relatório inicial de exemplo", "Relatório completo de exemplo", "Um achado com evidência e recomendação", "Prévia do PDF de exemplo"],
  ar: ["إدخال اسم وعنوان موقع", "تتقدم الفحوص: الخصوصية والأمن والإتاحة والمستندات", "تقرير أولي للعرض", "تقرير كامل للعرض", "نتيجة مع دليل وتوصية", "معاينة PDF للعرض"],
};

function captions(code, localMarks) {
  const text = LINES[code];
  const at = Object.fromEntries(localMarks);
  const origin = Number(at.form || 0);
  const points = ["form", "started", "results", "free", "report", "pdf", "end"].map((name) => Math.max(0, Number(at[name] || origin) - origin));
  const rows = text.map((line, index) => `${cue(points[index])} --> ${cue(points[index + 1] || points[index] + 2)}\n${line}`);
  return `WEBVTT\n\n${rows.join("\n\n")}\n`;
}

async function run(page, code, mark) {
  await page.goto(`${base}${PATHS[code]}?film=1&lang=${encodeURIComponent(LANG[code])}`, { waitUntil: "domcontentloaded" });
  await page.locator("[data-demo=name]").waitFor();
  await page.locator("[data-demo=name]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  mark("form");
  await page.screenshot({ path: path.join(out, `poster-${code}.jpg`), type: "jpeg", quality: 82 });
  await press(page, page.locator("[data-demo=name]"));
  await page.keyboard.type(NAMES[code], { delay: 70 });
  await page.waitForTimeout(280);
  await press(page, page.locator("[data-demo=url]"));
  await page.keyboard.press("Control+A");
  await page.keyboard.type("example.com", { delay: 55 });
  await page.waitForTimeout(360);
  await shoot(page, `scan-${code}.png`, page.locator("form"));
  mark("typed");
  await press(page, page.locator("[data-demo=start]"));
  mark("started");
  await page.locator("[data-demo=live]").waitFor();
  const cats = page.locator(".scan-live__cats li");
  for (let index = 0; index < 4; index += 1) {
    await point(page, cats.nth(index));
    await page.waitForTimeout(700);
  }
  await page.locator("[data-demo=results]").waitFor({ timeout: 20000 });
  await page.waitForTimeout(500);
  mark("results");
  await press(page, page.locator("[data-demo=results]"));
  await page.locator("[data-demo=full]").waitFor();
  await page.waitForTimeout(900);
  await shoot(page, `free-${code}.png`, page.locator(".scan-report"));
  mark("free");
  await press(page, page.locator("[data-demo=full]"));
  await page.locator("[data-demo=report]").waitFor();
  await page.waitForTimeout(500);
  const finding = page.locator(".report-finding", { hasText: "Content-Security-Policy" }).first();
  await finding.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  await press(page, finding.locator("h3"));
  await page.waitForTimeout(1100);
  await page.screenshot({ path: path.join(out, `report-${code}.png`), type: "png" });
  mark("report");
  const pdfButton = page.locator("[data-action=pdf]");
  await press(page, pdfButton);
  if (!(await page.locator("[data-demo=pdf-preview]").isVisible().catch(() => false))) {
    await pdfButton.evaluate((node) => node.click());
  }
  await page.locator("[data-demo=pdf-preview]").waitFor();
  await page.waitForTimeout(1600);
  await shoot(page, `pdf-${code}.png`, page.locator("[data-demo=pdf-preview] article"));
  mark("pdf");
  await page.waitForTimeout(700);
  mark("end");
}

await mkdir(out, { recursive: true });
const codes = (process.env.DEMO_LANGS || "he,en,es,pt,ar").split(",").map((item) => item.trim()).filter(Boolean);
try {
  for (const code of codes) await record(code);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
await writeFile(path.join(out, "timing.txt"), marks.join("\n"), "utf8");
console.log(marks.join("\n"));
