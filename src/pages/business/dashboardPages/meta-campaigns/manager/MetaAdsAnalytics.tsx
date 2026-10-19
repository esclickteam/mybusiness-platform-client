import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getMetaAdsManagerBreakdown,
  getMetaAdsManagerCompare,
  getMetaAdsManagerSeries,
  type MetaCampaignSeriesPoint,
  type MetaManagerQuery,
} from "../../../../../api/metaCampaignsApi";
import { btnSecondary, cardBase } from "../../../../../styles/bizuplyUi";
import { formatCurrency, formatNumber, formatPercent } from "../metaCampaignUtils";
import { chartAxisFor, chartMetricUnit, mergeChartSeries } from "./managerMetrics";

const CHART_METRICS = ["spend", "impressions", "reach", "leads", "ctr", "cpc"] as const;
const BREAKDOWNS = ["age", "gender", "country", "region", "device", "platform", "placement"] as const;

type Props = {
  businessId: string | null;
  currency: string;
  rangeQuery: MetaManagerQuery;
  series: MetaCampaignSeriesPoint[];
  selectedIds: string[];
};

const LINE_COLORS = ["#7c3aed", "#0f766e", "#b45309", "#0369a1", "#be123c", "#4338ca"];

function formatPoint(key: string, value: number, currency: string) {
  const unit = chartMetricUnit(key);
  if (unit === "money") return formatCurrency(value, currency);
  if (unit === "rate") return formatPercent(value);
  return formatNumber(value);
}

