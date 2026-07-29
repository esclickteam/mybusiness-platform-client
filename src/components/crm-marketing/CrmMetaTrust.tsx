import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Facebook, ShieldCheck } from "lucide-react";
import { Reveal } from "../product-marketing";
import "./crmSections.css";

const SCOPES = [
  "pages_show_list",
  "pages_read_engagement",
  "pages_manage_metadata",
  "pages_manage_ads",
  "leads_retrieval",
];

export default function CrmMetaTrust() {
  const { t } = useTranslation();
  const base = "productPages.crm";
  const points = [1, 2, 3].map((n) => t(`${base}.metaPoint${n}`));

  return (
    <section className="pm-section pm-section--tight crx">
      <div className="pm-shell">
        <Reveal from="scale" duration={0.85}>
          <div className="crx-meta">
            <div>
              <p className="pm-eyebrow" style={{ color: "#1877f2" }}>
                <Facebook size={14} aria-hidden="true" />
                {t(`${base}.metaSectionBadge`)}
              </p>
              <h2 className="pm-title">{t(`${base}.metaSectionTitle`)}</h2>
              <p className="pm-lead">{t(`${base}.metaSectionText`)}</p>

              <p
                className="pm-eyebrow"
                style={{ marginTop: "1.75rem", color: "#64748b" }}
              >
                <ShieldCheck size={14} aria-hidden="true" />
                ההרשאות שהעסק מאשר
              </p>
              <div className="crx-scopes">
                {SCOPES.map((scope) => (
                  <span key={scope}>{scope}</span>
                ))}
              </div>
            </div>

            <ul className="crx-meta__points">
              {points.map((point, index) => (
                <Reveal
                  key={point}
                  as="li"
                  from="start"
                  distance={24}
                  delay={0.1 + index * 0.1}
                  duration={0.6}
                >
                  <CheckCircle2 size={19} aria-hidden="true" />
                  {point}
                </Reveal>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
