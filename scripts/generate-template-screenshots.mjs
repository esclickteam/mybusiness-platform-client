/**
 * Capture full-page desktop screenshots of every studio template homepage
 * via /embed/template/:key and write optimized WebP cards + a manifest.
 *
 * Usage:
 *   node scripts/generate-template-screenshots.mjs
 *   node scripts/generate-template-screenshots.mjs --base=http://127.0.0.1:4173
 *   node scripts/generate-template-screenshots.mjs --only=velmora,adion
 *   node scripts/generate-template-screenshots.mjs --limit=10
 *   node scripts/generate-template-screenshots.mjs --concurrency=2
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = path.join(ROOT, "public", "template-screenshots");
const MANIFEST_PATH = path.join(
  ROOT,
  "src",
  "data",
  "templateScreenshotManifest.json",
);
const REGISTRY_PATH = path.join(
  ROOT,
  "src",
  "components",
  "site-builder",
  "studio",
  "data",
  "templates",
  "templateRendererRegistry.ts",
);

const DESIGN_WIDTH = 1440;
const VIEWPORT_HEIGHT = 1100;
const DEFAULT_BASE = process.env.TEMPLATE_SHOT_BASE || "http://127.0.0.1:4173";

function parseArgs(argv) {
  const opts = {
    base: DEFAULT_BASE,
    only: [],
    limit: 0,
    concurrency: 2,
    force: false,
  };

  for (const arg of argv) {
    if (arg.startsWith("--base=")) opts.base = arg.slice("--base=".length);
    else if (arg.startsWith("--only=")) {
      opts.only = arg
        .slice("--only=".length)
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg.startsWith("--limit=")) {
      opts.limit = Number(arg.slice("--limit=".length)) || 0;
    } else if (arg.startsWith("--concurrency=")) {
      opts.concurrency = Math.max(
        1,
        Number(arg.slice("--concurrency=".length)) || 1,
      );
    } else if (arg === "--force") opts.force = true;
  }

  return opts;
}

function listTemplateKeys() {
  const source = fs.readFileSync(REGISTRY_PATH, "utf8");
  const keys = new Set();
  const re = /^\s*key:\s*["']([a-z0-9-]+)["']\s*,?\s*$/gim;
  let match;
  while ((match = re.exec(source))) {
    keys.add(match[1].toLowerCase());
  }
  return [...keys].sort();
}

function readManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    return {};
  }
}

function writeManifest(manifest) {
  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b)),
  );
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(sorted, null, 2)}\n`, "utf8");
}

async function loadSharp() {
  try {
    const mod = await import("sharp");
    return mod.default || mod;
  } catch {
    return null;
  }
}

async function captureOne(browser, key, opts, sharp) {
  const outWebp = path.join(OUT_DIR, `${key}.webp`);
  const publicUrl = `/template-screenshots/${key}.webp`;

  if (!opts.force && fs.existsSync(outWebp)) {
    return { key, url: publicUrl, skipped: true };
  }

  const context = await browser.newContext({
    viewport: { width: DESIGN_WIDTH, height: VIEWPORT_HEIGHT },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    const url = `${opts.base.replace(/\/$/, "")}/embed/template/${encodeURIComponent(key)}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 90_000 });
    await page.waitForTimeout(700);

    // Ensure reveal/animation states are open even if CSS races.
    await page.addStyleTag({
      content: `
        [data-reveal], [data-animate], [data-motion], .bizuply-reveal-up,
        [class*="opacity-0"] {
          opacity: 1 !important;
          visibility: visible !important;
          transform: none !important;
          filter: none !important;
        }
        *, *::before, *::after {
          animation: none !important;
          transition: none !important;
        }
      `,
    });

    await page.waitForTimeout(250);

    const png = await page.screenshot({
      fullPage: true,
      type: "png",
      animations: "disabled",
    });

    fs.mkdirSync(OUT_DIR, { recursive: true });

    if (sharp) {
      await sharp(png)
        .resize({
          width: 960,
          withoutEnlargement: true,
        })
        .webp({ quality: 72, effort: 4 })
        .toFile(outWebp);
    } else {
      // Fallback JPEG if sharp is unavailable.
      const outJpeg = path.join(OUT_DIR, `${key}.jpg`);
      const jpeg = await page.screenshot({
        fullPage: true,
        type: "jpeg",
        quality: 72,
        animations: "disabled",
      });
      fs.writeFileSync(outJpeg, jpeg);
      return {
        key,
        url: `/template-screenshots/${key}.jpg`,
        skipped: false,
        warning: "sharp missing — saved jpeg",
      };
    }

    return { key, url: publicUrl, skipped: false };
  } finally {
    await context.close();
  }
}

async function runPool(items, concurrency, worker) {
  const results = [];
  let index = 0;

  async function next() {
    while (index < items.length) {
      const current = items[index++];
      results.push(await worker(current));
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => next()),
  );
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let keys = listTemplateKeys();

  if (opts.only.length) {
    keys = keys.filter((key) => opts.only.includes(key));
  }
  if (opts.limit > 0) {
    keys = keys.slice(0, opts.limit);
  }

  if (!keys.length) {
    console.error("No template keys found to capture.");
    process.exit(1);
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const sharp = await loadSharp();
  if (!sharp) {
    console.warn(
      "⚠ sharp not installed — screenshots will be saved as JPEG. Run: npm i -D sharp",
    );
  }

  console.log(`Capturing ${keys.length} template screenshot(s)`);
  console.log(`Base URL: ${opts.base}`);
  console.log(`Output:   ${OUT_DIR}`);

  const browser = await chromium.launch({ headless: true });
  const manifest = readManifest();

  try {
    const results = await runPool(keys, opts.concurrency, async (key) => {
      process.stdout.write(`→ ${key} ... `);
      try {
        const result = await captureOne(browser, key, opts, sharp);
        manifest[key] = result.url;
        console.log(result.skipped ? "skip" : "ok");
        return result;
      } catch (error) {
        console.log("FAIL");
        console.error(`  ${key}:`, error?.message || error);
        return { key, error: String(error?.message || error) };
      }
    });

    writeManifest(manifest);

    const ok = results.filter((r) => r.url && !r.error).length;
    const failed = results.filter((r) => r.error).length;
    console.log(`\nDone. ok=${ok} failed=${failed}`);
    console.log(`Manifest: ${MANIFEST_PATH}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
