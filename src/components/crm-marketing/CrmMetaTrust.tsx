import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Facebook, ShieldCheck } from "lucide-react";
import { Reveal } from "../product-marketing";
import "./crmSections.css";

/** Permissions the business grants when connecting its Facebook page. */
const SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_metadata",
  "pages_manage_ads",
  "leads_retrieval",
];

export default function CrmMetaTrust() {
  const { t } = useTranslation();
  const POINTS = t("crmPage.metaTrust.points", {
    returnObjects: true,
  }) as string[];

  return (
    <section className="pm-section pm-section--tight crx">
      <div className="pm-shell">
        <Reveal from="scale" duration={0.85}>
          <div className="crx-meta">
            <p className="pm-eyebrow" style={{ color: "#1877f2" }}>
              <Facebook size={14} aria-hidden="true" />
              {t("crmPage.metaTrust.eyebrow")}
            </p>
            <h2 className="pm-title">{t("crmPage.metaTrust.title")}</h2>
            <p className="pm-lead">{t("crmPage.metaTrust.lead")}</p>

            <ul className="crx-meta__points">
              {POINTS.map((point, index) => (
                <Reveal
                  key={point}
                  as="li"
                  from="up"
                  distance={20}
                  delay={0.1 + index * 0.09}
                  duration={0.6}
                >
                  <CheckCircle2 size={20} aria-hidden="true" />
                  {point}
                </Reveal>
              ))}
            </ul>

            <p className="pm-eyebrow" style={{ marginTop: "2rem" }}>
              <ShieldCheck size={14} aria-hidden="true" />
              {t("crmPage.metaTrust.permissionsLabel")}
            </p>
            <div className="crx-scopes">
              {SCOPES.map((scope) => (
                <span key={scope}>{scope}</span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
