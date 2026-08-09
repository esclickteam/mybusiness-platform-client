import React from "react";
import { useTranslation } from "react-i18next";
import { Handshake } from "lucide-react";
import { AppFrame, Reveal, SectionHeading } from "../product-marketing";

export default function CollabWorkspacePreview() {
  const { t } = useTranslation();

  const MATCHES = [
    {
      name: t("collabPage.preview.match1Name"),
      area: t("collabPage.preview.match1Area"),
      score: 92,
    },
    {
      name: t("collabPage.preview.match2Name"),
      area: t("collabPage.preview.match2Area"),
      score: 84,
    },
    {
      name: t("collabPage.preview.match3Name"),
      area: t("collabPage.preview.match3Area"),
      score: 71,
    },
  ];

  const PROPOSALS = [
    {
      name: t("collabPage.preview.proposal1Name"),
      state: t("collabPage.preview.proposal1State"),
      tone: "info",
    },
    {
      name: t("collabPage.preview.proposal2Name"),
      state: t("collabPage.preview.proposal2State"),
      tone: "warn",
    },
    {
      name: t("collabPage.preview.proposal3Name"),
      state: t("collabPage.preview.proposal3State"),
      tone: "ok",
    },
  ];

  return (
    <section className="pm-section pm-section--tight">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Handshake size={14} aria-hidden="true" />
              {t("collabPage.preview.eyebrow")}
            </>
          }
          title={
            <>
              {t("collabPage.preview.titlePrefix")}{" "}
              <span className="pm-grad">{t("collabPage.preview.titleHighlight")}</span>
            </>
          }
          lead={t("collabPage.preview.lead")}
        />

        <Reveal from="up" distance={26} duration={0.7}>
          <AppFrame
            crumb={t("collabPage.preview.crumb")}
            rail={[
              t("collabPage.preview.rail1"),
              t("collabPage.preview.rail2"),
              t("collabPage.preview.rail3"),
              t("collabPage.preview.rail4"),
              t("collabPage.preview.rail5"),
            ]}
            railActive={2}
            caption={t("collabPage.preview.caption")}
          >
            <div className="pmk-kpis">
              <div className="pmk-kpi">
                <span>{t("collabPage.preview.kpiMatches")}</span>
                <strong>26</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("collabPage.preview.kpiProposals")}</span>
                <strong>9</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("collabPage.preview.kpiClosed")}</span>
                <strong>4</strong>
              </div>
              <div className="pmk-kpi">
                <span>{t("collabPage.preview.kpiReferrals")}</span>
                <strong>37</strong>
              </div>
            </div>

            <div className="pmk-cols pmk-cols--wide">
              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>{t("collabPage.preview.matchesTitle")}</h4>
                  <span>{t("collabPage.preview.matchesSub")}</span>
                </div>

                <ul className="pmk-list">
                  {MATCHES.map((match) => (
                    <li key={match.name} className="pmk-match">
                      <div className="pmk-row__main">
                        <strong>{match.name}</strong>
                        <em>{match.area}</em>
                      </div>
                      <span className="pmk-match__bar" aria-hidden="true">
                        <i style={{ width: `${match.score}%` }} />
                      </span>
                      <span className="pmk-match__score">{match.score}%</span>
                    </li>
                  ))}
                </ul>

                <div className="pmk-card__head" style={{ marginTop: "0.9rem" }}>
                  <h4>{t("collabPage.preview.pipelineTitle")}</h4>
                </div>

                <ul className="pmk-list">
                  {PROPOSALS.map((proposal) => (
                    <li className="pmk-row" key={proposal.name}>
                      <div className="pmk-row__main">
                        <strong>{proposal.name}</strong>
                      </div>
                      <span className={`pmk-pill pmk-pill--${proposal.tone}`}>
                        {proposal.state}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pmk-card">
                <div className="pmk-card__head">
                  <h4>{t("collabPage.preview.chatTitle")}</h4>
                  <span>{t("collabPage.preview.chatSub")}</span>
                </div>

                <div className="pmk-chat">
                  <p className="pmk-bubble pmk-bubble--them">
                    {t("collabPage.preview.chatBubble1")}
                  </p>
                  <p className="pmk-bubble">
                    {t("collabPage.preview.chatBubble2")}
                  </p>
                  <p className="pmk-bubble pmk-bubble--them">
                    {t("collabPage.preview.chatBubble3")}
                  </p>
                  <p className="pmk-bubble">
                    {t("collabPage.preview.chatBubble4")}
                  </p>
                </div>

                <p className="pmk-note">
                  {t("collabPage.preview.chatNote")}
                </p>
              </div>
            </div>
          </AppFrame>
        </Reveal>
      </div>
    </section>
  );
}
