/**
 * Crawlable SEO for the Bizuply marketing host (bizuply.com).
 *
 * Titles and descriptions are the English strings already shipped in the UI.
 * Language is not in the URL yet, so each public URL has one crawlable version.
 * Hebrew and other UI languages stay client-side until dedicated locale URLs exist.
 */

import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "./localeMarketing.mjs";
import { GUIDE_SLUGS, getGuide, guidePath } from "./guidesMarketing.mjs";
import { activityMarketingEntries, getActivityPage } from "./activityPages.mjs";
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
const ORGANIZATION_LOGO = "https://bizuply.com/android-chrome-512x512.png";
const FACEBOOK_DOMAIN_VERIFICATION = "azd93f5jgru1b53xrjj0dqaco20viu";

/**
 * Indexable marketing routes. Copy matches the English UI strings exactly.
 * `aliases` are extra paths that canonicalize to this page and stay out of the sitemap.
 */
export const MARKETING_PAGES = [
  {
    path: "/",
    title: "Bizuply — Build, manage, market and grow",
    description:
      "Bizuply is software you run yourself — CRM, websites, automations, Meta campaigns and WhatsApp — plus setup work listed on the pricing page. The official site is bizuply.com. In Hebrew, the brand name is ביזאפלי.",
    crumb: "Bizuply",
    lastmod: "2025-07-09",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About Bizuply | The platform that grows with you",
    description:
      "Meet Bizuply (ביזאפלי) — an American technology company for business management, CRM, leads, websites, automations, agents, and collaborations in one place.",
    crumb: "About",
    lastmod: "2025-07-01",
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
    title: "Service Packages | Bizuply",
    description:
      "Bizuply service packages — lead response, appointment booking, CRM, automations, campaigns, and content. Pick services and request a tailored quote.",
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
    title: "CRM Software with Meta Lead Ads Integration | Bizuply",
    description:
      "Manage leads and customers in one CRM. Meta Lead Ads, Google Ads, and your website feed one pipeline, with a client file and appointments. CRM only is $49/month.",
    crumb: "CRM",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/collaborations",
    title: "Business Collaborations | Bizuply",
    description:
      "Find business partners, manage proposals and real-time chat, post to the opportunities marketplace, and grow together — all in one place with Bizuply.",
    crumb: "Collaborations",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/website-builder",
    title: "Professional Website Builder | Bizuply",
    description:
      "Build a website, store, or booking site in a visual editor and publish it to your own domain — with every inquiry from the site flowing straight into your CRM.",
    crumb: "Website builder",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/automations",
    title: "Automations for Your Business | Bizuply",
    description:
      "Reminders, follow-ups, tasks, and alerts that run in the background and stay connected to your CRM — so fewer leads slip through the cracks.",
    crumb: "Automations",
    lastmod: "2026-10-23",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/meta-campaigns",
    title: "Meta Campaign Management | Bizuply",
    description:
      "Create and edit Meta campaigns, ad sets, and ads from the Bizuply dashboard, and send Lead Ads into the CRM. Meta bills the ad spend.",
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
    title: "Human Agents for Your Business | Bizuply",
    description:
      "A human service layer that handles leads, schedules meetings, fills in details and manages partnerships — right inside your Bizuply CRM.",
    crumb: "Agents",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/appointments",
    title: "Appointment Scheduling | Bizuply",
    description:
      "Manage your appointment calendar, reminders, and client follow-up with Bizuply Appointments.",
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
  if (path === "/guides/how-search-engines-read-a-business-site") return "/guides/what-customers-should-see";
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
    name: "Bizuply",
    alternateName: ["ביזאפלי", "BizUply"],
    url: `${MARKETING_ORIGIN}/`,
    logo: ORGANIZATION_LOGO,
    image: OG_IMAGE,
    description:
      "Bizuply is a business platform for CRM, leads, appointments, websites, automations, and WhatsApp. In Hebrew, the brand name is ביזאפלי.",
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

function faqItems(path, language) {
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
    isPartOf: {
      "@type": "WebSite",
      name: "Bizuply",
      url: `${MARKETING_ORIGIN}/`,
    },
  };
}

function breadcrumbSchema(page, canonical) {
  const items = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Bizuply",
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

function sharedSocialTags(title, description, canonical, language = "en") {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const ogLocale = marketingLocaleMeta(language).og;
  const ogAlternate = language === "en" ? "he_IL" : "en_US";
  return [
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Bizuply" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:locale" content="${ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${ogAlternate}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${safeTitle}" />`,
    `<meta name="twitter:description" content="${safeDescription}" />`,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`,
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
    `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical))}</script>`,
    `<script type="application/ld+json">${jsonLd({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: article.h1,
      description: article.description,
      dateModified: article.updated,
      inLanguage: locale,
      mainEntityOfPage: canonical,
      author: { "@type": "Organization", name: "Bizuply", url: "https://bizuply.com/" },
      publisher: { "@type": "Organization", name: "Bizuply", url: "https://bizuply.com/" },
    })}</script>`,
    faqSchemaTag(path, locale),
  ].filter(Boolean).join("\n");
}

export function buildMarketingDocumentHead(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
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
      ...sharedSocialTags(page.title, page.description, canonical, locale),
      `<script type="application/ld+json">${jsonLd(organizationSchema())}</script>`,
      `<script type="application/ld+json">${jsonLd(pageSchema(page, canonical, locale))}</script>`,
      `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical))}</script>`,
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
  if (section.steps?.length) parts.push(`<ol>${section.steps.map((step) => `<li>${escapeText(step)}</li>`).join("")}</ol>`);
  if (section.example?.body) parts.push(`<p><strong>${escapeText(section.example.title || "")}</strong> ${escapeText(section.example.body)}</p>`);
  for (const item of section.mistakes || []) parts.push(`<p><strong>${escapeText(item.problem)}</strong> ${escapeText(item.fix)}</p>`);
  if (section.table?.rows?.length) {
    const head = (section.table.columns || []).map((column) => `<th>${escapeText(column)}</th>`).join("");
    const rows = section.table.rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeText(cell)}</td>`).join("")}</tr>`).join("");
    parts.push(`<table>${head ? `<thead><tr>${head}</tr></thead>` : ""}${rows}</table>`);
  }
  return parts.join("");
}

