#!/usr/bin/env node
/**
 * Wrap Hebrew string literals in studio template pages/previews with tx().
 * Does not touch saved customer websites — only bundled template source.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(
  path.dirname(new URL(import.meta.url).pathname),
  "..",
  "src/components/site-builder/studio/data/templates"
);
const HE = /[\u0590-\u05FF]/;
const IMPORT = 'import { tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";\n';

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (entry.name === "pages.tsx" || entry.name === "preview.tsx") out.push(full);
  }
  return out;
}

function wrapSource(source) {
  let next = source;
  if (!HE.test(next)) return next;

  next = next.replace(/>([^<>{]*[\u0590-\u05FF][^<>{}]*)</g, (full, text) => {
    const clean = text.trim();
    if (!clean || clean.includes("{")) return full;
    return `>{tx(${JSON.stringify(clean)})}<`;
  });

  next = next.replace(/(["'`])((?:\\.|(?!\1).)*?[\u0590-\u05FF](?:\\.|(?!\1).)*?)\1/g, (full, quote, value) => {
    if (full.includes("tx(")) return full;
    if (value.includes("${")) return full;
    if (value.includes("\\u")) return full;
    return `tx(${JSON.stringify(value)})`;
  });

  if (!next.includes("localizeBuiltInTemplateSeed") && !next.includes('from "../../../../../../i18n/')) {
    const importMatch = next.match(/^import .+$/m);
    if (importMatch) {
      next = next.replace(importMatch[0], `${importMatch[0]}\n${IMPORT.trim()}`);
    } else {
      next = IMPORT + next;
    }
  } else if (!next.includes(" tx ") && !next.includes("{ tx") && !next.includes("tx }")) {
    next = next.replace(
      /import \{([^}]+)\} from ["']\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/\.\.\/i18n\/localizeBuiltInTemplateSeed["'];/,
      (full, names) => {
        if (names.includes("tx")) return full;
        return `import {${names}, tx } from "../../../../../../i18n/localizeBuiltInTemplateSeed";`;
      }
    );
    if (!next.includes("tx }") && !next.includes("{ tx")) {
      const importMatch = next.match(/^import .+$/m);
      if (importMatch) next = next.replace(importMatch[0], `${importMatch[0]}\n${IMPORT.trim()}`);
    }
  }

  return next;
}

const files = walk(ROOT);
let changed = 0;
for (const file of files) {
  const before = fs.readFileSync(file, "utf8");
  const after = wrapSource(before);
  if (after !== before) {
    fs.writeFileSync(file, after);
    changed += 1;
  }
}
console.log(`wrapped Hebrew literals in ${changed}/${files.length} template files`);
