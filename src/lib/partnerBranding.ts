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
  return Boolean(branding?.whiteLabelEnabled);
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

export function absoluteCustomerUrl(pathOrUrl: string, fallbackOrigin?: string) {
  const value = String(pathOrUrl || "").trim();
  if (/^https?:\/\//i.test(value)) return value;
  const origin = String(
    fallbackOrigin || (typeof window !== "undefined" ? window.location.origin : "")
  ).replace(/\/+$/, "");
  if (!value) return origin;
  return `${origin}${value.startsWith("/") ? value : `/${value}`}`;
}
