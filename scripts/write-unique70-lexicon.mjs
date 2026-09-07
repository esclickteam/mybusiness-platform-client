/**
 * unique70 — leftover render fallbacks and studio editor labels after unique69.
 * Skip personal names, streets, cities, Admin/Staff, and one-letter keys.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "העגלה ריקה כרגע.": r(
    "The cart is empty right now.",
    "El carrito está vacío ahora.",
    "A sacola está vazia no momento.",
    "السلة فارغة الآن.",
  ),
  "מבט לסוכנות": r(
    "A look at the agency",
    "Una mirada a la agencia",
    "Um olhar para a agência",
    "نظرة إلى الوكالة",
  ),
  "עגלה ריקה": r("Empty cart", "Carrito vacío", "Sacola vazia", "سلة فارغة"),
  "לוגו ומותג": r("Logo and brand", "Logo y marca", "Logo e marca", "شعار وعلامة"),
  "כותרת ראשית": r("Main title", "Título principal", "Título principal", "العنوان الرئيسي"),
  "ערך סטטיסטי": r("Statistic value", "Valor estadístico", "Valor estatístico", "قيمة إحصائية"),
  "כותרת הטופס": r("Form title", "Título del formulario", "Título do formulário", "عنوان النموذج"),
  "תיאור הטופס": r("Form description", "Descripción del formulario", "Descrição do formulário", "وصف النموذج"),
  "כותרת אזור": r("Section title", "Título de zona", "Título da área", "عنوان المنطقة"),
  "כותרת האזור": r("Section title", "Título de la zona", "Título da área", "عنوان المنطقة"),
  "תיאור האזור": r("Section description", "Descripción de la zona", "Descrição da área", "وصف المنطقة"),
  "כותרת העמוד": r("Page title", "Título de la página", "Título da página", "عنوان الصفحة"),
  "כותרת משנה לעמוד": r("Page subtitle", "Subtítulo de página", "Subtítulo da página", "عنوان فرعي للصفحة"),
  "כותרת הפרויקט": r("Project title", "Título del proyecto", "Título do projeto", "عنوان المشروع"),
  "תיאור הפרויקט": r("Project description", "Descripción del proyecto", "Descrição do projeto", "وصف المشروع"),
  "תוכן קריאה לפעולה": r("Call-to-action content", "Contenido de llamada a la acción", "Conteúdo de chamada para ação", "محتوى دعوة للإجراء"),
  "תיאור קריאה לפעולה": r(
    "Call-to-action description",
    "Descripción de la llamada a la acción",
    "Descrição da chamada para ação",
    "وصف دعوة للإجراء",
  ),
  "קישור טלפון": r("Phone link", "Enlace de teléfono", "Link de telefone", "رابط الهاتف"),
  "מספר טלפון": r("Phone number", "Número de teléfono", "Número de telefone", "رقم الهاتف"),
  "תיאור העסק": r("Business description", "Descripción del negocio", "Descrição do negócio", "وصف العمل"),
  "רקע אזור פתיחה": r("Hero background", "Fondo del hero", "Fundo do hero", "خلفية الهيرو"),
  "תפריט נייד": r("Mobile menu", "Menú móvil", "Menu mobile", "قائمة الجوال"),
  "כותרת קטנה": r("Small title", "Título pequeño", "Título pequeno", "عنوان صغير"),
  "תיאור העמוד": r("Page description", "Descripción de la página", "Descrição da página", "وصف الصفحة"),
  "חיזוק שכבות תעבורה, זהות ונתונים עם בקרות שמבוססות מדיניות.": r(
    "Hardening traffic, identity, and data layers with policy-based controls.",
    "Refuerzo de capas de tráfico, identidad y datos con controles basados en política.",
    "Reforço de camadas de tráfego, identidade e dados com controles baseados em política.",
    "تعزيز طبقات المرور والهوية والبيانات بضوابط مبنية على سياسة.",
  ),
  "טלמטריה רציפה, זיהוי חריגות ומיפוי חשיפות.": r(
    "Continuous telemetry, anomaly detection, and exposure mapping.",
    "Telemetría continua, detección de anomalías y mapeo de exposiciones.",
    "Telemetria contínua, detecção de anomalias e mapeamento de exposições.",
    "قياس عن بُعد مستمر وكشف شذوذ وتعيين انكشافات.",
  ),
  "פלייבוקים לאירועים, ניתוב הכלה ודיווח ברמת דירקטוריון.": r(
    "Incident playbooks, containment routing, and board-level reporting.",
    "Playbooks de incidentes, enrutado de contención e informes a nivel de consejo.",
    "Playbooks de incidentes, roteamento de contenção e relatórios em nível de diretoria.",
    "أدلة أحداث وتوجيه احتواء وتقارير على مستوى مجلس الإدارة.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique70.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique70 rows`);
