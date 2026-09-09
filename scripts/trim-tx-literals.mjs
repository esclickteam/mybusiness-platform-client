#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (entry.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

let files = 0;
let count = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  const next = original.replace(/tx\(("(?:\\.|[^"\\])*")\)/g, (full, jsonStr) => {
    const value = JSON.parse(jsonStr);
    if (typeof value !== "string") return full;
    const trimmed = value.trim();
    if (!trimmed || trimmed === value) return full;
    count += 1;
    return `tx(${JSON.stringify(trimmed)})`;
  });
  if (next !== original) {
    fs.writeFileSync(file, next);
    files += 1;
    process.stdout.write(`${path.relative(process.cwd(), file)}\n`);
  }
}
process.stdout.write(`\nTrimmed ${count} tx() strings in ${files} files.\n`);
