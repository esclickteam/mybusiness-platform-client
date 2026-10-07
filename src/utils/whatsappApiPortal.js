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

/**
 * The WhatsApp API product login. Customers reach it from https://whatsapp.bizuply.com/login,
 * which the edge redirects here; plain `/login` is always the Bizuply login.
 */
export const WHATSAPP_API_LOGIN_PATH = "/whatsapp-api/login";

export function isLoginPath(pathname) {
  return pathname === "/login" || pathname === WHATSAPP_API_LOGIN_PATH;
}

const LOGIN_PRODUCT_KEY = "bizuply_login_product";

/**
 * Remembers that this browser's last account is a WhatsApp API customer, so its logout, expired
 * session or signed-out portal link returns to the WhatsApp API login. It never changes what
 * `/login` itself renders.
 */
export function rememberLoginProduct(user) {
  try {
    if (isWhatsAppApiPortalUser(user)) localStorage.setItem(LOGIN_PRODUCT_KEY, WHATSAPP_API_PLAN);
    else if (user) localStorage.removeItem(LOGIN_PRODUCT_KEY);
  } catch {
    /* storage unavailable */
  }
}

function prefersWhatsAppApiLogin() {
  try {
    return localStorage.getItem(LOGIN_PRODUCT_KEY) === WHATSAPP_API_PLAN;
  } catch {
    return false;
  }
}

/** Where a session that ended (logout or expiry) goes: each product back to its own login. */
export function loginPathForBrowser() {
  return prefersWhatsAppApiLogin() ? WHATSAPP_API_LOGIN_PATH : "/login";
}

/**
 * Old product-login links (`/login?product=whatsapp_api`, the $29 checkout return, the social
 * sign-in callback) name the product explicitly; they move to the WhatsApp API login with the
 * rest of their query. Returns null for every other `/login` visit.
 */
export function legacyWhatsAppApiLoginRedirect(search) {
  const params = new URLSearchParams(search || "");
  if (params.get("product") !== WHATSAPP_API_PLAN && params.get("checkout") !== WHATSAPP_API_PLAN) return null;
  params.delete("product");
  const rest = params.toString();
  return `${WHATSAPP_API_LOGIN_PATH}${rest ? `?${rest}` : ""}`;
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
