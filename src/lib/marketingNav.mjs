/**
 * Public header. Six topics.
 * Company stays in the footer (About, contact, partners).
 * Industry URLs stay under Solutions.
 * Missing pages are omitted rather than linked:
 * - /support is a noindex donation page, not a help center
 * - /integrations is a private callback, not a catalog
 * - there is no small-business page and no sales-team page
 * - there is no separate documentation catalog; guides stay under Resources
 */

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function pack(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function text(row, locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  return (row && (row[language] || row.en)) || "";
}

const LABEL = {
  platform: pack("Platform", "פלטפורמה", "Plataforma", "Plataforma", "المنصة"),
  products: pack("Products", "מוצרים", "Productos", "Produtos", "المنتجات"),
  solutions: pack("Solutions", "פתרונות", "Soluciones", "Soluções", "الحلول"),
  support: pack("Support", "תמיכה", "Soporte", "Suporte", "الدعم"),
  resources: pack("Resources", "משאבים", "Recursos", "Recursos", "الموارد"),
  pricing: pack("Pricing", "מחירים", "Precios", "Preços", "الأسعار"),
  platformCol: pack("The platform", "הפלטפורמה", "La plataforma", "A plataforma", "المنصة"),
  customersCol: pack("Customer management", "ניהול לקוחות", "Gestión de clientes", "Gestão de clientes", "إدارة العملاء"),
  marketingCol: pack("Marketing and communication", "שיווק ותקשורת", "Marketing y comunicación", "Marketing e comunicação", "التسويق والتواصل"),
  buildCol: pack("Websites and automations", "אתרים ואוטומציות", "Sitios y automatización", "Sites e automação", "المواقع والأتمتة"),
  saasCol: pack("SaaS systems", "מערכות SaaS", "Sistemas SaaS", "Sistemas SaaS", "أنظمة SaaS"),
  needCol: pack("By business need", "לפי צורך עסקי", "Por necesidad", "Por necessidade", "حسب الحاجة"),
  industryCol: pack("By industry", "לפי ענף", "Por sector", "Por setor", "حسب القطاع"),
  supportCol: pack("Support", "תמיכה", "Soporte", "Suporte", "الدعم"),
  libraryCol: pack("Library", "הספרייה", "Biblioteca", "Biblioteca", "المكتبة"),
  toolsCol: pack("Tools", "כלים", "Herramientas", "Ferramentas", "أدوات"),
};

const ITEM = {
  overview: {
    to: "/platform",
    icon: "overview",
    label: pack("Platform overview", "סקירת הפלטפורמה", "Resumen de la plataforma", "Visão da plataforma", "نظرة على المنصة"),
    blurb: pack(
      "How a lead, a customer, and the next task sit in one place.",
      "איך ליד, לקוח והמשימה הבאה יושבים במקום אחד.",
      "Cómo conviven un lead, un cliente y la siguiente tarea.",
      "Como um lead, um cliente e a próxima tarefa ficam no mesmo lugar.",
      "كيف يجتمع العميل المحتمل والعميل والمهمة التالية في مكان واحد.",
    ),
  },
  how: {
    to: "/how-it-works",
    icon: "flow",
    label: pack("How it works", "איך זה עובד", "Cómo funciona", "Como funciona", "كيف يعمل"),
    blurb: pack(
      "From the first inquiry to the next task.",
      "מהפנייה הראשונה עד המשימה הבאה.",
      "De la primera consulta a la siguiente tarea.",
      "Do primeiro contato à próxima tarefa.",
      "من أول استفسار حتى المهمة التالية.",
    ),
  },
  features: {
    to: "/features",
    icon: "features",
    label: pack("Features", "יכולות", "Funciones", "Funcionalidades", "الإمكانات"),
    blurb: pack(
      "What is on the platform, and what stays on a specific plan.",
      "מה נמצא בפלטפורמה, ומה נשאר בחבילה מסוימת.",
      "Qué está en la plataforma y qué queda en un plan concreto.",
      "O que está na plataforma e o que fica em um plano específico.",
      "ما هو موجود في المنصة، وما يبقى في خطة محددة.",
    ),
  },
  workflows: {
    to: "/automations",
    icon: "automation",
    label: pack("Automation and workflows", "אוטומציה ותהליכים", "Automatización y flujos", "Automação e fluxos", "الأتمتة ومسارات العمل"),
    blurb: pack(
      "On the business plan, a new lead can create a follow-up task.",
      "בחבילה העסקית, ליד חדש יכול ליצור משימת המשך.",
      "En el plan de negocio, un lead nuevo puede crear una tarea de seguimiento.",
      "No plano de negócios, um lead novo pode criar uma tarefa de acompanhamento.",
      "في الخطة التجارية، يمكن لعميل محتمل جديد أن ينشئ مهمة متابعة.",
    ),
  },
  crm: {
    to: "/crm",
    icon: "crm",
    label: pack("CRM", "CRM", "CRM", "CRM", "CRM"),
    blurb: pack(
      "Leads, customers, and the next task.",
      "לידים, לקוחות והמשימה הבאה.",
      "Leads, clientes y la siguiente tarea.",
      "Leads, clientes e a próxima tarefa.",
      "عملاء محتملون وعملاء والمهمة التالية.",
    ),
  },
  whatsapp: {
    to: "/whatsapp-api",
    icon: "whatsapp",
    label: pack("WhatsApp Business API", "WhatsApp Business API", "WhatsApp Business API", "WhatsApp Business API", "WhatsApp Business API"),
    blurb: pack(
      "$29 a month per connected number, plus Meta message fees.",
      "29 דולר לחודש למספר מחובר, ובנוסף חיובי ההודעות של Meta.",
      "29 dólares al mes por número conectado, más las tarifas de mensajes de Meta.",
      "29 dólares por mês por número conectado, mais as tarifas de mensagem da Meta.",
      "29 دولاراً شهرياً لكل رقم متصل، إضافة إلى رسوم رسائل Meta.",
    ),
  },
  campaigns: {
    to: "/meta-campaigns",
    icon: "campaigns",
    label: pack("Marketing and campaigns", "שיווק וקמפיינים", "Marketing y campañas", "Marketing e campanhas", "التسويق والحملات"),
    blurb: pack(
      "Meta campaigns, with leads that can enter the CRM.",
      "קמפיינים של Meta, עם לידים שיכולים להיכנס ל־CRM.",
      "Campañas de Meta, con leads que pueden entrar al CRM.",
      "Campanhas da Meta, com leads que podem entrar no CRM.",
      "حملات Meta، مع عملاء محتملين يمكن أن يدخلوا إلى CRM.",
    ),
  },
  websites: {
    to: "/website-builder",
    icon: "website",
    label: pack("Website builder", "בניית אתרים", "Creador de sitios", "Construtor de sites", "منشئ المواقع"),
    blurb: pack(
      "Publish a site, and send a supported form into the CRM.",
      "מפרסמים אתר, וטופס נתמך יכול ליצור ליד ב־CRM.",
      "Publique un sitio y envíe un formulario compatible al CRM.",
      "Publique um site e envie um formulário compatível ao CRM.",
      "انشروا موقعاً، ويمكن لنموذج مدعوم أن ينشئ عميلاً محتملاً في CRM.",
    ),
  },
  appointments: {
    to: "/appointments",
    icon: "calendar",
    label: pack("Appointments", "פגישות", "Citas", "Agendamentos", "المواعيد"),
    blurb: pack(
      "Open times, a service, and the booking on the customer card.",
      "חלונות פנויים, שירות, והתור על כרטיס הלקוח.",
      "Horarios libres, un servicio y la reserva en la ficha.",
      "Horários livres, um serviço e o agendamento na ficha.",
      "أوقات متاحة وخدمة والحجز على بطاقة العميل.",
    ),
  },
  agents: {
    to: "/agents",
    icon: "ai",
    label: pack("AI advisor", "יועץ AI", "Asesor de IA", "Consultor de IA", "مستشار الذكاء الاصطناعي"),
    blurb: pack(
      "The business plan includes the advisor and AI automations.",
      "החבילה העסקית כוללת את היועץ ואוטומציות AI.",
      "El plan de negocio incluye el asesor y las automatizaciones de IA.",
      "O plano de negócios inclui o consultor e as automações de IA.",
      "تشمل الخطة التجارية المستشار وأتمتة الذكاء الاصطناعي.",
    ),
  },
  automation: {
    to: "/automations",
    icon: "automation",
    label: pack("Business automation", "אוטומציה עסקית", "Automatización del negocio", "Automação do negócio", "أتمتة الأعمال"),
    blurb: pack(
      "A new lead can create a follow-up task on the business plan.",
      "ליד חדש יכול ליצור משימת המשך בחבילה העסקית.",
      "Un lead nuevo puede crear una tarea de seguimiento en el plan de negocio.",
      "Um lead novo pode criar uma tarefa de acompanhamento no plano de negócios.",
      "يمكن لعميل محتمل جديد أن ينشئ مهمة متابعة في الخطة التجارية.",
    ),
  },
  systems: {
    to: "/saas",
    icon: "catalog",
    label: pack("SaaS systems", "מערכות SaaS", "Sistemas SaaS", "Sistemas SaaS", "أنظمة SaaS"),
    blurb: pack(
      "Ready systems for a specific kind of business.",
      "מערכות מוכנות לסוג עסק מסוים.",
      "Sistemas listos para un tipo concreto de negocio.",
      "Sistemas prontos para um tipo específico de negócio.",
      "أنظمة جاهزة لنوع محدد من الأعمال.",
    ),
  },
  clinics: {
    to: "/solutions/clinics",
    icon: "clinic",
    label: pack("Clinics", "קליניקות", "Clínicas", "Clínicas", "عيادات"),
    blurb: pack(
      "Inquiries and appointments for a clinic.",
      "פניות ותורים לקליניקה.",
      "Consultas y citas para una clínica.",
      "Pedidos e horários para uma clínica.",
      "طلبات ومواعيد لعيادة.",
    ),
  },
  beauty: {
    to: "/solutions/beauty",
    icon: "beauty",
    label: pack("Beauty", "מכוני יופי", "Belleza", "Beleza", "التجميل"),
    blurb: pack(
      "Bookings and a client file for a beauty studio.",
      "זימון ותיק לקוח למכון יופי.",
      "Reservas y un expediente para un estudio de belleza.",
      "Reservas e um arquivo para um estúdio de beleza.",
      "حجوزات وملف عميل لمعهد تجميل.",
    ),
  },
  realEstate: {
    to: "/solutions/real-estate",
    icon: "estate",
    label: pack("Real estate", "נדל״ן", "Inmuebles", "Imóveis", "العقارات"),
    blurb: pack(
      "Follow a property inquiry without a separate spreadsheet.",
      "מעקב אחרי פניית נכס בלי גיליון נפרד.",
      "Seguir una consulta de inmueble sin una hoja aparte.",
      "Acompanhar um pedido de imóvel sem uma planilha à parte.",
      "متابعة استفسار عن عقار دون جدول منفصل.",
    ),
  },
  restaurants: {
    to: "/solutions/restaurants",
    icon: "restaurant",
    label: pack("Restaurants", "מסעדות", "Restaurantes", "Restaurantes", "المطاعم"),
    blurb: pack(
      "Inquiries in the CRM. Ordering systems stay in the catalog.",
      "פניות ב־CRM. מערכות הזמנה נשארות בקטלוג.",
      "Consultas en el CRM. Los pedidos siguen en el catálogo.",
      "Contatos no CRM. Os pedidos continuam no catálogo.",
      "الاستفسارات في CRM. أنظمة الطلب تبقى في الكتالوج.",
    ),
  },
  service: {
    to: "/solutions/service-businesses",
    icon: "service",
    label: pack("Service businesses", "נותני שירות", "Servicios", "Prestadores", "مقدمو الخدمات"),
    blurb: pack(
      "From the first inquiry to the visit.",
      "מהפנייה הראשונה ועד הביקור.",
      "De la primera consulta a la visita.",
      "Do primeiro contato à visita.",
      "من أول طلب حتى الزيارة.",
    ),
  },
  agencies: {
    to: "/solutions/agencies",
    icon: "agency",
    label: pack("Marketing agencies", "סוכנויות שיווק", "Agencias de marketing", "Agências de marketing", "وكالات التسويق"),
    blurb: pack(
      "The agency's own pipeline, not every client's inbox.",
      "הצינור של הסוכנות עצמה, לא תיבת הדואר של כל לקוח.",
      "El pipeline de la agencia, no la bandeja de cada cliente.",
      "O pipeline da agência, não a caixa de cada cliente.",
      "مسار الوكالة نفسها، لا صندوق كل عميل.",
    ),
  },
  leads: {
    to: "/solutions/lead-based",
    icon: "leads",
    label: pack("Lead-based businesses", "עסקים מבוססי לידים", "Negocios de leads", "Negócios de leads", "أعمال العملاء المحتملين"),
    blurb: pack(
      "One pipeline for every place a lead starts.",
      "צינור אחד לכל מקום שבו ליד מתחיל.",
      "Un pipeline para cada lugar donde nace un lead.",
      "Um pipeline para cada lugar onde um lead nasce.",
      "مسار واحد لكل مكان يبدأ فيه عميل محتمل.",
    ),
  },
  gettingStarted: {
    to: "/resources#start-here",
    icon: "start",
    label: pack("Getting started", "מדריכי התחלה", "Primeros pasos", "Primeiros passos", "البدء"),
    blurb: pack(
      "Starter guides for the first setup.",
      "מדריכים לצעדים הראשונים.",
      "Guías para los primeros pasos.",
      "Guias para os primeiros passos.",
      "أدلة للخطوات الأولى.",
    ),
  },
  faq: {
    to: "/faq",
    icon: "faq",
    label: pack("FAQ", "שאלות נפוצות", "Preguntas frecuentes", "Perguntas frequentes", "أسئلة شائعة"),
    blurb: pack(
      "Short answers about plans, products, and limits.",
      "תשובות קצרות על חבילות, מוצרים ומגבלות.",
      "Respuestas breves sobre planes, productos y límites.",
      "Respostas curtas sobre planos, produtos e limites.",
      "إجابات قصيرة عن الخطط والمنتجات والحدود.",
    ),
  },
  contact: {
    to: "/contact",
    icon: "contact",
    label: pack("Contact support", "יצירת קשר עם התמיכה", "Contactar con soporte", "Falar com o suporte", "التواصل مع الدعم"),
    blurb: pack(
      "Send a question to the team.",
      "שליחת שאלה לצוות.",
      "Envíe una pregunta al equipo.",
      "Envie uma pergunta à equipe.",
      "أرسلوا سؤالاً إلى الفريق.",
    ),
  },
  library: {
    to: "/resources",
    icon: "library",
    label: pack("Resource center", "מרכז המשאבים", "Centro de recursos", "Central de recursos", "مركز الموارد"),
    blurb: pack(
      "Guides, templates, calculators, and comparisons.",
      "מדריכים, תבניות, מחשבונים והשוואות.",
      "Guías, plantillas, calculadoras y comparaciones.",
      "Guias, modelos, calculadoras e comparações.",
      "أدلة وقوالب وحاسبات ومقارنات.",
    ),
  },
  guides: {
    to: "/guides",
    icon: "guides",
    label: pack("Guides and articles", "מדריכים ומאמרים", "Guías y artículos", "Guias e artigos", "أدلة ومقالات"),
    blurb: pack(
      "Guides for CRM, WhatsApp, sites, and campaigns.",
      "מדריכים ל־CRM, ל־WhatsApp, לאתרים ולקמפיינים.",
      "Guías de CRM, WhatsApp, sitios y campañas.",
      "Guias de CRM, WhatsApp, sites e campanhas.",
      "أدلة لـ CRM وواتساب والمواقع والحملات.",
    ),
  },
  templates: {
    to: "/templates",
    icon: "templates",
    label: pack("Templates", "תבניות", "Plantillas", "Modelos", "قوالب"),
    blurb: pack(
      "Excel workbooks for leads, follow-up, and a funnel.",
      "חוברות Excel ללידים, למעקב ולמשפך.",
      "Libros de Excel para leads, seguimiento y un embudo.",
      "Planilhas de Excel para leads, acompanhamento e um funil.",
      "مصنفات Excel للعملاء المحتملين والمتابعة والقمع.",
    ),
  },
  calculators: {
    to: "/templates#calculators",
    icon: "calculator",
    label: pack("Calculators", "מחשבונים", "Calculadoras", "Calculadoras", "حاسبات"),
    blurb: pack(
      "Conversion rate, cost per lead, and return.",
      "שיעור המרה, עלות לליד ותשואה.",
      "Tasa de conversión, costo por lead y retorno.",
      "Taxa de conversão, custo por lead e retorno.",
      "معدل التحويل وتكلفة العميل المحتمل والعائد.",
    ),
  },
  glossary: {
    to: "/glossary",
    icon: "glossary",
    label: pack("Glossary", "מילון מושגים", "Glosario", "Glossário", "معجم"),
    blurb: pack(
      "Terms used on the product pages, with a short definition.",
      "מונחים מעמודי המוצר, עם הגדרה קצרה.",
      "Términos de las páginas de producto, con una definición breve.",
      "Termos das páginas de produto, com uma definição curta.",
      "مصطلحات من صفحات المنتج، مع تعريف قصير.",
    ),
  },
  comparisons: {
    to: "/compare",
    icon: "compare",
    label: pack("Comparisons", "השוואות", "Comparaciones", "Comparações", "مقارنات"),
    blurb: pack(
      "Two ways to handle the same job.",
      "שתי דרכים לאותה עבודה.",
      "Dos formas de hacer el mismo trabajo.",
      "Duas formas de fazer o mesmo trabalho.",
      "طريقتان للعمل نفسه.",
    ),
  },
  paths: {
    to: "/academy",
    icon: "path",
    label: pack("Learning paths", "מסלולי קריאה", "Rutas de lectura", "Trilhas de leitura", "مسارات قراءة"),
    blurb: pack(
      "Short sequences through the guides.",
      "רצפים קצרים מתוך המדריכים.",
      "Secuencias cortas a través de las guías.",
      "Sequências curtas pelos guias.",
      "تسلسلات قصيرة من الأدلة.",
    ),
  },
};

function item(key, locale) {
  const row = ITEM[key];
  return {
    to: row.to,
    icon: row.icon,
    label: text(row.label, locale),
    blurb: text(row.blurb, locale),
  };
}

function column(id, title, keys, locale, layout = 1) {
  return {
    id,
    title: text(title, locale),
    layout,
    links: keys.map((key) => item(key, locale)),
  };
}

export function marketingNav(locale) {
  const language = LOCALES.includes(locale) ? locale : locale === "pt" ? "pt-BR" : "en";
  return [
    {
      id: "platform",
      label: text(LABEL.platform, language),
      columns: [column("platform", LABEL.platformCol, ["overview", "how", "features"], language, 3)],
    },
    {
      id: "products",
      label: text(LABEL.products, language),
      columns: [
        column("customers", LABEL.customersCol, ["crm", "appointments"], language),
        column("marketing", LABEL.marketingCol, ["whatsapp", "campaigns"], language),
        column("build", LABEL.buildCol, ["websites", "automation", "agents"], language),
        column("saas", LABEL.saasCol, ["systems"], language),
      ],
    },
    {
      id: "solutions",
      label: text(LABEL.solutions, language),
      columns: [
        column("needs", LABEL.needCol, ["leads", "service", "agencies"], language),
        column("industries", LABEL.industryCol, ["clinics", "beauty", "realEstate", "restaurants"], language),
      ],
    },
    {
      id: "support",
      label: text(LABEL.support, language),
      columns: [column("support", LABEL.supportCol, ["faq", "contact"], language, 2)],
    },
    {
      id: "resources",
      label: text(LABEL.resources, language),
      columns: [
        column("library", LABEL.libraryCol, ["library", "guides", "paths"], language),
        column("tools", LABEL.toolsCol, ["templates", "calculators", "glossary", "comparisons"], language),
      ],
    },
    {
      id: "pricing",
      label: text(LABEL.pricing, language),
      to: "/pricing",
    },
  ];
}

const INDUSTRY_ORDER = ["clinics", "beauty", "realEstate", "restaurants", "service", "agencies", "leads"];
const INDUSTRY_LABEL = pack("Industries", "ענפים", "Sectores", "Setores", "القطاعات");

export function industryNav(locale) {
  const language = LOCALES.includes(locale) ? locale : locale === "pt" ? "pt-BR" : "en";
  return {
    label: text(INDUSTRY_LABEL, language),
    links: INDUSTRY_ORDER.map((key) => {
      const link = item(key, language);
      return [link.to, link.label, link.blurb];
    }),
  };
}