export default function MetaAdsAnalytics({ businessId, currency, rangeQuery, series, selectedIds }: Props) {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState<string[]>(["spend", "leads"]);
  const [grain, setGrain] = useState<"day" | "week" | "month">("day");
  const [remoteSeries, setRemoteSeries] = useState<Array<Record<string, number | string | null>> | null>(null);
  const [breakdown, setBreakdown] = useState("");
  const [slices, setSlices] = useState<Array<{ label: string; metrics: Record<string, number | null | undefined> }>>([]);
  const [breakdownNote, setBreakdownNote] = useState("");
  const [compareRows, setCompareRows] = useState<Array<{ id: string; metrics: Record<string, number | null | undefined> }>>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");

  const daily = series.map((point) => ({
    date: point.date,
    spend: point.spend,
    impressions: point.impressions,
    reach: point.reach ?? null,
    leads: point.leads,
    ctr: point.ctr ?? null,
    cpc: point.cpc ?? null,
  }));
  const chartData = remoteSeries || daily;
  const lineKeys = (remoteSeries
    ? [...new Set(remoteSeries.flatMap((row) => Object.keys(row).filter((key) => key !== "date")))]
    : [...metrics]
  ).filter((key) => {
    const base = key.includes(":") ? key.slice(key.lastIndexOf(":") + 1) : key;
    return metrics.includes(base) && base !== "clicks";
  });
  const axis = chartAxisFor(lineKeys);
  const moneyKeys = lineKeys.filter((key) => chartMetricUnit(key) === "money" || chartMetricUnit(key) === "rate");
  const countKeys = lineKeys.filter((key) => !moneyKeys.includes(key));

  async function loadGrain(next: "day" | "week" | "month") {
    setGrain(next);
    if (!businessId || next === "day") {
      setRemoteSeries(null);
      return;
    }
    setBusy("grain");
    setError("");
    try {
      const data = await getMetaAdsManagerSeries(businessId, {
        ...rangeQuery,
        level: "campaign",
        grain: next,
        ids: selectedIds.join(","),
      });
      setRemoteSeries(mergeChartSeries(data.series || [], [...CHART_METRICS, "clicks"]));
    } catch {
      setError(t("metaCampaigns.levels.loadError"));
    } finally {
      setBusy("");
    }
  }

  async function loadBreakdown(next: string) {
    setBreakdown(next);
    setSlices([]);
    setBreakdownNote("");
    if (!businessId || !next) return;
    setBusy("breakdown");
    setError("");
    try {
      const data = await getMetaAdsManagerBreakdown(businessId, {
        ...rangeQuery,
        level: "campaign",
        breakdown: next,
        ids: selectedIds.join(","),
      });
      setSlices(data.slices || []);
      setBreakdownNote(data.reporting?.note || "");
    } catch {
      setError(t("metaCampaigns.levels.loadError"));
    } finally {
      setBusy("");
    }
  }

  async function loadCompare() {
    if (!businessId || selectedIds.length < 2) return;
    setBusy("compare");
    setError("");
    try {
      const data = await getMetaAdsManagerCompare(businessId, {
        ...rangeQuery,
        ids: selectedIds.join(","),
      });
      setCompareRows(data.rows || []);
    } catch {
      setError(t("metaCampaigns.levels.loadError"));
    } finally {
      setBusy("");
    }
  }

  function toggleMetric(key: string) {
    setMetrics((current) => {
      if (current.includes(key)) return current.filter((item) => item !== key);
      return [...current, key];
    });
  }

  return (
    <section className={`${cardBase} space-y-3 p-3`} data-testid="meta-ads-analytics">
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="text-sm font-black">{t("metaCampaigns.chart.title")}</h3>
        <div className="flex flex-wrap gap-1">
          {(["day", "week", "month"] as const).map((item) => (
            <button
              key={item}
              type="button"
              className={grain === item ? btnSecondary : btnSecondary}
              aria-pressed={grain === item}
              onClick={() => void loadGrain(item)}
            >
              {t(`metaCampaigns.levels.grain${item === "day" ? "Day" : item === "week" ? "Week" : "Month"}`)}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {CHART_METRICS.map((key) => (
          <label key={key} className="inline-flex items-center gap-1 text-xs font-bold text-slate-600">
            <input type="checkbox" checked={metrics.includes(key)} onChange={() => toggleMetric(key)} />
            {t(`metaCampaigns.table.${key === "leads" ? "leads" : key}`, { defaultValue: key })}
          </label>
        ))}
      </div>
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      {chartData.length === 0 ? (
        <p className="py-6 text-center text-sm font-semibold text-slate-500">{t("metaCampaigns.chart.empty")}</p>
      ) : (
        <div className="h-64 w-full" dir="ltr">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" />
              {axis === "dual" ? <YAxis yAxisId="right" orientation="right" /> : null}
              <Tooltip />
              <Legend />
              {(axis === "dual" ? countKeys : lineKeys).map((key, index) => (
                <Line key={key} yAxisId="left" type="monotone" dataKey={key} stroke={LINE_COLORS[index % LINE_COLORS.length]} dot={false} connectNulls={false} />
              ))}
              {axis === "dual"
                ? moneyKeys.map((key, index) => (
                    <Line key={key} yAxisId="right" type="monotone" dataKey={key} stroke={LINE_COLORS[(index + 1) % LINE_COLORS.length]} dot={false} connectNulls={false} />
                  ))
                : null}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
      {busy ? <p className="text-xs font-semibold text-slate-500">{busy}</p> : null}

      <div className="grid gap-3 lg:grid-cols-2">
        <div>
          <label className="text-xs font-black text-slate-500" htmlFor="meta-breakdown">
            {t("metaCampaigns.levels.breakdown")}
          </label>
          <select
            id="meta-breakdown"
            className="mt-1 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm font-bold"
            value={breakdown}
            onChange={(event) => void loadBreakdown(event.target.value)}
          >
            <option value="">{t("metaCampaigns.segments.all")}</option>
            {BREAKDOWNS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {breakdownNote ? <p className="mt-1 text-xs font-semibold text-slate-500">{breakdownNote}</p> : null}
          {slices.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {slices.map((slice) => (
                <li key={slice.label} className="flex justify-between gap-2">
                  <span className="font-bold">{slice.label}</span>
                  <span title={t("metaCampaigns.levels.missingMetric")}>
                    {slice.metrics?.impressions == null ? "—" : formatNumber(Number(slice.metrics.impressions))}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div>
          <button type="button" className={btnSecondary} disabled={selectedIds.length < 2} onClick={() => void loadCompare()}>
            {t("metaCampaigns.levels.compare")}
          </button>
          {selectedIds.length < 2 ? (
            <p className="mt-1 text-xs font-semibold text-slate-500">{t("metaCampaigns.levels.compareNeed")}</p>
          ) : null}
          {compareRows.length ? (
            <div className="mt-2 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-xs font-black text-slate-500">
                    <th className="px-2 py-1 text-start">ID</th>
                    {["spend", "impressions", "reach", "clicks", "leads", "ctr", "cpc", "cpl"].map((key) => (
                      <th key={key} className="px-2 py-1 text-start">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row) => (
                    <tr key={row.id} className="border-t border-slate-100">
                      <td className="px-2 py-1 font-bold">{row.id}</td>
                      {["spend", "impressions", "reach", "clicks", "leads", "ctr", "cpc", "costPerLead"].map((key) => {
                        const value = readManagerMetric(row.metrics as never, key === "cpl" ? "costPerLead" : key);
                        return (
                          <td key={key} className="px-2 py-1" title={value == null ? t("metaCampaigns.levels.missingMetric") : undefined}>
                            {value == null ? "—" : formatPoint(key, value, currency)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
