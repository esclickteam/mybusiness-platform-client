import React from "react";
import { useTranslation } from "react-i18next";
import { Headset } from "lucide-react";
import { AppFrame, Reveal, SectionHeading } from "../product-marketing";

export default function AgentsWorkspacePreview() {
  const { t } = useTranslation();

  const QUEUE = [
    {
      initials: t("agentsPage.workspace.queue.0.initials"),
      name: t("agentsPage.workspace.queue.0.name"),
      meta: t("agentsPage.workspace.queue.0.meta"),
      state: t("agentsPage.workspace.queue.0.state"),
      tone: "live",
    },
    {
      initials: t("agentsPage.workspace.queue.1.initials"),
      name: t("agentsPage.workspace.queue.1.name"),
      meta: t("agentsPage.workspace.queue.1.meta"),
      state: t("agentsPage.workspace.queue.1.state"),
      tone: "ok",
    },
    {
      initials: t("agentsPage.workspace.queue.2.initials"),
      name: t("agentsPage.workspace.queue.2.name"),
      meta: t("agentsPage.workspace.queue.2.meta"),
      state: t("agentsPage.workspace.queue.2.state"),
      tone: "warn",
    },
    {
      initials: t("agentsPage.workspace.queue.3.initials"),
      name: t("agentsPage.workspace.queue.3.name"),
      meta: t("agentsPage.workspace.queue.3.meta"),
      state: t("agentsPage.workspace.queue.3.state"),
      tone: "info",
    },
  ];

  const ACTIVITY = [
    <>
      <strong>{t("agentsPage.workspace.activity.0.strong")}</strong>{" "}
      {t("agentsPage.workspace.activity.0.rest")}
    </>,
    <>
      <strong>{t("agentsPage.workspace.activity.1.strong")}</strong>{" "}
      {t("agentsPage.workspace.activity.1.rest")}
    </>,
    <>
      <strong>{t("agentsPage.workspace.activity.2.strong")}</strong>{" "}
      {t("agentsPage.workspace.activity.2.rest")}
    </>,
    <>
      <strong>{t("agentsPage.workspace.activity.3.strong")}</strong>{" "}
      {t("agentsPage.workspace.activity.3.rest")}
    </>,
  ];

  return (
    <section className="pm-section pm-section--tight">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Headset size={14} aria-hidden="true" />
              {t("agentsPage.workspace.eyebrow")}
            </>
          }
          title={
            <>
              {t("agentsPage.workspace.titlePre")}{" "}
              <span className="pm-grad">
                {t("agentsPage.workspace.titleHighlight")}
              </span>
            </>
          }
          lead={t("agentsPage.workspace.lead")}
        />

        <Reveal from="up" distance={26} duration={0.7}>
          <AppFrame
            crumb={t("agentsPage.workspace.crumb")}
            rail={[
              t("agentsPage.workspace.frameRail.0"),
              t("agentsPage.workspace.frameRail.1"),
              t("agentsPage.workspace.frameRail.2"),
              t("agentsPage.workspace.frameRail.3"),
              t("agentsPage.workspace.frameRail.4"),
            ]}
            railActive={3}
            caption={t("agentsPage.workspace.caption")}
          >
            <div className="pmk-kpis">
              <div className="pmk-kpi">
                <span>{t("agentsPage.workspace.kpis.inProgress")}</span>
                <strong>18</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("agentsPage.workspace.kpis.avgResponse")}</span>
                <strong>{t("agentsPage.workspace.kpis.avgResponseValue")}</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("agentsPage.workspace.kpis.meetings")}</span>
                <strong>11</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("agentsPage.workspace.kpis.missed")}</span>
                <strong>0</strong>
              </div>
            </div>

            <div className="pmk-cols pmk-cols--wide">
              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>{t("agentsPage.workspace.queueTitle")}</h4>
                  <span>{t("agentsPage.workspace.queueSubtitle")}</span>
                </div>

                <ul className="pmk-list">
                  {QUEUE.map((lead) => (
                    <li className="pmk-row" key={lead.name}>
                      <span className="pmk-avatar" aria-hidden="true">
                        {lead.initials}
                      </span>
                      <div className="pmk-row__main">
                        <strong>{lead.name}</strong>
                        <em>{lead.meta}</em>
                      </div>
                      <span className={`pmk-pill pmk-pill--${lead.tone}`}>
                        {lead.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>{t("agentsPage.workspace.activityTitle")}</h4>
                  <span>{t("agentsPage.workspace.activitySubtitle")}</span>
                </div>

                <ul className="pmk-time">
                  {ACTIVITY.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <p className="pmk-note">
                  {t("agentsPage.workspace.note")}
                </p>
              </div>
            </div>
          </AppFrame>
        </Reveal>
      </div>
    </section>
  );
}
