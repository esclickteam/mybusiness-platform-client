/**
 * Public knowledge-center copy and the first-paint index.
 * Only guides that already have a full article are listed. Unpublished titles stay out of the index.
 */

import { getGuide } from "./guidesMarketing.mjs";
import { renderMarketingHeader } from "./marketingShell.mjs";

const META = {
  en: { lang: "en", dir: "ltr" },
  he: { lang: "he", dir: "rtl" },
  es: { lang: "es", dir: "ltr" },
  "pt-BR": { lang: "pt-BR", dir: "ltr" },
  ar: { lang: "ar", dir: "rtl" },
};

export const GUIDE_GROUPS = [
  { id: "crm", slugs: ["what-is-a-crm", "follow-up-on-leads"] },
  { id: "whatsapp", slugs: ["whatsapp-cloud-api-cost", "whatsapp-message-templates"] },
  { id: "marketing", slugs: ["meta-lead-ads-to-crm", "connect-a-meta-ad-account", "manage-meta-campaigns", "from-ad-to-follow-up"] },
  { id: "automations", slugs: ["business-automation"] },
  { id: "websites", slugs: ["build-a-website-without-code", "website-form-to-crm"] },
  { id: "appointments", slugs: ["appointments-for-a-service-business"] },
  { id: "growth", slugs: ["crm-and-business-platform"] },
];

export const GUIDE_CARD_MEDIA = {
  "what-is-a-crm": { src: "/demo-media/crm/lead-file.png", alt: "A demo customer record in Bizuply CRM" },
  "follow-up-on-leads": { src: "/demo-media/crm/lead-task.png", alt: "A follow-up task on a demo lead in Bizuply" },
  "whatsapp-cloud-api-cost": { src: "/demo-media/whatsapp/still-3.jpg", alt: "A demo WhatsApp conversation in Bizuply" },
  "whatsapp-message-templates": { src: "/demo-media/whatsapp/poster.jpg", alt: "A WhatsApp template opened in the Bizuply demo" },
  "meta-lead-ads-to-crm": { src: "/demo-media/meta/lead-source.png", alt: "A demo lead marked with its Meta source" },
  "connect-a-meta-ad-account": { src: "/demo-media/campaigns/poster.jpg", alt: "The Bizuply campaign manager with demo campaigns" },
  "manage-meta-campaigns": { src: "/demo-media/home/campaigns.jpg", alt: "Demo campaign performance in Bizuply" },
  "from-ad-to-follow-up": { src: "/demo-media/crm/leads-list.png", alt: "A demo lead list in Bizuply CRM" },
  "business-automation": { src: "/demo-media/automations/poster.jpg", alt: "A demo automation that creates a CRM task" },
  automations: { src: "/demo-media/home/automations.jpg", alt: "A demo automation workflow in Bizuply" },
  "build-a-website-without-code": { src: "/demo-media/websites/poster.jpg", alt: "The Bizuply website studio editing a demo page" },
  "website-form-to-crm": { src: "/demo-media/forms/lead.png", alt: "A website form lead in the Bizuply CRM" },
  "appointments-for-a-service-business": { src: "/demo-media/appointments/still-8.jpg", alt: "A demo appointment on the Bizuply calendar" },
  "crm-and-business-platform": { src: "/demo-media/home/crm.jpg", alt: "The Bizuply workspace with a demo customer record" },
};

