/**
 * Crawlable SEO for the Bizuply marketing host (bizuply.com).
 *
 * Titles and descriptions are the English strings already shipped in the UI.
 * Language is not in the URL yet, so each public URL has one crawlable version.
 * Hebrew and other UI languages stay client-side until dedicated locale URLs exist.
 */

import { partnerFaqPairs } from "../pages/public/partners/partnerFaq.mjs";
import { crmFaqPairs, getCrmCopy, renderCrmPrerender } from "./crmMarketingCopy.mjs";
import { collaborationsPrerender, collaborationsSchemas } from "./collaborationsSeo.mjs";
import { getCollaborationsCopy } from "../pages/product/collaborations/runtime.js";
import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";
import { WEBSITE_SCAN } from "./websiteScanStory.mjs";
import { HOME_FAQ, HOME_FAQ_TITLE } from "./homeFaq.mjs";
import { HOME_SHELL } from "./homeShell.mjs";
import { STORY } from "./homepageStory.mjs";
import { renderPurpleHomePrerender } from "./homePurplePaint.mjs";
import { marketingNav } from "./marketingNav.mjs";
import { getLocaleMarketingPage } from "./localeMarketing.mjs";
import { GUIDE_SLUGS, getGuide, guidePath } from "./guidesMarketing.mjs";
import { activityMarketingEntries, getActivityPage } from "./activityPages.mjs";
import { getCoreProductStory } from "./coreProductStories.mjs";
import { legalCrawl } from "./legalCrawl.mjs";
import {
  MARKETING_LOCALE_PREFIXES,
  hasLocalizedMarketingPage,
  hreflangTags,
  marketingLocaleMeta,
  marketingPublicUrl,
  splitMarketingLocale,
  withMarketingLocale,
} from "./localePath.mjs";

export const MARKETING_ORIGIN = "https://bizuply.com";

export const MARKETING_ROBOTS_TXT = `User-agent: *
Allow: /
Disallow: /business/
Disallow: /admin
Disallow: /staff
Disallow: /client/
Disallow: /manager/
Disallow: /marketer/
Disallow: /affiliate/dashboard
Disallow: /api/

Sitemap: https://bizuply.com/sitemap.xml
`;

const OG_IMAGE = "https://bizuply.com/bizuply%20logo.png";
const ABOUT_OG_IMAGE = "https://bizuply.com/images/about/og.png";
const ORGANIZATION_LOGO = "https://bizuply.com/android-chrome-512x512.png";
const FACEBOOK_DOMAIN_VERIFICATION = "azd93f5jgru1b53xrjj0dqaco20viu";

/**
 * Indexable marketing routes. Copy matches the English UI strings exactly.
 * `aliases` are extra paths that canonicalize to this page and stay out of the sitemap.
 */
export const MARKETING_PAGES = [
  {
    path: "/",
    title: "BizUply | CRM, lead management, WhatsApp Business API and business tools",
    description:
      "Meet Bizuply: a platform for customer and lead management, WhatsApp Business API, paid campaigns, website building and business automations in one place.",
    crumb: "Bizuply",
    lastmod: "2025-07-09",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/website-scan",
    title: WEBSITE_SCAN.en.title,
    description: WEBSITE_SCAN.en.description,
    crumb: WEBSITE_SCAN.en.crumb,
    lastmod: "2026-11-09",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/about",
    title: "About Bizuply | Our Mission, Approach & Business Platform",
    description:
      "Learn about Bizuply, our mission and our approach to connected business technology. Explore how our software platform and digital services support modern businesses.",
    crumb: "About",
    lastmod: "2026-10-27",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/contact",
    title: "Contact Us - Bizuply | We're Here to Help",
    description: "Contact the Bizuply team for questions, support, and business inquiries.",
    crumb: "Contact",
    lastmod: "2025-07-01",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/partners",
    title: "Bizuply Partner Program | Build recurring revenue with CRM and SaaS",
    description:
      "Apply to the Bizuply Partner Program. Offer CRM, WhatsApp, automation and SaaS. Eligible recurring commission is 30% to 40%. Business Partner membership is $5,000 per year or $499 per month after approval.",
    crumb: "Partners",
    lastmod: "2026-11-06",
    changefreq: "monthly",
    priority: "0.8",
  },
  {
    path: "/terms",
    title: "Terms of Service - Bizuply",
    description:
      "Read Bizuply's Terms of Service, including use of the platform, payments, privacy, user content, limitations of liability, and dispute resolution.",
    crumb: "Terms",
    lastmod: "2025-06-25",
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    path: "/privacy",
    title: "Privacy Policy - Bizuply",
    description:
      "Read Bizuply's Privacy Policy, including how we collect, use, store, protect, and share user and business data.",
    crumb: "Privacy",
    lastmod: "2026-08-09",
    changefreq: "yearly",
    priority: "0.5",
    aliases: ["/privacy-policy"],
  },
  {
    path: "/faq",
    title: "FAQ - Bizuply | Everything you need to know",
    description:
      "Answers to common questions about Bizuply — leads, Meta integration, website building, security and support.",
    crumb: "FAQ",
    lastmod: "2025-07-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/how-it-works",
    title: "How It Works - Bizuply | Platform Guide",
    description:
      "A simple guide on how Bizuply connects businesses with clients, manages appointments, and improves communication with smart automation tools.",
    crumb: "How it works",
    lastmod: "2025-07-01",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/search",
    title: "Business Search | Bizuply",
    description: "Find businesses listed on Bizuply.",
    crumb: "Business search",
    lastmod: "2025-07-09",
    changefreq: "daily",
    priority: "0.9",
  },
  {
    path: "/pricing",
    title: "Plans and prices for the business | BizUply",
    description:
      "Choose the BizUply tools and plan that fit how the business works. Published prices stay on this page, including monthly and yearly billing where a plan offers both.",
    crumb: "Pricing",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/features",
    title: "Bizuply — All the Tools Your Business Needs in One Place",
    description:
      "Explore Bizuply features — an all-in-one platform combining CRM, chat, scheduling, reviews, collaborations, and AI tools for small businesses.",
    crumb: "Features",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/solutions",
    title: "Bizuply — Smart Solutions for Every Type of Business",
    description:
      "Discover Bizuply's tailored solutions for every business type — from service providers and freelancers to shops and collaborations. Manage clients, communication, and growth in one smart place.",
    crumb: "Solutions",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/crm",
    title: "CRM for leads and customers | BizUply",
    description:
      "BizUply CRM keeps leads, customers, statuses, notes and follow-up tasks in one place. The published CRM plan is $49 per month.",
    crumb: "CRM",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/collaborations",
    title: "Business collaborations and opportunities | BizUply",
    description:
      "BizUply gives businesses a place to find other businesses, post an opportunity and exchange a proposal. Statuses are pending, approved or declined. BizUply does not guarantee a partner, a customer or revenue, and it does not set the commercial terms between the two businesses.",
    crumb: "Collaborations",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/website-builder",
    title: "Business websites and stores | BizUply",
    description:
      "Build a site in the BizUply visual editor and publish it to your address. A supported form on that site can create a lead in the CRM. The site has its own price on the pricing page.",
    crumb: "Website builder",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/automations",
    title: "Business automations for customers and processes | BizUply",
    description:
      "BizUply automations run on the business plan. A supported event, such as a new lead, can create a follow-up task. The business plan is $99 per month or $990 per year.",
    crumb: "Automations",
    lastmod: "2026-10-23",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/meta-campaigns",
    title: "Meta Campaign Management for the work after the click | BizUply",
    description:
      "Edit Meta campaigns, ad sets and ads from the BizUply dashboard after the business connects its own ad account. Lead Ads can enter the CRM. Meta bills the spend. BizUply does not replace Ads Manager.",
    crumb: "Meta campaigns",
    lastmod: "2026-10-23",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/guides",
    title: "Guides | Bizuply",
    description:
      "Practical guides on CRM, WhatsApp Cloud API, automations, Meta ads, and the Bizuply website builder.",
    crumb: "Guides",
    lastmod: "2026-10-23",
    changefreq: "weekly",
    priority: "0.7",
  },
  {
    path: "/agents",
    title: "Human agents for leads and follow-up | BizUply",
    description:
      "BizUply agents on this page are people, not a chatbot. They handle defined follow-up on leads according to the service that was purchased. No reply rate or sales rate is promised.",
    crumb: "Agents",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/appointments",
    title: "Appointments and bookings for businesses | BizUply",
    description:
      "BizUply appointments set business hours, a service catalog with duration and price, and 15-minute openings. Appointments belong to the business plan, not to CRM only.",
    crumb: "Appointments",
    lastmod: "2026-10-22",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/business",
    title: "Join businesses — leads, collaborations, and smart management | Bizuply",
    description:
      "Join Bizuply for leads, a website, Meta connection, collaborations, CRM, and appointments — all in one place to grow the business.",
    crumb: "For businesses",
    lastmod: "2026-10-22",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/accessibility",
    title: "Accessibility Statement - Bizuply",
    description:
      "Bizuply's accessibility statement — commitment to digital accessibility, WCAG standards, and support options.",
    crumb: "Accessibility",
    lastmod: "2026-08-01",
    changefreq: "yearly",
    priority: "0.4",
  },
  ...activityMarketingEntries(),
];

