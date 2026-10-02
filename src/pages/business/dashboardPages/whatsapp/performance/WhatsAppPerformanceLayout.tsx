import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Download, Loader2, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import {
  enableWhatsAppTemplateInsights,
  getWhatsAppPerformance,
  syncWhatsAppPerformance,
  type AnalyticsPreset,
  type WhatsAppPerformanceView,
} from "../../../../../api/whatsappAnalyticsApi";
import { getIntlLocale, getTextDirection } from "../../../../../i18n/localeUtils";
import { btnSecondary, cardBase, inputBase } from "../../../../../styles/bizuplyUi";
import { useWhatsAppHubContext } from "../../../../dev/useWhatsAppHubContext";
import { useWhatsAppVisualQaOverride } from "../../../../dev/whatsappVisualQaContext";
import { downloadCsv, separatedTotals, toCsv } from "./performanceModel";
import { buildPerformanceFixture } from "./performanceFixture";

export type PerformanceContext = {
  view: WhatsAppPerformanceView | null;
  selectedDay: string | null;
  setSelectedDay: (day: string | null) => void;
  enablingInsights: boolean;
  enableInsights: () => Promise<void>;
};

const PRESETS: AnalyticsPreset[] = ["7", "30", "90", "custom"];

function sectionFromPath(pathname: string) {
  if (pathname.includes("/performance/templates")) return "templates";
  if (pathname.includes("/performance/messages")) return "messages";
  return "overview";
}

function csvFor(view: WhatsAppPerformanceView, section: string) {
  if (section === "templates") {
    const headers = ["source", "name", "category", "language", "sent", "delivered", "read", "failed", "deliveryRate", "readRate", "clicks"];
    const rows = [
      ...view.meta.templates.rows.map((row) => [
        "meta",
        row.name,
        row.category,
        row.language,
        row.sent,
        row.delivered,
        row.read,
        null,
        row.deliveryRate,
        row.readRate,
        row.clicks?.total,
      ]),
      ...view.local.templates.map((row) => [
        "webhook",
        row.name,
        row.category,
        row.language,
        row.sent,
        row.delivered,
        row.read,
        row.failed ?? null,
        row.deliveryRate,
        row.readRate,
        null,
      ]),
    ];
    return toCsv(headers, rows);
  }
  if (section === "messages" || section === "overview") {
    return toCsv(
      ["date", "metaSent", "metaDelivered", "webhookSent", "webhookDelivered", "webhookRead", "webhookFailed"],
      view.series.map((row) => [
        row.date,
        row.metaSent,
        row.metaDelivered,
        row.localSent,
        row.localDelivered,
        row.localRead,
        row.localFailed,
      ])
    );
  }
  return toCsv(["metaSent", "webhookFailed"], [[separatedTotals(view).metaSent, separatedTotals(view).webhookFailed]]);
}

