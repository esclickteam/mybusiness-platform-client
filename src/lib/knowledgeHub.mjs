/**
 * Resource library built on the guides that already ship.
 * /blog stays a redirect to /guides. /industries stays a redirect to /solutions.
 * /integrations stays the private connection callback, not a public catalog.
 */

import { GUIDE_SLUGS, getGuide } from "./guidesMarketing.mjs";
import { glossaryPage } from "./glossaryContent.mjs";
import { COMPARE_SLUGS, compareIndex, getCompare } from "./compareContent.mjs";

export const KNOWLEDGE_UPDATED = "2026-11-15";

const LOCALES = ["en", "he", "es", "pt-BR", "ar"];

function row(en, he, es, pt, ar) {
  return { en, he, es, "pt-BR": pt, ar };
}

function text(pack, locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  return pack[language] || pack.en;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function knowledgeHref(locale, path) {
  const language = locale === "pt" ? "pt-BR" : locale;
  const prefix = language === "he" ? "/he" : language === "es" ? "/es" : language === "ar" ? "/ar" : language === "pt-BR" ? "/pt-br" : "";
  return `${prefix}${path}`;
}

const GUIDE_META = {
  "what-is-a-crm": { cluster: "crm", poster: "/demo-media/crm/poster.jpg", start: true },
  "follow-up-on-leads": { cluster: "crm", poster: "/demo-media/crm/poster.jpg" },
  "meta-lead-ads-to-crm": { cluster: "crm", poster: "/demo-media/campaigns/poster.jpg" },
  "crm-and-business-platform": { cluster: "crm", poster: "/demo-media/crm/poster.jpg" },
  "from-ad-to-follow-up": { cluster: "crm", poster: "/demo-media/campaigns/poster.jpg" },
  "whatsapp-cloud-api-cost": { cluster: "whatsapp", poster: "/demo-media/whatsapp/poster.jpg", start: true },
  "whatsapp-message-templates": { cluster: "whatsapp", poster: "/demo-media/whatsapp/poster.jpg" },
  "business-automation": { cluster: "automations", poster: "/demo-media/automations/poster.jpg", start: true },
  "build-a-website-without-code": { cluster: "websites", poster: "/demo-media/websites/poster.jpg" },
  "website-form-to-crm": { cluster: "websites", poster: "/demo-media/websites/poster.jpg" },
  "manage-meta-campaigns": { cluster: "campaigns", poster: "/demo-media/campaigns/poster.jpg" },
  "connect-a-meta-ad-account": { cluster: "campaigns", poster: "/demo-media/campaigns/poster.jpg" },
  "appointments-for-a-service-business": { cluster: "appointments", poster: "/demo-media/appointments/poster.jpg" },
};

const POSTER_ALT = {
  crm: row("Bizuply CRM", "CRM של ביזאפלי", "CRM de Bizuply", "CRM da Bizuply", "CRM من Bizuply"),
  whatsapp: row("Bizuply WhatsApp", "וואטסאפ בביזאפלי", "WhatsApp en Bizuply", "WhatsApp na Bizuply", "واتساب في Bizuply"),
  automations: row("Bizuply automations", "אוטומציות בביזאפלי", "Automatizaciones de Bizuply", "Automações da Bizuply", "أتمتة Bizuply"),
  websites: row("Bizuply website builder", "בונה האתרים של ביזאפלי", "Constructor de Bizuply", "Construtor da Bizuply", "منشئ مواقع Bizuply"),
  campaigns: row("Bizuply campaign view", "תצוגת קמפיין בביזאפלי", "Vista de campaña de Bizuply", "Visão de campanha da Bizuply", "عرض حملة Bizuply"),
  appointments: row("Bizuply appointments", "תורים בביזאפלי", "Citas de Bizuply", "Agenda da Bizuply", "مواعيد Bizuply"),
};

export function readingMinutes(article, locale) {
  const parts = [article?.h1, article?.description, article?.lede];
  for (const section of article?.sections || []) {
    parts.push(section.heading, ...(section.paragraphs || []), ...(section.steps || []));
  }
  const words = parts.filter(Boolean).join(" ").split(/\s+/).filter(Boolean).length;
  const pace = locale === "he" || locale === "ar" ? 160 : 200;
  return Math.max(1, Math.round(words / pace));
}

export function guideCards(locale) {
  return GUIDE_SLUGS.map((slug) => {
    const article = getGuide(slug, locale) || getGuide(slug, "en");
    if (!article) return null;
    const meta = GUIDE_META[slug] || { cluster: "crm", poster: "/demo-media/crm/poster.jpg" };
    return {
      kind: "guide",
      cluster: meta.cluster,
      href: `/guides/${slug}`,
      title: article.h1,
      description: article.description,
      updated: article.updated || "2026-10-24",
      minutes: readingMinutes(article, locale),
      poster: meta.poster,
      alt: text(POSTER_ALT[meta.cluster] || POSTER_ALT.crm, locale),
      start: Boolean(meta.start),
    };
  }).filter(Boolean);
}

const CLUSTER_LABEL = {
  all: row("All topics", "כל הנושאים", "Todos los temas", "Todos os temas", "كل المواضيع"),
  crm: row("CRM and leads", "CRM ולידים", "CRM y leads", "CRM e leads", "CRM والعملاء"),
  whatsapp: row("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp", "واتساب"),
  automations: row("Automations", "אוטומציות", "Automatizaciones", "Automações", "أتمتة"),
  websites: row("Websites", "אתרים", "Sitios", "Sites", "مواقع"),
  campaigns: row("Campaigns", "קמפיינים", "Campañas", "Campanhas", "حملات"),
  appointments: row("Appointments", "תורים", "Citas", "Agenda", "مواعيد"),
};

const KIND_LABEL = {
  all: row("All types", "כל הסוגים", "Todos los tipos", "Todos os tipos", "كل الأنواع"),
  guide: row("Guides", "מדריכים", "Guías", "Guias", "أدلة"),
  template: row("Templates and tools", "תבניות וכלים", "Plantillas y herramientas", "Modelos e ferramentas", "قوالب وأدوات"),
  comparison: row("Comparisons", "השוואות", "Comparaciones", "Comparações", "مقارنات"),
  glossary: row("Glossary", "מילון", "Glosario", "Glossário", "معجم"),
  path: row("Learning paths", "מסלולי לימוד", "Rutas de aprendizaje", "Trilhas de estudo", "مسارات تعلم"),
};

export function clusterLabel(id, locale) {
  return text(CLUSTER_LABEL[id] || CLUSTER_LABEL.all, locale);
}

export function kindLabel(id, locale) {
  return text(KIND_LABEL[id] || KIND_LABEL.all, locale);
}

export const TEMPLATE_FILES = [
  {
    file: "/downloads/bizuply-lead-tracker.xlsx",
    name: "bizuply-lead-tracker.xlsx",
    title: row("Lead tracker", "מעקב לידים", "Seguimiento de leads", "Acompanhamento de leads", "متابعة العملاء المحتملين"),
    body: row(
      "A workbook with a lead sheet, a short status list, and one example row you can delete. Columns: date, name, phone, email, source, status, owner, next step, next date, notes.",
      "חוברת עם גיליון לידים, רשימת סטטוסים קצרה, ושורת דוגמה שאפשר למחוק. עמודות: תאריך, שם, טלפון, אימייל, מקור, סטטוס, אחראי, הצעד הבא, התאריך הבא, הערות.",
      "Un libro con una hoja de leads, una lista corta de estados y una fila de ejemplo que puede borrar. Columnas: fecha, nombre, teléfono, correo, origen, estado, responsable, siguiente paso, siguiente fecha, notas.",
      "Uma pasta com uma folha de leads, uma lista curta de status e uma linha de exemplo que você pode apagar. Colunas: data, nome, telefone, e-mail, origem, status, responsável, próximo passo, próxima data, notas.",
      "مصنف فيه ورقة عملاء محتملين، وقائمة حالات قصيرة، وصف مثال يمكن حذفه. الأعمدة: التاريخ، الاسم، الهاتف، البريد، المصدر، الحالة، المسؤول، الخطوة التالية، التاريخ التالي، ملاحظات.",
    ),
  },
  {
    file: "/downloads/bizuply-sales-follow-up.xlsx",
    name: "bizuply-sales-follow-up.xlsx",
    title: row("Sales follow-up", "מעקב מכירות", "Seguimiento de ventas", "Acompanhamento de vendas", "متابعة المبيعات"),
    body: row(
      "One row per open conversation: last touch, channel, what was said, the next action, and a due date.",
      "שורה אחת לכל שיחה פתוחה: מגע אחרון, ערוץ, מה נאמר, הפעולה הבאה, ותאריך יעד.",
      "Una fila por conversación abierta: último contacto, canal, qué se dijo, la siguiente acción y una fecha.",
      "Uma linha por conversa aberta: último contato, canal, o que foi dito, a próxima ação e uma data.",
      "صف واحد لكل محادثة مفتوحة: آخر تواصل، القناة، ما قيل، الفعل التالي، وتاريخ الاستحقاق.",
    ),
  },
  {
    file: "/downloads/bizuply-crm-checklist.xlsx",
    name: "bizuply-crm-checklist.xlsx",
    title: row("CRM setup checklist", "רשימת בדיקה להטמעת CRM", "Lista de puesta en marcha del CRM", "Lista de implantação do CRM", "قائمة فحص لتشغيل CRM"),
    body: row(
      "The decisions to make before the software matters: statuses, sources, owners, and what \"done\" means. Usable with any CRM.",
      "ההחלטות שצריך לקבל לפני שהתוכנה חשובה: סטטוסים, מקורות, אחראים, ומה נחשב \"טופל\". אפשר להשתמש עם כל CRM.",
      "Las decisiones anteriores al software: estados, orígenes, responsables y qué significa \"hecho\". Sirve con cualquier CRM.",
      "As decisões anteriores ao software: status, origens, responsáveis e o que significa \"feito\". Serve com qualquer CRM.",
      "القرارات التي تسبق البرنامج: الحالات، المصادر، المسؤولون، وما معنى «تم». تصلح لأي CRM.",
    ),
  },
  {
    file: "/downloads/bizuply-sales-funnel.xlsx",
    name: "bizuply-sales-funnel.xlsx",
    title: row("Sales funnel", "משפך מכירות", "Embudo de ventas", "Funil de vendas", "قمع المبيعات"),
    body: row(
      "Stages with a count entering and a count moving forward. The conversion to the next stage is a formula. A zero in the entering column stays blank instead of an error.",
      "שלבים עם כמות שנכנסת וכמות שממשיכה. ההמרה לשלב הבא היא נוסחה. אפס בעמודת הנכנסים נשאר ריק במקום שגיאה.",
      "Etapas con un recuento que entra y un recuento que avanza. La conversión a la siguiente etapa es una fórmula. Un cero en la columna de entrada queda en blanco en lugar de un error.",
      "Etapas com uma contagem que entra e uma contagem que avança. A conversão para a etapa seguinte é uma fórmula. Zero na coluna de entrada fica em branco em vez de um erro.",
      "مراحل بعدد يدخل وعدد يتقدم. التحويل إلى المرحلة التالية صيغة. الصفر في عمود الدخول يبقى فارغاً بدلاً من خطأ.",
    ),
  },
];

export function templateFiles(locale) {
  return TEMPLATE_FILES.map((item) => ({
    ...item,
    title: text(item.title, locale),
    body: text(item.body, locale),
  }));
}

const INDUSTRY_LINKS = [
  ["/solutions/service-businesses", row("Service businesses", "נותני שירות", "Servicios", "Serviços", "خدمات")],
  ["/solutions/agencies", row("Agencies", "סוכנויות", "Agencias", "Agências", "وكالات")],
  ["/solutions/clinics", row("Clinics", "קליניקות", "Clínicas", "Clínicas", "عيادات")],
  ["/solutions/beauty", row("Beauty", "מכוני יופי", "Belleza", "Beleza", "تجميل")],
  ["/solutions/real-estate", row("Real estate", "נדל״ן", "Inmuebles", "Imóveis", "عقارات")],
  ["/solutions/restaurants", row("Restaurants", "מסעדות", "Restaurantes", "Restaurantes", "مطاعم")],
  ["/solutions/lead-based", row("Lead-based businesses", "עסקים מבוססי לידים", "Negocios de leads", "Negócios de leads", "أعمال تعتمد على العملاء المحتملين")],
];

const CONNECTION_LINKS = [
  ["/guides/meta-lead-ads-to-crm", row("Meta Lead Ads into the CRM", "לידים מ־Meta אל ה־CRM", "Lead Ads de Meta al CRM", "Lead Ads da Meta no CRM", "إعلانات العملاء من Meta إلى CRM")],
  ["/guides/connect-a-meta-ad-account", row("A Meta ad account", "חשבון מודעות של Meta", "Una cuenta de anuncios de Meta", "Uma conta de anúncios da Meta", "حساب إعلانات Meta")],
  ["/guides/website-form-to-crm", row("A website form", "טופס באתר", "Un formulario del sitio", "Um formulário do site", "نموذج الموقع")],
  ["/guides/from-ad-to-follow-up", row("Google Ads lead forms, alongside Meta and the site", "טפסי Google Ads, לצד Meta והאתר", "Formularios de Google Ads, junto a Meta y el sitio", "Formulários do Google Ads, junto da Meta e do site", "نماذج Google Ads، إلى جانب Meta والموقع")],
  ["/whatsapp-api", row("WhatsApp Cloud API", "WhatsApp Cloud API", "WhatsApp Cloud API", "WhatsApp Cloud API", "WhatsApp Cloud API")],
];

export function industryLinks(locale) {
  return INDUSTRY_LINKS.map(([href, label]) => ({ href, label: text(label, locale) }));
}

export function connectionLinks(locale) {
  return CONNECTION_LINKS.map(([href, label]) => ({ href, label: text(label, locale) }));
}

export function learningPaths(locale) {
  const paths = [
    {
      id: "crm",
      title: row("CRM and leads", "CRM ולידים", "CRM y leads", "CRM e leads", "CRM والعملاء"),
      body: row(
        "Start with the record, then the follow-up, then the difference between CRM only and the business plan.",
        "מתחילים ברשומה, אחר כך במעקב, ואחר כך בהבדל בין CRM בלבד לחבילה העסקית.",
        "Empiece por el registro, luego el seguimiento y después la diferencia entre el CRM solo y el plan de negocio.",
        "Comece pelo registro, depois o acompanhamento e então a diferença entre o CRM sozinho e o plano de negócios.",
        "ابدأوا بالسجل، ثم المتابعة، ثم الفرق بين CRM وحده والخطة التجارية.",
      ),
      slugs: ["what-is-a-crm", "follow-up-on-leads", "crm-and-business-platform", "from-ad-to-follow-up"],
    },
    {
      id: "whatsapp",
      title: row("WhatsApp", "WhatsApp", "WhatsApp", "WhatsApp", "واتساب"),
      body: row(
        "The price in Bizuply, then templates, then the difference between the app and the platform.",
        "המחיר בביזאפלי, אחר כך תבניות, ואחר כך ההבדל בין האפליקציה לפלטפורמה.",
        "El precio en Bizuply, luego las plantillas y después la diferencia entre la app y la plataforma.",
        "O preço na Bizuply, depois os modelos e então a diferença entre o app e a plataforma.",
        "السعر في Bizuply، ثم القوالب، ثم الفرق بين التطبيق والمنصة.",
      ),
      slugs: ["whatsapp-cloud-api-cost", "whatsapp-message-templates"],
      extra: "/compare/whatsapp-app-or-api",
    },
    {
      id: "automations",
      title: row("Automations", "אוטומציות", "Automatizaciones", "Automações", "أتمتة"),
      body: row(
        "One guide defines the rule. The appointments guide shows a process that often needs a reminder.",
        "מדריך אחד מגדיר את הכלל. מדריך התורים מראה תהליך שלעתים קרובות צריך תזכורת.",
        "Una guía define la regla. La guía de citas muestra un proceso que a menudo necesita un recordatorio.",
        "Um guia define a regra. O guia de agenda mostra um processo que muitas vezes precisa de um lembrete.",
        "دليل واحد يعرّف القاعدة. دليل المواعيد يعرض عملية غالباً ما تحتاج تذكيراً.",
      ),
      slugs: ["business-automation", "appointments-for-a-service-business", "follow-up-on-leads"],
    },
    {
      id: "websites",
      title: row("Websites and inquiries", "אתרים ופניות", "Sitios y consultas", "Sites e pedidos", "مواقع واستفسارات"),
      body: row(
        "Build the page, then see how a form becomes a lead, then how a campaign connects.",
        "בונים את העמוד, אחר כך רואים איך טופס הופך לליד, ואחר כך איך קמפיין מתחבר.",
        "Construya la página, luego vea cómo un formulario se vuelve un lead y después cómo se conecta una campaña.",
        "Construa a página, depois veja como um formulário vira um lead e então como uma campanha se conecta.",
        "ابنوا الصفحة، ثم انظروا كيف يصبح النموذج عميلاً محتملاً، ثم كيف تتصل الحملة.",
      ),
      slugs: ["build-a-website-without-code", "website-form-to-crm", "manage-meta-campaigns"],
    },
  ];
  return paths.map((path) => ({
    id: path.id,
    title: text(path.title, locale),
    body: text(path.body, locale),
    extra: path.extra || "",
    steps: path.slugs.map((slug) => {
      const article = getGuide(slug, locale) || getGuide(slug, "en");
      return { href: `/guides/${slug}`, title: article?.h1 || slug };
    }),
  }));
}

const UI = {
  en: {
    kicker: "BizUply",
    resourcesTitle: "Resource library | Bizuply",
    resourcesDescription: "Guides, a glossary, templates, calculators and comparisons for CRM, WhatsApp, automations and business websites.",
    resourcesCrumb: "Resources",
    resourcesH1: "A library for the work between the inquiry and the customer",
    resourcesLede: "Guides, templates, calculators, and two comparisons for the work between an inquiry and a customer.",
    search: "Search the library",
    searchPlaceholder: "Search by topic, such as leads or templates",
    topics: "Topics",
    types: "Types",
    start: "Start here",
    fresh: "New in the library",
    guides: "Guides",
    minutes: "min read",
    updated: "Updated",
    read: "Read",
    download: "Download",
    empty: "Nothing matches that search.",
    industriesTitle: "By the kind of business",
    industriesBody: "Each page is written for one kind of work, so the advice matches that business.",
    connectionsTitle: "Connections you can use",
    connectionsBody: "Bring leads in from Meta Lead Ads, Google Ads lead forms, or a form on a Bizuply site. Connect WhatsApp through the Cloud API when you want to message from the account.",
    glossaryTitle: "Glossary | Bizuply",
    templatesTitle: "Templates and calculators | Bizuply",
    templatesDescription: "Free Excel workbooks for leads, follow-up, a CRM checklist and a sales funnel, plus calculators for conversion rate, cost per lead and campaign return.",
    templatesCrumb: "Templates",
    templatesH1: "Templates and calculators you can use today",
    templatesLede: "Download the workbooks and use the calculators on this page. No account is required.",
    files: "Workbooks",
    calculators: "Calculators",
    conversionTitle: "Conversion rate",
    conversionBody: "Divide the number of conversions by the number of opportunities, then multiply by 100. Name the action and the group before you trust the percent.",
    visitors: "Opportunities",
    conversions: "Conversions",
    costTitle: "Cost per lead",
    costBody: "Divide the spend by the number of leads. A lead is not yet a customer.",
    spend: "Spend",
    leads: "Leads",
    roiTitle: "Return and ROAS",
    roiBody: "Return on spend is revenue minus spend, divided by spend, times 100. ROAS is revenue divided by spend. They are different numbers.",
    revenue: "Revenue",
    result: "Result",
    undefinedRate: "Enter a number greater than zero in the divisor.",
    percent: "percent",
    perLead: "per lead",
    roas: "ROAS",
    pathsTitle: "Learning paths | Bizuply",
    pathsDescription: "Four reading paths through the Bizuply guides: CRM, WhatsApp, automations, and websites.",
    pathsCrumb: "Learning paths",
    pathsH1: "Reading paths through the guides",
    pathsLede: "Each path is a short sequence of guides. Read them in order, then open the product page when you want to try the step.",
    next: "Then",
    compareTitle: "Comparisons | Bizuply",
    home: "BizUply",
    library: "Resource library",
    onThisPage: "On this page",
    example: "Example",
    practice: "In practice",
    definition: "Definition",
    related: "Related",
    sourcesNote: "External prices and limits stay on the source page.",
    faq: "Questions",
    pricing: "See pricing",
    allGuides: "All guides",
  },
  he: {
    kicker: "BizUply",
    resourcesTitle: "מרכז הידע | ביזאפלי",
    resourcesDescription: "מדריכים, מילון, תבניות, מחשבונים והשוואות על CRM, WhatsApp, אוטומציות ואתרים לעסק.",
    resourcesCrumb: "מרכז הידע",
    resourcesH1: "ספרייה לעבודה שבין הפנייה ללקוח",
    resourcesLede: "מדריכים, תבניות, מחשבונים ושתי השוואות לעבודה שבין הפנייה ללקוח.",
    search: "חיפוש בספרייה",
    searchPlaceholder: "חיפוש לפי נושא, למשל לידים או תבניות",
    topics: "נושאים",
    types: "סוגים",
    start: "כדאי להתחיל כאן",
    fresh: "חדש בספרייה",
    guides: "מדריכים",
    minutes: "דקות קריאה",
    updated: "עודכן",
    read: "לקריאה",
    download: "הורדה",
    empty: "אין תוצאה לחיפוש הזה.",
    industriesTitle: "לפי סוג העסק",
    industriesBody: "כל עמוד נכתב לסוג עבודה אחד, כדי שהעצה תתאים לעסק הזה.",
    connectionsTitle: "חיבורים שאפשר להשתמש בהם",
    connectionsBody: "מכניסים לידים מ־Meta Lead Ads, מטפסי לידים של Google Ads, או מטופס באתר של ביזאפלי. מחברים את וואטסאפ דרך Cloud API כשרוצים לשלוח מהחשבון.",
    glossaryTitle: "מילון | ביזאפלי",
    templatesTitle: "תבניות ומחשבונים | ביזאפלי",
    templatesDescription: "חוברות Excel חינמיות ללידים, למעקב, לרשימת הטמעה ולמשפך, ומחשבונים לשיעור המרה, עלות ליד והחזר על הוצאה.",
    templatesCrumb: "תבניות",
    templatesH1: "תבניות ומחשבונים שאפשר להשתמש בהם היום",
    templatesLede: "מורידים את החוברות ומשתמשים במחשבונים בעמוד הזה. אין צורך בחשבון.",
    files: "חוברות",
    calculators: "מחשבונים",
    conversionTitle: "שיעור המרה",
    conversionBody: "מחלקים את מספר ההמרות במספר ההזדמנויות, ומכפילים ב־100. נותנים שם לפעולה ולקבוצה לפני שסומכים על האחוז.",
    visitors: "הזדמנויות",
    conversions: "המרות",
    costTitle: "עלות לליד",
    costBody: "מחלקים את ההוצאה במספר הלידים. ליד עדיין אינו לקוח.",
    spend: "הוצאה",
    leads: "לידים",
    roiTitle: "החזר ו־ROAS",
    roiBody: "החזר על ההוצאה הוא הכנסה פחות הוצאה, חלקי ההוצאה, כפול 100. ROAS הוא הכנסה חלקי הוצאה. אלה שני מספרים שונים.",
    revenue: "הכנסה",
    result: "תוצאה",
    undefinedRate: "מזינים מספר גדול מאפס במחלק.",
    percent: "אחוז",
    perLead: "לליד",
    roas: "ROAS",
    pathsTitle: "מסלולי לימוד | ביזאפלי",
    pathsDescription: "ארבעה מסלולי קריאה במדריכים של ביזאפלי: CRM, WhatsApp, אוטומציות ואתרים.",
    pathsCrumb: "מסלולי לימוד",
    pathsH1: "מסלולי קריאה בתוך המדריכים",
    pathsLede: "כל מסלול הוא רצף קצר של מדריכים. קוראים לפי הסדר, ואז פותחים את עמוד המוצר כשרוצים לנסות את הצעד.",
    next: "אחר כך",
    compareTitle: "השוואות | ביזאפלי",
    home: "ביזאפלי",
    library: "מרכז הידע",
    onThisPage: "בעמוד",
    example: "דוגמה",
    practice: "בפועל",
    definition: "הגדרה",
    related: "קשור",
    sourcesNote: "מחירים ומגבלות חיצוניים נשארים בדף המקור.",
    faq: "שאלות",
    pricing: "למחירון",
    allGuides: "כל המדריכים",
  },
};

const EXTRA_UI = {
  es: {
    kicker: "BizUply",
    resourcesTitle: "Biblioteca | Bizuply",
    resourcesDescription: "Guías, un glosario, plantillas, calculadoras y comparaciones sobre CRM, WhatsApp, automatizaciones y sitios.",
    resourcesCrumb: "Biblioteca",
    resourcesH1: "Una biblioteca para el trabajo entre la consulta y el cliente",
    resourcesLede: "Guías, plantillas, calculadoras y dos comparaciones para el trabajo entre la consulta y el cliente.",
    search: "Buscar en la biblioteca",
    searchPlaceholder: "Busque un tema, como leads o plantillas",
    topics: "Temas",
    types: "Tipos",
    start: "Empiece aquí",
    fresh: "Nuevo en la biblioteca",
    guides: "Guías",
    minutes: "min de lectura",
    updated: "Actualizado",
    read: "Leer",
    download: "Descargar",
    empty: "Nada coincide con esa búsqueda.",
    industriesTitle: "Por tipo de negocio",
    industriesBody: "Cada página está escrita para un tipo de trabajo, para que el consejo encaje con ese negocio.",
    connectionsTitle: "Conexiones que puede usar",
    connectionsBody: "Traiga leads desde Meta Lead Ads, formularios de Google Ads o un formulario en un sitio de Bizuply. Conecte WhatsApp por Cloud API cuando quiera escribir desde la cuenta.",
    templatesTitle: "Plantillas y calculadoras | Bizuply",
    templatesDescription: "Libros de Excel gratuitos para leads, seguimiento, una lista de CRM y un embudo, más calculadoras de conversión, coste por lead y retorno.",
    templatesCrumb: "Plantillas",
    templatesH1: "Plantillas y calculadoras para usar hoy",
    templatesLede: "Descargue los libros y use las calculadoras en esta página. No hace falta una cuenta.",
    files: "Libros",
    calculators: "Calculadoras",
    conversionTitle: "Tasa de conversión",
    conversionBody: "Divida las conversiones por las oportunidades y multiplique por 100. Nombre la acción y el grupo antes de fiarse del porcentaje.",
    visitors: "Oportunidades",
    conversions: "Conversiones",
    costTitle: "Coste por lead",
    costBody: "Divida el gasto por el número de leads. Un lead todavía no es un cliente.",
    spend: "Gasto",
    leads: "Leads",
    roiTitle: "Retorno y ROAS",
    roiBody: "El retorno del gasto es ingreso menos gasto, dividido por el gasto, por 100. El ROAS es ingreso dividido por gasto. Son números distintos.",
    revenue: "Ingresos",
    result: "Resultado",
    undefinedRate: "Escriba un número mayor que cero en el divisor.",
    percent: "por ciento",
    perLead: "por lead",
    roas: "ROAS",
    pathsTitle: "Rutas de aprendizaje | Bizuply",
    pathsDescription: "Cuatro rutas de lectura por las guías de Bizuply: CRM, WhatsApp, automatizaciones y sitios.",
    pathsCrumb: "Rutas",
    pathsH1: "Rutas de lectura por las guías",
    pathsLede: "Cada ruta es una secuencia corta de guías. Léalas en orden y abra la página del producto cuando quiera probar el paso.",
    next: "Después",
    home: "BizUply",
    library: "Biblioteca",
    onThisPage: "En esta página",
    example: "Ejemplo",
    practice: "En la práctica",
    definition: "Definición",
    related: "Relacionado",
    sourcesNote: "Los precios y límites externos se quedan en la página de origen.",
    faq: "Preguntas",
    pricing: "Ver precios",
    allGuides: "Todas las guías",
  },
  "pt-BR": {
    kicker: "BizUply",
    resourcesTitle: "Biblioteca | Bizuply",
    resourcesDescription: "Guias, um glossário, modelos, calculadoras e comparações sobre CRM, WhatsApp, automações e sites.",
    resourcesCrumb: "Biblioteca",
    resourcesH1: "Uma biblioteca para o trabalho entre o pedido e o cliente",
    resourcesLede: "Guias, modelos, calculadoras e duas comparações para o trabalho entre o pedido e o cliente.",
    search: "Pesquisar na biblioteca",
    searchPlaceholder: "Pesquise um tema, como leads ou modelos",
    topics: "Temas",
    types: "Tipos",
    start: "Comece aqui",
    fresh: "Novo na biblioteca",
    guides: "Guias",
    minutes: "min de leitura",
    updated: "Atualizado",
    read: "Ler",
    download: "Baixar",
    empty: "Nada corresponde a essa pesquisa.",
    industriesTitle: "Por tipo de negócio",
    industriesBody: "Cada página foi escrita para um tipo de trabalho, para o conselho caber nesse negócio.",
    connectionsTitle: "Conexões que você pode usar",
    connectionsBody: "Traga leads do Meta Lead Ads, de formulários do Google Ads ou de um formulário num site da Bizuply. Conecte o WhatsApp pelo Cloud API quando quiser escrever a partir da conta.",
    templatesTitle: "Modelos e calculadoras | Bizuply",
    templatesDescription: "Pastas de Excel gratuitas para leads, acompanhamento, uma lista de CRM e um funil, mais calculadoras de conversão, custo por lead e retorno.",
    templatesCrumb: "Modelos",
    templatesH1: "Modelos e calculadoras para usar hoje",
    templatesLede: "Baixe as pastas e use as calculadoras nesta página. Não é preciso uma conta.",
    files: "Pastas",
    calculators: "Calculadoras",
    conversionTitle: "Taxa de conversão",
    conversionBody: "Divida as conversões pelas oportunidades e multiplique por 100. Nomeie a ação e o grupo antes de confiar na porcentagem.",
    visitors: "Oportunidades",
    conversions: "Conversões",
    costTitle: "Custo por lead",
    costBody: "Divida o gasto pelo número de leads. Um lead ainda não é um cliente.",
    spend: "Gasto",
    leads: "Leads",
    roiTitle: "Retorno e ROAS",
    roiBody: "O retorno do gasto é receita menos gasto, dividido pelo gasto, vezes 100. O ROAS é receita dividida pelo gasto. São números diferentes.",
    revenue: "Receita",
    result: "Resultado",
    undefinedRate: "Digite um número maior que zero no divisor.",
    percent: "por cento",
    perLead: "por lead",
    roas: "ROAS",
    pathsTitle: "Trilhas de estudo | Bizuply",
    pathsDescription: "Quatro trilhas de leitura pelos guias da Bizuply: CRM, WhatsApp, automações e sites.",
    pathsCrumb: "Trilhas",
    pathsH1: "Trilhas de leitura pelos guias",
    pathsLede: "Cada trilha é uma sequência curta de guias. Leia na ordem e abra a página do produto quando quiser experimentar o passo.",
    next: "Depois",
    home: "BizUply",
    library: "Biblioteca",
    onThisPage: "Nesta página",
    example: "Exemplo",
    practice: "Na prática",
    definition: "Definição",
    related: "Relacionado",
    sourcesNote: "Preços e limites externos ficam na página de origem.",
    faq: "Perguntas",
    pricing: "Ver preços",
    allGuides: "Todos os guias",
  },
  ar: {
    kicker: "BizUply",
    resourcesTitle: "المكتبة | Bizuply",
    resourcesDescription: "أدلة ومعجم وقوالب وحاسبات ومقارنات حول CRM وواتساب والأتمتة والمواقع.",
    resourcesCrumb: "المكتبة",
    resourcesH1: "مكتبة للعمل بين الاستفسار والزبون",
    resourcesLede: "أدلة وقوالب وحاسبات ومقارنتان للعمل بين الاستفسار والزبون.",
    search: "البحث في المكتبة",
    searchPlaceholder: "ابحثوا عن موضوع، مثل العملاء المحتملين أو القوالب",
    topics: "المواضيع",
    types: "الأنواع",
    start: "ابدأوا هنا",
    fresh: "جديد في المكتبة",
    guides: "أدلة",
    minutes: "دقيقة قراءة",
    updated: "آخر تحديث",
    read: "قراءة",
    download: "تنزيل",
    empty: "لا شيء يطابق هذا البحث.",
    industriesTitle: "حسب نوع النشاط",
    industriesBody: "كل صفحة مكتوبة لنوع عمل واحد، حتى تناسب النصيحة ذلك النشاط.",
    connectionsTitle: "ربط يمكن استخدامه",
    connectionsBody: "أدخلوا العملاء من إعلانات Meta أو نماذج Google Ads أو نموذج في موقع Bizuply. اربطوا واتساب عبر Cloud API حين تريدون المراسلة من الحساب.",
    templatesTitle: "قوالب وحاسبات | Bizuply",
    templatesDescription: "ملفات Excel مجانية للعملاء المحتملين والمتابعة وقائمة CRM وقمع المبيعات، وحاسبات لمعدل التحويل وتكلفة العميل والعائد.",
    templatesCrumb: "قوالب",
    templatesH1: "قوالب وحاسبات يمكن استخدامها اليوم",
    templatesLede: "نزّلوا الملفات واستخدموا الحاسبات في هذه الصفحة. لا حاجة إلى حساب.",
    files: "ملفات",
    calculators: "حاسبات",
    conversionTitle: "معدل التحويل",
    conversionBody: "اقسموا عدد التحويلات على عدد الفرص ثم اضربوا في 100. سمّوا الفعل والمجموعة قبل الاعتماد على النسبة.",
    visitors: "الفرص",
    conversions: "التحويلات",
    costTitle: "التكلفة لكل عميل محتمل",
    costBody: "اقسموا الإنفاق على عدد العملاء المحتملين. العميل المحتمل ليس زبوناً بعد.",
    spend: "الإنفاق",
    leads: "عملاء محتملون",
    roiTitle: "العائد وROAS",
    roiBody: "العائد على الإنفاق هو الإيراد ناقص الإنفاق، مقسوماً على الإنفاق، مضروباً في 100. ROAS هو الإيراد مقسوماً على الإنفاق. رقمان مختلفان.",
    revenue: "الإيراد",
    result: "النتيجة",
    undefinedRate: "أدخلوا عدداً أكبر من صفر في المقسوم عليه.",
    percent: "بالمئة",
    perLead: "لكل عميل محتمل",
    roas: "ROAS",
    pathsTitle: "مسارات التعلم | Bizuply",
    pathsDescription: "أربعة مسارات قراءة في أدلة Bizuply: CRM وواتساب والأتمتة والمواقع.",
    pathsCrumb: "مسارات",
    pathsH1: "مسارات قراءة داخل الأدلة",
    pathsLede: "كل مسار سلسلة قصيرة من الأدلة. اقرأوها بالترتيب، ثم افتحوا صفحة المنتج حين تريدون تجربة الخطوة.",
    next: "ثم",
    home: "BizUply",
    library: "المكتبة",
    onThisPage: "في هذه الصفحة",
    example: "مثال",
    practice: "عملياً",
    definition: "تعريف",
    related: "مرتبط",
    sourcesNote: "الأسعار والحدود الخارجية تبقى في صفحة المصدر.",
    faq: "أسئلة",
    pricing: "الأسعار",
    allGuides: "كل الأدلة",
  },
};

export function knowledgeUi(locale) {
  const language = locale === "pt" ? "pt-BR" : locale;
  if (language === "en" || language === "he") return UI[language];
  return EXTRA_UI[language] || UI.en;
}

export function isKnowledgePath(path) {
  if (["/resources", "/glossary", "/templates", "/compare", "/academy"].includes(path)) return true;
  if (path.startsWith("/compare/")) return COMPARE_SLUGS.includes(path.slice("/compare/".length));
  return false;
}

export function knowledgePage(path, locale) {
  const ui = knowledgeUi(locale);
  if (path === "/resources") {
    return {
      path,
      title: ui.resourcesTitle,
      description: ui.resourcesDescription,
      crumb: ui.resourcesCrumb,
      h1: ui.resourcesH1,
      lede: ui.resourcesLede,
      updated: KNOWLEDGE_UPDATED,
    };
  }
  if (path === "/glossary") {
    const page = glossaryPage(locale);
    return page ? { path, ...page } : null;
  }
  if (path === "/templates") {
    return {
      path,
      title: ui.templatesTitle,
      description: ui.templatesDescription,
      crumb: ui.templatesCrumb,
      h1: ui.templatesH1,
      lede: ui.templatesLede,
      updated: KNOWLEDGE_UPDATED,
      faq: [[
        locale === "he" ? "צריך להירשם כדי להוריד?" : locale === "es" ? "¿Hay que registrarse para descargar?" : locale === "pt-BR" ? "Precisa cadastrar para baixar?" : locale === "ar" ? "هل يلزم التسجيل للتنزيل؟" : "Do I need an account to download?",
        locale === "he" ? "לא. ההורדה חופשית." : locale === "es" ? "No. La descarga es libre." : locale === "pt-BR" ? "Não. O download é livre." : locale === "ar" ? "لا. التنزيل حر." : "No. The download is free.",
      ]],
    };
  }
  if (path === "/compare") {
    const page = compareIndex(locale);
    return page ? { path, ...page } : null;
  }
  if (path === "/academy") {
    return {
      path,
      title: ui.pathsTitle,
      description: ui.pathsDescription,
      crumb: ui.pathsCrumb,
      h1: ui.pathsH1,
      lede: ui.pathsLede,
      updated: KNOWLEDGE_UPDATED,
    };
  }
  if (path.startsWith("/compare/")) {
    const article = getCompare(path.slice("/compare/".length), locale);
    return article ? { path, ...article } : null;
  }
  return null;
}

export function knowledgeMarketingEntries() {
  return ["/resources", "/glossary", "/templates", "/compare", "/academy", ...COMPARE_SLUGS.map((slug) => `/compare/${slug}`)].map((path) => {
    const page = knowledgePage(path, "en");
    return {
      path,
      title: page.title,
      description: page.description,
      crumb: page.crumb,
      lastmod: KNOWLEDGE_UPDATED,
      changefreq: path === "/resources" ? "weekly" : "monthly",
      priority: path === "/resources" ? "0.8" : "0.64",
    };
  });
}

export function knowledgeFaq(path, locale) {
  const page = knowledgePage(path, locale);
  return page?.faq || null;
}

function linkList(locale, items) {
  return `<ul>${items.map((item) => `<li><a href="${escapeHtml(knowledgeHref(locale, item.href))}">${escapeHtml(item.label || item.title)}</a></li>`).join("")}</ul>`;
}

export function renderKnowledgeInner(path, locale) {
  const page = knowledgePage(path, locale);
  if (!page?.h1) return "";
  const ui = knowledgeUi(locale);
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const lang = locale === "pt-BR" ? "pt-BR" : locale;
  const crumbs = `<nav aria-label="Breadcrumb"><a href="${escapeHtml(knowledgeHref(locale, "/"))}">${escapeHtml(ui.home)}</a> / ${path === "/resources" ? escapeHtml(ui.library) : `<a href="${escapeHtml(knowledgeHref(locale, "/resources"))}">${escapeHtml(ui.library)}</a> / ${escapeHtml(page.crumb)}`}</nav>`;
  let body = "";
  if (path === "/resources") {
    const cards = guideCards(locale);
    body += `<h2>${escapeHtml(ui.start)}</h2><ul>${cards.filter((card) => card.start).map((card) => `<li><a href="${escapeHtml(knowledgeHref(locale, card.href))}">${escapeHtml(card.title)}</a></li>`).join("")}</ul>`;
    body += `<h2>${escapeHtml(ui.fresh)}</h2><ul><li><a href="${escapeHtml(knowledgeHref(locale, "/glossary"))}">${escapeHtml(ui.library)}</a></li><li><a href="${escapeHtml(knowledgeHref(locale, "/templates"))}">${escapeHtml(ui.files)}</a></li><li><a href="${escapeHtml(knowledgeHref(locale, "/compare"))}">${escapeHtml(kindLabel("comparison", locale))}</a></li><li><a href="${escapeHtml(knowledgeHref(locale, "/academy"))}">${escapeHtml(kindLabel("path", locale))}</a></li></ul>`;
    body += `<h2>${escapeHtml(ui.guides)}</h2><ul>${cards.map((card) => `<li><a href="${escapeHtml(knowledgeHref(locale, card.href))}">${escapeHtml(card.title)}</a> — ${escapeHtml(card.updated)}</li>`).join("")}</ul>`;
    body += `<h2>${escapeHtml(ui.industriesTitle)}</h2><p>${escapeHtml(ui.industriesBody)}</p>${linkList(locale, industryLinks(locale))}`;
    body += `<h2>${escapeHtml(ui.connectionsTitle)}</h2><p>${escapeHtml(ui.connectionsBody)}</p>${linkList(locale, connectionLinks(locale))}`;
  } else if (path === "/glossary") {
    body += `<nav aria-label="${escapeHtml(ui.onThisPage)}"><ul>${page.terms.map((term) => `<li><a href="#${escapeHtml(term.id)}">${escapeHtml(term.term)}</a></li>`).join("")}</ul></nav>`;
    body += page.terms.map((term) => `<section id="${escapeHtml(term.id)}"><h2>${escapeHtml(term.term)}</h2><p>${escapeHtml(term.definition)}</p><h3>${escapeHtml(ui.practice)}</h3><p>${escapeHtml(term.practice)}</p><h3>${escapeHtml(ui.example)}</h3><p>${escapeHtml(term.example)}</p>${linkList(locale, term.links)}</section>`).join("");
  } else if (path === "/templates") {
    body += `<h2>${escapeHtml(ui.files)}</h2><ul>${templateFiles(locale).map((file) => `<li><a href="${escapeHtml(file.file)}">${escapeHtml(file.title)}</a> — ${escapeHtml(file.body)}</li>`).join("")}</ul>`;
    body += `<h2>${escapeHtml(ui.calculators)}</h2><h3>${escapeHtml(ui.conversionTitle)}</h3><p>${escapeHtml(ui.conversionBody)}</p><h3>${escapeHtml(ui.costTitle)}</h3><p>${escapeHtml(ui.costBody)}</p><h3>${escapeHtml(ui.roiTitle)}</h3><p>${escapeHtml(ui.roiBody)}</p>`;
  } else if (path === "/compare") {
    body += `<ul>${page.pages.map((item) => `<li><a href="${escapeHtml(knowledgeHref(locale, item.path))}">${escapeHtml(item.h1)}</a> — ${escapeHtml(item.description)}</li>`).join("")}</ul>`;
    body += `<h2>${escapeHtml(page.integrated.title)}</h2><p>${escapeHtml(page.integrated.description)}</p><p><a href="${escapeHtml(knowledgeHref(locale, page.integrated.href))}">${escapeHtml(page.integrated.title)}</a></p>`;
  } else if (path === "/academy") {
    body += learningPaths(locale).map((item) => `<section id="${escapeHtml(item.id)}"><h2>${escapeHtml(item.title)}</h2><p>${escapeHtml(item.body)}</p><ol>${item.steps.map((step) => `<li><a href="${escapeHtml(knowledgeHref(locale, step.href))}">${escapeHtml(step.title)}</a></li>`).join("")}</ol>${item.extra ? `<p><a href="${escapeHtml(knowledgeHref(locale, item.extra))}">${escapeHtml(ui.next)}</a></p>` : ""}</section>`).join("");
  } else {
    body += (page.sections || []).map((section) => {
      let html = `<section id="${escapeHtml(section.id)}"><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}`;
      if (section.steps?.length) html += `<ol>${section.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>`;
      if (section.mistakes?.length) html += section.mistakes.map((item) => `<p><strong>${escapeHtml(item.problem)}</strong> ${escapeHtml(item.fix)}</p>`).join("");
      if (section.table?.rows?.length) {
        html += `<table><thead><tr>${section.table.columns.map((column) => `<th>${escapeHtml(column)}</th>`).join("")}</tr></thead><tbody>${section.table.rows.map((line) => `<tr>${line.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      }
      return `${html}</section>`;
    }).join("");
    if (page.related?.length) body += `<h2>${escapeHtml(ui.related)}</h2>${linkList(locale, page.related)}`;
  }
  const faq = page.faq?.length ? `<h2>${escapeHtml(ui.faq)}</h2>${page.faq.map(([question, answer]) => `<h3>${escapeHtml(question)}</h3><p>${escapeHtml(answer)}</p>`).join("")}` : "";
  return `<main lang="${lang}" dir="${dir}">${crumbs}<h1>${escapeHtml(page.h1)}</h1><p>${escapeHtml(ui.updated)} ${escapeHtml(page.updated)}</p><p>${escapeHtml(page.lede || page.description)}</p>${body}${faq}</main>`;
}

export function storedArticleSlug(path) {
  if (!path.startsWith("/resources/a/")) return "";
  const slug = path.slice("/resources/a/".length);
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) ? slug : "";
}

export function renderStoredArticleInner(article) {
  const locale = article.locale === "pt" ? "pt-BR" : article.locale || "en";
  const ui = knowledgeUi(locale);
  const sections = (article.sections || []).map((section) => `<section><h2>${escapeHtml(section.heading)}</h2>${(section.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}</section>`).join("");
  const faq = (article.faq || []).map((pair) => `<h3>${escapeHtml(pair[0])}</h3><p>${escapeHtml(pair[1])}</p>`).join("");
  const related = (article.relatedPaths || []).map((href) => `<li><a href="${escapeHtml(knowledgeHref(locale, href))}">${escapeHtml(href)}</a></li>`).join("");
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  return `<main lang="${escapeHtml(locale)}" dir="${dir}"><nav aria-label="Breadcrumb"><a href="${escapeHtml(knowledgeHref(locale, "/"))}">${escapeHtml(ui.home)}</a> / <a href="${escapeHtml(knowledgeHref(locale, "/resources"))}">${escapeHtml(ui.library)}</a></nav><h1>${escapeHtml(article.h1)}</h1><p>${escapeHtml(ui.updated)} ${escapeHtml(article.updated || "")}</p><p>${escapeHtml(article.lede || article.description || "")}</p>${sections}${faq ? `<h2>${escapeHtml(ui.faq)}</h2>${faq}` : ""}${related ? `<h2>${escapeHtml(ui.related)}</h2><ul>${related}</ul>` : ""}</main>`;
}

export function knowledgePublicBlob() {
  return LOCALES.map((locale) => JSON.stringify({
    ui: knowledgeUi(locale),
    glossary: glossaryPage(locale),
    compare: compareIndex(locale),
    articles: COMPARE_SLUGS.map((slug) => getCompare(slug, locale)),
    paths: learningPaths(locale),
  })).join("\n");
}