const NOINDEX_PREFIXES = [
  "/admin",
  "/staff",
  "/client",
  "/manager",
  "/marketer",
  "/affiliate/dashboard",
  "/partner/dashboard",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/change-password",
  "/staff-login",
  "/checkout",
  "/offer",
  "/dev",
  "/embed",
  "/sign",
  "/proposal",
  "/demo",
  "/guided-demo",
  "/unsubscribe",
  "/trial-ended",
  "/integrations",
  "/store",
  "/whatsapp-api/login",
  "/home-preview",
  "/compliance/report",
  "/compliance/account",
  "/compliance/demo",
  "/compliance/review",
];

export function isSeoDiscoveryPath(pathname) {
  return pathname === "/robots.txt" || pathname === "/sitemap.xml";
}

export function normalizeMarketingPath(pathname) {
  const clean = String(pathname || "/").split(/[?#]/)[0] || "/";
  if (clean.length > 1 && clean.endsWith("/")) return clean.slice(0, -1);
  return clean || "/";
}

export function marketingLegacyRedirectPath(pathname) {
  const path = normalizeMarketingPath(pathname);
  if (path === "/join") return "/business";
  if (path === "/Pricing") return "/pricing";
  return "";
}

export function marketingCanonicalUrl(path) {
  if (path === "/") return `${MARKETING_ORIGIN}/`;
  return `${MARKETING_ORIGIN}${path}`;
}

export function findMarketingPage(pathname) {
  const path = normalizeMarketingPath(pathname);
  for (const page of MARKETING_PAGES) {
    if (page.path === path) return { page, canonicalPath: page.path };
    if (page.aliases?.includes(path)) return { page, canonicalPath: page.path };
  }
  return null;
}

function matchesPrefix(path, prefix) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

export function isMarketingNoindexPath(pathname) {
  const path = normalizeMarketingPath(pathname);
  if (path === "/business") return false;
  if (matchesPrefix(path, "/business")) return true;
  return NOINDEX_PREFIXES.some((prefix) => matchesPrefix(path, prefix));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function jsonLd(data) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${MARKETING_ORIGIN}/#organization`,
    name: "Bizuply LLC",
    legalName: "Bizuply LLC",
    alternateName: ["BizUply", "Bizuply", "ביזאפלי"],
    url: `${MARKETING_ORIGIN}/`,
    logo: ORGANIZATION_LOGO,
    brand: {
      "@type": "Brand",
      name: "BizUply",
      alternateName: ["Bizuply", "ביזאפלי"],
      url: `${MARKETING_ORIGIN}/`,
      logo: ORGANIZATION_LOGO,
    },
    image: OG_IMAGE,
    description:
      "BizUply is the business platform of Bizuply LLC, for CRM, leads, appointments, websites, automations, and WhatsApp. In Hebrew, the brand name is ביזאפלי.",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "support@bizuply.com",
      availableLanguage: ["English", "Hebrew", "Spanish", "Portuguese", "Arabic"],
    },
    sameAs: [
      "https://www.facebook.com/bizuply",
      "https://www.instagram.com/bizuply",
    ],
  };
}

function localizedPage(path, locale) {
  const activity = getActivityPage(path, locale);
  if (activity) return activity;
  if (locale === "he") return getHebrewMarketingPage(path);
  if (locale === "en") return null;
  return getLocaleMarketingPage(path, locale);
}

