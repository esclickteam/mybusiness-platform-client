import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";

import type { AutomationStats } from "@/api/automationWorkflowApi";
import type { MetaCampaignsOverview } from "@/api/metaCampaignsApi";
import type { MySiteSummary } from "@/api/mySitesApi";
import type { WhatsAppAccountHealth } from "@/api/whatsappApi";

import { formatNumber } from "./dashboardOverviewUtils";
import type { LeadModuleData } from "./useDashboardModuleReads";

type Slice<T> = {
  status: "idle" | "loading" | "ready" | "error";
  data: T | null;
  message: string | null;
};

const HIDDEN_HEALTH_KEYS = new Set([
  "wabaid",
  "phonenumberid",
  "displayphonenumber",
]);

function friendlyStatus(value: unknown, t: (key: string, fallback: string) => string) {
  const raw = String(value ?? "").trim();
  const key = raw.toUpperCase().replace(/\s+/g, "_");
  if (key === "AVAILABLE_WITHOUT_REVIEW") return t("overview.cmdWaAvailable", "Available, no extra review");
  if (key === "APPROVED") return t("overview.cmdWaApproved", "Approved");
  if (key === "PENDING" || key === "PENDING_REVIEW") return t("overview.cmdWaPending", "Pending review");
  if (key === "REJECTED") return t("overview.cmdWaRejected", "Needs review");
  return raw;
}

function Note({ children }: { children: ReactNode }) {
  return <p className="bx-note">{children}</p>;
}

export default function DashboardModulePanels({
  sites,
  meta,
  automations,
  health,
  whatsapp,
  onOpen,
}: {
  leads: Slice<LeadModuleData> | null;
  sites: Slice<MySiteSummary[]> | null;
  meta: Slice<MetaCampaignsOverview> | null;
  automations: Slice<AutomationStats | null> | null;
  appointments: { total: number; today: number; byStatus: Record<string, number> } | null;
  health: WhatsAppAccountHealth | null;
  conversations: unknown;
  whatsapp: {
    status: "idle" | "loading" | "ready" | "error";
    connected: boolean | null;
    message: string | null;
  } | null;
  onOpen: (path: string) => void;
}) {
  const { t } = useTranslation();
  const metaData = meta?.data;
  const metaLive = Boolean(metaData?.connection?.connected) && metaData?.demoData !== true;
  const automationStats = automations?.data;
  const review = (health?.metrics || []).find(
    (metric) => metric.key === "accountReviewStatus" || metric.key === "qualityRating"
  );
  const visibleReview =
    review && !HIDDEN_HEALTH_KEYS.has(String(review.key || "").toLowerCase())
      ? review
      : null;
  const cards = [
    whatsapp ? "whatsapp" : null,
    meta && meta.status !== "idle" ? "meta" : null,
    automations && automations.status !== "idle" ? "automations" : null,
    sites && sites.status !== "idle" ? "sites" : null,
  ].filter(Boolean);

  if (!cards.length) return null;

  return (
    <section className="bx-modules" aria-label={t("overview.cmdModules", "Included modules")}>
      {whatsapp ? (
        <article className="bx-mod">
          <div className="bx-row">
            <h2>{t("overview.cmdWhatsappTitle", "WhatsApp")}</h2>
            <span className={`bx-status ${whatsapp.connected ? "is-on" : ""}`}>
              {whatsapp.status === "error"
                ? t("overview.cmdLoadFailed", "These numbers could not be loaded.")
                : whatsapp.connected
                  ? t("overview.cmdConnected", "Connected")
                  : whatsapp.status === "ready"
                    ? t("overview.cmdNotConnected", "Not connected")
                    : t("overview.loadingDashboard")}
            </span>
          </div>
          {visibleReview ? (
            <p className="bx-mod-line">
              <span>{visibleReview.label}</span>
              <b>{friendlyStatus(visibleReview.value, t)}</b>
            </p>
          ) : null}
          <button type="button" className="bx-btn" onClick={() => onOpen("whatsapp/overview")}>
            {t("overview.cmdOpen", "Open")}
          </button>
        </article>
      ) : null}

      {meta && meta.status !== "idle" ? (
        <article className="bx-mod">
          <div className="bx-row">
            <h2>{t("overview.cmdMeta", "Meta campaigns")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("meta-campaigns/campaigns")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          {meta.status === "error" ? <Note>{meta.message || t("overview.cmdLoadFailed")}</Note> : null}
          {meta.status === "ready" && metaData?.demoData ? <Note>{t("overview.cmdMetaDemo")}</Note> : null}
          {meta.status === "ready" && metaData && !metaData.connection?.connected ? (
            <Note>{t("overview.cmdMetaDisconnected")}</Note>
          ) : null}
          {metaLive && metaData?.kpis ? (
            <p className="bx-mod-line">
              <span>{t("overview.cmdMetaLeads", "Campaign leads")}</span>
              <b>{formatNumber(metaData.kpis.leads)}</b>
              <span>{t("overview.cmdMetaSpend", "Spend")}</span>
              <b>{formatNumber(metaData.kpis.spend)}</b>
            </p>
          ) : null}
          {metaLive && (metaData?.campaigns || []).length ? (
            <div className="bx-list">
              {metaData!.campaigns.slice(0, 3).map((campaign) => (
                <button
                  key={campaign.id}
                  type="button"
                  className="bx-lead"
                  onClick={() =>
                    campaign.id
                      ? onOpen(`meta-campaigns/overview?campaignId=${encodeURIComponent(campaign.id)}`)
                      : onOpen("meta-campaigns/campaigns")
                  }
                >
                  <strong>{campaign.name}</strong>
                  <span className="bx-status">{campaign.effectiveStatus || campaign.status}</span>
                </button>
              ))}
            </div>
          ) : null}
        </article>
      ) : null}

      {automations && automations.status !== "idle" ? (
        <article className="bx-mod">
          <div className="bx-row">
            <h2>{t("overview.cmdAutomations", "Automations")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("automations")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          <Note>{t("overview.cmdAutomationsNote")}</Note>
          {automations.status === "error" ? (
            <Note>{automations.message || t("overview.cmdLoadFailed")}</Note>
          ) : null}
          {automations.status === "ready" && automationStats ? (
            <p className="bx-mod-line">
              <span>
                {t("overview.cmdAutoActive", {
                  count: formatNumber(automationStats.active),
                })}
              </span>
              <span>
                {t("overview.cmdAutoRuns30", {
                  count: formatNumber(automationStats.runsLast30Days),
                })}
              </span>
            </p>
          ) : null}
        </article>
      ) : null}

      {sites && sites.status !== "idle" ? (
        <article className="bx-mod">
          <div className="bx-row">
            <h2>{t("overview.cmdSites", "Websites")}</h2>
            <button type="button" className="bx-btn" onClick={() => onOpen("website")}>
              {t("overview.cmdOpen", "Open")}
            </button>
          </div>
          {sites.status === "error" ? <Note>{sites.message || t("overview.cmdLoadFailed")}</Note> : null}
          {sites.status === "ready" && sites.data?.length ? (
            <div className="bx-list">
              {sites.data.slice(0, 3).map((site) => (
                <div key={site._id} className="bx-lead">
                  <strong>{site.name || site.slug || site._id}</strong>
                  <span className="bx-status">
                    {site.published
                      ? t("overview.cmdPublished", "Published")
                      : t("overview.cmdDraftSite", "Not published")}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
          {sites.status === "ready" && !sites.data?.length ? <Note>{t("overview.noPagesText")}</Note> : null}
        </article>
      ) : null}
    </section>
  );
}
