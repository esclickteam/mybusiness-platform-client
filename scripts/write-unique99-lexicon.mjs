/**
 * unique99 — next high-frequency section-variant/library chrome after unique98.
 * Skip personal names and place-only strings. Keep ₪ amounts unchanged.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import rows from "../src/i18n/templateExactLexicon.unique99.json" with { type: "json" };

const __dirname = dirname(fileURLToPath(import.meta.url));
const out = join(__dirname, "../src/i18n/templateExactLexicon.unique99.json");
writeFileSync(out, `${JSON.stringify(rows, null, 2)}\n`);
console.log(`Rewrote ${Object.keys(rows).length} unique99 rows -> ${out}`);
