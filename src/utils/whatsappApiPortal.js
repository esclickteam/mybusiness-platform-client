/**
 * WhatsApp API product helpers.
 *
 * Exclusive portal shell applies only when WhatsApp API is the user's ONLY
 * active product. Multi-product accounts use the regular business dashboard
 * with server-derived `enabledModules` + `activeProducts` for navigation.
 */

export const WHATSAPP_API_PLAN = "whatsapp_api";

export const WHATSAPP_API_DOCS_URL = "https://whatsapp.bizuply.com/docs";

export const WHATSAPP_API_HELP_URL = "https://whatsapp.bizuply.com/help";

/** Dashboard sections a portal-only account may open. */
const PORTAL_DASHBOARD_SEGMENTS = new Set(["whatsapp", "billing"]);

/** WhatsApp hub sections that belong to the Business Plan messaging product. */
const PORTAL_BLOCKED_WHATSAPP_SEGMENTS = new Set([
  "messages",
  "compose",
  "lists",
  "history",
  "inbox",
]);

function activeProductKeys(user) {
  const list = Array.isArray(user?.activeProducts) ? user.activeProducts : [];
  return list
    .map((p) => (p && typeof p === "object" ? String(p.key || "") : String(p || "")))
    .filter(Boolean);
}

/** True when entitlements/modules show a BizUply surface beyond WhatsApp API. */
function hasBizuplySurface(user) {
  const keys = new Set(activeProductKeys(user));
  if (keys.has("business") || keys.has("crm") || keys.has("website")) return true;

  const modules = Array.isArray(user?.enabledModules) ? user.enabledModules : null;
  if (!modules) return false;
  return (
    modules.includes("crm") ||
    modules.includes("automations") ||
    modules.includes("website") ||
    modules.includes("build") ||
    modules.includes("BizUply") ||
    modules.includes("collab") ||
    modules.includes("meta-campaigns")
  );
}

function hasWhatsAppApiEntitlement(user) {
  const keys = new Set(activeProductKeys(user));
  if (keys.has("whatsapp_api")) return true;
  const ent = user?.entitlements?.whatsappApi;
  if (ent && ent.enabled) return true;
  return String(user?.subscriptionPlan || "") === WHATSAPP_API_PLAN;
}

/**
 * Exclusive WhatsApp API portal (limited nav). Multi-product users return false
 * so they get the full dashboard + product switcher.
 */
export function isWhatsAppApiPortalUser(user) {
  if (!user) return false;
  if (String(user.role || "").toLowerCase() !== "business") return false;
  if (user.isGuidedDemo || user.isShowcaseDemo) return false;

  const keys = activeProductKeys(user);
  if (keys.length) {
    return keys.includes("whatsapp_api") && keys.every((k) => k === "whatsapp_api");
  }

  if (!hasWhatsAppApiEntitlement(user)) return false;
  // subscriptionPlan still whatsapp_api after a BizUply buy — modules/entitlements decide.
  if (hasBizuplySurface(user)) return false;
  return String(user.subscriptionPlan || "") === WHATSAPP_API_PLAN;
}

/** User has WhatsApp API among their products (portal-only or multi-product). */
export function hasWhatsAppApiProduct(user) {
  if (!user) return false;
  if (String(user.role || "").toLowerCase() !== "business") return false;
  return hasWhatsAppApiEntitlement(user);
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
  if (user?.accountKind === "saas_only" && user.businessId) {
    return `/business/${user.businessId}/dashboard/saas`;
  }
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

/** Home path for a product key from server `activeProducts`. */
export function homePathForProduct(businessId, productKey) {
  const bid = String(businessId || "").trim();
  if (!bid) return "/dashboard";
  switch (String(productKey || "")) {
    case "whatsapp_api":
      return whatsappApiPortalHome(bid);
    case "crm":
      return `/business/${bid}/dashboard/crm`;
    case "website":
      return `/business/${bid}/dashboard/website`;
    case "business":
    default:
      return `/business/${bid}/dashboard`;
  }
}

/**
 * Default post-login home when the user has several products.
 * Prefer an explicit product query, else business → crm → website → whatsapp.
 */
export function resolveMultiProductHome(user) {
  const businessId = user?.businessId;
  if (!businessId) return "/dashboard";
  const keys = activeProductKeys(user);
  if (!keys.length) return null;
  if (keys.length === 1) return homePathForProduct(businessId, keys[0]);
  for (const preferred of ["business", "crm", "website", "whatsapp_api"]) {
    if (keys.includes(preferred)) return homePathForProduct(businessId, preferred);
  }
  return homePathForProduct(businessId, keys[0]);
}
