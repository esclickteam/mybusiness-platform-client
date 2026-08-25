export type PublicPartnerBranding = {
  partnerId?: string | null;
  slug?: string;
  brandName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  whiteLabelEnabled?: boolean;
  whiteLabelEntitled?: boolean;
  hideBizuplyBranding?: boolean;
  supportEmail?: string;
  supportPhone?: string;
  subdomain?: string;
  urls?: {
    slugUrl?: string;
    plansUrl?: string;
    subdomainUrl?: string;
    personalUrl?: string;
  };
  stored?: {
    brandName?: string;
    logoUrl?: string;
    faviconUrl?: string;
    subdomain?: string;
    supportEmail?: string;
    supportPhone?: string;
  };
};

const FAVICON_ATTR = "data-partner-branding-favicon";

export function applyPartnerFavicon(url?: string | null) {
  if (typeof document === "undefined") return;
  const existing = document.head.querySelectorAll(`link[${FAVICON_ATTR}]`);
  existing.forEach((node) => node.remove());
  if (!url) return;
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = url;
  link.setAttribute(FAVICON_ATTR, "true");
  document.head.appendChild(link);
}

export function brandingFromUser(
  user: { partnerBranding?: PublicPartnerBranding } | null | undefined,
  hostname?: string
) {
  const branding = user?.partnerBranding;
  if (!branding) return null;
  if (!hidesBizuplyChrome(branding, hostname)) return null;
  return branding;
}

export function hidesBizuplyChrome(
  branding?: PublicPartnerBranding | null,
  _hostname?: string
) {
  if (!branding) return false;
  if (branding.whiteLabelEnabled) return true;
  if (!branding.whiteLabelEntitled) return false;
  return Boolean(
    String(branding.brandName || branding.stored?.brandName || "").trim()
  );
}

export function isResolvedPartnerHost(branding?: PublicPartnerBranding | null) {
  return Boolean(
    branding?.partnerId && (branding.whiteLabelEnabled || branding.whiteLabelEntitled)
  );
}

export function partnerFacingName(
  branding?: PublicPartnerBranding | null,
  hostname?: string
) {
  if (!hidesBizuplyChrome(branding, hostname)) return "";
  return String(branding?.brandName || branding?.stored?.brandName || "").trim();
}

export function partnerFacingLogo(
  branding?: PublicPartnerBranding | null,
  hostname?: string
) {
  if (!hidesBizuplyChrome(branding, hostname)) return "";
  return String(branding?.logoUrl || branding?.stored?.logoUrl || "").trim();
}

export function partnerSiteSuffix(hostname?: string) {
  const host = String(
    hostname || (typeof window !== "undefined" ? window.location.hostname : "")
  )
    .toLowerCase()
    .split(":")[0];
  if (
    host === "bizuply.co.il" ||
    host === "www.bizuply.co.il" ||
    host.endsWith(".bizuply.co.il")
  ) {
    return ".bizuply.co.il";
  }
  return ".bizuply.com";
}

export function partnerPersonalUrl({
  subdomain: _subdomain,
  urls,
  slug,
  hostname: _hostname,
}: {
  subdomain?: string;
  urls?: PublicPartnerBranding["urls"];
  slug?: string;
  hostname?: string;
} = {}) {
  const subdomainUrl = String(urls?.subdomainUrl || "").replace(/\/+$/, "");
  if (subdomainUrl) return subdomainUrl;
  const personal = String(urls?.personalUrl || urls?.slugUrl || "").replace(/\/+$/, "");
  if (personal) return personal;
  if (slug && typeof window !== "undefined") return `${window.location.origin}/p/${slug}`;
  return "";
}

export function absoluteCustomerUrl(pathOrUrl: string, fallbackOrigin?: string) {
  const value = String(pathOrUrl || "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  const origin = String(
    fallbackOrigin || (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");
  if (!value) return origin;
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}