const HUB = {
  en: {
    title: "Practical Business Guides | Bizuply",
    description: "Practical guides on CRM, WhatsApp Business, Meta ads, automations, websites and appointments. Learn how the work fits together in Bizuply.",
    crumb: "Guides",
    kicker: "Bizuply Knowledge Center",
    h1: "Practical guides for a smarter business",
    lede: "Explore practical insights, step-by-step tutorials and real business workflows covering CRM, customer communication, marketing, automation, websites and appointment management. Learn how to connect your tools, organize your work and make more informed business decisions.",
    search: "What would you like to learn?",
    searchLabel: "Search guides",
    all: "All Guides",
    featuredKicker: "Featured Guide",
    featuredTitle: "What is a CRM, and why does your business need one?",
    featuredBody: "A customer relationship management system helps businesses organize leads, customer information, conversations and follow-up activities. Discover how CRM software works, when a small business needs one and how to choose a system that supports your daily operations.",
    featuredCta: "Read the Complete Guide",
    popular: "Most popular guides",
    tutorials: "Practical tutorials",
    empty: "No published guide matches that search yet.",
    ctaTitle: "Ready to put what you've learned into action?",
    ctaBody: "Explore Bizuply's connected business tools and discover how to bring customer management, marketing, communication and daily workflows together.",
    explore: "Explore the Platform",
    pricing: "View Pricing",
    read: "Read the guide",
    home: "Home",
    categories: {
      crm: "CRM & Leads",
      whatsapp: "WhatsApp Business",
      marketing: "Marketing & Meta Ads",
      automations: "Automations",
      websites: "Websites & Stores",
      appointments: "Appointments",
      growth: "Business Growth",
    },
  },
  he: {
    title: "מדריכים מעשיים לעסק | Bizuply",
    description: "מדריכים מעשיים על CRM, וואטסאפ לעסקים, מודעות Meta, אוטומציות, אתרים ויומן תורים. כך העבודה מתחברת ב־Bizuply.",
    crumb: "מדריכים",
    kicker: "מרכז הידע של Bizuply",
    h1: "מדריכים מעשיים לעסק חכם יותר",
    lede: "תובנות מעשיות, הדרכות לפי שלבים ותהליכי עבודה אמיתיים בנושאי CRM, תקשורת עם לקוחות, שיווק, אוטומציה, אתרים וניהול תורים. כך מחברים כלים, מסדרים את העבודה ומקבלים החלטות מבוססות יותר.",
    search: "מה תרצו ללמוד?",
    searchLabel: "חיפוש מדריכים",
    all: "כל המדריכים",
    featuredKicker: "מדריך מומלץ",
    featuredTitle: "מהו CRM, ולמה העסק צריך אותו?",
    featuredBody: "מערכת לניהול קשרי לקוחות עוזרת לארגן לידים, מידע על לקוחות, שיחות ופעולות מעקב. כך עובדת תוכנת CRM, מתי עסק קטן צריך אותה ואיך בוחרים מערכת שתומכת בעבודה היומיומית.",
    featuredCta: "לקריאת המדריך המלא",
    popular: "המדריכים הנקראים ביותר",
    tutorials: "הדרכות מעשיות",
    empty: "אין עדיין מדריך שפורסם שמתאים לחיפוש הזה.",
    ctaTitle: "מוכנים ליישם את מה שלמדתם?",
    ctaBody: "הכירו את הכלים המחוברים של Bizuply וראו איך ניהול לקוחות, שיווק, תקשורת ועבודה יומיומית נפגשים.",
    explore: "לפלטפורמה",
    pricing: "למחירון",
    read: "למדריך",
    home: "דף הבית",
    categories: {
      crm: "CRM ולידים",
      whatsapp: "וואטסאפ לעסקים",
      marketing: "שיווק ומודעות Meta",
      automations: "אוטומציות",
      websites: "אתרים וחנויות",
      appointments: "תורים ויומן",
      growth: "צמיחה עסקית",
    },
  },
  es: {
    title: "Guías prácticas para el negocio | Bizuply",
    description: "Guías prácticas de CRM, WhatsApp Business, anuncios de Meta, automatizaciones, sitios web y citas. Aprenda cómo se conecta el trabajo en Bizuply.",
    crumb: "Guías",
    kicker: "Centro de conocimiento Bizuply",
    h1: "Guías prácticas para un negocio más inteligente",
    lede: "Ideas prácticas, tutoriales paso a paso y flujos de trabajo reales sobre CRM, comunicación con clientes, marketing, automatización, sitios web y gestión de citas. Aprenda a conectar las herramientas, ordenar el trabajo y decidir con mejor información.",
    search: "¿Qué le gustaría aprender?",
    searchLabel: "Buscar guías",
    all: "Todas las guías",
    featuredKicker: "Guía destacada",
    featuredTitle: "Qué es un CRM y por qué lo necesita un negocio",
    featuredBody: "Un sistema de gestión de relaciones con clientes ayuda a organizar leads, información de clientes, conversaciones y actividades de seguimiento. Descubra cómo funciona el software CRM, cuándo lo necesita un negocio pequeño y cómo elegir un sistema para el trabajo diario.",
    featuredCta: "Leer la guía completa",
    popular: "Guías más consultadas",
    tutorials: "Tutoriales prácticos",
    empty: "Ninguna guía publicada coincide con esa búsqueda.",
    ctaTitle: "¿Listo para poner en práctica lo aprendido?",
    ctaBody: "Explore las herramientas conectadas de Bizuply y vea cómo reunir la gestión de clientes, el marketing, la comunicación y el trabajo diario.",
    explore: "Explorar la plataforma",
    pricing: "Ver precios",
    read: "Leer la guía",
    home: "Inicio",
    categories: {
      crm: "CRM y leads",
      whatsapp: "WhatsApp Business",
      marketing: "Marketing y anuncios de Meta",
      automations: "Automatizaciones",
      websites: "Sitios y tiendas",
      appointments: "Citas",
      growth: "Crecimiento del negocio",
    },
  },
  "pt-BR": {
    title: "Guias práticos para o negócio | Bizuply",
    description: "Guias práticos de CRM, WhatsApp Business, anúncios da Meta, automações, sites e agendamentos. Veja como o trabalho se conecta na Bizuply.",
    crumb: "Guias",
    kicker: "Central de conhecimento Bizuply",
    h1: "Guias práticos para um negócio mais inteligente",
    lede: "Ideias práticas, tutoriais passo a passo e fluxos reais sobre CRM, comunicação com clientes, marketing, automação, sites e gestão de horários. Aprenda a conectar as ferramentas, organizar o trabalho e decidir com mais informação.",
    search: "O que você quer aprender?",
    searchLabel: "Buscar guias",
    all: "Todos os guias",
    featuredKicker: "Guia em destaque",
    featuredTitle: "O que é um CRM e por que o seu negócio precisa de um",
    featuredBody: "Um sistema de gestão de relacionamento com o cliente ajuda a organizar leads, informações de clientes, conversas e atividades de acompanhamento. Veja como o software de CRM funciona, quando uma pequena empresa precisa de um e como escolher um sistema para o dia a dia.",
    featuredCta: "Ler o guia completo",
    popular: "Guias mais lidos",
    tutorials: "Tutoriais práticos",
    empty: "Nenhum guia publicado corresponde a essa busca.",
    ctaTitle: "Pronto para colocar em prática o que aprendeu?",
    ctaBody: "Explore as ferramentas conectadas da Bizuply e veja como reunir gestão de clientes, marketing, comunicação e o trabalho do dia a dia.",
    explore: "Explorar a plataforma",
    pricing: "Ver preços",
    read: "Ler o guia",
    home: "Início",
    categories: {
      crm: "CRM e leads",
      whatsapp: "WhatsApp Business",
      marketing: "Marketing e anúncios da Meta",
      automations: "Automações",
      websites: "Sites e lojas",
      appointments: "Agendamentos",
      growth: "Crescimento do negócio",
    },
  },
  ar: {
    title: "أدلة عملية لإدارة العمل | Bizuply",
    description: "أدلة عملية عن CRM وواتساب للأعمال وإعلانات Meta والأتمتة والمواقع والمواعيد. تعرّفوا على كيفية اتصال العمل في Bizuply.",
    crumb: "أدلة",
    kicker: "مركز معرفة Bizuply",
    h1: "أدلة عملية لعمل أكثر ذكاءً",
    lede: "رؤى عملية ودروس خطوة بخطوة ومسارات عمل حقيقية تغطي CRM والتواصل مع العملاء والتسويق والأتمتة والمواقع وإدارة المواعيد. تعلّموا كيف تربطون الأدوات وتنظّمون العمل وتتخذون قرارات أوضح.",
    search: "ماذا تودّون أن تتعلّموا؟",
    searchLabel: "البحث في الأدلة",
    all: "كل الأدلة",
    featuredKicker: "الدليل المميز",
    featuredTitle: "ما هو CRM، ولماذا يحتاجه عملك؟",
    featuredBody: "يساعد نظام إدارة علاقات العملاء على تنظيم العملاء المحتملين ومعلومات العملاء والمحادثات وأنشطة المتابعة. اكتشفوا كيف يعمل برنامج CRM، ومتى يحتاجه عمل صغير، وكيف تختارون نظاماً يدعم العمل اليومي.",
    featuredCta: "اقرأوا الدليل الكامل",
    popular: "الأدلة الأكثر قراءة",
    tutorials: "دروس عملية",
    empty: "لا يوجد دليل منشور يطابق هذا البحث بعد.",
    ctaTitle: "هل أنتم مستعدون لتطبيق ما تعلّمتموه؟",
    ctaBody: "استكشفوا أدوات Bizuply المتصلة واكتشفوا كيف تجتمع إدارة العملاء والتسويق والتواصل والعمل اليومي.",
    explore: "استكشفوا المنصة",
    pricing: "عرض الأسعار",
    read: "اقرأوا الدليل",
    home: "الرئيسية",
    categories: {
      crm: "CRM والعملاء المحتملون",
      whatsapp: "واتساب للأعمال",
      marketing: "التسويق وإعلانات Meta",
      automations: "الأتمتة",
      websites: "المواقع والمتاجر",
      appointments: "المواعيد",
      growth: "نمو العمل",
    },
  },
};

