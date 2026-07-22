/**
 * Static check: after polish logic changes, ensure curated section sources
 * don't hardcode the same fashion URL as both welcome editorial + overlap.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const lib = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/site-builder/studio/visual-editor/library",
);

const welcome = fs.readFileSync(path.join(lib, "welcomeShowcaseSections.ts"), "utf8");
const sectionLib = fs.readFileSync(path.join(lib, "sectionLibrary.ts"), "utf8");

const checks = [
  [!welcome.includes('IMG.fashion,\n  [') && !welcome.includes("IMG.fashion,\n  ["), "welcome no longer uses fashion as editorial thumb"],
  [welcome.includes("IMG.architecture"), "welcome editorial uses architecture"],
  [welcome.includes("IMG.product"), "welcome overlap uses product for second image"],
  [sectionLib.includes("limitPerCategory = 10"), "section library shows 10 per category"],
  [sectionLib.includes("assignCategoryThumbnail"), "unique thumbnail assignment exists"],
  [sectionLib.includes("nextUniqueFromPool"), "within-section image diversification exists"],
  [sectionLib.includes("writing") && sectionLib.includes("bookshelf"), "blog pool expanded"],
];

let failed = 0;
for (const [ok, label] of checks) {
  console.log(ok ? "OK" : "FAIL", "-", label);
  if (!ok) failed += 1;
}
process.exit(failed ? 1 : 0);
