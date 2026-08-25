import { useEffect, useState } from "react";
import { fetchPublicPartnerBranding } from "../lib/partnerApi";
import type { PublicPartnerBranding } from "../lib/partnerBranding";
import { isResolvedPartnerHost } from "../lib/partnerBranding";
import { isPartnerWhiteLabelHostname } from "../lib/partnerHost.mjs";

export function usePartnerHostBranding() {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const looksLikePartnerHost = isPartnerWhiteLabelHostname(host);
  const [branding, setBranding] = useState<PublicPartnerBranding | null>(null);
  const [ready, setReady] = useState(!looksLikePartnerHost);

  useEffect(() => {
    if (!looksLikePartnerHost) {
      setBranding(null);
      setReady(true);
      return;
    }
    let cancelled = false;
    fetchPublicPartnerBranding({ host: window.location.host })
      .then((data) => {
        if (!cancelled) setBranding(data || null);
      })
      .catch(() => {
        if (!cancelled) setBranding(null);
      })
      .finally(() => {
        if (!cancelled) setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [looksLikePartnerHost]);

  return {
    branding,
    ready,
    looksLikePartnerHost,
    whiteLabelEnabled: Boolean(branding?.whiteLabelEnabled),
    isResolvedPartnerHost: isResolvedPartnerHost(branding),
  };
}
