import React, { useEffect, useMemo, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  CheckCircle2,
  Eye,
  Facebook,
  Instagram,
  Lightbulb,
  Loader2,
  Pause,
  Pencil,
  Play,
  Plus,
  RefreshCw,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  Wallet,
  Workflow,
  X,
} from "lucide-react";
import {
  getMetaCampaignsOverview,
  selectMetaAdAccount,
  setMetaCampaignStatus,
  type MetaCampaign,
  type MetaCampaignInsight,
  type MetaCampaignsOverview,
} from "../../../../api/metaCampaignsApi";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import {
  DATE_RANGE_OPTIONS,
  daysAgoIso,
  formatAdAccountLabel,
  formatCurrency,
  formatDateHe,
  formatDateTimeHe,
  formatMetricOrDash,
  formatNumber,
  formatPercent,
  formatRoas,
  resolveAdAccountId,
  resolveMetaAccountStatus,
  resolveMetaDateRangeQuery,
  SEGMENT_OPTIONS,
  statusTone,
  todayIso,
  type MetaDateRangePreset,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };

const APP_REVIEW_CAPTIONS = [
  "The user selects a Meta ad account they own or have authorized access to.",
  "Bizuply retrieves campaigns and performance insights from the selected Meta ad account using the ads_read permission.",
  "The user can refresh the data and select a reporting date range.",
  "The dashboard displays campaign spend, leads, cost per lead, reach, impressions and other performance metrics.",
  "The user can open a campaign to review its details in read-only mode.",
] as const;

const CAPTIONS_STORAGE_KEY = "bizuply_meta_ads_review_captions_hidden";

function KpiCard({
  label,
  value,
  hint,
  trend,
  trendPositive,
  progress,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  trendPositive?: boolean;
  progress?: number;
}) {
  return (
    <div className={`${cardBase} relative overflow-hidden p-4`}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-l from-violet-50/80 via-sky-50/40 to-transparent"
      />
      <div className="relative">
        <p className="text-xs font-bold text-slate-500">{label}</p>
        <p className="mt-2 text-2xl font-black tracking-tight text-slate-900">
          {value}
        </p>
        {typeof progress === "number" ? (
          <div className="mt-3">
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-l from-violet-500 to-sky-500 transition-all"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
            {hint ? (
              <p className="mt-2 text-xs font-semibold text-slate-500">{hint}</p>
            ) : null}
          </div>
        ) : trend ? (
          <p
            className={[
              "mt-2 inline-flex items-center gap-1 text-xs font-bold",
              trendPositive ? "text-emerald-600" : "text-rose-600",
            ].join(" ")}
          >
            {trendPositive ? (
              <TrendingUp className="h-3.5 w-3.5" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5" />
            )}
            {trend}
          </p>
        ) : hint ? (
          <p className="mt-2 text-xs font-semibold text-slate-500">{hint}</p>
        ) : null}
      </div>
    </div>
  );
}

function InsightCard({ item }: { item: MetaCampaignInsight }) {
  const tone =
    item.tone === "success"
      ? "border-emerald-100 bg-emerald-50/70 text-emerald-800"
      : item.tone === "warning"
        ? "border-amber-100 bg-amber-50/70 text-amber-900"
        : "border-sky-100 bg-sky-50/70 text-sky-900";

  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <div className="flex items-start gap-2">
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
        <div className="min-w-0">
          <p className="text-sm font-black">{item.title}</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed opacity-90">
            {item.body}
          </p>
        </div>
      </div>
    </div>
  );
}

function PlatformIcons({ objective }: { objective: string }) {
  const value = objective.toUpperCase();
  const showIg = value.includes("ENGAGEMENT") || value.includes("AWARENESS");
  return (
    <div className="flex items-center gap-1.5 text-slate-500">
      <Facebook className="h-4 w-4 text-[#1877F2]" />
      {showIg ? <Instagram className="h-4 w-4 text-[#E4405F]" /> : null}
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-3 border-b border-slate-100 py-2.5 last:border-b-0">
      <dt className="text-xs font-bold text-slate-500">{label}</dt>
      <dd className="text-sm font-black text-slate-900 break-words">{value}</dd>
    </div>
  );
}

