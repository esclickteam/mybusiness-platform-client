import React from "react";
import type { LexoraSeed } from "./lexoraData";
import { CasesList, ConsultationSection, Reveal, SafeImage } from "./shared";

export default function LexoraCasesPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container lex-page-hero-grid">
          <Reveal>
            <div>
              <div className="lex-eyebrow">תיקים נבחרים</div>
              <h1>תיקים שטופלו מתוך חשיבה משפטית ואסטרטגית</h1>
              <p>
                תצוגה יוקרתית של עבודות, הישגים וסוגי תיקים שהמשרד יודע להוביל.
              </p>
            </div>
          </Reveal>

          <Reveal className="lex-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=90"
              alt="תיקים משפטיים"
            />
          </Reveal>
        </div>
      </section>

      <section className="lex-section">
        <div className="lex-container">
          <CasesList data={data} />
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}