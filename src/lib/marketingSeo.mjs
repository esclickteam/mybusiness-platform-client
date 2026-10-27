/**
 * Crawlable SEO for the Bizuply marketing host (bizuply.com).
 *
 * Titles and descriptions are the English strings already shipped in the UI.
 * Language is not in the URL yet, so each public URL has one crawlable version.
 * Hebrew and other UI languages stay client-side until dedicated locale URLs exist.
 */

import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";
import { HOME_FAQ, HOME_FAQ_TITLE } from "./homeFaq.mjs";
import { HOME_SHELL } from "./homeShell.mjs";
import { marketingNav } from "./marketingNav.mjs";
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
    title: "Bizuply | All-in-One Business Management Platform & CRM",
    description:
      "Manage leads, customers, WhatsApp Business, Meta campaigns, appointments, websites and automations in one connected platform. Discover Bizuply.",
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

function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bizuply",
    url: `${MARKETING_ORIGIN}/`,
    publisher: { "@type": "Organization", name: "Bizuply", url: `${MARKETING_ORIGIN}/` },
  };
}

function softwareSchema(description, url) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Bizuply",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url,
    description,
    offers: [
      { "@type": "Offer", name: "CRM", price: "49", priceCurrency: "USD" },
      { "@type": "Offer", name: "Business", price: "99", priceCurrency: "USD" },
      { "@type": "Offer", name: "Business yearly", price: "990", priceCurrency: "USD" },
      { "@type": "Offer", name: "WhatsApp Business API", price: "29", priceCurrency: "USD" },
    ],
  };
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
      path === "/" ? `<script type="application/ld+json">${jsonLd(websiteSchema())}</script>` : "",
      path === "/" ? `<script type="application/ld+json">${jsonLd(softwareSchema(page.description, canonical))}</script>` : "",
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

const HOME_CHANNELS = [
  ["Facebook", "facebook"],
  ["Instagram", "instagram"],
  ["Meta", "meta"],
  ["WhatsApp", "whatsapp"],
  ["Google Ads", "google"],
  ["site", "site"],
];

function channelMark(kind) {
  if (kind === "meta") return `<img src="/meta.svg" alt="" width="28" height="28">`;
  if (kind === "google") return `<img src="/google-ads.svg" alt="" width="28" height="28">`;
  if (kind === "facebook") {
    return `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#1877F2" d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.24 10.44 22v-7.03H7.9v-2.91h2.54V9.84c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.91h-2.34V22C18.34 21.24 22 17.08 22 12.06z"/></svg>`;
  }
  if (kind === "instagram") {
    return `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><defs><linearGradient id="home-ig-shell" x1="0" y1="24" x2="24" y2="0"><stop offset="0%" stop-color="#feda75"/><stop offset="45%" stop-color="#d62976"/><stop offset="100%" stop-color="#4f5bd5"/></linearGradient></defs><rect width="24" height="24" rx="6" fill="url(#home-ig-shell)"/><circle cx="12" cy="12" r="4.2" fill="none" stroke="#fff" stroke-width="1.6"/><circle cx="17.2" cy="6.8" r="1" fill="#fff"/></svg>`;
  }
  if (kind === "whatsapp") {
    return `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path fill="#25D366" d="M12.04 2C6.58 2 2.15 6.4 2.15 11.83c0 1.74.46 3.44 1.34 4.94L2 22l5.39-1.4a10 10 0 0 0 4.65 1.15h.01c5.46 0 9.89-4.4 9.89-9.83C21.94 6.4 17.5 2 12.04 2zm5.76 13.85c-.24.68-1.4 1.3-1.94 1.38-.5.08-1.12.11-1.81-.11-.41-.14-.95-.31-1.64-.61-2.88-1.25-4.76-4.15-4.9-4.35-.14-.19-1.17-1.55-1.17-2.96s.74-2.1 1-2.39c.26-.28.57-.35.76-.35h.55c.17 0 .41-.07.64.49.24.58.82 2 .89 2.15.07.14.12.32.02.51-.1.19-.14.31-.28.48-.14.16-.3.37-.42.49-.14.14-.29.29-.12.56.16.28.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.44.12.6-.07.17-.19.7-.81.89-1.09.19-.28.37-.23.63-.14.26.09 1.64.77 1.92.91.28.14.47.21.54.33.07.12.07.68-.17 1.36z"/></svg>`;
  }
  return `<svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><rect width="24" height="24" rx="6" fill="#e0e7ff"/><path d="M7 7.5h10M7 12h10M7 16.5h6" stroke="#4338ca" stroke-width="1.6" stroke-linecap="round"/></svg>`;
}

