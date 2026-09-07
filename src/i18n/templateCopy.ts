import i18n from "./i18n";
import { getHtmlLang, getTextDirection, normalizeLanguage } from "./languages";
import { resolveTemplateLanguage } from "./templateDir";
import phrasebook from "./templateSeedPhrasebook.json";
import generatedExactLexicon from "./templateExactLexicon.generated.json";
import studioExactLexicon from "./templateExactLexicon.studio.json";
import storeExactLexicon from "./templateExactLexicon.store.json";
import sharedExactLexicon from "./templateExactLexicon.shared.json";
import heroesExactLexicon from "./templateExactLexicon.heroes.json";
import beautyExactLexicon from "./templateExactLexicon.beauty.json";
import bodyExactLexicon from "./templateExactLexicon.body.json";
import galleryExactLexicon from "./templateExactLexicon.gallery.json";
import catalogExactLexicon from "./templateExactLexicon.catalog.json";
import moreExactLexicon from "./templateExactLexicon.more.json";
import uniqueExactLexicon from "./templateExactLexicon.unique.json";
import unique2ExactLexicon from "./templateExactLexicon.unique2.json";
import unique3ExactLexicon from "./templateExactLexicon.unique3.json";
import unique4ExactLexicon from "./templateExactLexicon.unique4.json";
import unique5ExactLexicon from "./templateExactLexicon.unique5.json";
import unique6ExactLexicon from "./templateExactLexicon.unique6.json";
import unique7ExactLexicon from "./templateExactLexicon.unique7.json";
import unique8ExactLexicon from "./templateExactLexicon.unique8.json";
import unique9ExactLexicon from "./templateExactLexicon.unique9.json";
import unique10ExactLexicon from "./templateExactLexicon.unique10.json";
import unique11ExactLexicon from "./templateExactLexicon.unique11.json";
import unique12ExactLexicon from "./templateExactLexicon.unique12.json";
import unique13ExactLexicon from "./templateExactLexicon.unique13.json";
import unique14ExactLexicon from "./templateExactLexicon.unique14.json";
import unique15ExactLexicon from "./templateExactLexicon.unique15.json";
import unique16ExactLexicon from "./templateExactLexicon.unique16.json";
import unique17ExactLexicon from "./templateExactLexicon.unique17.json";
import unique18ExactLexicon from "./templateExactLexicon.unique18.json";
import unique19ExactLexicon from "./templateExactLexicon.unique19.json";
import unique20ExactLexicon from "./templateExactLexicon.unique20.json";
import unique21ExactLexicon from "./templateExactLexicon.unique21.json";
import unique22ExactLexicon from "./templateExactLexicon.unique22.json";
import unique23ExactLexicon from "./templateExactLexicon.unique23.json";
import unique24ExactLexicon from "./templateExactLexicon.unique24.json";
import unique25ExactLexicon from "./templateExactLexicon.unique25.json";
import unique26ExactLexicon from "./templateExactLexicon.unique26.json";
import unique27ExactLexicon from "./templateExactLexicon.unique27.json";
import unique28ExactLexicon from "./templateExactLexicon.unique28.json";
import unique29ExactLexicon from "./templateExactLexicon.unique29.json";
import unique30ExactLexicon from "./templateExactLexicon.unique30.json";
import unique31ExactLexicon from "./templateExactLexicon.unique31.json";
import unique32ExactLexicon from "./templateExactLexicon.unique32.json";
import unique33ExactLexicon from "./templateExactLexicon.unique33.json";
import unique34ExactLexicon from "./templateExactLexicon.unique34.json";
import unique35ExactLexicon from "./templateExactLexicon.unique35.json";
import unique36ExactLexicon from "./templateExactLexicon.unique36.json";
import unique37ExactLexicon from "./templateExactLexicon.unique37.json";
import unique38ExactLexicon from "./templateExactLexicon.unique38.json";
import unique39ExactLexicon from "./templateExactLexicon.unique39.json";
import unique40ExactLexicon from "./templateExactLexicon.unique40.json";
import unique41ExactLexicon from "./templateExactLexicon.unique41.json";
import unique42ExactLexicon from "./templateExactLexicon.unique42.json";
import unique43ExactLexicon from "./templateExactLexicon.unique43.json";
import unique44ExactLexicon from "./templateExactLexicon.unique44.json";
import unique45ExactLexicon from "./templateExactLexicon.unique45.json";
import unique46ExactLexicon from "./templateExactLexicon.unique46.json";
import unique47ExactLexicon from "./templateExactLexicon.unique47.json";
import unique48ExactLexicon from "./templateExactLexicon.unique48.json";
import unique49ExactLexicon from "./templateExactLexicon.unique49.json";
import unique50ExactLexicon from "./templateExactLexicon.unique50.json";
import unique51ExactLexicon from "./templateExactLexicon.unique51.json";
import unique52ExactLexicon from "./templateExactLexicon.unique52.json";
import unique53ExactLexicon from "./templateExactLexicon.unique53.json";
import unique54ExactLexicon from "./templateExactLexicon.unique54.json";
import unique55ExactLexicon from "./templateExactLexicon.unique55.json";
import unique56ExactLexicon from "./templateExactLexicon.unique56.json";
import unique57ExactLexicon from "./templateExactLexicon.unique57.json";
import unique58ExactLexicon from "./templateExactLexicon.unique58.json";
import unique59ExactLexicon from "./templateExactLexicon.unique59.json";
import unique60ExactLexicon from "./templateExactLexicon.unique60.json";
import unique61ExactLexicon from "./templateExactLexicon.unique61.json";
import unique62ExactLexicon from "./templateExactLexicon.unique62.json";
import unique63ExactLexicon from "./templateExactLexicon.unique63.json";
import unique64ExactLexicon from "./templateExactLexicon.unique64.json";
import unique65ExactLexicon from "./templateExactLexicon.unique65.json";
import unique66ExactLexicon from "./templateExactLexicon.unique66.json";
import unique67ExactLexicon from "./templateExactLexicon.unique67.json";
import { TEMPLATE_EXACT_LEXICON, type LocaleCopy } from "./templateExactLexicon";

type PhraseTranslation = {
  en?: string;
  es?: string;
  "pt-BR"?: string;
  ar?: string;
};

const book = phrasebook as Record<string, PhraseTranslation>;
const HE = /[\u0590-\u05FF]/;

/** Generated rows first; studio chrome next; hand-written lexicon always wins. */
const EXACT_LEXICON: Record<string, PhraseTranslation | LocaleCopy> = {
  ...(generatedExactLexicon as Record<string, PhraseTranslation>),
  ...(studioExactLexicon as Record<string, PhraseTranslation>),
  ...(storeExactLexicon as Record<string, PhraseTranslation>),
  ...(sharedExactLexicon as Record<string, PhraseTranslation>),
  ...(heroesExactLexicon as Record<string, PhraseTranslation>),
  ...(beautyExactLexicon as Record<string, PhraseTranslation>),
  ...(bodyExactLexicon as Record<string, PhraseTranslation>),
  ...(galleryExactLexicon as Record<string, PhraseTranslation>),
  ...(catalogExactLexicon as Record<string, PhraseTranslation>),
  ...(moreExactLexicon as Record<string, PhraseTranslation>),
  ...(uniqueExactLexicon as Record<string, PhraseTranslation>),
  ...(unique2ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique3ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique4ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique5ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique6ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique7ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique8ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique9ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique10ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique11ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique12ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique13ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique14ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique15ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique16ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique17ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique18ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique19ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique20ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique21ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique22ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique23ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique24ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique25ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique26ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique27ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique28ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique29ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique30ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique31ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique32ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique33ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique34ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique35ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique36ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique37ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique38ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique39ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique40ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique41ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique42ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique43ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique44ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique45ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique46ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique47ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique48ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique49ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique50ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique51ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique52ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique53ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique54ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique55ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique56ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique57ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique58ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique59ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique60ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique61ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique62ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique63ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique64ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique65ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique66ExactLexicon as Record<string, PhraseTranslation>),
  ...(unique67ExactLexicon as Record<string, PhraseTranslation>),
  ...TEMPLATE_EXACT_LEXICON,
};

function localeKey(language?: string): "he" | "en" | "es" | "pt-BR" | "ar" {
  const normalized = normalizeLanguage(resolveTemplateLanguage(language) || i18n.language);
  if (normalized === "he") return "he";
  if (normalized === "pt-BR") return "pt-BR";
  if (normalized === "es" || normalized === "ar" || normalized === "en") {
    return normalized;
  }
  return "en";
}

function hebrewScore(value: string): number {
  return (String(value || "").match(/[\u0590-\u05FF]/g) || []).length;
}

function pickLocaleCopy(entry: PhraseTranslation | LocaleCopy | undefined, locale: string): string {
  if (!entry) return "";
  if (locale === "pt-BR") return entry["pt-BR"] || entry.en || "";
  if (locale === "es") return entry.es || entry.en || "";
  if (locale === "ar") return entry.ar || entry.en || "";
  return entry.en || "";
}

