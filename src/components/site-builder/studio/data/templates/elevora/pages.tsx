import React, { useMemo, useState } from "react";

import { elevoraEditorCss } from "./editorCss";

import {
  elevoraDefaultData,
  elevoraPages as elevoraPagesData,
  type ElevoraData,
  type ElevoraPageId,
} from "./elevoraData";

export const elevoraPages = [...elevoraPagesData];

type ElevoraPagesProps = {
  initialPage?: ElevoraPageId | string;
  mode?: "preview" | "editor" | "public" | string;
  data?: Partial<ElevoraData>;
};

function mergeData(data?: Partial<ElevoraData>): ElevoraData {
  return {
    ...elevoraDefaultData,
    ...data,
    brand: {
      ...elevoraDefaultData.brand,
      ...(data?.brand || {}),
    },
    hero: {
      ...elevoraDefaultData.hero,
      ...(data?.hero || {}),
    },
    about: {
      ...elevoraDefaultData.about,
      ...(data?.about || {}),
      points: data?.about?.points || elevoraDefaultData.about.points,
    },
    cta: {
      ...elevoraDefaultData.cta,
      ...(data?.cta || {}),
    },
    contact: {
      ...elevoraDefaultData.contact,
      ...(data?.contact || {}),
    },
    nav: data?.nav || elevoraDefaultData.nav,
    stats: data?.stats || elevoraDefaultData.stats,
    services: data?.services || elevoraDefaultData.services,
    process: data?.process || elevoraDefaultData.process,
    testimonials: data?.testimonials || elevoraDefaultData.testimonials,
    faq: data?.faq || elevoraDefaultData.faq,
  };
}

function normalizePage(page?: string): ElevoraPageId {
  if (page === "about" || page === "services" || page === "contact") {
    return page;
  }

  return "home";
}

