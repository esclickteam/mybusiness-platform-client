/**
 * unique37 — leftover newly-inserted section/element chrome after unique36.
 * Skip personal names, streets, cities, Admin/Staff, hybrids, and smash-hazard singles.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  "חבילות ומחירים ברורים": r(
    "Clear packages and prices",
    "Paquetes y precios claros",
    "Pacotes e preços claros",
    "باقات وأسعار واضحة",
  ),
  "האנשים מאחורי המותג": r(
    "The people behind the brand",
    "Las personas detrás de la marca",
    "As pessoas por trás da marca",
    "الأشخاص خلف العلامة",
  ),
  "המספרים מספרים\nאת הסיפור": r(
    "The numbers tell\nthe story",
    "Los números cuentan\nla historia",
    "Os números contam\na história",
    "الأرقام تروي\nالقصة",
  ),
  "המספרים מספרים": r(
    "The numbers tell",
    "Los números cuentan",
    "Os números contam",
    "الأرقام تروي",
  ),
  "את הסיפור": r(
    "the story",
    "la historia",
    "a história",
    "القصة",
  ),
  "נתונים וסטטיסטיקות": r(
    "Data and statistics",
    "Datos y estadísticas",
    "Dados e estatísticas",
    "بيانات وإحصاءات",
  ),
  "שאלות שחשוב לשאול": r(
    "Questions worth asking",
    "Preguntas que conviene hacer",
    "Perguntas que vale a pena fazer",
    "أسئلة يستحق طرحها",
  ),
  "מסמכים מקצועיים במהירות.": r(
    "Professional documents, fast.",
    "Documentos profesionales, rápido.",
    "Documentos profissionais, rápido.",
    "مستندات احترافية بسرعة.",
  ),
  "יומן אוטומטי בלי חיכוך.": r(
    "An automatic calendar without friction.",
    "Un calendario automático sin fricción.",
    "Uma agenda automática sem atrito.",
    "تقويم تلقائي بلا احتكاك.",
  ),
  "נוכחות שממירה מבקרים.": r(
    "A presence that converts visitors.",
    "Una presencia que convierte visitantes.",
    "Uma presença que converte visitantes.",
    "حضور يحوّل الزوّار.",
  ),
  "המלצות פעולה לעסק.": r(
    "Action recommendations for the business.",
    "Recomendaciones de acción para el negocio.",
    "Recomendações de ação para o negócio.",
    "توصيات إجراء للعمل.",
  ),
  "רשת שיתופי פעולה.": r(
    "A collaboration network.",
    "Una red de colaboraciones.",
    "Uma rede de colaborações.",
    "شبكة تعاون.",
  ),
  "תוכן המלצה ראשית": r(
    "Main testimonial content",
    "Contenido del testimonio principal",
    "Conteúdo do depoimento principal",
    "محتوى الشهادة الرئيسية",
  ),
  "כותרת קטנה אודות": r(
    "Small about heading",
    "Título pequeño de acerca de",
    "Título pequeno sobre",
    "عنوان صغير عنّا",
  ),
  "טופס בקשת שירות": r(
    "Service request form",
    "Formulario de solicitud de servicio",
    "Formulário de pedido de serviço",
    "نموذج طلب خدمة",
  ),
  "טקסט כפתור ראשי": r(
    "Primary button text",
    "Texto del botón principal",
    "Texto do botão principal",
    "نص الزر الرئيسي",
  ),
  "כותרת קביעת תור": r(
    "Booking heading",
    "Título de reserva",
    "Título de agendamento",
    "عنوان حجز الموعد",
  ),
  "תמונת נכס ראשון": r(
    "First property image",
    "Imagen de la primera propiedad",
    "Imagem do primeiro imóvel",
    "صورة العقار الأول",
  ),
  " · דמו זמני — הוסיפו מוצרים בפאנל חנות": r(
    " · temporary demo — add products in the store panel",
    " · demo temporal — añadid productos en el panel de tienda",
    " · demo temporário — adicionem produtos no painel da loja",
    " · عرض مؤقت — أضيفوا منتجات في لوحة المتجر",
  ),
  " · המוצרים מהחנות שלך": r(
    " · products from your store",
    " · productos de vuestra tienda",
    " · produtos da sua loja",
    " · منتجات من متجركم",
  ),
  "מחיר: נמוך לגבוה": r(
    "Price: low to high",
    "Precio: de menor a mayor",
    "Preço: do menor ao maior",
    "السعر: من الأقل إلى الأعلى",
  ),
  "מחיר: גבוה לנמוך": r(
    "Price: high to low",
    "Precio: de mayor a menor",
    "Preço: do maior ao menor",
    "السعر: من الأعلى إلى الأقل",
  ),
  "שם השירות": r(
    "Service name",
    "Nombre del servicio",
    "Nome do serviço",
    "اسم الخدمة",
  ),
  "העסק שלך": r(
    "Your business",
    "Vuestro negocio",
    "Seu negócio",
    "نشاطكم",
  ),
};

const out = join(dirname(fileURLToPath(import.meta.url)), "../src/i18n/templateExactLexicon.unique37.json");
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique37 rows`);