const ABOUT_FAQ = {
  "en": [
    [
      "What is Bizuply?",
      "Bizuply is a business technology company offering a connected business management platform and digital services. Its software capabilities include CRM, supported marketing tools, WhatsApp Business communication, website creation, appointment scheduling and business automations."
    ],
    [
      "What does Bizuply help businesses do?",
      "Bizuply helps businesses organize customer information, incoming inquiries, communication, appointments and everyday workflows. The available tools are designed to support practical business processes and provide a more connected working environment."
    ],
    [
      "Who can use Bizuply?",
      "Bizuply serves businesses with different operational needs, including independent professionals, small businesses, service providers, marketing teams and growing organizations. The suitability of individual products depends on the workflows and requirements of each business."
    ],
    [
      "Is Bizuply a software platform or a service provider?",
      "Bizuply offers both software products and selected professional digital services. Businesses can use supported platform capabilities independently or explore additional assistance with services such as website setup and workflow configuration."
    ],
    [
      "Can businesses choose individual products?",
      "Bizuply offers different products and plans, allowing businesses to review the available options and select services according to their needs. Current subscriptions, features and prices are listed on the pricing page."
    ],
    [
      "Does Bizuply offer website development?",
      "Bizuply provides website-building tools as well as selected professional website setup services. The available options depend on the type of website and the services requested."
    ],
    [
      "Does Bizuply support WhatsApp Business?",
      "Bizuply offers supported WhatsApp Business Platform connectivity for business communication. Businesses can review the available subscription and messaging options on the relevant product and pricing pages."
    ],
    [
      "How can I get started with Bizuply?",
      "You can explore the platform, review available products and pricing, and create an account to get started with supported services. Businesses seeking professional setup assistance can contact Bizuply to discuss their requirements."
    ],
    [
      "Where is Bizuply based?",
      "Bizuply LLC is a company registered in the United States. For official company details and current contact information, refer to the verified business information published by Bizuply."
    ]
  ],
  "he": [
    [
      "מהי ביזאפלי?",
      "ביזאפלי (Bizuply) היא חברת טכנולוגיה עסקית המציעה פלטפורמת ניהול עסקי מחוברת ושירותים דיגיטליים. יכולות התוכנה שלה כוללות CRM, כלי שיווק נתמכים, תקשורת WhatsApp Business, יצירת אתרים, תיאום פגישות ואוטומציות עסקיות."
    ],
    [
      "במה Bizuply מסייעת לעסקים?",
      "Bizuply מסייעת לעסקים לארגן מידע על לקוחות, פניות נכנסות, תקשורת, פגישות ותהליכי עבודה יומיומיים. הכלים הזמינים נועדו לתמוך בתהליכים עסקיים מעשיים ולספק סביבת עבודה מחוברת יותר."
    ],
    [
      "מי יכול להשתמש ב־Bizuply?",
      "Bizuply משרתת עסקים עם צרכים תפעוליים שונים, ובכלל זה בעלי מקצוע עצמאיים, עסקים קטנים, נותני שירות, צוותי שיווק וארגונים בצמיחה. ההתאמה של כל מוצר תלויה בתהליכי העבודה ובדרישות של כל עסק."
    ],
    [
      "Bizuply היא פלטפורמת תוכנה או ספקית שירות?",
      "Bizuply מציעה גם מוצרי תוכנה וגם שירותים דיגיטליים מקצועיים נבחרים. עסקים יכולים להשתמש ביכולות הנתמכות של הפלטפורמה באופן עצמאי, או לבחון סיוע נוסף בשירותים כמו הקמת אתר והגדרת תהליכי עבודה."
    ],
    [
      "האם עסקים יכולים לבחור מוצרים בודדים?",
      "Bizuply מציעה מוצרים ומסלולים שונים, ומאפשרת לעסקים לבחון את האפשרויות הזמינות ולבחור שירותים בהתאם לצרכים שלהם. המנויים, היכולות והמחירים העדכניים מפורטים בעמוד המחירים."
    ],
    [
      "האם Bizuply מציעה פיתוח אתרים?",
      "Bizuply מספקת כלים לבניית אתרים וגם שירותי הקמת אתר מקצועיים נבחרים. האפשרויות הזמינות תלויות בסוג האתר ובשירותים המבוקשים."
    ],
    [
      "האם Bizuply תומכת ב־WhatsApp Business?",
      "Bizuply מציעה חיבור נתמך ל־WhatsApp Business Platform לתקשורת עסקית. עסקים יכולים לבחון את אפשרויות המנוי והמסרים הזמינות בעמודי המוצר והמחירים הרלוונטיים."
    ],
    [
      "איך אפשר להתחיל עם Bizuply?",
      "אפשר להכיר את הפלטפורמה, לבחון את המוצרים והמחירים הזמינים, וליצור חשבון כדי להתחיל לעבוד עם השירותים הנתמכים. עסקים שמחפשים סיוע מקצועי בהקמה יכולים ליצור קשר עם Bizuply כדי לדון בדרישות שלהם."
    ],
    [
      "היכן Bizuply מבוססת?",
      "Bizuply LLC היא חברה הרשומה בארצות הברית. לפרטים רשמיים של החברה ולפרטי קשר עדכניים, יש לפנות למידע העסקי המאומת שמפרסמת Bizuply."
    ]
  ],
  "es": [
    [
      "¿Qué es Bizuply?",
      "Bizuply es una empresa de tecnología empresarial que ofrece una plataforma conectada de gestión de negocios y servicios digitales. Sus capacidades de software incluyen CRM, herramientas de marketing compatibles, comunicación por WhatsApp Business, creación de sitios web, programación de citas y automatizaciones empresariales."
    ],
    [
      "¿En qué ayuda Bizuply a los negocios?",
      "Bizuply ayuda a los negocios a organizar la información de los clientes, las consultas entrantes, la comunicación, las citas y los flujos de trabajo cotidianos. Las herramientas disponibles están diseñadas para apoyar procesos empresariales prácticos y ofrecer un entorno de trabajo más conectado."
    ],
    [
      "¿Quién puede usar Bizuply?",
      "Bizuply atiende a negocios con distintas necesidades operativas, incluidos profesionales independientes, pequeños negocios, proveedores de servicios, equipos de marketing y organizaciones en crecimiento. La idoneidad de cada producto depende de los flujos de trabajo y de los requisitos de cada negocio."
    ],
    [
      "¿Bizuply es una plataforma de software o un proveedor de servicios?",
      "Bizuply ofrece tanto productos de software como servicios digitales profesionales seleccionados. Los negocios pueden usar las capacidades compatibles de la plataforma de forma independiente, o explorar asistencia adicional con servicios como la configuración de un sitio web y la configuración de flujos de trabajo."
    ],
    [
      "¿Los negocios pueden elegir productos individuales?",
      "Bizuply ofrece distintos productos y planes, y permite a los negocios revisar las opciones disponibles y seleccionar servicios según sus necesidades. Las suscripciones, funciones y precios actuales figuran en la página de precios."
    ],
    [
      "¿Bizuply ofrece desarrollo de sitios web?",
      "Bizuply proporciona herramientas para crear sitios web, así como servicios profesionales seleccionados de configuración de sitios. Las opciones disponibles dependen del tipo de sitio web y de los servicios solicitados."
    ],
    [
      "¿Bizuply admite WhatsApp Business?",
      "Bizuply ofrece conectividad compatible con WhatsApp Business Platform para la comunicación empresarial. Los negocios pueden revisar las opciones disponibles de suscripción y mensajería en las páginas relevantes de producto y de precios."
    ],
    [
      "¿Cómo puedo empezar con Bizuply?",
      "Puede explorar la plataforma, revisar los productos y precios disponibles, y crear una cuenta para empezar con los servicios compatibles. Los negocios que buscan asistencia profesional de configuración pueden contactar a Bizuply para conversar sobre sus requisitos."
    ],
    [
      "¿Dónde tiene su base Bizuply?",
      "Bizuply LLC es una empresa registrada en Estados Unidos. Para los datos oficiales de la empresa y la información de contacto actual, consulte la información empresarial verificada que publica Bizuply."
    ]
  ],
  "pt-BR": [
    [
      "O que é a Bizuply?",
      "A Bizuply é uma empresa de tecnologia empresarial que oferece uma plataforma conectada de gestão de negócios e serviços digitais. Suas capacidades de software incluem CRM, ferramentas de marketing compatíveis, comunicação pelo WhatsApp Business, criação de sites, agendamento de horários e automações empresariais."
    ],
    [
      "No que a Bizuply ajuda os negócios?",
      "A Bizuply ajuda os negócios a organizar informações de clientes, consultas recebidas, comunicação, agendamentos e fluxos de trabalho do dia a dia. As ferramentas disponíveis foram pensadas para apoiar processos empresariais práticos e oferecer um ambiente de trabalho mais conectado."
    ],
    [
      "Quem pode usar a Bizuply?",
      "A Bizuply atende negócios com necessidades operacionais diferentes, incluindo profissionais independentes, pequenos negócios, prestadores de serviços, equipes de marketing e organizações em crescimento. A adequação de cada produto depende dos fluxos de trabalho e dos requisitos de cada negócio."
    ],
    [
      "A Bizuply é uma plataforma de software ou uma prestadora de serviços?",
      "A Bizuply oferece tanto produtos de software quanto serviços digitais profissionais selecionados. Os negócios podem usar as capacidades compatíveis da plataforma de forma independente ou buscar assistência adicional com serviços como a configuração de um site e a configuração de fluxos de trabalho."
    ],
    [
      "Os negócios podem escolher produtos individuais?",
      "A Bizuply oferece diferentes produtos e planos, permitindo que os negócios analisem as opções disponíveis e selecionem serviços de acordo com suas necessidades. Assinaturas, recursos e preços atuais estão descritos na página de preços."
    ],
    [
      "A Bizuply oferece desenvolvimento de sites?",
      "A Bizuply fornece ferramentas para criação de sites, além de serviços profissionais selecionados de configuração de sites. As opções disponíveis dependem do tipo de site e dos serviços solicitados."
    ],
    [
      "A Bizuply oferece suporte ao WhatsApp Business?",
      "A Bizuply oferece conectividade compatível com a WhatsApp Business Platform para comunicação empresarial. Os negócios podem consultar as opções disponíveis de assinatura e de mensagens nas páginas relevantes de produto e de preços."
    ],
    [
      "Como posso começar com a Bizuply?",
      "Você pode explorar a plataforma, revisar os produtos e preços disponíveis e criar uma conta para começar com os serviços compatíveis. Negócios que buscam assistência profissional de configuração podem entrar em contato com a Bizuply para conversar sobre seus requisitos."
    ],
    [
      "Onde a Bizuply está baseada?",
      "A Bizuply LLC é uma empresa registrada nos Estados Unidos. Para os dados oficiais da empresa e as informações de contato atuais, consulte as informações empresariais verificadas publicadas pela Bizuply."
    ]
  ],
  "ar": [
    [
      "ما هي Bizuply؟",
      "Bizuply شركة تقنية أعمال تقدّم منصة مترابطة لإدارة الأعمال وخدمات رقمية. تشمل قدراتها البرمجية إدارة علاقات العملاء، وأدوات تسويق مدعومة، والتواصل عبر WhatsApp Business، وإنشاء المواقع، وجدولة المواعيد، وأتمتة الأعمال."
    ],
    [
      "ماذا تساعد Bizuply الشركات على فعله؟",
      "تساعد Bizuply الشركات على تنظيم معلومات العملاء والاستفسارات الواردة والتواصل والمواعيد وسير العمل اليومي. صُمّمت الأدوات المتاحة لدعم عمليات تجارية عملية وتوفير بيئة عمل أكثر ترابطًا."
    ],
    [
      "من يمكنه استخدام Bizuply؟",
      "تخدم Bizuply أعمالًا ذات احتياجات تشغيلية مختلفة، بما في ذلك المهنيون المستقلون والشركات الصغيرة ومقدّمو الخدمات وفرق التسويق والمؤسسات النامية. تعتمد ملاءمة كل منتج على سير العمل ومتطلبات كل عمل."
    ],
    [
      "هل Bizuply منصة برمجيات أم مقدّم خدمات؟",
      "تقدّم Bizuply منتجات برمجية وخدمات رقمية مهنية مختارة. يمكن للشركات استخدام القدرات المدعومة في المنصة بشكل مستقل، أو استكشاف مساعدة إضافية في خدمات مثل إعداد المواقع وتهيئة سير العمل."
    ],
    [
      "هل يمكن للشركات اختيار منتجات منفردة؟",
      "تقدّم Bizuply منتجات وخططًا مختلفة، ما يتيح للشركات مراجعة الخيارات المتاحة واختيار الخدمات وفق احتياجاتها. الاشتراكات والخصائص والأسعار الحالية مذكورة في صفحة الأسعار."
    ],
    [
      "هل تقدّم Bizuply تطوير مواقع؟",
      "توفّر Bizuply أدوات لبناء المواقع إلى جانب خدمات مهنية مختارة لإعداد المواقع. تعتمد الخيارات المتاحة على نوع الموقع والخدمات المطلوبة."
    ],
    [
      "هل تدعم Bizuply منصة WhatsApp Business؟",
      "تقدّم Bizuply اتصالًا مدعومًا بمنصة WhatsApp Business Platform للتواصل التجاري. يمكن للشركات مراجعة خيارات الاشتراك والمراسلة المتاحة في صفحات المنتج والأسعار ذات الصلة."
    ],
    [
      "كيف أبدأ مع Bizuply؟",
      "يمكنك استكشاف المنصة، ومراجعة المنتجات والأسعار المتاحة، وإنشاء حساب للبدء بالخدمات المدعومة. يمكن للشركات التي تبحث عن مساعدة مهنية في الإعداد التواصل مع Bizuply لمناقشة متطلباتها."
    ],
    [
      "أين تتمركز Bizuply؟",
      "Bizuply LLC شركة مسجّلة في الولايات المتحدة. للاطلاع على البيانات الرسمية للشركة ومعلومات التواصل الحالية، يُرجى الرجوع إلى المعلومات التجارية الموثّقة التي تنشرها Bizuply."
    ]
  ]
};