function renderLocalized(page, locale, path) {
  const meta = marketingLocaleMeta(locale);
  const paragraphs = (page.lede ? [`<p>${escapeText(page.lede)}</p>`] : []).concat((page.paragraphs || []).map((paragraph) => `<p>${escapeText(paragraph)}</p>`)).join("");
  const sections = (page.sections || []).map(renderSection).join("");
  const faqs = page.faq?.length ? page.faq : faqItems(path, locale);
  const faqHeading = locale === "he" ? "שאלות נפוצות" : locale === "ar" ? "أسئلة شائعة" : locale === "es" ? "Preguntas frecuentes" : locale === "pt-BR" ? "Perguntas frequentes" : "FAQ";
  const faq = faqs ? `<h2>${faqHeading}</h2>${faqBodyHtml(faqs)}` : "";
  const updated = page.updated ? `<p>${escapeText(locale === "he" ? `עודכן ${page.updated}` : locale === "ar" ? `آخر تحديث ${page.updated}` : locale === "es" ? `Actualizado el ${page.updated}` : locale === "pt-BR" ? `Atualizado em ${page.updated}` : `Updated ${page.updated}`)}</p>` : "";
  return {
    lang: meta.htmlLang,
    dir: meta.dir,
    inner: `<main lang="${meta.htmlLang}" dir="${meta.dir}"><h1>${escapeText(page.h1)}</h1>${updated}${paragraphs}${sections}${faq}</main>`,
  };
}

export function buildMarketingPrerender(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
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
  const found = findMarketingPage(path);
  if (!found?.page) return null;
  if (path === "/") {
    return {
      lang: "en",
      dir: "ltr",
      inner: `<main lang="en" dir="ltr"><h1>Bizuply</h1><p>Bizuply is a business platform for CRM, leads, appointments, websites, automations, and WhatsApp.</p><p>The official website is bizuply.com. In Hebrew, the brand name is ביזאפלי.</p></main>`,
    };
  }
  const heading = path === "/crm"
    ? "Every lead, every client, every appointment in one place"
    : (found.page.title.split("|")[0].trim() || found.page.crumb || "Bizuply");
  const crmFaqs = path === "/crm" ? faqItems("/crm", "en") : null;
  const extra = path === "/crm"
    ? `<h2>Who it is for</h2><p>Service businesses, teams running lead ads, and businesses whose Bizuply website form should enter the same pipeline.</p><h2>Pricing</h2><p>CRM only is $49 per month and renews monthly. The business plan, which includes CRM together with appointments, collaborations and automations, is $99 per month or $990 per year.</p><h2>FAQ</h2>${faqBodyHtml(crmFaqs)}`
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
