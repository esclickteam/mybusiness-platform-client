import React from "react";
import HeroActions from "./HeroActions";
import TemplateShowcase from "./TemplateShowcase";
import "./WebsiteBuilderHero.css";

export default function WebsiteBuilderHero() {
  return (
    <section className="wb-hero" aria-label="בניית אתרים עם Bizuply">
      <div className="wb-hero__glow" aria-hidden="true">
        <span className="g1" />
        <span className="g2" />
      </div>
      <div className="wb-hero__dots" aria-hidden="true" />

      <div className="wb-hero__inner">
        <div className="wb-hero__copy">
          <p className="wb-hero__eyebrow">בניית אתרים עם Bizuply</p>

          <h1 className="wb-hero__title">
            בונים אתר שלא רק נראה טוב —
            <br />
            אלא <span className="wb-hero__title-accent">עובד בשביל העסק</span>
          </h1>

          <p className="wb-hero__subtitle">
            צרו אתר, חנות או מערכת תורים מקצועית שמחוברת ישירות ללידים, ל־CRM
            ולאוטומציות של Bizuply.
          </p>

          <HeroActions primaryTo="/register" />

          <ul className="wb-hero__perks">
            <li>ללא קוד</li>
            <li>מותאם למובייל</li>
            <li>מחובר ל־CRM</li>
          </ul>
        </div>

        <div id="wb-templates">
          <TemplateShowcase />
        </div>
      </div>
    </section>
  );
}
