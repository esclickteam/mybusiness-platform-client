import React from "react";
import type { LexoraSeed } from "./lexoraData";
import { ConsultationSection, Reveal, SafeImage } from "./shared";

export default function LexoraAboutPage({ data }: { data: LexoraSeed }) {
  return (
    <main className="lex-inner-page">
      <section className="lex-page-hero">
        <div className="lex-container lex-page-hero-grid">
          <Reveal>
            <div>
              <div className="lex-eyebrow">{data.about.eyebrow}</div>
              <h1>{data.about.title}</h1>
              <p>{data.about.text}</p>
            </div>
          </Reveal>

          <Reveal className="lex-page-hero-image" delay={160}>
            <SafeImage src={data.about.image} alt={data.about.title} />
          </Reveal>
        </div>
      </section>

      <section className="lex-section lex-faq-section">
        <div className="lex-container">
          <Reveal className="lex-center-head">
            <div className="lex-eyebrow">שאלות נפוצות</div>
            <h2 className="lex-section-title">מה חשוב לדעת לפני שמתחילים?</h2>
          </Reveal>

          <div className="lex-faq-list">
            {data.faqs.map((faq, index) => (
              <Reveal key={faq.question} className="lex-faq-item" delay={index * 90}>
                <span>{index + 1}</span>
                <div>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}