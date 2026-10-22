/**
 * Crawlable SEO for the Bizuply marketing host (bizuply.com).
 *
 * Titles and descriptions are the English strings already shipped in the UI.
 * Language is not in the URL yet, so each public URL has one crawlable version.
 * Hebrew and other UI languages stay client-side until dedicated locale URLs exist.
 */

import { getHebrewMarketingPage } from "./hebrewMarketing.mjs";
import {
  hebrewPublicUrl,
  hreflangTags,
  splitMarketingLocale,
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

const OG_IMAGE = "https://bizuply.com/social-preview.png";
const FACEBOOK_DOMAIN_VERIFICATION = "azd93f5jgru1b53xrjj0dqaco20viu";

/**
 * Indexable marketing routes. Copy matches the English UI strings exactly.
 * `aliases` are extra paths that canonicalize to this page and stay out of the sitemap.
 */
export const MARKETING_PAGES = [
  {
    path: "/",
    title: "Bizuply — Run your business. All in one place.",
    description:
      "A modern business platform with a professional business page, collaborations, CRM and AI.",
    crumb: "Bizuply",
    lastmod: "2025-07-09",
    changefreq: "weekly",
    priority: "1.0",
  },
  {
    path: "/about",
    title: "About BizUply | The platform that grows with you",
    description:
      "Meet BizUply — an American technology company for business management, CRM, leads, websites, automations, agents, and collaborations in one place Meta App Review Developers",
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
    title: "Terms of Service - BizUply",
    description:
      "Read BizUply's Terms of Service, including use of the platform, payments, privacy, user content, limitations of liability, and dispute resolution.",
    crumb: "Terms",
    lastmod: "2025-06-25",
    changefreq: "yearly",
    priority: "0.5",
  },
  {
    path: "/privacy",
    title: "Privacy Policy - BizUply",
    description:
      "Read BizUply's Privacy Policy, including how we collect, use, store, protect, and share user and business data.",
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
    title: "Service Packages | BizUply",
    description:
      "BizUply service packages — lead response, appointment booking, CRM, automations, campaigns, and content. Pick services and request a tailored quote.",
    crumb: "Pricing",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.9",
  },
  {
    path: "/features",
    title: "BizUply — All the Tools Your Business Needs in One Place",
    description:
      "Explore BizUply features — an all-in-one platform combining CRM, chat, scheduling, reviews, collaborations, and AI tools for small businesses.",
    crumb: "Features",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/solutions",
    title: "BizUply — Smart Solutions for Every Type of Business",
    description:
      "Discover BizUply's tailored solutions for every business type — from service providers and freelancers to shops and collaborations. Manage clients, communication, and growth in one smart place.",
    crumb: "Solutions",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.7",
  },
  {
    path: "/crm",
    title: "CRM & Meta Leads | BizUply — Meta App Review Developers",
    description:
      "BizUply are Meta App Review–approved developers. Connect Facebook Lead Ads to your CRM and manage leads, clients and appointments in one place.",
    crumb: "CRM",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/collaborations",
    title: "Business Collaborations | BizUply",
    description:
      "Find business partners, manage proposals and real-time chat, post to the opportunities marketplace, and grow together — all in one place with BizUply.",
    crumb: "Collaborations",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/website-builder",
    title: "Professional Website Builder | BizUply",
    description:
      "Build a website, store, or booking-enabled site from 205 templates, edit in a visual editor, and publish to your own domain — with every inquiry from the site flowing straight into your CRM.",
    crumb: "Website builder",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/automations",
    title: "Automations for Your Business | BizUply",
    description:
      "Reminders, follow-ups, tasks, and alerts that run in the background and stay connected to your CRM — so fewer leads slip through the cracks.",
    crumb: "Automations",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/agents",
    title: "Human Agents for Your Business | BizUply",
    description:
      "A human service layer that handles leads, schedules meetings, fills in details and manages partnerships — right inside your BizUply CRM.",
    crumb: "Agents",
    lastmod: "2026-08-01",
    changefreq: "monthly",
    priority: "0.6",
  },
  {
    path: "/appointments",
    title: "Appointment Scheduling | BizUply",
    description:
      "Manage your appointment calendar, reminders, and client follow-up with BizUply Appointments.",
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

function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Bizuply",
    alternateName: ["ביזאפלי", "BizUply"],
    url: `${MARKETING_ORIGIN}/`,
    logo: `${MARKETING_ORIGIN}/favicon-v2.png`,
    sameAs: [
      "https://www.facebook.com/bizuply",
      "https://www.instagram.com/bizuply",
      "https://www.linkedin.com/company/bizuply",
    ],
  };
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

function sharedSocialTags(title, description, canonical) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  return [
    `<meta property="og:title" content="${safeTitle}" />`,
    `<meta property="og:description" content="${safeDescription}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Bizuply" />`,
    `<meta property="og:url" content="${escapeHtml(canonical)}" />`,
    `<meta property="og:image" content="${OG_IMAGE}" />`,
    `<meta property="og:locale" content="en_US" />`,
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
export function buildMarketingDocumentHead(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  const hebrew = locale === "he" ? getHebrewMarketingPage(path) : null;
  const found = findMarketingPage(path);
  if (locale === "he" && !hebrew && found) {
    return [
      `<title>Bizuply</title>`,
      `<meta name="robots" content="noindex, follow" />`,
      `<link rel="canonical" href="${escapeHtml(hebrewPublicUrl(found.canonicalPath))}" />`,
    ].join("\n");
  }

  if ((locale === "en" && found) || hebrew) {
    const page = hebrew
      ? { path, title: hebrew.title, description: hebrew.description, crumb: hebrew.crumb }
      : found.page;
    const canonicalPath = hebrew ? path : found.canonicalPath;
    const canonical = locale === "he" ? hebrewPublicUrl(canonicalPath) : marketingCanonicalUrl(canonicalPath);
    const title = escapeHtml(page.title);
    const description = escapeHtml(page.description);
    const language = locale === "he" ? "he" : "en";
    return [
      `<title>${title}</title>`,
      `<meta name="description" content="${description}" />`,
      `<meta name="robots" content="index, follow" />`,
      `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
      hreflangTags(canonicalPath),
      ...sharedSocialTags(page.title, page.description, canonical),
      `<script type="application/ld+json">${jsonLd(organizationSchema())}</script>`,
      `<script type="application/ld+json">${jsonLd(pageSchema(page, canonical, language))}</script>`,
      `<script type="application/ld+json">${jsonLd(breadcrumbSchema(page, canonical))}</script>`,
    ].join("\n");
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
    return `
    <xhtml:link rel="alternate" hreflang="en" href="https://whatsapp.bizuply.com/"/>
    <xhtml:link rel="alternate" hreflang="he" href="https://bizuply.com/he/whatsapp-api"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="https://whatsapp.bizuply.com/"/>`;
  }
  const english = marketingCanonicalUrl(path);
  const hebrew = hebrewPublicUrl(path);
  return `
    <xhtml:link rel="alternate" hreflang="en" href="${english}"/>
    <xhtml:link rel="alternate" hreflang="he" href="${hebrew}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${english}"/>`;
}

export function buildMarketingSitemapXml() {
  const pages = [
    ...MARKETING_PAGES.map((page) => ({ path: page.path, lastmod: page.lastmod, changefreq: page.changefreq, priority: page.priority })),
    ...MARKETING_PAGES.map((page) => ({
      path: page.path,
      loc: hebrewPublicUrl(page.path),
      lastmod: "2026-10-23",
      changefreq: page.changefreq,
      priority: page.priority,
    })),
    {
      path: "/whatsapp-api",
      loc: hebrewPublicUrl("/whatsapp-api"),
      lastmod: "2026-10-23",
      changefreq: "monthly",
      priority: "0.8",
    },
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
  if (locale === "he") return legacy === "/" ? "/he/" : `/he${legacy}`;
  return legacy;
}

function escapeText(value) {
  return escapeHtml(value);
}

export function buildMarketingPrerender(pathname) {
  const { locale, path } = splitMarketingLocale(pathname);
  if (locale === "he") {
    const hebrew = getHebrewMarketingPage(path);
    if (!hebrew?.h1) return null;
    const paragraphs = (hebrew.paragraphs || []).map((paragraph) => `<p>${escapeText(paragraph)}</p>`).join("");
    return {
      lang: "he",
      dir: "rtl",
      inner: `<main lang="he" dir="rtl"><h1>${escapeText(hebrew.h1)}</h1>${paragraphs}</main>`,
    };
  }
  if (path === "/") {
    return {
      lang: "en",
      dir: "ltr",
      inner: `<main lang="en" dir="ltr"><h1>Bizuply</h1><p>Run your business in one place.</p></main>`,
    };
  }
  return null;
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