function faqItems(path, language) {
  if (path === "/website-scan") return WEBSITE_SCAN[language]?.faq || WEBSITE_SCAN.en.faq;
  if (path === "/partners") return partnerFaqPairs(language);
  if (path === "/crm") return crmFaqPairs(language);
  if (path === "/about" && ABOUT_FAQ[language]) return ABOUT_FAQ[language];
  if (path === "/") return HOME_FAQ[language] || HOME_FAQ.en;
  const localized = language === "en" ? null : localizedPage(path, language);
  if (localized?.faq?.length) return localized.faq;
  const guide = path.startsWith("/guides/") ? getGuide(path.slice("/guides/".length), language) : null;
  if (guide?.faq?.length) return guide.faq;
  if (path === "/crm") {
    return language === "he"
      ? [
          ["אילו סטטוסים יש לליד?", "שישה: חדש, נוצר קשר, מעוניין, הומר, אבוד וליד ישן. כל שינוי סטטוס נרשם אוטומטית בציר הזמן של הליד, כך שרואים מתי הוא זז ולאן."],
          ["מאיפה הלידים מגיעים למערכת?", "משלושה ערוצים אוטומטיים: Facebook ו־Instagram Lead Ads דרך חיבור Meta מאושר, טפסי לידים של Google Ads, וטפסים באתר שבניתם ב־Bizuply. לכל ליד נשמר המקור שלו לצד הפרטים."],
          ["האם Bizuply באמת מאושרת על ידי Meta?", "כן. Bizuply היא ספק טכנולוגיה של Meta, והאפליקציה עברה App Review לחיבור Lead Ads. העסק מחבר את דף הפייסבוק שלו בעצמו ומאשר את ההרשאות, ומאותו רגע הלידים זורמים ישירות ל־CRM."],
          ["איך לא מפספסים מעקב?", "בכל ליד אפשר לתעד הערה, שיחה או וואטסאפ, ולפתוח משימה עם תאריך ושעה. משימות שעבר זמנן מופיעות במרכז ההתראות של המערכת, וגם לידים חדשים נכנסים להתראות בזמן אמת."],
          ["מה נשמר בתיק הלקוח?", "פרטי קשר וכתובת, ציר זמן תיעוד שכולל הערות, שיחות, וואטסאפ, משימות, פגישות, קבצים והסכמים — עם העלאת מסמכים (תמונות, PDF, Word, Excel, PowerPoint), היסטוריית פגישות ושדות נתונים מותאמים."],
          ["איך עובד יומן התורים?", "מגדירים שעות פעילות לכל יום בשבוע וקטלוג שירותים עם משך ומחיר. המערכת מחשבת מהם את החלונות הפנויים בקפיצות של 15 דקות, והתור נשמר עם שירות, מחיר, סטטוס תשלום והערה."],
          ["הלקוח יכול לקבוע תור לבד?", "כן. יש עמוד זימון ללקוחות שבו בוחרים שירות ותאריך מתוך אותם חלונות פנויים. בעת קביעת התור נשלח אישור במייל ללקוח ולעסק, והתור מופיע מיד ביומן."],
          ["אפשר לראות תמונת מצב בלי להיכנס ל־CRM?", "כן. לוח הבקרה של העסק מציג לידים חדשים, לידים שלא טופלו, שינוי לעומת התקופה הקודמת, טבלת הלידים האחרונים עם מקור וסטטוס, והפגישות הקרובות."],
          ["כמה עולה ה־CRM?", "CRM בלבד עולה 49 דולר לחודש, בחיוב חודשי מתחדש. החבילה העסקית, שכוללת CRM יחד עם תורים, שיתופים ואוטומציות, עולה 99 דולר לחודש או 990 דולר לשנה."],
        ]
      : [
          ["What statuses can a lead have?", "Six: New, Contacted, Interested, Converted, Lost and Old lead. Every status change is logged automatically on the lead's timeline, so you can see when it moved and where to."],
          ["Where do the leads come from?", "From three automated channels: Facebook and Instagram Lead Ads via an approved Meta connection, Google Ads lead forms, and forms on the site you built in Bizuply. Each lead keeps its source alongside its details."],
          ["Is Bizuply really approved by Meta?", "Yes. Bizuply is a Meta Tech Provider, and the app passed Meta App Review for Lead Ads. The business connects its own Facebook page and approves the permissions, and from that moment the leads flow directly into the CRM."],
          ["How do you avoid missing follow-ups?", "On every lead you can log a note, a call or a WhatsApp, and open a task with a date and time. Overdue tasks appear in the system's notification center, and new leads also enter the alerts in real time."],
          ["What's kept in the client file?", "Contact details and address, a documentation timeline that includes notes, calls, WhatsApp, tasks, appointments, files and agreements — with document uploads (images, PDF, Word, Excel, PowerPoint), appointment history and custom data fields."],
          ["How does the appointment calendar work?", "You set business hours for each day of the week and a service catalog with duration and price. The system computes the available windows from them in 15-minute steps, and the appointment is saved with a service, price, payment status and a note."],
          ["Can the client book an appointment themselves?", "Yes. There's a customer booking page where they choose a service and date from those same available windows. When the appointment is booked, a confirmation email is sent to the client and the business, and the appointment appears on the calendar immediately."],
          ["Can I see a snapshot without opening the CRM?", "Yes. The business dashboard shows new leads, untreated leads, the change versus the previous period, a table of the most recent leads with source and status, and the upcoming appointments."],
          ["What does the CRM cost?", "CRM only is $49 per month and renews monthly. The business plan, which includes CRM together with appointments, collaborations and automations, is $99 per month or $990 per year."],
        ];
  }
  if (path === "/whatsapp-api" && language === "he") {
    return getHebrewMarketingPage("/whatsapp-api")?.faq || [];
  }
  return null;
}

