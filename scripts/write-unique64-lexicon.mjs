/**
 * unique64 — leftover Lumenware through Jewelis store product chrome.
 * Skip personal names (יואב מ.), streets, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  מעבדה: r("Lab", "Laboratorio", "Laboratório", "مختبر"),
  "סטודיו לומן": r("Lumen studio", "Estudio Lumen", "Estúdio Lumen", "استوديو لومن"),
  "רמקול Orbit": r("Orbit speaker", "Altavoz Orbit", "Caixa Orbit", "سماعة Orbit"),
  "נורה חכמה Halo": r("Halo smart bulb", "Bombilla inteligente Halo", "Lâmpada inteligente Halo", "لمبة Halo الذكية"),
  "לפטופ Nova 14": r("Nova 14 laptop", "Portátil Nova 14", "Notebook Nova 14", "لابتوب Nova 14"),
  "מטען Turbo 65W": r("Turbo 65W charger", "Cargador Turbo 65W", "Carregador Turbo 65W", "شاحن Turbo 65W"),
  "עכבר Flux": r("Flux mouse", "Ratón Flux", "Mouse Flux", "فأرة Flux"),
  "מקלדת Mech Pro": r("Mech Pro keyboard", "Teclado Mech Pro", "Teclado Mech Pro", "لوحة Mech Pro"),
  "בננות Fair": r("Fair bananas", "Plátanos Fair", "Bananas Fair", "موز Fair"),
  "דבש בר": r("Wild honey", "Miel silvestre", "Mel silvestre", "عسل بري"),
  "נעלי ריצה Volt": r("Volt running shoes", "Zapatillas Volt", "Tênis Volt", "حذاء جري Volt"),
  "טייץ Performance": r("Performance tights", "Mallas Performance", "Legging Performance", "ليقنز Performance"),
  "חולצת Dry-Fit": r("Dry-Fit shirt", "Camiseta Dry-Fit", "Camiseta Dry-Fit", "قميص Dry-Fit"),
  "בקבוק Thermo": r("Thermo bottle", "Botella Thermo", "Garrafa Thermo", "زجاجة Thermo"),
  "מזרן יוגה Pro": r("Pro yoga mat", "Esterilla Pro", "Tapete Pro", "حصيرة يوغا Pro"),
  ערכות: r("Kits", "Kits", "Kits", "أطقم"),
  "רעשן עץ": r("A wooden rattle", "Un sonajero de madera", "Um chocalho de madeira", "خشخيشة خشب"),
  "ספה Nova": r("Nova sofa", "Sofá Nova", "Sofá Nova", "أريكة Nova"),
  "שולחן צד Oak": r("Oak side table", "Mesa auxiliar Oak", "Mesa lateral Oak", "طاولة جانبية Oak"),
  להקות: r("Bands", "Bandas", "Bandas", "أربطة"),
  מדפים: r("Shelves", "Estantes", "Prateleiras", "رفوف"),
  "עט נובע": r("A fountain pen", "Una pluma estilográfica", "Uma caneta-tinteiro", "قلم حبر"),
  גלוס: r("Gloss", "Brillo", "Gloss", "ملمّع"),
  "שפתון Soft Matte": r("Soft Matte lipstick", "Labial Soft Matte", "Batom Soft Matte", "أحمر شفاه Soft Matte"),
  "מברשת איפור": r("A makeup brush", "Una brocha de maquillaje", "Um pincel de maquiagem", "فرشاة مكياج"),
  "מקדחה Brushless": r("Brushless drill", "Taladro Brushless", "Furadeira Brushless", "مثقاب Brushless"),
  "טבעת Aura": r("Aura ring", "Anillo Aura", "Anel Aura", "خاتم Aura"),
  "שרשרת Pearl": r("Pearl necklace", "Collar Pearl", "Colar Pearl", "عقد Pearl"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique64.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique64 rows`);
