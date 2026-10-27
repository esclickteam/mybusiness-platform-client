import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, History, Loader2, Pause, Pencil, Play, RefreshCw, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import {
  getMetaAdsManager,
  listMetaChangeHistory,
  setMetaAdSetStatus,
  setMetaAdStatus,
  type MetaManagerLevel,
  type MetaManagerQuery,
  type MetaManagerRow,
} from "../../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../../styles/bizuplyUi";
import {
  formatCurrency,
  formatDateTimeHe,
  formatNumber,
  formatPercent,
  metaDeliveryStatusKey,
  statusTone,
} from "../metaCampaignUtils";
import {
  loadColumnPrefs,
  saveColumnPrefs,
  visibleColumns,
  type ColumnPrefs,
  type ManagerColumnId,
} from "./columnPrefs";
import { columnLabelKey } from "./columnLabels";
import { canToggleMetaDelivery, displayListStatus } from "../campaignLocalDraft";
import ManagerColumnMenu, { beginColumnResize } from "./ManagerColumnMenu";
import { readManagerMetric } from "./managerMetrics";
import { bulkLivePlan, runBulkStatus, selectVisible, toggleSelected } from "./managerSelection";
import MetaCampaignDeleteDialog from "../MetaCampaignDeleteDialog";
import { useCampaignDraftDelete } from "../useCampaignDraftDelete";

type Props = {
  businessId: string;
  level: Extract<MetaManagerLevel, "adset" | "ad">;
  currency: string;
  rangeQuery: MetaManagerQuery;
  campaignId?: string;
  adSetId?: string;
  onEdit: (row: MetaManagerRow) => void;
  onDuplicate: (row: MetaManagerRow) => void;
  onOpenCampaign: (row: MetaManagerRow) => void;
  onOpenAdSet: (row: MetaManagerRow) => void;
};

function cellText(row: MetaManagerRow, column: ManagerColumnId, currency: string) {
  if (column === "name") return row.name;
  if (column === "status") return displayListStatus(row);
  if (column === "budget") {
    if (row.dailyBudget) return formatCurrency(row.dailyBudget, currency);
    if (row.lifetimeBudget) return formatCurrency(row.lifetimeBudget, currency);
    return "—";
  }
  if (column === "updated") return formatDateTimeHe(row.updatedTime);
  const metricKey = column === "cpl" ? "costPerLead" : column;
  const value = readManagerMetric(row.metrics, metricKey);
  if (value == null) return "—";
  if (column === "spend" || column === "cpc" || column === "cpm" || column === "cpl" || column === "costPerResult") {
    return formatCurrency(value, currency);
  }
  if (column === "ctr") return formatPercent(value);
  if (column === "frequency") return value.toFixed(2);
  return formatNumber(value);
}

