import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  CalendarCheck2,
  CalendarPlus,
  Eye,
  Handshake,
  MoreHorizontal,
  Pencil,
  Settings2,
  Sparkles,
  TrendingUp,
  UserPlus,
} from "lucide-react";

import DashboardSkeleton from "@/components/DashboardSkeleton";

import type {
  DashboardFilters,
  DashboardOverviewData,
  DatePreset,
  PerformanceMetric,
} from "./dashboardOverviewTypes";
import {
  buildBusinessGreeting,
  buildUpcomingAppointmentsFromCalendar,
  countUpcomingAppointmentsNext7Days,
  formatDateRangeLabel,
  formatLeadSource,
  formatLeadStatus,
  formatNextAppointmentLabel,
  formatNumber,
  formatPercent,
  formatRelativeTime,
  getMaxValue,
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

const COLLAB_COLORS = ["#7c3aed", "#a78bfa", "#c4b5fd", "#ddd6fe"];

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_70px_rgba(88,28,135,0.08)] backdrop-blur-xl ${className}`}
    >
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-violet-100/50 blur-3xl" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function Sparkline({
  values,
  color = "#7c3aed",
}: {
  values: number[];
  color?: string;
}) {
  const points = values.length ? values : [0, 0, 0, 0, 0];
  const max = getMaxValue(points);
  const normalized = points.map((value, index) => ({
    x: index,
    y: 12 + ((value / max) * 76),
  }));

  const linePath = normalized
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x * 24} ${100 - point.y}`)
    .join(" ");
  const areaPath = `${linePath} L ${(points.length - 1) * 24} 100 L 0 100 Z`;

  return (
    <svg viewBox="0 0 120 100" className="h-14 w-28" preserveAspectRatio="none">
      <path d={areaPath} fill={`${color}22`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

function ChangeBadge({ value }: { value: number }) {
  const positive = value >= 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
        positive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-rose-50 text-rose-700"
      }`}
    >
      <TrendingUp
        size={12}
        className={positive ? "" : "rotate-180"}
      />
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
  accent?: "violet" | "blue" | "amber" | "pink";
}) {
  const accentMap = {
    violet: { stroke: "#7c3aed", soft: "bg-violet-50 text-violet-600" },
    blue: { stroke: "#2563eb", soft: "bg-blue-50 text-blue-600" },
    amber: { stroke: "#d97706", soft: "bg-amber-50 text-amber-600" },
    pink: { stroke: "#db2777", soft: "bg-pink-50 text-pink-600" },
  };

  const palette = accentMap[accent];

  return (
    <Panel className="min-h-[196px]">
      <div className="flex items-start justify-between gap-3">
        <div className={`rounded-2xl p-3 ${palette.soft}`}>{icon}</div>
        <ChangeBadge value={change} />
      </div>

      <div className="mt-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-1 text-[2rem] font-black leading-none tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
        </div>
        <Sparkline values={series} color={palette.stroke} />
      </div>
    </Panel>
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
    success: "bg-emerald-50 text-emerald-700",
    warning: "bg-amber-50 text-amber-700",
    danger: "bg-rose-50 text-rose-700",
    violet: "bg-violet-50 text-violet-700",
  };

  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone] || tones.neutral}`}>
      {label}
    </span>
  );
}

