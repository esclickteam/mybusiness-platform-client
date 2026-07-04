import React from "react";
import type { LexoraSeed } from "./lexoraData";
import { ConsultationSection, Reveal, SafeImage } from "./shared";

export default function LexoraContactPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero lex-page-hero-soft">
        <div className="lex-container lex-page-hero-grid">
          <Reveal>
            <div>
              <div className="lex-eyebrow">יצירת קשר</div>
              <h1>קובעים ייעוץ ומקבלים תמונת מצב משפטית ברורה</h1>
              <p>
                השאירו פרטים ונחזור אליכם לתיאום שיחה ראשונית עם עורך דין מתאים.
              </p>
            </div>
          </Reveal>

          <Reveal className="lex-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=90"
              alt="ייעוץ משפטי"
            />
          </Reveal>
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}