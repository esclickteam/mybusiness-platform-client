/**
 * unique63 — override phrasebook smash for Dunewave seed lines that
 * already drop Hebrew but read as word-by-word English.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "מרפסת פרטית עם נוף לים פתוח.": r(
    "A private balcony with an open sea view.",
    "Una terraza privada con vista abierta al mar.",
    "Uma varanda privada com vista aberta para o mar.",
    "شرفة خاصة بإطلالة مفتوحة على البحر.",
  ),
  "גישה ישירה לשביל החול.": r(
    "Direct access to the sand path.",
    "Acceso directo al camino de arena.",
    "Acesso direto à trilha de areia.",
    "وصول مباشر إلى ممر الرمل.",
  ),
  "מיטת שיזוף פרטית וארוחת בוקר בחול.": r(
    "A private sunbed and breakfast on the sand.",
    "Una tumbona privada y desayuno en la arena.",
    "Uma espreguiçadeira privada e café da manhã na areia.",
    "كرسي تشمس خاص وفطور على الرمل.",
  ),
  "וילת דיונות": r("A dunes villa", "Una villa de dunas", "Uma vila nas dunas", "فيلا كثبان"),
  "סוויטת חול": r("A sand suite", "Una suite de arena", "Uma suíte de areia", "جناح رمل"),
  "בונגלו שקיעה": r("A sunset bungalow", "Un bungaló de atardecer", "Um bangalô de pôr do sol", "بنغالو غروب"),
  "4 אורחים · בריכה": r("4 guests · pool", "4 huéspedes · piscina", "4 hóspedes · piscina", "4 ضيوف · بركة"),
  "6 אורחים · ג'קוזי": r("6 guests · jacuzzi", "6 huéspedes · jacuzzi", "6 hóspedes · jacuzzi", "6 ضيوف · جاكوزي"),
  "2 אורחים · טרסה": r("2 guests · terrace", "2 huéspedes · terraza", "2 hóspedes · terraço", "2 ضيوف · تراس"),
  "איפה שהשקט הוא יוקרה.": r(
    "Where quiet is the luxury.",
    "Donde el silencio es el lujo.",
    "Onde o silêncio é o luxo.",
    "حيث الهدوء هو الفخامة.",
  ),
  "מתי אתם מגיעים?": r(
    "When are you arriving?",
    "¿Cuándo llegáis?",
    "Quando vocês chegam?",
    "متى تصلون؟",
  ),
  "ספרו תאריכים ומספר אורחים — נחזור עם זמינות וחבילה מותאמת.": r(
    "Tell us dates and guest count — we'll come back with availability and a tailored package.",
    "Contadnos fechas y número de huéspedes — volveremos con disponibilidad y un pack a medida.",
    "Contem datas e número de hóspedes — voltamos com disponibilidade e um pacote sob medida.",
    "أخبرونا بالتواريخ وعدد الضيوف — نعود بتوافر وباقة مكيّفة.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique63.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique63 rows`);
