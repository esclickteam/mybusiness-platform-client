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
  Facebook,
  Instagram,
  Lightbulb,
  Loader2,
  MoreHorizontal,
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
} from "lucide-react";
import {
  getMetaCampaignsOverview,
  setMetaCampaignStatus,
  type MetaCampaign,
  type MetaCampaignInsight,
  type MetaCampaignsOverview,
} from "../../../../api/metaCampaignsApi";
import BizuplyLoader from "../../../../components/ui/BizuplyLoader";
import { btnPrimary, btnSecondary, cardBase } from "../../../../styles/bizuplyUi";
import {
  formatAdAccountLabel,
  DATE_RANGE_OPTIONS,
  formatCurrency,
  formatNumber,
  formatPercent,
  formatRoas,
  SEGMENT_OPTIONS,
  statusTone,
} from "./metaCampaignUtils";

type OutletCtx = { businessId: string | null };

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

export default function MetaCampaignsOverviewTab() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useOutletContext<OutletCtx>();
  const { businessId: urlBusinessId } = useParams<{ businessId: string }>();
  const basePath = `/business/${urlBusinessId || businessId}/dashboard/meta-campaigns`;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [days, setDays] = useState(30);
  const [segment, setSegment] = useState("all");
  const [data, setData] = useState<MetaCampaignsOverview | null>(null);
  const [busyId, setBusyId] = useState("");

  const currency =
    data?.connection?.selectedAdAccount?.currency || "ILS";

  const load = async (silent = false) => {
    if (!businessId) return;
    if (silent) setRefreshing(true);
    else setLoading(true);
    try {
      const overview = await getMetaCampaignsOverview(businessId, { days });
      setData(overview);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error ||
          error?.response?.data?.message ||
          t("metaCampaigns.errors.loadOverview")
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId, days]);

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

  const connected = Boolean(data?.connection?.connected);

  const toggleStatus = async (campaign: MetaCampaign) => {
    if (!businessId) return;
    const next =
      String(campaign.effectiveStatus || campaign.status).toUpperCase() ===
      "ACTIVE"
        ? "PAUSED"
        : "ACTIVE";
    try {
      setBusyId(campaign.id);
      await setMetaCampaignStatus(businessId, campaign.id, next);
      toast.success(
        next === "ACTIVE"
          ? t("metaCampaigns.toasts.activated")
          : t("metaCampaigns.toasts.paused")
      );
      await load(true);
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

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <BizuplyLoader />
      </div>
    );
  }

  if (!connected) {
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

  const kpis = data?.kpis;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-900">
            {t("metaCampaigns.overview.heading")}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-slate-500">
            {t("metaCampaigns.overview.subheading")}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex max-w-full items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700">
            <Facebook className="h-4 w-4 shrink-0 text-[#1877F2]" />
            <span className="max-w-[280px] truncate tabular-nums" title={formatAdAccountLabel(data?.connection?.selectedAdAccount, { fallbackName: t("metaCampaigns.overview.account") })}>
              {formatAdAccountLabel(data?.connection?.selectedAdAccount, {
                fallbackName: t("metaCampaigns.overview.account"),
              })}
            </span>
          </div>
          <button
            type="button"
            onClick={() => load(true)}
            className={btnSecondary}
            disabled={refreshing}
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

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label={t("metaCampaigns.kpis.roas")}
          value={formatRoas(kpis?.roas || 0)}
          hint={t("metaCampaigns.kpis.roasHint")}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.cpl")}
          value={formatCurrency(kpis?.costPerLead || 0, currency)}
          hint={t("metaCampaigns.kpis.cplHint")}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.leads")}
          value={formatNumber(kpis?.leads || 0)}
          hint={t("metaCampaigns.kpis.leadsHint")}
        />
        <KpiCard
          label={t("metaCampaigns.kpis.spend")}
          value={formatCurrency(kpis?.spend || 0, currency)}
          hint={t("metaCampaigns.kpis.spendHint")}
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
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
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

            <div className="mt-4 h-[280px] w-full">
              {(data?.series || []).length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data?.series || []}>
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
                    <Area
                      yAxisId="left"
                      type="monotone"
                      dataKey="leads"
                      name={t("metaCampaigns.chart.leads")}
                      stroke="#3B82F6"
                      fill="url(#leadsFill)"
                      strokeWidth={2.5}
                    />
                    <Area
                      yAxisId="right"
                      type="monotone"
                      dataKey="spend"
                      name={t("metaCampaigns.chart.spend")}
                      stroke="#7C3AED"
                      fill="url(#spendFill)"
                      strokeWidth={2.5}
                    />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="clicks"
                      name={t("metaCampaigns.chart.clicks")}
                      stroke="#0EA5E9"
                      strokeWidth={1.5}
                      dot={false}
                    />
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
                      {t("metaCampaigns.table.platform")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.status")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.budget")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.spend")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.leads")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.cpl")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.ctr")}
                    </th>
                    <th className="px-3 py-3 text-start">
                      {t("metaCampaigns.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {campaigns.length ? (
                    campaigns.map((campaign) => {
                      const tone = statusTone(
                        campaign.effectiveStatus || campaign.status
                      );
                      const isActive =
                        String(
                          campaign.effectiveStatus || campaign.status
                        ).toUpperCase() === "ACTIVE";
                      return (
                        <tr
                          key={campaign.id}
                          className="border-t border-slate-100 hover:bg-slate-50/70"
                        >
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                navigate(`${basePath}/edit/${campaign.id}`)
                              }
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
                                `metaCampaigns.status.${String(
                                  campaign.effectiveStatus || campaign.status
                                )
                                  .toLowerCase()
                                  .replace(/[^a-z_]/g, "")}`,
                                {
                                  defaultValue:
                                    campaign.effectiveStatus || campaign.status,
                                }
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {campaign.dailyBudget
                              ? formatCurrency(campaign.dailyBudget, currency)
                              : campaign.lifetimeBudget
                                ? formatCurrency(
                                    campaign.lifetimeBudget,
                                    currency
                                  )
                                : "—"}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatCurrency(campaign.metrics?.spend || 0, currency)}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatNumber(campaign.metrics?.leads || 0)}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatCurrency(
                              campaign.metrics?.costPerLead || 0,
                              currency
                            )}
                          </td>
                          <td className="px-3 py-3 font-bold text-slate-700">
                            {formatPercent(campaign.metrics?.ctr || 0)}
                          </td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1">
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
                                  isActive
                                    ? t("metaCampaigns.actions.pause")
                                    : t("metaCampaigns.actions.activate")
                                }
                                disabled={busyId === campaign.id}
                                onClick={() => toggleStatus(campaign)}
                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-700 disabled:opacity-50"
                              >
                                {busyId === campaign.id ? (
                                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : isActive ? (
                                  <Pause className="h-3.5 w-3.5" />
                                ) : (
                                  <Play className="h-3.5 w-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                className="grid h-8 w-8 place-items-center rounded-lg border border-slate-200 bg-white text-slate-400"
                                aria-hidden
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-10 text-center text-sm font-semibold text-slate-400"
                      >
                        {t("metaCampaigns.table.empty")}
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
              {formatCurrency(kpis?.spend || 0, currency)}
            </p>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {t("metaCampaigns.overview.spendCardHint")}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
