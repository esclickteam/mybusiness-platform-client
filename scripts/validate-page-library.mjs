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
