"use client";

import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { AudienceArt, JourneyRail } from "./HomeVisuals";

export function HomeJourney() {
  const { t, i18n } = useTranslation();
  const steps = [1, 2, 3] as const;
  return (
    <section className="home-journey" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2>{t("home.journeyTitle")}</h2>
        <p className="home-journey__lead">{t("home.journeyLead")}</p>
        <JourneyRail />
        <ol>
          {steps.map((step) => (
            <li key={step}>
              <span>0{step}</span>
              <div>
                <h3>{t(`home.journey${step}Title`)}</h3>
                <p>{t(`home.journey${step}Body`)}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function HomeAudiences() {
  const { t, i18n } = useTranslation();
  const items = ["small", "service", "marketing", "teams"] as const;
  return (
    <section className="home-audiences" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2>{t("home.audienceTitle")}</h2>
        <p className="home-audiences__lead">{t("home.audienceLead")}</p>
        <div>
          {items.map((item, index) => (
            <article key={item}>
              <AudienceArt index={index} />
              <h3>{t(`home.audience_${item}`)}</h3>
              <p>{t(`home.audience_${item}Body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
