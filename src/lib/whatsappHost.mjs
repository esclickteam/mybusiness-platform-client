/**
 * Public Bizuply WhatsApp API marketing host.
 * Kept separate from customer sites (*.sites.bizuply.com) and partner white-label hosts.
 */

export const WHATSAPP_CANONICAL_HOST = "whatsapp.bizuply.com";
export const WHATSAPP_CANONICAL_URL = "https://whatsapp.bizuply.com/";
export const WHATSAPP_PREVIEW_BASE = "/whatsapp-api";

const WHATSAPP_HOSTS = new Set([
  WHATSAPP_CANONICAL_HOST,
  "www.whatsapp.bizuply.com",
]);

export const WHATSAPP_SEO_TITLE =
  "WhatsApp API for Developers, Agencies & Businesses | Bizuply";

export const WHATSAPP_SEO_DESCRIPTION =
  "WhatsApp Business API built on Meta's WhatsApp Cloud API. Connect your CRM, website, SaaS platform or custom system with API keys, signed webhooks and template management. $29/month per WhatsApp number; Meta messaging charges are separate.";

export const WHATSAPP_SEO_KEYWORDS =
  "WhatsApp API, WhatsApp Business API, WhatsApp Cloud API, Embedded Signup, WhatsApp API provider, WhatsApp API for developers, WhatsApp API for agencies, WhatsApp webhooks, WhatsApp template messages";

export const WHATSAPP_OG_IMAGE = {
  url: `${WHATSAPP_CANONICAL_URL}whatsapp-og.png`,
  width: 1200,
  height: 630,
  alt: "Bizuply WhatsApp API: $29/month per WhatsApp number. Meta messaging fees billed separately.",
};

export const WHATSAPP_NOT_FOUND_META = {
  title: "Page not found | Bizuply WhatsApp API",
  description: "This page doesn't exist on the Bizuply WhatsApp API site. Try the overview, documentation or Help Center.",
};

export const WHATSAPP_PRODUCT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Bizuply WhatsApp API",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: WHATSAPP_CANONICAL_URL,
  description: WHATSAPP_SEO_DESCRIPTION,
  offers: {
    "@type": "Offer",
    price: "29",
    priceCurrency: "USD",
    description: "Per connected WhatsApp number, per month. Meta messaging charges are billed separately.",
  },
  provider: {
    "@type": "Organization",
    name: "Bizuply",
    url: "https://bizuply.com",
  },
};

/**
 * Every public route on the WhatsApp host. Paths are relative to the site base
 * ("" on whatsapp.bizuply.com, /whatsapp-api on preview hosts).
 */
export const WHATSAPP_PAGES = {
  "/": {
    title: WHATSAPP_SEO_TITLE,
    description: WHATSAPP_SEO_DESCRIPTION,
  },
  "/developers": {
    title: "WhatsApp API for Developers | Bizuply",
    description:
      "Send approved WhatsApp templates with one authenticated REST call, track delivery status, and receive HMAC-signed webhooks. Quickstart in cURL, JavaScript and Python.",
  },
  "/agencies": {
    title: "Bizuply for Agencies | WhatsApp API for Client Systems",
    description:
      "Connect client WhatsApp numbers, issue isolated API keys per client, configure webhooks, and send WhatsApp messages from the systems you build. $29/month per number.",
  },
  "/pricing": {
    title: "WhatsApp API Pricing & Meta Cost Calculator | Bizuply",
    description:
      "$29/month per connected WhatsApp number. Estimate Meta messaging charges by country, category and volume using Meta's published rate card.",
  },
  "/docs": {
    title: "WhatsApp API Documentation | Bizuply",
    description:
      "Authentication, API keys, template messages, webhooks, error codes, rate limits and the full endpoint reference for the Bizuply WhatsApp API.",
  },
  "/help": {
    title: "Help Center | Bizuply WhatsApp API",
    description:
      "Answers about onboarding, Meta verification, phone numbers, templates, billing and the WhatsApp API, plus how to reach Bizuply support.",
  },
  "/get-started": {
    title: "Get Started | Bizuply WhatsApp API",
    description:
      "What to expect when you connect a WhatsApp number through Meta Embedded Signup, which Meta checks apply, and how to request onboarding.",
  },
  "/security": {
    title: "Security | Bizuply WhatsApp API",
    description:
      "How Bizuply protects API keys, signs webhooks, encrypts Meta access tokens, and isolates each business's data.",
  },
};

export const WHATSAPP_PAGE_PATHS = Object.keys(WHATSAPP_PAGES);

export function normalizeWhatsAppPath(pathname) {
  const clean = String(pathname || "/").split(/[?#]/)[0].replace(/\/+$/, "");
  return clean || "/";
}

export function getWhatsAppPageMeta(pathname) {
  return WHATSAPP_PAGES[normalizeWhatsAppPath(pathname)] || null;
}

export function whatsappCanonicalUrl(pathname) {
  const path = normalizeWhatsAppPath(pathname);
  return path === "/" ? WHATSAPP_CANONICAL_URL : `https://${WHATSAPP_CANONICAL_HOST}${path}`;
}

export function buildWhatsAppSitemapXml() {
  const urls = WHATSAPP_PAGE_PATHS.map(
    (path) => `  <url><loc>${whatsappCanonicalUrl(path)}</loc></url>`,
  ).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function bareHost(hostname) {
  return String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
}

export function isBizuplyWhatsAppHost(hostname) {
  return WHATSAPP_HOSTS.has(bareHost(hostname));
}

function isPreviewHost(hostname) {
  const host = bareHost(hostname);
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".vercel.app");
}

/** The WhatsApp API customer login lives in the main app, where the auth session is. */
export const WHATSAPP_LOGIN_APP_PATH = `${WHATSAPP_PREVIEW_BASE}/login`;
export const WHATSAPP_LOGIN_APP_URL = `https://bizuply.com${WHATSAPP_LOGIN_APP_PATH}`;

function isUnderPreviewBase(pathname) {
  const path = String(pathname || "").split("?")[0] || "/";
  if (normalizeWhatsAppPath(path) === WHATSAPP_LOGIN_APP_PATH) return false;
  return path === WHATSAPP_PREVIEW_BASE || path.startsWith(`${WHATSAPP_PREVIEW_BASE}/`);
}

/** Preview path (localhost and Vercel previews) so the site can be reviewed without the public host. */
export function shouldRenderWhatsAppLanding(hostname, pathname) {
  if (isBizuplyWhatsAppHost(hostname)) return true;
  return isPreviewHost(hostname) && isUnderPreviewBase(pathname);
}

/** Path prefix for in-site links: "" on the public host, /whatsapp-api on previews. */
export function whatsappSiteBase(hostname) {
  return isBizuplyWhatsAppHost(hostname) ? "" : WHATSAPP_PREVIEW_BASE;
}
