import React from "react";
import type { LexoraSeed } from "./lexoraData";
import { ConsultationSection, Reveal, SafeImage, ServicesGrid } from "./shared";

export default function LexoraServicesPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container lex-page-hero-grid">
          <Reveal>
            <div>
              <div className="lex-eyebrow">שירותים משפטיים</div>
              <h1>תחומי התמחות שמייצרים בהירות וביטחון</h1>
              <p>
                שירותים משפטיים לעסקים, יזמים ולקוחות פרטיים שצריכים ליווי
                מקצועי, מדויק וזמין.
              </p>
            </div>
          </Reveal>

          <Reveal className="lex-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=90"
              alt="שירותים משפטיים"
            />
          </Reveal>
        </div>
      </section>

      <section className="lex-section lex-services-section">
        <div className="lex-container">
          <ServicesGrid data={data} />
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}