function isPermissionError(error: any) {
  const status = Number(error?.response?.status || 0);
  const message = String(
    error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message ||
      ""
  ).toLowerCase();
  return (
    status === 401 ||
    status === 403 ||
    message.includes("permission") ||
    message.includes("oauth") ||
    message.includes("access token") ||
    message.includes("(#190)") ||
    message.includes("session has expired")
  );
}

export default function MetaCampaignsOverviewTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const basePath = `/business/${urlBusinessId || businessId}/dashboard/meta-campaigns`;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [switchingAccount, setSwitchingAccount] = useState(false);
  const [rangePreset, setRangePreset] = useState<MetaDateRangePreset>("last_30");
  const [customSince, setCustomSince] = useState("");
  const [customUntil, setCustomUntil] = useState("");
  const [segment, setSegment] = useState("all");
  const [data, setData] = useState<MetaCampaignsOverview | null>(null);
  const [busyId, setBusyId] = useState("");
  const [lastUpdatedAt, setLastUpdatedAt] = useState<Date | null>(null);
  const [loadError, setLoadError] = useState<"permission" | "generic" | null>(
    null
  );
  const [detailsCampaign, setDetailsCampaign] = useState<MetaCampaign | null>(
    null
  );
  const [showCaptions, setShowCaptions] = useState(() => {
    try {
      return sessionStorage.getItem(CAPTIONS_STORAGE_KEY) !== "1";
    } catch {
      return true;
    }
  });
  const [captionIndex, setCaptionIndex] = useState(0);

  const currency = data?.connection?.selectedAdAccount?.currency || "ILS";
  const selectedAccount = data?.connection?.selectedAdAccount || null;
  const adAccounts = data?.connection?.adAccounts || [];
  const selectedAccountId = selectedAccount?.id || "";
  const accountIdDisplay = resolveAdAccountId(selectedAccount);
  const accountMeta = adAccounts.find((a) => a.id === selectedAccountId);
  const accountStatus = resolveMetaAccountStatus(
    accountMeta?.accountStatus ?? selectedAccount?.accountStatus
  );
  const accountStatusLabel = t(
    `metaCampaigns.accountStatus.${accountStatus.key}`,
    { defaultValue: accountStatus.labelEn }
  );

  const rangeQuery = useMemo(
    () =>
      resolveMetaDateRangeQuery(rangePreset, {
        since: customSince,
        until: customUntil,
      }),
    [rangePreset, customSince, customUntil]
  );

  const load = async (options?: { silent?: boolean; successToast?: boolean }) => {
    if (!businessId) return;
    const silent = Boolean(options?.silent);
    if (silent) setRefreshing(true);
    else setLoading(true);
    setLoadError(null);
    try {
      const overview = await getMetaCampaignsOverview(businessId, rangeQuery);
      setData(overview);
      setLastUpdatedAt(new Date());
      if (options?.successToast) {
        toast.success(t("metaCampaigns.toasts.overviewRefreshed"));
      }
    } catch (error: any) {
      if (isPermissionError(error)) {
        setLoadError("permission");
        toast.error(t("metaCampaigns.errors.permissionRead"));
      } else {
        setLoadError("generic");
        toast.error(
          error?.response?.data?.error ||
            error?.response?.data?.message ||
            t("metaCampaigns.errors.loadOverview")
        );
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (rangePreset === "custom" && (!customSince || !customUntil)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, rangePreset, customSince, customUntil]);

  useEffect(() => {
    if (!showCaptions) return;
    const timer = window.setInterval(() => {
      setCaptionIndex((prev) => (prev + 1) % APP_REVIEW_CAPTIONS.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [showCaptions]);

  const campaigns = useMemo(() => {
    const list = data?.campaigns || [];
    if (segment === "all") return list;
    return list.filter((campaign) => {
      const objective = String(campaign.objective || "").toUpperCase();
      if (segment === "leads") return objective.includes("LEAD");
      if (segment === "sales")
        return (
          objective.includes("SALES") ||
          objective.includes("PURCHASE") ||
          objective.includes("CONVERSION")
        );
      if (segment === "traffic")
        return objective.includes("TRAFFIC") || objective.includes("LINK");
      if (segment === "awareness")
        return objective.includes("AWARENESS") || objective.includes("REACH");
      if (segment === "engagement") return objective.includes("ENGAGEMENT");
      return true;
    });
  }, [data?.campaigns, segment]);

  const kpis = data?.kpis;
  const hasInsightSignal = Boolean(
    (kpis?.spend || 0) > 0 ||
      (kpis?.leads || 0) > 0 ||
      (kpis?.impressions || 0) > 0 ||
      (kpis?.clicks || 0) > 0 ||
      (kpis?.reach || 0) > 0
  );

  const chartSeries = data?.series || [];
  const chartHasData = chartSeries.some(
    (point) =>
      (point.leads || 0) > 0 ||
      (point.spend || 0) > 0 ||
      (point.clicks || 0) > 0 ||
      (point.impressions || 0) > 0
  );

  const showChartLeads = segment === "all" || segment === "leads";
  const showChartSpend =
    segment === "all" ||
    segment === "leads" ||
    segment === "sales" ||
    segment === "traffic";
  const showChartClicks =
    segment === "all" ||
    segment === "sales" ||
    segment === "traffic" ||
    segment === "engagement";
  const showChartImpressions =
    segment === "awareness" || segment === "engagement" || segment === "traffic";

  const connected = Boolean(data?.connection?.connected);
  const tokenLinked = Boolean(
    data?.connection?.isConnected && data?.connection?.hasAccessToken
  );

  const onAccountChange = async (nextId: string) => {
    if (!businessId || !nextId || nextId === selectedAccountId) return;
    try {
      setSwitchingAccount(true);
      await selectMetaAdAccount(businessId, nextId);
      toast.success(t("metaCampaigns.toasts.accountSelected"));
      await load({ silent: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.selectAccount")
      );
    } finally {
      setSwitchingAccount(false);
    }
  };

  const toggleStatus = async (campaign: MetaCampaign) => {
    if (!businessId) return;
    const configured = String(
      campaign.configuredStatus || campaign.status || ""
    ).toUpperCase();
    const next = configured === "ACTIVE" ? "PAUSED" : "ACTIVE";
    try {
      setBusyId(campaign.id);
      await setMetaCampaignStatus(businessId, campaign.id, next);
      toast.success(
        next === "ACTIVE"
          ? t("metaCampaigns.toasts.activated")
          : t("metaCampaigns.toasts.paused")
      );
      await load({ silent: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.updateStatus")
      );
    } finally {
      setBusyId("");
    }
  };

  const hideCaptions = () => {
    setShowCaptions(false);
    try {
      sessionStorage.setItem(CAPTIONS_STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
        <BizuplyLoader />
        <p className="text-sm font-bold text-slate-500">
          {t("metaCampaigns.empty.loadingFromMeta")}
        </p>
      </div>
    );
  }

  if (loadError === "permission") {
    return (
      <div className={`${cardBase} p-6 sm:p-8`}>
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-xl font-black text-slate-900">
            {t("metaCampaigns.empty.permissionTitle")}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.empty.permissionBody")}
          </p>
          <Link to={`${basePath}/settings`} className={`${btnPrimary} mt-5`}>
            {t("metaCampaigns.empty.connectCta")}
          </Link>
        </div>
      </div>
    );
  }

  if (!tokenLinked || !connected) {
    return (
      <div className={`${cardBase} p-6 sm:p-8`}>
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-violet-700">
            <Target className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-900">
            {t("metaCampaigns.empty.notConnectedTitle")}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.empty.notConnectedBody")}
          </p>
          <Link to={`${basePath}/settings`} className={`${btnPrimary} mt-5`}>
            {t("metaCampaigns.empty.connectCta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("metaCampaigns.overview.heading")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.overview.subheading")}
          </p>
          {lastUpdatedAt ? (
            <p className="mt-1 text-xs font-bold text-slate-400">
              {t("metaCampaigns.overview.lastUpdated", {
                time: formatDateTimeHe(lastUpdatedAt),
              })}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => load({ silent: true, successToast: true })}
            className={btnSecondary}
            disabled={refreshing || switchingAccount}
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {t("metaCampaigns.actions.refresh")}
          </button>
          <Link to={`${basePath}/create`} className={btnPrimary}>
            <Plus className="h-4 w-4" />
            {t("metaCampaigns.actions.create")}
          </Link>
        </div>
      </div>

      <div className={`${cardBase} p-4`}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Facebook className="h-4 w-4 text-[#1877F2]" />
              <p className="text-base font-black text-slate-900">
                {selectedAccount?.name || t("metaCampaigns.overview.account")}
                {selectedAccount?.currency
                  ? ` (${selectedAccount.currency})`
                  : ""}
              </p>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700">
                <CheckCircle2 className="h-3 w-3" />
                {t("metaCampaigns.overview.connectedThroughMeta")}
              </span>
            </div>
            <p className="text-sm font-bold text-slate-600 tabular-nums">
              {t("metaCampaigns.overview.adAccountId", {
                id: accountIdDisplay || "—",
              })}
            </p>
            <p className="text-sm font-bold text-slate-600">
              {t("metaCampaigns.overview.accountStatusLabel", {
                status: accountStatusLabel,
              })}
            </p>
            {selectedAccount?.currency ? (
              <p className="text-xs font-semibold text-slate-500">
                {t("metaCampaigns.overview.currencyLabel", {
                  currency: selectedAccount.currency,
                })}
              </p>
            ) : null}
          </div>

          {adAccounts.length > 1 ? (
            <label className="block min-w-[240px]">
              <span className="mb-1.5 block text-xs font-black text-slate-500">
                {t("metaCampaigns.overview.switchAccount")}
              </span>
              <select
                className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-violet-200 focus:ring-2 focus:ring-violet-100"
                value={selectedAccountId}
                disabled={switchingAccount || refreshing}
                onChange={(e) => onAccountChange(e.target.value)}
              >
                {adAccounts.map((account) => (
                  <option key={account.id} value={account.id}>
                    {formatAdAccountLabel(account)}
                  </option>
                ))}
              </select>
            </label>
          ) : null}
        </div>
        {(refreshing || switchingAccount) && (
          <p className="mt-3 inline-flex items-center gap-2 text-xs font-bold text-violet-700">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            {t("metaCampaigns.empty.loadingFromMeta")}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={t("metaCampaigns.kpis.spend")}
          value={formatMetricOrDash(kpis?.spend, (n) =>
            formatCurrency(n, currency)
          , { treatZeroAsEmpty: !hasInsightSignal })}
          hint={t("metaCampaigns.kpis.spendHint")}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.leads")}
          value={formatMetricOrDash(kpis?.leads, formatNumber, {
            treatZeroAsEmpty: !hasInsightSignal,
          })}
          hint={t("metaCampaigns.kpis.leadsHint")}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.cpl")}
          value={formatMetricOrDash(
            (kpis?.leads || 0) > 0 ? kpis?.costPerLead : null,
            (n) => formatCurrency(n, currency)
          )}
          hint={t("metaCampaigns.kpis.cplHint")}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.roas")}
          value={formatMetricOrDash(kpis?.roas, formatRoas, {
            treatZeroAsEmpty: true,
          })}
          hint={t("metaCampaigns.kpis.roasHint")}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-4 min-w-0">
          <div className={`${cardBase} p-4`}>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.chart.title")}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.chart.subtitle")}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={rangePreset}
                  onChange={(e) => {
                    const next = e.target.value as MetaDateRangePreset;
                    if (next === "custom") {
                      setCustomSince((prev) => prev || daysAgoIso(29));
                      setCustomUntil((prev) => prev || todayIso());
                    }
                    setRangePreset(next);
                  }}
                  disabled={refreshing}
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none focus:border-violet-200 focus:ring-2 focus:ring-violet-100"
                >
                  {DATE_RANGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {t(option.labelKey)}
                    </option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1">
                  {SEGMENT_OPTIONS.map((option) => {
                    const active = segment === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setSegment(option.value)}
                        className={[
                          "rounded-lg px-2.5 py-1.5 text-xs font-black transition",
                          active
                            ? "bg-violet-100 text-violet-800"
                            : "bg-slate-50 text-slate-500 hover:bg-slate-100",
                        ].join(" ")}
                      >
                        {t(option.labelKey)}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {rangePreset === "custom" ? (
              <div className="mt-3 flex flex-wrap items-end gap-2">
                <label className="block">
                  <span className="mb-1 block text-[11px] font-black text-slate-500">
                    {t("metaCampaigns.ranges.since")}
                  </span>
                  <input
                    type="date"
                    value={customSince}
                    onChange={(e) => setCustomSince(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-[11px] font-black text-slate-500">
                    {t("metaCampaigns.ranges.until")}
                  </span>
                  <input
                    type="date"
                    value={customUntil}
                    onChange={(e) => setCustomUntil(e.target.value)}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-bold text-slate-700"
                  />
                </label>
              </div>
            ) : null}

            <div className="mt-4 h-[280px] w-full">
              {chartHasData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartSeries}>
                    <defs>
                      <linearGradient id="leadsFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="spendFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                      tickFormatter={(value) =>
                        String(value).slice(5).replace("-", "/")
                      }
                    />
                    <YAxis
                      yAxisId="left"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                    />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 11, fill: "#64748B" }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #E2E8F0",
                        fontWeight: 700,
                      }}
                    />
                    <Legend />
                    {showChartLeads ? (
                      <Area
                        yAxisId="left"
                        type="monotone"
                        dataKey="leads"
                        name={t("metaCampaigns.chart.leads")}
                        stroke="#3B82F6"
                        fill="url(#leadsFill)"
                        strokeWidth={2.5}
                      />
                    ) : null}
                    {showChartSpend ? (
                      <Area
                        yAxisId="right"
                        type="monotone"
                        dataKey="spend"
                        name={t("metaCampaigns.chart.spend")}
                        stroke="#7C3AED"
                        fill="url(#spendFill)"
                        strokeWidth={2.5}
                      />
                    ) : null}
                    {showChartClicks ? (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="clicks"
                        name={t("metaCampaigns.chart.clicks")}
                        stroke="#0EA5E9"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    ) : null}
                    {showChartImpressions ? (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="impressions"
                        name={t("metaCampaigns.chart.impressions")}
                        stroke="#94A3B8"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    ) : null}
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="grid h-full place-items-center text-sm font-semibold text-slate-400">
                  {t("metaCampaigns.chart.empty")}
                </div>
              )}
            </div>
          </div>

          <div className={`${cardBase} overflow-hidden`}>
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-sm font-black text-slate-900">
                  {t("metaCampaigns.table.title")}
                </p>
                <p className="text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.table.subtitle", {
                    count: campaigns.length,
                  })}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-50/80 text-xs font-black uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-4 py-3 text-start">
                      {t("metaCampaigns.table.name")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.campaignId")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.platform")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.status")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.results")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.costPerResult")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.budget")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.spend")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.impressions")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.reach")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.clicks")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.start")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.end")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.length ? (
                    campaigns.map((campaign) => {
                      const deliveryStatus =
                        campaign.deliveryStatus ||
                        campaign.effectiveStatus ||
                        campaign.status;
                      const tone = statusTone(deliveryStatus);
                      const isConfiguredActive =
                        String(
                          campaign.configuredStatus || campaign.status || ""
                        ).toUpperCase() === "ACTIVE";
                      const results =
                        campaign.metrics?.results ?? campaign.metrics?.leads;
                      const costPerResult =
                        campaign.metrics?.costPerResult ??
                        campaign.metrics?.costPerLead;
                      return (
                        <tr
                          key={campaign.id}
                          className="border-t border-slate-100 hover:bg-slate-50/70"
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() => setDetailsCampaign(campaign)}
                              className="group text-start"
                            >
                              <p className="font-black text-slate-900 group-hover:text-violet-700">
                                {campaign.name}
                              </p>
                              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                {t(
                                  `metaCampaigns.objectives.${
                                    campaign.objective
                                      ?.toLowerCase()
                                      .includes("lead")
                                      ? "leads"
                                      : campaign.objective
                                            ?.toLowerCase()
                                            .includes("sale")
                                        ? "sales"
                                        : campaign.objective
                                              ?.toLowerCase()
                                              .includes("traffic")
                                          ? "traffic"
                                          : campaign.objective
                                                ?.toLowerCase()
                                                .includes("aware")
                                            ? "awareness"
                                            : campaign.objective
                                                  ?.toLowerCase()
                                                  .includes("engage")
                                              ? "engagement"
                                              : "leads"
                                  }`
                                )}
                              </p>
                            </button>
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-600 tabular-nums">
                            {campaign.id || "—"}
                          </td>
                          <td className="px-3 py-3">
                            <PlatformIcons objective={campaign.objective} />
                          </td>
                          <td className="px-3 py-3">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-black ${tone.bg} ${tone.text} ${tone.border}`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${tone.dot}`}
                              />
                              {t(
                                `metaCampaigns.status.${String(deliveryStatus)
                                  .toLowerCase()
                                  .replace(/[^a-z_]/g, "")}`,
                                {
                                  defaultValue: deliveryStatus,
                                }
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(results, formatNumber, {
                              treatZeroAsEmpty:
                                !(campaign.metrics?.spend || 0) &&
                                !(campaign.metrics?.impressions || 0),
                            })}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              (results || 0) > 0 ? costPerResult : null,
                              (n) => formatCurrency(n, currency)
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            <div>
                              {campaign.dailyBudget
                                ? formatCurrency(campaign.dailyBudget, currency)
                                : campaign.lifetimeBudget
                                  ? formatCurrency(
                                      campaign.lifetimeBudget,
                                      currency
                                    )
                                  : "—"}
                            </div>
                            <div className="text-[11px] font-semibold text-slate-400">
                              {campaign.dailyBudget
                                ? t("metaCampaigns.table.budgetDaily")
                                : campaign.lifetimeBudget
                                  ? t("metaCampaigns.table.budgetLifetime")
                                  : ""}
                            </div>
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.spend,
                              (n) => formatCurrency(n, currency),
                              {
                                treatZeroAsEmpty:
                                  !(campaign.metrics?.impressions || 0) &&
                                  !(campaign.metrics?.clicks || 0) &&
                                  !(results || 0),
                              }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.impressions,
                              formatNumber,
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.reach,
                              formatNumber,
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.clicks,
                              formatNumber,
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatDateHe(campaign.startTime)}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {campaign.stopTime
                              ? formatDateHe(campaign.stopTime)
                              : t("metaCampaigns.table.endOngoing")}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                title={t("metaCampaigns.actions.viewDetails")}
                                onClick={() => setDetailsCampaign(campaign)}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
                              >
                                <Eye className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title={t("metaCampaigns.actions.edit")}
                                onClick={() =>
                                  navigate(`${basePath}/edit/${campaign.id}`)
                                }
                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                title={
                                  isConfiguredActive
                                    ? t("metaCampaigns.actions.pause")
                                    : t("metaCampaigns.actions.activate")
                                }
                                disabled={busyId === campaign.id}
                                onClick={() => toggleStatus(campaign)}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
                              >
                                {busyId === campaign.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isConfiguredActive ? (
                                  <Pause className="h-3.5 w-3.5" />
                                ) : (
                                  <Play className="h-3.5 w-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={14}
                        className="px-4 py-10 text-center text-sm font-semibold text-slate-400"
                      >
                        {t("metaCampaigns.empty.noCampaignsInRange")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-4">
          <div className={`${cardBase} p-4`}>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-violet-600" />
              <p className="text-sm font-black text-slate-900">
                {t("metaCampaigns.insights.title")}
              </p>
            </div>
            <div className="mt-3 space-y-2.5">
              {(data?.insights || []).map((item) => (
                <InsightCard key={item.id} item={item} />
              ))}
            </div>
          </div>

          <div className={`${cardBase} p-4`}>
            <div className="flex items-center gap-2">
              <Workflow className="h-4 w-4 text-sky-600" />
              <p className="text-sm font-black text-slate-900">
                {t("metaCampaigns.automations.title")}
              </p>
            </div>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.automations.subtitle")}
            </p>
            <ol className="relative mt-4 space-y-4 border-s border-slate-200 ps-4">
              {[
                t("metaCampaigns.automations.step1"),
                t("metaCampaigns.automations.step2"),
                t("metaCampaigns.automations.step3"),
              ].map((step, index) => (
                <li key={step} className="relative">
                  <span className="absolute -start-[21px] top-1 grid h-3.5 w-3.5 place-items-center rounded-full border-2 border-white bg-violet-500 shadow" />
                  <p className="text-xs font-black text-slate-400">
                    {t("metaCampaigns.automations.stepLabel", {
                      n: index + 1,
                    })}
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-slate-700">
                    {step}
                  </p>
                </li>
              ))}
            </ol>
            <Link
              to={`/business/${urlBusinessId || businessId}/dashboard/whatsapp/automations`}
              className={`${btnSecondary} mt-4 w-full`}
            >
              <ArrowUpRight className="h-4 w-4" />
              {t("metaCampaigns.automations.cta")}
            </Link>
          </div>

          <div className={`${cardBase} p-4`}>
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-emerald-600" />
              <p className="text-sm font-black text-slate-900">
                {t("metaCampaigns.overview.spendCard")}
              </p>
            </div>
            <p className="mt-3 text-2xl font-black text-slate-900">
              {formatMetricOrDash(kpis?.spend, (n) =>
                formatCurrency(n, currency)
              , { treatZeroAsEmpty: !hasInsightSignal })}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.overview.spendCardHint")}
            </p>
          </div>
        </aside>
      </div>

      {detailsCampaign ? (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 p-0 sm:p-4"
          onClick={() => setDetailsCampaign(null)}
        >
          <aside
            className="flex h-full w-full max-w-md flex-col overflow-hidden bg-white shadow-2xl sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
            dir="rtl"
          >
            <div className="flex items-start justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.14em] text-violet-700">
                  {t("metaCampaigns.details.badge")}
                </p>
                <h3 className="mt-1 text-lg font-black text-slate-900">
                  {detailsCampaign.name}
                </h3>
                <p className="mt-0.5 text-xs font-semibold text-slate-500">
                  {t("metaCampaigns.details.readOnlyHint")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setDetailsCampaign(null)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 text-slate-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <dl className="flex-1 overflow-y-auto px-4 py-2">
              <DetailRow
                label="Campaign name"
                value={detailsCampaign.name || "—"}
              />
              <DetailRow
                label="Campaign ID"
                value={detailsCampaign.id || "—"}
              />
              <DetailRow
                label="Status"
                value={
                  detailsCampaign.deliveryStatus ||
                  detailsCampaign.effectiveStatus ||
                  detailsCampaign.status ||
                  "—"
                }
              />
              <DetailRow
                label="Objective"
                value={detailsCampaign.objective || "—"}
              />
              <DetailRow
                label="Buying type"
                value={detailsCampaign.buyingType || "—"}
              />
              <DetailRow
                label="Daily/Lifetime budget"
                value={
                  detailsCampaign.dailyBudget
                    ? `${formatCurrency(detailsCampaign.dailyBudget, currency)} (daily)`
                    : detailsCampaign.lifetimeBudget
                      ? `${formatCurrency(detailsCampaign.lifetimeBudget, currency)} (lifetime)`
                      : "—"
                }
              />
              <DetailRow
                label="Spend"
                value={formatMetricOrDash(
                  detailsCampaign.metrics?.spend,
                  (n) => formatCurrency(n, currency),
                  { treatZeroAsEmpty: true }
                )}
              />
              <DetailRow
                label="Impressions"
                value={formatMetricOrDash(
                  detailsCampaign.metrics?.impressions,
                  formatNumber,
                  { treatZeroAsEmpty: true }
                )}
              />
              <DetailRow
                label="Reach"
                value={formatMetricOrDash(
                  detailsCampaign.metrics?.reach,
                  formatNumber,
                  { treatZeroAsEmpty: true }
                )}
              />
              <DetailRow
                label="Clicks"
                value={formatMetricOrDash(
                  detailsCampaign.metrics?.clicks,
                  formatNumber,
                  { treatZeroAsEmpty: true }
                )}
              />
              <DetailRow
                label="CTR"
                value={formatMetricOrDash(
                  detailsCampaign.metrics?.ctr,
                  (n) => formatPercent(n),
                  { treatZeroAsEmpty: true }
                )}
              />
              <DetailRow
                label="Leads"
                value={formatMetricOrDash(
                  detailsCampaign.metrics?.leads,
                  formatNumber,
                  { treatZeroAsEmpty: true }
                )}
              />
              <DetailRow
                label="Cost per lead"
                value={formatMetricOrDash(
                  (detailsCampaign.metrics?.leads || 0) > 0
                    ? detailsCampaign.metrics?.costPerLead
                    : null,
                  (n) => formatCurrency(n, currency)
                )}
              />
              <DetailRow
                label="Start date"
                value={formatDateHe(detailsCampaign.startTime)}
              />
              <DetailRow
                label="End date"
                value={
                  detailsCampaign.stopTime
                    ? formatDateHe(detailsCampaign.stopTime)
                    : t("metaCampaigns.table.endOngoing")
                }
              />
              <DetailRow
                label="Last data update"
                value={formatDateTimeHe(lastUpdatedAt)}
              />
            </dl>
          </aside>
        </div>
      ) : null}

      {showCaptions ? (
        <div className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white/95 p-3 shadow-lg backdrop-blur sm:inset-x-auto">
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-700">
                App Review · ads_read
              </p>
              <p className="mt-1 text-sm font-semibold leading-relaxed text-slate-700">
                {APP_REVIEW_CAPTIONS[captionIndex]}
              </p>
              <div className="mt-2 flex flex-wrap gap-1">
                {APP_REVIEW_CAPTIONS.map((_, index) => (
                  <button
                    key={APP_REVIEW_CAPTIONS[index]}
                    type="button"
                    onClick={() => setCaptionIndex(index)}
                    className={[
                      "h-1.5 w-6 rounded-full",
                      index === captionIndex ? "bg-violet-500" : "bg-slate-200",
                    ].join(" ")}
                    aria-label={`Caption ${index + 1}`}
                  />
                ))}
              </div>
            </div>
            <button
              type="button"
              onClick={hideCaptions}
              className="shrink-0 rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold text-slate-500 hover:bg-slate-50"
            >
              Hide
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
