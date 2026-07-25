import { buildPublicSiteUrl } from "../../site-builder/studio/utils/pageSeoUtils";

const PUBLIC_SITE_DOMAIN =
  import.meta.env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

export function isPublicMiniSiteHostForSlug(slug?: string) {
  if (typeof window === "undefined") return false;

  const hostname = String(window.location.hostname || "").toLowerCase();
  const cleanSlug = String(slug || "").trim().toLowerCase();

  if (
    !hostname.endsWith(`.${PUBLIC_SITE_DOMAIN}`) ||
    hostname === PUBLIC_SITE_DOMAIN
  ) {
    return false;
  }

  if (!cleanSlug) return true;

  return hostname === `${cleanSlug}.${PUBLIC_SITE_DOMAIN}`;
}

/** Absolute or same-origin path to THIS site's member login — never BizUply platform login. */
export function resolveSiteMemberLoginUrl(site: Record<string, unknown> | null | undefined) {
  const slug = String(site?.slug || "").trim();
  const publicUrl = String(site?.publicUrl || "").replace(/\/+$/, "");

  if (isPublicMiniSiteHostForSlug(slug)) {
    return "/login";
  }

  if (publicUrl) {
    return `${publicUrl}/login`;
  }

  if (slug) {
    return `${buildPublicSiteUrl(slug)}/login`;
  }

  return "";
}

export function openSiteMemberLogin(site: Record<string, unknown> | null | undefined) {
  const url = resolveSiteMemberLoginUrl(site);
  if (!url) return;

  if (url.startsWith("http")) {
    window.location.assign(url);
    return;
  }

  const current = `${window.location.pathname}${window.location.search}`;
  if (current === url || current === `${url}/`) {
    return;
  }

  window.history.pushState({}, "", url);
  window.dispatchEvent(new PopStateEvent("popstate"));
}
