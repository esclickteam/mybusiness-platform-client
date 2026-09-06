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
const FROM_PRICE_RE = /^החל מ[־\-]?₪(\d+)$/;
const BURGER_SMASH_RE = /^(.+) — לחמנייה, בשר, גבינה — בלי פילוסופיה\.$/;
const AGENCY_SHARP_RE = /^([A-Za-z][\w.-]*) — סוכנות (.+) עם תהליך חד ותוצאות מדידות\.$/;
const INDEXED_LABEL_RE = /^(.+?)\s+(\d+(?:\.\d+)?)$/;
const STORE_SHOPPING_RE = /^([A-Za-z][\w.-]*) — (.+) עם חוויית קנייה מלאה\.$/;
const SOIL_TO_PLATE_RE = /^(.+) — מהאדמה לצלחת — בלי פשרות על טעם\.$/;
const AGENCY_SIGNATURE_RE = /^([A-Za-z][\w.-]*) — סוכנות (.+) עם חתימת (.+)$/;

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

function localizeFromPrice(text: string, locale: string): string {
  const match = text.match(FROM_PRICE_RE);
  if (!match) return "";
  const amount = `₪${match[1]}`;
  if (locale === "es") return `Desde ${amount}`;
  if (locale === "pt-BR") return `A partir de ${amount}`;
  if (locale === "ar") return `ابتداءً من ${amount}`;
  return `From ${amount}`;
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

function localizeOpeningHours(text: string, locale: string): string {
  if (!/א[׳']/.test(text) || !/\d{1,2}:\d{2}/.test(text)) return "";
  const tokens: Record<string, PhraseTranslation> = {
    "מוצ״ש": { en: "Sat night", es: "sáb. noche", "pt-BR": "sáb. noite", ar: "مساء السبت" },
    "א׳–ה׳": { en: "Sun–Thu", es: "dom–jue", "pt-BR": "dom–qui", ar: "أحد–خميس" },
    "א'–ה'": { en: "Sun–Thu", es: "dom–jue", "pt-BR": "dom–qui", ar: "أحد–خميس" },
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

  const fromPrice = localizeFromPrice(text, locale);
  if (isUsableTranslation(text, fromPrice, locale)) {
    return adaptBuiltInDirectionalCss(fromPrice, locale);
  }

  const openingHours = localizeOpeningHours(text, locale);
  if (isUsableTranslation(text, openingHours, locale)) {
    return adaptBuiltInDirectionalCss(openingHours, locale);
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

  const bookHit = pickLocaleCopy(book[text], locale);
  if (isUsableTranslation(text, bookHit, locale)) {
    return adaptBuiltInDirectionalCss(bookHit, locale);
  }

  // Short punchy lines must be exact. Word-by-word smash turns
  // "לילה קטן. טעמים גדולים." into "night small. flavors large."
  // Composed chrome like "דף הבית – פתיחה מפוצלת" can still use fragments.
  if (text.length <= 48 && !/[–·]/.test(text)) {
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
