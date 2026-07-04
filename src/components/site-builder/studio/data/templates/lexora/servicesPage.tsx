import React from "react";
import type { LexoraSeed } from "./lexoraData";
import {
  ConsultationSection,
  Reveal,
  ServicesGrid,
  type LexoraNavigate,
} from "./shared";

export default function LexoraServicesPage({
  data,
  onNavigate,
}: {
  data: LexoraSeed;
  onNavigate: LexoraNavigate;
}) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container">
          <Reveal>
            <div className="lex-page-kicker">שירותים משפטיים</div>
            <h1>תחומי התמחות שמייצרים בהירות וביטחון</h1>
            <p>
              שירותים משפטיים לעסקים, יזמים ולקוחות פרטיים שצריכים ליווי
              מקצועי, מדויק וזמין.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="lex-section lex-services-section">
        <div className="lex-container">
          <ServicesGrid data={data} onNavigate={onNavigate} />
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}