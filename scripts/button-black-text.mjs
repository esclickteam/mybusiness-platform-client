#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");
const SKIP_DIRS = ["site-builder/studio/data/templates"];
const EXT = new Set([".tsx", ".jsx", ".ts", ".js", ".css"]);

/** Button label and light-button background fixes only */
const REPLACEMENTS = [
  [/font-black text-white/g, "font-black text-black"],
  [/font-semibold text-white/g, "font-semibold text-black"],
  [/font-bold text-white/g, "font-bold text-black"],
  [
    /bg-gradient-to-r from-indigo-600 via-violet-600 to-cyan-500/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-br from-indigo-600 to-cyan-500/g,
    "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /rounded-full bg-\[#111827\]/g,
    "rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100",
  ],
  [/rounded-xl bg-\[#111827\]/g, "rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100"],
  [/bg-black px/g, "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px"],
  [
    /rounded-2xl bg-sky-600/g,
    "rounded-md border border-sky-200/80 bg-gradient-to-l from-sky-100 via-cyan-100 to-white",
  ],
  [
    /rounded-2xl bg-emerald-600/g,
    "rounded-md border border-emerald-200/80 bg-gradient-to-l from-emerald-100 via-green-50 to-white",
  ],
  [
    /rounded-2xl bg-emerald-700/g,
    "rounded-md border border-emerald-200/80 bg-gradient-to-l from-emerald-100 via-green-50 to-white",
  ],
  [/hover:bg-sky-700/g, "hover:from-sky-200/80 hover:via-cyan-100 hover:to-white"],
  [/hover:bg-emerald-700/g, "hover:from-emerald-200/80 hover:via-green-50 hover:to-white"],
  [
    /rounded-2xl bg-amber-900/g,
    "rounded-md border border-amber-200/80 bg-gradient-to-l from-amber-100 via-orange-50 to-white",
  ],
  [/hover:bg-amber-800/g, "hover:from-amber-200/80 hover:via-orange-50 hover:to-white"],
  [
    /rounded-full bg-\[#7b2ee8\]/g,
    "rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100",
  ],
  [/hover:bg-\[#6724c9\]/g, "hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"],
];

function shouldSkip(relPath) {
  return SKIP_DIRS.some((part) => relPath.includes(part));
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.relative(ROOT, full).replace(/\\/g, "/");
    if (entry.isDirectory()) {
      if (!shouldSkip(rel)) walk(full, files);
      continue;
    }
    if (EXT.has(path.extname(entry.name))) files.push(full);
  }
  return files;
}

let changed = 0;
for (const file of walk(ROOT)) {
  const rel = path.relative(ROOT, file).replace(/\\/g, "/");
  if (shouldSkip(rel)) continue;

  const original = fs.readFileSync(file, "utf8");
  let next = original;
  for (const [pattern, replacement] of REPLACEMENTS) {
    next = next.replace(pattern, replacement);
  }
  if (next !== original) {
    fs.writeFileSync(file, next);
    changed += 1;
  }
}

console.log(`Done. ${changed} files updated.`);
