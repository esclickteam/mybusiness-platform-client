import React from "react";
import type { LexoraSeed } from "./lexoraData";
import {
  CasesList,
  ConsultationSection,
  FaqSection,
  ProcessSection,
  Reveal,
  SafeImage,
  ServicesGrid,
  type LexoraNavigate,
} from "./shared";

export default function LexoraHomePage({
  data,
  onNavigate,
}: {
  data: LexoraSeed;
  onNavigate: LexoraNavigate;
}) {
  return (
    <main id="top">
      <section className="lex-hero">
        <div className="lex-container">
          <div className="lex-hero-top">
            <Reveal>
              <div className="lex-hero-kicker">{data.hero.eyebrow}</div>
            </Reveal>

            <Reveal delay={120}>
              <h1 className="lex-hero-title">{data.hero.title}</h1>
            </Reveal>

            <Reveal className="lex-hero-summary" delay={210}>
              <p>{data.hero.text}</p>

              <div className="lex-hero-actions">
                <button
                  type="button"
                  className="lex-btn-primary"
                  onClick={() => onNavigate("contact")}
                >
                  {data.hero.primaryButton}
                </button>

                <button
                  type="button"
                  className="lex-btn-secondary"
                  onClick={() => onNavigate("services")}
                >
                  {data.hero.secondaryButton}
                </button>
              </div>
            </Reveal>
          </div>

          <Reveal className="lex-hero-image-wrap" delay={280}>
            <SafeImage
              src={data.hero.image}
              alt={data.hero.title}
              className="lex-hero-image"
            />

            <div className="lex-hero-image-overlay">
              <span>{data.brand.badge}</span>
              <strong>ייעוץ ברור. החלטות מדויקות.</strong>
            </div>
          </Reveal>

          <div className="lex-stats-row">
            {data.stats.map((item, index) => (
              <Reveal key={item.label} className="lex-stat" delay={index * 80}>
                <strong>{item.value}</strong>
                <span>{item.label}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="lex-intro-section">
        <div className="lex-container lex-intro-grid">
          <Reveal>
            <div>
              <div className="lex-eyebrow">{data.intro.eyebrow}</div>
              <h2 className="lex-section-title">{data.intro.title}</h2>
            </div>
          </Reveal>

          <Reveal delay={130}>
            <div className="lex-intro-text-card">
              <p>{data.intro.text}</p>

              <button type="button" onClick={() => onNavigate("about")}>
                אודות המשרד
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="lex-image-band">
        <div className="lex-container">
          <Reveal className="lex-band-image">
            <SafeImage src={data.intro.image} alt={data.intro.title} />
          </Reveal>
        </div>
      </section>

      <section className="lex-section lex-services-section">
        <div className="lex-container">
          <div className="lex-section-head">
            <Reveal>
              <div className="lex-eyebrow-light">{data.services.eyebrow}</div>
              <h2 className="lex-section-title">{data.services.title}</h2>
            </Reveal>

            <Reveal delay={130}>
              <p className="lex-section-text">{data.services.text}</p>
            </Reveal>
          </div>

          <ServicesGrid data={data} onNavigate={onNavigate} />
        </div>
      </section>

      <section className="lex-section">
        <div className="lex-container">
          <div className="lex-section-head">
            <Reveal>
              <div className="lex-eyebrow">{data.cases.eyebrow}</div>
              <h2 className="lex-section-title">{data.cases.title}</h2>
            </Reveal>

            <Reveal delay={130}>
              <p className="lex-section-text">{data.cases.text}</p>
            </Reveal>
          </div>

          <CasesList data={data} onNavigate={onNavigate} />
        </div>
      </section>

      <ProcessSection data={data} />

      <section className="lex-about-strip">
        <div className="lex-container lex-about-grid">
          <Reveal className="lex-about-image">
            <SafeImage src={data.about.image} alt={data.about.title} />
          </Reveal>

          <Reveal className="lex-about-copy" delay={150}>
            <div className="lex-eyebrow">{data.about.eyebrow}</div>
            <h2>{data.about.title}</h2>
            <p>{data.about.text}</p>

            <button type="button" onClick={() => onNavigate("about")}>
              להכיר את הצוות
            </button>
          </Reveal>
        </div>
      </section>

      <FaqSection data={data} />
      <ConsultationSection data={data} />
    </main>
  );
}