function faqBodyHtml(items) {
  return items.map(([question, answer]) => `<h3>${escapeText(question)}</h3><p>${escapeText(answer)}</p>`).join("");
}

function faqSchemaTag(path, language) {
  const items = faqItems(path, language);
  if (!items?.length) return "";
  return `<script type="application/ld+json">${jsonLd({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: language,
    mainEntity: items.map(([name, text]) => ({
      "@type": "Question",
      name,
      acceptedAnswer: { "@type": "Answer", text },
    })),
  })}</script>`;
}

function pageSchema(page, canonical, language = "en") {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: page.title,
    description: page.description,
    url: canonical,
    inLanguage: language,
    isPartOf: { "@id": `${MARKETING_ORIGIN}/#website` },
  };
}

function breadcrumbSchema(page, canonical, language = "en") {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: language === "he" ? "ביזאפלי" : "BizUply",
      item: `${MARKETING_ORIGIN}/`,
    },
  ];
  if (page.path !== "/") {
    items.push({
      "@type": "ListItem",
      position: 2,
      name: page.crumb,
      item: canonical,
    });
  }
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  };
}

function sharedSocialTags(title, description, canonical, language = "en", image = OG_IMAGE) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImage = escapeHtml(image || OG_IMAGE);
  const ogLocale = marketingLocaleMeta(language).og;
  const ogAlternate = language === "en" ? "he_IL" : "en_US";
  return [
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="BizUply" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${safeImage}" />`,
    `<meta property="og:locale" content="${ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${ogAlternate}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDescription}" />`,
    `<meta name="twitter:image" content="${safeImage}" />`,
    `<link rel="icon" href="/favicon-v2.png?v=2" type="image/png" />`,
    `<link rel="apple-touch-icon" href="/apple-touch-icon-v3.png?v=2" />`,
    `<meta name="facebook-domain-verification" content="${FACEBOOK_DOMAIN_VERIFICATION}" />`,
  ];
}

/**
 * Head tags for the initial HTML response.
 * Returns null when the path should keep the SPA shell unchanged
 * (dynamic public routes such as bookings and partner storefronts).
 */
function guideHead(path, locale) {
  const slug = path.slice("/guides/".length);
  if (!slug || slug.includes("/")) return null;
  const article = getGuide(slug, locale);
  if (!article) return null;
  const canonical = marketingPublicUrl(path, locale);
  const page = { path, title: article.title, description: article.description, crumb: article.h1 };
  return [
    `<title>${escapeHtml(article.title)}</title>`,
    `<meta name="description" content="${escapeHtml(article.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    hreflangTags(path),
    ...sharedSocialTags(article.title, article.description, canonical, locale),
    `<script type="application/ld+json">${jsonLd(organizationSchema())}</script>`,
    `<script type="application/ld+json">${jsonLd(pageSchema(page, canonical, locale))}</script>`,
    `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical, locale))}</script>`,
    `<script type="application/ld+json">${jsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.h1,
      description: article.description,
      dateModified: article.updated,
      inLanguage: locale,
      mainEntityOfPage: canonical,
      author: { "@id": `${MARKETING_ORIGIN}/#organization` },
      publisher: { "@id": `${MARKETING_ORIGIN}/#organization` },
    })}</script>`,
    faqSchemaTag(path, locale),
  ].filter(Boolean).join("\n");
}

function crmDocumentHead(locale) {
  const copy = getCrmCopy(locale);
  const canonical = marketingPublicUrl("/crm", copy.lang);
  const page = { path: "/crm", title: copy.title, description: copy.description, crumb: copy.crumb };
  const application = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BizUply CRM",
    alternateName: ["ביזאפלי CRM", "ביזאפלי"],
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: "https://bizuply.com/crm",
    description: copy.description,
    offers: [
      { "@type": "Offer", name: "CRM Only", price: "49", priceCurrency: "USD", url: "https://bizuply.com/register?plan=crm_only" },
      { "@type": "Offer", name: "Bizuply Business", price: "99", priceCurrency: "USD", url: "https://bizuply.com/pricing" },
      { "@type": "Offer", name: "Bizuply Business yearly", price: "990", priceCurrency: "USD", url: "https://bizuply.com/pricing" },
    ],
  };
  return [
    `<title>${escapeHtml(copy.title)}</title>`,
    `<meta name="description" content="${escapeHtml(copy.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    hreflangTags("/crm"),
    ...sharedSocialTags(copy.title, copy.description, canonical, copy.lang),
    `<script type="application/ld+json">${jsonLd(organizationSchema())}</script>`,
    `<script type="application/ld+json">${jsonLd(pageSchema(page, canonical, copy.lang))}</script>`,
    `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical, copy.lang))}</script>`,
    faqSchemaTag("/crm", copy.lang),
    `<script type="application/ld+json">${jsonLd(application)}</script>`,
  ].join("\n");
}

