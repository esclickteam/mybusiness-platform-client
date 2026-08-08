import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarPlus,
  ChevronDown,
  Eye,
  Handshake,
  MoreHorizontal,
  Pencil,
  Sparkles,
  Star,
  TrendingUp,
  UserPlus,
} from "lucide-react";

import DashboardSkeleton from "@/components/DashboardSkeleton";
import BizuplyLoader from "@/components/ui/BizuplyLoader";
import AiInsightsPanel from "@/components/AiInsightsPanel";
import useAiInsights from "@/hooks/useAiInsights";

import type {
  DashboardFilters,
  DashboardOverviewData,
  DatePreset,
  PerformanceMetric,
} from "./dashboardOverviewTypes";
import {
  buildUpcomingAppointmentsFromCalendar,
  formatAppointmentBadge,
  formatDateRangeLabel,
  formatLeadSource,
  formatLeadStatus,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  type CalendarAppointment,
} from "./dashboardOverviewUtils";

type DashboardOverviewProps = {
  businessName?: string;
  calendarAppointments?: CalendarAppointment[];
  data: DashboardOverviewData | null;
  loading: boolean;
  error: string | null;
  filters: DashboardFilters;
  onFiltersChange: (patch: Partial<DashboardFilters>) => void;
  onRetry: () => void;
};

const DATE_PRESETS: DatePreset[] = [
  "today",
  "week",
  "month",
  "year",
  "custom",
];

const PERFORMANCE_TABS: PerformanceMetric[] = [
  "views",
  "leads",
  "appointments",
  "collaborations",
];

const RESOLUTIONS = ["day", "week", "month", "year"] as const;

const KPI_ACCENTS = {
  violet: {
    icon: "bg-violet-50 text-violet-700",
    glow: "from-violet-500/15",
    stroke: "#7c3aed",
    chip: "bg-emerald-50 text-emerald-700",
  },
  blue: {
    icon: "bg-blue-50 text-blue-700",
    glow: "from-blue-500/15",
    stroke: "#2563eb",
    chip: "bg-emerald-50 text-emerald-700",
  },
  amber: {
    icon: "bg-amber-50 text-amber-700",
    glow: "from-amber-500/15",
    stroke: "#d97706",
    chip: "bg-emerald-50 text-emerald-700",
  },
  pink: {
    icon: "bg-pink-50 text-pink-700",
    glow: "from-pink-500/15",
    stroke: "#db2777",
    chip: "bg-emerald-50 text-emerald-700",
  },
} as const;

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function MiniSparkline({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const chartData = useMemo(() => {
    const source =
      values.length >= 2
        ? values
        : values.length === 1
          ? [0, values[0]]
          : [2, 4, 3, 6, 5, 8, 7];

    return source.map((value, index) => ({ index, value }));
  }, [values]);

  return (
    <div className="h-[42px] w-[96px] shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            fill={color}
            fillOpacity={0.12}
            strokeWidth={2.5}
            dot={false}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${
        positive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
      }`}
    >
      <TrendingUp size={12} className={positive ? "" : "rotate-180"} />
      {formatPercent(value)}
    </span>
  );
}

function KpiCard({
  title,
  value,
  subtitle,
  change,
  series,
  icon,
  accent = "violet",
}: {
  title: string;
  value: string;
  subtitle: string;
  change: number;
  series: number[];
  icon: React.ReactNode;
  accent?: keyof typeof KPI_ACCENTS;
}) {
  const tone = KPI_ACCENTS[accent];

  return (
    <div className="relative min-h-[156px] overflow-hidden rounded-[28px] border border-slate-200/70 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)]">
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-gradient-to-br ${tone.glow} to-transparent blur-2xl`}
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}
        >
          {icon}
        </div>
        <ChangeBadge value={change} />
      </div>

      <div className="relative z-10 mt-4">
        <p className="text-xs font-bold uppercase tracking-[0.08em] text-slate-500">
          {title}
        </p>
        <div className="mt-2 flex items-end justify-between gap-3">
          <div>
            <p className="text-[2rem] font-black leading-none tracking-tight text-slate-800">
              {value}
            </p>
            <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
          </div>
          <MiniSparkline values={series} color={tone.stroke} />
        </div>
      </div>
    </div>
  );
}

