import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  useNavigate,
  useOutletContext,
  useParams,
  useSearchParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getDemoCurrency } from "@/guidedDemo/demoCurrency";
import { isGuidedDemoActive } from "@/guidedDemo/sessionStore";
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
import { getIntlLocale } from "../../../../i18n/localeUtils";
import MetaAdsReviewCaptions from "./MetaAdsReviewCaptions";
import CreateCampaignButton from "./CreateCampaignButton";
import MetaCampaignHealthPanel from "./MetaCampaignHealthPanel";
import MetaCampaignDetailsDrawer from "./MetaCampaignDetailsDrawer";
import MetaPerformanceBreakdown from "./MetaPerformanceBreakdown";
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
  metaDeliveryStatusKey,
  resolveAdAccountId,
  resolveMetaAccountStatus,
  resolveMetaDateRangeQuery,
  resolveCampaignCurrency,
  SEGMENT_OPTIONS,
  statusTone,
  todayIso,
  type MetaDateRangePreset,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };

function objectiveKey(objective?: string | null) {
  const value = String(objective || "").toLowerCase();
  if (value.includes("sale")) return "sales";
  if (value.includes("traffic")) return "traffic";
  if (value.includes("aware")) return "awareness";
  if (value.includes("engage")) return "engagement";
  return "leads";
}

