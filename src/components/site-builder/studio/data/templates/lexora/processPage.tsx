import React from "react";
import type { LexoraSeed } from "./lexoraData";
import { ConsultationSection, ProcessSection, Reveal, SafeImage } from "./shared";

export default function LexoraProcessPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero lex-page-hero-soft">
        <div className="lex-container lex-page-hero-grid">
          <Reveal>
            <div>
              <div className="lex-eyebrow">תהליך העבודה</div>
              <h1>כל תיק מתחיל באבחון ברור וממשיך בדרך פעולה מדויקת</h1>
              <p>
                תהליך עבודה מסודר שמסביר ללקוח מה קורה בכל שלב ומחזק אמון.
              </p>
            </div>
          </Reveal>

          <Reveal className="lex-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=90"
              alt="תהליך עבודה משפטי"
            />
          </Reveal>
        </div>
      </section>

      <ProcessSection data={data} />
      <ConsultationSection data={data} />
    </main>
  );
}