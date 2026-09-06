#!/usr/bin/env node
/**
 * Stop template editorCss from forcing physical RTL. HTML dir={templateDir()}
 * already sets direction; CSS direction:rtl overrides it for every language.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src/components/site-builder/studio/data/templates");

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(full));
    else if (/editorCss\.ts$/i.test(entry.name) || /EditorCss\.ts$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

let files = 0;
let dirs = 0;
let aligns = 0;
for (const file of walk(ROOT)) {
  const original = fs.readFileSync(file, "utf8");
  let src = original.replace(/direction:\s*rtl\s*;?/g, () => {
    dirs += 1;
    return "";
  });
  src = src.replace(/text-align:\s*right/g, () => {
    aligns += 1;
    return "text-align: start";
  });
  if (src === original) continue;
  fs.writeFileSync(file, src);
  files += 1;
}
process.stdout.write(`Updated ${files} editorCss files (${dirs} direction, ${aligns} text-align).\n`);
