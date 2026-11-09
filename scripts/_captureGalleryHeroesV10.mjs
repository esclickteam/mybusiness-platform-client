/**
 * Capture Website Studio gallery heroes from live template previews (2x),
 * without editor chrome. Writes desktop 1920×1200 and mobile 780×1600 JPEGs.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const BASE = "https://mybusiness-platform-client-staging.vercel.app";
const BIZ = "6ab62f565ba1a92f3046b5ad";
const AUTH = "/tmp/bizuply-demo-auth.json";
const OUT = path.resolve("public/demo-media/home/gallery-heroes");
const TMP = "/tmp/v10/gallery-live";

fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(TMP, { recursive: true });

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let err = "";
    child.stderr.on("data", (d) => {
      err += d.toString();
    });
    child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-800)))));
  });
}

const samples = ["studiora", "vitalcare", "serenova", "soleora", "glowhaus", "talentix"];
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  storageState: AUTH,
  locale: "he-IL",
});
const page = await context.newPage();

for (const key of samples) {
  const url = `${BASE}/business/${BIZ}/dashboard/website/templates/${key}/preview`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 90000 });
  await page.waitForTimeout(2200);
  await page.evaluate(() => {
    const kill = (el) => {
      if (!el) return;
      el.style.setProperty("display", "none", "important");
    };
    document
      .querySelectorAll(
        "header, [class*='PreviewToolbar'], [class*='preview-toolbar'], [class*='toolbar'], [class*='FloatingAssistant'], [class*='assistant-fab']",
      )
      .forEach(kill);
    [...document.querySelectorAll("button, a")].forEach((el) => {
      const t = (el.textContent || "").trim();
      if (/עריכה|שימוש בתבנית|חזרה|Edit|Use template|Back/i.test(t)) {
        const bar = el.closest("div,header,nav,section");
        if (bar && bar.getBoundingClientRect().top < 140) kill(bar);
      }
    });
  });
  await page.waitForTimeout(400);

  const raw = path.join(TMP, `${key}.png`);
  if (await page.locator("iframe").count()) {
    await page.locator("iframe").first().screenshot({ path: raw });
  } else {
    await page.screenshot({ path: raw, clip: { x: 0, y: 72, width: 1440, height: 828 } });
  }
  console.log(key, "raw", fs.statSync(raw).size);

  const desk = path.join(OUT, `${key}-desktop.jpg`);
  const mob = path.join(OUT, `${key}-mobile.jpg`);
  await run("ffmpeg", [
    "-y", "-i", raw,
    "-vf", "crop=iw:min(ih\\,trunc(iw*10/16)):0:0,scale='min(1920,iw)':-2:flags=lanczos",
    "-q:v", "2", desk,
  ]);
  await run("ffmpeg", [
    "-y", "-i", raw,
    "-vf",
    "crop=min(iw\\,trunc(ih*9/19)):min(ih\\,trunc(iw*19/9)):(iw-ow)/2:0,scale=780:1600:force_original_aspect_ratio=decrease:flags=lanczos,pad=780:1600:(ow-iw)/2:0:#0b0420",
    "-q:v", "2", mob,
  ]);
  console.log(key, "ok");
}

await browser.close();
console.log("gallery heroes complete");