export default function ElevoraPages({
  initialPage = "home",
  mode = "preview",
  data,
}: ElevoraPagesProps) {
  const templateData = useMemo(() => mergeData(data), [data]);
  const [currentPage, setCurrentPage] = useState<ElevoraPageId>(
    normalizePage(initialPage),
  );

  function goTo(page: ElevoraPageId) {
    setCurrentPage(page);

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  return (
    <>
      <style>{elevoraEditorCss}</style>

      <main
        dir="rtl"
        data-template-id="elevora"
        data-template-mode={mode}
        className="elevora-page"
      >
        <Header
          data={templateData}
          currentPage={currentPage}
          onNavigate={goTo}
        />

        {currentPage === "home" && (
          <HomePage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "about" && (
          <AboutPage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "services" && (
          <ServicesPage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "contact" && <ContactPage data={templateData} />}

        <Footer data={templateData} onNavigate={goTo} />
      </main>
    </>
  );
}

type SharedProps = {
  data: ElevoraData;
};

type NavigateProps = {
  onNavigate: (page: ElevoraPageId) => void;
};

function Header({
  data,
  currentPage,
  onNavigate,
}: SharedProps & NavigateProps & { currentPage: ElevoraPageId }) {
  return (
    <header className="elevora-header">
      <div className="elevora-shell">
        <div className="elevora-header-inner">
          <button
            type="button"
            className="elevora-brand"
            onClick={() => onNavigate("home")}
            aria-label="חזרה לדף הבית"
          >
            <span className="elevora-brand-mark">E</span>
            <span>
              <span className="elevora-brand-name" data-editable="text">
                {data.brand.name}
              </span>
              <span className="elevora-brand-label" data-editable="text">
                {data.brand.label}
              </span>
            </span>
          </button>

          <nav className="elevora-nav" aria-label="ניווט ראשי">
            {data.nav.map((item) => (
              <button
                key={item.page}
                type="button"
                className={`elevora-nav-link ${
                  currentPage === item.page ? "is-active" : ""
                }`}
                onClick={() => onNavigate(item.page)}
                data-editable="link"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            type="button"
            className="elevora-btn elevora-btn-primary elevora-header-cta"
            onClick={() => onNavigate("contact")}
            data-editable="button"
          >
            דברו איתנו
          </button>
        </div>
      </div>
    </header>
  );
}

function HomePage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <section className="elevora-hero">
        <div className="elevora-shell">
          <div className="elevora-hero-grid">
            <div className="elevora-hero-content">
              <span
                className="elevora-eyebrow elevora-reveal"
                data-editable="text"
              >
                {data.hero.eyebrow}
              </span>

              <h1 className="elevora-hero-title elevora-reveal elevora-delay-1">
                <span data-editable="text">{data.hero.title}</span>
                <span className="elevora-highlight" data-editable="text">
                  {data.hero.highlight}
                </span>
              </h1>

              <p
                className="elevora-hero-text elevora-reveal elevora-delay-2"
                data-editable="text"
              >
                {data.hero.text}
              </p>

              <div className="elevora-hero-actions elevora-reveal elevora-delay-3">
                <button
                  type="button"
                  className="elevora-btn elevora-btn-primary"
                  onClick={() => onNavigate("contact")}
                  data-editable="button"
                >
                  {data.hero.primaryCta}
                </button>

                <button
                  type="button"
                  className="elevora-btn elevora-btn-outline"
                  onClick={() => onNavigate("services")}
                  data-editable="button"
                >
                  {data.hero.secondaryCta}
                </button>
              </div>

              <div className="elevora-hero-note elevora-reveal elevora-delay-4">
                <span className="elevora-hero-avatars" aria-hidden="true">
                  <span className="elevora-avatar" />
                  <span className="elevora-avatar" />
                  <span className="elevora-avatar" />
                </span>
                <span data-editable="text">
                  עסקים שמחפשים תהליך ברור, מקצועי וממיר.
                </span>
              </div>
            </div>

            <div className="elevora-hero-media elevora-reveal elevora-delay-2">
              <span className="elevora-orbit" aria-hidden="true" />
              <div className="elevora-media-card">
                <img
                  src={data.hero.image}
                  alt="פגישה עסקית מקצועית"
                  data-editable="image"
                  data-field="hero.image"
                />
              </div>

              <div className="elevora-floating-badge">
                <strong data-editable="text">{data.hero.badgeTitle}</strong>
                <span data-editable="text">{data.hero.badgeText}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection data={data} />
      <ServicesSection data={data} onNavigate={onNavigate} />
      <AboutPreviewSection data={data} onNavigate={onNavigate} />
      <ProcessSection data={data} />
      <TestimonialsSection data={data} />
      <FaqSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function StatsSection({ data }: SharedProps) {
  return (
    <section className="elevora-section-tight">
      <div className="elevora-shell">
        <div className="elevora-stats">
          {data.stats.map((stat, index) => (
            <article
              key={`${stat.value}-${stat.label}`}
              className={`elevora-stat elevora-reveal elevora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <strong data-editable="text">{stat.value}</strong>
              <span data-editable="text">{stat.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="elevora-section">
      <div className="elevora-shell">
        <div className="elevora-section-head">
          <div>
            <span className="elevora-eyebrow" data-editable="text">
              שירותים
            </span>
            <h2 className="elevora-section-title" data-editable="text">
              כל מה שעסק צריך כדי להיראות מקצועי ולסגור יותר לקוחות.
            </h2>
          </div>

          <p className="elevora-section-text" data-editable="text">
            מבנה שמתאים לעסקים נותני שירות — עם שירותים ברורים, אמון, המלצות
            וטופס ליד שמוביל לפעולה.
          </p>
        </div>

        <div className="elevora-services-grid">
          {data.services.map((service, index) => (
            <article
              key={service.title}
              className={`elevora-service-card elevora-reveal elevora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <div>
                <span className="elevora-service-icon" data-editable="text">
                  {service.icon}
                </span>
                <h3 data-editable="text">{service.title}</h3>
                <p data-editable="text">{service.text}</p>
              </div>

              <button
                type="button"
                className="elevora-btn elevora-btn-outline"
                onClick={() => onNavigate("contact")}
                data-editable="button"
              >
                קבלו פרטים
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutPreviewSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="elevora-section">
      <div className="elevora-shell">
        <div className="elevora-about-grid">
          <div className="elevora-about-image elevora-reveal">
            <img
              src={data.about.image}
              alt="צוות ייעוץ עסקי"
              data-editable="image"
              data-field="about.image"
            />
          </div>

          <div className="elevora-about-card elevora-reveal elevora-delay-2">
            <span className="elevora-eyebrow" data-editable="text">
              {data.about.eyebrow}
            </span>
            <h2 data-editable="text">{data.about.title}</h2>
            <p data-editable="text">{data.about.text}</p>

            <div className="elevora-check-list">
              {data.about.points.map((point) => (
                <span
                  key={point}
                  className="elevora-check"
                  data-editable="text"
                >
                  {point}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <button
                type="button"
                className="elevora-btn elevora-btn-gold"
                onClick={() => onNavigate("about")}
                data-editable="button"
              >
                קראו עוד עלינו
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: SharedProps) {
  return (
    <section className="elevora-section">
      <div className="elevora-shell">
        <div className="elevora-section-head">
          <div>
            <span className="elevora-eyebrow" data-editable="text">
              תהליך עבודה
            </span>
            <h2 className="elevora-section-title" data-editable="text">
              תהליך קצר, ברור וממוקד תוצאות.
            </h2>
          </div>
        </div>

        <div className="elevora-process">
          {data.process.map((step, index) => (
            <article
              key={step.number}
              className={`elevora-step elevora-reveal elevora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <span className="elevora-step-number" data-editable="text">
                {step.number}
              </span>
              <h3 data-editable="text">{step.title}</h3>
              <p data-editable="text">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data }: SharedProps) {
  const [main, ...rest] = data.testimonials;

  return (
    <section className="elevora-section">
      <div className="elevora-shell">
        <div className="elevora-section-head">
          <div>
            <span className="elevora-eyebrow" data-editable="text">
              לקוחות מספרים
            </span>
            <h2 className="elevora-section-title" data-editable="text">
              אתר עסקי צריך להיראות טוב — אבל גם לבנות אמון.
            </h2>
          </div>
        </div>

        <div className="elevora-testimonials">
          <article className="elevora-testimonial-main elevora-reveal">
            <p data-editable="text">“{main?.quote}”</p>
            <div className="elevora-testimonial-person">
              <strong data-editable="text">{main?.name}</strong>
              <span data-editable="text">{main?.role}</span>
            </div>
          </article>

          <div className="elevora-testimonial-list">
            {rest.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className={`elevora-mini-testimonial elevora-reveal elevora-delay-${Math.min(
                  index + 1,
                  4,
                )}`}
              >
                <p data-editable="text">“{testimonial.quote}”</p>
                <strong data-editable="text">
                  {testimonial.name} · {testimonial.role}
                </strong>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: SharedProps) {
  return (
    <section className="elevora-section">
      <div className="elevora-shell">
        <div className="elevora-section-head">
          <div>
            <span className="elevora-eyebrow" data-editable="text">
              שאלות נפוצות
            </span>
            <h2 className="elevora-section-title" data-editable="text">
              כל מה שצריך לדעת לפני שמתחילים.
            </h2>
          </div>
        </div>

        <div className="elevora-faq">
          {data.faq.map((item) => (
            <article key={item.question} className="elevora-faq-item">
              <h3 data-editable="text">{item.question}</h3>
              <p data-editable="text">{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="elevora-section">
      <div className="elevora-shell">
        <div className="elevora-cta elevora-reveal">
          <div>
            <h2 data-editable="text">{data.cta.title}</h2>
            <p data-editable="text">{data.cta.text}</p>
          </div>

          <button
            type="button"
            className="elevora-btn elevora-btn-gold"
            onClick={() => onNavigate("contact")}
            data-editable="button"
          >
            {data.cta.button}
          </button>
        </div>
      </div>
    </section>
  );
}

function AboutPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        eyebrow={data.about.eyebrow}
        title={data.about.title}
        text={data.about.text}
      />

      <AboutPreviewSection data={data} onNavigate={onNavigate} />
      <ProcessSection data={data} />
      <TestimonialsSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function ServicesPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        eyebrow="השירותים שלנו"
        title="פתרונות עסקיים לאתר מקצועי, לידים ותהליך מכירה ברור."
        text="עמוד שירותים שמתאים לעסקים שרוצים להסביר במה הם עוזרים, למה לבחור בהם ואיך להשאיר פרטים."
      />

      <ServicesSection data={data} onNavigate={onNavigate} />
      <ProcessSection data={data} />
      <FaqSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function ContactPage({ data }: SharedProps) {
  return (
    <>
      <PageHero
        eyebrow={data.contact.eyebrow}
        title={data.contact.title}
        text={data.contact.text}
      />

      <section className="elevora-section">
        <div className="elevora-shell">
          <div className="elevora-contact-grid">
            <div className="elevora-contact-panel elevora-reveal">
              <span className="elevora-eyebrow" data-editable="text">
                יצירת קשר
              </span>
              <h2 className="elevora-section-title" data-editable="text">
                בואו נדבר על הצעד הבא של העסק.
              </h2>
              <p className="elevora-section-text" data-editable="text">
                אפשר להחליף כאן טקסט, טלפון, כתובת, שעות פעילות ולחבר את הטופס
                למערכת הלידים.
              </p>

              <div className="elevora-contact-info">
                <div className="elevora-info-line">
                  <span>טלפון</span>
                  <strong data-editable="text">{data.brand.phone}</strong>
                </div>

                <div className="elevora-info-line">
                  <span>מייל</span>
                  <strong data-editable="text">{data.brand.email}</strong>
                </div>

                <div className="elevora-info-line">
                  <span>כתובת</span>
                  <strong data-editable="text">{data.contact.address}</strong>
                </div>

                <div className="elevora-info-line">
                  <span>שעות פעילות</span>
                  <strong data-editable="text">{data.contact.hours}</strong>
                </div>
              </div>
            </div>

            <div className="elevora-form-card elevora-reveal elevora-delay-2">
              <form
                className="elevora-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="elevora-field">
                  <label htmlFor="elevora-name">שם מלא</label>
                  <input
                    id="elevora-name"
                    name="name"
                    type="text"
                    placeholder="השם שלך"
                    data-editable="input"
                  />
                </div>

                <div className="elevora-field">
                  <label htmlFor="elevora-phone">טלפון</label>
                  <input
                    id="elevora-phone"
                    name="phone"
                    type="tel"
                    placeholder="050-0000000"
                    data-editable="input"
                  />
                </div>

                <div className="elevora-field">
                  <label htmlFor="elevora-email">אימייל</label>
                  <input
                    id="elevora-email"
                    name="email"
                    type="email"
                    placeholder="name@email.com"
                    data-editable="input"
                  />
                </div>

                <div className="elevora-field">
                  <label htmlFor="elevora-message">איך אפשר לעזור?</label>
                  <textarea
                    id="elevora-message"
                    name="message"
                    placeholder="ספרו לנו בקצרה על העסק והמטרה שלכם"
                    data-editable="textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="elevora-btn elevora-btn-primary"
                  data-editable="button"
                >
                  שליחת פנייה
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function PageHero({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <section className="elevora-page-hero">
      <div className="elevora-shell">
        <div className="elevora-page-hero-inner elevora-reveal">
          <span className="elevora-eyebrow" data-editable="text">
            {eyebrow}
          </span>
          <h1 className="elevora-page-title" data-editable="text">
            {title}
          </h1>
          <p className="elevora-page-text" data-editable="text">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <footer className="elevora-footer">
      <div className="elevora-shell">
        <div className="elevora-footer-inner">
          <div>
            © {new Date().getFullYear()} {data.brand.name}. כל הזכויות שמורות.
          </div>

          <div className="elevora-nav">
            {data.nav.map((item) => (
              <button
                key={`footer-${item.page}`}
                type="button"
                className="elevora-nav-link"
                onClick={() => onNavigate(item.page)}
                data-editable="link"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}