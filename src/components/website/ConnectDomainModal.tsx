import React, { useEffect, useMemo, useState } from "react";
import { Globe2, X } from "lucide-react";

import DomainSearch from "./DomainSearch";
import { connectSiteCustomDomain, getMySite } from "../../api/mySitesApi";

type ConnectDomainModalProps = {
  open: boolean;
  onClose: () => void;
  siteId?: string;
  siteSlug?: string;
  initialCustomDomain?: string;
  onConnected?: (payload: {
    customDomain: string;
    publicUrl?: string;
  }) => void;
};

const PUBLIC_SITE_DOMAIN =
  import.meta.env.VITE_BIZUPLY_PUBLIC_SITE_DOMAIN || "sites.bizuply.com";

function normalizeDomain(value: string) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "");

  if (!clean) return "";
  if (
    clean === PUBLIC_SITE_DOMAIN ||
    clean === `www.${PUBLIC_SITE_DOMAIN}` ||
    clean.endsWith(`.${PUBLIC_SITE_DOMAIN}`)
  ) {
    return "";
  }

  return clean;
}

export default function ConnectDomainModal({
  open,
  onClose,
  siteId = "",
  siteSlug = "",
  initialCustomDomain = "",
  onConnected,
}: ConnectDomainModalProps) {
  const [customDomain, setCustomDomain] = useState(initialCustomDomain);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const platformUrl = useMemo(() => {
    const slug = String(siteSlug || "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
    if (!slug) return `https://${PUBLIC_SITE_DOMAIN}`;
    return `https://${slug}.${PUBLIC_SITE_DOMAIN}`;
  }, [siteSlug]);

  useEffect(() => {
    if (!open) return;

    setError("");
    setSuccess("");
    setCustomDomain(normalizeDomain(initialCustomDomain));

    if (!siteId) return;

    let cancelled = false;
    void (async () => {
      try {
        const site = await getMySite(siteId);
        if (cancelled || !site) return;
        setCustomDomain(
          normalizeDomain(
            String(site?.domain?.domain || initialCustomDomain || ""),
          ),
        );
      } catch {
        /* keep initial */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, siteId, initialCustomDomain]);

  if (!open) return null;

  async function handleRegistered(domain: string) {
    const clean = normalizeDomain(domain);
    if (!clean) return;

    if (!siteId) {
      setCustomDomain(clean);
      setSuccess(`הדומיין ${clean} נרשם. שמרו את האתר כדי לקשר אותו אליו.`);
      onConnected?.({ customDomain: clean });
      return;
    }

    setError("");
    try {
      const result = await connectSiteCustomDomain(siteId, clean);
      setCustomDomain(result.customDomain);
      setSuccess(`הדומיין ${result.customDomain} נרכש וחובר לאתר`);
      onConnected?.({
        customDomain: result.customDomain,
        publicUrl: result.publicUrl,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "הרישום הצליח, אבל חיבור הדומיין לאתר נכשל",
      );
    }
  }

  return (
    <div className="fixed inset-0 z-[2147483600] flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm">
      <div
        dir="rtl"
        className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_90px_rgba(15,23,42,0.28)]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-black text-violet-700">
              <Globe2 className="h-3.5 w-3.5" />
              רכישת דומיין
            </div>
            <h2 className="mt-3 text-xl font-black text-slate-900">
              רכישת דומיין חדש לאתר
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              בדקו זמינות, רכשו דומיין — והוא יקושר אוטומטית לאתר.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
            aria-label="סגירה"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="border-b border-slate-100 px-5 py-3 sm:px-6">
          <div
            dir="ltr"
            className="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
          >
            <span className="truncate text-sm font-black text-slate-700">
              {customDomain ? `https://${customDomain}` : platformUrl}
            </span>
            <span className="shrink-0 text-xs font-black text-violet-700">
              {customDomain ? "דומיין מחובר" : "רכישת דומיין חדש"}
            </span>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          {error ? (
            <div className="mb-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
              {error}
            </div>
          ) : null}
          {success ? (
            <div className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
              {success}
            </div>
          ) : null}

          {!siteId ? (
            <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
              מומלץ לשמור או לפרסם את האתר לפני הרכישה, כדי שהדומיין יקושר אליו
              אוטומטית.
            </div>
          ) : null}

          <DomainSearch onRegistered={handleRegistered} />
        </div>
      </div>
    </div>
  );
}
