import React from "react";
import { useTranslation } from "react-i18next";
import CrmShowcase from "./CrmShowcase";
import "./CrmProductHero.css";

export default function CrmProductHero() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir();

  return (
    <section className="crm-hero" aria-label={t("productPages.crm.badge")} dir={dir}>
      <div className="crm-hero__atmosphere" aria-hidden="true">
        <span className="crm-hero__orb crm-hero__orb--a" />
        <span className="crm-hero__orb crm-hero__orb--b" />
        <span className="crm-hero__orb crm-hero__orb--c" />
        <span className="crm-hero__grid" />
      </div>

      <div className="crm-hero__inner">
        <div className="crm-hero__copy">
          <h1 className="crm-hero__title">{t("productPages.crm.heroDisplayTitle")}</h1>
        </div>

        <div className="crm-hero__templates">
          <CrmShowcase />
        </div>
      </div>
    </section>
  );
}