const CATALOG_PRODUCT_RE = /^מוצר (.+) מתוך קטלוג (.+)\.$/;
const CATALOG_CATEGORY: Record<string, PhraseTranslation> = {
  אביזרים: { en: "accessories", es: "accesorios", "pt-BR": "acessórios", ar: "إكسسوارات" },
  דקור: { en: "decor", es: "decoración", "pt-BR": "decoração", ar: "ديكور" },
  "סמארט הום": { en: "smart home", es: "hogar inteligente", "pt-BR": "casa inteligente", ar: "منزل ذكي" },
  צעצועים: { en: "toys", es: "juguetes", "pt-BR": "brinquedos", ar: "ألعاب" },
  ממרחים: { en: "spreads", es: "untables", "pt-BR": "pastas", ar: "دهون" },
  טקסטיל: { en: "textiles", es: "textiles", "pt-BR": "têxteis", ar: "منسوجات" },
  רהיטים: { en: "furniture", es: "muebles", "pt-BR": "móveis", ar: "أثاث" },
  טיולים: { en: "travel", es: "viajes", "pt-BR": "viagens", ar: "سفر" },
  מחברות: { en: "notebooks", es: "cuadernos", "pt-BR": "cadernos", ar: "دفاتر" },
  ירקות: { en: "vegetables", es: "verduras", "pt-BR": "legumes", ar: "خضار" },
  פירות: { en: "fruit", es: "frutas", "pt-BR": "frutas", ar: "فاكهة" },
  דגנים: { en: "grains", es: "cereales", "pt-BR": "cereais", ar: "حبوب" },
  שרשראות: { en: "necklaces", es: "collares", "pt-BR": "colares", ar: "قلائد" },
  אודיו: { en: "audio", es: "audio", "pt-BR": "áudio", ar: "صوت" },
  ביגוד: { en: "apparel", es: "ropa", "pt-BR": "roupa", ar: "ملابس" },
  ידניים: { en: "hand tools", es: "herramientas manuales", "pt-BR": "ferramentas manuais", ar: "أدوات يدوية" },
  בטיחות: { en: "safety", es: "seguridad", "pt-BR": "segurança", ar: "سلامة" },
  ספרות: { en: "literature", es: "literatura", "pt-BR": "literatura", ar: "أدب" },
  ילדים: { en: "kids", es: "infantil", "pt-BR": "infantil", ar: "أطفال" },
  כתיבה: { en: "writing", es: "escritura", "pt-BR": "escrita", ar: "كتابة" },
  עגילים: { en: "earrings", es: "pendientes", "pt-BR": "brincos", ar: "أقراط" },
  שעונים: { en: "watches", es: "relojes", "pt-BR": "relógios", ar: "ساعات" },
  אחסון: { en: "storage", es: "almacenaje", "pt-BR": "armazenamento", ar: "تخزين" },
  טיפוח: { en: "care", es: "cuidado", "pt-BR": "cuidado", ar: "عناية" },
  איפור: { en: "makeup", es: "maquillaje", "pt-BR": "maquiagem", ar: "مكياج" },
  טבעות: { en: "rings", es: "anillos", "pt-BR": "anéis", ar: "خواتم" },
  חשמל: { en: "electrical", es: "electricidad", "pt-BR": "elétrica", ar: "كهرباء" },
  חדר: { en: "room", es: "habitación", "pt-BR": "quarto", ar: "غرفة" },
  שיער: { en: "hair", es: "cabello", "pt-BR": "cabelo", ar: "شعر" },
  מיטות: { en: "beds", es: "camas", "pt-BR": "camas", ar: "أسرّة" },
  תכשיטים: { en: "jewelry", es: "joyería", "pt-BR": "joias", ar: "مجوهرات" },
  "הלבשת בית": { en: "homewear", es: "ropa de casa", "pt-BR": "roupa de casa", ar: "ملابس منزلية" },
  "פארם וטיפוח": { en: "pharmacy and care", es: "farmacia y cuidado", "pt-BR": "farmácia e cuidado", ar: "صيدلية وعناية" },
  "צמחים ומשתלה": { en: "plants and nursery", es: "plantas y vivero", "pt-BR": "plantas e viveiro", ar: "نباتات ومشتل" },
  "ג׳ינס וסטרית": { en: "denim and street", es: "denim y street", "pt-BR": "jeans e street", ar: "دينم وستريت" },
  "סניקרס וסטריטוור": { en: "sneakers and streetwear", es: "sneakers y streetwear", "pt-BR": "tênis e streetwear", ar: "سنيكرز وستريتوير" },
  "יקב ויינות": { en: "winery and wines", es: "bodega y vinos", "pt-BR": "vinícola e vinhos", ar: "كرم ونبيذ" },
  "טקסטיל לבית": { en: "home textiles", es: "textiles para el hogar", "pt-BR": "têxteis para casa", ar: "منسوجات للمنزل" },
  "קפה ספיישלטי": { en: "specialty coffee", es: "café de especialidad", "pt-BR": "café especial", ar: "قهوة مختصة" },
  "נרות וריחות": { en: "candles and scents", es: "velas y aromas", "pt-BR": "velas e aromas", ar: "شموع وعطور" },
  נעליים: { en: "shoes", es: "zapatos", "pt-BR": "sapatos", ar: "أحذية" },
  "מוצרי בית": { en: "home goods", es: "artículos del hogar", "pt-BR": "artigos para casa", ar: "مستلزمات المنزل" },
  "ויטמינים ותוספים": { en: "vitamins and supplements", es: "vitaminas y complementos", "pt-BR": "vitaminas e suplementos", ar: "فيتامينات ومكملات" },
  "מטבח וכלי בישול": { en: "kitchen and cookware", es: "cocina y utensilios", "pt-BR": "cozinha e utensílios", ar: "مطبخ وأدوات طبخ" },
  "טיולים וקמפינג": { en: "travel and camping", es: "viajes y camping", "pt-BR": "viagens e camping", ar: "سفر وتخييم" },
  "אופניים וציוד רכיבה": { en: "bikes and riding gear", es: "bicicletas y equipo", "pt-BR": "bicicletas e equipamento", ar: "دراجات ومعدات ركوب" },
  "בגדים ואופנה": { en: "apparel and fashion", es: "ropa y moda", "pt-BR": "roupa e moda", ar: "ملابس وأزياء" },
  "צעצועים ומשחקים": { en: "toys and games", es: "juguetes y juegos", "pt-BR": "brinquedos e jogos", ar: "ألعاب" },
  "תיקים ואקססוריז": { en: "bags and accessories", es: "bolsos y accesorios", "pt-BR": "bolsas e acessórios", ar: "حقائب وإكسسوارات" },
  "אודיו וסאונד": { en: "audio and sound", es: "audio y sonido", "pt-BR": "áudio e som", ar: "صوت" },
  לפטופים: { en: "laptops", es: "portátiles", "pt-BR": "laptops", ar: "حواسيب محمولة" },
  משקולות: { en: "weights", es: "pesas", "pt-BR": "pesos", ar: "أوزان" },
  סניקרס: { en: "sneakers", es: "sneakers", "pt-BR": "tênis", ar: "سنيكرز" },
  תאורה: { en: "lighting", es: "iluminación", "pt-BR": "iluminação", ar: "إضاءة" },
};

const NAMED_CATALOG_RE = /^(.+) מתוך קטלוג ([A-Za-z][\w.-]*) — (.+)\.$/;
const STORE_ADDON_RE = /^([A-Za-z][\w.-]*) · (.+) · מוצרים מתוסף החנות$/;
const STORY_OF_BRAND_RE = /^הסיפור של ([A-Za-z][\w.-]*)\.$/;
const AGENCY_SITE_COLON_RE =
  /^אתר מלא לסוכנות (.+): 8 עמודים, תנועה, אפקטים ועיצוב (.+)\.$/;
const AGENCY_SITE_DASH_RE =
  /^אתר מלא לסוכנות (.+) עם 8 עמודים, תנועה ואפקטים — (.+)\.$/;
const STORE_SITE_COLON_RE =
  /^חנות (.+) מלאה: 8 עמודים, קטגוריות, סינונים, סל ומוצרים מתוסף החנות\.$/;
const STORE_SITE_DASH_RE =
  /^חנות (.+) מלאה עם 8 עמודים, סינונים ומוצרים מתוסף החנות\.$/;
const STORE_SITE_PAGES_RE =
  /^חנות (.+) מלאה עם עמודים, תתי[־-]עמודים, קטגוריות וסינונים — מחוברת לתוסף החנות\.$/;
const STORE_BUILD_RE =
  /^אנחנו בונים חנות (.+) שמכבדת גם עיצוב וגם תפעול: קטגוריות, סינונים, עמודי מוצר וסל — והכול מחובר לתוסף החנות\.$/;
const BEAUTY_PROTOCOL_RE =
  /^(.+?)\s+כולל אבחון קצר, התאמה אישית, עבודה מדויקת והמלצות המשך כתובות כדי שהתוצאה תישאר יפה גם אחרי היציאה מהסטודיו\.$/;
const FOOD_TEAM_RE =
  /^(.+?)\s+מאחורי כל מנה עומד צוות שמכיר את חומרי הגלם בשמם, בונה הכנות מוקדמות בקצב יומי ושומר על אירוח חם מהרגע שנכנסים ועד הקינוח האחרון\.$/;
const STORE_BUILT_LARGE_RE =
  /^([A-Za-z][\w.-]*) נבנתה כחנות גדולה עם עשרות סקשנים, עמודי תוכן וחיבור מלא לתוסף החנות של Bizuply\.$/;
const AGENCY_CLOSE_RE =
  /^צוות סוכנות (.+) שעובד צמוד ללקוח: אבחון, תכנון, ביצוע ומדידה — בלי רעש מיותר\.$/;
