import React from "react";
import HeroActions from "./HeroActions";
import TemplateShowcase from "./TemplateShowcase";
import "./WebsiteBuilderHero.css";

export default function WebsiteBuilderHero() {
  return (
    <section className="wb-hero" aria-label="בניית אתרים">
      <div className="wb-hero__glow" aria-hidden="true">
        <span className="g1" />
        <span className="g2" />
      </div>
      <div className="wb-hero__dots" aria-hidden="true" />

      <div className="wb-hero__inner">
        <div className="wb-hero__copy">
          <h1 className="wb-hero__title">
            בונים אתר שלא רק נראה טוב — אלא{" "}
            <span className="wb-hero__title-accent">עובד בשביל העסק</span>
          </h1>

          <p className="wb-hero__subtitle">
            אתר, חנות או מערכת תורים מקצועית שמחוברת ישירות ללידים, ל־CRM
            ולאוטומציות של Bizuply.
          </p>

          <HeroActions primaryTo="/register" />
        </div>

        <div id="wb-templates">
          <TemplateShowcase />
        </div>
      </div>
    </section>
  );
}
