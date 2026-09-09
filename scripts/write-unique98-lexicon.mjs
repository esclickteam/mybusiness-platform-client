/**
 * unique98 — high-frequency section-variant / library chrome after unique97.
 * Skip personal names. Keep ₪ amounts unchanged when present.
 * Source of truth: src/i18n/templateExactLexicon.unique98.json
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import rows from "../src/i18n/templateExactLexicon.unique98.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "../src/i18n/templateExactLexicon.unique98.json");
writeFileSync(out, `${JSON.stringify(rows, null, 2)}\n`);
console.log(`Rewrote ${Object.keys(rows).length} unique98 rows -> ${out}`);