const STORE_EXPERIENCE_RE = /^([A-Za-z][\w.-]*) — (.+) עם חוויית חנות מלאה\.$/;
const STORE_POWERED_RE = /^([A-Za-z][\w.-]*) · (.+) · Powered by Bizuply$/;
const PROJECT_CODE_RE = /^פרויקט (Alpha|Beta|Gamma)$/;
const HEBREW_DATE_RE = /^(\d{1,2})\s*(?:ב)?([א-ת׳']+)\s*,?\s*(\d{4})$/;
const MONTH_YEAR_RE = /^([א-ת׳']+)\s+(\d{4})$/;
const WEEKDAY_TIME_RE = /^(ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)\s+(\d{1,2}:\d{2})$/;
const DURATION_RE = /^(\d+)\s*(דק׳|דקות|ש׳|שעות)$/;
const DURATION_STUCK_RE = /^(\d+)(ד׳|ש׳)$/;
const FROM_PRICE_RE = /^החל מ[־\-]?₪([\d,]+)(?:\s+(.+))?$/;
const FROM_SHEKEL_RE = /^החל מ-(\d+)\s*ש״ח$/;
const READ_TIME_RE = /^(\d+)\s*דק׳ קריאה · (.+)$/;
const ROOM_COUNT_RE = /^(\d+)\s*(?:חד[׳']|חדרים)\s*·\s*(.+)$/;
const SQM_DOT_RE = /^(\d+)\s*מ״ר · (.+)$/;
const GUESTS_DOT_RE = /^(\d+)\s*אורחים · (.+)$/;
const DURATION_DOT_PREFIX_RE = /^(\d+)\s*דק׳ · (.+)$/;
const DURATION_DOT_LABEL_RE = /^(.+) · (\d+)\s*דק׳$/;
const SESSION_SLASH_RE = /^(.+) \/ (\d+)\s*דק׳$/;
const BURGER_SMASH_RE = /^(.+) — לחמנייה, בשר, גבינה — בלי פילוסופיה\.$/;
const AGENCY_SHARP_RE = /^([A-Za-z][\w.-]*) — סוכנות (.+) עם תהליך חד ותוצאות מדידות\.$/;
const INDEXED_LABEL_RE = /^(.+?)\s+(\d+(?:\.\d+)?)$/;
const NUMBERED_DASH_RE = /^(.+?)\s+(\d+)\s+-\s+(.+)$/;
const STORE_SHOPPING_RE = /^([A-Za-z][\w.-]*) — (.+) עם חוויית קנייה מלאה\.$/;
const SOIL_TO_PLATE_RE = /^(.+) — מהאדמה לצלחת — בלי פשרות על טעם\.$/;
const AGENCY_SIGNATURE_RE = /^([A-Za-z][\w.-]*) — סוכנות (.+) עם חתימת (.+)$/;
const STEAM_BASKET_RE = /^(.+) — הקיטור מרים — הסל יורד לשולחן\.$/;
const FRESH_DOUGH_RE = /^(.+) — הבצק טרי — הרטב מספר סיפור\.$/;
const SUGAR_INGREDIENT_RE = /^(.+) — סוכר כחומר גלם — לא רק מתיקות\.$/;
const LOW_SMOKE_RE = /^(.+) — עשן נמוך, חום ארוך, טעם עמוק\.$/;
const SEA_PLATE_RE = /^(.+) — הים מגיע לצלחת — בלי עיכובים\.$/;
const SPIT_TASTE_RE = /^(.+) — השיפוד מסתובב — הטעם נשאר\.$/;
const BOWL_PATH_RE = /^(.+) — כל קערה היא מסלול טעמים\.$/;
const JUICE_NOW_RE = /^(.+) — סחוט עכשיו — נשתייה מיד\.$/;
const MELT_EXPERIENCE_RE = /^(.+) — ההמסה היא חלק מהחוויה\.$/;
const PERFECT_DISH_RE = /^המנה של (.+) הייתה מושלמת\.$/;
const KNOW_ALL_RE = /^(.+) — כל מה שצריך לדעת\.$/;
const INGREDIENT_FIT_RE = /^חומרי גלם שמתאימים ל(.+)$/;
const BEHIND_SCENES_RE = /^(.+) — מאחורי הקלעים\.$/;
const PRICE_DOT_RE = /^₪(\d+) · (.+)$/;
const UNIT_COUNT_RE = /^(\d+)\s*יח׳$/;
const WEEK_RANGE_RE = /^שבוע (\d+)[-–](\d+)$/;

const HEBREW_WEEKDAYS: Record<string, PhraseTranslation> = {
  ראשון: { en: "Sunday", es: "domingo", "pt-BR": "domingo", ar: "الأحد" },
  שני: { en: "Monday", es: "lunes", "pt-BR": "segunda-feira", ar: "الاثنين" },
  שלישי: { en: "Tuesday", es: "martes", "pt-BR": "terça-feira", ar: "الثلاثاء" },
  רביעי: { en: "Wednesday", es: "miércoles", "pt-BR": "quarta-feira", ar: "الأربعاء" },
  חמישי: { en: "Thursday", es: "jueves", "pt-BR": "quinta-feira", ar: "الخميس" },
  שישי: { en: "Friday", es: "viernes", "pt-BR": "sexta-feira", ar: "الجمعة" },
  שבת: { en: "Saturday", es: "sábado", "pt-BR": "sábado", ar: "السبت" },
};

const INDEXED_LABELS: Record<string, PhraseTranslation> = {
  "כותרת שירות": { en: "Service title", es: "Título del servicio", "pt-BR": "Título do serviço", ar: "عنوان الخدمة" },
  שאלה: { en: "Question", es: "Pregunta", "pt-BR": "Pergunta", ar: "سؤال" },
  שפה: { en: "Language", es: "Idioma", "pt-BR": "Idioma", ar: "لغة" },
  מוצר: { en: "Product", es: "Producto", "pt-BR": "Produto", ar: "منتج" },
  המלצה: { en: "Testimonial", es: "Testimonio", "pt-BR": "Depoimento", ar: "شهادة" },
  "שם מוצר": { en: "Product name", es: "Nombre del producto", "pt-BR": "Nome do produto", ar: "اسم المنتج" },
  "כותרת שלב": { en: "Step title", es: "Título del paso", "pt-BR": "Título da etapa", ar: "عنوان الخطوة" },
  "קישור ניווט": { en: "Nav link", es: "Enlace de navegación", "pt-BR": "Link de navegação", ar: "رابط التنقل" },
  "טקסט עמוד": { en: "Page text", es: "Texto de página", "pt-BR": "Texto da página", ar: "نص الصفحة" },
  תשובה: { en: "Answer", es: "Respuesta", "pt-BR": "Resposta", ar: "إجابة" },
  "כותרת עמוד": { en: "Page title", es: "Título de página", "pt-BR": "Título da página", ar: "عنوان الصفحة" },
  "אייברו עמוד": { en: "Page eyebrow", es: "Cejilla de página", "pt-BR": "Olho da página", ar: "عنوان فرعي للصفحة" },
  "שם ממליץ": { en: "Reviewer name", es: "Nombre del recomendante", "pt-BR": "Nome de quem recomenda", ar: "اسم المُوصي" },
  "שם חבילה": { en: "Package name", es: "Nombre del paquete", "pt-BR": "Nome do pacote", ar: "اسم الباقة" },
  "תג תובנה": { en: "Insight tag", es: "Etiqueta de insight", "pt-BR": "Tag de insight", ar: "وسم رؤية" },
  "תיאור שלב": { en: "Step description", es: "Descripción del paso", "pt-BR": "Descrição da etapa", ar: "وصف الخطوة" },
  "כותרת עליונה הירו": { en: "Hero top title", es: "Título superior del hero", "pt-BR": "Título superior do hero", ar: "عنوان أعلى الهيرو" },
  "אייברו הירו": { en: "Hero eyebrow", es: "Cejilla del hero", "pt-BR": "Olho do hero", ar: "عنوان فرعي للهيرو" },
  "שם המשרד": { en: "Firm name", es: "Nombre del despacho", "pt-BR": "Nome do escritório", ar: "اسم المكتب" },
  "שם המרפאה": { en: "Clinic name", es: "Nombre de la clínica", "pt-BR": "Nome da clínica", ar: "اسم العيادة" },
  "כותרת תחומי עיסוק": { en: "Practice areas title", es: "Título de áreas de práctica", "pt-BR": "Título das áreas de atuação", ar: "عنوان مجالات العمل" },
  "כותרת הצלחות": { en: "Wins title", es: "Título de éxitos", "pt-BR": "Título das vitórias", ar: "عنوان النجاحات" },
  "כותרת טיפולים": { en: "Treatments title", es: "Título de tratamientos", "pt-BR": "Título dos tratamentos", ar: "عنوان العلاجات" },
  "טקסט קביעת תור": { en: "Booking text", es: "Texto de cita", "pt-BR": "Texto de agendamento", ar: "نص حجز الموعد" },
  "סוג פروיקט": { en: "Project type", es: "Tipo de proyecto", "pt-BR": "Tipo de projeto", ar: "نوع المشروع" },
  "שדה סוג פרויקט": { en: "Project type field", es: "Campo de tipo de proyecto", "pt-BR": "Campo de tipo de projeto", ar: "حقل نوع المشروع" },
  "תחום ייעוץ": { en: "Advisory field", es: "Área de consultoría", "pt-BR": "Área de consultoria", ar: "مجال الاستشارة" },
  "שדה תחום ייעוץ": { en: "Advisory field input", es: "Campo de área de consultoría", "pt-BR": "Campo de área de consultoria", ar: "حقل مجال الاستشارة" },
  "כפתור פרויקטים בפוטר": { en: "Footer projects button", es: "Botón de proyectos del pie", "pt-BR": "Botão de projetos do rodapé", ar: "زر المشاريع في التذييل" },
  "כפתור שירותים בפוטר": { en: "Footer services button", es: "Botón de servicios del pie", "pt-BR": "Botão de serviços do rodapé", ar: "زر الخدمات في التذييل" },
  "מחיר מוצר": { en: "Product price", es: "Precio del producto", "pt-BR": "Preço do produto", ar: "سعر المنتج" },
  "תג פרויקט": { en: "Project tag", es: "Etiqueta de proyecto", "pt-BR": "Tag de projeto", ar: "وسم المشروع" },
  "חבילת מחיר": { en: "Price package", es: "Paquete de precio", "pt-BR": "Pacote de preço", ar: "باقة سعر" },
  "מחיר חבילה": { en: "Package price", es: "Precio del paquete", "pt-BR": "Preço do pacote", ar: "سعر الباقة" },
  "טקסט שירות": { en: "Service text", es: "Texto del servicio", "pt-BR": "Texto do serviço", ar: "نص الخدمة" },
  "תמונת מוצר": { en: "Product image", es: "Imagen del producto", "pt-BR": "Imagem do produto", ar: "صورة المنتج" },
  "מדיה מרחפת": { en: "Hover media", es: "Media al pasar", "pt-BR": "Mídia ao passar", ar: "وسائط عند التمرير" },
  "טקסט תובנה": { en: "Insight text", es: "Texto de insight", "pt-BR": "Texto de insight", ar: "نص الرؤية" },
  "כרטיס שירות": { en: "Service card", es: "Tarjeta de servicio", "pt-BR": "Cartão de serviço", ar: "بطاقة الخدمة" },
  "תיאור שירות": { en: "Service description", es: "Descripción del servicio", "pt-BR": "Descrição do serviço", ar: "وصف الخدمة" },
  "כפתור שירות": { en: "Service button", es: "Botón del servicio", "pt-BR": "Botão do serviço", ar: "زر الخدمة" },
  "תיאור חבילה": { en: "Package description", es: "Descripción del paquete", "pt-BR": "Descrição do pacote", ar: "وصف الباقة" },
  "קישור תחתון": { en: "Footer link", es: "Enlace de pie", "pt-BR": "Link do rodapé", ar: "رابط التذييل" },
  "טקסט פרויקט": { en: "Project text", es: "Texto del proyecto", "pt-BR": "Texto do projeto", ar: "نص المشروع" },
  "כותרת תובנה": { en: "Insight title", es: "Título de insight", "pt-BR": "Título de insight", ar: "عنوان الرؤية" },
  "תמונת פروיקט": { en: "Project image", es: "Imagen del proyecto", "pt-BR": "Imagem do projeto", ar: "صورة المشروع" },
  "כותרת פרויקט": { en: "Project title", es: "Título del proyecto", "pt-BR": "Título do projeto", ar: "عنوان المشروع" },
  "תמונת שירות": { en: "Service image", es: "Imagen del servicio", "pt-BR": "Imagem do serviço", ar: "صورة الخدمة" },
  "קטגוריית שירות": { en: "Service category", es: "Categoría del servicio", "pt-BR": "Categoria do serviço", ar: "فئة الخدمة" },
  "מחיר שירות": { en: "Service price", es: "Precio del servicio", "pt-BR": "Preço do serviço", ar: "سعر الخدمة" },
  סטטיסטיקה: { en: "Statistic", es: "Estadística", "pt-BR": "Estatística", ar: "إحصائية" },
  "סטטיסטיקה מנהלת": { en: "Director statistic", es: "Estadística de dirección", "pt-BR": "Estatística da direção", ar: "إحصائية الإدارة" },
  "כרטיס המלצה": { en: "Testimonial card", es: "Tarjeta de testimonio", "pt-BR": "Cartão de depoimento", ar: "بطاقة شهادة" },
  "טקסט המלצה": { en: "Testimonial text", es: "Texto del testimonio", "pt-BR": "Texto do depoimento", ar: "نص الشهادة" },
  "תמונת ממליצה": { en: "Reviewer photo", es: "Foto de quien recomienda", "pt-BR": "Foto de quem recomenda", ar: "صورة المُوصية" },
  "שם ממליצה": { en: "Reviewer name", es: "Nombre de quien recomienda", "pt-BR": "Nome de quem recomenda", ar: "اسم المُوصية" },
  "תפקיד ממליצה": { en: "Reviewer role", es: "Cargo de quien recomienda", "pt-BR": "Cargo de quem recomenda", ar: "دور المُوصية" },
  מותג: { en: "Brand", es: "Marca", "pt-BR": "Marca", ar: "علامة" },
  "כרטיס בלוג": { en: "Blog card", es: "Tarjeta de blog", "pt-BR": "Cartão de blog", ar: "بطاقة مدونة" },
  "תמונת מאמר": { en: "Article image", es: "Imagen del artículo", "pt-BR": "Imagem do artigo", ar: "صورة المقال" },
  "תאריך מאמר": { en: "Article date", es: "Fecha del artículo", "pt-BR": "Data do artigo", ar: "تاريخ المقال" },
  "כותרת מאמר": { en: "Article title", es: "Título del artículo", "pt-BR": "Título do artigo", ar: "عنوان المقال" },
  "טקסט מאמר": { en: "Article text", es: "Texto del artículo", "pt-BR": "Texto do artigo", ar: "نص المقال" },
  "כפתור מאמר": { en: "Article button", es: "Botón del artículo", "pt-BR": "Botão do artigo", ar: "زر المقال" },
  "מסגרת תמונת גלריה": { en: "Gallery image frame", es: "Marco de imagen de galería", "pt-BR": "Moldura de imagem da galeria", ar: "إطار صورة المعرض" },
  "תמונת גלריה": { en: "Gallery image", es: "Imagen de galería", "pt-BR": "Imagem da galeria", ar: "صورة المعرض" },
  "סעיף חבילה": { en: "Package item", es: "Ítem del paquete", "pt-BR": "Item do pacote", ar: "بند الباقة" },
  "איש צוות": { en: "Team member", es: "Miembro del equipo", "pt-BR": "Membro da equipe", ar: "عضو الفريق" },
  "תמונת איש צוות": { en: "Team member photo", es: "Foto del miembro", "pt-BR": "Foto do membro", ar: "صورة عضو الفريق" },
  "שם איש צוות": { en: "Team member name", es: "Nombre del miembro", "pt-BR": "Nome do membro", ar: "اسم عضو الفريق" },
  "תפקיד איש צוות": { en: "Team member role", es: "Cargo del miembro", "pt-BR": "Cargo do membro", ar: "دور عضو الفريق" },
  "כותרת קבוצת פוטר": { en: "Footer group title", es: "Título de grupo del pie", "pt-BR": "Título do grupo do rodapé", ar: "عنوان مجموعة التذييل" },
  "קישור פוטר": { en: "Footer link", es: "Enlace de pie", "pt-BR": "Link do rodapé", ar: "رابط التذييل" },
  ניווט: { en: "Nav", es: "Navegación", "pt-BR": "Navegação", ar: "تنقل" },
  "פתיחת שאלה": { en: "Question open", es: "Apertura de pregunta", "pt-BR": "Abertura da pergunta", ar: "فتح السؤال" },
  "תגית מוצר": { en: "Product tag", es: "Etiqueta de producto", "pt-BR": "Tag do produto", ar: "وسم المنتج" },
  תוצאה: { en: "Result", es: "Resultado", "pt-BR": "Resultado", ar: "نتيجة" },
  "יתרון בפרויקט": { en: "Project advantage", es: "Ventaja del proyecto", "pt-BR": "Vantagem do projeto", ar: "ميزة في المشروع" },
  "אייקון שירות": { en: "Service icon", es: "Icono de servicio", "pt-BR": "Ícone de serviço", ar: "أيقونة الخدمة" },
  "יתרון מהיר": { en: "Quick advantage", es: "Ventaja rápida", "pt-BR": "Vantagem rápida", ar: "ميزة سريعة" },
  "אייקון שלב": { en: "Step icon", es: "Icono de paso", "pt-BR": "Ícone da etapa", ar: "أيقونة الخطوة" },
  "שאלה נפוצה": { en: "Common question", es: "Pregunta frecuente", "pt-BR": "Pergunta frequente", ar: "سؤال شائع" },
  יתרון: { en: "Advantage", es: "Ventaja", "pt-BR": "Vantagem", ar: "ميزة" },
  "כרטיס פיד": { en: "Feed card", es: "Tarjeta del feed", "pt-BR": "Cartão do feed", ar: "بطاقة الخلاصة" },
};

const NUMBERED_DASH_LEFT: Record<string, PhraseTranslation> = {
  יכולת: { en: "Capability", es: "Capacidad", "pt-BR": "Capacidade", ar: "قدرة" },
  פס: { en: "Band", es: "Franja", "pt-BR": "Faixa", ar: "شريط" },
  חבילה: { en: "Package", es: "Paquete", "pt-BR": "Pacote", ar: "باقة" },
  תחום: { en: "Practice", es: "Área", "pt-BR": "Área", ar: "مجال" },
  הצלחה: { en: "Win", es: "Éxito", "pt-BR": "Vitória", ar: "نجاح" },
  "איש צוות": { en: "Team member", es: "Miembro del equipo", "pt-BR": "Membro da equipe", ar: "عضو الفريق" },
  רופא: { en: "Doctor", es: "Médico", "pt-BR": "Médico", ar: "طبيب" },
};

const NUMBERED_DASH_RIGHT: Record<string, PhraseTranslation> = {
  כותרת: { en: "title", es: "título", "pt-BR": "título", ar: "عنوان" },
  טקסט: { en: "text", es: "texto", "pt-BR": "texto", ar: "نص" },
  שם: { en: "name", es: "nombre", "pt-BR": "nome", ar: "اسم" },
  מחיר: { en: "price", es: "precio", "pt-BR": "preço", ar: "سعر" },
  תפקיד: { en: "role", es: "cargo", "pt-BR": "cargo", ar: "دور" },
  תמונה: { en: "image", es: "imagen", "pt-BR": "imagem", ar: "صورة" },
};

const HEBREW_MONTHS: Record<string, PhraseTranslation> = {
  ינואר: { en: "January", es: "enero", "pt-BR": "janeiro", ar: "يناير" },
  פברואר: { en: "February", es: "febrero", "pt-BR": "fevereiro", ar: "فبراير" },
  מרץ: { en: "March", es: "marzo", "pt-BR": "março", ar: "مارس" },
  אפריל: { en: "April", es: "abril", "pt-BR": "abril", ar: "أبريل" },
  מאי: { en: "May", es: "mayo", "pt-BR": "maio", ar: "مايو" },
  יוני: { en: "June", es: "junio", "pt-BR": "junho", ar: "يونيو" },
  יולי: { en: "July", es: "julio", "pt-BR": "julho", ar: "يوليو" },
  אוגוסט: { en: "August", es: "agosto", "pt-BR": "agosto", ar: "أغسطس" },
  ספטמבר: { en: "September", es: "septiembre", "pt-BR": "setembro", ar: "سبتمبر" },
  אוקטובר: { en: "October", es: "octubre", "pt-BR": "outubro", ar: "أكتوبر" },
  נובמבר: { en: "November", es: "noviembre", "pt-BR": "novembro", ar: "نوفمبر" },
  דצמבר: { en: "December", es: "diciembre", "pt-BR": "dezembro", ar: "ديسمبر" },
};

function localizeStoryOfBrand(text: string, locale: string): string {
  const match = text.match(STORY_OF_BRAND_RE);
  if (!match) return "";
  const brand = match[1];
  if (locale === "es") return `La historia de ${brand}.`;
  if (locale === "pt-BR") return `A história de ${brand}.`;
  if (locale === "ar") return `قصة ${brand}.`;
  return `The story of ${brand}.`;
}

function localizeCatalogProductLine(text: string, locale: string): string {
  const match = text.match(CATALOG_PRODUCT_RE);
  if (!match) return "";
  const category = pickLocaleCopy(CATALOG_CATEGORY[match[1]], locale);
  if (!category) return "";
  const brand = match[2];
  if (locale === "es") return `Producto de ${category} del catálogo ${brand}.`;
  if (locale === "pt-BR") return `Produto de ${category} do catálogo ${brand}.`;
  if (locale === "ar") return `منتج ${category} من كتالوج ${brand}.`;
  return `${category.charAt(0).toUpperCase()}${category.slice(1)} product from the ${brand} catalog.`;
}

function localizeNamedCatalogProductLine(text: string, locale: string): string {
  const match = text.match(NAMED_CATALOG_RE);
  if (!match) return "";
  const rawProduct = match[1];
  const brand = match[2];
  const category = pickLocaleCopy(CATALOG_CATEGORY[match[3]], locale);
  if (!category) return "";
  let product = rawProduct;
  if (HE.test(rawProduct)) {
    product = pickLocaleCopy(EXACT_LEXICON[rawProduct], locale);
    if (!isUsableTranslation(rawProduct, product, locale)) return "";
  }
  if (locale === "es") return `${product} del catálogo ${brand} — ${category}.`;
  if (locale === "pt-BR") return `${product} do catálogo ${brand} — ${category}.`;
  if (locale === "ar") return `${product} من كتالوج ${brand} — ${category}.`;
  return `${product} from the ${brand} catalog — ${category}.`;
}

function localizeStoreAddonLine(text: string, locale: string): string {
  const match = text.match(STORE_ADDON_RE);
  if (!match) return "";
  const brand = match[1];
  const tagline = match[2];
  let localizedTag = tagline;
  if (HE.test(tagline)) {
    localizedTag = pickLocaleCopy(EXACT_LEXICON[tagline], locale);
    if (!isUsableTranslation(tagline, localizedTag, locale)) return "";
  }
  if (locale === "es") return `${brand} · ${localizedTag} · productos del extra de tienda`;
  if (locale === "pt-BR") return `${brand} · ${localizedTag} · produtos do extra da loja`;
  if (locale === "ar") return `${brand} · ${localizedTag} · منتجات من إضافة المتجر`;
  return `${brand} · ${localizedTag} · products from the store add-on`;
}

function localizeFragment(text: string, locale: string): string {
  if (!HE.test(text)) return text;
  const exact = pickLocaleCopy(EXACT_LEXICON[text], locale);
  if (isUsableTranslation(text, exact, locale)) return exact;
  const category = pickLocaleCopy(CATALOG_CATEGORY[text], locale);
  if (isUsableTranslation(text, category, locale)) return category;
  const indexed = pickLocaleCopy(INDEXED_LABELS[text], locale);
  if (isUsableTranslation(text, indexed, locale)) return indexed;
  return "";
}

function localizeStoreExperienceLine(text: string, locale: string): string {
  const match = text.match(STORE_EXPERIENCE_RE) || text.match(STORE_SHOPPING_RE);
  if (!match) return "";
  const brand = match[1];
  const category = localizeFragment(match[2], locale);
  if (!category) return "";
  const shopping = STORE_SHOPPING_RE.test(text);
  if (locale === "es") {
    return shopping
      ? `${brand} — ${category} con una experiencia de compra completa.`
      : `${brand} — ${category} con una experiencia de tienda completa.`;
  }
  if (locale === "pt-BR") {
    return shopping
      ? `${brand} — ${category} com uma experiência de compra completa.`
      : `${brand} — ${category} com uma experiência de loja completa.`;
  }
  if (locale === "ar") {
    return shopping
      ? `${brand} — ${category} مع تجربة تسوق كاملة.`
      : `${brand} — ${category} مع تجربة متجر كاملة.`;
  }
  return shopping
    ? `${brand} — ${category} with a full shopping experience.`
    : `${brand} — ${category} with a full store experience.`;
}

function localizeStorePoweredLine(text: string, locale: string): string {
  const match = text.match(STORE_POWERED_RE);
  if (!match) return "";
  const brand = match[1];
  const category = localizeFragment(match[2], locale);
  if (!category) return "";
  return `${brand} · ${category} · Powered by Bizuply`;
}

function localizeProjectCode(text: string, locale: string): string {
  const match = text.match(PROJECT_CODE_RE);
  if (!match) return "";
  const code = match[1];
  if (locale === "es") return `Proyecto ${code}`;
  if (locale === "pt-BR") return `Projeto ${code}`;
  if (locale === "ar") return `مشروع ${code}`;
  return `Project ${code}`;
}

function localizeHebrewDate(text: string, locale: string): string {
  const match = text.match(HEBREW_DATE_RE);
  if (!match) return "";
  const day = match[1];
  const month = pickLocaleCopy(HEBREW_MONTHS[match[2]], locale);
  const year = match[3];
  if (!month) return "";
  if (locale === "es") return `${day} de ${month} de ${year}`;
  if (locale === "pt-BR") return `${day} de ${month} de ${year}`;
  if (locale === "ar") return `${day} ${month} ${year}`;
  return `${month} ${day}, ${year}`;
}

function localizeMonthYear(text: string, locale: string): string {
  const match = text.match(MONTH_YEAR_RE);
  if (!match) return "";
  const month = pickLocaleCopy(HEBREW_MONTHS[match[1]], locale);
  if (!month) return "";
  return `${month} ${match[2]}`;
}

function localizeWeekdayTime(text: string, locale: string): string {
  const match = text.match(WEEKDAY_TIME_RE);
  if (!match) return "";
  const day = pickLocaleCopy(HEBREW_WEEKDAYS[match[1]], locale);
  if (!day) return "";
  return `${day} ${match[2]}`;
}

function localizeDuration(text: string, locale: string): string {
  const match = text.match(DURATION_RE) || text.match(DURATION_STUCK_RE);
  if (!match) return "";
  const n = match[1];
  const isMin = /ד/.test(match[2]);
  if (locale === "es") return isMin ? `${n} min` : `${n} h`;
  if (locale === "pt-BR") return isMin ? `${n} min` : `${n} h`;
  if (locale === "ar") return isMin ? `${n} د` : `${n} س`;
  return isMin ? `${n} min` : `${n} h`;
}

function localizeWeekRange(text: string, locale: string): string {
  const match = text.match(WEEK_RANGE_RE);
  if (!match) return "";
  const a = match[1];
  const b = match[2];
  if (locale === "es") return `Semanas ${a}–${b}`;
  if (locale === "pt-BR") return `Semanas ${a}–${b}`;
  if (locale === "ar") return `الأسابيع ${a}–${b}`;
  return `Weeks ${a}–${b}`;
}

function fromPricePrefix(locale: string, amount: string): string {
  if (locale === "es") return `Desde ${amount}`;
  if (locale === "pt-BR") return `A partir de ${amount}`;
  if (locale === "ar") return `ابتداءً من ${amount}`;
  return `From ${amount}`;
}

const FROM_PRICE_SUFFIXES: Record<string, PhraseTranslation> = {
  לשן: { en: "per tooth", es: "por diente", "pt-BR": "por dente", ar: "للسن" },
};

function localizeFromPrice(text: string, locale: string): string {
  const shekelWord = text.match(FROM_SHEKEL_RE);
  if (shekelWord) {
    return fromPricePrefix(locale, `₪${shekelWord[1]}`);
  }
  const match = text.match(FROM_PRICE_RE);
  if (!match) return "";
  const amount = `₪${match[1]}`;
  const head = fromPricePrefix(locale, amount);
  if (!match[2]) return head;
  const suffix =
    pickLocaleCopy(FROM_PRICE_SUFFIXES[match[2]], locale) || localizeFragment(match[2], locale);
  if (!suffix || HE.test(suffix)) return "";
  return `${head} ${suffix}`;
}

const READ_TIME_WHEN: Record<string, PhraseTranslation> = {
  היום: { en: "today", es: "hoy", "pt-BR": "hoje", ar: "اليوم" },
  אתמול: { en: "yesterday", es: "ayer", "pt-BR": "ontem", ar: "أمس" },
  השבוע: { en: "this week", es: "esta semana", "pt-BR": "esta semana", ar: "هذا الأسبوع" },
};

function localizeReadTime(text: string, locale: string): string {
  const match = text.match(READ_TIME_RE);
  if (!match) return "";
  const when =
    pickLocaleCopy(READ_TIME_WHEN[match[2]], locale) || localizeFragment(match[2], locale);
  if (!when || HE.test(when)) return "";
  if (locale === "es") return `${match[1]} min de lectura · ${when}`;
  if (locale === "pt-BR") return `${match[1]} min de leitura · ${when}`;
  if (locale === "ar") return `${match[1]} د قراءة · ${when}`;
  return `${match[1]} min read · ${when}`;
}

function minutesLabel(n: string, locale: string): string {
  if (locale === "ar") return `${n} د`;
  return `${n} min`;
}

function localizeDurationDot(text: string, locale: string): string {
  const prefix = text.match(DURATION_DOT_PREFIX_RE);
  if (prefix) {
    const label = localizeFragment(prefix[2], locale);
    if (!label) return "";
    return `${minutesLabel(prefix[1], locale)} · ${label}`;
  }
  const labeled = text.match(DURATION_DOT_LABEL_RE);
  if (labeled) {
    const label = localizeFragment(labeled[1], locale);
    if (!label) return "";
    return `${label} · ${minutesLabel(labeled[2], locale)}`;
  }
  const slash = text.match(SESSION_SLASH_RE);
  if (slash) {
    const label = localizeFragment(slash[1], locale);
    if (!label) return "";
    return `${label} / ${minutesLabel(slash[2], locale)}`;
  }
  return "";
}

function roomsWord(locale: string): string {
  if (locale === "es") return "hab.";
  if (locale === "pt-BR") return "cômodos";
  if (locale === "ar") return "غرف";
  return "rooms";
}

function localizeFloorToken(text: string, locale: string): string {
  const match = text.match(/^קומה\s*(\d+)$/);
  if (!match) return "";
  if (locale === "es") return `piso ${match[1]}`;
  if (locale === "pt-BR") return `andar ${match[1]}`;
  if (locale === "ar") return `طابق ${match[1]}`;
  return `floor ${match[1]}`;
}

function localizeSqmToken(text: string): string {
  const match = text.match(/^(\d+)\s*מ״ר$/);
  if (!match) return "";
  return `${match[1]} m²`;
}

function localizeFeatureToken(text: string, locale: string): string {
  const floor = localizeFloorToken(text, locale);
  if (floor) return floor;
  const sqm = localizeSqmToken(text);
  if (sqm) return sqm;
  const extra = pickLocaleCopy(ROOM_FEATURE_EXTRA[text], locale);
  if (extra && !HE.test(extra)) return extra;
  return localizeFragment(text, locale);
}

const ROOM_FEATURE_EXTRA: Record<string, PhraseTranslation> = {
  נוף: { en: "a view", es: "vista", "pt-BR": "vista", ar: "إطلالة" },
  מרכז: { en: "center", es: "centro", "pt-BR": "centro", ar: "مركز" },
  צפון: { en: "north", es: "norte", "pt-BR": "norte", ar: "شمال" },
  דרום: { en: "south", es: "sur", "pt-BR": "sul", ar: "جنوب" },
  מזרח: { en: "east", es: "este", "pt-BR": "leste", ar: "شرق" },
};

function localizeJoinedFeatures(raw: string, locale: string): string {
  const parts = raw.split(/\s*·\s*/).map((part) => localizeFeatureToken(part.trim(), locale));
  if (parts.some((part) => !part || HE.test(part))) return "";
  return parts.join(" · ");
}

function localizeRoomCountLine(text: string, locale: string): string {
  const match = text.match(ROOM_COUNT_RE);
  if (!match) return "";
  const features = localizeJoinedFeatures(match[2], locale);
  if (!features) return "";
  return `${match[1]} ${roomsWord(locale)} · ${features}`;
}

function localizeSqmDotLine(text: string, locale: string): string {
  const match = text.match(SQM_DOT_RE);
  if (!match) return "";
  const features = localizeJoinedFeatures(match[2], locale);
  if (!features) return "";
  return `${match[1]} m² · ${features}`;
}

function localizeGuestsDotLine(text: string, locale: string): string {
  const match = text.match(GUESTS_DOT_RE);
  if (!match) return "";
  const features = localizeJoinedFeatures(match[2], locale);
  if (!features) return "";
  const guests =
    locale === "es" ? "huéspedes" : locale === "pt-BR" ? "hóspedes" : locale === "ar" ? "ضيوف" : "guests";
  return `${match[1]} ${guests} · ${features}`;
}

function localizePriceDot(text: string, locale: string): string {
  const match = text.match(PRICE_DOT_RE);
  if (!match) return "";
  const amount = `₪${match[1]}`;
  const rawUnit = match[2];
  const unitCount = rawUnit.match(UNIT_COUNT_RE);
  let unit = "";
  if (unitCount) {
    const n = unitCount[1];
    if (locale === "es") unit = `${n} uds`;
    else if (locale === "pt-BR") unit = `${n} un.`;
    else if (locale === "ar") unit = `${n} قطع`;
    else unit = `${n} pcs`;
  } else {
    unit = localizeFragment(rawUnit, locale);
  }
  if (!unit || HE.test(unit)) return "";
  return `${amount} · ${unit}`;
}

function localizeBurgerSmash(text: string, locale: string): string {
  const match = text.match(BURGER_SMASH_RE);
  if (!match) return "";
  const name = localizeFragment(match[1], locale) || (HE.test(match[1]) ? "" : match[1]);
  if (!name) return "";
  if (locale === "es") return `${name} — pan, carne, queso — sin filosofía.`;
  if (locale === "pt-BR") return `${name} — pão, carne, queijo — sem filosofia.`;
  if (locale === "ar") return `${name} — خبز ولحم وجبن — بلا فلسفة.`;
  return `${name} — bun, beef, cheese — no philosophy.`;
}

function localizeAgencySharpLine(text: string, locale: string): string {
  const match = text.match(AGENCY_SHARP_RE);
  if (!match) return "";
  const brand = match[1];
  const kind = localizeFragment(match[2], locale);
  if (!kind) return "";
  if (locale === "es") return `${brand} — agencia de ${kind} con un proceso nítido y resultados medibles.`;
  if (locale === "pt-BR") return `${brand} — agência de ${kind} com processo nítido e resultados mensuráveis.`;
  if (locale === "ar") return `${brand} — وكالة ${kind} بعملية حادة ونتائج قابلة للقياس.`;
  return `${brand} — a ${kind} agency with a sharp process and measurable results.`;
}

function localizeAgencySignatureLine(text: string, locale: string): string {
  const match = text.match(AGENCY_SIGNATURE_RE);
  if (!match) return "";
  const brand = match[1];
  const kind = localizeFragment(match[2], locale);
  if (!kind) return "";
  const sig = HE.test(match[3]) ? localizeFragment(match[3], locale) : match[3];
  if (!sig || HE.test(sig)) return "";
  if (locale === "es") return `${brand} — agencia de ${kind} con firma ${sig}`;
  if (locale === "pt-BR") return `${brand} — agência de ${kind} com assinatura ${sig}`;
  if (locale === "ar") return `${brand} — وكالة ${kind} بتوقيع ${sig}`;
  return `${brand} — a ${kind} agency with a ${sig} signature`;
}

function localizeIndexedEditorLabel(text: string, locale: string): string {
  const match = text.match(INDEXED_LABEL_RE);
  if (!match) return "";
  const prefix = localizeIndexedPrefix(match[1], locale);
  if (!prefix) return "";
  return `${prefix} ${match[2]}`;
}

function localizeNumberedDashLabel(text: string, locale: string): string {
  const match = text.match(NUMBERED_DASH_RE);
  if (!match) return "";
  const left =
    pickLocaleCopy(NUMBERED_DASH_LEFT[match[1]], locale) ||
    localizeIndexedPrefix(match[1], locale);
  const right =
    pickLocaleCopy(NUMBERED_DASH_RIGHT[match[3]], locale) ||
    localizeFragment(match[3], locale);
  if (!left || !right || HE.test(left) || HE.test(right)) return "";
  return `${left} ${match[2]} - ${right}`;
}

const EXTRA_INDEXED_PREFIXES: Record<string, PhraseTranslation> = {
  תיק: { en: "Case", es: "Expediente", "pt-BR": "Processo", ar: "ملف" },
  שפה: { en: "Language", es: "Idioma", "pt-BR": "Idioma", ar: "لغة" },
  מסלול: { en: "Track", es: "Itinerario", "pt-BR": "Percurso", ar: "مسار" },
  שלב: { en: "Step", es: "Paso", "pt-BR": "Etapa", ar: "خطوة" },
  מקור: { en: "Origin", es: "Origen", "pt-BR": "Origem", ar: "مصدر" },
  קלייה: { en: "Roast", es: "Tueste", "pt-BR": "Torrefação", ar: "تحميص" },
  ערוץ: { en: "Channel", es: "Canal", "pt-BR": "Canal", ar: "قناة" },
  שכבה: { en: "Layer", es: "Capa", "pt-BR": "Camada", ar: "طبقة" },
  מידה: { en: "Size", es: "Talla", "pt-BR": "Tamanho", ar: "مقاس" },
  בד: { en: "Fabric", es: "Tela", "pt-BR": "Tecido", ar: "قماش" },
  ערך: { en: "Value", es: "Valor", "pt-BR": "Valor", ar: "قيمة" },
  מטרה: { en: "Goal", es: "Objetivo", "pt-BR": "Meta", ar: "هدف" },
  מד: { en: "Meter", es: "Medidor", "pt-BR": "Medidor", ar: "مقياس" },
};

function localizeIndexedPrefix(text: string, locale: string): string {
  const fragment = localizeFragment(text, locale);
  if (fragment) return fragment;
  const extra = pickLocaleCopy(EXTRA_INDEXED_PREFIXES[text], locale);
  if (isUsableTranslation(text, extra, locale)) return extra;
  return "";
}

function localizePrefixedEditorLabel(text: string, locale: string): string {
  const prefixes = Object.keys(INDEXED_LABELS).sort((a, b) => b.length - a.length);
  for (const prefix of prefixes) {
    if (!text.startsWith(`${prefix} `)) continue;
    const rest = text.slice(prefix.length + 1);
    if (/^\d+(?:\.\d+)?$/.test(rest)) continue;
    const locPrefix = localizeFragment(prefix, locale);
    if (!locPrefix) continue;
    const locRest = HE.test(rest) ? localizeFragment(rest, locale) : rest;
    if (!locRest || HE.test(locRest)) continue;
    return `${locPrefix} ${locRest}`;
  }
  return "";
}

function localizeSoilToPlate(text: string, locale: string): string {
  const match = text.match(SOIL_TO_PLATE_RE);
  if (!match) return "";
  const dish = localizeFragment(match[1], locale) || (HE.test(match[1]) ? "" : match[1]);
  if (!dish) return "";
  if (locale === "es") return `${dish} — de la tierra al plato — sin ceder en el sabor.`;
  if (locale === "pt-BR") return `${dish} — da terra ao prato — sem abrir mão do sabor.`;
  if (locale === "ar") return `${dish} — من الأرض إلى الصحن — بلا تنازل عن الطعم.`;
  return `${dish} — from the soil to the plate — no compromise on taste.`;
}

function localizeDishSuffix(
  text: string,
  locale: string,
  re: RegExp,
  copy: PhraseTranslation,
): string {
  const match = text.match(re);
  if (!match) return "";
  const dish = localizeFragment(match[1], locale) || (HE.test(match[1]) ? "" : match[1]);
  if (!dish) return "";
  const suffix = pickLocaleCopy(copy, locale);
  if (!suffix || HE.test(suffix)) return "";
  return `${dish} — ${suffix}`;
}

const STEAM_BASKET_COPY: PhraseTranslation = {
  en: "steam lifts — the basket lands on the table.",
  es: "el vapor sube — la cesta llega a la mesa.",
  "pt-BR": "o vapor sobe — a cesta chega à mesa.",
  ar: "البخار يرتفع — والسلة تصل إلى الطاولة.",
};
const FRESH_DOUGH_COPY: PhraseTranslation = {
  en: "the dough is fresh — the sauce tells the story.",
  es: "la masa está fresca — la salsa cuenta la historia.",
  "pt-BR": "a massa está fresca — o molho conta a história.",
  ar: "العجين طازج — والصلصة تروي القصة.",
};
const SUGAR_INGREDIENT_COPY: PhraseTranslation = {
  en: "sugar as an ingredient — not just sweetness.",
  es: "el azúcar como ingrediente — no solo dulzor.",
  "pt-BR": "açúcar como ingrediente — não só doçura.",
  ar: "السكر كمكون — ليس حلاوة فقط.",
};
const LOW_SMOKE_COPY: PhraseTranslation = {
  en: "low smoke, long heat, deep flavor.",
  es: "humo bajo, calor largo, sabor profundo.",
  "pt-BR": "fumaça baixa, calor longo, sabor fundo.",
  ar: "دخان منخفض وحرارة طويلة وطعم عميق.",
};
const SEA_PLATE_COPY: PhraseTranslation = {
  en: "the sea reaches the plate — no delays.",
  es: "el mar llega al plato — sin demoras.",
  "pt-BR": "o mar chega ao prato — sem atrasos.",
  ar: "البحر يصل إلى الصحن — بلا تأخير.",
};
const SPIT_TASTE_COPY: PhraseTranslation = {
  en: "the spit turns — the flavor stays.",
  es: "el asador gira — el sabor se queda.",
  "pt-BR": "o espeto gira — o sabor fica.",
  ar: "السيخ يدور — والطعم يبقى.",
};
const BOWL_PATH_COPY: PhraseTranslation = {
  en: "every bowl is a flavor path.",
  es: "cada bowl es un recorrido de sabor.",
  "pt-BR": "cada tigela é um caminho de sabor.",
  ar: "كل وعاء مسار نكهات.",
};
const JUICE_NOW_COPY: PhraseTranslation = {
  en: "squeezed now — drink it immediately.",
  es: "exprimido ahora — a beber de inmediato.",
  "pt-BR": "espremido agora — bebam na hora.",
  ar: "يُعصر الآن — يُشرب فورًا.",
};
const MELT_EXPERIENCE_COPY: PhraseTranslation = {
  en: "the melt is part of the experience.",
  es: "el fundido es parte de la experiencia.",
  "pt-BR": "o derretimento faz parte da experiência.",
  ar: "الذوبان جزء من التجربة.",
};
const KNOW_ALL_COPY: PhraseTranslation = {
  en: "everything you need to know.",
  es: "todo lo que hay que saber.",
  "pt-BR": "tudo o que vocês precisam saber.",
  ar: "كل ما تحتاجون معرفته.",
};
const BEHIND_SCENES_COPY: PhraseTranslation = {
  en: "behind the scenes.",
  es: "detrás de cámaras.",
  "pt-BR": "nos bastidores.",
  ar: "خلف الكواليس.",
};

function localizeIngredientFit(text: string, locale: string): string {
  const match = text.match(INGREDIENT_FIT_RE);
  if (!match) return "";
  const cuisine = localizeFragment(match[1], locale) || (HE.test(match[1]) ? "" : match[1]);
  if (!cuisine) return "";
  if (locale === "es") return `Ingredientes que encajan con ${cuisine}.`;
  if (locale === "pt-BR") return `Ingredientes que combinam com ${cuisine}.`;
  if (locale === "ar") return `مكونات تناسب ${cuisine}.`;
  return `Ingredients that fit ${cuisine}.`;
}

function localizePerfectDish(text: string, locale: string): string {
  const match = text.match(PERFECT_DISH_RE);
  if (!match) return "";
  const dish = localizeFragment(match[1], locale) || (HE.test(match[1]) ? "" : match[1]);
  if (!dish) return "";
  if (locale === "es") return `El plato de ${dish} estaba perfecto.`;
  if (locale === "pt-BR") return `O prato de ${dish} estava perfeito.`;
  if (locale === "ar") return `طبق ${dish} كان مثاليًا.`;
  return `The ${dish} was perfect.`;
}

function localizeOpeningHours(text: string, locale: string): string {
  if (!/א[׳']/.test(text) || !/\d{1,2}:\d{2}/.test(text)) return "";
  const tokens: Record<string, PhraseTranslation> = {
    "מוצ״ש": { en: "Sat night", es: "sáb. noche", "pt-BR": "sáb. noite", ar: "مساء السبت" },
    "א׳–ה׳": { en: "Sun–Thu", es: "dom–jue", "pt-BR": "dom–qui", ar: "أحد–خميس" },
    "א'–ה'": { en: "Sun–Thu", es: "dom–jue", "pt-BR": "dom–qui", ar: "أحد–خميس" },
    "א׳-ה׳": { en: "Sun–Thu", es: "dom–jue", "pt-BR": "dom–qui", ar: "أحد–خميس" },
    "א'-ה'": { en: "Sun–Thu", es: "dom–jue", "pt-BR": "dom–qui", ar: "أحد–خميس" },
    "ו׳–ש׳": { en: "Fri–Sat", es: "vie–sáb", "pt-BR": "sex–sáb", ar: "جمعة–سبت" },
    "ו'–ש'": { en: "Fri–Sat", es: "vie–sáb", "pt-BR": "sex–sáb", ar: "جمعة–سبت" },
    שבת: { en: "Sat", es: "sáb", "pt-BR": "sáb", ar: "سبت" },
    סגור: { en: "Closed", es: "Cerrado", "pt-BR": "Fechado", ar: "مغلق" },
    "ו׳": { en: "Fri", es: "vie", "pt-BR": "sex", ar: "جمعة" },
    "ו'": { en: "Fri", es: "vie", "pt-BR": "sex", ar: "جمعة" },
  };
  let out = text;
  const keys = Object.keys(tokens).sort((a, b) => b.length - a.length);
  for (const source of keys) {
    if (!out.includes(source)) continue;
    const translated = pickLocaleCopy(tokens[source], locale);
    if (!translated) continue;
    out = out.split(source).join(translated);
  }
  if (HE.test(out)) return "";
  return out;
}

function localizeAgencySiteLine(text: string, locale: string): string {
  const colon = text.match(AGENCY_SITE_COLON_RE);
  const dash = text.match(AGENCY_SITE_DASH_RE);
  const match = colon || dash;
  if (!match) return "";
  const kind = localizeFragment(match[1], locale);
  const design = localizeFragment(match[2], locale) || (HE.test(match[2]) ? "" : match[2]);
  if (!kind || !design) return "";
  if (colon) {
    if (locale === "es") return `Web completa para agencia de ${kind}: 8 páginas, movimiento, efectos y diseño ${design}.`;
    if (locale === "pt-BR") return `Site completo para agência de ${kind}: 8 páginas, movimento, efeitos e design ${design}.`;
    if (locale === "ar") return `موقع كامل لوكالة ${kind}: 8 صفحات وحركة وتأثيرات وتصميم ${design}.`;
    return `Full site for a ${kind} agency: 8 pages, motion, effects, and ${design} design.`;
  }
  if (locale === "es") return `Web completa para agencia de ${kind} con 8 páginas, movimiento y efectos — ${design}.`;
  if (locale === "pt-BR") return `Site completo para agência de ${kind} com 8 páginas, movimento e efeitos — ${design}.`;
  if (locale === "ar") return `موقع كامل لوكالة ${kind} مع 8 صفحات وحركة وتأثيرات — ${design}.`;
  return `Full site for a ${kind} agency with 8 pages, motion, and effects — ${design}.`;
}

function localizeStoreSiteLine(text: string, locale: string): string {
  const colon = text.match(STORE_SITE_COLON_RE);
  const dash = text.match(STORE_SITE_DASH_RE);
  const pages = text.match(STORE_SITE_PAGES_RE);
  const match = colon || dash || pages;
  if (!match) return "";
  const kind = localizeFragment(match[1], locale);
  if (!kind) return "";
  if (colon) {
    if (locale === "es") return `Tienda completa de ${kind}: 8 páginas, categorías, filtros, carrito y productos del extra de tienda.`;
    if (locale === "pt-BR") return `Loja completa de ${kind}: 8 páginas, categorias, filtros, carrinho e produtos do extra da loja.`;
    if (locale === "ar") return `متجر ${kind} كامل: 8 صفحات وفئات وفلاتر وسلة ومنتجات من إضافة المتجر.`;
    return `Full ${kind} store: 8 pages, categories, filters, cart, and products from the store add-on.`;
  }
  if (pages) {
    if (locale === "es") return `Tienda completa de ${kind} con páginas, subpáginas, categorías y filtros — conectada al extra de tienda.`;
    if (locale === "pt-BR") return `Loja completa de ${kind} com páginas, subpáginas, categorias e filtros — ligada ao extra da loja.`;
    if (locale === "ar") return `متجر ${kind} كامل بصفحات وصفحات فرعية وفئات وفلاتر — مربوط بإضافة المتجر.`;
    return `Full ${kind} store with pages, subpages, categories, and filters — connected to the store add-on.`;
  }
  if (locale === "es") return `Tienda completa de ${kind} con 8 páginas, filtros y productos del extra de tienda.`;
  if (locale === "pt-BR") return `Loja completa de ${kind} com 8 páginas, filtros e produtos do extra da loja.`;
  if (locale === "ar") return `متجر ${kind} كامل مع 8 صفحات وفلاتر ومنتجات من إضافة المتجر.`;
  return `Full ${kind} store with 8 pages, filters, and products from the store add-on.`;
}

function localizeStoreBuildLine(text: string, locale: string): string {
  const match = text.match(STORE_BUILD_RE);
  if (!match) return "";
  const kind = localizeFragment(match[1], locale);
  if (!kind) return "";
  if (locale === "es") {
    return `Construimos una tienda de ${kind} que respeta diseño y operación: categorías, filtros, páginas de producto y carrito — todo conectado al extra de tienda.`;
  }
  if (locale === "pt-BR") {
    return `Construímos uma loja de ${kind} que respeita design e operação: categorias, filtros, páginas de produto e carrinho — tudo ligado ao extra da loja.`;
  }
  if (locale === "ar") {
    return `نبني متجر ${kind} يحترم التصميم والتشغيل معاً: فئات وفلاتر وصفحات منتج وسلة — والكل مربوط بإضافة المتجر.`;
  }
  return `We build a ${kind} store that respects both design and operations: categories, filters, product pages, and a cart — all connected to the store add-on.`;
}

function localizeBeautyProtocolLine(text: string, locale: string): string {
  const match = text.match(BEAUTY_PROTOCOL_RE);
  if (!match) return "";
  const prefix = localizeFragment(match[1], locale);
  if (!prefix) return "";
  if (locale === "es") {
    return `${prefix} Incluye un diagnóstico breve, una adaptación personal, trabajo preciso y recomendaciones escritas para que el resultado siga bonito después de salir del estudio.`;
  }
  if (locale === "pt-BR") {
    return `${prefix} Inclui um diagnóstico curto, uma adaptação pessoal, trabalho preciso e recomendações escritas para o resultado continuar bonito depois de sair do estúdio.`;
  }
  if (locale === "ar") {
    return `${prefix} يشمل تشخيصاً قصيراً وملاءمة شخصية وعملاً دقيقاً وتوصيات متابعة مكتوبة حتى تبقى النتيجة جميلة بعد مغادرة الاستوديو.`;
  }
  return `${prefix} Includes a short diagnosis, a personal match, precise work, and written aftercare so the result stays beautiful after you leave the studio.`;
}

function localizeFoodTeamLine(text: string, locale: string): string {
  const match = text.match(FOOD_TEAM_RE);
  if (!match) return "";
  const prefix = localizeFragment(match[1], locale);
  if (!prefix) return "";
  if (locale === "es") {
    return `${prefix} Detrás de cada plato hay un equipo que conoce la materia prima por su nombre, prepara mise en place a ritmo diario y mantiene una hospitalidad cálida desde que entras hasta el último postre.`;
  }
  if (locale === "pt-BR") {
    return `${prefix} Por trás de cada prato há uma equipe que conhece os ingredientes pelo nome, faz mise en place no ritmo diário e mantém uma hospitalidade quente desde a entrada até a última sobremesa.`;
  }
  if (locale === "ar") {
    return `${prefix} خلف كل طبق فريق يعرف المواد باسمها، يبني تحضيرات يومية ويحافظ على ضيافة دافئة من لحظة الدخول حتى آخر حلوى.`;
  }
  return `${prefix} Behind every dish stands a team that knows the ingredients by name, builds daily mise en place, and keeps hospitality warm from the moment you walk in through the last dessert.`;
}

function localizeStoreBuiltLargeLine(text: string, locale: string): string {
  const match = text.match(STORE_BUILT_LARGE_RE);
  if (!match) return "";
  const brand = match[1];
  if (locale === "es") {
    return `${brand} se construyó como una tienda grande con decenas de secciones, páginas de contenido y una conexión completa al extra de tienda de Bizuply.`;
  }
  if (locale === "pt-BR") {
    return `${brand} foi construída como uma loja grande com dezenas de seções, páginas de conteúdo e uma ligação completa ao extra da loja da Bizuply.`;
  }
  if (locale === "ar") {
    return `${brand} بُنيت كمتجر كبير بعشرات الأقسام وصفحات المحتوى وربط كامل بإضافة متجر Bizuply.`;
  }
  return `${brand} was built as a large store with dozens of sections, content pages, and a full connection to the Bizuply store add-on.`;
}

function localizeAgencyCloseLine(text: string, locale: string): string {
  const match = text.match(AGENCY_CLOSE_RE);
  if (!match) return "";
  const kind = localizeFragment(match[1], locale);
  if (!kind) return "";
  if (locale === "es") {
    return `Un equipo de agencia de ${kind} que trabaja junto al cliente: diagnóstico, planificación, ejecución y medición — sin ruido de más.`;
  }
  if (locale === "pt-BR") {
    return `Uma equipe de agência de ${kind} que trabalha junto ao cliente: diagnóstico, planejamento, execução e medição — sem barulho extra.`;
  }
  if (locale === "ar") {
    return `فريق وكالة ${kind} يعمل ملاصقاً للزبون: تشخيص وتخطيط وتنفيذ وقياس — بلا ضجيج زائد.`;
  }
  return `A ${kind} agency team that works close to the client: diagnosis, planning, execution, and measurement — without extra noise.`;
}

function isUsableTranslation(source: string, translated: string, locale: string): boolean {
  if (!translated || translated === source) return false;
  if (locale === "he") return true;
  const srcHe = hebrewScore(source);
  const outHe = hebrewScore(translated);
  if (srcHe === 0) return translated !== source;
  // Any leftover Hebrew is a hybrid smash. Exact rows must be fully translated.
  return outHe === 0;
}

const exactKeys = Object.keys(EXACT_LEXICON).sort((a, b) => b.length - a.length);
const bookKeys = Object.keys(book).sort((a, b) => b.length - a.length);

function adaptBuiltInDirectionalCss(text: string, locale: string): string {
  if (locale === "he") return text;
  if (!/direction\s*:|text-align\s*:|lang=|dir=/i.test(text)) return text;
  const dir = getTextDirection(locale);
  const htmlLang = getHtmlLang(locale);
  return text
    .replace(/direction:\s*rtl/gi, `direction:${dir}`)
    .replace(/text-align:\s*right/gi, "text-align:start")
    .replace(/\blang=(["'])he\1/gi, `lang=$1${htmlLang}$1`)
    .replace(/\bdir=(["'])rtl\1/gi, `dir=$1${dir}$1`);
}

function looksLikeHtml(text: string): boolean {
  return /<[a-zA-Z][\s\S]*?>/.test(text) || /<\/[a-zA-Z]/.test(text);
}

function localizeHtmlDocument(html: string, locale: string): string {
  const localized = html.replace(
    /(>)([^<]*[\u0590-\u05FF][^<]*)(<)/g,
    (full, open: string, text: string, close: string) => {
      const leading = text.match(/^\s*/)[0];
      const trailing = text.match(/\s*$/)[0];
      const core = text.slice(leading.length, text.length - trailing.length);
      if (!core) return full;
      return `${open}${leading}${localizePlainBuiltInText(core, locale)}${trailing}${close}`;
    },
  );
  return adaptBuiltInDirectionalCss(localized, locale);
}

/** Rewrite baked-in RTL library styles so new inserts follow the dashboard language. */
export function localizeLibraryInsertStyle<T extends Record<string, any>>(
  style: T | undefined,
  language?: string,
): T | undefined {
  if (!style) return style;
  const locale = localeKey(language);
  if (locale === "he") return style;
  const dir = getTextDirection(locale);
  const next = { ...style };
  if (next.direction === "rtl" || next.direction === "ltr") {
    next.direction = dir;
  }
  if (next.textAlign === "right" || next.textAlign === "left") {
    next.textAlign = "start";
  }
  return next;
}

function localizePlainBuiltInText(text: string, locale: string): string {
  if (!text) return text;
  if (locale === "he") return text;
  if (!HE.test(text)) return adaptBuiltInDirectionalCss(text, locale);

  const exact = pickLocaleCopy(EXACT_LEXICON[text], locale);
  if (isUsableTranslation(text, exact, locale)) {
    return adaptBuiltInDirectionalCss(exact, locale);
  }

  if (text.includes("\n")) {
    const parts = text.split("\n");
    const localized = parts.map((part) => {
      if (!part || !HE.test(part)) return part;
      return localizePlainBuiltInText(part, locale);
    });
    const ok = parts.every((part, index) => {
      if (!HE.test(part)) return localized[index] === part;
      return isUsableTranslation(part, localized[index], locale);
    });
    if (ok) return adaptBuiltInDirectionalCss(localized.join("\n"), locale);
  }

  const categoryHit = pickLocaleCopy(CATALOG_CATEGORY[text], locale);
  if (isUsableTranslation(text, categoryHit, locale)) {
    return adaptBuiltInDirectionalCss(categoryHit, locale);
  }

  const indexedExact = pickLocaleCopy(INDEXED_LABELS[text], locale);
  if (isUsableTranslation(text, indexedExact, locale)) {
    return adaptBuiltInDirectionalCss(indexedExact, locale);
  }

  const projectCode = localizeProjectCode(text, locale);
  if (isUsableTranslation(text, projectCode, locale)) {
    return adaptBuiltInDirectionalCss(projectCode, locale);
  }

  const hebrewDate = localizeHebrewDate(text, locale);
  if (isUsableTranslation(text, hebrewDate, locale)) {
    return adaptBuiltInDirectionalCss(hebrewDate, locale);
  }

  const monthYear = localizeMonthYear(text, locale);
  if (isUsableTranslation(text, monthYear, locale)) {
    return adaptBuiltInDirectionalCss(monthYear, locale);
  }

  const weekdayTime = localizeWeekdayTime(text, locale);
  if (isUsableTranslation(text, weekdayTime, locale)) {
    return adaptBuiltInDirectionalCss(weekdayTime, locale);
  }

  const duration = localizeDuration(text, locale);
  if (isUsableTranslation(text, duration, locale)) {
    return adaptBuiltInDirectionalCss(duration, locale);
  }

  const weekRange = localizeWeekRange(text, locale);
  if (isUsableTranslation(text, weekRange, locale)) {
    return adaptBuiltInDirectionalCss(weekRange, locale);
  }

  const fromPrice = localizeFromPrice(text, locale);
  if (isUsableTranslation(text, fromPrice, locale)) {
    return adaptBuiltInDirectionalCss(fromPrice, locale);
  }
  const priceDot = localizePriceDot(text, locale);
  if (isUsableTranslation(text, priceDot, locale)) {
    return adaptBuiltInDirectionalCss(priceDot, locale);
  }
  const readTime = localizeReadTime(text, locale);
  if (isUsableTranslation(text, readTime, locale)) {
    return adaptBuiltInDirectionalCss(readTime, locale);
  }
  const durationDot = localizeDurationDot(text, locale);
  if (isUsableTranslation(text, durationDot, locale)) {
    return adaptBuiltInDirectionalCss(durationDot, locale);
  }
  const roomCount = localizeRoomCountLine(text, locale);
  if (isUsableTranslation(text, roomCount, locale)) {
    return adaptBuiltInDirectionalCss(roomCount, locale);
  }
  const sqmDot = localizeSqmDotLine(text, locale);
  if (isUsableTranslation(text, sqmDot, locale)) {
    return adaptBuiltInDirectionalCss(sqmDot, locale);
  }
  const guestsDot = localizeGuestsDotLine(text, locale);
  if (isUsableTranslation(text, guestsDot, locale)) {
    return adaptBuiltInDirectionalCss(guestsDot, locale);
  }

  const openingHours = localizeOpeningHours(text, locale);
  if (isUsableTranslation(text, openingHours, locale)) {
    return adaptBuiltInDirectionalCss(openingHours, locale);
  }

  const numberedDash = localizeNumberedDashLabel(text, locale);
  if (isUsableTranslation(text, numberedDash, locale)) {
    return adaptBuiltInDirectionalCss(numberedDash, locale);
  }

  const indexedLabel = localizeIndexedEditorLabel(text, locale);
  if (isUsableTranslation(text, indexedLabel, locale)) {
    return adaptBuiltInDirectionalCss(indexedLabel, locale);
  }

  const prefixedLabel = localizePrefixedEditorLabel(text, locale);
  if (isUsableTranslation(text, prefixedLabel, locale)) {
    return adaptBuiltInDirectionalCss(prefixedLabel, locale);
  }

  const catalogLine = localizeCatalogProductLine(text, locale);
  if (isUsableTranslation(text, catalogLine, locale)) {
    return adaptBuiltInDirectionalCss(catalogLine, locale);
  }

  const namedCatalogLine = localizeNamedCatalogProductLine(text, locale);
  if (isUsableTranslation(text, namedCatalogLine, locale)) {
    return adaptBuiltInDirectionalCss(namedCatalogLine, locale);
  }

  const storyLine = localizeStoryOfBrand(text, locale);
  if (isUsableTranslation(text, storyLine, locale)) {
    return adaptBuiltInDirectionalCss(storyLine, locale);
  }

  const storeAddonLine = localizeStoreAddonLine(text, locale);
  if (isUsableTranslation(text, storeAddonLine, locale)) {
    return adaptBuiltInDirectionalCss(storeAddonLine, locale);
  }

  const agencySiteLine = localizeAgencySiteLine(text, locale);
  if (isUsableTranslation(text, agencySiteLine, locale)) {
    return adaptBuiltInDirectionalCss(agencySiteLine, locale);
  }

  const storeSiteLine = localizeStoreSiteLine(text, locale);
  if (isUsableTranslation(text, storeSiteLine, locale)) {
    return adaptBuiltInDirectionalCss(storeSiteLine, locale);
  }

  const storeBuildLine = localizeStoreBuildLine(text, locale);
  if (isUsableTranslation(text, storeBuildLine, locale)) {
    return adaptBuiltInDirectionalCss(storeBuildLine, locale);
  }

  const beautyProtocolLine = localizeBeautyProtocolLine(text, locale);
  if (isUsableTranslation(text, beautyProtocolLine, locale)) {
    return adaptBuiltInDirectionalCss(beautyProtocolLine, locale);
  }

  const foodTeamLine = localizeFoodTeamLine(text, locale);
  if (isUsableTranslation(text, foodTeamLine, locale)) {
    return adaptBuiltInDirectionalCss(foodTeamLine, locale);
  }

  const storeBuiltLargeLine = localizeStoreBuiltLargeLine(text, locale);
  if (isUsableTranslation(text, storeBuiltLargeLine, locale)) {
    return adaptBuiltInDirectionalCss(storeBuiltLargeLine, locale);
  }

  const agencyCloseLine = localizeAgencyCloseLine(text, locale);
  if (isUsableTranslation(text, agencyCloseLine, locale)) {
    return adaptBuiltInDirectionalCss(agencyCloseLine, locale);
  }

  const storeExperienceLine = localizeStoreExperienceLine(text, locale);
  if (isUsableTranslation(text, storeExperienceLine, locale)) {
    return adaptBuiltInDirectionalCss(storeExperienceLine, locale);
  }

  const storePoweredLine = localizeStorePoweredLine(text, locale);
  if (isUsableTranslation(text, storePoweredLine, locale)) {
    return adaptBuiltInDirectionalCss(storePoweredLine, locale);
  }

  const burgerSmash = localizeBurgerSmash(text, locale);
  if (isUsableTranslation(text, burgerSmash, locale)) {
    return adaptBuiltInDirectionalCss(burgerSmash, locale);
  }

  const agencySharp = localizeAgencySharpLine(text, locale);
  if (isUsableTranslation(text, agencySharp, locale)) {
    return adaptBuiltInDirectionalCss(agencySharp, locale);
  }

  const agencySignature = localizeAgencySignatureLine(text, locale);
  if (isUsableTranslation(text, agencySignature, locale)) {
    return adaptBuiltInDirectionalCss(agencySignature, locale);
  }

  const soilToPlate = localizeSoilToPlate(text, locale);
  if (isUsableTranslation(text, soilToPlate, locale)) {
    return adaptBuiltInDirectionalCss(soilToPlate, locale);
  }

  const steamBasket = localizeDishSuffix(text, locale, STEAM_BASKET_RE, STEAM_BASKET_COPY);
  if (isUsableTranslation(text, steamBasket, locale)) {
    return adaptBuiltInDirectionalCss(steamBasket, locale);
  }
  const freshDough = localizeDishSuffix(text, locale, FRESH_DOUGH_RE, FRESH_DOUGH_COPY);
  if (isUsableTranslation(text, freshDough, locale)) {
    return adaptBuiltInDirectionalCss(freshDough, locale);
  }
  const sugarIngredient = localizeDishSuffix(text, locale, SUGAR_INGREDIENT_RE, SUGAR_INGREDIENT_COPY);
  if (isUsableTranslation(text, sugarIngredient, locale)) {
    return adaptBuiltInDirectionalCss(sugarIngredient, locale);
  }
  const lowSmoke = localizeDishSuffix(text, locale, LOW_SMOKE_RE, LOW_SMOKE_COPY);
  if (isUsableTranslation(text, lowSmoke, locale)) {
    return adaptBuiltInDirectionalCss(lowSmoke, locale);
  }
  const seaPlate = localizeDishSuffix(text, locale, SEA_PLATE_RE, SEA_PLATE_COPY);
  if (isUsableTranslation(text, seaPlate, locale)) {
    return adaptBuiltInDirectionalCss(seaPlate, locale);
  }
  const spitTaste = localizeDishSuffix(text, locale, SPIT_TASTE_RE, SPIT_TASTE_COPY);
  if (isUsableTranslation(text, spitTaste, locale)) {
    return adaptBuiltInDirectionalCss(spitTaste, locale);
  }
  const bowlPath = localizeDishSuffix(text, locale, BOWL_PATH_RE, BOWL_PATH_COPY);
  if (isUsableTranslation(text, bowlPath, locale)) {
    return adaptBuiltInDirectionalCss(bowlPath, locale);
  }
  const juiceNow = localizeDishSuffix(text, locale, JUICE_NOW_RE, JUICE_NOW_COPY);
  if (isUsableTranslation(text, juiceNow, locale)) {
    return adaptBuiltInDirectionalCss(juiceNow, locale);
  }
  const meltExperience = localizeDishSuffix(text, locale, MELT_EXPERIENCE_RE, MELT_EXPERIENCE_COPY);
  if (isUsableTranslation(text, meltExperience, locale)) {
    return adaptBuiltInDirectionalCss(meltExperience, locale);
  }
  const perfectDish = localizePerfectDish(text, locale);
  if (isUsableTranslation(text, perfectDish, locale)) {
    return adaptBuiltInDirectionalCss(perfectDish, locale);
  }
  const knowAll = localizeDishSuffix(text, locale, KNOW_ALL_RE, KNOW_ALL_COPY);
  if (isUsableTranslation(text, knowAll, locale)) {
    return adaptBuiltInDirectionalCss(knowAll, locale);
  }
  const ingredientFit = localizeIngredientFit(text, locale);
  if (isUsableTranslation(text, ingredientFit, locale)) {
    return adaptBuiltInDirectionalCss(ingredientFit, locale);
  }
  const behindScenes = localizeDishSuffix(text, locale, BEHIND_SCENES_RE, BEHIND_SCENES_COPY);
  if (isUsableTranslation(text, behindScenes, locale)) {
    return adaptBuiltInDirectionalCss(behindScenes, locale);
  }

  const bookHit = pickLocaleCopy(book[text], locale);
  if (isUsableTranslation(text, bookHit, locale)) {
    return adaptBuiltInDirectionalCss(bookHit, locale);
  }

  // Short punchy lines must be exact. Word-by-word smash turns
  // "לילה קטן. טעמים גדולים." into "night small. flavors large."
  // Composed chrome like "דף הבית – פתיחה מפוצלת" can still use fragments.
  if (text.length <= 48 && !/[–—·]/.test(text)) {
    return adaptBuiltInDirectionalCss(text, locale);
  }

  let out = text;
  for (const source of exactKeys) {
    if (!out.includes(source)) continue;
    const translated = pickLocaleCopy(EXACT_LEXICON[source], locale);
    if (!isUsableTranslation(source, translated, locale)) continue;
    out = out.split(source).join(translated);
  }
  for (const source of bookKeys) {
    if (!out.includes(source)) continue;
    const translated = pickLocaleCopy(book[source], locale);
    if (!isUsableTranslation(source, translated, locale)) continue;
    out = out.split(source).join(translated);
  }
  // Longest-key replacement may leave stray Hebrew words. Reject hybrids.
  if (isUsableTranslation(text, out, locale) && hebrewScore(out) === 0) {
    return adaptBuiltInDirectionalCss(out, locale);
  }
  return adaptBuiltInDirectionalCss(text, locale);
}

export function localizeBuiltInText(text: string, language?: string): string {
  if (!text) return text;
  const locale = localeKey(language);
  if (locale === "he") return text;
  if (looksLikeHtml(text)) return localizeHtmlDocument(text, locale);
  return localizePlainBuiltInText(text, locale);
}

export function localizeBuiltInTemplateSeed<T>(data: T, language?: string): T {
  if (data == null) return data;
  const locale = localeKey(language);
  if (locale === "he") return data;

  const walk = (value: unknown): unknown => {
    if (typeof value === "string") return localizeBuiltInText(value, locale);
    if (Array.isArray(value)) return value.map(walk);
    if (value && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value as Record<string, unknown>).map(([key, child]) => [
          key,
          walk(child),
        ]),
      );
    }
    return value;
  };

  return walk(data) as T;
}

/** Localize a built-in Hebrew demo string for the active dashboard language. */
export function tx(text: string, language?: string): string {
  return localizeBuiltInText(text, language);
}
