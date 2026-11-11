import React, { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
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
  Eye,
  Handshake,
  Megaphone,
  MessageCircle,
  Pencil,
  Star,
  UserPlus,
} from "lucide-react";

import BizuplyLoader from "@/components/ui/BizuplyLoader";
import AiInsightsPanel from "@/components/AiInsightsPanel";
import useAiInsights from "@/hooks/useAiInsights";
import { useAuth } from "@/context/AuthContext";
import { isModuleEnabled } from "@/utils/moduleAccess";
import { hasWhatsAppApiProduct } from "@/utils/whatsappApiPortal";
import { isGuidedDemoActive } from "@/guidedDemo/sessionStore";
import { DEMO_DASHBOARD_OVERLAY, getDemoActivityTimeline } from "@/guidedDemo/demoOverlayData";
import { canSeeRestrictedNav } from "@/components/BusinessWorkspaceNav";

import type {
  DashboardFilters,
  DashboardOverviewData,
  DatePreset,
  PerformanceMetric,
} from "./dashboardOverviewTypes";
import {
  buildUpcomingAppointmentsFromCalendar,
  displayLeadName,
  formatDateRangeLabel,
  formatLeadEntered,
  formatLeadSource,
  formatLeadStatus,
  formatNumber,
  formatPercent,
  type CalendarAppointment,
} from "./dashboardOverviewUtils";
import {
  buildAttentionItems,
  resolveDashboardSurfaces,
  seriesHasActivity,
  summarizeMessageSample,
  summarizeWhatsAppCampaigns,
} from "./dashboardVisibility";
import DashboardModulePanels from "./DashboardModulePanels";
import { useDashboardModuleReads } from "./useDashboardModuleReads";
import { useWhatsAppDashboardReads } from "./useWhatsAppDashboardReads";
import "./dashboardCommand.css";

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

type AccessUser = {
  enabledModules?: string[] | null;
  entitlements?: unknown;
  businessId?: string | null;
  isGuidedDemo?: boolean;
  isShowcaseDemo?: boolean;
  automationsAccessible?: boolean;
  role?: string | null;
  subscriptionPlan?: string | null;
  activeProducts?: unknown;
};

const DATE_PRESETS: DatePreset[] = ["today", "week", "month", "year", "custom"];
const FUNNEL_COLORS = ["#321064", "#5B21B6", "#7437F5", "#3D63FF", "#8EA2FF", "#C4B5FD"];
const PERFORMANCE_TABS: PerformanceMetric[] = [
  "views",
  "leads",
  "appointments",
  "collaborations",
];
const RESOLUTIONS = ["day", "week", "month", "year"] as const;

function navModuleVisible(
  user: AccessUser | null | undefined,
  businessId: string | undefined,
  moduleKey: "whatsapp" | "meta-campaigns"
) {
  const enabledModules = user?.enabledModules ?? null;
  const explicit =
    Array.isArray(enabledModules) &&
    enabledModules.length > 0 &&
    enabledModules.includes(moduleKey);
  const allowed =
    canSeeRestrictedNav(user?.businessId || businessId) ||
    Boolean(user?.isGuidedDemo) ||
    explicit ||
    (moduleKey === "whatsapp" && hasWhatsAppApiProduct(user));
  if (!allowed) return false;
  if (user?.isGuidedDemo) return isModuleEnabled(enabledModules, moduleKey);
  if (user?.isShowcaseDemo) return true;
  return isModuleEnabled(enabledModules, moduleKey);
}

function Kpi({
  label,
  value,
  detail,
  delta,
  onClick,
  demoTarget,
}: {
  label: string;
  value: string;
  detail: string;
  delta?: string | null;
  onClick?: () => void;
  demoTarget?: string;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        className="bx-kpi bx-rise"
        onClick={onClick}
        data-demo-target={demoTarget}
      >
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bx-row" style={{ justifyContent: "space-between" }}>
        <span>{detail}</span>
        {delta ? <b className="bx-delta">{delta}</b> : null}
      </div>
    </button>
    );
  }

  return (
    <article className="bx-kpi bx-rise" data-demo-target={demoTarget}>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bx-row" style={{ justifyContent: "space-between" }}>
        <span>{detail}</span>
        {delta ? <b className="bx-delta">{delta}</b> : null}
      </div>
    </article>
  );
}