function KpiCard({
  label,
  value,
  hint,
  trend,
  trendPositive,
  progress,
  href,
  demoTarget,
}: {
  label: string;
  value: string;
  hint?: string;
  trend?: string;
  trendPositive?: boolean;
  progress?: number;
  href?: string;
  demoTarget?: string;
}) {
  const body = (
    <div className={`${cardBase} relative overflow-hidden p-4`} data-demo-target={demoTarget}>
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
  if (!href) return body;
  return (
    <Link to={href} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-300">
      {body}
    </Link>
  );
}

function InsightCard({ item }: { item: MetaCampaignInsight }) {
  const { t } = useTranslation();
  const tone =
    item.tone === "success"
      ? "border-emerald-100 bg-emerald-50/70 text-emerald-800"
      : item.tone === "warning"
        ? "border-amber-100 bg-amber-50/70 text-amber-900"
        : "border-sky-100 bg-sky-50/70 text-sky-900";
  const title = item.titleKey
    ? t(item.titleKey, { defaultValue: item.title || "" })
    : item.title || "";
  const body = item.bodyKey
    ? t(item.bodyKey, {
        ...(item.bodyParams || {}),
        defaultValue: item.body || "",
      })
    : item.body || "";

  return (
    <div className={`rounded-xl border p-3 ${tone}`}>
      <div className="flex items-start gap-2">
        {item.demoData ? (
          <span className="rounded-full bg-white/80 px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-500">
            {t("metaCampaigns.insights.demoData", "Demo data")}
          </span>
        ) : null}
        <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 opacity-80" />
        <div className="min-w-0">
          <p className="text-sm font-black">{title}</p>
          <p className="mt-1 text-xs font-semibold leading-relaxed opacity-90">
            {body}
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

function isMetaThrottleError(error: any) {
  const blob = JSON.stringify(
    error?.response?.data || error?.message || ""
  ).toLowerCase();
  return (
    Number(error?.response?.data?.details?.code) === 613 ||
    Number(error?.response?.status) === 429 ||
    blob.includes("613") ||
    blob.includes("rate limit") ||
    blob.includes("too many calls")
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const [searchParams] = useSearchParams();
  const queryCampaignId = searchParams.get("campaignId") || "";
  const queryRecommendationId = searchParams.get("recommendationId") || "";
  const basePath = `/business/${urlBusinessId || businessId}/dashboard/meta-campaigns`;
  const locale = getIntlLocale(i18n.language);

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
  const [pendingStatusCampaign, setPendingStatusCampaign] =
    useState<MetaCampaign | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const loadInFlightRef = useRef(false);
  const backoffUntilRef = useRef(0);
  const lastStartedAtRef = useRef(0);

  const currency = resolveCampaignCurrency(data?.connection?.selectedAdAccount?.currency);
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
    if (loadInFlightRef.current) return;
    const now = Date.now();
    if (now < backoffUntilRef.current) {
      if (!options?.silent) {
        toast.error(t("metaCampaigns.actions.rateLimited"));
      }
      return;
    }
    if (
      options?.silent &&
      lastStartedAtRef.current &&
      now - lastStartedAtRef.current < 15000
    ) {
      return;
    }
    const silent = Boolean(options?.silent);
    loadInFlightRef.current = true;
    lastStartedAtRef.current = now;
    if (silent) setRefreshing(true);
    else setLoading(true);
    setLoadError(null);
    try {
      const overview = await getMetaCampaignsOverview(businessId, rangeQuery);
      setData(overview);
      setLastUpdatedAt(new Date());
      backoffUntilRef.current = 0;
      if (options?.successToast) {
        toast.success(t("metaCampaigns.toasts.overviewRefreshed"));
      }
    } catch (error: any) {
      if (isMetaThrottleError(error)) {
        backoffUntilRef.current = Date.now() + 45000;
        toast.error(t("metaCampaigns.actions.rateLimited"));
      } else if (isPermissionError(error)) {
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
      loadInFlightRef.current = false;
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (rangePreset === "custom" && (!customSince || !customUntil)) return;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, rangePreset, customSince, customUntil]);

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

  useEffect(() => {
    if (!queryCampaignId) return;
    const match = (data?.campaigns || []).find((item) => item.id === queryCampaignId);
    if (match) setDetailsCampaign(match);
  }, [queryCampaignId, data?.campaigns]);

  const kpis = data?.kpis;
  const isDemoOverview = Boolean(data?.demoData || data?.connection?.isGuidedDemo);
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
      (point.impressions || 0) > 0 ||
      (point.sales || 0) > 0 ||
      (point.traffic || 0) > 0 ||
      (point.engagement || 0) > 0
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

  const demoSandbox = Boolean(
    data?.demoData ||
      data?.connection?.isGuidedDemo ||
      data?.connection?.demoData
  );
  const connected = Boolean(data?.connection?.connected || demoSandbox);
  const instagramAccountId = String(
    data?.connection?.selectedPage?.instagramBusinessAccountId || ""
  ).trim();
  const instagramMissing = Boolean(
    connected &&
      !demoSandbox &&
      data?.connection?.selectedPage?.pageId &&
      !instagramAccountId
  );
  useEffect(() => {
    if (!lastUpdatedAt) return;
    const timer = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [lastUpdatedAt]);
  useEffect(() => {
    if (!businessId || !connected) return;
    const jitterMs = Math.floor(Math.random() * 4000);
    const tick = () => {
      if (typeof document !== "undefined" && document.visibilityState !== "visible") {
        return;
      }
      if (loadInFlightRef.current) return;
      if (Date.now() < backoffUntilRef.current) return;
      void load({ silent: true });
    };
    const timer = window.setInterval(tick, 30000 + jitterMs);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, connected, rangePreset, customSince, customUntil]);
  const tokenLinked = Boolean(
    demoSandbox ||
      (data?.connection?.isConnected && data?.connection?.hasAccessToken)
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
      const result = await setMetaCampaignStatus(
        businessId,
        campaign.id,
        next,
        next === "ACTIVE" ? { confirmActivate: true } : undefined
      );
      const confirmed = String(
        result?.campaign?.configuredStatus ||
          result?.campaign?.status ||
          ""
      ).toUpperCase();
      if (confirmed && confirmed !== next) {
        toast.error(t("metaCampaigns.errors.statusNotPersisted"));
        await load({ silent: true });
        return;
      }
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
      setPendingStatusCampaign(null);
    }
  };

  const pendingNextStatus =
    String(
      pendingStatusCampaign?.configuredStatus ||
        pendingStatusCampaign?.status ||
        ""
    ).toUpperCase() === "ACTIVE"
      ? "PAUSED"
      : "ACTIVE";

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
    const needsAccount = Boolean(tokenLinked && !connected);
    return (
      <div className={`${cardBase} p-6 sm:p-8`}>
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-violet-100 via-sky-100 to-cyan-100 text-violet-700">
            <Target className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-black text-slate-900">
            {needsAccount
              ? t("metaCampaigns.empty.selectAccountTitle")
              : t("metaCampaigns.empty.notConnectedTitle")}
          </h2>
          <p className="mt-2 text-sm font-semibold text-slate-500">
            {needsAccount
              ? t("metaCampaigns.empty.selectAccountBody")
              : t("metaCampaigns.empty.notConnectedBody")}
          </p>
          <Link to={`${basePath}/settings`} className={`${btnPrimary} mt-5`}>
            {needsAccount
              ? t("metaCampaigns.empty.selectAccountCta")
              : t("metaCampaigns.empty.connectCta")}
          </Link>
        </div>
        <MetaAdsReviewCaptions set="overview" />
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
              {t("metaCampaigns.overview.syncedWithMeta")}
              {" · "}
              {t("metaCampaigns.overview.lastSyncedAgo", {
                seconds: Math.max(
                  0,
                  Math.round((nowMs - lastUpdatedAt.getTime()) / 1000)
                ),
              })}
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => load({ silent: true, successToast: true })}
            className={btnSecondary}
            disabled={
              refreshing ||
              switchingAccount ||
              Date.now() < backoffUntilRef.current
            }
          >
            {refreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {t("metaCampaigns.actions.refresh")}
          </button>
          {refreshing ? (
            <span className="text-xs font-bold text-violet-700">
              {t("metaCampaigns.manager.syncing")}
            </span>
          ) : null}
          <CreateCampaignButton basePath={basePath} />
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
                  ? ` (${
                      isGuidedDemoActive()
                        ? getDemoCurrency()?.symbol
                        : selectedAccount.currency
                    })`
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
                  currency: isGuidedDemoActive()
                    ? getDemoCurrency()?.symbol
                    : selectedAccount.currency,
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
                    {formatAdAccountLabel(account, {
                      fallbackName: t("metaCampaigns.overview.account"),
                    })}
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
        {instagramMissing ? (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
            <p className="text-sm font-black text-amber-900">
              {t("metaCampaigns.overview.instagramNotConnected")}
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-800">
              {t("metaCampaigns.overview.instagramConnectHint")}
            </p>
            <Link
              to={`${basePath}/settings`}
              className="mt-2 inline-flex text-xs font-black text-amber-900 underline"
            >
              {t("metaCampaigns.overview.instagramConnectCta")}
            </Link>
          </div>
        ) : null}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5" data-demo-target="meta-overview">
        <KpiCard
          label={t("metaCampaigns.kpis.spend")}
          value={formatMetricOrDash(kpis?.spend, (n) =>
            formatCurrency(n, currency)
          , { treatZeroAsEmpty: !hasInsightSignal })}
          hint={t("metaCampaigns.kpis.spendHint")}
          trend={
            data?.comparison?.changes?.spend == null
              ? undefined
              : `${data.comparison.changes.spend >= 0 ? "+" : ""}${data.comparison.changes.spend.toFixed(1)}%`
          }
          trendPositive={(data?.comparison?.changes?.spend || 0) <= 0}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.leads")}
          demoTarget="meta-leads-kpi"
          href={
            isDemoOverview
              ? `/business/${urlBusinessId || businessId}/dashboard/crm/leads?lead=sarah`
              : undefined
          }
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
          label={t("metaCampaigns.table.ctr")}
          value={formatMetricOrDash(kpis?.ctr, (n) => formatPercent(n), {
            treatZeroAsEmpty: true,
          })}
          hint={t("metaCampaigns.kpis.ctrHint")}
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
                    {segment === "all" && chartSeries.some((point) => (point.sales || 0) > 0) ? (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="sales"
                        name={t("metaCampaigns.chart.sales", "Sales")}
                        stroke="#059669"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    ) : null}
                    {segment === "all" && chartSeries.some((point) => (point.traffic || 0) > 0) ? (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="traffic"
                        name={t("metaCampaigns.chart.traffic", "Traffic")}
                        stroke="#D97706"
                        strokeWidth={1.5}
                        dot={false}
                      />
                    ) : null}
                    {segment === "all" && chartSeries.some((point) => (point.engagement || 0) > 0) ? (
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="engagement"
                        name={t("metaCampaigns.chart.engagement", "Engagement")}
                        stroke="#DB2777"
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
                      {t("metaCampaigns.table.linkClicks")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.ctr")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.cpc")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.cpm")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.frequency")}
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
                    campaigns.map((campaign, campaignIndex) => {
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
                              data-demo-target={campaignIndex === 0 ? "meta-campaign-row" : undefined}
                              onClick={() => setDetailsCampaign(campaign)}
                              className="group text-start"
                            >
                              <p className="font-black text-slate-900 group-hover:text-violet-700">
                                {campaign.name}
                              </p>
                              <p className="mt-0.5 text-xs font-semibold text-slate-400">
                                {t(`metaCampaigns.objectives.${objectiveKey(campaign.objective)}`)}
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
                                `metaCampaigns.status.${metaDeliveryStatusKey(
                                  deliveryStatus
                                )}`,
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
                            {formatMetricOrDash(
                              campaign.metrics?.linkClicks,
                              formatNumber,
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.ctr,
                              (n) => formatPercent(n),
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.cpc,
                              (n) => formatCurrency(n, currency),
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.cpm,
                              (n) => formatCurrency(n, currency),
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatMetricOrDash(
                              campaign.metrics?.frequency,
                              (n) => formatNumber(Number(n.toFixed(2))),
                              { treatZeroAsEmpty: true }
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatDateHe(campaign.startTime, locale)}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {campaign.stopTime
                              ? formatDateHe(campaign.stopTime, locale)
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
                                    ? t("metaCampaigns.actions.pauseHint")
                                    : t("metaCampaigns.actions.resumeHint")
                                }
                                disabled={busyId === campaign.id}
                                onClick={() => setPendingStatusCampaign(campaign)}
                                className="inline-flex h-8 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 text-[11px] font-black text-slate-700 hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
                              >
                                {busyId === campaign.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isConfiguredActive ? (
                                  <Pause className="h-3.5 w-3.5" />
                                ) : (
                                  <Play className="h-3.5 w-3.5" />
                                )}
                                {isConfiguredActive
                                  ? t("metaCampaigns.actions.pause")
                                  : t("metaCampaigns.actions.resume")}
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
          {businessId || urlBusinessId ? (
            <MetaCampaignHealthPanel
              businessId={String(urlBusinessId || businessId)}
              currency={currency}
              variant="list"
              highlightRecommendationId={queryRecommendationId || undefined}
              onOpenCampaign={(id) => {
                const match = (data?.campaigns || []).find((item) => item.id === id);
                if (match) setDetailsCampaign(match);
              }}
            />
          ) : null}
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
              to={`/business/${urlBusinessId || businessId}/dashboard/automations`}
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

      {businessId ? (
        <MetaPerformanceBreakdown
          businessId={businessId}
          rangeQuery={rangeQuery}
          currency={currency}
        />
      ) : null}

      {detailsCampaign && businessId ? (
        <MetaCampaignDetailsDrawer
          open
          businessId={businessId}
          campaign={detailsCampaign}
          currency={currency}
          lastSynced={lastUpdatedAt}
          canEdit={!isDemoOverview}
          onClose={() => setDetailsCampaign(null)}
          onOpenEdit={(id) => navigate(`${basePath}/edit/${id}`)}
          onChanged={() => void load({ silent: true })}
        />
      ) : null}


      {pendingStatusCampaign ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4"
          onClick={() => setPendingStatusCampaign(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.16em] text-violet-700">
              {t("metaCampaigns.review.managementBadge")}
            </p>
            <h3 className="mt-2 text-lg font-black text-slate-900">
              {pendingNextStatus === "PAUSED"
                ? t("metaCampaigns.actions.confirmPauseTitle")
                : t("metaCampaigns.actions.confirmResumeTitle")}
            </h3>
            <p className="mt-2 text-sm font-semibold text-slate-600">
              {pendingNextStatus === "PAUSED"
                ? t("metaCampaigns.actions.confirmPauseBody", {
                    name: pendingStatusCampaign.name,
                  })
                : t("metaCampaigns.actions.confirmActivateSpend", {
                    name: pendingStatusCampaign.name,
                  })}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                className={btnSecondary}
                onClick={() => setPendingStatusCampaign(null)}
              >
                {t("common.cancel", { defaultValue: "Cancel" })}
              </button>
              <button
                type="button"
                className={btnPrimary}
                disabled={Boolean(busyId)}
                onClick={() => void toggleStatus(pendingStatusCampaign)}
              >
                {busyId ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : pendingNextStatus === "PAUSED" ? (
                  t("metaCampaigns.actions.pause")
                ) : (
                  t("metaCampaigns.actions.resume")
                )}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <MetaAdsReviewCaptions set="overview" />
    </div>
  );
}
