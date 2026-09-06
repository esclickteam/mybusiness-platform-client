#!/usr/bin/env node
/**
 * Hardcoded-string audit for BizUply localization.
 *
 * Categories:
 *   A — ADMIN-only (intentional Hebrew)
 *   B — EMPLOYEE/STAFF-only (intentional Hebrew)
 *   C — Customer website / template / default site content
 *   D — Developer / test / log / comment / non-UI
 *   E — BUSINESS / PARTNER / Marketer / public-auth UI (must be migrated)
 *
 * Admin and Staff Hebrew is acceptable and is not localization debt.
 */
import fs from "node:fs";
import path from "node:path";
import {
  classifySourcePath,
  isDefaultSiteContentString,
} from "../src/i18n/hardcodedAuditScope.js";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..", "src");
const HE = /[\u0590-\u05FF]/;
const CODE_EXT = new Set([".ts", ".tsx", ".js", ".jsx"]);

function classify(rel) {
  return classifySourcePath(rel);
}

function stripComments(source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/(^|[^:])\/\/.*$/gm, "$1");
}

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name === "dist") continue;
      walk(full, out);
    } else if (CODE_EXT.has(path.extname(entry.name))) {
      out.push(full);
    }
  }
  return out;
}

function isTranslationFallbackHit(source, value) {
  const escaped = value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(String.raw`\bt\(\s*(['"\`])[^'"\`]+?\1\s*,\s*(['"\`])${escaped}\2`),
    new RegExp(String.raw`defaultValue\s*:\s*(['"\`])${escaped}\1`),
    new RegExp(String.raw`fallback\s*:\s*(['"\`])${escaped}\1`),
  ];
  return patterns.some((pattern) => pattern.test(source));
}

function extractHebrewStrings(source, { ignoreTranslationFallbacks = false } = {}) {
  const hits = [];
  const quoted = /(["'`])((?:\\.|(?!\1).)*?)\1/g;
  let match;
  while ((match = quoted.exec(source))) {
    const value = match[2];
    if (HE.test(value) && value.trim().length > 1) {
      const normalized = value.replace(/\s+/g, " ").trim().slice(0, 160);
      if (ignoreTranslationFallbacks && isTranslationFallbackHit(source, value)) continue;
      hits.push(normalized);
    }
  }
  const jsx = />([^<>{]*[\u0590-\u05FF][^<>{]*)</g;
  while ((match = jsx.exec(source))) {
    const value = match[1].replace(/\s+/g, " ").trim();
    if (value.length > 1) hits.push(value.slice(0, 160));
  }
  return [...new Set(hits)];
}

const files = walk(ROOT);
const buckets = { A: [], B: [], C: [], D: [], E: [] };

for (const file of files) {
  const rel = path.relative(ROOT, file);
  const cat = classify(rel);
  const raw = fs.readFileSync(file, "utf8");
  const source = cat === "D" ? raw : stripComments(raw);
  const hits = extractHebrewStrings(source, { ignoreTranslationFallbacks: cat === "E" });
  if (cat === "E") {
    const chromeHits = hits.filter((value) => !isDefaultSiteContentString(value));
    const contentHits = hits.filter((value) => isDefaultSiteContentString(value));
    if (contentHits.length) {
      buckets.C.push({
        file: rel,
        count: contentHits.length,
        samples: contentHits.slice(0, 8),
        note: "default site HTML / canvas seed copy",
      });
    }
    if (!chromeHits.length) continue;
    buckets.E.push({ file: rel, count: chromeHits.length, samples: chromeHits.slice(0, 8) });
    continue;
  }
  if (!hits.length) continue;
  buckets[cat].push({ file: rel, count: hits.length, samples: hits.slice(0, 8) });
}

for (const cat of Object.keys(buckets)) {
  buckets[cat].sort((a, b) => b.count - a.count);
}

const summary = Object.fromEntries(
  Object.entries(buckets).map(([cat, rows]) => [
    cat,
    { files: rows.length, strings: rows.reduce((sum, row) => sum + row.count, 0) },
  ]),
);

const report = {
  summary,
  note: {
    A: "Admin-only — intentional Hebrew, not localization debt",
    B: "Employee/Staff-only — intentional Hebrew, not localization debt",
    C: "Customer website/template content — intentional",
    D: "Developer/test/log/comment — acceptable",
    E: "Business/Partner/Marketer/public UI — must be migrated",
  },
  categoryE: buckets.E,
};

const outPath = path.resolve(ROOT, "..", "scripts", "i18n-hardcoded-audit.json");
fs.writeFileSync(outPath, JSON.stringify(report, null, 2) + "\n");

console.log("Hardcoded Hebrew audit");
console.log(JSON.stringify(summary, null, 2));
console.log(`\nCategory E files: ${summary.E.files} (${summary.E.strings} strings)`);
if (buckets.E.length) {
  console.log("Top category E leftovers:");
  for (const row of buckets.E.slice(0, 25)) {
    console.log(`  ${row.count.toString().padStart(4)}  ${row.file}`);
  }
}
console.log(`\nWrote ${path.relative(process.cwd(), outPath)}`);
