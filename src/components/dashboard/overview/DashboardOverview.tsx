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
  formatAppointmentBadge,
  formatDateRangeLabel,
  formatLeadDate,
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
  role?: string | null;
  subscriptionPlan?: string | null;
  activeProducts?: unknown;
};

const DATE_PRESETS: DatePreset[] = ["today", "week", "month", "year", "custom"];
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
  });
  const whatsappReads = useWhatsAppDashboardReads(
    typeof businessId === "string" ? businessId : undefined,
    surfaces.whatsapp && !demoMode
  );

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

  return (
    <div className="bx-command">
      <header className="bx-rise">
        <p className="bx-kicker">{t("overview.cmdKicker", "Control center")}</p>
        <h1 className="bx-title">
          {t("overview.greeting", {
            name: (businessName || t("overview.yourBusiness")).trim(),
          })}
        </h1>
        <p className="bx-sub">
          {formatDateRangeLabel(filters.startDate, filters.endDate)}
          {surfaces.whatsapp
            ? ` · ${t(
                "overview.cmdWhatsappWindow",
                "WhatsApp sends shown here are the stored last 7 days, not this range."
              )}`
            : ""}
        </p>
      </header>

      <section className="bx-panel bx-rise">
        <div className="bx-row" style={{ justifyContent: "space-between" }}>
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
        {filters.preset === "custom" ? (
          <div className="bx-row" style={{ marginTop: "0.75rem" }}>
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

      <section className="bx-kpis" data-demo-target="dashboard-kpi-section">
        {surfaces.leads ? (
          <Kpi
            label={t("overview.newLeads")}
            value={count(
              demoMode
                ? Math.max(data?.leads.newCount || 0, demoKpis.leads.newCount)
                : data?.leads.newCount || 0
            )}
            detail={t("overview.untreatedLeads", {
              count: count(
                demoMode
                  ? Math.max(data?.leads.untreatedCount || 0, demoKpis.leads.untreatedCount)
                  : data?.leads.untreatedCount || 0
              ),
            })}
            delta={delta(
              demoMode ? data?.leads.change || demoKpis.leads.change : data?.leads.change || 0
            )}
            onClick={() => navigate(`${basePath}/crm/leads`)}
            demoTarget="dashboard-kpi-new-leads"
          />
        ) : null}
        {surfaces.appointments ? (
          <Kpi
            label={t("overview.upcomingAppointments")}
            value={count(data?.appointments.futureCount || upcomingAppointments.length)}
            detail={t("overview.next7Days")}
            delta={delta(data?.appointments.change || 0)}
            onClick={() => navigate(`${basePath}/crm/appointments`)}
          />
        ) : null}
        {surfaces.website ? (
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
            delta={delta(
              demoMode
                ? data?.website.viewsChange || demoKpis.website.viewsChange
                : data?.website.viewsChange || 0
            )}
            onClick={() => navigate(`${basePath}/website`)}
          />
        ) : null}
        {surfaces.reviews ? (
          <Kpi
            label={t("overview.reviews")}
            value={
              !numbersReady && !demoMode
                ? "—"
                : demoMode
                  ? demoKpis.reviews.averageRating.toFixed(1)
                  : (data?.reviews.totalCount || 0) > 0
                    ? (data?.reviews.averageRating || 0).toFixed(1)
                    : "0"
            }
            detail={t("overview.reviewsSubtitle", {
              newCount: count(
                demoMode
                  ? Math.max(data?.reviews.newCount || 0, demoKpis.reviews.newCount)
                  : data?.reviews.newCount || 0
              ),
              totalCount: count(
                demoMode
                  ? Math.max(data?.reviews.totalCount || 0, demoKpis.reviews.totalCount)
                  : data?.reviews.totalCount || 0
              ),
            })}
            delta={delta(
              demoMode ? data?.reviews.change || demoKpis.reviews.change : data?.reviews.change || 0
            )}
          />
        ) : null}
        {surfaces.collaborations ? (
          <Kpi
            label={t("overview.collaborations")}
            value={count(
              demoMode
                ? Math.max(
                    data?.collaborations.totalInPeriod || 0,
                    demoKpis.collaborations.totalInPeriod
                  )
                : data?.collaborations.totalInPeriod || 0
            )}
            detail={t("overview.collabSubtitle", {
              approved: count(
                demoMode
                  ? Math.max(
                      data?.collaborations.newInPeriod || 0,
                      demoKpis.collaborations.newInPeriod
                    )
                  : data?.collaborations.newInPeriod || 0
              ),
              total: count(
                demoMode
                  ? Math.max(
                      data?.collaborations.totalInPeriod || 0,
                      demoKpis.collaborations.totalInPeriod
                    )
                  : data?.collaborations.totalInPeriod || 0
              ),
            })}
            delta={delta(
              demoMode
                ? data?.collaborations.change || demoKpis.collaborations.change
                : data?.collaborations.change || 0
            )}
            onClick={() => navigate(`${basePath}/collab`)}
          />
        ) : null}
        {surfaces.whatsapp && !demoMode ? (
          <Kpi
            label={t("overview.cmdSent7", "WhatsApp sends, 7 days")}
            value={
              whatsappReads.status === "ready"
                ? formatNumber(whatsappReads.overview?.stats?.sentLast7Days || 0)
                : whatsappReads.status === "error"
                  ? "—"
                  : "—"
            }
            detail={
              whatsappReads.status === "error"
                ? t("overview.cmdLoadFailed", "These numbers could not be loaded.")
                : whatsappReads.overview?.connection?.connected
                  ? t("overview.cmdConnected", "Connected")
                  : whatsappReads.status === "ready"
                    ? t("overview.cmdNotConnected", "Not connected")
                    : t("overview.loadingDashboard")
            }
            onClick={() => navigate(`${basePath}/whatsapp/overview`)}
          />
        ) : null}
        {surfaces.whatsapp && !demoMode ? (
          <Kpi
            label={t("overview.cmdCampaigns", "WhatsApp campaigns")}
            value={
              whatsappReads.status === "ready" ? formatNumber(campaignSummary.total) : "—"
            }
            detail={
              whatsappReads.status === "ready"
                ? t("overview.cmdSending", {
                    count: formatNumber(campaignSummary.byStatus.sending || 0),
                    defaultValue: "{{count}} sending",
                  })
                : t("overview.loadingDashboard")
            }
            onClick={() => navigate(`${basePath}/whatsapp/messages/history`)}
          />
        ) : null}
      </section>

      {quickActions.length ? (
        <section className="bx-panel">
          <div className="bx-row">
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
          </div>
        </section>
      ) : null}

      <section className="bx-split">
        {visiblePerformanceTabs.length ? (
          <div className="bx-panel" data-demo-target="dashboard-performance-chart">
            <div className="bx-row" style={{ justifyContent: "space-between" }}>
              <h2>{t("overview.performanceOverview")}</h2>
              <div className="bx-row">
                {visiblePerformanceTabs.map((metric) => (
                  <button
                    key={metric}
                    type="button"
                    className={`bx-chip ${
                      filters.performanceMetric === metric ? "is-on" : ""
                    }`}
                    onClick={() => onFiltersChange({ performanceMetric: metric })}
                  >
                    {t(
                      `overview.metric${metric.charAt(0).toUpperCase()}${metric.slice(1)}`
                    )}
                  </button>
                ))}
              </div>
            </div>
            <div className="bx-row" style={{ marginTop: "0.6rem" }}>
              {RESOLUTIONS.map((resolution) => (
                <button
                  key={resolution}
                  type="button"
                  className={`bx-chip ${filters.resolution === resolution ? "is-on" : ""}`}
                  onClick={() => onFiltersChange({ resolution })}
                >
                  {t(`common.${resolution}`)}
                </button>
              ))}
            </div>
            <div className="bx-chart">
              {chartHasActivity ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceChartData}>
                    <CartesianGrid stroke="#efeaf8" vertical={false} />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5c5470" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#5c5470" }} />
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
          </div>
        ) : null}

        <div className="bx-panel">
          <h2>{t("overview.cmdAttention", "Needs attention")}</h2>
          {attention.length ? (
            <div className="bx-attention">
              {attention.map((item) => (
                <a key={item.id} href={item.href} onClick={(event) => {
                  event.preventDefault();
                  navigate(item.href);
                }}>
                  <span>
                    {item.id === "untreated"
                      ? t("overview.cmdUntreated", {
                          count: formatNumber(item.count),
                          defaultValue: "{{count}} leads are still marked new",
                        })
                      : item.id === "appointments"
                        ? t("overview.cmdUpcoming", {
                            count: formatNumber(item.count),
                            defaultValue: "{{count}} appointments in the next 7 days",
                          })
                        : item.id === "wa-failed"
                          ? t("overview.cmdWaFailed", {
                              count: formatNumber(item.count),
                              defaultValue: "{{count}} recent WhatsApp messages failed",
                            })
                          : item.id === "campaign-failed"
                            ? t("overview.cmdCampaignFailed", {
                                count: formatNumber(item.count),
                                defaultValue: "{{count}} WhatsApp campaigns failed",
                              })
                            : t("overview.cmdWaConnect", "WhatsApp is included and not connected")}
                  </span>
                  <b>{t("overview.cmdOpen", "Open")}</b>
                </a>
              ))}
            </div>
          ) : (
            <p className="bx-note" style={{ marginTop: "0.8rem" }}>
              {t(
                "overview.cmdAttentionClear",
                "Nothing in the connected products needs attention right now."
              )}
            </p>
          )}
        </div>
      </section>

      {surfaces.leads || surfaces.appointments ? (
        <section className="bx-pair">
          {surfaces.leads ? (
            <div className="bx-panel" data-demo-target="dashboard-latest-leads">
              <div className="bx-row" style={{ justifyContent: "space-between" }}>
                <h3>{t("overview.latestLeads")}</h3>
                <button
                  type="button"
                  className="bx-btn"
                  onClick={() => navigate(`${basePath}/crm/leads`)}
                >
                  {t("common.viewAll")}
                </button>
              </div>
              {(data?.leads.latest || []).length ? (
                <table className="bx-table">
                  <thead>
                    <tr>
                      <th>{t("overview.name")}</th>
                      <th>{t("overview.source")}</th>
                      <th>{t("overview.status")}</th>
                      <th>{t("overview.time")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.leads.latest.map((lead) => (
                      <tr key={lead.id}>
                        <td>{lead.name}</td>
                        <td>{formatLeadSource(lead.source)}</td>
                        <td>
                          <span className="bx-status">{formatLeadStatus(lead.status)}</span>
                        </td>
                        <td>{formatLeadDate(lead.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Empty title={t("overview.noLeadsTitle")} text={t("overview.noLeadsText")} />
              )}
            </div>
          ) : null}

          {surfaces.appointments ? (
            <div className="bx-panel" data-demo-target="dashboard-upcoming-appointments">
              <div className="bx-row" style={{ justifyContent: "space-between" }}>
                <h3>{t("overview.upcomingAppointments")}</h3>
                <button
                  type="button"
                  className="bx-btn"
                  onClick={() => navigate(`${basePath}/crm/appointments`)}
                >
                  {t("overview.viewCalendar")}
                </button>
              </div>
              {upcomingAppointments.length ? (
                <div className="bx-list">
                  {upcomingAppointments.map((appointment) => {
                    const badge = formatAppointmentBadge(appointment.date);
                    return (
                      <article key={appointment.id}>
                        <div>
                          <strong>
                            {badge.day} {badge.month}
                          </strong>
                          <div>
                            {appointment.clientName
                              ? t("overview.withClient", {
                                  title: appointment.title,
                                  client: appointment.clientName,
                                })
                              : appointment.title}
                          </div>
                          <span className="bx-note">{appointment.time}</span>
                        </div>
                        <span className="bx-status">
                          {appointment.status === "Confirmed"
                            ? t("overview.confirmed")
                            : appointment.status === "Pending"
                              ? t("overview.pending")
                              : appointment.status}
                        </span>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <Empty
                  title={t("overview.noAppointmentsTitle")}
                  text={t("overview.noAppointmentsText")}
                />
              )}
            </div>
          ) : null}
        </section>
      ) : null}

      {surfaces.website ? (
        <section className="bx-pair">
          <div className="bx-panel">
            <h3>{t("overview.trafficSources")}</h3>
            {(data?.website.trafficSources || []).some((source) => source.visitors > 0) ? (
              <table className="bx-table">
                <tbody>
                  {data?.website.trafficSources
                    .filter((source) => source.visitors > 0)
                    .map((source) => (
                      <tr key={source.source}>
                        <td>{source.label}</td>
                        <td>{formatNumber(source.visitors)}</td>
                        <td>{showComparison ? formatPercent(source.change) : ""}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <Empty title={t("overview.noTrafficTitle")} text={t("overview.noTrafficText")} />
            )}
          </div>
          <div className="bx-panel">
            <h3>{t("overview.topPages")}</h3>
            {(data?.website.topPages || []).length ? (
              <table className="bx-table">
                <tbody>
                  {data?.website.topPages.map((page) => (
                    <tr key={`${page.pageId}-${page.pageSlug}`}>
                      <td>{page.page}</td>
                      <td>{formatNumber(page.views)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <Empty title={t("overview.noPagesTitle")} text={t("overview.noPagesText")} />
            )}
          </div>
        </section>
      ) : null}

      {surfaces.whatsapp && !demoMode ? (
        <section className="bx-panel">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdWhatsappTitle", "WhatsApp")}</h2>
            <span className="bx-status">
              {whatsappReads.status === "error"
                ? t("overview.cmdLoadFailed", "These numbers could not be loaded.")
                : whatsappReads.overview?.connection?.connected
                  ? t("overview.cmdConnected", "Connected")
                  : whatsappReads.status === "ready"
                    ? t("overview.cmdNotConnected", "Not connected")
                    : t("overview.loadingDashboard")}
            </span>
          </div>
          {whatsappReads.status === "error" ? (
            <p className="bx-note" style={{ marginTop: "0.7rem" }}>
              {whatsappReads.message}
            </p>
          ) : whatsappReads.status === "ready" ? (
            <div className="bx-kpis" style={{ marginTop: "0.8rem" }}>
              <Kpi
                label={t("overview.cmdSample", "Latest messages returned")}
                value={formatNumber(messageSample.total)}
                detail={t("overview.cmdSampleDetail", {
                  inbound: formatNumber(messageSample.inbound),
                  outbound: formatNumber(messageSample.outbound),
                  defaultValue: "{{inbound}} received · {{outbound}} sent in this sample",
                })}
              />
              <Kpi
                label={t("overview.cmdDeliverySample", "Delivery in that sample")}
                value={formatNumber(messageSample.delivered)}
                detail={t("overview.cmdReadSample", {
                  count: formatNumber(messageSample.read),
                  defaultValue: "{{count}} marked read",
                })}
              />
              <Kpi
                label={t("overview.cmdScheduled", "Scheduled campaigns")}
                value={formatNumber(campaignSummary.scheduled)}
                detail={t("overview.cmdCompleted", {
                  count: formatNumber(campaignSummary.byStatus.completed || 0),
                  defaultValue: "{{count}} completed",
                })}
              />
            </div>
          ) : null}
          <p className="bx-note" style={{ marginTop: "0.75rem" }}>
            {t(
              "overview.cmdRecentNote",
              "These are the latest saved records. This is not a live feed."
            )}
          </p>
        </section>
      ) : null}

      {surfaces.metaCampaigns ? (
        <section className="bx-panel">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <div>
              <h2>{t("overview.cmdMeta", "Meta campaigns")}</h2>
              <p className="bx-note">
                {t(
                  "overview.cmdMetaText",
                  "Ad results stay on the campaigns screen for the connected account. This dashboard does not estimate them."
                )}
              </p>
            </div>
            <button
              type="button"
              className="bx-btn"
              onClick={() => navigate(`${basePath}/meta-campaigns/campaigns`)}
            >
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
        </section>
      ) : null}

      {demoMode ? (
        <section className="bx-panel" data-demo-target="dashboard-recent-activity">
          <h3>{t("leftover.dashboard.recentActivity", "Recent activity")}</h3>
          <div className="bx-list">
            {getDemoActivityTimeline().map((item) => (
              <article key={item.id}>
                <span>{item.text}</span>
                <span className="bx-note">{item.time}</span>
              </article>
            ))}
          </div>
        </section>
      ) : surfaces.leads ? (
        <section className="bx-panel">
          <h3>{t("overview.cmdRecentTitle", "Recent records")}</h3>
          <p className="bx-note">
            {t(
              "overview.cmdRecentNote",
              "These are the latest saved records. This is not a live feed."
            )}
          </p>
          {(data?.leads.latest || []).length ? (
            <div className="bx-list">
              {data?.leads.latest.map((lead) => (
                <article key={`feed-${lead.id}`}>
                  <span>
                    {lead.name} · {formatLeadStatus(lead.status)}
                  </span>
                  <span className="bx-note">{formatLeadDate(lead.createdAt)}</span>
                </article>
              ))}
            </div>
          ) : (
            <Empty title={t("overview.noLeadsTitle")} text={t("overview.noLeadsText")} />
          )}
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
