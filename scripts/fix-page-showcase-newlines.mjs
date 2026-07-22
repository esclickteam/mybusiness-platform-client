import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const dir = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "../src/components/site-builder/studio/visual-editor/library",
);

for (const file of fs.readdirSync(dir)) {
  if (!file.endsWith("PageShowcaseSections.ts")) continue;
  if (file === "aboutPageShowcaseSections.ts") continue;
  const full = path.join(dir, file);
  const before = fs.readFileSync(full, "utf8");
  // Convert accidental literal \\n sequences inside single-quoted strings to real \n escapes.
  const after = before.replace(/\\\\n/g, "\\n");
  if (after !== before) {
    fs.writeFileSync(full, after, "utf8");
    console.log("fixed", file);
  } else {
    console.log("ok", file);
  }
}
