import React from "react";
import { useTranslation } from "react-i18next";
import { Check, Globe, Search } from "lucide-react";
import { ProgressRing, Reveal, SectionHeading } from "../product-marketing";
import { schemaTypes, getSeoControls } from "./websiteMarketingData";
import "./websiteSections.css";

export default function WebsiteSeoSection() {
  const { t } = useTranslation();
  const seoControls = getSeoControls(t);

  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Search size={14} aria-hidden="true" />
              {t("websitePage.seoSection.eyebrow")}
            </>
          }
          title={
            <>
              {t("websitePage.seoSection.titleLead")}{" "}
              <span className="pm-grad">{t("websitePage.seoSection.titleHighlight")}</span>
            </>
          }
          lead={t("websitePage.seoSection.lead")}
        />

        <Reveal from="up" delay={0.1}>
          <div className="wbx-seo">
            <ProgressRing value={92} label="SEO" size={132} />

            <ul className="wbx-seo__controls">
              {seoControls.map((control) => (
                <li key={control}>
                  <Check size={14} strokeWidth={3} aria-hidden="true" />
                  {control}
                </li>
              ))}
            </ul>

            <div className="wbx-serp">
              <span className="wbx-serp__url">
                studio-demo.sites.bizuply.com › services
              </span>
              <span className="wbx-serp__title">
                {t("websitePage.seoSection.serpTitle")}
              </span>
              <span className="wbx-serp__desc">
                {t("websitePage.seoSection.serpDesc")}
              </span>
            </div>

            <div className="wbx-schema">
              {schemaTypes.map((type) => (
                <span key={type}>{type}</span>
              ))}
            </div>

            <p className="wbx-note">
              <Globe size={16} aria-hidden="true" />
              {t("websitePage.seoSection.note")}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
