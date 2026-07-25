import React, { useEffect, useMemo, useState } from "react";
import { Globe2, Link2, Search, X } from "lucide-react";

import DomainSearch from "./DomainSearch";
import {
  connectSiteCustomDomain,
  disconnectSiteCustomDomain,
  getMySite,
} from "../../api/mySitesApi";

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
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0]
    .split("#")[0]
    .replace(/\.$/, "");
}

export default function ConnectDomainModal({
  open,
  onClose,
  siteId = "",
  siteSlug = "",
  initialCustomDomain = "",
  onConnected,
}: ConnectDomainModalProps) {
  const [tab, setTab] = useState<"connect" | "buy">("connect");
  const [domainInput, setDomainInput] = useState("");
  const [customDomain, setCustomDomain] = useState(initialCustomDomain);
  const [dnsTarget, setDnsTarget] = useState("");
  const [dnsRecords, setDnsRecords] = useState<
    Array<{ type: string; host: string; value: string; note?: string }>
  >([]);
  const [busy, setBusy] = useState(false);
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

    setTab("connect");
    setError("");
    setSuccess("");
    setDomainInput(normalizeDomain(initialCustomDomain));
    setCustomDomain(normalizeDomain(initialCustomDomain));
    setDnsRecords([]);
    setDnsTarget(
      siteSlug
        ? `${String(siteSlug).trim().toLowerCase()}.${PUBLIC_SITE_DOMAIN}`
        : PUBLIC_SITE_DOMAIN,
    );

    if (!siteId) return;

    let cancelled = false;
    void (async () => {
      try {
        const site = await getMySite(siteId);
        if (cancelled || !site) return;
        const connected = normalizeDomain(
          String(site?.domain?.domain || initialCustomDomain || ""),
        );
        setCustomDomain(connected);
        setDomainInput(connected);
      } catch {
        /* keep initial */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [open, siteId, siteSlug, initialCustomDomain]);

  if (!open) return null;

  async function handleConnect() {
    if (!siteId) {
      setError("שמרו את האתר קודם כדי לחבר אליו דומיין");
      return;
    }

    const domain = normalizeDomain(domainInput);
    if (!domain) {
      setError("הזינו דומיין לחיבור");
      return;
    }

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      const result = await connectSiteCustomDomain(siteId, domain);
      setCustomDomain(result.customDomain);
      setDomainInput(result.customDomain);
      setDnsTarget(result.dns?.target || dnsTarget);
      setDnsRecords(result.dns?.records || []);
      setSuccess(`הדומיין ${result.customDomain} חובר לאתר`);
      onConnected?.({
        customDomain: result.customDomain,
        publicUrl: result.publicUrl,
      });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "חיבור הדומיין נכשל",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleDisconnect() {
    if (!siteId || !customDomain) return;

    setBusy(true);
    setError("");
    setSuccess("");

    try {
      await disconnectSiteCustomDomain(siteId);
      setCustomDomain("");
      setDomainInput("");
      setDnsRecords([]);
      setSuccess("הדומיין נותק מהאתר");
      onConnected?.({ customDomain: "", publicUrl: platformUrl });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "ניתוק הדומיין נכשל",
      );
    } finally {
      setBusy(false);
    }
  }

  async function handleRegistered(domain: string) {
    const clean = normalizeDomain(domain);
    if (!clean) return;

    setTab("connect");
    setDomainInput(clean);

    if (!siteId) {
      setSuccess(`הדומיין ${clean} נרשם. שמרו את האתר ואז חברו אותו כאן.`);
      return;
    }

    setBusy(true);
    setError("");
    try {
      const result = await connectSiteCustomDomain(siteId, clean);
      setCustomDomain(result.customDomain);
      setDnsTarget(result.dns?.target || dnsTarget);
      setDnsRecords(result.dns?.records || []);
      setSuccess(`הדומיין ${result.customDomain} חובר לאתר`);
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
    } finally {
      setBusy(false);
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
              חיבור דומיין
            </div>
            <h2 className="mt-3 text-xl font-black text-slate-900">
              חברו דומיין לאתר
            </h2>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              כמו בוויקס — קנו דומיין חדש או חברו דומיין שכבר בבעלותכם.
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
              {customDomain
                ? `https://${customDomain}`
                : platformUrl}
            </span>
            <button
              type="button"
              onClick={() => setTab("connect")}
              className="text-sm font-black text-violet-700 transition hover:text-violet-900"
            >
              {customDomain ? "ניהול דומיין" : "חיבור דומיין"}
            </button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-slate-100 px-5 py-3 sm:px-6">
          <button
            type="button"
            onClick={() => setTab("connect")}
            className={[
              "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-black transition",
              tab === "connect"
                ? "bg-violet-50 text-violet-800"
                : "text-slate-500 hover:bg-slate-50",
            ].join(" ")}
          >
            <Link2 className="h-4 w-4" />
            חיבור דומיין קיים
          </button>
          <button
            type="button"
            onClick={() => setTab("buy")}
            className={[
              "inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-black transition",
              tab === "buy"
                ? "bg-violet-50 text-violet-800"
                : "text-slate-500 hover:bg-slate-50",
            ].join(" ")}
          >
            <Search className="h-4 w-4" />
            רכישת דומיין חדש
          </button>
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

          {tab === "connect" ? (
            <div className="space-y-5">
              {!siteId ? (
                <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                  כדי לחבר דומיין לאתר, שמרו או פרסמו את האתר קודם.
                </div>
              ) : null}

              <label className="block">
                <span className="mb-2 block text-sm font-black text-slate-700">
                  הדומיין שלכם
                </span>
                <input
                  value={domainInput}
                  onChange={(event) => setDomainInput(event.target.value)}
                  placeholder="example.com"
                  dir="ltr"
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-800 outline-none transition focus:border-violet-300 focus:ring-4 focus:ring-violet-100"
                />
              </label>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={busy || !siteId}
                  onClick={() => void handleConnect()}
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-violet-200/80 bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 px-5 text-sm font-black text-slate-800 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? "מחבר..." : "חבר דומיין לאתר"}
                </button>

                {customDomain ? (
                  <button
                    type="button"
                    disabled={busy || !siteId}
                    onClick={() => void handleDisconnect()}
                    className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-black text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    נתק דומיין
                  </button>
                ) : null}
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="text-sm font-black text-slate-800">
                  הגדרות DNS אצל הרשם
                </h3>
                <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                  הפנו את הדומיין לכתובת האתר בביזאפלי:
                  <span className="mx-1 font-black text-slate-800" dir="ltr">
                    {dnsTarget || PUBLIC_SITE_DOMAIN}
                  </span>
                </p>

                <div className="mt-4 space-y-2">
                  {(dnsRecords.length
                    ? dnsRecords
                    : [
                        {
                          type: "CNAME",
                          host: "www",
                          value:
                            dnsTarget ||
                            (siteSlug
                              ? `${siteSlug}.${PUBLIC_SITE_DOMAIN}`
                              : PUBLIC_SITE_DOMAIN),
                          note: "הפניית www",
                        },
                        {
                          type: "CNAME",
                          host: "@",
                          value:
                            dnsTarget ||
                            (siteSlug
                              ? `${siteSlug}.${PUBLIC_SITE_DOMAIN}`
                              : PUBLIC_SITE_DOMAIN),
                          note: "דומיין ראשי (אם נתמך)",
                        },
                      ]
                  ).map((record) => (
                    <div
                      key={`${record.type}-${record.host}-${record.value}`}
                      dir="ltr"
                      className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-xs font-bold text-slate-700"
                    >
                      <div className="flex flex-wrap gap-3">
                        <span>{record.type}</span>
                        <span>{record.host}</span>
                        <span className="text-violet-700">{record.value}</span>
                      </div>
                      {record.note ? (
                        <p className="mt-1 text-[11px] font-semibold text-slate-400" dir="rtl">
                          {record.note}
                        </p>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <DomainSearch onRegistered={handleRegistered} />
          )}
        </div>
      </div>
    </div>
  );
}
