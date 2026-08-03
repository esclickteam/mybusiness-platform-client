/**
 * Per-site personal-area session storage.
 * Intentionally isolated from platform auth (`token` / AuthContext).
 */

export type SitePortalMember = {
  id: string;
  siteId: string;
  businessId?: string;
  email: string;
  fullName: string;
  phone?: string;
  status: string;
  assignedPageIds?: string[];
  paymentStatus?: string;
  lastLoginAt?: string | null;
};

const STORAGE_PREFIX = "bizuply_site_portal_";

function storageKey(siteId: string) {
  return `${STORAGE_PREFIX}${String(siteId || "").trim()}`;
}

export function getSitePortalToken(siteId: string): string {
  if (typeof window === "undefined" || !siteId) return "";
  try {
    return String(localStorage.getItem(storageKey(siteId)) || "");
  } catch {
    return "";
  }
}

export function setSitePortalToken(siteId: string, token: string) {
  if (typeof window === "undefined" || !siteId) return;
  try {
    if (token) {
      localStorage.setItem(storageKey(siteId), token);
    } else {
      localStorage.removeItem(storageKey(siteId));
    }
  } catch {
    /* ignore quota / private mode */
  }
}

export function clearSitePortalToken(siteId: string) {
  setSitePortalToken(siteId, "");
}

/** Resolve a stored portal token for the current host when siteId is already known. */
export function getAnySitePortalTokenForSite(siteId: string): string {
  return getSitePortalToken(siteId);
}

/**
 * Best-effort: scan localStorage for a portal token matching a site id prefix.
 * Used before we know siteId from the API response.
 */
export function findStoredPortalTokenHint(): { siteId: string; token: string } | null {
  if (typeof window === "undefined") return null;

  try {
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i) || "";
      if (!key.startsWith(STORAGE_PREFIX)) continue;
      const siteId = key.slice(STORAGE_PREFIX.length);
      const token = localStorage.getItem(key) || "";
      if (siteId && token) {
        return { siteId, token };
      }
    }
  } catch {
    return null;
  }

  return null;
}
