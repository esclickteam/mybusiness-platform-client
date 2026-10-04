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
