import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getMetaPerformance } from "../../../../api/metaCampaignsApi";
import { formatCurrency, formatMetricOrDash, formatNumber, formatPercent } from "./metaCampaignUtils";

type Level = "campaign" | "adset" | "ad";
type Row = Record<string, any>;

const COLUMNS = [
  { key: "name", metric: false },
  { key: "status", metric: false },
  { key: "spend", metric: true },
  { key: "results", metric: true },
  { key: "costPerResult", metric: true },
  { key: "reach", metric: true },
  { key: "impressions", metric: true },
  { key: "frequency", metric: true },
  { key: "clicks", metric: true },
  { key: "linkClicks", metric: true },
  { key: "ctr", metric: true },
  { key: "cpc", metric: true },
  { key: "cpm", metric: true },
] as const;

export default function MetaPerformanceBreakdown({
  businessId,
  rangeQuery,
  currency,
}: {
  businessId: string;
  rangeQuery: { datePreset?: string; since?: string; until?: string; days?: number };
  currency: string;
}) {
  const { t } = useTranslation();
  const [level, setLevel] = useState<Level>("campaign");
  const [rows, setRows] = useState<Row[]>([]);
  const [sortKey, setSortKey] = useState("spend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getMetaPerformance(businessId, { level, ...rangeQuery })
      .then((res) => {
        if (!cancelled) setRows(res.rows || []);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [businessId, level, rangeQuery.datePreset, rangeQuery.since, rangeQuery.until, rangeQuery.days]);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = sortKey === "name" || sortKey === "status"
        ? String(a[sortKey] || a.effectiveStatus || "")
        : Number(a.metrics?.[sortKey] ?? a[sortKey] ?? 0);
      const bv = sortKey === "name" || sortKey === "status"
        ? String(b[sortKey] || b.effectiveStatus || "")
        : Number(b.metrics?.[sortKey] ?? b[sortKey] ?? 0);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const formatCell = (row: Row, key: string) => {
    const metrics = row.metrics || {};
    if (key === "name") return row.name || row.campaignName || row.id;
    if (key === "status") return row.effectiveStatus || row.status || "—";
    const value = metrics[key] ?? row[key];
    if (key === "spend" || key === "costPerResult" || key === "cpc" || key === "cpm") {
      return formatMetricOrDash(value, (n) => formatCurrency(n, currency));
    }
    if (key === "ctr") return formatMetricOrDash(value, (n) => formatPercent(n));
    if (key === "frequency") return formatMetricOrDash(value, (n) => n.toFixed(2));
    return formatMetricOrDash(value, formatNumber);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4">
      <div className="mb-3 flex flex-wrap gap-2">
        {(["campaign", "adset", "ad"] as Level[]).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setLevel(item)}
            className={`rounded-full px-3 py-1.5 text-sm font-bold ${
              level === item ? "bg-violet-600 text-white" : "bg-slate-100 text-slate-600"
            }`}
          >
            {t(`metaCampaigns.manager.tabs.${item}`)}
          </button>
        ))}
      </div>
      {loading ? (
        <p className="text-sm text-slate-500">{t("metaCampaigns.empty.loadingFromMeta")}</p>
      ) : (
        <>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full text-start text-sm">
              <thead>
                <tr>
                  {COLUMNS.map((col) => (
                    <th key={col.key} className="px-2 py-2">
                      <button
                        type="button"
                        className="font-bold text-slate-500"
                        onClick={() => {
                          setSortKey(col.key);
                          setSortDir((prev) => (sortKey === col.key && prev === "desc" ? "asc" : "desc"));
                        }}
                      >
                        {t(`metaCampaigns.table.${col.key === "results" ? "results" : col.key}`)}
                      </button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sorted.map((row) => (
                  <tr key={row.id} className="border-t border-slate-100">
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="px-2 py-2 font-semibold text-slate-800">
                        {formatCell(row, col.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="space-y-2 md:hidden">
            {sorted.map((row) => (
              <article key={row.id} className="rounded-xl border border-slate-200 p-3">
                <p className="font-black text-slate-900">{row.name}</p>
                <p className="text-xs text-slate-500">{row.effectiveStatus || row.status}</p>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <span>{t("metaCampaigns.table.spend")}: {formatCell(row, "spend")}</span>
                  <span>{t("metaCampaigns.table.results")}: {formatCell(row, "results")}</span>
                  <span>{t("metaCampaigns.table.ctr")}: {formatCell(row, "ctr")}</span>
                  <span>{t("metaCampaigns.table.clicks")}: {formatCell(row, "clicks")}</span>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