export function PerformanceToolbar({
  view,
  preset,
  since,
  until,
  phoneNumberId,
  syncing,
  onPreset,
  onSince,
  onUntil,
  onPhone,
  onRefresh,
  onExport,
}: {
  view: WhatsAppPerformanceView | null;
  preset: AnalyticsPreset;
  since: string;
  until: string;
  phoneNumberId: string;
  syncing: boolean;
  onPreset: (preset: AnalyticsPreset) => void;
  onSince: (value: string) => void;
  onUntil: (value: string) => void;
  onPhone: (value: string) => void;
  onRefresh: () => void;
  onExport: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const lastSync = view?.sync.lastSuccessAt
    ? new Date(view.sync.lastSuccessAt).toLocaleString(locale)
    : t("whatsapp.performance.neverSynced");

  return (
    <div className={`${cardBase} space-y-3 p-3 sm:p-4`}>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-base font-black text-slate-900">{t("whatsapp.performance.title")}</h2>
          <p className="text-xs font-semibold text-slate-500">{t("whatsapp.performance.subtitle")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btnSecondary} onClick={onExport} disabled={!view}>
            <Download className="h-4 w-4" />
            {t("whatsapp.performance.exportCsv")}
          </button>
          <button type="button" className={btnSecondary} onClick={onRefresh} disabled={syncing}>
            {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {syncing ? t("whatsapp.performance.refreshing") : t("whatsapp.performance.refresh")}
          </button>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(0,1.2fr)_auto]">
        <label className="block text-xs font-bold text-slate-500">
          {t("whatsapp.performance.phone")}
          <select
            className="mt-1 h-10 w-full rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800"
            value={phoneNumberId}
            onChange={(event) => onPhone(event.target.value)}
          >
            <option value="">{t("whatsapp.performance.allPhones")}</option>
            {(view?.phones || []).map((phone) => (
              <option key={phone.phoneNumberId} value={phone.phoneNumberId}>
                {phone.displayPhoneNumber || phone.phoneNumberId}
                {phone.verifiedName ? ` · ${phone.verifiedName}` : ""}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p className="text-xs font-bold text-slate-500">{t("whatsapp.performance.lastSync")}</p>
          <p className="mt-2 text-sm font-black text-slate-900">{lastSync}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex flex-wrap rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {PRESETS.map((value) => (
            <button
              key={value}
              type="button"
              className={[
                "rounded-md px-3 py-1.5 text-xs font-bold",
                preset === value ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500",
              ].join(" ")}
              onClick={() => onPreset(value)}
            >
              {t(`whatsapp.performance.ranges.${value === "custom" ? "custom" : `d${value}`}`)}
            </button>
          ))}
        </div>
        {preset === "custom" ? (
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs font-bold text-slate-500">
              {t("whatsapp.performance.from")}
              <input
                type="date"
                className={`${inputBase} !h-10`}
                value={since}
                onChange={(event) => onSince(event.target.value)}
              />
            </label>
            <label className="text-xs font-bold text-slate-500">
              {t("whatsapp.performance.to")}
              <input
                type="date"
                className={`${inputBase} !h-10`}
                value={until}
                onChange={(event) => onUntil(event.target.value)}
              />
            </label>
          </div>
        ) : null}
      </div>
      {view?.range.clamped ? (
        <p className="text-xs font-semibold text-amber-700">
          {view.range.clampReasons.map((code) => t(`whatsapp.performance.reasons.${code}`, { defaultValue: code })).join(" ")}
        </p>
      ) : null}
      {view?.sync.lastError ? (
        <p className="text-xs font-semibold text-rose-600">
          {t("whatsapp.performance.syncError")}: {view.sync.lastError}
        </p>
      ) : null}
    </div>
  );
}

export default function WhatsAppPerformanceLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { businessId } = useWhatsAppHubContext();
  const visualQa = useWhatsAppVisualQaOverride();
  const [preset, setPreset] = useState<AnalyticsPreset>("7");
  const [since, setSince] = useState("");
  const [until, setUntil] = useState("");
  const [phoneNumberId, setPhoneNumberId] = useState("");
  const [view, setView] = useState<WhatsAppPerformanceView | null>(
    visualQa ? buildPerformanceFixture() : null
  );
  const [loading, setLoading] = useState(!visualQa);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [enablingInsights, setEnablingInsights] = useState(false);
  const autoSyncRef = useRef(false);

  const query = useMemo(
    () => ({
      businessId: businessId || "",
      preset,
      since: preset === "custom" ? since : "",
      until: preset === "custom" ? until : "",
      phoneNumberId,
    }),
    [businessId, preset, since, until, phoneNumberId]
  );

  const load = useCallback(async () => {
    if (visualQa) return;
    if (!businessId) {
      setLoading(false);
      return;
    }
    if (preset === "custom" && (!since || !until)) return;
    setLoading(true);
    setError("");
    try {
      const data = await getWhatsAppPerformance(query);
      setView(data);
    } catch (err) {
      const response = (err as { response?: { data?: { error?: string; view?: WhatsAppPerformanceView } } })
        ?.response?.data;
      if (response?.view) setView(response.view);
      setError(response?.error || t("whatsapp.performance.loadError"));
    } finally {
      setLoading(false);
    }
  }, [businessId, preset, query, since, t, until, visualQa]);

  useEffect(() => {
    void load();
  }, [load]);

  const refresh = useCallback(async () => {
    if (visualQa || !businessId) return;
    if (preset === "custom" && (!since || !until)) return;
    setSyncing(true);
    setError("");
    try {
      const data = await syncWhatsAppPerformance(query);
      setView(data);
    } catch (err) {
      const response = (err as { response?: { data?: { error?: string; view?: WhatsAppPerformanceView } } })
        ?.response?.data;
      if (response?.view) setView(response.view);
      setError(response?.error || t("whatsapp.performance.syncError"));
      toast.error(response?.error || t("whatsapp.performance.syncError"));
    } finally {
      setSyncing(false);
    }
  }, [businessId, preset, query, since, t, until, visualQa]);

  useEffect(() => {
    if (visualQa || autoSyncRef.current || !view || syncing) return;
    if (!view.sync.lastSuccessAt && view.meta.messaging.reason === "NOT_SYNCED" && !view.demoData) {
      autoSyncRef.current = true;
      void refresh();
    }
  }, [refresh, syncing, view, visualQa]);

  const enableInsights = useCallback(async () => {
    if (!businessId || visualQa) return;
    setEnablingInsights(true);
    try {
      await enableWhatsAppTemplateInsights(businessId);
      await refresh();
    } catch (err) {
      const message =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        t("whatsapp.performance.syncError");
      toast.error(message);
    } finally {
      setEnablingInsights(false);
    }
  }, [businessId, refresh, t, visualQa]);

  const section = sectionFromPath(location.pathname);
  const outlet = useMemo<PerformanceContext>(
    () => ({
      view,
      selectedDay,
      setSelectedDay,
      enablingInsights,
      enableInsights,
    }),
    [enableInsights, enablingInsights, selectedDay, view]
  );

  return (
    <div dir={getTextDirection(i18n.language)} className="space-y-3">
      {view?.demoData ? (
        <p className="rounded-md border border-sky-100 bg-sky-50 px-3 py-2 text-xs font-bold text-sky-800">
          {t("whatsapp.performance.demoBanner")}
        </p>
      ) : null}
      {view?.samplePreview ? (
        <p className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800">
          {t("whatsapp.performance.sampleBanner")}
        </p>
      ) : null}
      <PerformanceToolbar
        view={view}
        preset={preset}
        since={since}
        until={until}
        phoneNumberId={phoneNumberId}
        syncing={syncing}
        onPreset={setPreset}
        onSince={setSince}
        onUntil={setUntil}
        onPhone={setPhoneNumberId}
        onRefresh={() => void refresh()}
        onExport={() => {
          if (!view) return;
          downloadCsv(`whatsapp-performance-${section}.csv`, csvFor(view, section));
        }}
      />
      <nav
        aria-label={t("whatsapp.performance.title")}
        className="flex gap-1 overflow-x-auto rounded-lg border border-slate-200 bg-white p-1"
      >
        {(
          [
            ["overview", "whatsapp.performance.tabs.overview"],
            ["messages", "whatsapp.performance.tabs.messages"],
            ["templates", "whatsapp.performance.tabs.templates"],
          ] as const
        ).map(([path, key]) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              [
                "shrink-0 rounded-md px-3 py-2 text-xs font-bold sm:text-sm",
                isActive ? "bg-emerald-50 text-emerald-800" : "text-slate-500",
              ].join(" ")
            }
          >
            {t(key)}
          </NavLink>
        ))}
      </nav>
      {loading && !view ? (
        <div className={`${cardBase} flex items-center gap-2 p-6 text-sm font-semibold text-slate-500`}>
          <Loader2 className="h-4 w-4 animate-spin" />
          {t("whatsapp.performance.loading")}
        </div>
      ) : null}
      {error && !view ? (
        <p className={`${cardBase} p-4 text-sm font-semibold text-rose-600`}>{error}</p>
      ) : null}
      {view ? <Outlet context={outlet} /> : null}
    </div>
  );
}
