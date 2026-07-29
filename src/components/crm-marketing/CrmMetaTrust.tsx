import React from "react";
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

const POINTS = [
  "חיבור Facebook Lead Ads בצורה מאובטחת ומאושרת",
  "העסק מחבר את הדף שלו ומאשר הרשאות בעצמו",
  "הלידים נכנסים אוטומטית לצינור ה־CRM עם מקור וסטטוס",
];

export default function CrmMetaTrust() {
  return (
    <section className="pm-section pm-section--tight crx">
      <div className="pm-shell">
        <Reveal from="scale" duration={0.85}>
          <div className="crx-meta">
            <p className="pm-eyebrow" style={{ color: "#1877f2" }}>
              <Facebook size={14} aria-hidden="true" />
              Meta App Review
            </p>
            <h2 className="pm-title">מפתחי Meta שעברו App Review</h2>
            <p className="pm-lead">
              BizUply היא אפליקציית Meta שמאפשרת לעסקים לחבר את דף הפייסבוק שלהם
              ולקבל Lead Ads ישירות ל־CRM — אחרי שעברנו את תהליך ה־App Review של
              Meta.
            </p>

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
              ההרשאות שהעסק מאשר
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