function renderHomePrerender(locale) {
  const meta = marketingLocaleMeta(locale);
  const copy = HOME_SHELL[locale] || HOME_SHELL.en;
  const href = (path) => localeHref(locale, path);
  const nav = marketingNav(locale).map((group) => (
    group.links
      ? `<span class="site-header__link site-nav__button">${escapeText(group.label)}</span>`
      : `<a class="site-header__link" href="${escapeHtml(href(group.to))}">${escapeText(group.label)}</a>`
  )).join("");
  const channel = ([name, kind]) => {
    const label = kind === "site" ? copy.channelSite : name;
    return `<li class="home-channel">${channelMark(kind)}<span><strong>${escapeText(label)}</strong></span></li>`;
  };
  const row = HOME_CHANNELS.map(channel).join("");
  const track = `<ul class="home-marquee__row">${row}</ul><ul class="home-marquee__row" aria-hidden="true">${row}</ul>`;
  const short = locale === "pt-BR" ? "PT" : String(meta.htmlLang || "en").slice(0, 2).toUpperCase();
  const faqs = faqItems("/", locale);
  const faqTitle = HOME_FAQ_TITLE[locale] || HOME_FAQ_TITLE.en;
  return {
    lang: meta.htmlLang,
    dir: meta.dir,
    inner: `<main class="home-shell" lang="${meta.htmlLang}" dir="${meta.dir}"><header class="site-header"><nav class="site-header__bar" aria-label="${escapeText(copy.navAria)}"><a class="site-header__logo" href="${escapeHtml(href("/"))}"><img src="/logo-mark.svg" alt="BizUply" width="176" height="52" fetchpriority="low" decoding="async"></a><div class="site-header__nav">${nav}</div><div class="site-header__actions"><span class="site-header__icon-btn">${short}</span><a class="site-header__signin" href="${escapeHtml(href("/login"))}">${escapeText(copy.login)}</a><a class="site-header__cta" href="${escapeHtml(href("/pricing"))}">${escapeText(copy.cta)}</a></div><div class="site-header__mobile"><span class="site-header__icon-btn">${short}</span><a class="site-header__icon-btn" href="${escapeHtml(href("/login"))}" aria-label="${escapeText(copy.login)}"></a><span class="site-header__burger" aria-hidden="true"><span></span><span></span><span></span></span></div></nav></header><section class="home-hero"><div class="home-hero__glow" aria-hidden="true"></div><div class="home-hero__grid"><div><h1 class="home-hero__title">${escapeText(copy.headline)}</h1><p class="home-hero__lead">${escapeText(copy.subtitle)}</p><p class="home-hero__note">${escapeText(copy.supportLine)}</p><div class="home-hero__actions"><a class="home-cta home-cta--primary" href="${escapeHtml(href("/register"))}">${escapeText(copy.startTrial)}</a><a class="home-cta home-cta--ghost" href="${escapeHtml(href("/platform"))}">${escapeText(copy.explore)}</a></div></div><div class="home-stage"><img class="home-stage__main" src="/demo-media/home/crm.jpg" alt="${escapeText(copy.stageAlt)}" width="1280" height="800" fetchpriority="high" decoding="async"><img class="home-stage__float home-stage__float--a" src="/demo-media/home/frames/hero-whatsapp.jpg" alt="${escapeText(copy.stageWhatsappAlt)}" width="1280" height="800"><img class="home-stage__float home-stage__float--b" src="/demo-media/home/frames/hero-calendar.jpg" alt="${escapeText(copy.stageAppointmentsAlt)}" width="1280" height="800"><span class="home-cursor" aria-hidden="true"></span></div></div><div class="home-flow"><div class="home-flow__inner"><h2 class="home-flow__title">${escapeText(copy.flowTitle)}</h2><p class="home-flow__lead">${escapeText(copy.flowBody)}</p><div class="home-flow__board"><div class="home-marquee"><div class="home-marquee__track">${track}</div></div><div class="home-flow__line" aria-hidden="true"></div><div class="home-flow__crm"><strong>${escapeText(copy.flowCrm)}</strong></div></div></div></div></section><section class="home-crawl"><h2>${escapeText(faqTitle)}</h2>${faqBodyHtml(faqs)}</section></main>`,
  };
}

export function buildMarketingPrerender(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
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
  const found = findMarketingPage(path);
  if (!found?.page) return null;
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
