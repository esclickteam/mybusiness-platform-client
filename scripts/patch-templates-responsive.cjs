/**
 * Batch-patch all template pages.tsx files to mobile-first Tailwind patterns.
 * Only rewrites unprefixed utilities when no sm/md/lg/xl/2xl variant already exists
 * on the same className token list for that utility family.
 */
const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(
  __dirname,
  "..",
  "src",
  "components",
  "site-builder",
  "studio",
  "data",
  "templates",
);

const REPLACEMENTS = [
  // grids
  { re: /\bgrid-cols-12\b/g, to: "grid-cols-1 md:grid-cols-2 xl:grid-cols-12", skipIf: /(?:sm|md|lg|xl|2xl):grid-cols-/ },
  { re: /\bgrid-cols-6\b/g, to: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-6", skipIf: /(?:sm|md|lg|xl|2xl):grid-cols-/ },
  { re: /\bgrid-cols-5\b/g, to: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-5", skipIf: /(?:sm|md|lg|xl|2xl):grid-cols-/ },
  { re: /\bgrid-cols-4\b/g, to: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4", skipIf: /(?:sm|md|lg|xl|2xl):grid-cols-/ },
  { re: /\bgrid-cols-3\b/g, to: "grid-cols-1 md:grid-cols-3", skipIf: /(?:sm|md|lg|xl|2xl):grid-cols-/ },
  { re: /\bgrid-cols-2\b/g, to: "grid-cols-1 sm:grid-cols-2", skipIf: /(?:sm|md|lg|xl|2xl):grid-cols-/ },
  // type
  { re: /\btext-9xl\b/g, to: "text-3xl md:text-9xl", skipIf: /(?:sm|md|lg|xl|2xl):text-/ },
  { re: /\btext-8xl\b/g, to: "text-3xl md:text-8xl", skipIf: /(?:sm|md|lg|xl|2xl):text-/ },
  { re: /\btext-7xl\b/g, to: "text-3xl md:text-7xl", skipIf: /(?:sm|md|lg|xl|2xl):text-/ },
  { re: /\btext-6xl\b/g, to: "text-3xl md:text-6xl", skipIf: /(?:sm|md|lg|xl|2xl):text-/ },
  { re: /\btext-5xl\b/g, to: "text-2xl md:text-5xl", skipIf: /(?:sm|md|lg|xl|2xl):text-/ },
  { re: /\btext-4xl\b/g, to: "text-2xl sm:text-4xl", skipIf: /(?:sm|md|lg|xl|2xl):text-/ },
  // section padding
  { re: /\bpy-40\b/g, to: "py-16 md:py-40", skipIf: /(?:sm|md|lg|xl|2xl):py-/ },
  { re: /\bpy-36\b/g, to: "py-16 md:py-36", skipIf: /(?:sm|md|lg|xl|2xl):py-/ },
  { re: /\bpy-32\b/g, to: "py-14 md:py-32", skipIf: /(?:sm|md|lg|xl|2xl):py-/ },
  { re: /\bpy-28\b/g, to: "py-14 md:py-28", skipIf: /(?:sm|md|lg|xl|2xl):py-/ },
  { re: /\bpy-24\b/g, to: "py-12 md:py-24", skipIf: /(?:sm|md|lg|xl|2xl):py-/ },
  { re: /\bpx-20\b/g, to: "px-4 md:px-20", skipIf: /(?:sm|md|lg|xl|2xl):px-/ },
  { re: /\bpx-16\b/g, to: "px-4 md:px-16", skipIf: /(?:sm|md|lg|xl|2xl):px-/ },
  { re: /\bpx-14\b/g, to: "px-4 md:px-14", skipIf: /(?:sm|md|lg|xl|2xl):px-/ },
  { re: /\bpx-12\b/g, to: "px-4 md:px-12", skipIf: /(?:sm|md|lg|xl|2xl):px-/ },
];

function patchClassString(value) {
  let next = value;
  let changed = false;

  for (const rule of REPLACEMENTS) {
    if (rule.skipIf.test(next)) continue;
    const replaced = next.replace(rule.re, (match) => {
      // Avoid double-applying if somehow already transformed
      if (next.includes(`md:${match}`) || next.includes(`sm:${match}`)) {
        return match;
      }
      changed = true;
      return rule.to;
    });
    next = replaced;
  }

  // De-dupe accidental repeats like "grid-cols-1 grid-cols-1"
  next = next
    .replace(/\bgrid-cols-1\s+grid-cols-1\b/g, "grid-cols-1")
    .replace(/\btext-3xl\s+text-3xl\b/g, "text-3xl")
    .replace(/\btext-2xl\s+text-2xl\b/g, "text-2xl");

  return { next, changed: changed || next !== value };
}

function patchFile(filePath) {
  const original = fs.readFileSync(filePath, "utf8");
  let changed = false;

  // className="..."
  let out = original.replace(
    /className=(")([^"]*)(")/g,
    (full, q1, classes, q2) => {
      const { next, changed: did } = patchClassString(classes);
      if (did) changed = true;
      return `className=${q1}${next}${q2}`;
    },
  );

  // className={`...`} with simple content (no nested ${})
  out = out.replace(
    /className=\{`([^`$]*)`\}/g,
    (full, classes) => {
      const { next, changed: did } = patchClassString(classes);
      if (did) changed = true;
      return `className={\`${next}\`}`;
    },
  );

  // String literals inside className={[ "..." ].join(...)} / cx("...")
  out = out.replace(
    /(className=\{\[[\s\S]*?\}\]|className=\{[^}]*\})/g,
    (block) => {
      return block.replace(
        /(["'])((?:(?!\1)[^\\]|\\.)*)\1/g,
        (full, q, classes) => {
          if (!/\b(?:grid-cols-|text-[4-9]xl|py-2[4-9]|py-3[0-9]|px-1[2-9]|px-2[0-9])\b/.test(classes)) {
            return full;
          }
          const { next, changed: did } = patchClassString(classes);
          if (did) changed = true;
          return `${q}${next}${q}`;
        },
      );
    },
  );

  if (!changed || out === original) return false;
  fs.writeFileSync(filePath, out, "utf8");
  return true;
}

function main() {
  const dirs = fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && d.name !== "shared");

  let scanned = 0;
  let patched = 0;
  const names = [];

  for (const dir of dirs) {
    const pagesPath = path.join(TEMPLATES_DIR, dir.name, "pages.tsx");
    if (!fs.existsSync(pagesPath)) continue;
    scanned += 1;
    if (patchFile(pagesPath)) {
      patched += 1;
      names.push(dir.name);
    }
  }

  console.log(
    JSON.stringify(
      { scanned, patched, templates: names.slice(0, 40), more: names.length > 40 },
      null,
      2,
    ),
  );
}

main();
