import React from "react";
import { useTranslation } from "react-i18next";
import { Workflow } from "lucide-react";
import { AppFrame, Reveal, SectionHeading } from "../product-marketing";

export default function AutomationsBuilderPreview() {
  const { t } = useTranslation();

  const RULE = [
    {
      tag: t("automationsPage.builder.rule1Tag"),
      text: t("automationsPage.builder.rule1Text"),
    },
    {
      tag: t("automationsPage.builder.rule2Tag"),
      text: t("automationsPage.builder.rule2Text"),
    },
    {
      tag: t("automationsPage.builder.rule3Tag"),
      text: t("automationsPage.builder.rule3Text"),
    },
  ];

  const RUNS = [
    {
      name: t("automationsPage.builder.run1Name"),
      when: t("automationsPage.builder.run1When"),
      state: t("automationsPage.builder.run1State"),
      tone: "ok",
    },
    {
      name: t("automationsPage.builder.run2Name"),
      when: t("automationsPage.builder.run2When"),
      state: t("automationsPage.builder.run2State"),
      tone: "warn",
    },
    {
      name: t("automationsPage.builder.run3Name"),
      when: t("automationsPage.builder.run3When"),
      state: t("automationsPage.builder.run3State"),
      tone: "live",
    },
    {
      name: t("automationsPage.builder.run4Name"),
      when: t("automationsPage.builder.run4When"),
      state: t("automationsPage.builder.run4State"),
      tone: "ok",
    },
  ];

  return (
    <section className="pm-section pm-section--tight">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Workflow size={14} aria-hidden="true" />
              {t("automationsPage.builder.eyebrow")}
            </>
          }
          title={
            <>
              {t("automationsPage.builder.titleLead")}{" "}
              <span className="pm-grad">
                {t("automationsPage.builder.titleHighlight")}
              </span>
            </>
          }
          lead={t("automationsPage.builder.lead")}
        />

        <Reveal from="up" distance={26} duration={0.7}>
          <AppFrame
            crumb={t("automationsPage.builder.crumb")}
            rail={[
              t("automationsPage.builder.rail1"),
              t("automationsPage.builder.rail2"),
              t("automationsPage.builder.rail3"),
              t("automationsPage.builder.rail4"),
              t("automationsPage.builder.rail5"),
            ]}
            railActive={1}
            caption={t("automationsPage.builder.caption")}
          >
            <div className="pmk-kpis">
              <div className="pmk-kpi">
                <span>{t("automationsPage.builder.kpiActiveLabel")}</span>
                <strong>7</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("automationsPage.builder.kpiRunsLabel")}</span>
                <strong>184</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("automationsPage.builder.kpiTasksLabel")}</span>
                <strong>32</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("automationsPage.builder.kpiPendingLabel")}</span>
                <strong>5</strong>
              </div>
            </div>

            <div className="pmk-cols pmk-cols--wide">
              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>{t("automationsPage.builder.card1Title")}</h4>
                  <span>{t("automationsPage.builder.card1Status")}</span>
                </div>

                <div className="pmk-flow">
                  {RULE.map((step, index) => (
                    <React.Fragment key={step.tag}>
                      <div className="pmk-flow__step">
                        <span className="pmk-flow__tag">{step.tag}</span>
                        <p>{step.text}</p>
                      </div>
                      {index < RULE.length - 1 ? (
                        <span className="pmk-flow__link" aria-hidden="true" />
                      ) : null}
                    </React.Fragment>
                  ))}
                </div>

                <p className="pmk-note">
                  {t("automationsPage.builder.note")}
                </p>
              </div>

              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>{t("automationsPage.builder.card2Title")}</h4>
                  <span>{t("automationsPage.builder.card2Range")}</span>
                </div>

                <ul className="pmk-list">
                  {RUNS.map((run) => (
                    <li className="pmk-row" key={run.name}>
                      <div className="pmk-row__main">
                        <strong>{run.name}</strong>
                        <em>{run.when}</em>
                      </div>
                      <span className={`pmk-pill pmk-pill--${run.tone}`}>
                        {run.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </AppFrame>
        </Reveal>
      </div>
    </section>
  );
}