function collaborationsDocumentHead(locale) {
  const copy = getCollaborationsCopy(locale);
  const lang = ["he", "es", "pt-BR", "ar"].includes(locale) ? locale : "en";
  const story = getCoreProductStory("/collaborations", lang);
  const canonical = marketingPublicUrl("/collaborations", lang);
  const page = {
    path: "/collaborations",
    title: story?.title || copy.seo.title,
    description: story?.description || copy.seo.description,
    crumb: story?.crumb || copy.crumb,
  };
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}" />`,
    `<meta name="robots" content="index, follow" />`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
    hreflangTags("/collaborations"),
    ...sharedSocialTags(page.title, page.description, canonical, lang),
    `<script type="application/ld+json">${jsonLd(organizationSchema())}</script>`,
    `<script type="application/ld+json">${jsonLd(pageSchema(page, canonical, lang))}</script>`,
    `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical, lang))}</script>`,
    ...collaborationsSchemas(lang, canonical).map((schema) => `<script type="application/ld+json">${jsonLd(schema)}</script>`),
  ].join("\n");
}

export function buildMarketingDocumentHead(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  if (path === "/crm") return crmDocumentHead(locale);
  if (path === "/collaborations") return collaborationsDocumentHead(locale);
  if (path.startsWith("/guides/") && path !== "/guides") {
    const head = guideHead(path, locale);
    if (head) return head;
  }
  const localized = locale === "en" ? null : localizedPage(path, locale);
  const found = findMarketingPage(path);
  if (locale !== "en" && !localized && found) {
    return [
      `<title>Bizuply</title>`,
      `<meta name="robots" content="noindex, follow" />`,
      `<link rel="canonical" href="${escapeHtml(marketingPublicUrl(found.canonicalPath, locale))}" />`,
    ].join("\n");
  }

  if ((locale === "en" && found) || localized) {
    const page = localized
      ? { path, title: localized.title, description: localized.description, crumb: localized.crumb }
      : found.page;
    const canonicalPath = localized ? path : found.canonicalPath;
    const canonical = locale === "en" ? marketingCanonicalUrl(canonicalPath) : marketingPublicUrl(canonicalPath, locale);
    const title = escapeHtml(page.title);
    const description = escapeHtml(page.description);
    return [
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      `<meta name="robots" content="index, follow" />`,
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
      hreflangTags(canonicalPath),
      ...sharedSocialTags(page.title, page.description, canonical, locale, path === "/about" ? ABOUT_OG_IMAGE : OG_IMAGE),
      `<script type="application/ld+json">${jsonLd(organizationSchema())}</script>`,
      path === "/" ? `<script type="application/ld+json">${jsonLd(websiteSchema())}</script>` : "",
      `<script type="application/ld+json">${jsonLd(pageSchema(page, canonical, locale))}</script>`,
      `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical, locale))}</script>`,
      path === "/" ? `<script type="application/ld+json">${jsonLd(softwareSchema(page.description, canonical))}</script>` : "",
      path === "/website-scan" ? `<script type="application/ld+json">${jsonLd(scanServiceSchema(locale, canonical))}</script>` : "",
      path === "/website-scan" ? `<script type="application/ld+json">${jsonLd(scanVideoSchema(locale))}</script>` : "",
      faqSchemaTag(path, locale),
    ].filter(Boolean).join("\n");
  }

  if (!isMarketingNoindexPath(path)) return null;

  return [
    `<title>Bizuply</title>`,
    `<meta name="robots" content="noindex, nofollow" />`,
    `<meta name="googlebot" content="noindex, nofollow" />`,
  ].join("\n");
}

function hreflangXml(path) {
  if (path === "/whatsapp-api") {
    const extras = MARKETING_LOCALE_PREFIXES
      .filter((entry) => hasLocalizedMarketingPage(path, entry.locale))
      .map((entry) => `
    <xhtml:link rel="alternate" hreflang="${entry.htmlLang}" href="${marketingPublicUrl(path, entry.locale)}"/>`)
      .join("");
    return `
    <xhtml:link rel="alternate" hreflang="en" href="https://whatsapp.bizuply.com/"/>${extras}
    <xhtml:link rel="alternate" hreflang="x-default" href="https://whatsapp.bizuply.com/"/>`;
  }
  const english = marketingCanonicalUrl(path);
  const extras = MARKETING_LOCALE_PREFIXES
    .filter((entry) => hasLocalizedMarketingPage(path, entry.locale))
    .map((entry) => `
    <xhtml:link rel="alternate" hreflang="${entry.htmlLang}" href="${marketingPublicUrl(path, entry.locale)}"/>`)
    .join("");
  return `
    <xhtml:link rel="alternate" hreflang="en" href="${english}"/>${extras}
    <xhtml:link rel="alternate" hreflang="x-default" href="${english}"/>`;
}