export default function MetaAdsLevelPanel({
  businessId,
  level,
  currency,
  rangeQuery,
  campaignId,
  adSetId,
  onEdit,
  onDuplicate,
  onOpenCampaign,
  onOpenAdSet,
}: Props) {
  const { t } = useTranslation();
  const [rows, setRows] = useState<MetaManagerRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [createdSince, setCreatedSince] = useState("");
  const [createdUntil, setCreatedUntil] = useState("");
  const [after, setAfter] = useState("");
  const [nextCursor, setNextCursor] = useState("");
  const [cursors, setCursors] = useState<string[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [prefs, setPrefs] = useState<ColumnPrefs>(() => loadColumnPrefs(window.localStorage, businessId, level));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [sort, setSort] = useState<{ key: ManagerColumnId; dir: "asc" | "desc" }>({ key: "spend", dir: "desc" });
  const [pending, setPending] = useState<"ACTIVE" | "PAUSED" | null>(null);
  const [busy, setBusy] = useState(false);
  const [details, setDetails] = useState<MetaManagerRow | null>(null);
  const [history, setHistory] = useState<Array<{ id: string; action: string; createdAt?: string | null; success: boolean }>>([]);
  const [syncedAt, setSyncedAt] = useState<string | null>(null);
  const [timezoneName, setTimezoneName] = useState("");
  const deletion = useCampaignDraftDelete(businessId, (id, extra) => {
    const ids = extra?.ids?.length ? extra.ids : [id];
    setRows((current) => current.filter((row) => !ids.includes(row.id)));
    setSelected((current) => current.filter((rowId) => !ids.includes(rowId)));
    setRefreshKey((value) => value + 1);
  });

  useEffect(() => {
    setPrefs(loadColumnPrefs(window.localStorage, businessId, level));
    setSelected([]);
    setCursors([]);
    setAfter("");
  }, [businessId, level, campaignId, adSetId]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await getMetaAdsManager(businessId, {
          ...rangeQuery,
          level,
          limit: 25,
          after,
          campaignId,
          adSetId,
          status: status === "all" ? undefined : status,
          q: query.trim() || undefined,
          createdSince: createdSince || undefined,
          createdUntil: createdUntil || undefined,
          refresh: refreshKey > 0 ? 1 : undefined,
        });
        if (cancelled) return;
        setRows(data.rows || []);
        setNextCursor(data.paging?.after || "");
        setHasNext(Boolean(data.paging?.hasNext && data.paging?.after));
        setSyncedAt(data.insightsSync?.syncedAt || null);
        setTimezoneName(data.account?.timezoneName || "");
        if (data.insightsSync?.ok === false) {
          setError(
            data.insightsSync.error === "rate_limit"
              ? t("metaCampaigns.actions.rateLimited")
              : t("metaCampaigns.levels.loadError")
          );
        }
      } catch {
        if (!cancelled) setError(t("metaCampaigns.levels.loadError"));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    const timer = window.setTimeout(() => void load(), 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [adSetId, after, businessId, campaignId, createdSince, createdUntil, level, query, rangeQuery, refreshKey, status, t]);

  const columns = visibleColumns(prefs);
  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = sort.key === "name" ? a.name : cellText(a, sort.key, currency);
      const bv = sort.key === "name" ? b.name : cellText(b, sort.key, currency);
      const base = String(av).localeCompare(String(bv), "he", { numeric: true });
      return sort.dir === "asc" ? base : -base;
    });
    return copy;
  }, [currency, rows, sort.dir, sort.key]);

  function updatePrefs(next: ColumnPrefs) {
    setPrefs(next);
    saveColumnPrefs(window.localStorage, businessId, level, next);
  }

  const visibleIds = sorted.map((row) => row.id);
  const allChecked = visibleIds.length > 0 && visibleIds.every((id) => selected.includes(id));
  const plan = pending
    ? bulkLivePlan(
        sorted.filter((row) => selected.includes(row.id)),
        pending
      )
    : null;

  async function confirmBulk() {
    if (!plan) return;
    setBusy(true);
    const chosen = sorted.filter((row) => plan.ids.includes(row.id));
    const result = await runBulkStatus(chosen, plan.next, async (id) => {
      const options = plan.next === "ACTIVE" ? { confirmActivate: true } : undefined;
      if (level === "adset") {
        await setMetaAdSetStatus(businessId, id, plan.next, options);
      } else {
        await setMetaAdStatus(businessId, id, plan.next, options);
      }
    });
    setBusy(false);
    setPending(null);
    setSelected([]);
    if (result.failed.length) {
      toast.error(t("metaCampaigns.levels.bulkPartial", { names: result.failed.map((row) => row.name).join(", ") }));
    }
    setRefreshKey((value) => value + 1);
  }

  async function openHistory(row: MetaManagerRow) {
    setDetails(row);
    try {
      const data = await listMetaChangeHistory(businessId, row.id);
      setHistory(data.changes || []);
    } catch {
      setHistory([]);
    }
  }

  return (
    <div className="space-y-3" data-testid={`meta-level-panel-${level}`}>
      <div className={`${cardBase} grid gap-2 p-3 md:grid-cols-2 xl:grid-cols-4`}>
        <input
          className={inputBase}
          value={query}
          onChange={(event) => {
            setAfter("");
            setCursors([]);
            setQuery(event.target.value);
          }}
          placeholder={t("metaCampaigns.levels.search")}
          aria-label={t("metaCampaigns.levels.search")}
          data-testid="meta-manager-search"
        />
        <select className={inputBase} value={status} onChange={(event) => setStatus(event.target.value)} aria-label={t("metaCampaigns.table.status")}>
          <option value="all">{t("metaCampaigns.segments.all")}</option>
          <option value="ACTIVE">{t("metaCampaigns.status.active")}</option>
          <option value="PAUSED">{t("metaCampaigns.status.paused")}</option>
        </select>
        <input className={inputBase} type="date" value={createdSince} aria-label={t("metaCampaigns.levels.createdFrom")} onChange={(event) => setCreatedSince(event.target.value)} />
        <input className={inputBase} type="date" value={createdUntil} aria-label={t("metaCampaigns.levels.createdTo")} onChange={(event) => setCreatedUntil(event.target.value)} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500">
          {syncedAt ? t("metaCampaigns.overview.lastSynced", { time: formatDateTimeHe(syncedAt) }) : null}
          {timezoneName ? ` · ${timezoneName} · ${currency}` : ` · ${currency}`}
        </p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnSecondary} onClick={() => setColumnsOpen((open) => !open)}>
            {t("metaCampaigns.levels.columns")}
          </button>
          <button type="button" className={btnSecondary} onClick={() => setRefreshKey((value) => value + 1)}>
            <RefreshCw className="h-4 w-4" />
            {t("metaCampaigns.actions.refresh")}
          </button>
        </div>
      </div>
      {columnsOpen ? <ManagerColumnMenu prefs={prefs} onChange={updatePrefs} level={level} /> : null}
      {selected.length ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={btnSecondary} onClick={() => setPending("PAUSED")}>{t("metaCampaigns.actions.pause")}</button>
          <button type="button" className={btnSecondary} onClick={() => setPending("ACTIVE")}>{t("metaCampaigns.actions.resume")}</button>
          <button
            type="button"
            className={btnSecondary}
            data-testid="meta-level-bulk-delete"
            onClick={() => deletion.askMany(sorted.filter((row) => selected.includes(row.id)), level)}
          >
            {t("metaCampaigns.levels.bulkDelete")}
          </button>
        </div>
      ) : null}
      {error ? <p className="text-sm font-bold text-rose-700">{error}</p> : null}
      {loading ? (
        <div className={`${cardBase} space-y-2 p-4`} aria-busy="true">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : sorted.length === 0 ? (
        <div className={`${cardBase} p-8 text-center font-black`}>{t("metaCampaigns.levels.empty")}</div>
      ) : (
        <div className={`${cardBase} overflow-x-auto`}>
          <table className="min-w-[960px] text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    aria-label={t("metaCampaigns.levels.selectAll")}
                    checked={allChecked}
                    onChange={() => setSelected(allChecked ? [] : selectVisible(visibleIds))}
                  />
                </th>
                {columns.map((column) => (
                  <th key={column} className="relative px-3 py-3 text-start" style={{ width: prefs.widths[column] || undefined, minWidth: prefs.widths[column] || 120 }}>
                    <button
                      type="button"
                      className="font-black"
                      onClick={() =>
                        setSort((current) => ({
                          key: column,
                          dir: current.key === column && current.dir === "desc" ? "asc" : "desc",
                        }))
                      }
                    >
                      {t(columnLabelKey(column, level))}
                    </button>
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      className="absolute inset-y-0 end-0 w-1 cursor-col-resize"
                      onMouseDown={(event) => beginColumnResize(event, column, prefs, updatePrefs)}
                    />
                  </th>
                ))}
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((row) => {
                const listStatus = displayListStatus(row);
                const tone = statusTone(listStatus);
                const canToggle = canToggleMetaDelivery(row);
                const isConfiguredActive =
                  String(row.configuredStatus || row.status).toUpperCase() === "ACTIVE";
                return (
                  <tr key={row.id} className="border-t border-slate-100" data-testid={`meta-manager-row-${row.id}`}>
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        aria-label={row.name}
                        checked={selected.includes(row.id)}
                        onChange={() => setSelected((current) => toggleSelected(current, row.id))}
                      />
                    </td>
                    {columns.map((column) => (
                      <td key={column} className="px-3 py-3 font-bold" title={cellText(row, column, currency) === "—" ? t("metaCampaigns.levels.missingMetric") : undefined}>
                        {column === "name" ? (
                          <button type="button" className="text-start" onClick={() => (level === "adset" ? onOpenAdSet(row) : onOpenCampaign(row))}>
                            {row.name}
                            <span className="mt-0.5 block text-xs font-semibold text-slate-400">{row.id}</span>
                          </button>
                        ) : column === "status" ? (
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}>
                            {t(`metaCampaigns.status.${metaDeliveryStatusKey(listStatus)}`, { defaultValue: listStatus })}
                          </span>
                        ) : (
                          cellText(row, column, currency)
                        )}
                      </td>
                    ))}
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.actions.viewDetails")} onClick={() => void openHistory(row)}>
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.actions.edit")} onClick={() => onEdit(row)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.actions.duplicateDraft")} onClick={() => onDuplicate(row)}>
                          {t("metaCampaigns.actions.duplicateDraft")}
                        </button>
                        <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.levels.history")} onClick={() => void openHistory(row)}>
                          <History className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${btnSecondary} inline-flex min-h-11 min-w-11 items-center justify-center`}
                          aria-label={t("metaCampaigns.actions.deleteCampaign")}
                          data-testid={`meta-level-delete-${row.id}`}
                          disabled={deletion.busy}
                          onClick={() => deletion.ask(row, level)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                        {canToggle ? (
                        <button
                          type="button"
                          className={btnPrimary}
                          aria-label={isConfiguredActive ? t("metaCampaigns.actions.pause") : t("metaCampaigns.actions.resume")}
                          data-testid={`meta-level-toggle-${row.id}`}
                          onClick={() => {
                            setSelected([row.id]);
                            setPending(isConfiguredActive ? "PAUSED" : "ACTIVE");
                          }}
                        >
                          {isConfiguredActive ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                        </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex justify-between gap-2">
        <button
          type="button"
          className={btnSecondary}
          disabled={!cursors.length}
          onClick={() => {
            const next = [...cursors];
            const previous = next.pop() || "";
            setCursors(next);
            setAfter(previous);
          }}
        >
          {t("metaCampaigns.levels.prev")}
        </button>
        <button
          type="button"
          className={btnSecondary}
          disabled={!hasNext}
          onClick={() => {
            if (!nextCursor) return;
            setCursors((current) => [...current, after]);
            setAfter(nextCursor);
          }}
        >
          {t("metaCampaigns.levels.next")}
        </button>
      </div>
      {pending && plan ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true">
          <div className={`${cardBase} w-full max-w-md space-y-3 p-5`}>
            <h3 className="text-lg font-black">{t("metaCampaigns.levels.bulkTitle", { count: plan.count })}</h3>
            <p className="text-sm font-semibold text-slate-600">
              {t("metaCampaigns.levels.bulkBody", {
                action: plan.next === "ACTIVE" ? t("metaCampaigns.actions.resume") : t("metaCampaigns.actions.pause"),
                names: plan.names.join(", "),
              })}
            </p>
            {plan.changesLiveDelivery ? <p className="text-sm font-black text-amber-800">{t("metaCampaigns.levels.bulkLive")}</p> : null}
            {plan.skipped ? <p className="text-sm font-semibold">{t("metaCampaigns.levels.bulkSkipped", { count: plan.skipped })}</p> : null}
            <div className="flex justify-end gap-2">
              <button type="button" className={btnSecondary} onClick={() => setPending(null)}>{t("common.cancel", { defaultValue: "ביטול" })}</button>
              <button type="button" className={btnPrimary} data-testid="meta-bulk-confirm" disabled={busy || plan.count === 0} onClick={() => void confirmBulk()}>
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : t("metaCampaigns.levels.bulkConfirm")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <MetaCampaignDeleteDialog
        targets={deletion.targets}
        level={deletion.level}
        busy={deletion.busy}
        error={deletion.error}
        onClose={deletion.close}
        onConfirm={() => void deletion.confirm()}
      />
      {details ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true">
          <div className={`${cardBase} max-h-[80vh] w-full max-w-lg space-y-2 overflow-y-auto p-5`}>
            <h3 className="text-lg font-black">{details.name}</h3>
            <p className="text-xs font-semibold text-slate-500">{details.id}</p>
            <p className="text-sm">{details.headline || details.primaryText || details.optimizationGoal || "—"}</p>
            <h4 className="font-black">{t("metaCampaigns.levels.history")}</h4>
            {history.length === 0 ? <p className="text-sm font-semibold text-slate-500">{t("metaCampaigns.levels.historyEmpty")}</p> : null}
            <ul className="space-y-1 text-sm">
              {history.map((item) => (
                <li key={item.id}>
                  {formatDateTimeHe(item.createdAt)} · {item.action} · {item.success ? "OK" : "—"}
                </li>
              ))}
            </ul>
            <button type="button" className={btnSecondary} onClick={() => setDetails(null)}>{t("metaCampaigns.details.close")}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
