/**
 * unique91 — leftover section-picker variant badges after unique90.
 * Short exact keys only; they match badge chrome, not one-letter day shorthands.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  הפוך: r("Reversed", "Invertido", "Invertido", "معكوس"),
  חזון: r("Vision", "Visión", "Visão", "رؤية"),
  לוגואים: r("Logos", "Logos", "Logos", "شعارات"),
  מחלקות: r("Departments", "Departamentos", "Departamentos", "أقسام"),
  קלאסי: r("Classic", "Clásico", "Clássico", "كلاسيكي"),
  קצר: r("Short", "Corto", "Curto", "قصير"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique91.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique91 rows`);