export function buildMarketingSitemapXml() {
  const localizedPaths = [
    ...MARKETING_PAGES.map((page) => page.path),
    "/whatsapp-api",
    ...GUIDE_SLUGS.map((slug) => guidePath(slug)),
  ];
  const localizedUrls = [];
  for (const path of localizedPaths) {
    for (const entry of MARKETING_LOCALE_PREFIXES) {
      if (!hasLocalizedMarketingPage(path, entry.locale)) continue;
      localizedUrls.push({
        path,
        loc: marketingPublicUrl(path, entry.locale),
        lastmod: "2026-10-23",
        changefreq: "monthly",
        priority: path.startsWith("/guides/") ? "0.6" : "0.7",
      });
    }
  }
  const pages = [
    ...MARKETING_PAGES.map((page) => ({ path: page.path, lastmod: page.lastmod, changefreq: page.changefreq, priority: page.priority })),
    ...GUIDE_SLUGS.map((slug) => ({
      path: guidePath(slug),
      lastmod: "2026-10-23",
      changefreq: "monthly",
      priority: "0.6",
    })),
    ...localizedUrls,
  ];
  const urls = pages.map((page) => {
    const loc = page.loc || marketingCanonicalUrl(page.path);
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>${hreflangXml(page.path)}
  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

export function buildMarketingRobotsTxt() {
  return MARKETING_ROBOTS_TXT;
}

const EXACT_APP_PATHS = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/change-password",
  "/staff-login",
  "/support",
  "/early-access",
  "/trial-ended",
  "/unsubscribe",
  "/plans",
  "/checkout",
  "/checkout/success",
  "/quick-jobs",
  "/quick-jobs/new",
  "/businesses",
  "/business-support",
]);

const APP_PREFIXES = [
  "/admin",
  "/staff",
  "/client",
  "/manager",
  "/marketer",
  "/business",
  "/book",
  "/bizuply",
  "/p",
  "/s",
  "/saas",
  "/partner",
  "/partner-materials",
  "/affiliate",
  "/embed",
  "/dev",
  "/offer",
  "/store",
  "/integrations",
  "/sign",
  "/demo",
  "/guided-demo",
  "/proposal",
  "/website-invite",
  "/quick-jobs",
  "/compliance",
  "/invistimo",
  "/whatsapp-api",
  "/checkout",
];

function matchesAppPrefix(path, prefix) {
  return path === prefix || path.startsWith(`${prefix}/`);
}

/** True when the marketing host should return a real HTTP 404. */
export function isUnknownMarketingPath(pathname) {
  const { path } = splitMarketingLocale(pathname);
  if (path === "/whatsapp-api") return false;
  if (findMarketingPage(path) || marketingLegacyRedirectPath(path)) return false;
  if (isMarketingNoindexPath(path) || EXACT_APP_PATHS.has(path)) return false;
  if (APP_PREFIXES.some((prefix) => matchesAppPrefix(path, prefix))) return false;
  return true;
}

export function marketingPublicRedirect(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  if (locale === "en" && path === "/whatsapp-api") return "https://whatsapp.bizuply.com/";
  const legacy = marketingLegacyRedirectPath(path);
  if (!legacy) return "";
  return withMarketingLocale(legacy, locale);
}

function escapeText(value) {
  return escapeHtml(value);
}

function renderSection(section) {
  if (Array.isArray(section)) {
    const [heading, body] = section;
    return `<h2>${escapeText(heading)}</h2>${(body || []).map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("")}`;
  }
  const parts = [`<h2>${escapeText(section.heading)}</h2>`];
  for (const paragraph of section.paragraphs || []) parts.push(`<p>${escapeText(paragraph)}</p>`);
  for (const sub of section.subsections || []) {
    parts.push(`<h3>${escapeText(sub.heading)}</h3>`);
    for (const paragraph of sub.paragraphs || []) parts.push(`<p>${escapeText(paragraph)}</p>`);
  }
  if (section.steps?.length) parts.push(`<ol>${section.steps.map((step) => `<li>${escapeText(step)}</li>`).join("")}</ol>`);
  if (section.example?.body) parts.push(`<p><strong>${escapeText(section.example.title || "")}</strong> ${escapeText(section.example.body)}</p>`);
  for (const item of section.mistakes || []) parts.push(`<p><strong>${escapeText(item.problem)}</strong> ${escapeText(item.fix)}</p>`);
  if (section.table?.rows?.length) {
    const head = (section.table.columns || []).map((column) => `<th>${escapeText(column)}</th>`).join("");
    const rows = section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeText(cell)}</td>`).join("")}</tr>`).join("");
    parts.push(`<table>${head ? `<thead><tr>${head}</tr></thead>` : ""}${rows}</table>`);
  }
  for (const shot of section.shots || []) {
    parts.push(`<figure><img src="${escapeHtml(shot.src)}" alt="${escapeText(shot.caption || section.heading)}" /><figcaption>${escapeText(shot.caption || "")}</figcaption></figure>`);
  }
  return parts.join("");
}

function renderLocalized(page, locale, path) {
  const meta = marketingLocaleMeta(locale);
  const paragraphs = (page.lede ? [`<p>${escapeText(page.lede)}</p>`] : []).concat((page.paragraphs || []).map((paragraph) => `<p>${escapeText(paragraph)}</p>`)).join("");
  const sections = (page.sections || []).map(renderSection).join("");
  const faqs = page.faq?.length ? page.faq : faqItems(path, locale);
  const faqHeading = path === "/" && HOME_FAQ_TITLE[locale]
    ? HOME_FAQ_TITLE[locale]
    : locale === "he" ? "שאלות נפוצות" : locale === "ar" ? "أسئلة شائعة" : locale === "es" ? "Preguntas frecuentes" : locale === "pt-BR" ? "Perguntas frequentes" : "FAQ";
  const faq = faqs ? `<h2>${faqHeading}</h2>${faqBodyHtml(faqs)}` : "";
  const servicePrefix = locale === "en" ? "" : locale === "pt-BR" ? "/pt-br" : `/${locale}`;
  const service = page.serviceLink?.href
    ? `<p><a href="${escapeHtml(`${servicePrefix}${page.serviceLink.href}`)}">${escapeText(page.serviceLink.label)}</a></p>`
    : "";
  const updated = page.updated ? `<p>${escapeText(locale === "he" ? `עודכן ${page.updated}` : locale === "ar" ? `آخر تحديث ${page.updated}` : locale === "es" ? `Actualizado el ${page.updated}` : locale === "pt-BR" ? `Atualizado em ${page.updated}` : `Updated ${page.updated}`)}</p>` : "";
  return {
    lang: meta.htmlLang,
    dir: meta.dir,
    inner: `<main lang="${meta.htmlLang}" dir="${meta.dir}"><h1>${escapeText(page.h1)}</h1>${updated}${paragraphs}${sections}${service}${faq}</main>`,
  };
}

function localeHref(locale, path) {
  const prefix = locale === "pt-BR" ? "/pt-br" : locale && locale !== "en" ? `/${locale}` : "";
  if (!path || path === "/") return prefix || "/";
  return `${prefix}${path}`;
}

function homeStoryHtml(locale) {
  const story = STORY[locale] || STORY.en;
  const ways = story.ways
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  const films = story.films
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p><ul>${item.points.map((point) => `<li>${escapeText(point)}</li>`).join("")}</ul>`)
    .join("");
  const steps = story.steps
    .map((item, index) => `<h3>0${index + 1} ${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  const audiences = story.audiences
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  const why = story.whyCards
    .map((item) => `<h3>${escapeText(item.title)}</h3><p>${escapeText(item.body)}</p>`)
    .join("");
  return [
    `<section><h2>${escapeText(story.waysTitle)}</h2><p>${escapeText(story.waysLead)}</p>${ways}</section>`,
    `<section><h2>${escapeText(story.showTitle)}</h2><p>${escapeText(story.showLead)}</p>${films}</section>`,
    `<section><h2>${escapeText(story.journeyTitle)}</h2><p>${escapeText(story.journeyLead)}</p>${steps}</section>`,
    `<section><h2>${escapeText(story.audienceTitle)}</h2><p>${escapeText(story.audienceLead)}</p>${audiences}</section>`,
    `<section><h2>${escapeText(story.whyTitle)}</h2><p>${escapeText(story.whyLead)}</p>${why}</section>`,
    `<section><h2>${escapeText(story.finalTitle)}</h2><p>${escapeText(story.finalLead)}</p></section>`,
  ].join("");
}

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${MARKETING_ORIGIN}/#website`,
    name: "BizUply",
    alternateName: ["Bizuply", "bizuply.com", "ביזאפלי"],
    url: `${MARKETING_ORIGIN}/`,
    description:
      "BizUply (ביזאפלי) is the business platform at https://bizuply.com, published by Bizuply LLC.",
    inLanguage: ["en", "he", "es", "pt-BR", "ar"],
    publisher: { "@id": `${MARKETING_ORIGIN}/#organization` },
  };
}