export function guidesHubCopy(locale) {
  return HUB[locale] || HUB.en;
}

export function publishedGuideGroups(locale) {
  return GUIDE_GROUPS.map((group) => ({
    ...group,
    label: guidesHubCopy(locale).categories[group.id],
    articles: group.slugs
      .map((slug) => {
        const article = getGuide(slug, locale);
        if (!article?.h1 || !article.sections?.length) return null;
        return { slug, article, media: GUIDE_CARD_MEDIA[slug] };
      })
      .filter(Boolean),
  })).filter((group) => group.articles.length);
}

export function guideHasTutorial(article) {
  return Boolean(article?.sections?.some((section) => section.video));
}

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function href(locale, path) {
  const prefix = { en: "", he: "/he", es: "/es", "pt-BR": "/pt-br", ar: "/ar" }[locale] || "";
  return `${prefix}${path}`;
}

export function renderGuidesPrerender(locale) {
  const meta = META[locale] || META.en;
  const copy = guidesHubCopy(locale);
  const groups = publishedGuideGroups(locale);
  const featured = getGuide("what-is-a-crm", locale);
  const media = GUIDE_CARD_MEDIA["what-is-a-crm"];
  const chips = [`<a href="#guides">${esc(copy.all)}</a>`, ...groups.map((group) => `<a href="#${group.id}">${esc(group.label)}</a>`)].join("");
  const sections = groups.map((group) => {
    const cards = group.articles.map(({ slug, article, media: card }) => (
      `<article class="gk-card"><a href="${esc(href(locale, `/guides/${slug}`))}"><img src="${esc(card.src)}" alt="${esc(card.alt)}" width="640" height="400"><h3>${esc(article.h1)}</h3><p>${esc(article.description)}</p></a></article>`
    )).join("");
    return `<section class="gk-group" id="${group.id}"><h2>${esc(group.label)}</h2><div class="gk-grid">${cards}</div></section>`;
  }).join("");
  const inner = `${renderMarketingHeader(locale, "/guides")}<main class="gk" lang="${meta.lang}" dir="${meta.dir}"><section class="gk-hero"><div class="gk-wrap"><p class="gk-kicker">${esc(copy.kicker)}</p><h1>${esc(copy.h1)}</h1><p class="gk-lead">${esc(copy.lede)}</p><form class="gk-search" role="search"><label class="gk-sr" for="guide-search">${esc(copy.searchLabel)}</label><input id="guide-search" type="search" name="q" placeholder="${esc(copy.search)}"></form><nav class="gk-chips" aria-label="${esc(copy.all)}">${chips}</nav></div></section><section class="gk-feature"><div class="gk-wrap gk-feature__grid"><div><p class="gk-kicker">${esc(copy.featuredKicker)}</p><h2>${esc(copy.featuredTitle)}</h2><p>${esc(copy.featuredBody)}</p><a class="gk-btn" href="${esc(href(locale, "/guides/what-is-a-crm"))}">${esc(copy.featuredCta)}</a></div><img src="${esc(media.src)}" alt="${esc(featured?.h1 || media.alt)}" width="960" height="600"></div></section><div class="gk-wrap" id="guides">${sections}</div></main>`;
  return { lang: meta.lang, dir: meta.dir, inner };
}

export function guidesIndexJsonLd(locale, urlFor) {
  const items = publishedGuideGroups(locale).flatMap((group) => group.articles);
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: guidesHubCopy(locale).h1,
    itemListElement: items.map(({ slug, article }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.h1,
      url: urlFor(`/guides/${slug}`),
    })),
  };
}
