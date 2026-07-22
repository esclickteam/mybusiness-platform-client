import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const libDir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/site-builder/studio/visual-editor/library",
);

const pl = fs.readFileSync(path.join(libDir, "pageLibrary.ts"), "utf8");
const ids = [...pl.matchAll(/sectionIds: \["([^"]+)"/g)].map((m) => m[1]);
let all = "";
for (const f of fs.readdirSync(libDir).filter((x) => x.endsWith(".ts"))) {
  all += fs.readFileSync(path.join(libDir, f), "utf8") + "\n";
}
const missing = [];
for (const id of new Set(ids)) {
  if (id === "section-footer") continue;
  if (!all.includes(`"${id}"`) && !all.includes(`'${id}'`)) missing.push(id);
}
console.log("page section refs", ids.length);
console.log("unique", new Set(ids).size);
console.log("missing", missing.length ? missing.join(",") : "none");
console.log(
  "categories",
  [...pl.matchAll(/category: "([^"]+)"/g)].map((m) => m[1]).join(","),
);

/** Ensure generated pages call category-specific recipes, not shared layout kinds. */
const generated = fs
  .readdirSync(libDir)
  .filter((f) => f.endsWith("PageShowcaseSections.ts") && f !== "aboutPageShowcaseSections.ts");

let legacyShared = 0;
let categoryCalls = 0;
const callPairs = [];
for (const file of generated) {
  const src = fs.readFileSync(path.join(libDir, file), "utf8");
  const legacy = [...src.matchAll(/buildLayoutNodes\("/g)].length;
  const cats = [...src.matchAll(/buildCategoryPageNodes\("([^"]+)",\s*(\d+)/g)];
  legacyShared += legacy;
  categoryCalls += cats.length;
  for (const m of cats) callPairs.push(`${m[1]}:${m[2]}`);
}

console.log("generated category files", generated.length);
console.log("buildCategoryPageNodes calls", categoryCalls);
console.log("legacy buildLayoutNodes calls", legacyShared);
console.log("unique category:index pairs", new Set(callPairs).size);

if (legacyShared > 0) {
  console.error("FAIL: legacy shared layouts still referenced");
  process.exit(1);
}
if (categoryCalls !== 130) {
  console.error(`FAIL: expected 130 category recipe calls, got ${categoryCalls}`);
  process.exit(1);
}
if (new Set(callPairs).size !== 130) {
  console.error("FAIL: duplicate category:index pairs");
  process.exit(1);
}

/** Mirror of CATEGORY_PATTERNS — slot uniqueness across categories. */
const CATEGORY_PATTERNS = {
  hero: ["featureMosaic", "boldStatement", "darkStats", "lifestyle", "formPanel", "carouselRail", "catalogShelf", "cinematic", "listMedia", "splitHero"],
  services: ["packageTiers", "timeline", "comparisonMatrix", "colorCards", "caseStudy", "centerEditorial", "carouselRail", "magazine", "listMedia", "formPanel"],
  gallery: ["masonry", "filmstrip", "caseStudy", "magazine", "listMedia", "cinematic", "lifestyle", "colorCards", "carouselRail", "contactDesk"],
  contact: ["contactDesk", "splitHero", "portraitGrid", "formPanel", "colorCards", "cinematic", "lifestyle", "listMedia", "featureMosaic", "agendaRows"],
  commerce: ["catalogShelf", "caseStudy", "masonry", "comparisonMatrix", "cinematic", "lifestyle", "packageTiers", "carouselRail", "filmstrip", "ticketHero"],
  pricing: ["packageTiers", "comparisonMatrix", "featureMosaic", "cinematic", "lifestyle", "listMedia", "accordion", "boldStatement", "darkStats", "quoteWall"],
  blog: ["listMedia", "caseStudy", "magazine", "colorCards", "portraitGrid", "cinematic", "lifestyle", "timeline", "catalogShelf", "accordion"],
  events: ["ticketHero", "agendaRows", "caseStudy", "colorCards", "portraitGrid", "cinematic", "lifestyle", "darkStats", "timeline", "formPanel"],
  testimonials: ["quoteWall", "caseStudy", "carouselRail", "magazine", "darkStats", "cinematic", "lifestyle", "timeline", "filmstrip", "formPanel"],
  team: ["portraitGrid", "splitHero", "masonry", "colorCards", "cinematic", "lifestyle", "boldStatement", "listMedia", "darkStats", "formPanel"],
  faq: ["accordion", "listMedia", "colorCards", "cinematic", "lifestyle", "timeline", "contactDesk", "featureMosaic", "magazine", "formPanel"],
  promote: ["boldStatement", "featureMosaic", "ticketHero", "listMedia", "cinematic", "lifestyle", "caseStudy", "colorCards", "comparisonMatrix", "formPanel"],
  resume: ["cvColumns", "timeline", "colorCards", "caseStudy", "cinematic", "lifestyle", "listMedia", "darkStats", "splitHero", "formPanel"],
};

const CAT_INDEX = {
  hero: 0, services: 1, gallery: 2, contact: 3, commerce: 4, pricing: 5, blog: 6,
  events: 7, testimonials: 8, team: 9, faq: 10, promote: 11, resume: 12,
};

const fingerprints = new Map();
const collisions = [];
for (const [cat, patterns] of Object.entries(CATEGORY_PATTERNS)) {
  for (let i = 0; i < 10; i++) {
    const c = CAT_INDEX[cat];
    const ox = (c * 13 + i * 5) % 48;
    const oy = (c * 9 + i * 7) % 36;
    const gap = 16 + ((c + i) % 4) * 4;
    const cardW = 300 + ((c * 3 + i) % 5) * 4;
    const cardH = 220 + ((c + i * 2) % 4) * 8;
    // Pattern + geometry fingerprint (enough to prove services≠gallery at same slot)
    const fp = `${patterns[i]}|ox:${ox}|oy:${oy}|gap:${gap}|cw:${cardW}|ch:${cardH}`;
    const id = `${cat}-${i}`;
    if (fingerprints.has(fp)) collisions.push(`${fingerprints.get(fp)} == ${id}`);
    else fingerprints.set(fp, id);
  }
}

// Within each category, all 10 patterns must be distinct
const withinDupes = [];
for (const [cat, patterns] of Object.entries(CATEGORY_PATTERNS)) {
  if (new Set(patterns).size !== 10) {
    withinDupes.push(cat);
  }
}

console.log("fingerprint unique pages", fingerprints.size);
console.log("fingerprint collisions", collisions.length ? collisions.join(" | ") : "none");
console.log("within-category pattern dupes", withinDupes.length ? withinDupes.join(",") : "none");
if (CATEGORY_PATTERNS.services[0] === CATEGORY_PATTERNS.gallery[0]) {
  console.error("FAIL: services[0] and gallery[0] share the same pattern");
  process.exit(1);
}
if (withinDupes.length) {
  console.error("FAIL: duplicate patterns inside category");
  process.exit(1);
}
if (collisions.length) {
  console.error("FAIL: fingerprint collisions");
  process.exit(1);
}
if (missing.length) {
  console.error("FAIL: missing section ids");
  process.exit(1);
}
console.log("OK");
