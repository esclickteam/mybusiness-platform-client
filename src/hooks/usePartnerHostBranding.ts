import { useEffect, useState } from "react";
import { fetchPublicPartnerBranding } from "../lib/partnerApi";
import type { PublicPartnerBranding } from "../lib/partnerBranding";
import { isResolvedPartnerHost } from "../lib/partnerBranding";
import { isPartnerWhiteLabelHostname } from "../lib/partnerHost.mjs";

let resolvedHost = "";
let resolvedBranding: PublicPartnerBranding | null = null;
let inflightHost = "";
let inflight: Promise<PublicPartnerBranding | null> | null = null;

function loadPartnerHostBranding(pageHost: string) {
  if (resolvedHost === pageHost) return Promise.resolve(resolvedBranding);
  if (inflightHost === pageHost && inflight) return inflight;
  inflightHost = pageHost;
  inflight = fetchPublicPartnerBranding({ host: pageHost })
    .then((data) => {
      resolvedHost = pageHost;
      resolvedBranding = data || null;
      return resolvedBranding;
    })
    .catch(() => {
      resolvedHost = pageHost;
      resolvedBranding = null;
      return null;
    });
  return inflight;
}

export function usePartnerHostBranding() {
  const pageHost = typeof window !== "undefined" ? window.location.host : "";
  const host = pageHost.split(":")[0];
  const looksLikePartnerHost = isPartnerWhiteLabelHostname(host);
  const cached = looksLikePartnerHost && resolvedHost === pageHost;
  const [branding, setBranding] = useState<PublicPartnerBranding | null>(
    cached ? resolvedBranding : null
  );
  const [ready, setReady] = useState(!looksLikePartnerHost || cached);

  useEffect(() => {
    if (!looksLikePartnerHost) {
      setBranding(null);
      setReady(true);
      return;
    }
    let cancelled = false;
    if (resolvedHost === pageHost) {
      setBranding(resolvedBranding);
      setReady(true);
      return undefined;
    }
    setReady(false);
    loadPartnerHostBranding(pageHost).then((data) => {
      if (!cancelled) {
        setBranding(data);
        setReady(true);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [looksLikePartnerHost, pageHost]);

  return {
    branding,
    ready,
    looksLikePartnerHost,
    whiteLabelEnabled: Boolean(branding?.whiteLabelEnabled),
    isResolvedPartnerHost: isResolvedPartnerHost(branding),
  };
}
