import React from "react";
import type { LexoraSeed } from "./lexoraData";
import {
  CasesList,
  ConsultationSection,
  ProcessSection,
  Reveal,
  SafeImage,
  ServicesGrid,
  getLexoraHref,
} from "./shared";

export default function LexoraHomePage({ data }: { data: LexoraSeed }) {
  return (
    <main id="top">
      <section className="lex-hero">
        <div className="lex-hero-bg">
          <SafeImage
            src={data.hero.image}
            alt={data.hero.title}
            className="lex-hero-bg-image"
          />
          <div className="lex-hero-overlay" />
          <div className="lex-hero-noise" />
        </div>

        <div className="lex-container lex-hero-grid">
          <div className="lex-hero-content">
            <Reveal delay={60}>
              <div className="lex-hero-kicker">
                <span>{data.hero.eyebrow}</span>
                <i />
              </div>
            </Reveal>

            <Reveal delay={170}>
              <h1 className="lex-hero-title">
                <span>סטנדרט</span>
                <span>גבוה יותר</span>
                <span>לליווי משפטי</span>
              </h1>
            </Reveal>

            <Reveal delay={280}>
              <p className="lex-hero-text">{data.hero.text}</p>
            </Reveal>

            <Reveal delay={390}>
              <div className="lex-hero-actions">
                <a
                  href={getLexoraHref("contact")}
                  data-lex-page="contact"
                  className="lex-btn-primary"
                >
                  {data.hero.primaryButton}
                </a>

                <a
                  href={getLexoraHref("services")}
                  data-lex-page="services"
                  className="lex-btn-secondary"
                >
                  {data.hero.secondaryButton}
                </a>
              </div>
            </Reveal>
          </div>

          <div className="lex-hero-side">
            <Reveal className="lex-hero-portrait" delay={220}>
              <SafeImage src={data.intro.image} alt={data.intro.personName} />
              <div>
                <strong>{data.intro.personName}</strong>
                <span>{data.intro.personRole}</span>
              </div>
            </Reveal>

            <Reveal className="lex-hero-stats-card" delay={420}>
              {data.stats.map((item) => (
                <div key={item.label}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </Reveal>
          </div>
        </div>

        <div className="lex-scroll-label">
          <span>גלילה</span>
          <i />
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

          <Reveal delay={160}>
            <p className="lex-section-text">{data.intro.text}</p>
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

            <Reveal delay={150}>
              <p className="lex-section-text">{data.services.text}</p>
            </Reveal>
          </div>

          <ServicesGrid data={data} />
        </div>
      </section>

      <section className="lex-section">
        <div className="lex-container">
          <div className="lex-section-head">
            <Reveal>
              <div className="lex-eyebrow">{data.cases.eyebrow}</div>
              <h2 className="lex-section-title">{data.cases.title}</h2>
            </Reveal>

            <Reveal delay={150}>
              <p className="lex-section-text">{data.cases.text}</p>
            </Reveal>
          </div>

          <CasesList data={data} />
        </div>
      </section>

      <ProcessSection data={data} />

      <section className="lex-about-strip">
        <div className="lex-container lex-about-grid">
          <Reveal className="lex-about-image">
            <SafeImage src={data.about.image} alt={data.about.title} />
          </Reveal>

          <Reveal className="lex-about-copy" delay={170}>
            <div className="lex-eyebrow">{data.about.eyebrow}</div>
            <h2>{data.about.title}</h2>
            <p>{data.about.text}</p>
            <a href={getLexoraHref("about")} data-lex-page="about">
              אודות המשרד
            </a>
          </Reveal>
        </div>
      </section>

      <ConsultationSection data={data} />
    </main>
  );
}