import React from "react";
import TemplateShowcase from "./TemplateShowcase";
import "./WebsiteBuilderHero.css";

export default function WebsiteBuilderHero() {
  return (
    <section className="wb-hero" aria-label="בניית אתרים">
      <div className="wb-hero__glow" aria-hidden="true">
        <span className="g1" />
        <span className="g2" />
        <span className="g3" />
      </div>
      <div className="wb-hero__dots" aria-hidden="true" />

      <div className="wb-hero__inner">
        <div className="wb-hero__copy">
          <h1 className="wb-hero__title">בניית אתרים מקצועיים</h1>
        </div>

        <div id="wb-templates" className="wb-hero__templates">
          <TemplateShowcase />
        </div>
      </div>
    </section>
  );
}
