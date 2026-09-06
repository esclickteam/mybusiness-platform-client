function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function pickLocaleMap(dict, locale) {
  return Object.fromEntries(
    Object.entries(dict).map(([key, value]) => [key, value[locale] || value.en]),
  );
}

/** Website-studio template gallery categories (Hebrew source labels stay in the phrasebook). */
const TEMPLATE_CATEGORIES = {
  all: row("All", "הכול", "Todo", "Tudo", "الكل"),
  landing: row("Landing pages", "דפי נחיתה", "Landing pages", "Landing pages", "صفحات هبوط"),
  business: row("Business and services", "עסקים ושירותים", "Negocios y servicios", "Negócios e serviços", "أعمال وخدمات"),
  "real-estate": row("Real estate", "נדל״ן", "Inmobiliaria", "Imobiliário", "عقارات"),
  portfolio: row("Portfolio and agency", "פורטפוליו וסוכנות", "Portafolio y agencia", "Portfólio e agência", "معرض أعمال ووكالة"),
  store: row("Stores and commerce", "חנויות ומסחר", "Tiendas y comercio", "Lojas e comércio", "متاجر وتجارة"),
  food: row("Food and restaurants", "אוכל ומסעדות", "Comida y restaurantes", "Comida e restaurantes", "طعام ومطاعم"),
  education: row("Education and courses", "חינוך וקורסים", "Educación y cursos", "Educação e cursos", "تعليم ودورات"),
  beauty: row("Beauty and care", "יופי וטיפוח", "Belleza y cuidado", "Beleza e cuidado", "جمال وعناية"),
  travel: row("Travel and beach", "תיירות וחוף", "Turismo y playa", "Turismo e praia", "سياحة وشاطئ"),
  technology: row("Technology", "טכנולוגיה", "Tecnología", "Tecnologia", "تكنولوجيا"),
  medical: row("Medicine and health", "רפואה ובריאות", "Medicina y salud", "Medicina e saúde", "طب وصحة"),
  fitness: row("Fitness and sport", "כושר וספורט", "Fitness y deporte", "Fitness e esporte", "لياقة ورياضة"),
  architecture: row("Architecture and construction", "אדריכלות ובנייה", "Arquitectura y construcción", "Arquitetura e construção", "عمارة وبناء"),
  finance: row("Finance and accounting", "פיננסים וחשבונאות", "Finanzas y contabilidad", "Finanças e contabilidade", "مالية ومحاسبة"),
  events: row("Events and weddings", "אירועים וחתונות", "Eventos y bodas", "Eventos e casamentos", "فعاليات وأعراس"),
  hospitality: row("Hospitality and hotels", "אירוח ומלונאות", "Hospitalidad y hoteles", "Hospitalidade e hotéis", "ضيافة وفنادق"),
  legal: row("Law firms", "עורכי דין", "Despachos de abogados", "Escritórios de advocacia", "مكاتب محاماة"),
  security: row("Cyber and security", "סייבר ואבטחה", "Ciberseguridad", "Cibersegurança", "أمن سيبراني"),
};

export function extraTemplateMetaLocaleObject(locale) {
  return {
    studio: {
      templates: {
        categories: pickLocaleMap(TEMPLATE_CATEGORIES, locale),
      },
    },
  };
}
