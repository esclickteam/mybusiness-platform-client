#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");
const TX_MODULE = path.resolve("src/i18n/templateDir");

function importLine(filePath) {
  let rel = path.relative(path.dirname(filePath), TX_MODULE);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return `import { templateDir } from "${rel.replaceAll("\\", "/")}";`;
}

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
let replacements = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let src = original;
  const next = src.replace(/dir="rtl"/g, (match, offset) => {
    const nearby = src.slice(offset, offset + 360);
    if (!/data-template-id|min-h-screen/.test(nearby)) return match;
    replacements += 1;
    return "dir={templateDir()}";
  });
  src = next;
  if (src === original) continue;
  if (!src.includes("templateDir")) {
    const firstImport = src.indexOf("import ");
    if (firstImport !== -1) {
      const insertAt = src.indexOf("\n", firstImport);
      src = `${src.slice(0, insertAt + 1)}${importLine(file)}\n${src.slice(insertAt + 1)}`;
    }
  }
  fs.writeFileSync(file, src);
  files += 1;
}
process.stdout.write(`Updated ${files} files, ${replacements} root dir attributes.\n`);
