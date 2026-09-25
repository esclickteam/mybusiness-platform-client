/**
 * WhatsApp hub path helpers.
 *
 * Legacy top-level paths (e.g. /whatsapp/compose) still redirect, but nested
 * paths under /messages/* must never be rewritten — that previously produced
 * /messages/messages/compose and bounced users back to overview via the splat.
 */

export const LEGACY_TAB_REDIRECT: Record<string, string> = {
  automations: "overview",
  health: "insights",
  settings: "connection",
  compose: "messages/compose",
  lists: "messages/lists",
  history: "messages/history",
};

export const KNOWN_TOP_SEGMENTS = new Set([
  "overview",
  "profile",
  "templates",
  "messages",
  "inbox",
  "insights",
  "developers",
  "billing",
  "connection",
]);

export function pathSegmentsAfterWhatsapp(pathname: string): string[] {
  const parts = String(pathname || "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
  const idx = parts.lastIndexOf("whatsapp");
  if (idx < 0) return [];
  return parts.slice(idx + 1);
}

export function whatsappBasePath(pathname: string): string {
  const parts = String(pathname || "")
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean);
  const idx = parts.lastIndexOf("whatsapp");
  if (idx < 0) return "/whatsapp";
  return "/" + parts.slice(0, idx + 1).join("/");
}

/**
 * Returns a replace target when the current path needs a hub redirect,
 * otherwise null (stay put — no navigation).
 */
export function resolveWhatsAppHubRedirect(pathname: string): string | null {
  const clean = String(pathname || "").replace(/\/+$/, "") || "/";
  const after = pathSegmentsAfterWhatsapp(clean);
  const base = whatsappBasePath(clean);

  if (after.length === 0) {
    return `${base}/overview`;
  }

  // Legacy redirects apply ONLY to a single top-level segment.
  // /whatsapp/compose → /whatsapp/messages/compose
  // /whatsapp/messages/compose must NOT be rewritten.
  if (after.length === 1) {
    const legacyTarget = LEGACY_TAB_REDIRECT[after[0]];
    if (legacyTarget) {
      return `${base}/${legacyTarget}`;
    }
  }

  const top = after[0];
  if (!KNOWN_TOP_SEGMENTS.has(top)) {
    return `${base}/overview`;
  }

  return null;
}
