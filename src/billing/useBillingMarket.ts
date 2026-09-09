import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext.jsx";
import {
  resolveBillingCountry,
  resolveBillingMarket,
  type BillingMarket,
} from "./billingMarkets";

const GEO_COUNTRY_COOKIE = "bizuply_geo_country";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}=([^;]*)`)
  );
  return match ? decodeURIComponent(match[1]) : null;
}

function readStoredBillingCountrySafe(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem("bizuply_billing_country");
    const code = String(raw || "")
      .trim()
      .toUpperCase();
    return /^[A-Z]{2}$/.test(code) ? code : null;
  } catch {
    return null;
  }
}

/**
 * Resolves the billing market for Pricing display + checkout.
 * Account billingCountry wins; otherwise stored country, then UI locale default, then geo.
 */
export function useBillingMarket(): BillingMarket & { billingCountry: string | null } {
  const { i18n } = useTranslation();
  const { user } = useAuth() as { user?: Record<string, unknown> };
  const [geoCountry, setGeoCountry] = useState<string | null>(() =>
    readCookie(GEO_COUNTRY_COOKIE)
  );

  useEffect(() => {
    let cancelled = false;
    if (geoCountry) return;
    fetch("/api/geo", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const country = String(data?.country || "").trim();
        if (country) setGeoCountry(country);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [geoCountry]);

  return useMemo(() => {
    const sources = {
      savedBillingCountry:
        user?.billingCountry || user?.accountCountry || readStoredBillingCountrySafe(),
      businessCountry: user?.businessCountry || user?.country,
      language: i18n.language,
      geoCountry,
    };
    const billingCountry = resolveBillingCountry(sources);
    const market = resolveBillingMarket(sources);
    return { ...market, billingCountry };
  }, [geoCountry, i18n.language, user]);
}
