/**
 * unique68 — remaining seed chrome after unique67 (Virello, Aura Yoga,
 * Nadlanist, Novastra, Seabloom, Skyhold, Soundline, Studiora).
 * Skip personal names, streets, cities, Admin/Staff.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const templates = join(here, "../src/components/site-builder/studio/data/templates");
const skyholdAbout = readFileSync(join(templates, "skyhold/defaultData.ts"), "utf8").match(/aboutTitle: "(.+)"/)[1];
const seabloomMassage = readFileSync(join(templates, "seabloom/defaultData.ts"), "utf8").match(/item2Text: "(.+)"/)[1];

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  // Virello
  פרינט: r("Print", "Print", "Print", "طباعة"),
  נובה: r("Nova", "Nova", "Nova", "نوفا"),
  פיקסל: r("Pixel", "Pixel", "Pixel", "بكسل"),
  מפתח: r("Developer", "Desarrollador", "Desenvolvedor", "مطوّر"),
  מעצב: r("Designer", "Diseñador", "Designer", "مصمم"),
  שנתי: r("Yearly", "Anual", "Anual", "سنوي"),

  // Aura Yoga / Soundline nav
  מורות: r("Teachers", "Profesoras", "Professoras", "معلمات"),
  מורים: r("Teachers", "Profesores", "Professores", "معلمون"),

  // Nadlanist
  שמאים: r("Appraisers", "Tasadores", "Avaliadores", "مثمّنون"),
  מוארת: r("Bright", "Luminosa", "Iluminada", "مضيئة"),
  קונה: r("Buyer", "Comprador", "Comprador", "مشترٍ"),

  // Novastra
  נדיר: r("Rare", "Raro", "Raro", "نادر"),
  סטייל: r("Style", "Estilo", "Estilo", "ستايل"),
  "לקוח, לונדון": r("Customer, London", "Cliente, Londres", "Cliente, Londres", "زبون، لندن"),
  "לקוחה, פריז": r("Customer, Paris", "Clienta, París", "Cliente, Paris", "زبونة، باريس"),
  "לקוח, מילאנו": r("Customer, Milan", "Cliente, Milán", "Cliente, Milão", "زبون، ميلانو"),

  [seabloomMassage]: r(
    "A massage with tropical oils.",
    "Un masaje con aceites tropicales.",
    "Uma massagem com óleos tropicais.",
    "مساج بزيوت استوائية.",
  ),
  [skyholdAbout]: r(
    "Height that changes perspective.",
    "Una altura que cambia la perspectiva.",
    "Uma altura que muda a perspectiva.",
    "ارتفاع يغيّر المنظور.",
  ),

  // Studiora gallery seed (saved customer site still wins)
  "UI/UX · מובייל": r("UI/UX · Mobile", "UI/UX · Móvil", "UI/UX · Mobile", "UI/UX · موبايل"),
  "מייסד, Pulse": r("Founder, Pulse", "Fundador, Pulse", "Fundador, Pulse", "مؤسس، Pulse"),
};

const out = join(here, "../src/i18n/templateExactLexicon.unique68.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique68 rows`);
