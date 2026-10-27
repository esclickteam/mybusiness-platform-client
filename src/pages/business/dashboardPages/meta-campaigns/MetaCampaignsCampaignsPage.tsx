import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Copy, Eye, Loader2, Pause, Pencil, Play, RefreshCw, Trash2 } from "lucide-react";
import {
  duplicateLocalCampaignDraft,
  getMetaCampaign,
  getMetaCampaignsOverview,
  saveMetaEditorDraft,
  setMetaCampaignStatus,
  type MetaCampaign,
  type MetaCampaignSeriesPoint,
} from "../../../../api/metaCampaignsApi";
import { adsManagerStateFromMetaCampaign } from "./ads-manager/adsManagerStateFromMetaCampaign";
import { buildEditorDraft } from "./ads-manager/editorDraft";
import { duplicateManagerDraft } from "./manager/duplicateManagerDraft";
import { campaignColumnText, campaignSortValue } from "./manager/campaignColumnValue";
import { COLUMN_LABEL } from "./manager/columnLabels";
import { loadColumnPrefs, saveColumnPrefs, visibleColumns, type ColumnPrefs, type ManagerColumnId } from "./manager/columnPrefs";
import ManagerColumnMenu, { beginColumnResize } from "./manager/ManagerColumnMenu";
import MetaAdsAnalytics from "./manager/MetaAdsAnalytics";
import MetaAdsLevelPanel from "./manager/MetaAdsLevelPanel";
import { bulkLivePlan, runBulkStatus, selectVisible, toggleSelected } from "./manager/managerSelection";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";
import { toast } from "react-toastify";
import MetaCampaignDetailsDrawer from "./MetaCampaignDetailsDrawer";
import CreateCampaignButton from "./CreateCampaignButton";
import { metaAdsFriendlyMessage } from "./metaAdsFriendlyError";
import {
  formatDateTimeHe,
  metaDeliveryStatusKey,
  resolveCampaignCurrency,
  statusTone,
} from "./metaCampaignUtils";
import { useMetaAdsDateRange } from "./useMetaAdsDateRange";
import { useMetaAdsTimeZone } from "./metaAdsTimeZone";
import MetaCampaignDeleteDialog from "./MetaCampaignDeleteDialog";
import { removeCampaignsFromList } from "./campaignListDeletion";
import { useCampaignDraftDelete } from "./useCampaignDraftDelete";
import { canToggleMetaDelivery, displayListStatus, isQaTestDraftName } from "./campaignLocalDraft";

type OutletCtx = { businessId: string | null };

function campaignListStatus(campaign: MetaCampaign) {
  const raw = String(campaign.configuredStatus || campaign.status || "").toUpperCase();
  if (campaign.publishFailed || raw === "FAILED" || raw === "PARTIAL_FAILED") return "FAILED";
  const displayed = displayListStatus(campaign);
  if (displayed === "DRAFT") return "DRAFT";
  if (campaign.hasUnpublishedChanges) return "PENDING_PUBLISH";
  return displayed;
}

function objectiveKey(objective?: string | null) {
  const value = String(objective || "").toLowerCase();
  if (value.includes("sale")) return "sales";
  if (value.includes("traffic")) return "traffic";
  if (value.includes("aware")) return "awareness";
  if (value.includes("engage")) return "engagement";
  return "leads";
}

export default function MetaCampaignsCampaignsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const basePath = `/business/${urlBusinessId || businessId}/dashboard/meta-campaigns`;
  const [loading, setLoading] = useState(true);
  const [campaigns, setCampaigns] = useState<MetaCampaign[]>([]);
  const [currency, setCurrency] = useState("ILS");
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const { query: rangeQuery, labelKey: rangeLabelKey, comparison, compare } = useMetaAdsDateRange();
  const { setTimeZone } = useMetaAdsTimeZone();
  const [sortKey, setSortKey] = useState<ManagerColumnId>("spend");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [columnPrefs, setColumnPrefs] = useState<ColumnPrefs>(() => loadColumnPrefs(window.localStorage, "campaign", "campaign"));
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);
  const [insightsError, setInsightsError] = useState<string | null>(null);
  const [details, setDetails] = useState<MetaCampaign | null>(null);
  const [pending, setPending] = useState<MetaCampaign | null>(null);
  const [busyId, setBusyId] = useState("");
  const [level, setLevel] = useState<"campaign" | "adset" | "ad">("campaign");
  const [series, setSeries] = useState<MetaCampaignSeriesPoint[]>([]);
  const [comparisonSeries, setComparisonSeries] = useState<MetaCampaignSeriesPoint[]>([]);
  const [pinnedCampaign, setPinnedCampaign] = useState<{ id: string; name: string } | null>(null);
  const [pinnedAdSet, setPinnedAdSet] = useState<{ id: string; name: string } | null>(null);
  const [checked, setChecked] = useState<string[]>([]);
  const [hideQaDrafts, setHideQaDrafts] = useState(true);
  const [bulkStatus, setBulkStatus] = useState<"ACTIVE" | "PAUSED" | null>(null);
  const deletion = useCampaignDraftDelete(businessId, (id, extra) => {
    const ids = extra?.ids?.length ? extra.ids : [id];
    setCampaigns((current) => removeCampaignsFromList(current, ids));
    setChecked((current) => current.filter((rowId) => !ids.includes(rowId)));
    if (pinnedCampaign && ids.includes(pinnedCampaign.id)) setPinnedCampaign(null);
  });

  async function load() {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await getMetaCampaignsOverview(businessId, rangeQuery);
      setCampaigns(data.campaigns || []);
      setSeries(data.series || []);
      setComparisonSeries(compare ? data.comparisonSeries || [] : []);
      if (data.connection?.selectedAdAccount?.timezoneName) setTimeZone(data.connection.selectedAdAccount.timezoneName);
      setCurrency(resolveCampaignCurrency(data.connection?.selectedAdAccount?.currency));
      setInsightsError(data.insightsSync?.ok === false ? data.insightsSync.error || "unavailable" : null);
      const syncedAt = data.insightsSync?.syncedAt || data.connection?.lastSyncAt;
      if (!data.insightsSync || data.insightsSync.ok !== false) {
        setLastSynced(syncedAt ? new Date(syncedAt) : new Date());
      } else if (syncedAt) {
        setLastSynced(new Date(syncedAt));
      }
    } catch (error) {
      const kind = metaAdsFriendlyMessage(error, "LOAD");
      toast.error(
        kind === "RATE_LIMIT"
          ? t("metaCampaigns.actions.rateLimited")
          : kind === "TOKEN"
            ? t("metaCampaigns.ux.tokenIssue")
            : kind === "PERMISSION"
              ? t("metaCampaigns.errors.permissionRead")
              : t("metaCampaigns.errors.loadOverview")
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setColumnPrefs(loadColumnPrefs(window.localStorage, businessId || "campaign", "campaign"));
  }, [businessId]);

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, rangeQuery.datePreset, rangeQuery.days, rangeQuery.since, rangeQuery.until, rangeQuery.compare, rangeQuery.compareSince, rangeQuery.compareUntil, rangeQuery.timezone]);

  const rows = useMemo(() => {
    const filtered = campaigns.filter((row) => {
      const hay = `${row.name || ""} ${row.id || ""}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      const status = campaignListStatus(row);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      if (hideQaDrafts && isQaTestDraftName(row.name)) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const av = campaignSortValue(a, sortKey);
      const bv = campaignSortValue(b, sortKey);
      if (typeof av === "string" || typeof bv === "string") {
        const base = String(av || "").localeCompare(String(bv || ""), "he");
        return sortDir === "asc" ? base : -base;
      }
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      return sortDir === "asc" ? av - bv : bv - av;
    });
  }, [campaigns, hideQaDrafts, query, sortDir, sortKey, statusFilter]);

  const activate = pending
    ? String(pending.configuredStatus || pending.status || "").toUpperCase() !== "ACTIVE"
    : false;

  async function duplicateDraft(campaign: MetaCampaign, publishId: string) {
    if (!businessId || !publishId) {
      toast.error(t("metaCampaigns.actions.noDraftToDuplicate"));
      return;
    }
    setBusyId(campaign.id);
    try {
      const copy = await duplicateLocalCampaignDraft(businessId, publishId);
      toast.success(t("metaCampaigns.actions.duplicateDraftDone"));
      if (copy.publishId) navigate(`${basePath}/edit/${copy.publishId}`);
      else await load();
    } catch (error) {
      const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(message || t("metaCampaigns.actions.noDraftToDuplicate"));
    } finally {
      setBusyId("");
    }
  }

  async function duplicateLive(scope: { level: "campaign" | "adset" | "ad"; id: string; campaignId: string; name?: string }) {
    if (!businessId || !/^\d{8,}$/.test(scope.campaignId)) {
      toast.error(t("metaCampaigns.actions.noDraftToDuplicate"));
      return;
    }
    setBusyId(scope.id);
    try {
      const loaded = await getMetaCampaign(businessId, scope.campaignId, rangeQuery);
      const state = adsManagerStateFromMetaCampaign(loaded.campaign, { currency });
      const copy = duplicateManagerDraft(state, { level: scope.level, id: scope.id });
      const saved = await saveMetaEditorDraft(businessId, {
        localName: copy.campaign.name,
        objective: copy.campaign.objective,
        editorDraft: buildEditorDraft(copy),
      });
      toast.success(t("metaCampaigns.actions.duplicateDraftDone"));
      if (saved.publishId) navigate(`${basePath}/edit/${saved.publishId}`);
    } catch (error) {
      const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
      toast.error(message || t("metaCampaigns.actions.noDraftToDuplicate"));
    } finally {
      setBusyId("");
    }
  }

  const columns = visibleColumns(columnPrefs);
  function updateColumnPrefs(next: ColumnPrefs) {
    setColumnPrefs(next);
    saveColumnPrefs(window.localStorage, businessId || "campaign", "campaign", next);
  }
  function toggleColumnSort(column: ManagerColumnId) {
    if (sortKey === column) setSortDir((dir) => (dir === "desc" ? "asc" : "desc"));
    else {
      setSortKey(column);
      setSortDir(column === "name" ? "asc" : "desc");
    }
  }

  const levelLabel =
    level === "adset" ? t("metaCampaigns.levels.adsets") : level === "ad" ? t("metaCampaigns.levels.ads") : t("metaCampaigns.levels.campaigns");
  const checkedRows = rows.filter((row) => checked.includes(row.id));
  const campaignPlan = bulkStatus ? bulkLivePlan(checkedRows, bulkStatus) : null;

  return (
    <div className="space-y-4" data-testid="meta-campaigns-list">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black">{t("metaCampaigns.nav.campaigns")}</h2>
          <p className="text-sm font-semibold text-slate-500">{t("metaCampaigns.ux.campaignsSubtitle")}</p>
          {!loading ? (
            <p
              className="text-sm font-black text-slate-700"
              data-testid="meta-campaign-count"
              data-count={rows.length}
            >
              {t("metaCampaigns.table.subtitle", { count: rows.length })}
            </p>
          ) : null}
        </div>
        <CreateCampaignButton basePath={basePath} />
      </div>

      <div className="flex flex-col gap-2" data-testid="meta-level-tabs">
        <div className="grid grid-cols-3 gap-1 rounded-xl bg-white p-1 shadow-sm" role="tablist">
          {([
            ["campaign", "metaCampaigns.levels.campaigns"],
            ["adset", "metaCampaigns.levels.adsets"],
            ["ad", "metaCampaigns.levels.ads"],
          ] as const).map(([value, key]) => (
            <button
              key={value}
              type="button"
              role="tab"
              aria-selected={level === value}
              data-testid={`meta-level-tab-${value}`}
              className={`min-h-11 rounded-lg px-2 text-sm font-black ${level === value ? "bg-violet-600 text-white" : "text-slate-600"}`}
              onClick={() => setLevel(value)}
            >
              {t(key)}
            </button>
          ))}
        </div>
        <p className="text-sm font-black text-slate-700" data-testid="meta-level-context">
          {t("metaCampaigns.levels.context", { level: levelLabel })}
          {pinnedCampaign ? ` · ${t("metaCampaigns.levels.selectedCampaign", { name: pinnedCampaign.name })}` : ""}
          {pinnedAdSet ? ` · ${t("metaCampaigns.levels.selectedAdSet", { name: pinnedAdSet.name })}` : ""}
          {compare && comparison ? ` · ${t("metaCampaigns.ranges.compare")}: ${comparison.since} – ${comparison.until}` : ""}
        </p>
        {pinnedCampaign || pinnedAdSet ? (
          <button
            type="button"
            className="self-start text-sm font-black text-violet-700"
            onClick={() => {
              setPinnedCampaign(null);
              setPinnedAdSet(null);
            }}
          >
            {t("metaCampaigns.levels.clearSelection")}
          </button>
        ) : null}
      </div>

      <MetaAdsAnalytics
        businessId={businessId}
        currency={currency}
        rangeQuery={rangeQuery}
        series={series}
        comparisonSeries={comparisonSeries}
        comparisonRange={comparison}
        selectedIds={checked.filter((id) => /^\d{8,}$/.test(id))}
      />

      {level !== "campaign" && businessId ? (
        <MetaAdsLevelPanel
          businessId={businessId}
          level={level}
          currency={currency}
          rangeQuery={rangeQuery}
          campaignId={pinnedCampaign && /^\d{8,}$/.test(pinnedCampaign.id) ? pinnedCampaign.id : undefined}
          adSetId={level === "ad" && pinnedAdSet ? pinnedAdSet.id : undefined}
          onEdit={(row) => navigate(`${basePath}/edit/${row.campaignId || pinnedCampaign?.id || row.id}`)}
          onDuplicate={(row) =>
            void duplicateLive({
              level,
              id: row.id,
              campaignId: row.campaignId || pinnedCampaign?.id || "",
              name: row.name,
            })
          }
          onOpenCampaign={(row) => {
            if (!row.campaignId) return;
            setPinnedCampaign({ id: row.campaignId, name: row.campaignName || row.campaignId });
            setLevel("adset");
          }}
          onOpenAdSet={(row) => {
            setPinnedAdSet({ id: row.id, name: row.name });
            if (row.campaignId) setPinnedCampaign({ id: row.campaignId, name: row.campaignName || row.campaignId });
            setLevel("ad");
          }}
        />
      ) : null}

      {level === "campaign" ? (
      <>
      <div className={`${cardBase} grid gap-2 p-3 sm:grid-cols-2 lg:grid-cols-4`}>
        <input
          className={inputBase}
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t("metaCampaigns.ux.searchCampaigns")}
          aria-label={t("metaCampaigns.ux.searchCampaigns")}
        />
        <select
          className={inputBase}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label={t("metaCampaigns.table.status")}
        >
          <option value="all">{t("metaCampaigns.segments.all")}</option>
          <option value="ACTIVE">{t("metaCampaigns.status.active")}</option>
          <option value="PAUSED">{t("metaCampaigns.status.paused")}</option>
          <option value="DRAFT">{t("metaCampaigns.status.draft")}</option>
          <option value="PENDING_PUBLISH">{t("metaCampaigns.status.pending_publish")}</option>
          <option value="FAILED">{t("metaCampaigns.status.failed")}</option>
        </select>
        <label className="inline-flex items-center gap-2 self-center text-xs font-bold text-slate-600">
          <input
            type="checkbox"
            checked={hideQaDrafts}
            onChange={(event) => setHideQaDrafts(event.target.checked)}
            data-testid="meta-hide-qa-drafts"
          />
          {t("metaCampaigns.ux.hideQaDrafts")}
        </label>
        <p className="self-center text-xs font-black uppercase tracking-wide text-slate-500">
          {t("metaCampaigns.ux.showingRange", { range: t(rangeLabelKey) })}
          {compare && comparison ? ` · ${t("metaCampaigns.ranges.compare")}: ${comparison.since} – ${comparison.until}` : ""}
        </p>
        <select
          className={inputBase}
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as typeof sortKey)}
          aria-label={t("metaCampaigns.ux.sort")}
        >
          <option value="spend">{t("metaCampaigns.table.spend")}</option>
          <option value="results">{t("metaCampaigns.table.results")}</option>
          <option value="impressions">{t("metaCampaigns.table.impressions")}</option>
          <option value="reach">{t("metaCampaigns.table.reach")}</option>
          <option value="cpl">{t("metaCampaigns.kpis.cpl")}</option>
          <option value="name">{t("metaCampaigns.table.name")}</option>
        </select>
      </div>

        {checkedRows.length ? (
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btnSecondary} onClick={() => setBulkStatus("PAUSED")}>{t("metaCampaigns.actions.pause")}</button>
            <button type="button" className={btnSecondary} onClick={() => setBulkStatus("ACTIVE")}>{t("metaCampaigns.actions.resume")}</button>
            <button type="button" className={btnSecondary} data-testid="meta-campaign-bulk-delete" onClick={() => deletion.askMany(checkedRows, "campaign")}>
              {t("metaCampaigns.levels.bulkDelete")}
            </button>
          </div>
        ) : null}
        <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-semibold text-slate-500" data-testid="meta-campaign-insights-synced">
          {insightsError === "rate_limit"
            ? t("metaCampaigns.actions.rateLimited")
            : insightsError
              ? t("metaCampaigns.ux.attentionNoData")
              : t("metaCampaigns.overview.lastSynced", { time: formatDateTimeHe(lastSynced) })}
        </p>
        <button type="button" className={btnSecondary} onClick={() => setColumnsOpen((open) => !open)} data-testid="meta-campaign-columns">
          {t("metaCampaigns.levels.columns")}
        </button>
        <button type="button" className={btnSecondary} onClick={() => void load()} data-testid="meta-campaign-refresh">
          <RefreshCw className="h-4 w-4" />
          {t("metaCampaigns.actions.refresh")}
        </button>
      </div>
      {columnsOpen ? <ManagerColumnMenu prefs={columnPrefs} onChange={updateColumnPrefs} /> : null}

      {loading ? (
        <div className={`${cardBase} space-y-2 p-4`} aria-busy="true">
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-10 animate-pulse rounded-lg bg-slate-100" />
        </div>
      ) : rows.length === 0 ? (
        <div className={`${cardBase} p-8 text-center`}>
          <p className="font-black text-slate-900">{t("metaCampaigns.empty.noCampaignsInRange")}</p>
          <p className="mt-1 text-sm font-semibold text-slate-500">{t("metaCampaigns.ux.emptyCampaignsHint")}</p>
          <div className="mt-4 flex justify-center">
            <CreateCampaignButton basePath={basePath} />
          </div>
        </div>
      ) : (
        <>
        <div className="space-y-3 md:hidden">
          {rows.map((campaign) => {
            const listStatus = campaignListStatus(campaign);
            const delivery = listStatus || campaign.deliveryStatus || campaign.effectiveStatus || campaign.status;
            const tone = statusTone(delivery);
            const canToggleLive = canToggleMetaDelivery(campaign);
            const draftId = campaign.publishRecordId || (campaign.localOnly ? campaign.id : "");
            const editId = campaign.localOnly ? draftId : campaign.id;
            return (
              <article key={campaign.id} className={`${cardBase} space-y-3 p-4`} data-testid={`campaign-row-${campaign.id}`}>
                <button
                  type="button"
                  className="w-full text-start"
                  onClick={() => {
                    setPinnedCampaign({ id: campaign.id, name: campaign.name });
                    setPinnedAdSet(null);
                    setDetails(campaign);
                  }}
                >
                  <p className="break-words font-black text-slate-900">{campaign.name}</p>
                  <p className="text-xs font-semibold text-slate-400">
                    {t(`metaCampaigns.objectives.${objectiveKey(campaign.objective)}`)}
                  </p>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}>
                    {t(`metaCampaigns.status.${metaDeliveryStatusKey(delivery)}`, { defaultValue: delivery })}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {formatDateTimeHe(campaign.localUpdatedAt || campaign.updatedTime)}
                  </span>
                  {campaign.hasUnpublishedChanges ? (
                    <span className="text-xs font-bold text-sky-700">{t("metaCampaigns.adsManager.chrome.unpublishedChanges")}</span>
                  ) : null}
                </div>
                <dl className="grid grid-cols-2 gap-2 text-sm">
                  {columns.filter((column) => column !== "name").map((column) => (
                    <div key={column}>
                      <dt className="text-xs font-semibold text-slate-500">{t(COLUMN_LABEL[column])}</dt>
                      <dd
                        className="font-bold tabular-nums"
                        data-testid={column === "impressions" || column === "reach" ? `campaign-${column}-${campaign.id}` : undefined}
                        title={campaignColumnText(campaign, column, currency) === "—" ? t("metaCampaigns.levels.missingMetric") : undefined}
                      >
                        {column === "status" ? (
                          <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}>
                            {t(`metaCampaigns.status.${metaDeliveryStatusKey(delivery)}`, { defaultValue: delivery })}
                          </span>
                        ) : (
                          campaignColumnText(campaign, column, currency)
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="flex flex-wrap gap-2">
                  <button type="button" className={btnSecondary} onClick={() => setDetails(campaign)}>
                    {t("metaCampaigns.actions.viewDetails")}
                  </button>
                  <button type="button" className={btnSecondary} onClick={() => navigate(`${basePath}/edit/${editId || campaign.id}`)}>
                    {t("metaCampaigns.actions.edit")}
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    disabled={(!(draftId || /^\d{8,}$/.test(campaign.metaCampaignId || campaign.id))) || busyId === campaign.id}
                    onClick={() =>
                      draftId
                        ? void duplicateDraft(campaign, draftId)
                        : void duplicateLive({
                            level: "campaign",
                            id: campaign.metaCampaignId || campaign.id,
                            campaignId: campaign.metaCampaignId || campaign.id,
                            name: campaign.name,
                          })
                    }
                  >
                    {t("metaCampaigns.actions.duplicateDraft")}
                  </button>
                  <button
                    type="button"
                    className={`${btnSecondary} inline-flex min-h-11 min-w-11 items-center justify-center gap-1`}
                    aria-label={t("metaCampaigns.actions.deleteCampaign")}
                    data-testid={`meta-campaign-delete-${campaign.id}`}
                    disabled={deletion.busy}
                    onClick={() => deletion.ask(campaign)}
                  >
                    <Trash2 className="h-4 w-4" />
                    {t("metaCampaigns.actions.delete")}
                  </button>
                  {canToggleLive ? (
                    <button type="button" className={btnPrimary} onClick={() => setPending(campaign)}>
                      {listStatus === "ACTIVE" ? t("metaCampaigns.actions.pause") : t("metaCampaigns.actions.resume")}
                    </button>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
        <div className={`${cardBase} hidden overflow-x-auto md:block`}>
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-xs font-black uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">
                  <input
                    type="checkbox"
                    aria-label={t("metaCampaigns.levels.selectAll")}
                    checked={rows.length > 0 && rows.every((row) => checked.includes(row.id))}
                    onChange={() =>
                      setChecked((current) =>
                        rows.every((row) => current.includes(row.id)) ? [] : selectVisible(rows.map((row) => row.id))
                      )
                    }
                  />
                </th>
                {columns.map((column) => (
                  <th key={column} className="relative px-3 py-3 text-start" style={{ minWidth: columnPrefs.widths[column] || 120 }}>
                    <button type="button" className="font-black" onClick={() => toggleColumnSort(column)}>
                      {t(COLUMN_LABEL[column])}
                    </button>
                    <span
                      role="separator"
                      aria-orientation="vertical"
                      className="absolute inset-y-0 end-0 w-1 cursor-col-resize"
                      onMouseDown={(event) => beginColumnResize(event, column, columnPrefs, updateColumnPrefs)}
                    />
                  </th>
                ))}
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((campaign) => {
                const listStatus = campaignListStatus(campaign);
                const delivery = listStatus || campaign.deliveryStatus || campaign.effectiveStatus || campaign.status;
                const tone = statusTone(delivery);
                const canToggleLive = canToggleMetaDelivery(campaign);
                const draftId = campaign.publishRecordId || (campaign.localOnly ? campaign.id : "");
                const editId = campaign.localOnly ? draftId : campaign.id;
                return (
                  <tr key={campaign.id} className="border-t border-slate-100" data-testid={`campaign-row-${campaign.id}`}>
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        aria-label={campaign.name}
                        checked={checked.includes(campaign.id)}
                        onChange={() => setChecked((current) => toggleSelected(current, campaign.id))}
                      />
                    </td>
                    {columns.map((column) => {
                      const text = campaignColumnText(campaign, column, currency);
                      return (
                        <td
                          key={column}
                          className="whitespace-nowrap px-3 py-3 font-bold tabular-nums"
                          style={{ minWidth: columnPrefs.widths[column] || 120 }}
                          data-testid={column === "impressions" || column === "reach" ? `campaign-${column}-${campaign.id}` : undefined}
                          title={text === "—" ? t("metaCampaigns.levels.missingMetric") : undefined}
                        >
                          {column === "name" ? (
                            <>
                              <button
                                type="button"
                                className="text-start font-black text-slate-900"
                                onClick={() => {
                                  setPinnedCampaign({ id: campaign.id, name: campaign.name });
                                  setPinnedAdSet(null);
                                  setDetails(campaign);
                                }}
                              >
                                {campaign.name}
                              </button>
                              <p className="text-xs font-semibold text-slate-400">
                                {t(`metaCampaigns.objectives.${objectiveKey(campaign.objective)}`)}
                              </p>
                            </>
                          ) : column === "status" ? (
                            <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}>
                              {t(`metaCampaigns.status.${metaDeliveryStatusKey(delivery)}`, { defaultValue: delivery })}
                            </span>
                          ) : column === "updated" ? (
                            <div className="text-xs font-semibold text-slate-500">
                              <div>{text}</div>
                              {campaign.hasUnpublishedChanges ? (
                                <div className="font-bold text-sky-700">{t("metaCampaigns.adsManager.chrome.unpublishedChanges")}</div>
                              ) : null}
                            </div>
                          ) : (
                            text
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        <button type="button" className={btnSecondary} aria-label={t("metaCampaigns.actions.viewDetails")} onClick={() => setDetails(campaign)}>
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={btnSecondary}
                          aria-label={t("metaCampaigns.actions.edit")}
                          onClick={() => navigate(`${basePath}/edit/${editId || campaign.id}`)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={btnSecondary}
                          aria-label={t("metaCampaigns.actions.duplicateDraft")}
                          disabled={(!(draftId || /^\d{8,}$/.test(campaign.metaCampaignId || campaign.id))) || busyId === campaign.id}
                          onClick={() =>
                            draftId
                              ? void duplicateDraft(campaign, draftId)
                              : void duplicateLive({
                                  level: "campaign",
                                  id: campaign.metaCampaignId || campaign.id,
                                  campaignId: campaign.metaCampaignId || campaign.id,
                                  name: campaign.name,
                                })
                          }
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          className={`${btnSecondary} inline-flex min-h-11 min-w-11 items-center justify-center`}
                          aria-label={t("metaCampaigns.actions.deleteCampaign")}
                          data-testid={`meta-campaign-delete-${campaign.id}`}
                          disabled={deletion.busy}
                          onClick={() => deletion.ask(campaign)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                        {canToggleLive ? (
                          <button type="button" className={btnPrimary} onClick={() => setPending(campaign)}>
                            {listStatus === "ACTIVE" ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                            {listStatus === "ACTIVE" ? t("metaCampaigns.actions.pause") : t("metaCampaigns.actions.resume")}
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
        </>
      )}

      </>
      ) : null}

      {details && businessId ? (
        <MetaCampaignDetailsDrawer
          open
          businessId={businessId}
          campaign={details}
          currency={currency}
          rangeQuery={rangeQuery}
          rangeLabel={t(rangeLabelKey)}
          canEdit
          onClose={() => setDetails(null)}
          onOpenEdit={(id) => navigate(`${basePath}/edit/${id}`)}
          onChanged={() => void load()}
        />
      ) : null}

      <MetaCampaignDeleteDialog
        campaign={deletion.target as (MetaCampaign & { name: string }) | null}
        targets={deletion.targets}
        level={deletion.level}
        busy={deletion.busy}
        error={deletion.error}
        onClose={deletion.close}
        onConfirm={() => void deletion.confirm()}
      />

      {pending ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true">
          <div className={`${cardBase} w-full max-w-md p-5`}>
            <h3 className="text-lg font-black">
              {activate ? t("metaCampaigns.actions.confirmResumeTitle") : t("metaCampaigns.actions.confirmPauseTitle")}
            </h3>
            {activate ? (
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {t("metaCampaigns.ux.activateSpend", {
                  name: pending.name,
                  budget: pending.dailyBudget || 0,
                })}
              </p>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-600">
                {t("metaCampaigns.actions.confirmPauseBody", { name: pending.name })}
              </p>
            )}
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className={`${btnSecondary} w-full sm:w-auto`} onClick={() => setPending(null)}>
                {t("common.cancel", { defaultValue: "Cancel" })}
              </button>
              <button
                type="button"
                className={`${btnPrimary} w-full sm:w-auto`}
                disabled={Boolean(busyId)}
                onClick={async () => {
                  if (!businessId) return;
                  const next = activate ? "ACTIVE" : "PAUSED";
                  setBusyId(pending.id);
                  try {
                    await setMetaCampaignStatus(
                      businessId,
                      pending.id,
                      next,
                      next === "ACTIVE" ? { confirmActivate: true } : undefined
                    );
                    setPending(null);
                    await load();
                  } catch (error) {
                    const message = (error as { response?: { data?: { error?: string } } })
                      ?.response?.data?.error;
                    toast.error(message || t("metaCampaigns.errors.updateStatus"));
                  } finally {
                    setBusyId("");
                  }
                }}
              >
                {busyId ? <Loader2 className="h-4 w-4 animate-spin" /> : activate ? t("metaCampaigns.actions.resume") : t("metaCampaigns.actions.pause")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
      {campaignPlan ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true">
          <div className={`${cardBase} w-full max-w-md space-y-3 p-5`}>
            <h3 className="text-lg font-black">{t("metaCampaigns.levels.bulkTitle", { count: campaignPlan.count })}</h3>
            <p className="text-sm font-semibold text-slate-600">
              {t("metaCampaigns.levels.bulkBody", {
                action: campaignPlan.next === "ACTIVE" ? t("metaCampaigns.actions.resume") : t("metaCampaigns.actions.pause"),
                names: campaignPlan.names.join(", "),
              })}
            </p>
            {campaignPlan.changesLiveDelivery ? <p className="text-sm font-black text-amber-800">{t("metaCampaigns.levels.bulkLive")}</p> : null}
            <div className="flex justify-end gap-2">
              <button type="button" className={btnSecondary} onClick={() => setBulkStatus(null)}>{t("common.cancel", { defaultValue: "ביטול" })}</button>
              <button
                type="button"
                className={btnPrimary}
                data-testid="meta-campaign-bulk-confirm"
                disabled={Boolean(busyId) || campaignPlan.count === 0}
                onClick={async () => {
                  if (!businessId) return;
                  setBusyId("bulk");
                  const result = await runBulkStatus(checkedRows, campaignPlan.next, async (id) => {
                    await setMetaCampaignStatus(
                      businessId,
                      id,
                      campaignPlan.next,
                      campaignPlan.next === "ACTIVE" ? { confirmActivate: true } : undefined
                    );
                  });
                  setBusyId("");
                  setBulkStatus(null);
                  setChecked([]);
                  if (result.failed.length) {
                    toast.error(t("metaCampaigns.levels.bulkPartial", { names: result.failed.map((row) => row.name).join(", ") }));
                  }
                  await load();
                }}
              >
                {t("metaCampaigns.levels.bulkConfirm")}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
