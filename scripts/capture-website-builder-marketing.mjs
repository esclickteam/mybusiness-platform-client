import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "public", "marketing", "website-builder");
const base = (process.argv.find((item) => item.startsWith("--base=")) || "--base=http://127.0.0.1:3001").slice("--base=".length);

const SHOTS = [
  { file: "hero-elevora-desktop.webp", key: "elevora", width: 1440, height: 900 },
  { file: "hero-elevora-mobile.webp", key: "elevora", width: 390, height: 844 },
  { file: "type-lexora.webp", key: "lexora", width: 1280, height: 800 },
  { file: "type-jewelis.webp", key: "jewelis", width: 1440, height: 900 },
  { file: "type-vitalcare.webp", key: "vitalcare", width: 1280, height: 800 },
  { file: "gallery-silkbar.webp", key: "silkbar", width: 1440, height: 900, cropHeight: 640 },
  { file: "gallery-aurelia.webp", key: "aurelia", width: 1440, height: 860 },
  { file: "gallery-villaire.webp", key: "villaire", width: 1440, height: 900 },
  { file: "gallery-justora.webp", key: "justora", width: 1440, height: 860 },
  { file: "gallery-serenova.webp", key: "serenova", width: 1440, height: 860 },
  { file: "gallery-sportifya.webp", key: "sportifya", width: 1440, height: 900, cropHeight: 520 },
  { file: "screens-spalcio-desktop.webp", key: "spalcio", width: 1366, height: 760, cropHeight: 640 },
  { file: "screens-spalcio-tablet.webp", key: "spalcio", width: 1024, height: 768 },
  { file: "editor-advisora.webp", key: "advisora", width: 1440, height: 900 },
];

async function save(name, png, cropHeight, width) {
  fs.mkdirSync(OUT, { recursive: true });
  let image = sharp(png);
  if (cropHeight) image = image.extract({ left: 0, top: 0, width, height: cropHeight });
  const dest = path.join(OUT, name);
  await image.webp({ quality: 82 }).toFile(dest);
  return fs.statSync(dest).size;
}

const browser = await chromium.launch({ headless: true });
const results = [];
try {
  for (const shot of SHOTS) {
    const context = await browser.newContext({ viewport: { width: shot.width, height: shot.height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
    const page = await context.newPage();
    try {
      await page.goto(`${base}/embed/template/${shot.key}?mode=preview&lang=en`, { waitUntil: "commit", timeout: 90000 });
      await page.waitForSelector("[data-template-id]", { timeout: 30000 });
      await page.waitForTimeout(1400);
      const png = await page.screenshot({ type: "png" });
      results.push({ file: shot.file, bytes: await save(shot.file, png, shot.cropHeight, shot.width) });
    } catch (error) {
      results.push({ file: shot.file, error: String(error?.message || error) });
    } finally {
      await context.close();
    }
    process.stdout.write(`${shot.file}\n`);
  }
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  try {
    await page.goto(`${base}/embed/template/spalcio?mode=preview&lang=en`, { waitUntil: "commit", timeout: 90000 });
    await page.waitForSelector("[data-template-id]", { timeout: 30000 });
    await page.waitForTimeout(1200);
    const top = await page.evaluate(() => {
      const hit = [...document.querySelectorAll("input")].find((node) => (node.getAttribute("placeholder") || "").includes("First name"));
      return hit ? hit.getBoundingClientRect().top + window.scrollY : 0;
    });
    await page.evaluate((y) => window.scrollTo(0, Math.max(0, y - 36)), top);
    await page.waitForTimeout(300);
    const png = await page.screenshot({ type: "png" });
    results.push({ file: "screens-spalcio-mobile.webp", bytes: await save("screens-spalcio-mobile.webp", png) });
  } catch (error) {
    results.push({ file: "screens-spalcio-mobile.webp", error: String(error?.message || error) });
  } finally {
    await context.close();
  }
} finally {
  await browser.close();
}
process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