function ProgressBar({ value, max }: { value: number; max: number }) {
  const width = Math.max(6, Math.round((value / Math.max(max, 1)) * 100));

  return (
    <div className="h-2 rounded-full bg-slate-100">
      <div
        className="h-2 rounded-full bg-violet-500"
        style={{ width: `${width}%` }}
      />
    </div>
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
  const navigate = useNavigate();
  const { businessId } = useParams();

  const basePath = `/business/${businessId}/dashboard`;

  const upcomingFromCalendar = useMemo(
    () => buildUpcomingAppointmentsFromCalendar(calendarAppointments, 5),
    [calendarAppointments]
  );

  const upcomingAppointments =
    upcomingFromCalendar.length > 0
      ? upcomingFromCalendar
      : data?.appointments.upcoming || [];

  const futureAppointmentsCount =
    calendarAppointments.length > 0
      ? countUpcomingAppointmentsNext7Days(calendarAppointments)
      : data?.appointments.futureCount || 0;

  const nextAppointment =
    upcomingFromCalendar[0] || data?.appointments.nextAppointment || null;

  const performanceChartData = useMemo(() => {
    const current = data?.performance.current || [];
    const previous = data?.performance.previous || [];

    return current.map((point, index) => ({
      label: point.date,
      current: point.value,
      previous: previous[index]?.value ?? 0,
    }));
  }, [data?.performance]);

  const collabDonut = useMemo(() => {
    const overview = data?.collaborations.overview;
    if (!overview) return [];

    return [
      { name: "Active Collaborations", value: overview.activeCollaborations },
      { name: "Incoming Referrals", value: overview.incomingReferrals },
      { name: "Outgoing Referrals", value: overview.outgoingReferrals },
      { name: "Pending Requests", value: overview.pendingRequests },
    ].filter((item) => item.value > 0);
  }, [data?.collaborations.overview]);

  const topTrafficMax = getMaxValue(
    (data?.website.trafficSources || []).map((item) => item.visitors)
  );
  const topPagesMax = getMaxValue(
    (data?.website.topPages || []).map((item) => item.views)
  );

  if (loading && !data) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-5">
      <Panel className="p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-[2rem] font-black tracking-tight text-slate-950">
              {buildBusinessGreeting(businessName)}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Here&apos;s your business performance overview.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-start gap-3 xl:justify-end">
            {data?.customDomainConnected ? (
              <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                Custom domain connected
              </span>
            ) : null}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-violet-700 shadow-sm"
              aria-label="Customize dashboard"
            >
              <Settings2 size={16} />
              Customize Dashboard
            </button>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-wrap gap-2">
            {DATE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => onFiltersChange({ preset })}
                className={`rounded-full px-4 py-2 text-sm font-bold capitalize transition ${
                  filters.preset === preset
                    ? "bg-violet-600 text-white shadow-[0_10px_24px_rgba(124,58,237,0.25)]"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {preset === "custom" ? "Custom Range" : preset}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
              {formatDateRangeLabel(filters.startDate, filters.endDate)}
            </span>

            {filters.preset === "custom" ? (
              <div className="flex flex-wrap items-center gap-2">
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

            <label className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={filters.compareToPrevious}
                onChange={(event) =>
                  onFiltersChange({ compareToPrevious: event.target.checked })
                }
              />
              Compare to previous period
            </label>
          </div>
        </div>
      </Panel>

      {error ? (
        <Panel className="border-rose-200 bg-rose-50/70">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-black text-rose-800">
                Some dashboard data could not be loaded.
              </p>
              <p className="mt-1 text-sm font-medium text-rose-700">{error}</p>
            </div>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-2xl bg-rose-600 px-4 py-2 text-sm font-bold text-white"
            >
              Retry
            </button>
          </div>
        </Panel>
      ) : null}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Website Views"
          value={loading ? "—" : formatNumber(data?.website.totalViews || 0)}
          subtitle={
            loading
              ? "Loading visitors..."
              : `${formatNumber(data?.website.uniqueVisitors || 0)} unique visitors`
          }
          change={data?.website.viewsChange || 0}
          series={(data?.website.viewsSeries || []).map((item) => item.value)}
          icon={<Eye size={20} />}
          accent="violet"
        />
        <KpiCard
          title="New Leads"
          value={loading ? "—" : formatNumber(data?.leads.newCount || 0)}
          subtitle={
            loading
              ? "Loading untreated leads..."
              : `${formatNumber(data?.leads.untreatedCount || 0)} untreated leads`
          }
          change={data?.leads.change || 0}
          series={(data?.leads.series || []).map((item) => item.value)}
          icon={<UserPlus size={20} />}
          accent="blue"
        />
        <KpiCard
          title="Future Appointments"
          value={loading ? "—" : formatNumber(futureAppointmentsCount)}
          subtitle={
            loading
              ? "Loading next appointment..."
              : formatNextAppointmentLabel(
                  nextAppointment?.date,
                  nextAppointment?.time
                )
          }
          change={data?.appointments.change || 0}
          series={(data?.appointments.series || []).map((item) => item.value)}
          icon={<CalendarCheck2 size={20} />}
          accent="amber"
        />
        <KpiCard
          title="Collaborations"
          value={loading ? "—" : formatNumber(data?.collaborations.totalInPeriod || 0)}
          subtitle={
            loading
              ? "Loading collaborations..."
              : `${formatNumber(data?.collaborations.newInPeriod || 0)} new this period`
          }
          change={data?.collaborations.change || 0}
          series={(data?.collaborations.series || []).map((item) => item.value)}
          icon={<Handshake size={20} />}
          accent="pink"
        />
      </section>

      <section className="flex flex-wrap gap-3">
        {[
          { label: "Add Lead", icon: <UserPlus size={16} />, to: `${basePath}/crm/leads` },
          {
            label: "New Appointment",
            icon: <CalendarPlus size={16} />,
            to: `${basePath}/crm/appointments`,
          },
          { label: "Edit Website", icon: <Pencil size={16} />, to: `${basePath}/website` },
          {
            label: "Create Collaboration",
            icon: <Handshake size={16} />,
            to: `${basePath}/collab/find-partner`,
          },
        ].map((action) => (
          <button
            key={action.label}
            type="button"
            onClick={() => navigate(action.to)}
            className="inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-violet-300 hover:text-violet-700"
          >
            {action.icon}
            {action.label}
          </button>
        ))}
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-3 py-2.5 text-slate-600"
          aria-label="More actions"
        >
          <MoreHorizontal size={16} />
        </button>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <Panel className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-950">Performance Overview</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Current period vs previous period
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {PERFORMANCE_TABS.map((metric) => (
                <button
                  key={metric}
                  type="button"
                  onClick={() => onFiltersChange({ performanceMetric: metric })}
                  className={`rounded-full px-4 py-2 text-sm font-bold capitalize ${
                    filters.performanceMetric === metric
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {metric}
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
                  {resolution}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 h-[340px] w-full">
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
                    name="This period"
                  />
                  <Line
                    type="monotone"
                    dataKey="previous"
                    stroke="#c4b5fd"
                    strokeWidth={2}
                    strokeDasharray="6 6"
                    dot={false}
                    name="Previous period"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyBlock
                title="No performance data yet"
                description="Activity in this range will appear here automatically."
              />
            )}
          </div>
        </Panel>

        <div className="grid gap-5">
          <Panel>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">Latest Leads</h3>
                <p className="text-sm font-medium text-slate-500">Up to 5 recent leads</p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`${basePath}/crm/leads`)}
                className="text-sm font-bold text-violet-700"
              >
                View all
              </button>
            </div>

            {(data?.leads.latest || []).length ? (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-500">
                      <th className="py-3 pr-3 font-semibold">Name</th>
                      <th className="py-3 pr-3 font-semibold">Source</th>
                      <th className="py-3 pr-3 font-semibold">Status</th>
                      <th className="py-3 font-semibold">Time</th>
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
                title="No leads yet"
                description="New leads from your website, ads, and CRM will show up here."
              />
            )}
          </Panel>

          <Panel>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-slate-950">Upcoming Appointments</h3>
                <p className="text-sm font-medium text-slate-500">
                  Next 7 days from your calendar
                </p>
              </div>
              <button
                type="button"
                onClick={() => navigate(`${basePath}/crm/appointments`)}
                className="text-sm font-bold text-violet-700"
              >
                View calendar
              </button>
            </div>

            {upcomingAppointments.length ? (
              <div className="space-y-3">
                {upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="flex flex-col gap-3 rounded-[22px] border border-slate-100 bg-slate-50/70 p-4 sm:flex-row sm:items-center"
                  >
                    <div className="min-w-[72px] rounded-2xl bg-violet-600 px-3 py-2 text-center text-white">
                      <div className="text-[10px] font-bold uppercase tracking-wide">
                        {appointment.date.slice(5, 7)}
                      </div>
                      <div className="text-2xl font-black">
                        {appointment.date.slice(8, 10)}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-black text-slate-950">
                        {appointment.clientName
                          ? `${appointment.title} · ${appointment.clientName}`
                          : appointment.title}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-500">
                        {appointment.time}
                      </p>
                    </div>
                    <StatusBadge
                      label={appointment.status}
                      tone={
                        appointment.status === "Confirmed" ? "success" : "warning"
                      }
                    />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyBlock
                title="No upcoming appointments"
                description="Appointments scheduled in the next 7 days will appear here."
              />
            )}
          </Panel>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <Panel>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Collaborations Overview
              </h3>
              <p className="text-sm font-medium text-slate-500">
                Active, referrals, and pending requests
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate(`${basePath}/collab/profile`)}
              className="text-sm font-bold text-violet-700"
            >
              View all
            </button>
          </div>

          {collabDonut.length ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={collabDonut}
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {collabDonut.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLLAB_COLORS[index % COLLAB_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-2 space-y-2">
                {collabDonut.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-2 font-medium text-slate-600">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            COLLAB_COLORS[index % COLLAB_COLORS.length],
                        }}
                      />
                      {item.name}
                    </span>
                    <span className="font-black text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyBlock
              title="No collaborations yet"
              description="Partnerships and proposals will be summarized here."
            />
          )}
        </Panel>

        <Panel>
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-950">Top Pages</h3>
            <p className="text-sm font-medium text-slate-500">
              Most viewed published pages
            </p>
          </div>

          {(data?.website.topPages || []).length ? (
            <div className="space-y-4">
              {data?.website.topPages.map((page) => (
                <div key={`${page.pageId}-${page.pageSlug}`}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold text-slate-900">{page.page}</p>
                      <p className="text-sm font-medium text-slate-500">
                        {formatNumber(page.views)} views · {formatPercent(page.change)}
                      </p>
                    </div>
                  </div>
                  <ProgressBar value={page.views} max={topPagesMax} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyBlock
              title="No page views yet"
              description="Publish your website and traffic will be tracked automatically."
            />
          )}
        </Panel>

        <Panel>
          <div className="mb-4">
            <h3 className="text-lg font-black text-slate-950">Traffic Sources</h3>
            <p className="text-sm font-medium text-slate-500">
              Visitors by source in the selected range
            </p>
          </div>

          {(data?.website.trafficSources || []).some((item) => item.visitors > 0) ? (
            <div className="space-y-4">
              {data?.website.trafficSources.map((source) => (
                <div key={source.source}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <p className="font-bold text-slate-900">{source.label}</p>
                    <p className="text-sm font-medium text-slate-500">
                      {formatNumber(source.visitors)} · {formatPercent(source.change)}
                    </p>
                  </div>
                  <ProgressBar value={source.visitors} max={topTrafficMax} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyBlock
              title="No traffic sources yet"
              description="Referrers and UTM tags will appear after your first visits."
            />
          )}
        </Panel>
      </section>
    </div>
  );
}
