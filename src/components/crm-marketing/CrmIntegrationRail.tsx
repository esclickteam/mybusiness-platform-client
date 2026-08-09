import React from "react";
import { useTranslation } from "react-i18next";
import { Facebook, Globe, Info, PlugZap, Zap } from "lucide-react";
import { Reveal, SectionHeading } from "../product-marketing";
import { getCrmIntegrations } from "./crmMarketingData";
import "./crmSections.css";

const ICONS = {
  meta: Facebook,
  google: Zap,
  website: Globe,
} as const;

export default function CrmIntegrationRail() {
  const { t } = useTranslation();
  const crmIntegrations = getCrmIntegrations(t);

  return (
    <section className="pm-section crx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <PlugZap size={14} aria-hidden="true" />
              {t("crmPage.integrations.eyebrow")}
            </>
          }
          title={
            <>
              {t("crmPage.integrations.titleA")}
              <span className="pm-grad">
                {t("crmPage.integrations.titleHighlight")}
              </span>
            </>
          }
          lead={t("crmPage.integrations.lead")}
        />

        <div className="crx-sources">
          {crmIntegrations.map((source, index) => {
            const Icon = ICONS[source.id];
            return (
              <Reveal
                key={source.id}
                from="up"
                delay={index * 0.12}
                className="crx-source"
                style={{ "--crx-accent": source.accent } as React.CSSProperties}
              >
                <span className="crx-source__badge">
                  <Icon size={13} aria-hidden="true" />
                  {source.badge}
                </span>
                <h3 className="crx-source__name">{source.name}</h3>
                <ol className="crx-source__steps">
                  {source.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                <p className="crx-source__note">
                  <Info size={15} aria-hidden="true" />
                  {source.note}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
