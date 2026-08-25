export type PublicPartnerBranding = {
  partnerId?: string | null;
  slug?: string;
  brandName?: string;
  logoUrl?: string;
  faviconUrl?: string;
  whiteLabelEnabled?: boolean;
  whiteLabelEntitled?: boolean;
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

export function brandingFromUser(user: { partnerBranding?: PublicPartnerBranding } | null | undefined) {
  const branding = user?.partnerBranding;
  if (!branding?.whiteLabelEnabled) return null;
  return branding;
}
