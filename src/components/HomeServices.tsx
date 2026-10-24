"use client";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { Reveal } from "./product-marketing";

const SERVICES = ["serviceWeb", "serviceAuto", "serviceSupport"] as const;

export default function HomeServices() {
  const { t, i18n } = useTranslation();

  return (
    <section className="home-ways" dir={getTextDirection(i18n.language)}>
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
        <Reveal from="up" distance={18}>
          <h2 className="home-ways__title">{t("home.servicesTitle")}</h2>
          <p className="home-ways__lead">{t("home.servicesLead")}</p>
        </Reveal>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {SERVICES.map((key) => (
            <article key={key} className="home-way">
              <div>
                <h3>{t(`home.${key}`)}</h3>
                <p>{t(`home.${key}Body`)}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/services" className="home-cta home-cta--primary">
            {t("home.servicesCta")}
          </Link>
        </div>
      </div>
    </section>
  );
}
