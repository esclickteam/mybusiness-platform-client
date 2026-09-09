#!/usr/bin/env node
/**
 * Convert leftover physical RTL alignment to logical CSS and remaining
 * hardcoded dir="rtl" roots/sections to templateDir().
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");
const MOD = path.resolve("src/i18n/templateDir");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (
      entry.name === "pages.tsx" ||
      entry.name === "preview.tsx" ||
      (dir.endsWith(`${path.sep}shared`) && entry.name.endsWith(".tsx"))
    ) {
      out.push(full);
    }
  }
  return out;
}

function importLine(filePath) {
  let rel = path.relative(path.dirname(filePath), MOD);
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return `import { templateDir } from "${rel.replaceAll("\\", "/")}";`;
}

let files = 0;
let dirs = 0;
let aligns = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let src = original;
  src = src.replace(/dir="rtl"/g, () => {
    dirs += 1;
    return "dir={templateDir()}";
  });
  src = src.replace(/(?<![\w-])text-right(?![\w-])/g, () => {
    aligns += 1;
    return "text-start";
  });
  if (src === original) continue;
  if (src.includes("templateDir(") && !src.includes("import { templateDir }")) {
    const firstImport = src.indexOf("import ");
    if (firstImport !== -1) {
      const insertAt = src.indexOf("\n", firstImport);
      src = `${src.slice(0, insertAt + 1)}${importLine(file)}\n${src.slice(insertAt + 1)}`;
    }
  }
  fs.writeFileSync(file, src);
  files += 1;
}
process.stdout.write(`Updated ${files} files (${dirs} dir, ${aligns} text-right).\n`);
