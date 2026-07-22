#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");
const SKIP_DIRS = new Set([
  "site-builder/studio/data/templates",
  "node_modules",
]);

const EXT = new Set([".tsx", ".jsx", ".ts", ".js", ".css"]);

const REPLACEMENTS = [
  [
    /bg-gradient-to-br from-violet-600 via-fuchsia-600 to-sky-500/g,
    "bg-gradient-to-l from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80",
  ],
  [
    /bg-gradient-to-br from-violet-600 to-fuchsia-500/g,
    "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-br from-violet-600 to-blue-600/g,
    "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-l from-violet-600 to-blue-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-r from-violet-600 to-blue-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-l from-violet-600 to-indigo-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-t from-violet-600 to-violet-300/g,
    "bg-gradient-to-t from-violet-300 via-sky-200 to-cyan-100",
  ],
  [
    /group-hover:bg-violet-600 group-hover:text-white/g,
    "group-hover:border-violet-200/80 group-hover:from-violet-200/80 group-hover:via-sky-100 group-hover:to-cyan-100 group-hover:text-slate-800",
  ],
  [/hover:bg-violet-700/g, "hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"],
  [/hover:bg-violet-500/g, "hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-100"],
  [
    /bg-violet-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70",
  ],
  [
    /rounded-xl bg-slate-900/g,
    "rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100",
  ],
  [
    /rounded-2xl bg-slate-900/g,
    "rounded-md border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100",
  ],
  [/bg-slate-900\/50/g, "bg-violet-900/10"],
  [/bg-slate-900\/25/g, "bg-violet-900/10"],
  [
    /bg-slate-900 px/g,
    "border border-violet-200/80 bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 px",
  ],
  [
    /bg-slate-900 text-white/g,
    "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800",
  ],
  [/hover:bg-slate-800/g, "hover:from-violet-200/70 hover:via-sky-100 hover:to-cyan-50"],
  [/bg-slate-900/g, "bg-gradient-to-l from-violet-50 via-sky-50 to-cyan-50 border border-violet-100/80 text-slate-800"],
  [/text-black\/55/g, "text-slate-600"],
  [/text-black\/45/g, "text-slate-500"],
  [/text-black\/40/g, "text-slate-500"],
  [/text-black\/35/g, "text-slate-400"],
  [/hover:text-black/g, "hover:text-slate-900"],
  [/text-black/g, "text-slate-800"],
  [
    /from-violet-100 via-sky-100 to-cyan-100 border border-violet-200\/70 text-white/g,
    "from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800",
  ],
  [
    /from-violet-100 via-sky-100 to-cyan-100 border border-violet-200\/80 text-white/g,
    "from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80 text-slate-800",
  ],
  [
    /from-violet-100 via-sky-100 to-cyan-100 border border-violet-200\/80([^"]*) text-white/g,
    "from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80$1 text-slate-800",
  ],
  [
    /bg-gradient-to-r from-violet-700 to-fuchsia-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-br from-violet-600 to-fuchsia-600/g,
    "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /from-slate-950 via-violet-950 to-violet-700/g,
    "from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80",
  ],
  [
    /bg-slate-950 text-white/g,
    "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800",
  ],
  [/bg-slate-950/g, "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800"],
  [/text-slate-950/g, "text-slate-800"],
  [/text-violet-950/g, "text-slate-800"],
  [
    /border-violet-700 bg-violet-700 text-white/g,
    "border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800",
  ],
  [
    /bg-gradient-to-l from-violet-600 to-indigo-700/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /group-hover:from-violet-600 group-hover:to-blue-600 group-hover:text-white/g,
    "group-hover:from-violet-200/80 group-hover:via-sky-100 group-hover:to-cyan-100 group-hover:text-slate-800",
  ],
  [
    /from-violet-600 to-fuchsia-500/g,
    "from-violet-200 via-sky-200 to-cyan-200",
  ],
  [
    /bg-gradient-to-br from-violet-700 to-fuchsia-600/g,
    "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-l from-violet-700 to-fuchsia-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-l from-violet-700 to-fuchsia-500/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-br from-violet-700 to-fuchsia-500/g,
    "bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /from-violet-700 via-fuchsia-600 to-pink-500/g,
    "from-violet-100 via-sky-100 to-cyan-100",
  ],
  [
    /from-violet-700 to-fuchsia-500/g,
    "from-violet-200 via-sky-200 to-cyan-200",
  ],
  [
    /bg-gradient-to-br from-slate-950 via-slate-900 to-violet-950/g,
    "bg-gradient-to-l from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80",
  ],
  [
    /bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950/g,
    "bg-gradient-to-l from-[#faf7ff] via-[#f3f8ff] to-[#eefcff] border border-violet-100/80",
  ],
  [
    /from-slate-950 via-slate-900 to-violet-950/g,
    "from-[#faf7ff] via-[#f3f8ff] to-[#eefcff]",
  ],
  [
    /bg-gradient-to-l from-violet-600 to-indigo-950/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /bg-gradient-to-l from-purple-700 to-fuchsia-600/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [
    /border-purple-700 bg-gradient-to-l from-purple-700 to-fuchsia-600/g,
    "border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100",
  ],
  [
    /from-slate-950 via-slate-900 to-violet-700/g,
    "from-[#faf7ff] via-[#f3f8ff] to-[#eefcff]",
  ],
  [
    /bg-gradient-to-r from-slate-950 via-slate-900 to-violet-700/g,
    "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/80",
  ],
  [/focus:border-slate-950/g, "focus:border-sky-300"],
  [/focus:ring-slate-950\/10/g, "focus:ring-sky-100/80"],
  [/ring-slate-950\/5/g, "ring-violet-100/40"],
  [/shadow-slate-950/g, "shadow-violet-200"],
  [/shadow-violet-950/g, "shadow-violet-200"],
  [/hover:from-violet-700 hover:to-fuchsia-600/g, "hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"],
  [/hover:from-violet-700 hover:to-indigo-700/g, "hover:from-violet-200/80 hover:via-sky-100 hover:to-cyan-100"],
  [/text-slate-800([^"]*) text-white/g, "text-slate-800"],
  [
    /border border-violet-200\/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800([^"]*) text-white/g,
    "border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 text-slate-800$1",
  ],
];

function shouldSkip(relPath) {
  return [...SKIP_DIRS].some((part) => relPath.includes(part));
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
    console.log("updated", rel);
  }
}

console.log(`Done. ${changed} files updated.`);
