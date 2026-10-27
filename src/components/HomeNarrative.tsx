"use client";

import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";

const AUDIENCES = [
  { id: "small", image: "/demo-media/home/frames/audience-small.jpg" },
  { id: "service", image: "/demo-media/home/frames/audience-service.jpg" },
  { id: "marketing", image: "/demo-media/home/frames/audience-marketing.jpg" },
  { id: "teams", image: "/demo-media/home/frames/audience-teams.jpg" },
] as const;

export function HomeJourney() {
  const { t, i18n } = useTranslation();
  const steps = [1, 2, 3] as const;
  return (
    <section className="home-journey" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2>{t("home.journeyTitle")}</h2>
        <p className="home-journey__lead">{t("home.journeyLead")}</p>
        <div className="home-journey__rail" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
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
  return (
    <section className="home-audiences" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <h2>{t("home.audienceTitle")}</h2>
        <p className="home-audiences__lead">{t("home.audienceLead")}</p>
        <div>
          {AUDIENCES.map((item) => (
            <article key={item.id}>
              <img src={item.image} alt={t(`home.audience_${item.id}`)} width={1280} height={800} loading="lazy" decoding="async" />
              <h3>{t(`home.audience_${item.id}`)}</h3>
              <p>{t(`home.audience_${item.id}Body`)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
