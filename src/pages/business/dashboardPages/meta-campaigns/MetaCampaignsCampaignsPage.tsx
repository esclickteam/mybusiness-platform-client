import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Copy, Eye, Loader2, Pause, Pencil, Play, Trash2 } from "lucide-react";
import {
  deleteLocalCampaignDraft,
  duplicateLocalCampaignDraft,
  getMetaCampaignsOverview,
  setMetaCampaignStatus,
  type MetaCampaign,
} from "../../../../api/metaCampaignsApi";
import { btnPrimary, btnSecondary, cardBase, inputBase } from "../../../../styles/bizuplyUi";
import { toast } from "react-toastify";
import MetaCampaignDetailsDrawer from "./MetaCampaignDetailsDrawer";
import CreateCampaignButton from "./CreateCampaignButton";
import { metaAdsFriendlyMessage } from "./metaAdsFriendlyError";
import {
  formatCurrency,
  formatDateTimeHe,
  formatMetricOrDash,
  formatNumber,
  formatPercent,
  metaDeliveryStatusKey,
  resolveCampaignCurrency,
  statusTone,
} from "./metaCampaignUtils";
import { useMetaAdsDateRange } from "./useMetaAdsDateRange";

type OutletCtx = { businessId: string | null };

function campaignListStatus(campaign: MetaCampaign) {
  const raw = String(campaign.configuredStatus || campaign.status || "").toUpperCase();
  if (campaign.publishFailed || raw === "FAILED" || raw === "PARTIAL_FAILED") return "FAILED";
  if (campaign.localOnly || raw === "DRAFT") return "DRAFT";
  if (campaign.hasUnpublishedChanges) return "PENDING_PUBLISH";
  return raw;
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
  const { query: rangeQuery, labelKey: rangeLabelKey } = useMetaAdsDateRange();
  const [sortKey, setSortKey] = useState<"name" | "spend" | "results" | "cpl">("spend");
  const [details, setDetails] = useState<MetaCampaign | null>(null);
  const [pending, setPending] = useState<MetaCampaign | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MetaCampaign | null>(null);
  const [busyId, setBusyId] = useState("");

  async function load() {
    if (!businessId) return;
    setLoading(true);
    try {
      const data = await getMetaCampaignsOverview(businessId, rangeQuery);
      setCampaigns(data.campaigns || []);
      setCurrency(resolveCampaignCurrency(data.connection?.selectedAdAccount?.currency));
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
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, rangeQuery.datePreset, rangeQuery.days, rangeQuery.since, rangeQuery.until]);

  const rows = useMemo(() => {
    const filtered = campaigns.filter((row) => {
      const hay = `${row.name || ""}`.toLowerCase();
      if (query && !hay.includes(query.toLowerCase())) return false;
      const status = campaignListStatus(row);
      if (statusFilter !== "all" && status !== statusFilter) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const aDraft = campaignListStatus(a) === "DRAFT" ? 1 : 0;
      const bDraft = campaignListStatus(b) === "DRAFT" ? 1 : 0;
      if (aDraft !== bDraft) return bDraft - aDraft;
      if (sortKey === "name") return String(a.name).localeCompare(String(b.name));
      const av =
        sortKey === "spend"
          ? Number(a.metrics?.spend || 0)
          : sortKey === "results"
            ? Number(a.metrics?.results || a.metrics?.leads || 0)
            : Number(a.metrics?.costPerResult || a.metrics?.costPerLead || 0);
      const bv =
        sortKey === "spend"
          ? Number(b.metrics?.spend || 0)
          : sortKey === "results"
            ? Number(b.metrics?.results || b.metrics?.leads || 0)
            : Number(b.metrics?.costPerResult || b.metrics?.costPerLead || 0);
      return bv - av;
    });
  }, [campaigns, query, sortKey, statusFilter]);

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

  return (
    <div className="space-y-4" data-testid="meta-campaigns-list">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-black">{t("metaCampaigns.nav.campaigns")}</h2>
          <p className="text-sm font-semibold text-slate-500">{t("metaCampaigns.ux.campaignsSubtitle")}</p>
        </div>
        <CreateCampaignButton basePath={basePath} />
      </div>

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
        <p className="self-center text-xs font-black uppercase tracking-wide text-slate-500">
          {t("metaCampaigns.ux.showingRange", { range: t(rangeLabelKey) })}
        </p>
        <select
          className={inputBase}
          value={sortKey}
          onChange={(event) => setSortKey(event.target.value as typeof sortKey)}
          aria-label={t("metaCampaigns.ux.sort")}
        >
          <option value="spend">{t("metaCampaigns.table.spend")}</option>
          <option value="results">{t("metaCampaigns.table.results")}</option>
          <option value="cpl">{t("metaCampaigns.kpis.cpl")}</option>
          <option value="name">{t("metaCampaigns.table.name")}</option>
        </select>
      </div>

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
            const results = campaign.metrics?.results ?? campaign.metrics?.leads;
            const cpl = campaign.metrics?.costPerResult ?? campaign.metrics?.costPerLead;
            const canToggleLive = !campaign.localOnly && listStatus !== "DRAFT";
            const draftId = campaign.publishRecordId || (campaign.localOnly ? campaign.id : "");
            const editId = campaign.localOnly ? draftId : campaign.id;
            return (
              <article key={campaign.id} className={`${cardBase} space-y-3 p-4`}>
                <button type="button" className="w-full text-start" onClick={() => setDetails(campaign)}>
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
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">{t("metaCampaigns.table.budget")}</dt>
                    <dd className="font-bold">{campaign.dailyBudget ? formatCurrency(campaign.dailyBudget, currency) : "—"}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">{t("metaCampaigns.table.spend")}</dt>
                    <dd className="font-bold">
                      {formatMetricOrDash(campaign.metrics?.spend, (n) => formatCurrency(n, currency), {
                        treatZeroAsEmpty: true,
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">{t("metaCampaigns.table.results")}</dt>
                    <dd className="font-bold">{formatMetricOrDash(results, formatNumber, { treatZeroAsEmpty: true })}</dd>
                  </div>
                  <div>
                    <dt className="text-xs font-semibold text-slate-500">{t("metaCampaigns.kpis.cpl")}</dt>
                    <dd className="font-bold">
                      {formatMetricOrDash((results || 0) > 0 ? cpl : null, (n) => formatCurrency(n, currency))}
                    </dd>
                  </div>
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
                    disabled={!draftId || busyId === campaign.id}
                    onClick={() => void duplicateDraft(campaign, draftId)}
                  >
                    {t("metaCampaigns.actions.duplicateDraft")}
                  </button>
                  {campaign.localOnly ? (
                    <button type="button" className={btnSecondary} onClick={() => setDeleteTarget(campaign)}>
                      {t("metaCampaigns.actions.deleteDraft")}
                    </button>
                  ) : null}
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
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.name")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.status")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.budget")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.spend")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.results")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.kpis.cpl")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.ctr")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.ux.lastUpdatedLabel")}</th>
                <th className="px-3 py-3 text-start">{t("metaCampaigns.table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((campaign) => {
                const listStatus = campaignListStatus(campaign);
                const delivery = listStatus || campaign.deliveryStatus || campaign.effectiveStatus || campaign.status;
                const tone = statusTone(delivery);
                const results = campaign.metrics?.results ?? campaign.metrics?.leads;
                const cpl = campaign.metrics?.costPerResult ?? campaign.metrics?.costPerLead;
                const canToggleLive = !campaign.localOnly && listStatus !== "DRAFT";
                const draftId = campaign.publishRecordId || (campaign.localOnly ? campaign.id : "");
                const editId = campaign.localOnly ? draftId : campaign.id;
                return (
                  <tr key={campaign.id} className="border-t border-slate-100">
                    <td className="px-3 py-3">
                      <button type="button" className="text-start font-black text-slate-900" onClick={() => setDetails(campaign)}>
                        {campaign.name}
                      </button>
                      <p className="text-xs font-semibold text-slate-400">
                        {t(`metaCampaigns.objectives.${objectiveKey(campaign.objective)}`)}
                      </p>
                    </td>
                    <td className="px-3 py-3">
                      <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}>
                        {t(`metaCampaigns.status.${metaDeliveryStatusKey(delivery)}`, { defaultValue: delivery })}
                      </span>
                    </td>
                    <td className="px-3 py-3 font-bold">
                      {campaign.dailyBudget ? formatCurrency(campaign.dailyBudget, currency) : "—"}
                    </td>
                    <td className="px-3 py-3 font-bold">
                      {formatMetricOrDash(campaign.metrics?.spend, (n) => formatCurrency(n, currency), {
                        treatZeroAsEmpty: true,
                      })}
                    </td>
                    <td className="px-3 py-3 font-bold">{formatMetricOrDash(results, formatNumber, { treatZeroAsEmpty: true })}</td>
                    <td className="px-3 py-3 font-bold">
                      {formatMetricOrDash((results || 0) > 0 ? cpl : null, (n) => formatCurrency(n, currency))}
                    </td>
                    <td className="px-3 py-3 font-bold">
                      {formatMetricOrDash(campaign.metrics?.ctr, (n) => formatPercent(n), { treatZeroAsEmpty: true })}
                    </td>
                    <td className="px-3 py-3 text-xs font-semibold text-slate-500">
                      <div>{formatDateTimeHe(campaign.localUpdatedAt || campaign.updatedTime)}</div>
                      {campaign.hasUnpublishedChanges ? (
                        <div className="font-bold text-sky-700">{t("metaCampaigns.adsManager.chrome.unpublishedChanges")}</div>
                      ) : null}
                    </td>
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
                          disabled={!draftId || busyId === campaign.id}
                          onClick={() => void duplicateDraft(campaign, draftId)}
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        {campaign.localOnly ? (
                          <button
                            type="button"
                            className={btnSecondary}
                            aria-label={t("metaCampaigns.actions.deleteDraft")}
                            onClick={() => setDeleteTarget(campaign)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        ) : null}
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

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-slate-900/40 p-4" role="dialog" aria-modal="true">
          <div className={`${cardBase} w-full max-w-md p-5`}>
            <h3 className="text-lg font-black">{t("metaCampaigns.actions.confirmDeleteDraftTitle")}</h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {t("metaCampaigns.actions.confirmDeleteDraftBody", { name: deleteTarget.name })}
            </p>
            <div className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button type="button" className={`${btnSecondary} w-full sm:w-auto`} onClick={() => setDeleteTarget(null)}>
                {t("common.cancel", { defaultValue: "Cancel" })}
              </button>
              <button
                type="button"
                className={`${btnPrimary} w-full sm:w-auto`}
                disabled={Boolean(busyId)}
                onClick={async () => {
                  if (!businessId) return;
                  const publishId = deleteTarget.publishRecordId || deleteTarget.id;
                  setBusyId(deleteTarget.id);
                  try {
                    await deleteLocalCampaignDraft(businessId, publishId);
                    setDeleteTarget(null);
                    toast.success(t("metaCampaigns.actions.draftDeleted"));
                    await load();
                  } catch (error) {
                    const message = (error as { response?: { data?: { error?: string } } })?.response?.data?.error;
                    toast.error(message || t("metaCampaigns.errors.updateStatus"));
                  } finally {
                    setBusyId("");
                  }
                }}
              >
                {busyId ? <Loader2 className="h-4 w-4 animate-spin" /> : t("metaCampaigns.actions.deleteDraft")}
              </button>
            </div>
          </div>
        </div>
      ) : null}

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
    </div>
  );
}
