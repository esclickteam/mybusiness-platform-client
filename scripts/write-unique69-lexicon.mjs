/**
 * unique69 — leftover gallery catalog chrome (PulseCore, Cyclora, and
 * early catalog descriptions that still return Hebrew because phrasebook smash
 * leaves Hebrew letters). Skip names, streets, Admin/Staff.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const r = (en, es, pt, ar) => ({ en, es, "pt-BR": pt, ar });

const rows = {
  פיטנס: r("Fitness", "Fitness", "Fitness", "لياقة"),
  סיקלורה: r("Cyclora", "Cyclora", "Cyclora", "Cyclora"),

  "תבנית פיטנס אנרגטית למאמנים, חדרי כושר וסטודיואים עם Hero חזק, תוכניות, מאמנים, מחירים, מערכת שעות וטופס הצטרפות.": r(
    "An energetic fitness template for trainers, gyms, and studios with a strong hero, programs, coaches, prices, a timetable, and a join form.",
    "Una plantilla de fitness enérgica para entrenadores, gimnasios y estudios con un hero potente, programas, coaches, precios, horario y un formulario de alta.",
    "Um modelo de fitness energético para treinadores, academias e estúdios com um hero forte, programas, coaches, preços, horários e um formulário de inscrição.",
    "قالب لياقة نشيط للمدربين والنوادي والاستوديوهات مع هيرو قوي وبرامج ومدربين وأسعار وجدول وطلب انضمام.",
  ),

  "תבנית יוקרתית ומודרנית לסוכנות נסיעות בעברית, עם הירו גדול, יעדים, חבילות, המלצות וטופס יצירת קשר.": r(
    "A luxury modern travel-agency template, with a large hero, destinations, packages, testimonials, and a contact form.",
    "Una plantilla moderna y de lujo para agencia de viajes, con un hero grande, destinos, paquetes, testimonios y un formulario de contacto.",
    "Um modelo moderno e de luxo para agência de viagens, com um hero grande, destinos, pacotes, depoimentos e um formulário de contato.",
    "قالب حديث فاخر لوكالة سفر، مع هيرو كبير ووجهات وباقات وشهادات ونموذج تواصل.",
  ),

  "תבנית יוקרתית ומודרנית בעברית למשרד עורכי דין, עם פתיח גדול, שירותים, תיקים, תהליך וטופס ייעוץ.": r(
    "A luxury modern law-firm template, with a large opener, services, cases, a process, and a consultation form.",
    "Una plantilla moderna y de lujo para un despacho de abogados, con una apertura grande, servicios, casos, un proceso y un formulario de consulta.",
    "Um modelo moderno e de luxo para um escritório de advocacia, com uma abertura grande, serviços, casos, um processo e um formulário de consulta.",
    "قالب حديث فاخر لمكتب محاماة، مع افتتاح كبير وخدمات وقضايا ومسار ونموذج استشارة.",
  ),

  "תבנית יוקרתית לעסקים נותני שירות, יועצים, סוכנויות, קליניקות ושירותים מקצועיים. כוללת Hero חזק, שירותים, אודות, תהליך עבודה, המלצות, FAQ וטופס לידים.": r(
    "A luxury template for service businesses, advisors, agencies, clinics, and professional services. Includes a strong hero, services, about, a work process, testimonials, FAQ, and a leads form.",
    "Una plantilla de lujo para negocios de servicios, asesores, agencias, clínicas y servicios profesionales. Incluye un hero potente, servicios, sobre nosotros, un proceso de trabajo, testimonios, FAQ y un formulario de leads.",
    "Um modelo de luxo para negócios de serviços, consultores, agências, clínicas e serviços profissionais. Inclui um hero forte, serviços, sobre, um processo de trabalho, depoimentos, FAQ e um formulário de leads.",
    "قالب فاخر لأعمال الخدمات والمستشارين والوكالات والعيادات والخدمات المهنية. يشمل هيرو قوياً وخدمات ومن نحن ومسار عمل وشهادات وأسئلة ونموذج عملاء محتملين.",
  ),

  "תבנית פרימיום לעסקי שירות לבית: הנדימן, אינסטלטור, חשמלאי, מיזוג, ניקיון, הדברה, גינון ושיפוצים.": r(
    "A premium template for home-service businesses: handyman, plumber, electrician, HVAC, cleaning, pest control, gardening, and renovations.",
    "Una plantilla premium para negocios de servicios del hogar: manitas, fontanero, electricista, climatización, limpieza, control de plagas, jardinería y reformas.",
    "Um modelo premium para negócios de serviços residenciais: faz-tudo, encanador, eletricista, climatização, limpeza, controle de pragas, jardinagem e reformas.",
    "قالب مميز لأعمال خدمات المنزل: صيانة وسباكة وكهرباء وتكييف وتنظيف ومكافحة آفات وحدائق وترميمات.",
  ),

  "תבנית פרימיום כהה לסטודיו שיווק או סוכנות דיגיטלית, עם אזור פתיחה קולנועי, מדיה מרחפת, אנימציות גלילה, עבודות, המלצות, מחירון, שאלות נפוצות וקריאה לפעולה.": r(
    "A dark premium template for a marketing studio or digital agency, with a cinematic opener, floating media, scroll animations, work, testimonials, a price list, FAQ, and a call to action.",
    "Una plantilla premium oscura para un estudio de marketing o agencia digital, con una apertura cinematográfica, media flotante, animaciones de scroll, trabajos, testimonios, una lista de precios, FAQ y una llamada a la acción.",
    "Um modelo premium escuro para um estúdio de marketing ou agência digital, com uma abertura cinematográfica, mídia flutuante, animações de rolagem, trabalhos, depoimentos, uma lista de preços, FAQ e uma chamada para ação.",
    "قالب مميز داكن لاستوديو تسويق أو وكالة رقمية، مع افتتاح سينمائي ووسائط عائمة وحركات تمرير وأعمال وشهادات وقائمة أسعار وأسئلة ودعوة لإجراء.",
  ),

  "תבנית יוקרה לאקססוריז ואיקומרס, עם פס קידום, קטגוריות, מוצרים נבחרים, ערכים, קהילה, המלצות, אומנות ייצור, יומן, ניוזלטר ותחתית — בעיצוב קרם ושחור אלגנטי.": r(
    "A luxury accessories and ecommerce template, with a promo bar, categories, featured products, values, community, testimonials, craft, a journal, a newsletter, and a footer — in cream and elegant black.",
    "Una plantilla de lujo para accesorios y ecommerce, con una barra promocional, categorías, productos destacados, valores, comunidad, testimonios, oficio, un diario, un boletín y un pie — en crema y negro elegante.",
    "Um modelo de luxo para acessórios e e-commerce, com uma barra promocional, categorias, produtos em destaque, valores, comunidade, depoimentos, ofício, um diário, uma newsletter e um rodapé — em creme e preto elegante.",
    "قالب فاخر للإكسسوارات والتجارة الإلكترونية، مع شريط ترويج وفئات ومنتجات مختارة وقيم ومجتمع وشهادات وحِرفة ويوميات ونشرة وتذييل — بكريمة وأسود أنيق.",
  ),
};

const out = join(
  dirname(fileURLToPath(import.meta.url)),
  "../src/i18n/templateExactLexicon.unique69.json",
);
writeFileSync(out, JSON.stringify(rows, null, 2) + "\n");
console.log(`wrote ${Object.keys(rows).length} unique69 rows`);
