import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import {
  persistBillingCountry,
  readStoredBillingCountry,
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

export function useBillingMarket(): BillingMarket {
  const { user } = useAuth() as { user?: Record<string, unknown> };
  const [geoCountry, setGeoCountry] = useState<string | null>(() =>
    readCookie(GEO_COUNTRY_COOKIE)
  );

  useEffect(() => {
    let cancelled = false;
    const existing = readStoredBillingCountry() || readCookie(GEO_COUNTRY_COOKIE);
    if (existing) {
      persistBillingCountry(existing);
      return;
    }
    fetch("/api/geo", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const country = String(data?.country || "").trim();
        if (country) {
          setGeoCountry(country);
          persistBillingCountry(country);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return useMemo(
    () =>
      resolveBillingMarket({
        savedBillingCountry:
          user?.billingCountry || user?.accountCountry || readStoredBillingCountry(),
        businessCountry: user?.businessCountry || user?.country,
        geoCountry,
      }),
    [geoCountry, user]
  );
}