function Empty({ title, text }: { title: string; text: string }) {
  return (
    <div className="bx-empty">
      <strong>{title}</strong>
      <span className="bx-note">{text}</span>
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
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { businessId } = useParams();
  const { user } = useAuth() as { user?: AccessUser | null };
  const basePath = `/business/${businessId}/dashboard`;
  const demoMode = isGuidedDemoActive();
  const demoKpis = DEMO_DASHBOARD_OVERLAY;
  const surfaces = resolveDashboardSurfaces({
    enabledModules: user?.enabledModules ?? null,
    entitlements: user?.entitlements,
    whatsappInNav: navModuleVisible(user, businessId, "whatsapp"),
    metaInNav: navModuleVisible(user, businessId, "meta-campaigns"),
    automationsAccessible: user?.automationsAccessible,
  });
  const whatsappReads = useWhatsAppDashboardReads(
    typeof businessId === "string" ? businessId : undefined,
    surfaces.whatsapp && !demoMode
  );
  const moduleReads = useDashboardModuleReads({
    businessId: typeof businessId === "string" ? businessId : undefined,
    leads: surfaces.leads && !demoMode,
    website: surfaces.website && !demoMode,
    meta: surfaces.metaCampaigns && !demoMode,
    automations: surfaces.automations && !demoMode,
    since: filters.startDate,
    until: filters.endDate,
  });

  const visiblePerformanceTabs = PERFORMANCE_TABS.filter((metric) => {
    if (metric === "views") return surfaces.website;
    if (metric === "leads") return surfaces.leads;
    if (metric === "appointments") return surfaces.appointments;
    if (metric === "collaborations") return surfaces.collaborations;
    return false;
  });

  const { insights: aiInsights, loading: aiInsightsLoading, error: aiInsightsError } =
    useAiInsights(
      surfaces.advisor && typeof businessId === "string" ? businessId : undefined
    );

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

  const chartHasActivity = seriesHasActivity(
    performanceChartData.flatMap((point) => [
      { value: point.current },
      { value: point.previous },
    ])
  );

  const messageSample = summarizeMessageSample(
    whatsappReads.overview?.recentLogs || []
  );
  const campaignSummary = summarizeWhatsAppCampaigns(whatsappReads.campaigns || []);
  const showComparison = filters.compareToPrevious;
  const numbersReady = Boolean(data);

  const attention = buildAttentionItems({
    showLeads: surfaces.leads,
    untreatedLeads: data?.leads.untreatedCount || 0,
    showAppointments: surfaces.appointments,
    upcomingAppointments: data?.appointments.futureCount || upcomingAppointments.length,
    showWhatsapp: surfaces.whatsapp && !demoMode,
    whatsappLoaded: whatsappReads.status === "ready",
    whatsappConnected: whatsappReads.overview?.connection?.connected ?? null,
    failedMessages: messageSample.failed,
    failedCampaigns: campaignSummary.byStatus.failed || 0,
    leadsHref: `${basePath}/crm/leads`,
    appointmentsHref: `${basePath}/crm/appointments`,
    whatsappHref: `${basePath}/whatsapp/messages/history`,
    connectionHref: `${basePath}/whatsapp/connection`,
  });

  useEffect(() => {
    if (
      visiblePerformanceTabs.length &&
      !visiblePerformanceTabs.includes(filters.performanceMetric)
    ) {
      onFiltersChange({ performanceMetric: visiblePerformanceTabs[0] });
    }
  }, [filters.performanceMetric, onFiltersChange, visiblePerformanceTabs]);

  if (loading && !data) {
    return <BizuplyLoader fullScreen label={t("overview.loadingDashboard")} />;
  }

  const count = (value: number) => (numbersReady || demoMode ? formatNumber(value) : "—");
  const delta = (value: number) => (showComparison ? formatPercent(value) : null);

  const quickActions = [
    surfaces.leads
      ? {
          label: t("overview.addLead"),
          icon: <UserPlus size={16} />,
          to: `${basePath}/crm/leads`,
          dataDemoTarget: "dashboard-quick-add-lead",
        }
      : null,
    surfaces.appointments
      ? {
          label: t("overview.newAppointment"),
          icon: <CalendarPlus size={16} />,
          to: `${basePath}/crm/appointments`,
        }
      : null,
    surfaces.website
      ? {
          label: t("overview.editWebsite"),
          icon: <Pencil size={16} />,
          to: `${basePath}/website`,
        }
      : null,
    surfaces.collaborations
      ? {
          label: t("overview.createCollaboration"),
          icon: <Handshake size={16} />,
          to: `${basePath}/collab/find-partner`,
        }
      : null,
    surfaces.whatsapp
      ? {
          label: t("overview.cmdOpenWhatsapp", "Open WhatsApp"),
          icon: <MessageCircle size={16} />,
          to: `${basePath}/whatsapp/overview`,
        }
      : null,
    surfaces.metaCampaigns
      ? {
          label: t("overview.cmdOpenMeta", "Open Meta campaigns"),
          icon: <Megaphone size={16} />,
          to: `${basePath}/meta-campaigns/campaigns`,
        }
        : null,
  ].filter(Boolean);

  const funnel = !demoMode ? moduleReads.leads.data?.funnel || [] : [];
  const funnelTotal = funnel.reduce((sum, stage) => sum + (stage.count || 0), 0);
  const newLeadCount = demoMode
    ? Math.max(data?.leads.newCount || 0, demoKpis.leads.newCount)
    : data?.leads.newCount || 0;
  const untreatedCount = demoMode
    ? Math.max(data?.leads.untreatedCount || 0, demoKpis.leads.untreatedCount)
    : data?.leads.untreatedCount || 0;

  return (
    <div className="bx-command">
      <section className="bx-hero">
        <header className="bx-hero-top">
          <div className="bx-hero-id">
            <h1 className="bx-title">
              {t("overview.greeting", {
                name: (businessName || t("overview.yourBusiness")).trim(),
              })}
            </h1>
            <p className="bx-sub">{formatDateRangeLabel(filters.startDate, filters.endDate)}</p>
          </div>

          <div className="bx-hero-controls">
            <div className="bx-row">
              {DATE_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`bx-chip ${filters.preset === preset ? "is-on" : ""}`}
                  onClick={() => onFiltersChange({ preset })}
                >
                  {preset === "custom" ? t("common.customRange") : t(`common.${preset}`)}
                </button>
              ))}
            </div>
            <label className="bx-field">
              <select
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
            </label>
          </div>
        </header>
        {filters.preset === "custom" ? (
          <div className="bx-row">
            <input
              className="bx-field"
              type="date"
              value={filters.startDate}
              onChange={(event) =>
                onFiltersChange({ preset: "custom", startDate: event.target.value })
              }
            />
            <input
              className="bx-field"
              type="date"
              value={filters.endDate}
              onChange={(event) =>
                onFiltersChange({ preset: "custom", endDate: event.target.value })
              }
            />
          </div>
        ) : null}
      </section>

      {quickActions.length ? (
        <section className="bx-actions" aria-label={t("overview.moreActions")}>
          {quickActions.map((action) => (
            <button
              key={action!.label}
              type="button"
              className="bx-btn"
              data-demo-target={action!.dataDemoTarget}
              onClick={() => navigate(action!.to)}
            >
              {action!.icon}
              {action!.label}
            </button>
          ))}
        </section>
      ) : null}

      {error ? (
        <section className="bx-panel bx-error">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <div>
              <h2>{t("overview.loadError")}</h2>
              <p className="bx-note">{error}</p>
            </div>
            <button type="button" className="bx-btn" onClick={onRetry}>
              {t("common.retry")}
            </button>
          </div>
        </section>
      ) : null}

      <section className="bx-snapshot" data-demo-target="dashboard-kpi-section">
        {surfaces.leads ? (
          <Kpi
            label={t("overview.newLeads")}
            value={count(newLeadCount)}
            detail={t("overview.cmdPipelineNote")}
            delta={delta(
              demoMode ? data?.leads.change || demoKpis.leads.change : data?.leads.change || 0
            )}
            onClick={() => navigate(`${basePath}/crm/leads`)}
            demoTarget="dashboard-kpi-new-leads"
          />
        ) : null}
        {surfaces.leads ? (
          <Kpi
            label={t("overview.cmdNeedsAction", "Needs action")}
            value={count(untreatedCount)}
            detail={t("overview.cmdUntreated", {
              count: count(untreatedCount),
            })}
            onClick={() => navigate(`${basePath}/crm/leads?status=new`)}
          />
        ) : null}
        {surfaces.appointments ? (
          <Kpi
            label={t("overview.upcomingAppointments")}
            value={count(data?.appointments.futureCount || upcomingAppointments.length)}
            detail={t("overview.next7Days")}
            delta={delta(data?.appointments.change || 0)}
            onClick={() => navigate(`${basePath}/crm/appointments`)}
            demoTarget="dashboard-upcoming-appointments"
          />
        ) : null}
        {surfaces.whatsapp && !demoMode ? (
          <Kpi
            label={t("overview.cmdSent7", "WhatsApp sends, 7 days")}
            value={
              whatsappReads.overview
                ? formatNumber(whatsappReads.overview.stats?.sentLast7Days || 0)
                : "—"
            }
            detail={t("overview.cmdRecentNote")}
            onClick={() => navigate(`${basePath}/whatsapp/overview`)}
          />
        ) : null}
        {surfaces.website &&
        !(surfaces.leads && surfaces.appointments && surfaces.whatsapp && !demoMode) ? (
          <Kpi
            label={t("overview.websiteViews")}
            value={count(
              demoMode
                ? Math.max(data?.website.totalViews || 0, demoKpis.website.totalViews)
                : data?.website.totalViews || 0
            )}
            detail={t("overview.uniqueVisitors", {
              count: count(
                demoMode
                  ? Math.max(data?.website.uniqueVisitors || 0, demoKpis.website.uniqueVisitors)
                  : data?.website.uniqueVisitors || 0
              ),
            })}
            onClick={() => navigate(`${basePath}/website`)}
          />
        ) : null}
      </section>

      <section className="bx-work">
        <div className="bx-stage" data-demo-target="dashboard-performance-chart">
          {visiblePerformanceTabs.length ? (
            <>
              <div className="bx-row">
                <h2>{t("overview.performanceOverview")}</h2>
                {visiblePerformanceTabs.map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    className={`bx-chip ${filters.performanceMetric === metric ? "is-on" : ""}`}
                    onClick={() => onFiltersChange({ performanceMetric: metric })}
                  >
                    {t(`overview.metric${metric.charAt(0).toUpperCase()}${metric.slice(1)}`)}
                  </button>
                ))}
              </div>
              <div className="bx-chart">
                {chartHasActivity ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceChartData}>
                      <CartesianGrid stroke="#efeaf8" vertical={false} />
                      <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#5c5470" }} />
                      <YAxis width={36} tick={{ fontSize: 11, fill: "#5c5470" }} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="current"
                        stroke="#5B21B6"
                        strokeWidth={2.5}
                        dot={false}
                        name={t("overview.thisPeriod")}
                      />
                      {showComparison ? (
                        <Line
                          type="monotone"
                          dataKey="previous"
                          stroke="#3D63FF"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name={t("overview.previousPeriod")}
                        />
                      ) : null}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Empty
                    title={t("overview.noPerformanceTitle")}
                    text={t("overview.noPerformanceText")}
                  />
                )}
              </div>
            </>
          ) : null}

          {surfaces.leads && !demoMode && moduleReads.leads.status !== "idle" ? (
            <div className="bx-funnel-block">
              <div className="bx-row">
                <h2>{t("overview.cmdPipeline", "Sales pipeline")}</h2>
                <span className="bx-note">{t("overview.cmdPipelineNote")}</span>
              </div>
              {moduleReads.leads.status === "error" ? (
                <p className="bx-note">{moduleReads.leads.message}</p>
              ) : null}
              {funnelTotal > 0 ? (
                <>
                  <div className="bx-funnel-bar" role="list">
                    {funnel.map((stage, index) => (
                      <button
                        key={stage.key}
                        type="button"
                        role="listitem"
                        title={`${stage.label} ${formatNumber(stage.count)}`}
                        style={{
                          flexGrow: stage.count || 0,
                          background: FUNNEL_COLORS[index % FUNNEL_COLORS.length],
                        }}
                        onClick={() =>
                          navigate(`${basePath}/crm/leads?status=${encodeURIComponent(stage.key)}`)
                        }
                      />
                    ))}
                  </div>
                  <div className="bx-funnel-legend">
                    {funnel.map((stage, index) => (
                      <button
                        key={stage.key}
                        type="button"
                        className="bx-chip"
                        onClick={() =>
                          navigate(`${basePath}/crm/leads?status=${encodeURIComponent(stage.key)}`)
                        }
                      >
                        <i style={{ background: FUNNEL_COLORS[index % FUNNEL_COLORS.length] }} />
                        {stage.label}
                        <b>{formatNumber(stage.count)}</b>
                      </button>
                    ))}
                  </div>
                </>
              ) : moduleReads.leads.status === "ready" ? (
                <p className="bx-note">{t("overview.noLeadsText")}</p>
              ) : null}
            </div>
          ) : null}
        </div>

        <aside className="bx-side">
          {surfaces.leads ? (
            <div data-demo-target="dashboard-latest-leads">
              <div className="bx-row">
                <h2>{t("overview.latestLeads")}</h2>
                <button
                  type="button"
                  className="bx-btn"
                  onClick={() => navigate(`${basePath}/crm/leads`)}
                >
                  {t("common.viewAll")}
                </button>
              </div>
              {(data?.leads.latest || []).length ? (
                <div className="bx-list">
                  {[...(data?.leads.latest || [])]
                    .sort((left, right) => {
                      const leftAt = left.createdAt ? Date.parse(String(left.createdAt)) : 0;
                      const rightAt = right.createdAt ? Date.parse(String(right.createdAt)) : 0;
                      return (Number.isFinite(rightAt) ? rightAt : 0) - (Number.isFinite(leftAt) ? leftAt : 0);
                    })
                    .map((lead) => {
                      const name = displayLeadName(lead.name);
                      const entered = formatLeadEntered(lead.createdAt);
                      const source = String(lead.source || "").trim()
                        ? formatLeadSource(lead.source)
                        : "";
                      return (
                        <button
                          key={lead.id}
                          type="button"
                          className="bx-lead"
                          title={name}
                          onClick={() =>
                            lead.id
                              ? navigate(
                                  `${basePath}/crm/leads?leadId=${encodeURIComponent(lead.id)}`
                                )
                              : navigate(`${basePath}/crm/leads`)
                          }
                        >
                          <span className="bx-lead-main">
                            <strong>{name}</strong>
                            {entered ? <span className="bx-note">{entered}</span> : null}
                          </span>
                          {source ? <span className="bx-note">{source}</span> : null}
                          <span className="bx-status">{formatLeadStatus(lead.status)}</span>
                        </button>
                      );
                    })}
                </div>
              ) : (
                <Empty title={t("overview.noLeadsTitle")} text={t("overview.noLeadsText")} />
              )}
            </div>
          ) : null}

          <div>
            <h2>{t("overview.cmdAttention", "Needs attention")}</h2>
            {attention.filter((item) => item.id !== "untreated" && item.id !== "appointments").length ? (
              <div className="bx-attention">
                {attention
                  .filter((item) => item.id !== "untreated" && item.id !== "appointments")
                  .map((item) => (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={(event) => {
                      event.preventDefault();
                      navigate(item.href);
                    }}
                  >
                    <span>
                      {item.id === "untreated"
                        ? t("overview.cmdUntreated", { count: formatNumber(item.count) })
                        : item.id === "appointments"
                          ? t("overview.cmdUpcoming", { count: formatNumber(item.count) })
                          : item.id === "wa-failed"
                            ? t("overview.cmdWaFailed", { count: formatNumber(item.count) })
                            : item.id === "campaign-failed"
                              ? t("overview.cmdCampaignFailed", { count: formatNumber(item.count) })
                              : t("overview.cmdWaConnect")}
                    </span>
                  </a>
                ))}
              </div>
            ) : (
              <p className="bx-note">{t("overview.cmdAttentionClear")}</p>
            )}
          </div>
        </aside>
      </section>

      <DashboardModulePanels
        leads={null}
        sites={surfaces.website && !demoMode ? moduleReads.sites : null}
        meta={surfaces.metaCampaigns && !demoMode ? moduleReads.meta : null}
        automations={surfaces.automations && !demoMode ? moduleReads.automations : null}
        appointments={null}
        health={surfaces.whatsapp && !demoMode ? whatsappReads.health : null}
        conversations={null}
        whatsapp={
          surfaces.whatsapp && !demoMode
            ? {
                status: whatsappReads.status,
                connected: whatsappReads.overview?.connection?.connected ?? null,
                message: whatsappReads.message,
              }
            : null
        }
        onOpen={(path) => navigate(`${basePath}/${path}`)}
      />

      {demoMode ? (
        <section className="bx-mod" data-demo-target="dashboard-recent-activity">
          <h2>{t("leftover.dashboard.recentActivity", "Recent activity")}</h2>
          <div className="bx-list">
            {getDemoActivityTimeline().map((item) => (
              <article key={item.id}>
                <span>{item.text}</span>
                <span className="bx-note">{item.time}</span>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {surfaces.advisor && aiInsightsError ? (
        <div className="bx-panel bx-error">{aiInsightsError}</div>
      ) : null}
      {surfaces.advisor ? (
        <AiInsightsPanel
          insights={aiInsights}
          loading={aiInsightsLoading}
          businessId={businessId}
        />
      ) : null}
    </div>
  );
}
