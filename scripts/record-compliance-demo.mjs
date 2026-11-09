import { chromium } from "playwright";
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
      style.textContent = "#rec-cursor{position:fixed;z-index:2147483646;pointer-events:none;width:28px;height:28px;margin:-6px 0 0 -6px;border:3px solid #5b2cff;border-radius:50%;background:rgba(91,44,255,.28);box-shadow:0 0 0 6px rgba(91,44,255,.12)}#rec-cursor.finger{width:42px;height:46px;margin:-8px 0 0 -14px;border-radius:46% 46% 46% 16%;background:rgba(255,255,255,.78)}#rec-cursor.click{transform:scale(.82)}";
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
  await locator.click({ delay: 140 });
  await page.waitForTimeout(320);
}

async function shoot(page, name, locator) {
  await page.evaluate(() => document.getElementById("rec-cursor")?.style.setProperty("display", "none"));
  const target = locator || page.locator("main");
  await target.screenshot({ path: path.join(out, name), type: "png" });
  await page.evaluate(() => document.getElementById("rec-cursor")?.style.removeProperty("display"));
}

async function record(kind) {
  const browser = await chromium.launch({ headless: true });
  const mobile = kind === "finger";
  const context = await browser.newContext({
    viewport: mobile ? { width: 390, height: 844 } : { width: 1920, height: 1080 },
    deviceScaleFactor: mobile ? 3 : 1,
    recordVideo: { dir: out, size: mobile ? { width: 1080, height: 2338 } : { width: 1920, height: 1080 } },
    locale: "he-IL",
    hasTouch: mobile,
  });
  await context.addInitScript(cursorSource(mobile ? "finger" : ""));
  await context.addCookies([{ name: "bizuply_tracking", value: "v2:none:2026-11-07", url: base }]);
  const page = await context.newPage();
  await page.route("**/compliance/api/**", (route) => route.abort());
  await page.route("https://example.com/**", (route) => route.abort());
  await page.route("https://developer.mozilla.org/**", (route) => route.abort());
  const started = Date.now();
  const mark = (name) => marks.push(`${kind} ${name} ${((Date.now() - started) / 1000).toFixed(1)}`);
  const video = page.video();
  let failed = false;
  try {
    await run(page, kind, mark);
  } catch (error) {
    failed = true;
    console.error("url", page.url());
    await page.screenshot({ path: path.join(out, `fail-${kind || "desk"}.png`), fullPage: false }).catch(() => {});
    console.error(error);
  } finally {
    await context.close().catch(() => {});
    await browser.close().catch(() => {});
  }
  const saved = await video.path();
  const target = path.join(out, failed ? `partial-${kind || "desk"}.webm` : (kind === "finger" ? "mobile.webm" : "desktop.webm"));
  await unlink(target).catch(() => {});
  await rename(saved, target);
  if (failed) throw new Error(`recording failed: ${target}`);
  return target;
}

async function run(page, kind, mark) {
  await page.goto(`${base}/compliance/demo`, { waitUntil: "networkidle" });
  await page.locator("[data-demo=name]").scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  mark("form");
  if (kind === "") await page.screenshot({ path: path.join(out, "poster.jpg"), type: "jpeg", quality: 82 });
  await press(page, page.locator("[data-demo=name]"));
  await page.keyboard.type("ישראל ישראלי", { delay: 70 });
  await page.waitForTimeout(350);
  await press(page, page.locator("[data-demo=url]"));
  await page.keyboard.press("Control+A");
  await page.keyboard.type("example.com", { delay: 60 });
  await page.waitForTimeout(450);
  if (kind === "") await shoot(page, "scan.png", page.locator("form"));
  mark("typed");
  await press(page, page.locator("[data-demo=start]"));
  mark("started");
  await page.locator("[data-demo=live]").waitFor();
  const cats = page.locator(".scan-live__cats li");
  for (let index = 0; index < 4; index += 1) {
    await point(page, cats.nth(index));
    await page.waitForTimeout(900);
  }
  await page.locator("[data-demo=results]").waitFor({ timeout: 20000 });
  await page.waitForTimeout(900);
  mark("results");
  await press(page, page.locator("[data-demo=results]"));
  await page.locator("[data-demo=full]").waitFor();
  await page.waitForTimeout(1600);
  if (kind === "") await shoot(page, "free.png", page.locator(".scan-report"));
  await page.mouse.wheel(0, 280);
  await page.waitForTimeout(1400);
  mark("free");
  await press(page, page.locator("[data-demo=full]"));
  await page.locator("[data-demo=report]").waitFor();
  await page.waitForTimeout(800);
  await press(page, page.locator("a[href='#report-security']"));
  const finding = page.locator(".report-finding", { hasText: "Content-Security-Policy" }).first();
  await finding.scrollIntoViewIfNeeded();
  await page.evaluate(() => {
    const card = [...document.querySelectorAll(".report-finding")].find((node) => node.textContent.includes("Content-Security-Policy"));
    if (card) card.style.outline = "3px solid #5b2cff";
  });
  await page.waitForTimeout(500);
  await press(page, finding.locator("h3"));
  await page.waitForTimeout(1600);
  if (kind === "") await page.screenshot({ path: path.join(out, "report.png"), type: "png" });
  await press(page, page.locator("a[href='#report-privacy']"));
  await page.waitForTimeout(1400);
  await press(page, page.locator("a[href='#report-docs']"));
  await page.waitForTimeout(1400);
  await press(page, page.locator("a[href='#report-plan']"));
  await page.waitForTimeout(1200);
  mark("report");
  const pdfButton = page.locator("[data-action=pdf]");
  await press(page, pdfButton);
  if (!(await page.locator("[data-demo=pdf-preview]").isVisible().catch(() => false))) {
    await pdfButton.evaluate((node) => node.click());
  }
  await page.locator("[data-demo=pdf-preview]").waitFor();
  await page.waitForTimeout(2200);
  if (kind === "") await shoot(page, "pdf.png", page.locator("[data-demo=pdf-preview] article"));
  mark("pdf");
  await press(page, page.locator("[data-demo=plans]"));
  const plans = page.locator(".scan-plans, .plan-cards, .scan-price").first();
  if (await plans.count()) await plans.scrollIntoViewIfNeeded();
  await page.waitForTimeout(2800);
  mark("plans");
}

await mkdir(out, { recursive: true });
try {
  await record("");
  await record("finger");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}
await writeFile(path.join(out, "timing.txt"), marks.join("\n"), "utf8");
console.log(marks.join("\n"));
