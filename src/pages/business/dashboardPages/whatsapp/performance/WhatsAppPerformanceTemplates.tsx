import React, { useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type {
  AnalyticsTemplateRow,
  WhatsAppPerformanceView,
} from "../../../../../api/whatsappAnalyticsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../../styles/bizuplyUi";
import { getIntlLocale } from "../../../../../i18n/localeUtils";
import { templateMatches } from "./performanceModel";
import { StatLine, formatCount, formatRate, reasonText } from "./performanceUi";
import type { PerformanceContext } from "./WhatsAppPerformanceLayout";

const CATEGORIES = ["all", "MARKETING", "UTILITY", "AUTHENTICATION"] as const;

function clickCell(row: AnalyticsTemplateRow, unavailable: string, totalLabel: string, uniqueLabel: string) {
  if (!row.clicks?.available) return unavailable;
  const parts: string[] = [];
  if (row.clicks.total != null) parts.push(`${totalLabel}: ${row.clicks.total}`);
  if (row.clicks.unique != null) parts.push(`${uniqueLabel}: ${row.clicks.unique}`);
  if (!parts.length) return unavailable;
  const buttons = (row.clicks.items || [])
    .filter((item) => item.type === "url_button" || item.type === "quick_reply_button")
    .map((item) => `${item.buttonContent || item.type} (${item.count})`)
    .join(", ");
  return buttons ? `${parts.join(" · ")} — ${buttons}` : parts.join(" · ");
}

export function TemplatesBody({
  view,
  enabling,
  onEnable,
}: {
  view: WhatsAppPerformanceView;
  enabling?: boolean;
  onEnable?: () => void;
}) {
  const { t, i18n } = useTranslation();
  const locale = getIntlLocale(i18n.language);
  const unavailable = t("whatsapp.performance.unavailable");
  const [source, setSource] = useState<"meta" | "webhook">("meta");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("all");
  const [confirming, setConfirming] = useState(false);
  const templates = view.meta.templates;
  const rows = source === "meta" ? templates.rows : view.local.templates;
  const visible = useMemo(
    () => rows.filter((row) => templateMatches(row, search, category)),
    [rows, search, category]
  );

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-slate-500">{t("whatsapp.performance.templatePhoneNote")}</p>
      <p className="text-xs font-semibold text-slate-500">{t("whatsapp.performance.readRetention")}</p>
      {templates.reason && source === "meta" && !templates.available ? (
        <div className={`${cardBase} space-y-3 p-4`}>
          <p className="text-sm font-bold text-slate-800">
            {templates.reason === "TEMPLATE_INSIGHTS_NOT_ENABLED"
              ? t("whatsapp.performance.insightsOff")
              : reasonText(t, templates.reason)}
          </p>
          {templates.reason === "TEMPLATE_INSIGHTS_NOT_ENABLED" && onEnable ? (
            confirming ? (
              <div className="space-y-2">
                <p className="text-sm font-black text-slate-900">
                  {t("whatsapp.performance.confirmEnableTitle")}
                </p>
                <p className="text-xs font-semibold text-slate-600">
                  {t("whatsapp.performance.enableInsightsWarning")}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={btnPrimary}
                    disabled={enabling}
                    onClick={onEnable}
                  >
                    {t("whatsapp.performance.enableInsightsConfirm")}
                  </button>
                  <button type="button" className={btnSecondary} onClick={() => setConfirming(false)}>
                    {t("whatsapp.performance.cancel")}
                  </button>
                </div>
              </div>
            ) : (
              <button type="button" className={btnSecondary} onClick={() => setConfirming(true)}>
                {t("whatsapp.performance.enableInsights")}
              </button>
            )
          ) : null}
        </div>
      ) : null}
      {templates.reason === "TEMPLATE_ID_CAP" ? (
        <p className="text-xs font-semibold text-amber-700">
          {reasonText(t, "TEMPLATE_ID_CAP")}
        </p>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-0.5">
          {(["meta", "webhook"] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={[
                "rounded-md px-3 py-1.5 text-xs font-bold",
                source === key ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500",
              ].join(" ")}
              onClick={() => setSource(key)}
            >
              {key === "meta"
                ? t("whatsapp.performance.sourceMeta")
                : t("whatsapp.performance.sourceWebhook")}
            </button>
          ))}
        </div>
        <input
          className={`${inputBase} !h-10 sm:max-w-xs`}
          value={search}
          placeholder={t("whatsapp.performance.searchTemplates")}
          onChange={(event) => setSearch(event.target.value)}
        />
        <label className="flex items-center gap-2 text-xs font-bold text-slate-500">
          {t("whatsapp.performance.category")}
          <select
            className="h-10 rounded-md border border-slate-200 bg-white px-2 text-sm font-semibold text-slate-800"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as (typeof CATEGORIES)[number])
            }
          >
            {CATEGORIES.map((value) => (
              <option key={value} value={value}>
                {value === "all" ? t("whatsapp.performance.allCategories") : value}
              </option>
            ))}
          </select>
        </label>
      </div>
      {source === "webhook" ? (
        <p className="text-xs font-semibold text-slate-500">
          {t("whatsapp.performance.reasons.CLICKS_NOT_IN_WEBHOOK")}
        </p>
      ) : null}
      {!visible.length ? (
        <p className={`${cardBase} p-4 text-sm font-semibold text-slate-500`}>
          {source === "meta" && templates.available
            ? t("whatsapp.performance.templatesEmpty")
            : t("whatsapp.performance.empty")}
        </p>
      ) : (
        <>
        <div className="space-y-2 md:hidden">
          {visible.map((row) => (
            <article
              key={`${row.source}-${row.templateId || row.name}-${row.language}`}
              className={`${cardBase} p-3`}
            >
              <p className="text-sm font-black text-slate-900">{row.name}</p>
              <p className="mt-0.5 text-xs font-semibold text-slate-500">
                {row.category || unavailable}
                {row.language ? ` · ${row.language}` : ""}
              </p>
              <dl className="mt-2 grid grid-cols-2 gap-2">
                <StatLine
                  label={t("whatsapp.performance.columns.sent")}
                  value={formatCount(row.sent, locale, unavailable)}
                />
                <StatLine
                  label={t("whatsapp.performance.columns.delivered")}
                  value={formatCount(row.delivered, locale, unavailable)}
                />
                <StatLine
                  label={t("whatsapp.performance.columns.read")}
                  value={formatCount(row.read, locale, unavailable)}
                />
                {source === "webhook" ? (
                  <StatLine
                    label={t("whatsapp.performance.columns.failed")}
                    value={formatCount(row.failed, locale, unavailable)}
                  />
                ) : null}
                <StatLine
                  label={t("whatsapp.performance.columns.deliveryRate")}
                  value={formatRate(row.deliveryRate, unavailable)}
                />
                <StatLine
                  label={t("whatsapp.performance.columns.readRate")}
                  value={formatRate(row.readRate, unavailable)}
                />
              </dl>
              <p className="mt-2 text-xs font-semibold text-slate-600">
                <span className="font-bold text-slate-400">
                  {t("whatsapp.performance.columns.clicks")}:{" "}
                </span>
                {clickCell(
                  row,
                  source === "webhook"
                    ? t("whatsapp.performance.reasons.CLICKS_NOT_IN_WEBHOOK")
                    : unavailable,
                  t("whatsapp.performance.clicksTotal"),
                  t("whatsapp.performance.uniqueClicks")
                )}
              </p>
            </article>
          ))}
        </div>
        <div className={`${cardBase} hidden overflow-x-auto md:block`}>
          <table className="min-w-[960px] w-full text-start text-sm">
            <thead className="bg-slate-50 text-[11px] font-black tracking-wide text-slate-400">
              <tr>
                {(source === "webhook"
                  ? ["name", "category", "language", "sent", "delivered", "read", "failed", "deliveryRate", "readRate", "clicks"]
                  : ["name", "category", "language", "sent", "delivered", "read", "deliveryRate", "readRate", "clicks"]
                ).map(
                  (key) => (
                    <th key={key} className="px-3 py-2">
                      {t(`whatsapp.performance.columns.${key}`)}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={`${row.source}-${row.templateId || row.name}-${row.language}`} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-bold text-slate-900">{row.name}</td>
                  <td className="px-3 py-2">{row.category || unavailable}</td>
                  <td className="px-3 py-2">{row.language || unavailable}</td>
                  <td className="px-3 py-2">{formatCount(row.sent, locale, unavailable)}</td>
                  <td className="px-3 py-2">{formatCount(row.delivered, locale, unavailable)}</td>
                  <td className="px-3 py-2">{formatCount(row.read, locale, unavailable)}</td>
                  {source === "webhook" ? (
                    <td className="px-3 py-2">{formatCount(row.failed, locale, unavailable)}</td>
                  ) : null}
                  <td className="px-3 py-2">{formatRate(row.deliveryRate, unavailable)}</td>
                  <td className="px-3 py-2">{formatRate(row.readRate, unavailable)}</td>
                  <td className="px-3 py-2 text-xs font-semibold text-slate-600">
                    {clickCell(
                      row,
                      source === "webhook"
                        ? t("whatsapp.performance.reasons.CLICKS_NOT_IN_WEBHOOK")
                        : unavailable,
                      t("whatsapp.performance.clicksTotal"),
                      t("whatsapp.performance.uniqueClicks")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </>
      )}
    </div>
  );
}

export default function WhatsAppPerformanceTemplates() {
  const { view, enablingInsights, enableInsights } = useOutletContext<PerformanceContext>();
  if (!view) return null;
  return (
    <TemplatesBody view={view} enabling={enablingInsights} onEnable={() => void enableInsights()} />
  );
}
