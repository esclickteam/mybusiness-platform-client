#!/usr/bin/env node
/**
 * Walk built-in website templates and list unique Hebrew demo strings.
 * Writes scripts/template-hebrew-strings.json
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const TEMPLATES = path.join(ROOT, "src/components/site-builder/studio/data/templates");
const OUT = path.join(ROOT, "scripts/template-hebrew-strings.json");

const HE = /[\u0590-\u05FF]/;
const STRING_RE = /(["'`])((?:\\.|(?!\1)[\s\S])*?)\1/g;

function* walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (/^(meta|defaultData)\.tsx?$/.test(entry.name)) yield full;
  }
}

function isSkippable(raw) {
  const text = raw.replace(/\\n/g, "\n").replace(/\\t/g, "\t").trim();
  if (!text || !HE.test(text)) return true;
  if (/^https?:\/\//i.test(text) || /^www\./i.test(text)) return true;
  if (/\.(png|jpe?g|webp|gif|svg|mp4)(\?|$)/i.test(text) && !HE.test(text.replace(/https?:\/\/\S+/g, ""))) {
    return true;
  }
  const withoutTags = text.replace(/<[^>]+>/g, "").trim();
  if (text.startsWith("<") && !HE.test(withoutTags)) return true;
  return false;
}

const counts = new Map();
for (const file of walk(TEMPLATES)) {
  const src = fs.readFileSync(file, "utf8");
  STRING_RE.lastIndex = 0;
  let match;
  while ((match = STRING_RE.exec(src))) {
    const raw = match[2].replace(/\\(['"`\\])/g, "$1");
    if (isSkippable(raw)) continue;
    counts.set(raw, (counts.get(raw) || 0) + 1);
  }
}

const rows = [...counts.entries()]
  .map(([text, count]) => ({ text, count }))
  .sort((a, b) => b.count - a.count || a.text.localeCompare(b.text, "he"));

fs.writeFileSync(OUT, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${rows.length} unique Hebrew strings to ${path.relative(ROOT, OUT)}`);
