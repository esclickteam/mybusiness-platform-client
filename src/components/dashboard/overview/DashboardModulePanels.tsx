import type { ReactNode } from "react";
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

import type { AutomationStats } from "@/api/automationWorkflowApi";
import type { MetaCampaignsOverview } from "@/api/metaCampaignsApi";
import type { MySiteSummary } from "@/api/mySitesApi";
import type { WhatsAppAccountHealth, WhatsAppConversation } from "@/api/whatsappApi";

import { formatNumber } from "./dashboardOverviewUtils";
import { seriesHasActivity } from "./dashboardVisibility";
import type { LeadModuleData } from "./useDashboardModuleReads";

type Slice<T> = {
  status: "idle" | "loading" | "ready" | "error";
  data: T | null;
  message: string | null;
};

function Note({ children }: { children: ReactNode }) {
  return <p className="bx-note" style={{ marginTop: "0.45rem" }}>{children}</p>;
}

function Failed({ message }: { message: string | null }) {
  const { t } = useTranslation();
  return (
    <p className="bx-note" style={{ marginTop: "0.7rem" }}>
      {message || t("overview.cmdLoadFailed", "These numbers could not be loaded.")}
    </p>
  );
}

export default function DashboardModulePanels({
  leads,
  sites,
  meta,
  automations,
  appointments,
  health,
  conversations,
  onOpen,
}: {
  leads: Slice<LeadModuleData> | null;
  sites: Slice<MySiteSummary[]> | null;
  meta: Slice<MetaCampaignsOverview> | null;
  automations: Slice<AutomationStats | null> | null;
  appointments: { total: number; today: number; byStatus: Record<string, number> } | null;
  health: WhatsAppAccountHealth | null;
  conversations: WhatsAppConversation[] | null;
  onOpen: (path: string) => void;
}) {
  const { t } = useTranslation();
  const funnel = leads?.data?.funnel || [];
  const funnelMax = Math.max(0, ...funnel.map((stage) => stage.count || 0));
  const metaData = meta?.data;
  const metaLive = Boolean(metaData?.connection?.connected) && metaData?.demoData !== true;
  const healthChart = (health?.chart7d || []).map((point) => ({
    label: point.date,
    sent: point.sent,
    delivered: point.delivered,
    read: point.read,
    failed: point.failed,
  }));
  const automationStats = automations?.data;

  return (
    <>
      {leads && leads.status !== "idle" ? (
        <section className="bx-panel bx-rise">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdPipeline", "Sales pipeline")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("crm/leads")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          <Note>{t("overview.cmdPipelineNote")}</Note>
          {leads.status === "error" ? <Failed message={leads.message} /> : null}
          {leads.status === "ready" && leads.data?.total != null ? (
            <p style={{ margin: "0.8rem 0 0", fontWeight: 800 }}>
              {t("overview.cmdLeadTotal", "Leads in the selected dates")}:{" "}
              {formatNumber(leads.data.total)}
            </p>
          ) : null}
          {leads.status === "ready" && funnelMax > 0 ? (
            <div className="bx-funnel">
              {funnel.map((stage) => (
                <div key={stage.key}>
                  <div className="bx-row" style={{ justifyContent: "space-between" }}>
                    <span>{stage.label}</span>
                    <b>{formatNumber(stage.count)}</b>
                  </div>
                  <div className="bx-bar">
                    <span style={{ width: `${Math.round((stage.count / funnelMax) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
          {leads.status === "ready" && funnelMax === 0 ? (
            <Note>{t("overview.noLeadsText")}</Note>
          ) : null}
        </section>
      ) : null}

      {appointments ? (
        <section className="bx-panel bx-rise">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdToday", "Appointments today")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("crm/appointments")}>
              {t("overview.viewCalendar")}
            </button>
          </div>
          <strong style={{ display: "block", marginTop: "0.7rem", fontSize: "2rem" }}>
            {formatNumber(appointments.today)}
          </strong>
          <Note>
            {t("overview.cmdApptLoaded", {
              total: formatNumber(appointments.total),
              defaultValue: "{{total}} appointments loaded for this business",
            })}
          </Note>
          <div className="bx-row" style={{ marginTop: "0.7rem" }}>
            {Object.entries(appointments.byStatus).map(([status, count]) => (
              <span key={status} className="bx-status">
                {status} · {formatNumber(count)}
              </span>
            ))}
          </div>
        </section>
      ) : null}

      {automations && automations.status !== "idle" ? (
        <section className="bx-panel bx-rise">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdAutomations", "Automations")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("automations")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          <Note>{t("overview.cmdAutomationsNote")}</Note>
          {automations.status === "error" ? <Failed message={automations.message} /> : null}
          {automations.status === "ready" && automationStats ? (
            <div className="bx-kpis" style={{ marginTop: "0.8rem" }}>
              <article className="bx-kpi">
                <span>{t("overview.cmdAutomations")}</span>
                <strong>{formatNumber(automationStats.total)}</strong>
                <span>
                  {t("overview.cmdAutoActive", {
                    count: formatNumber(automationStats.active),
                    defaultValue: "{{count}} active",
                  })}
                </span>
              </article>
              <article className="bx-kpi">
                <span>{t("overview.cmdAutoRuns30", { count: "", defaultValue: "Runs" })}</span>
                <strong>{formatNumber(automationStats.runsLast30Days)}</strong>
                <span>
                  {t("overview.cmdAutoFailed30", {
                    count: formatNumber(automationStats.failedLast30Days),
                    defaultValue: "{{count}} failed in 30 days",
                  })}
                </span>
              </article>
            </div>
          ) : null}
        </section>
      ) : null}

      {sites && sites.status !== "idle" ? (
        <section className="bx-panel bx-rise">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdSites", "Websites")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("website")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          {sites.status === "error" ? <Failed message={sites.message} /> : null}
          {sites.status === "ready" && sites.data?.length ? (
            <div className="bx-list">
              {sites.data.slice(0, 6).map((site) => (
                <article key={site._id}>
                  <span>{site.name || site.slug || site._id}</span>
                  <span className="bx-status">
                    {site.published
                      ? t("overview.cmdPublished", "Published")
                      : t("overview.cmdDraftSite", "Not published")}
                  </span>
                </article>
              ))}
            </div>
          ) : null}
          {sites.status === "ready" && !sites.data?.length ? (
            <Note>{t("overview.noPagesText")}</Note>
          ) : null}
        </section>
      ) : null}

      {meta && meta.status !== "idle" ? (
        <section className="bx-panel bx-rise">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdMeta", "Meta campaigns")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("meta-campaigns/campaigns")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          {meta.status === "error" ? <Failed message={meta.message} /> : null}
          {meta.status === "ready" && metaData?.demoData ? (
            <Note>{t("overview.cmdMetaDemo")}</Note>
          ) : null}
          {meta.status === "ready" && metaData && !metaData.connection?.connected ? (
            <Note>{t("overview.cmdMetaDisconnected")}</Note>
          ) : null}
          {metaLive && metaData?.kpis ? (
            <>
              <div className="bx-kpis" style={{ marginTop: "0.8rem" }}>
                <article className="bx-kpi">
                  <span>{t("overview.cmdMetaLeads", "Campaign leads")}</span>
                  <strong>{formatNumber(metaData.kpis.leads)}</strong>
                </article>
                <article className="bx-kpi">
                  <span>{t("overview.cmdMetaSpend", "Spend")}</span>
                  <strong>{formatNumber(metaData.kpis.spend)}</strong>
                </article>
              </div>
              {(metaData.campaigns || []).length ? (
                <div className="bx-list">
                  {metaData.campaigns.slice(0, 5).map((campaign) => (
                    <article key={campaign.id}>
                      <span>{campaign.name}</span>
                      <span className="bx-status">{campaign.effectiveStatus || campaign.status}</span>
                    </article>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      {health?.chart7d?.length && seriesHasActivity(healthChart.flatMap((point) => [
        { value: point.sent },
        { value: point.delivered },
        { value: point.read },
        { value: point.failed },
      ])) ? (
        <section className="bx-panel bx-rise">
          <h2>{t("overview.cmdWaChart", "WhatsApp, last 7 stored days")}</h2>
          <div className="bx-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthChart}>
                <CartesianGrid stroke="#efeaf8" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#5c5470" }} />
                <YAxis tick={{ fontSize: 12, fill: "#5c5470" }} />
                <Tooltip />
                <Line type="monotone" dataKey="sent" stroke="#5B21B6" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="delivered" stroke="#3D63FF" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="read" stroke="#321064" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="failed" stroke="#9f1239" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <Note>{t("overview.cmdRecentNote")}</Note>
        </section>
      ) : null}

      {health?.metrics?.length ? (
        <section className="bx-panel bx-rise">
          <h2>{t("overview.cmdWaHealth", "WhatsApp account health")}</h2>
          <div className="bx-list">
            {health.metrics.slice(0, 6).map((metric) => (
              <article key={metric.key}>
                <span>{metric.label}</span>
                <b>{String(metric.value ?? "—")}</b>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {conversations ? (
        <section className="bx-panel bx-rise">
          <div className="bx-row" style={{ justifyContent: "space-between" }}>
            <h2>{t("overview.cmdWaConversations", "Conversations returned")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("whatsapp/inbox")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          <strong style={{ display: "block", marginTop: "0.7rem", fontSize: "2rem" }}>
            {formatNumber(conversations.length)}
          </strong>
          <Note>{t("overview.cmdRecentNote")}</Note>
        </section>
      ) : null}
    </>
  );
}
