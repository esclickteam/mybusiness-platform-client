/**
 * Template parity audit + visual regression across all registered templates.
 *
 * Surfaces:
 *  - catalog/public embed preview: /embed/template/:key
 *  - editor-equivalent render:     /embed/template/:key?mode=edit
 *
 * Viewports: desktop (1440), tablet (834), mobile (390)
 *
 * Usage:
 *   npm run build && npm run preview
 *   node scripts/template-parity-visual.mjs --base=http://127.0.0.1:4173
 *   node scripts/template-parity-visual.mjs --only=serenova,adion --limit=5
 *   node scripts/template-parity-visual.mjs --skip-screenshots   # structural only
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const REGISTRY_PATH = path.join(
  ROOT,
  "src/components/site-builder/studio/data/templates/templateRendererRegistry.ts",
);
const OUT_DIR = path.join(ROOT, "tmp/template-parity");
const DEFAULT_BASE = process.env.TEMPLATE_PARITY_BASE || "http://127.0.0.1:4173";

const VIEWPORTS = {
  desktop: { width: 1440, height: 1100 },
  tablet: { width: 834, height: 1100 },
  mobile: { width: 390, height: 844 },
};

function parseArgs(argv) {
  const opts = {
    base: DEFAULT_BASE,
    only: [],
    limit: 0,
    concurrency: 2,
    skipScreenshots: false,
    threshold: 0.12,
  };
  for (const arg of argv) {
    if (arg.startsWith("--base=")) opts.base = arg.slice(7);
    else if (arg.startsWith("--only=")) {
      opts.only = arg
        .slice(7)
        .split(",")
        .map((v) => v.trim().toLowerCase())
        .filter(Boolean);
    } else if (arg.startsWith("--limit=")) opts.limit = Number(arg.slice(8)) || 0;
    else if (arg.startsWith("--concurrency=")) {
      opts.concurrency = Math.max(1, Number(arg.slice(14)) || 1);
    } else if (arg === "--skip-screenshots") opts.skipScreenshots = true;
    else if (arg.startsWith("--threshold=")) {
      opts.threshold = Number(arg.slice(12)) || opts.threshold;
    }
  }
  return opts;
}

function listTemplateKeys() {
  const source = fs.readFileSync(REGISTRY_PATH, "utf8");
  const keys = new Set();
  const re = /^\s*key:\s*["']([a-z0-9-]+)["']\s*,?\s*$/gim;
  let match;
  while ((match = re.exec(source))) keys.add(match[1].toLowerCase());
  return [...keys].sort();
}

async function extractParitySnapshot(page) {
  return page.evaluate(() => {
    const roots = Array.from(document.querySelectorAll("[data-template-id]"));
    const root = roots[roots.length - 1] || document.body;
    const templateId = root?.getAttribute?.("data-template-id") || "";
    const forms = Array.from(
      document.querySelectorAll(
        'form[data-bizuply-form-builder="true"], form[data-bizuply-block="lead-form"], form[data-bizuply-form-id]',
      ),
    ).map((form) => {
      const fields = Array.from(
        form.querySelectorAll("input, textarea, select"),
      )
        .filter((node) => {
          const type = String(node.getAttribute("type") || "text").toLowerCase();
          return !["submit", "button", "hidden", "reset"].includes(type);
        })
        .map((node) => ({
          id:
            node.getAttribute("data-bizuply-form-field-id") ||
            node.getAttribute("name") ||
            "",
          placeholder: node.getAttribute("placeholder") || "",
          tag: node.tagName.toLowerCase(),
        }));
      const submit = form.querySelector(
        'button[type="submit"], input[type="submit"]',
      );
      return {
        formId: form.getAttribute("data-bizuply-form-id") || "",
        skin: form.getAttribute("data-bizuply-form-skin") || "",
        hasBuilderHeader: Boolean(
          form.querySelector("[data-bizuply-form-header]"),
        ),
        submitText: String(submit?.textContent || "").replace(/\s+/g, " ").trim(),
        fields,
        className: form.className || "",
      };
    });

    return {
      templateId,
      dir: document.documentElement.getAttribute("dir") || document.body.getAttribute("dir") || "",
      forms,
      textSample: String(document.body?.innerText || "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 400),
    };
  });
}

function structuralDiff(previewSnap, editSnap) {
  const issues = [];
  if (previewSnap.templateId !== editSnap.templateId) {
    issues.push(
      `template-id mismatch: preview=${previewSnap.templateId} edit=${editSnap.templateId}`,
    );
  }
  if (previewSnap.forms.length !== editSnap.forms.length) {
    issues.push(
      `form count mismatch: preview=${previewSnap.forms.length} edit=${editSnap.forms.length}`,
    );
  }
  const n = Math.min(previewSnap.forms.length, editSnap.forms.length);
  for (let i = 0; i < n; i += 1) {
    const a = previewSnap.forms[i];
    const b = editSnap.forms[i];
    if (a.skin !== "template") {
      issues.push(`preview form[${i}] missing data-bizuply-form-skin=template`);
    }
    if (b.skin !== "template") {
      issues.push(`edit form[${i}] missing data-bizuply-form-skin=template`);
    }
    if (a.hasBuilderHeader || b.hasBuilderHeader) {
      issues.push(`form[${i}] has generic form-builder header chrome`);
    }
    const aFields = a.fields.map((f) => f.id).join(",");
    const bFields = b.fields.map((f) => f.id).join(",");
    if (aFields !== bFields) {
      issues.push(`form[${i}] field ids differ: preview=${aFields} edit=${bFields}`);
    }
    if (a.submitText !== b.submitText) {
      issues.push(
        `form[${i}] submit text differs: preview="${a.submitText}" edit="${b.submitText}"`,
      );
    }
  }
  return issues;
}

function comparePngBuffers(aBuf, bBuf, diffPath, threshold) {
  const PNG = globalThis.__parityPNG;
  const pixelmatch = globalThis.__parityPixelmatch;
  if (!PNG || !pixelmatch) return { ok: true, mismatchRatio: 0, reason: "visual deps missing" };
  const imgA = PNG.sync.read(aBuf);
  const imgB = PNG.sync.read(bBuf);
  const width = Math.min(imgA.width, imgB.width);
  const height = Math.min(imgA.height, imgB.height);
  if (imgA.width !== imgB.width || imgA.height !== imgB.height) {
    return {
      ok: false,
      mismatchRatio: 1,
      reason: `size mismatch ${imgA.width}x${imgA.height} vs ${imgB.width}x${imgB.height}`,
    };
  }
  const diff = new PNG({ width, height });
  const mismatched = pixelmatch(
    imgA.data,
    imgB.data,
    diff.data,
    width,
    height,
    { threshold: 0.1 },
  );
  const ratio = mismatched / (width * height);
  if (ratio > threshold) {
    fs.writeFileSync(diffPath, PNG.sync.write(diff));
  }
  return { ok: ratio <= threshold, mismatchRatio: ratio };
}


async function stabilizePageForScreenshot(page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        animation-delay: 0s !important;
        animation-duration: 0s !important;
        transition: none !important;
        transition-delay: 0s !important;
        transition-duration: 0s !important;
        scroll-behavior: auto !important;
        caret-color: transparent !important;
      }
      [data-visual-selection-outline],
      [data-visual-hover-outline],
      [data-visual-resize-handle],
      [data-bizuply-editor-overlay],
      [data-visual-editor-chrome],
      .visual-editor-overlay,
      [data-visual-floating-toolbar] {
        display: none !important;
        opacity: 0 !important;
        visibility: hidden !important;
      }
    `,
  });

  await page.evaluate(async () => {
    const root = document.scrollingElement || document.documentElement;
    root.scrollTop = 0;
    window.scrollTo(0, 0);

    // Force reveal states open so preview/edit don't diverge mid-animation.
    document.querySelectorAll("[data-revealed], .cyclora-reveal, [data-reveal], [data-animate]").forEach((node) => {
      if (node instanceof HTMLElement) {
        node.dataset.revealed = "true";
        node.style.opacity = "1";
        node.style.transform = "none";
        node.style.visibility = "visible";
        node.style.filter = "none";
      }
    });

    // Pause videos / gifs-like media for stable frames.
    document.querySelectorAll("video").forEach((video) => {
      try {
        video.pause();
        video.currentTime = 0;
      } catch {}
    });

    // Drain pending animation frames once so layout settles at scroll=0.
    await new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
  });

  await page.waitForTimeout(150);
}

async function captureSurface(browser, url, viewport, screenshotPath, skipShot) {
  let lastError = null;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const page = await browser.newPage({ viewport });
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 90000 });
      await page.waitForSelector("[data-template-id]", { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1200);
      const snap = await extractParitySnapshot(page);
      if (!snap.templateId) {
        throw new Error("empty template-id after load");
      }
      let shot = null;
      if (!skipShot) {
        fs.mkdirSync(path.dirname(screenshotPath), { recursive: true });
        shot = await page.screenshot({
          path: screenshotPath,
          fullPage: false,
          type: "png",
        });
      }
      await page.close();
      return { snap, shot, screenshotPath };
    } catch (err) {
      lastError = err;
      await page.close().catch(() => {});
      await new Promise((r) => setTimeout(r, 500 * attempt));
    }
  }
  throw lastError;
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length);
  let idx = 0;
  async function run() {
    while (idx < items.length) {
      const current = idx;
      idx += 1;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: concurrency }, () => run()));
  return results;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  let keys = listTemplateKeys();
  if (opts.only.length) keys = keys.filter((k) => opts.only.includes(k));
  if (opts.limit > 0) keys = keys.slice(0, opts.limit);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  let pixelmatch = null;
  let PNG = null;
  let canVisual = !opts.skipScreenshots;
  if (canVisual) {
    try {
      pixelmatch = (await import("pixelmatch")).default;
      PNG = (await import("pngjs")).PNG;
    } catch {
      canVisual = false;
      console.warn("pixelmatch/pngjs not available — structural audit only");
    }
  }
  globalThis.__parityPixelmatch = pixelmatch;
  globalThis.__parityPNG = PNG;

  const browser = await chromium.launch({ headless: true });
  const report = {
    base: opts.base,
    generatedAt: new Date().toISOString(),
    templateCount: keys.length,
    viewports: Object.keys(VIEWPORTS),
    results: [],
    summary: { checked: 0, passed: 0, failed: 0, visualFailed: 0 },
  };

  try {
    const results = await mapPool(keys, opts.concurrency, async (key) => {
      const entry = {
        templateId: key,
        passed: true,
        structuralIssues: [],
        visualIssues: [],
      };

      try {
      for (const [vpName, viewport] of Object.entries(VIEWPORTS)) {
        const previewUrl = `${opts.base}/embed/template/${key}`;
        const editUrl = `${opts.base}/embed/template/${key}?mode=edit`;
        const previewShot = path.join(OUT_DIR, "shots", key, `${vpName}-preview.png`);
        const editShot = path.join(OUT_DIR, "shots", key, `${vpName}-edit.png`);
        const diffShot = path.join(OUT_DIR, "diffs", key, `${vpName}.png`);

        const preview = await captureSurface(
          browser,
          previewUrl,
          viewport,
          previewShot,
          !canVisual,
        );
        const edit = await captureSurface(
          browser,
          editUrl,
          viewport,
          editShot,
          !canVisual,
        );

        const structural = structuralDiff(preview.snap, edit.snap);
        if (structural.length) {
          entry.passed = false;
          entry.structuralIssues.push(
            ...structural.map((msg) => `[${vpName}] ${msg}`),
          );
        }

        // Ensure no -preview suffix leak
        if (/-preview$/i.test(preview.snap.templateId) || /-preview$/i.test(edit.snap.templateId)) {
          entry.passed = false;
          entry.structuralIssues.push(
            `[${vpName}] template-id still uses -preview suffix`,
          );
        }

        if (canVisual && preview.shot && edit.shot) {
          fs.mkdirSync(path.dirname(diffShot), { recursive: true });
          const cmp = comparePngBuffers(
            preview.shot,
            edit.shot,
            diffShot,
            opts.threshold,
          );
          if (!cmp.ok) {
            entry.passed = false;
            entry.visualIssues.push(
              `[${vpName}] screenshot mismatch ratio=${cmp.mismatchRatio.toFixed(4)}${cmp.reason ? ` (${cmp.reason})` : ""}`,
            );
          }
        }
      }

      } catch (err) {
        entry.passed = false;
        entry.structuralIssues.push(`runtime error: ${err?.message || err}`);
      }

      console.log(`done ${key} passed=${entry.passed}`);
      return entry;
    });

    report.results = results;
    report.summary.checked = results.length;
    report.summary.passed = results.filter((r) => r.passed).length;
    report.summary.failed = results.filter((r) => !r.passed).length;
    report.summary.visualFailed = results.filter((r) => r.visualIssues.length).length;
  } finally {
    await browser.close();
  }

  const reportPath = path.join(OUT_DIR, "parity-report.json");
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  const md = [
    "# Template parity report",
    "",
    `- Generated: ${report.generatedAt}`,
    `- Base: ${report.base}`,
    `- Checked: ${report.summary.checked}`,
    `- Passed: ${report.summary.passed}`,
    `- Failed: ${report.summary.failed}`,
    `- Visual failed: ${report.summary.visualFailed}`,
    "",
    "## Failures",
    "",
  ];
  for (const row of report.results.filter((r) => !r.passed)) {
    md.push(`### ${row.templateId}`);
    for (const issue of [...row.structuralIssues, ...row.visualIssues]) {
      md.push(`- ${issue}`);
    }
    md.push("");
  }
  fs.writeFileSync(path.join(OUT_DIR, "parity-report.md"), md.join("\n"));
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Wrote ${reportPath}`);
  if (report.summary.failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
