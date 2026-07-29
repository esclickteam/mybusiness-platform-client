import React from "react";
import { Check, Globe, Search } from "lucide-react";
import { ProgressRing, Reveal, SectionHeading } from "../product-marketing";
import { schemaTypes, seoControls } from "./websiteMarketingData";
import "./websiteSections.css";

export default function WebsiteSeoSection() {
  return (
    <section className="pm-section wbx">
      <div className="pm-shell">
        <SectionHeading
          eyebrow={
            <>
              <Search size={14} aria-hidden="true" />
              SEO ופרסום
            </>
          }
          title={
            <>
              SEO ברמת עמוד, <span className="pm-grad">לא ברמת סיסמה</span>
            </>
          }
          lead="לכל עמוד באתר יש כותרת, תיאור, canonical, הנחיות robots, תצוגת שיתוף, hreflang ו־JSON‑LD. ה־sitemap.xml וה־robots.txt נבנים אוטומטית לאתר שפורסם."
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
                סטודיו לעיצוב שיער בתל אביב | תורים אונליין
              </span>
              <span className="wbx-serp__desc">
                מחירון מלא, גלריית עבודות וזימון תור בלחיצה. פתוח ראשון–שישי,
                חניה בשפע.
              </span>
            </div>

            <div className="wbx-schema">
              {schemaTypes.map((type) => (
                <span key={type}>{type}</span>
              ))}
            </div>

            <p className="wbx-note">
              <Globe size={16} aria-hidden="true" />
              כל אתר מקבל כתובת תחת sites.bizuply.com — ואפשר לרכוש דומיין מתוך
              המערכת ולחבר אותו לאתר, או לחבר דומיין קיים.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
