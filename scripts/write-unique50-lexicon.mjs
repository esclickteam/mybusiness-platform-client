/**
 * unique50 — leftover Serenova/Justora contact labels, form chrome, and Justora LTR punctuation.
 * localizeBuiltInTemplateSeed walks these strings; saved visual data still wins.
 * Skip personal names, streets, cities, Admin/Staff, and quotation-only marks.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "כתובת המשרד": r("Office address", "Dirección del despacho", "Endereço do escritório", "عنوان المكتب"),
  "בחרו אפשרות": r("Choose an option", "Elegid una opción", "Escolham uma opção", "اختاروا خياراً"),
  "מה מעניין אותך?": r(
    "What interests you?",
    "¿Qué os interesa?",
    "O que interessa a vocês?",
    "ما الذي يهمكم؟",
  ),
  "סדנה / הרצאה": r("Workshop / lecture", "Taller / conferencia", "Oficina / palestra", "ورشة / محاضرة"),
  "כמה מילים על הצורך": r(
    "A few words about the need",
    "Unas palabras sobre la necesidad",
    "Algumas palavras sobre a necessidade",
    "كلمات قليلة عن الحاجة",
  ),
  "מה תרצו לשאול?": r(
    "What would you like to ask?",
    "¿Qué queréis preguntar?",
    "O que vocês querem perguntar?",
    "ماذا تريدون أن تسألوا؟",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique50.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique50 rows`);
