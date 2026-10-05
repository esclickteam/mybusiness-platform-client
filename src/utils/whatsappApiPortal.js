/**
 * Standalone WhatsApp API customers (`subscriptionPlan === "whatsapp_api"`)
 * get a dedicated portal built from the existing WhatsApp hub screens.
 * Every other account keeps the regular business dashboard.
 */

export const WHATSAPP_API_PLAN = "whatsapp_api";

export const WHATSAPP_API_DOCS_URL = "https://whatsapp.bizuply.com/docs";

export const WHATSAPP_API_HELP_URL = "https://whatsapp.bizuply.com/help";

/** Dashboard sections a portal account may open. */
const PORTAL_DASHBOARD_SEGMENTS = new Set(["whatsapp", "billing"]);

/** WhatsApp hub sections that belong to the Business Plan messaging product. */
const PORTAL_BLOCKED_WHATSAPP_SEGMENTS = new Set([
  "messages",
  "compose",
  "lists",
  "history",
  "inbox",
]);

export function isWhatsAppApiPortalUser(user) {
  if (!user) return false;
  if (String(user.role || "").toLowerCase() !== "business") return false;
  if (user.isGuidedDemo || user.isShowcaseDemo) return false;
  return String(user.subscriptionPlan || "") === WHATSAPP_API_PLAN;
}

export function whatsappApiPortalHome(businessId) {
  return `/business/${businessId}/dashboard/whatsapp/overview`;
}

/** The WhatsApp API product login; the standalone customers' sign-in page. */
export const WHATSAPP_API_LOGIN_PATH = "/login?product=whatsapp_api";

const LOGIN_PRODUCT_KEY = "bizuply_login_product";

/** Remembers which login this browser's last account uses, so logout and expired sessions return there. */
export function rememberLoginProduct(user) {
  try {
    if (isWhatsAppApiPortalUser(user)) localStorage.setItem(LOGIN_PRODUCT_KEY, WHATSAPP_API_PLAN);
    else if (user) localStorage.removeItem(LOGIN_PRODUCT_KEY);
  } catch {
    /* storage unavailable */
  }
}

export function prefersWhatsAppApiLogin() {
  try {
    return localStorage.getItem(LOGIN_PRODUCT_KEY) === WHATSAPP_API_PLAN;
  } catch {
    return false;
  }
}

/**
 * `/login?product=whatsapp_api`, the $29 checkout return, and a plain `/login` on a browser whose
 * account is a WhatsApp API customer render the product login. `product=business` forces the CRM login.
 */
export function isWhatsAppApiLoginSearch(search) {
  const params = new URLSearchParams(search || "");
  const product = params.get("product");
  if (product === WHATSAPP_API_PLAN || params.get("checkout") === WHATSAPP_API_PLAN) return true;
  return !product && !params.get("checkout") && prefersWhatsAppApiLogin();
}

export function whatsappApiPortalBillingPath(businessId) {
  return `/business/${businessId}/dashboard/whatsapp/billing`;
}

/**
 * Where a business account without access lands. Expired or unpaid API
 * accounts stay in their portal (to see the state and billing) instead of
 * the Business Plan pricing page.
 */
export function businessNoAccessPath(user) {
  return isWhatsAppApiPortalUser(user) && user.businessId
    ? whatsappApiPortalBillingPath(user.businessId)
    : "/pricing";
}

/** A portal screen inside the business dashboard (not the public profile). */
export function isWhatsAppApiPortalDashboardPath(pathname) {
  return (
    /^\/business\/[^/]+\/dashboard\/[^/?#]+/.test(String(pathname || "")) &&
    isWhatsAppApiPortalPathAllowed(pathname)
  );
}

export function isWhatsAppApiPortalPathAllowed(pathname) {
  const match = String(pathname || "").match(
    /\/business\/[^/]+\/dashboard(?:\/([^/?#]+))?(?:\/([^/?#]+))?/
  );
  if (!match) return true;
  const [, segment, subSegment] = match;
  if (!segment || !PORTAL_DASHBOARD_SEGMENTS.has(segment)) return false;
  if (segment === "whatsapp" && subSegment) {
    return !PORTAL_BLOCKED_WHATSAPP_SEGMENTS.has(subSegment);
  }
  return true;
}
