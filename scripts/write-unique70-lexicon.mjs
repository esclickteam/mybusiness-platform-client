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
  "הדגשת ייצור": r("Craft accent", "Acento de oficio", "Destaque de ofício", "إبراز الحرفة"),
  "הערת פרטיות": r("Privacy note", "Nota de privacidad", "Nota de privacidade", "ملاحظة خصوصية"),
  "טקסט הוכחה": r("Proof text", "Texto de prueba", "Texto de prova", "نص إثبات"),
  "טקסט כפתור יצירת קשר": r("Contact button text", "Texto del botón de contacto", "Texto do botão de contato", "نص زر التواصل"),
  "טקסט משלים": r("Supporting text", "Texto de apoyo", "Texto de apoio", "نص مساند"),
  "טקסט קידום": r("Promo text", "Texto promocional", "Texto promocional", "نص ترويج"),
  "כותרת ייצור": r("Craft title", "Título de oficio", "Título de ofício", "عنوان الحرفة"),
  "כותרת מרכזית": r("Center title", "Título central", "Título central", "عنوان مركزي"),
  "כותרת ניוזלטר": r("Newsletter title", "Título del boletín", "Título da newsletter", "عنوان النشرة"),
  "כותרת תחתונה": r("Footer title", "Título del pie", "Título do rodapé", "عنوان التذييل"),
  "כפתור הרשמה": r("Subscribe button", "Botón de registro", "Botão de inscrição", "زر التسجيل"),
  "כפתור ייצור": r("Craft button", "Botón de oficio", "Botão de ofício", "زر الحرفة"),
  "מחיר לפני הנחה": r("Price before discount", "Precio antes del descuento", "Preço antes do desconto", "السعر قبل الخصم"),
  "מטא הוכחה": r("Proof meta", "Meta de prueba", "Meta de prova", "وصف إثبات"),
  "עמוד מוצר": r("Product page", "Página de producto", "Página do produto", "صفحة المنتج"),
  ערכים: r("Values", "Valores", "Valores", "قيم"),
  "פס יתרונות": r("Benefits bar", "Barra de ventajas", "Barra de vantagens", "شريط المزايا"),
  "פס קידום": r("Promo bar", "Barra promocional", "Barra promocional", "شريط ترويج"),
  "פרויקט מוביל": r("Featured project", "Proyecto destacado", "Projeto em destaque", "مشروع بارز"),
  "קטלוג מוצרים": r("Product catalog", "Catálogo de productos", "Catálogo de produtos", "كتالوج المنتجات"),
  "קישור קידום": r("Promo link", "Enlace promocional", "Link promocional", "رابط ترويج"),
  "שם תוכנית": r("Plan name", "Nombre del plan", "Nome do plano", "اسم الخطة"),
  "תגית ייצור": r("Craft tag", "Etiqueta de oficio", "Tag de ofício", "وسم الحرفة"),
  "תגית פתיחה": r("Opening tag", "Etiqueta de apertura", "Tag de abertura", "وسم الافتتاح"),
  "תגית קריאה לפעולה": r("CTA tag", "Etiqueta de CTA", "Tag de CTA", "وسم دعوة للإجراء"),
  "תגית תוכנית": r("Plan tag", "Etiqueta de plan", "Tag do plano", "وسم الخطة"),
  "תווית הוכחה": r("Proof label", "Etiqueta de prueba", "Rótulo de prova", "تسمية إثبات"),
  "תיאור ייצור": r("Craft description", "Descripción de oficio", "Descrição de ofício", "وصف الحرفة"),
  "תיאור ניוזלטר": r("Newsletter description", "Descripción del boletín", "Descrição da newsletter", "وصف النشرة"),
  "תיאור עמוד מוצרים": r("Products page description", "Descripción de la página de productos", "Descrição da página de produtos", "وصف صفحة المنتجات"),
  "תיאור מוצר": r("Product description", "Descripción del producto", "Descrição do produto", "وصف المنتج"),
  "עמודת מדיה וטופס": r("Media and form column", "Columna de media y formulario", "Coluna de mídia e formulário", "عمود وسائط ونموذج"),
  "כרטיס תמונה ראשי": r("Main image card", "Tarjeta de imagen principal", "Cartão de imagem principal", "بطاقة الصورة الرئيسية"),
  "תוכן אזור הפתיחה": r("Hero content", "Contenido del hero", "Conteúdo do hero", "محتوى الهيرو"),
  "הדגשת הכותרת": r("Title accent", "Acento del título", "Destaque do título", "إبراز العنوان"),
  "כרטיס שירות חירום": r("Emergency service card", "Tarjeta de servicio de emergencia", "Cartão de serviço de emergência", "بطاقة خدمة طوارئ"),
  "כותרת שירות חירום": r("Emergency service title", "Título de servicio de emergencia", "Título de serviço de emergência", "عنوان خدمة الطوارئ"),
  "תיאור שירות חירום": r("Emergency service description", "Descripción del servicio de emergencia", "Descrição do serviço de emergência", "وصف خدمة الطوارئ"),
  "כפתור חייגו עכשיו": r("Call now button", "Botón de llamar ahora", "Botão de ligar agora", "زر اتصلوا الآن"),
  "כרטיס הוכחת מקצועיות": r("Proof card", "Tarjeta de prueba profesional", "Cartão de prova profissional", "بطاقة إثبات مهني"),
  "כותרת הכרטיס": r("Card title", "Título de la tarjeta", "Título do cartão", "عنوان البطاقة"),
  "תיאור הכרטיס": r("Card description", "Descripción de la tarjeta", "Descrição do cartão", "وصف البطاقة"),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique70.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique70 rows`);
