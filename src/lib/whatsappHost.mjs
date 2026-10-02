/**
 * Public Bizuply WhatsApp API marketing host.
 * Kept separate from customer sites (*.sites.bizuply.com) and partner white-label hosts.
 */

export const WHATSAPP_CANONICAL_HOST = "whatsapp.bizuply.com";
export const WHATSAPP_CANONICAL_URL = "https://whatsapp.bizuply.com/";

const WHATSAPP_HOSTS = new Set([
  WHATSAPP_CANONICAL_HOST,
  "www.whatsapp.bizuply.com",
]);

export const WHATSAPP_SEO_TITLE =
  "Official WhatsApp API Platform for Developers & Businesses | Bizuply";

export const WHATSAPP_SEO_DESCRIPTION =
  "Connect to the official WhatsApp API with fast onboarding, webhooks, template management, and transparent pricing. Built for developers, agencies, and growing businesses.";

export const WHATSAPP_SEO_KEYWORDS =
  "WhatsApp API, official WhatsApp Cloud API, Embedded Signup, WhatsApp API provider, WhatsApp API for developers, WhatsApp API for agencies";

export function isBizuplyWhatsAppHost(hostname) {
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  return WHATSAPP_HOSTS.has(host);
}

/** Local preview path so the page can be reviewed without the public host. */
export function shouldRenderWhatsAppLanding(hostname, pathname) {
  if (isBizuplyWhatsAppHost(hostname)) return true;
  const host = String(hostname || "")
    .toLowerCase()
    .trim()
    .split(":")[0];
  if (host !== "localhost" && host !== "127.0.0.1") return false;
  const path = String(pathname || "").split("?")[0] || "/";
  return path === "/whatsapp-api" || path === "/whatsapp-api/";
}
