/**
 * unique67 — leftover education curriculum/role chrome that was still
 * hardcoded in JSX (Mentora/Craftora) plus restaurant Closed hours.
 * Skip names, streets, Admin/Staff. Do not add ו׳ / א׳ / ש׳.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "ביקורת עמיתים": r(
    "Peer critique",
    "Crítica entre compañeros",
    "Crítica entre pares",
    "نقد الزملاء",
  ),
  חודש: r("month", "mes", "mês", "شهر"),
  קוד: r("Code", "Código", "Código", "كود"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique67.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique67 rows`);
