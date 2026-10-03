import React, { createContext, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { normalizeWhatsAppPath } from "../../../lib/whatsappHost.mjs";

export const PRICE_PER_NUMBER_USD = 29;
export const API_BASE_URL = "https://api.bizuply.com/api/v1/whatsapp";
export const OPENAPI_PATH = "/api/v1/whatsapp/openapi.json";
export const OPENAPI_URL = `${API_BASE_URL}/openapi.json`;
export const API_REFERENCE_URL = `${API_BASE_URL}/docs/reference`;
const STAGING_CLIENT_URL =
  import.meta.env.VITE_APP_ENV === "staging"
    ? String(import.meta.env.VITE_CLIENT_URL || "").replace(/\/+$/, "")
    : "";
export const SIGN_IN_URL = `${STAGING_CLIENT_URL || "https://bizuply.com"}/login`;
export const PRIVACY_URL = "https://bizuply.com/privacy";
export const TERMS_URL = "https://bizuply.com/terms";
export const ACCESSIBILITY_URL = "https://bizuply.com/accessibility";
export const SUPPORT_EMAIL = "support@bizuply.com";
export const META_PRICING_URL = "https://developers.facebook.com/docs/whatsapp/pricing";
export const META_BUSINESS_VERIFICATION_URL =
  "https://www.facebook.com/business/help/2058515294227817";

export type SitePath =
  | "/"
  | "/developers"
  | "/agencies"
  | "/pricing"
  | "/docs"
  | "/help"
  | "/get-started"
  | "/security";

export const NAV_ITEMS: Array<{ key: string; path: SitePath }> = [
  { key: "overview", path: "/" },
  { key: "developers", path: "/developers" },
  { key: "agencies", path: "/agencies" },
  { key: "pricing", path: "/pricing" },
  { key: "docs", path: "/docs" },
  { key: "help", path: "/help" },
];

/** Long-form copy is English-only; mark it so RTL and other locales don't reorder or mispronounce it. */
export function englishOnly(lang: string): { lang?: "en"; dir?: "ltr" } {
  return lang === "en" ? {} : { lang: "en", dir: "ltr" };
}

const SiteBaseContext = createContext("");

export function SiteBaseProvider({ base, children }: { base: string; children: React.ReactNode }) {
  return <SiteBaseContext.Provider value={base}>{children}</SiteBaseContext.Provider>;
}

export function useSiteBase() {
  return useContext(SiteBaseContext);
}

/** Current path relative to the site base, e.g. "/docs". */
export function useSitePath(): string {
  const base = useSiteBase();
  const { pathname } = useLocation();
  const relative = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
  return normalizeWhatsAppPath(relative);
}

export function useSiteHref() {
  const base = useSiteBase();
  return (path: string) => {
    const [route, hash] = path.split("#");
    const target = route === "/" ? base || "/" : `${base}${route}`;
    return hash ? `${target}#${hash}` : target;
  };
}

type SiteLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
};

export function SiteLink({ to, children, ...rest }: SiteLinkProps) {
  const href = useSiteHref();
  return (
    <Link to={href(to)} {...rest}>
      {children}
    </Link>
  );
}