function EmptyBlock({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-violet-200 bg-violet-50/40 p-8 text-center">
      <Sparkles className="mx-auto mb-3 text-violet-500" size={22} />
      <p className="text-sm font-black text-slate-900">{title}</p>
      <p className="mt-2 text-sm font-medium text-slate-500">{description}</p>
    </div>
  );
}

function StatusBadge({ label, tone = "neutral" }: { label: string; tone?: string }) {
  const tones: Record<string, string> = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-violet-100 text-violet-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${tones[tone] || tones.neutral}`}
    >
      {label}
    </span>
  );
}

export default function DashboardOverview({
  businessName,
  calendarAppointments = [],
  data,
  loading,
  error,
  filters,
  onFiltersChange,
  onRetry,
}: DashboardOverviewProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const basePath = `/business/${businessId}/dashboard`;
  const { insights: aiInsights, loading: aiInsightsLoading, error: aiInsightsError } =
    useAiInsights(typeof businessId === "string" ? businessId : undefined);

  const upcomingFromCalendar = useMemo(
    () => buildUpcomingAppointmentsFromCalendar(calendarAppointments, 5),
    [calendarAppointments]
  );

  const upcomingAppointments =
    upcomingFromCalendar.length > 0
      ? upcomingFromCalendar
      : data?.appointments.upcoming || [];

  const performanceChartData = useMemo(() => {
    const current = data?.performance.current || [];
    const previous = data?.performance.previous || [];

    return current.map((point, index) => ({
      label: point.date,
      current: point.value,
      previous: previous[index]?.value ?? 0,
    }));
  }, [data?.performance]);

  if (loading && !data) {
    return <BizuplyLoader fullScreen label="Loading dashboard..." />;
  }

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2rem] font-black tracking-tight text-slate-800">
              {t("overview.greeting", {
                name: (businessName || t("overview.yourBusiness")).trim(),
              })}
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {t("overview.subtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {data?.customDomainConnected ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                {t("overview.customDomainConnected")}
              </span>
            ) : null}
          </div>
        </div>

        <Panel className="p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap gap-2">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => onFiltersChange({ preset })}
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                    filters.preset === preset
                      ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800 shadow-[0_10px_24px_rgba(124,58,237,0.22)]"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {preset === "custom"
                    ? t("common.customRange")
                    : t(`common.${preset}`)}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                {formatDateRangeLabel(filters.startDate, filters.endDate)}
                <ChevronDown size={14} />
              </span>

              <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
                <select
                  className="bg-transparent outline-none"
                  value={filters.compareToPrevious ? "compare" : "none"}
                  onChange={(event) =>
                    onFiltersChange({
                      compareToPrevious: event.target.value === "compare",
                    })
                  }
                >
                  <option value="compare">{t("overview.compareToPrevious")}</option>
                  <option value="none">{t("overview.noComparison")}</option>
                </select>
                <ChevronDown size={14} className="text-slate-400" />
              </label>
            </div>
          </div>

          {filters.preset === "custom" ? (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-4">
              <input
                type="date"
                value={filters.startDate}
                onChange={(event) =>
                  onFiltersChange({
                    preset: "custom",
                    startDate: event.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
              <input
                type="date"
                value={filters.endDate}
                onChange={(event) =>
                  onFiltersChange({
                    preset: "custom",
                    endDate: event.target.value,
                  })
                }
                className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
              />
            </div>
          ) : null}
        </Panel>
      </div>

      {error ? (
        <Panel className="border-rose-200 bg-rose-50/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-rose-800">
                {t("overview.loadError")}
              </p>
              <p className="mt-1 text-sm font-medium text-rose-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-bold text-black"
            >
              {t("common.retry")}
            </button>
          </div>
        </Panel>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title={t("overview.websiteViews")}
          value={loading ? "—" : formatNumber(data?.website.totalViews || 0)}
          subtitle={
            loading
              ? t("overview.loadingVisitors")
              : t("overview.uniqueVisitors", {
                  count: formatNumber(data?.website.uniqueVisitors || 0),
                })
          }
          change={data?.website.viewsChange || 0}
          series={(data?.website.viewsSeries || []).map((item) => item.value)}
          icon={<Eye size={20} />}
          accent="violet"
        />
        <KpiCard
          title={t("overview.newLeads")}
          value={loading ? "—" : formatNumber(data?.leads.newCount || 0)}
          subtitle={
            loading
              ? t("overview.loadingLeads")
              : t("overview.untreatedLeads", {
                  count: formatNumber(data?.leads.untreatedCount || 0),
                })
          }
          change={data?.leads.change || 0}
          series={(data?.leads.series || []).map((item) => item.value)}
          icon={<UserPlus size={20} />}
          accent="blue"
        />
        <KpiCard
          title={t("overview.reviews")}
          value={
            loading
              ? "—"
              : (data?.reviews.totalCount || 0) > 0
                ? (data?.reviews.averageRating || 0).toFixed(1)
                : "0"
          }
          subtitle={
            loading
              ? t("overview.loadingReviews")
              : t("overview.reviewsSubtitle", {
                  newCount: formatNumber(data?.reviews.newCount || 0),
                  totalCount: formatNumber(data?.reviews.totalCount || 0),
                })
          }
          change={data?.reviews.change || 0}
          series={(data?.reviews.series || []).map((item) => item.value)}
          icon={<Star size={20} />}
          accent="amber"
        />
        <KpiCard
          title={t("overview.collaborations")}
          value={
            loading
              ? "—"
              : formatNumber(data?.collaborations.totalInPeriod || 0)
          }
          subtitle={
            loading
              ? t("overview.loadingCollaborations")
              : t("overview.collabSubtitle", {
                  approved: formatNumber(data?.collaborations.newInPeriod || 0),
                  total: formatNumber(data?.collaborations.totalInPeriod || 0),
                })
          }
          change={data?.collaborations.change || 0}
          series={(data?.collaborations.series || []).map((item) => item.value)}
          icon={<Handshake size={20} />}
          accent="pink"
        />
      </section>

      {aiInsightsError ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50/70 px-5 py-4 text-sm font-bold text-rose-700">
          {aiInsightsError}
        </div>
      ) : null}

      <AiInsightsPanel
        insights={aiInsights}
        loading={aiInsightsLoading}
        businessId={businessId}
      />

      <Panel className="p-3">
        <div className="flex flex-wrap gap-2">
          {[
            { label: t("overview.addLead"), icon: <UserPlus size={16} />, to: `${basePath}/crm/leads` },
            {
              label: t("overview.newAppointment"),
              icon: <CalendarPlus size={16} />,
              to: `${basePath}/crm/appointments`,
            },
            { label: t("overview.editWebsite"), icon: <Pencil size={16} />, to: `${basePath}/website` },
            {
              label: t("overview.createCollaboration"),
              icon: <Handshake size={16} />,
              to: `${basePath}/collab/find-partner`,
            },
          ].map((action) => (
            <button
              key={action.label}
              type="button"
              onClick={() => navigate(action.to)}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:border-violet-300 hover:text-violet-700"
            >
              {action.icon}
              {action.label}
            </button>
          ))}
          <button
            type="button"
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600"
            aria-label={t("overview.moreActions")}
          >
            <MoreHorizontal size={16} />
          </button>
        </div>
      </Panel>

      <Panel className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-800">
              {t("overview.performanceOverview")}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {PERFORMANCE_TABS.map((metric) => (
              <button
                key={metric}
                type="button"
                onClick={() => onFiltersChange({ performanceMetric: metric })}
                className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${
                  filters.performanceMetric === metric
                    ? "bg-gradient-to-l from-violet-100 via-sky-100 to-cyan-100 border border-violet-200/70 text-slate-800"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {t(
                  `overview.metric${metric.charAt(0).toUpperCase()}${metric.slice(1)}`
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {RESOLUTIONS.map((resolution) => (
              <button
                key={resolution}
                type="button"
                onClick={() => onFiltersChange({ resolution })}
                className={`rounded-full px-3 py-2 text-xs font-bold capitalize ${
                  filters.resolution === resolution
                    ? "border border-violet-300 bg-violet-50 text-violet-700"
                    : "border border-slate-200 bg-white text-slate-600"
                }`}
              >
                {t(`common.${resolution === "day" ? "day" : resolution}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 h-[320px] w-full">
          {performanceChartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceChartData}>
                <CartesianGrid stroke="#eef2ff" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="current"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={false}
                  name={t("overview.thisPeriod")}
                />
                <Line
                  type="monotone"
                  dataKey="previous"
                  stroke="#c4b5fd"
                  strokeWidth={2}
                  strokeDasharray="6 6"
                  dot={false}
                  name={t("overview.previousPeriod")}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyBlock
              title={t("overview.noPerformanceTitle")}
              description={t("overview.noPerformanceText")}
            />
          )}
        </div>
      </Panel>

      <section className="grid gap-5 xl:grid-cols-2">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {t("overview.latestLeads")}
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/crm/leads`)}
              className="text-sm font-bold text-violet-700"
            >
              {t("common.viewAll")}
            </button>
          </div>

          {(data?.leads.latest || []).length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-start text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500">
                    <th className="py-3 pe-3 font-semibold">{t("overview.name")}</th>
                    <th className="py-3 pe-3 font-semibold">{t("overview.source")}</th>
                    <th className="py-3 pe-3 font-semibold">{t("overview.status")}</th>
                    <th className="py-3 font-semibold">{t("overview.time")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.leads.latest.map((lead) => (
                    <tr key={lead.id} className="border-b border-slate-50">
                      <td className="py-3 pr-3 font-bold text-slate-900">{lead.name}</td>
                      <td className="py-3 pr-3 text-slate-600">
                        {formatLeadSource(lead.source)}
                      </td>
                      <td className="py-3 pr-3">
                        <StatusBadge
                          label={formatLeadStatus(lead.status)}
                          tone={lead.status === "new" ? "violet" : "neutral"}
                        />
                      </td>
                      <td className="py-3 text-slate-500">
                        {formatRelativeTime(lead.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyBlock
              title={t("overview.noLeadsTitle")}
              description={t("overview.noLeadsText")}
            />
          )}
        </Panel>

        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-800">
                {t("overview.upcomingAppointments")}
              </h3>
              <p className="text-sm font-medium text-slate-500">
                {t("overview.next7Days")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/crm/appointments`)}
              className="text-sm font-bold text-violet-700"
            >
              {t("overview.viewCalendar")}
            </button>
          </div>

          {upcomingAppointments.length ? (
            <div className="space-y-3">
              {upcomingAppointments.map((appointment) => {
                const badge = formatAppointmentBadge(appointment.date);
                const isConfirmed =
                  appointment.status === "Confirmed" ||
                  appointment.status === t("overview.confirmed");

                return (
                  <div
                    key={appointment.id}
                    className="flex items-center gap-4 rounded-[22px] border border-slate-100 bg-white p-4 shadow-[0_8px_24px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex min-w-[68px] flex-col items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 px-3 py-2 text-violet-700">
                      <div className="text-[10px] font-black uppercase tracking-[0.14em]">
                        {badge.month}
                      </div>
                      <div className="text-2xl font-black leading-none">{badge.day}</div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-black text-slate-800">
                        {appointment.clientName
                          ? t("overview.withClient", {
                              title: appointment.title,
                              client: appointment.clientName,
                            })
                          : appointment.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {appointment.time}
                      </p>
                    </div>

                    <StatusBadge
                      label={
                        appointment.status === "Confirmed"
                          ? t("overview.confirmed")
                          : appointment.status === "Pending"
                            ? t("overview.pending")
                            : appointment.status
                      }
                      tone={isConfirmed ? "success" : "warning"}
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyBlock
              title={t("overview.noAppointmentsTitle")}
              description={t("overview.noAppointmentsText")}
            />
          )}
        </Panel>
      </section>
    </div>
  );
}