function scanServiceSchema(locale, canonical) {
  const copy = WEBSITE_SCAN[locale] || WEBSITE_SCAN.en;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Bizuply Compliance AI",
    serviceType: "Website scan",
    provider: { "@id": `${MARKETING_ORIGIN}/#organization` },
    areaServed: "Worldwide",
    url: canonical,
    description: copy.description,
    inLanguage: locale,
    offers: [
      { "@type": "Offer", name: "Free scan", price: "0", priceCurrency: "USD", description: "First scan with a score and a finding summary. No checkout." },
      { "@type": "Offer", name: "One-time full report", price: "35", priceCurrency: "USD", description: "One full scan with findings, evidence, recommendations and a PDF. Checkout is not open." },
      { "@type": "Offer", name: "Quarterly monitoring", price: "119", priceCurrency: "USD", description: "Four full scans a year, billed once a year in advance. Checkout is not open." },
      { "@type": "Offer", name: "Monthly monitoring", price: "300", priceCurrency: "USD", description: "Twelve full scans a year, billed once a year in advance. Checkout is not open." },
    ],
  };
}

function scanVideoSchema(locale) {
  const copy = WEBSITE_SCAN[locale] || WEBSITE_SCAN.en;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: copy.videoTitle,
    description: copy.transcript,
    thumbnailUrl: `${MARKETING_ORIGIN}/media/compliance-demo/poster-${locale === "pt-BR" ? "pt" : locale}.jpg`,
    uploadDate: "2026-11-09",
    contentUrl: `${MARKETING_ORIGIN}/media/compliance-demo/${locale === "pt-BR" ? "pt" : locale}.mp4`,
    inLanguage: locale,
  };
}

function softwareSchema(description, canonical) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BizUply",
    alternateName: ["Bizuply", "bizuply.com", "ביזאפלי"],
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description,
    url: canonical,
    offers: [
      { "@type": "Offer", name: "CRM", price: "49", priceCurrency: "USD", description: "CRM plan, billed monthly" },
      { "@type": "Offer", name: "Business", price: "99", priceCurrency: "USD", description: "Business plan, billed monthly" },
      { "@type": "Offer", name: "Business annual", price: "990", priceCurrency: "USD", description: "Business plan, billed yearly" },
      { "@type": "Offer", name: "WhatsApp Business API", price: "29", priceCurrency: "USD", description: "Per connected number, billed monthly. Meta messaging charges are separate." },
    ],
  };
}

function renderHomePrerender(locale) {
  // Purple cinematic shell only — never emit the legacy dark home-hero.
  return renderPurpleHomePrerender(locale);
}

function legalPrerender(path) {
  const doc = path === "/terms" ? legalCrawl.terms : legalCrawl.privacy;
  const body = doc.paragraphs.map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("");
  return {
    lang: "en",
    dir: "ltr",
    inner: `<article lang="en" dir="ltr"><h1>${escapeText(doc.title)}</h1>${body}</article>`,
  };
}

export function buildMarketingPrerender(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  if (locale === "en" && (path === "/privacy" || path === "/privacy-policy" || path === "/terms")) return legalPrerender(path);
  if (path === "/crm") {
    const copy = getCrmCopy(locale);
    return { lang: copy.lang, dir: copy.dir, inner: renderCrmPrerender(locale) };
  }
  if (path === "/collaborations") {
    const collaborationStory = getCoreProductStory(path, locale);
    if (collaborationStory?.h1) return renderLocalized(collaborationStory, locale, path);
    return collaborationsPrerender(locale);
  }
  if (path === "/") return renderHomePrerender(locale);
  if (path.startsWith("/guides/") && path !== "/guides") {
    const article = getGuide(path.slice("/guides/".length), locale);
    if (!article?.h1) return null;
    return renderLocalized(article, locale, path);
  }
  const activity = getActivityPage(path, locale);
  if (activity?.h1) return renderLocalized(activity, locale, path);
  if (locale !== "en") {
    const localized = localizedPage(path, locale);
    if (!localized?.h1) return null;
    return renderLocalized(localized, locale, path);
  }
  if (path === "/website-scan") return renderLocalized(WEBSITE_SCAN.en, "en", path);
  const englishStory = getCoreProductStory(path, "en");
  if (englishStory?.h1) return renderLocalized(englishStory, "en", path);
  const found = findMarketingPage(path);
  if (!found?.page) return null;
  const heading = path === "/partners"
    ? "Build businesses. Expand opportunities. Earn together."
    : path === "/crm"
    ? "A CRM for leads, customers, and the sales process"
    : path === "/about"
      ? "Meet BizUply"
      : (found.page.title.split("|")[0].trim() || found.page.crumb || "Bizuply");
  const crmFaqs = path === "/crm" ? faqItems("/crm", "en") : null;
  const aboutFaqs = path === "/about" ? faqItems("/about", "en") : null;
  const partnerFaqs = path === "/partners" ? faqItems("/partners", "en") : null;
  const extra = path === "/partners"
    ? `<p>Submitting an application is free and waits for admin approval. This page does not start a live charge. Payment happens only after approval.</p><h2>Affiliate</h2><p>No membership fee on the percent track (partner_percent). Commission is currently 15% of eligible sales in the catalog.</p><h2>Business Partner</h2><p>Membership is $499 per month or $5,000 per year after approval. Recurring commission follows the partner agreement: 30% for 1–19 active paying customers, 35% for 20–39, and 40% for 40 or more. Eligible one-time deals earn 10%.</p><p>Industry SaaS products such as BeautyFlow are marked coming soon for partner resale.</p><h2>Questions partners ask</h2>${faqBodyHtml(partnerFaqs)}<p><a href="/partners#apply">Apply for partnership</a> <a href="/partner/register?planKey=partner_international&billing=annual">Full registration (after approval)</a> <a href="/crm">CRM</a> <a href="/whatsapp-api">WhatsApp Business API</a> <a href="/meta-campaigns">Meta campaigns</a> <a href="/website-builder">Websites</a> <a href="/automations">Automations</a></p>`
    : path === "/crm"
    ? `<h2>Who it is for</h2><p>Service businesses, teams running lead ads, and businesses whose Bizuply website form should enter the same pipeline.</p><h2>Pricing</h2><p>CRM only is $49 per month and renews monthly. The business plan, which includes CRM together with appointments, collaborations and automations, is $99 per month or $990 per year.</p><h2>FAQ</h2>${faqBodyHtml(crmFaqs)}`
    : path === "/about" && aboutFaqs
      ? `<p>Bizuply develops software for customers, communication, marketing, websites and day-to-day operations, together with professional services that help a business put that software to work.</p><p>Bizuply LLC is registered in the United States. Support is at support@bizuply.com.</p><h2>Business Platform</h2><p>A connected workspace for managing customers, communication, marketing, and everyday business operations.</p><h2>Ready-Made SaaS Solutions</h2><p>Industry-focused software solutions designed around specific business workflows.</p><h2>Professional Digital Services</h2><p>Practical assistance with websites, technology setup, and connected business solutions.</p><p><a href="/platform">Explore Bizuply</a> <a href="/contact">Contact Our Team</a></p><h2>Frequently asked questions about Bizuply</h2>${faqBodyHtml(aboutFaqs)}`
      : "";
  return {
    lang: "en",
    dir: "ltr",
    inner: `<main lang="en" dir="ltr"><h1>${escapeText(heading)}</h1><p>${escapeText(found.page.description)}</p>${extra}</main>`,
  };
}

export function buildNotFoundHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Page not found | Bizuply</title>
  <meta name="robots" content="noindex, nofollow" />
  <meta name="googlebot" content="noindex, nofollow" />
</head>
<body>
  <main>
    <h1>Page not found</h1>
    <p>This address is not a Bizuply page.</p>
    <p><a href="https://bizuply.com/">Bizuply</a></p>
  </main>
</body>
</html>
`;
}
