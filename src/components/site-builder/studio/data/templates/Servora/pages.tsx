import React, { useMemo, useState } from "react";

import { servoraEditorCss } from "./editorCss";

import {
  servoraDefaultData,
  servoraPages as servoraPagesData,
  type ServoraData,
  type ServoraPageId,
} from "./servoraData";

export const servoraPages = [...servoraPagesData];

type ServoraPagesProps = {
  initialPage?: ServoraPageId | string;
  mode?: "preview" | "editor" | "public" | string;
  data?: Partial<ServoraData>;
};

function mergeData(data?: Partial<ServoraData>): ServoraData {
  return {
    ...servoraDefaultData,
    ...data,
    brand: {
      ...servoraDefaultData.brand,
      ...(data?.brand || {}),
    },
    hero: {
      ...servoraDefaultData.hero,
      ...(data?.hero || {}),
    },
    project: {
      ...servoraDefaultData.project,
      ...(data?.project || {}),
      points: data?.project?.points || servoraDefaultData.project.points,
    },
    cta: {
      ...servoraDefaultData.cta,
      ...(data?.cta || {}),
    },
    contact: {
      ...servoraDefaultData.contact,
      ...(data?.contact || {}),
    },
    nav: data?.nav || servoraDefaultData.nav,
    stats: data?.stats || servoraDefaultData.stats,
    services: data?.services || servoraDefaultData.services,
    areas: data?.areas || servoraDefaultData.areas,
    process: data?.process || servoraDefaultData.process,
    pricing: data?.pricing || servoraDefaultData.pricing,
    testimonials: data?.testimonials || servoraDefaultData.testimonials,
    faq: data?.faq || servoraDefaultData.faq,
  };
}

function normalizePage(page?: string): ServoraPageId {
  if (
    page === "services" ||
    page === "pricing" ||
    page === "gallery" ||
    page === "contact"
  ) {
    return page;
  }

  return "home";
}

function AnimatedStatValue({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = React.useState("0");
  const [isDone, setIsDone] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const cleanValue = String(value || "")
      .replace(/\u200e/g, "")
      .replace(/\u200f/g, "")
      .trim();

    const match = cleanValue.match(/^([^0-9-]*)(-?\d[\d,.\s]*)(.*)$/);

    if (!match) {
      setDisplayValue(cleanValue);
      setIsDone(true);
      return;
    }

    const prefix = match[1] || "";
    const rawNumber = match[2].trim();
    const suffix = match[3] || "";

    const hasComma = rawNumber.includes(",");
    const hasDot = rawNumber.includes(".");
    const lastComma = rawNumber.lastIndexOf(",");
    const lastDot = rawNumber.lastIndexOf(".");
    const decimalSeparator =
      hasComma && hasDot ? (lastDot > lastComma ? "." : ",") : hasDot ? "." : "";

    let normalized = rawNumber.replace(/\s/g, "");

    if (decimalSeparator === ".") {
      normalized = normalized.replace(/,/g, "");
    } else if (decimalSeparator === ",") {
      normalized = normalized.replace(/\./g, "").replace(",", ".");
    } else {
      normalized = normalized.replace(/[,.]/g, "");
    }

    const target = Number(normalized);

    if (!Number.isFinite(target)) {
      setDisplayValue(cleanValue);
      setIsDone(true);
      return;
    }

    const decimals =
      decimalSeparator && normalized.includes(".")
        ? normalized.split(".")[1]?.length || 0
        : 0;

    const duration = 1350;
    let frame = 0;
    let started = false;

    function easeOutBack(t: number) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function formatNumber(current: number) {
      return current.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });
    }

    function startCounter() {
      if (started) return;
      started = true;

      const startTime = performance.now();

      function tick(now: number) {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = Math.min(1, easeOutBack(progress));
        const current = target * eased;

        setDisplayValue(`${prefix}${formatNumber(current)}${suffix}`);

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        } else {
          setDisplayValue(`${prefix}${formatNumber(target)}${suffix}`);
          setIsDone(true);
        }
      }

      frame = window.requestAnimationFrame(tick);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          startCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span
      ref={ref}
      className={`servora-counter-value ${isDone ? "is-done" : ""}`}
      data-editable="text"
    >
      {displayValue}
    </span>
  );
}

export default function ServoraPages({
  initialPage = "home",
  mode = "preview",
  data,
}: ServoraPagesProps) {
  const templateData = useMemo(() => mergeData(data), [data]);
  const [currentPage, setCurrentPage] = useState<ServoraPageId>(
    normalizePage(initialPage),
  );

  function goTo(page: ServoraPageId) {
    setCurrentPage(page);

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  return (
    <>
      <style>{servoraEditorCss}</style>

      <main
        dir="rtl"
        data-template-id="servora"
        data-template-mode={mode}
        className="servora-page"
      >
        <Header
          data={templateData}
          currentPage={currentPage}
          onNavigate={goTo}
        />

        {currentPage === "home" && (
          <HomePage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "services" && (
          <ServicesPage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "pricing" && (
          <PricingPage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "gallery" && (
          <GalleryPage data={templateData} onNavigate={goTo} />
        )}

        {currentPage === "contact" && <ContactPage data={templateData} />}

        <Footer data={templateData} onNavigate={goTo} />
      </main>
    </>
  );
}

type SharedProps = {
  data: ServoraData;
};

type NavigateProps = {
  onNavigate: (page: ServoraPageId) => void;
};

function Header({
  data,
  currentPage,
  onNavigate,
}: SharedProps & NavigateProps & { currentPage: ServoraPageId }) {
  return (
    <header className="servora-header">
      <div className="servora-shell">
        <div className="servora-header-inner">
          <button
            type="button"
            className="servora-brand"
            onClick={() => onNavigate("home")}
            aria-label="חזרה לדף הבית"
          >
            <span className="servora-brand-mark">S</span>
            <span>
              <span className="servora-brand-name" data-editable="text">
                {data.brand.name}
              </span>
              <span className="servora-brand-label" data-editable="text">
                {data.brand.label}
              </span>
            </span>
          </button>

          <nav className="servora-nav" aria-label="ניווט ראשי">
            {data.nav.map((item) => (
              <button
                key={item.page}
                type="button"
                className={`servora-nav-link ${
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
            className="servora-btn servora-btn-orange servora-header-cta"
            onClick={() => onNavigate("contact")}
            data-editable="button"
          >
            הזמנת שירות
          </button>
        </div>
      </div>
    </header>
  );
}

function HomePage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <section className="servora-hero">
        <div className="servora-hero-grid-bg" aria-hidden="true" />
        <div className="servora-hero-glow servora-hero-glow-one" aria-hidden="true" />
        <div className="servora-hero-glow servora-hero-glow-two" aria-hidden="true" />

        <div className="servora-shell">
          <div className="servora-hero-grid">
            <div className="servora-hero-content">
              <span
                className="servora-eyebrow servora-reveal"
                data-editable="text"
              >
                {data.hero.eyebrow}
              </span>

              <h1 className="servora-hero-title servora-reveal servora-delay-1">
                <span data-editable="text">{data.hero.title}</span>
                <span className="servora-highlight" data-editable="text">
                  {data.hero.highlight}
                </span>
              </h1>

              <p
                className="servora-hero-text servora-reveal servora-delay-2"
                data-editable="text"
              >
                {data.hero.text}
              </p>

              <div className="servora-hero-actions servora-reveal servora-delay-3">
                <button
                  type="button"
                  className="servora-btn servora-btn-orange"
                  onClick={() => onNavigate("contact")}
                  data-editable="button"
                >
                  {data.hero.primaryCta}
                </button>

                <button
                  type="button"
                  className="servora-btn servora-btn-outline"
                  onClick={() => onNavigate("services")}
                  data-editable="button"
                >
                  {data.hero.secondaryCta}
                </button>
              </div>

              <div className="servora-hero-note servora-reveal servora-delay-4">
                <span className="servora-status-dot" aria-hidden="true" />
                <span data-editable="text">
                  זמינים עכשיו לקריאות שירות באזור המרכז.
                </span>
              </div>
            </div>

            <div className="servora-hero-media servora-reveal servora-delay-2">
              <span className="servora-tool-badge" aria-hidden="true">
                ⚒
              </span>

              <div
                className="servora-media-card"
                data-editable="image"
                data-field="hero.image"
                data-image-field="hero.image"
              >
                <img
                  src={data.hero.image}
                  alt="שירותי בית מקצועיים"
                  data-editable="image"
                  data-field="hero.image"
                  data-image-field="hero.image"
                />
              </div>

              <div className="servora-emergency-card" data-editable="false">
                <span data-editable="text">{data.hero.emergencyTitle}</span>
                <strong data-editable="text">{data.brand.phone}</strong>
                <p data-editable="text">{data.hero.emergencyText}</p>
              </div>

              <div className="servora-quote-card" data-editable="false">
                <h3>הצעת מחיר מהירה</h3>
                <div className="servora-quote-lines">
                  <span
                    className="servora-quote-line"
                    style={{ "--quote-width": "72%" } as React.CSSProperties}
                  />
                  <span
                    className="servora-quote-line"
                    style={{ "--quote-width": "48%" } as React.CSSProperties}
                  />
                  <span
                    className="servora-quote-line"
                    style={{ "--quote-width": "86%" } as React.CSSProperties}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <StatsSection data={data} />
      <ServicesSection data={data} onNavigate={onNavigate} />
      <AreasSection data={data} />
      <ProjectSection data={data} onNavigate={onNavigate} />
      <ProcessSection data={data} />
      <PricingSection data={data} />
      <TestimonialsSection data={data} />
      <FaqSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function StatsSection({ data }: SharedProps) {
  return (
    <section className="servora-section-tight">
      <div className="servora-shell">
        <div className="servora-stats-wrap">
          <div className="servora-stats">
            {data.stats.map((stat, index) => (
              <article
                key={`${stat.value}-${stat.label}`}
                className={`servora-stat servora-delay-${Math.min(
                  index + 1,
                  4,
                )}`}
              >
                <strong className="servora-stat-number">
                  <AnimatedStatValue value={stat.value} />
                </strong>

                <span className="servora-stat-label" data-editable="text">
                  {stat.label}
                </span>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-section-head">
          <div>
            <span className="servora-eyebrow" data-editable="text">
              שירותים
            </span>
            <h2 className="servora-section-title" data-editable="text">
              כל שירות שהלקוח צריך — מוצג ברור ומוביל לפנייה.
            </h2>
          </div>

          <p className="servora-section-text" data-editable="text">
            מתאים לעסקים מקומיים שרוצים לקבל יותר שיחות, וואטסאפים וטפסי ליד
            ישירות מהאתר.
          </p>
        </div>

        <div className="servora-services-grid">
          {data.services.map((service, index) => (
            <article
              key={service.title}
              className={`servora-service-card servora-reveal servora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <div>
                <span className="servora-service-icon" data-editable="text">
                  {service.icon}
                </span>
                <h3 data-editable="text">{service.title}</h3>
                <p data-editable="text">{service.text}</p>
              </div>

              <button
                type="button"
                className="servora-btn servora-btn-outline"
                onClick={() => onNavigate("contact")}
                data-editable="button"
              >
                קבלת הצעה
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AreasSection({ data }: SharedProps) {
  return (
    <section className="servora-section-tight">
      <div className="servora-shell">
        <div className="servora-section-head">
          <div>
            <span className="servora-eyebrow" data-editable="text">
              אזורי שירות
            </span>
            <h2 className="servora-section-title" data-editable="text">
              הלקוחות מבינים מיד אם אתם מגיעים אליהם.
            </h2>
          </div>
        </div>

        <div className="servora-areas">
          {data.areas.map((area) => (
            <span key={area} className="servora-area-pill" data-editable="text">
              {area}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-project-grid">
          <div
            className="servora-project-image servora-reveal"
            data-editable="image"
            data-field="project.image"
            data-image-field="project.image"
          >
            <img
              src={data.project.image}
              alt="עבודת שירות לבית"
              data-editable="image"
              data-field="project.image"
              data-image-field="project.image"
            />
          </div>

          <div className="servora-project-card servora-reveal servora-delay-2">
            <span className="servora-eyebrow" data-editable="text">
              {data.project.eyebrow}
            </span>
            <h2 data-editable="text">{data.project.title}</h2>
            <p data-editable="text">{data.project.text}</p>

            <div className="servora-check-list">
              {data.project.points.map((point) => (
                <span key={point} className="servora-check" data-editable="text">
                  {point}
                </span>
              ))}
            </div>

            <div style={{ marginTop: 28 }}>
              <button
                type="button"
                className="servora-btn servora-btn-orange"
                onClick={() => onNavigate("gallery")}
                data-editable="button"
              >
                ראו עבודות נוספות
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
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-section-head">
          <div>
            <span className="servora-eyebrow" data-editable="text">
              איך זה עובד
            </span>
            <h2 className="servora-section-title" data-editable="text">
              מתהליך מבולגן לתהליך ברור שמביא עבודה.
            </h2>
          </div>
        </div>

        <div className="servora-process">
          {data.process.map((step, index) => (
            <article
              key={step.number}
              className={`servora-step servora-reveal servora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <span className="servora-step-number" data-editable="text">
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

function PricingSection({ data }: SharedProps) {
  return (
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-section-head">
          <div>
            <span className="servora-eyebrow" data-editable="text">
              מחירון
            </span>
            <h2 className="servora-section-title" data-editable="text">
              מחירים התחלתיים שמייצרים אמון ומורידים חסמים.
            </h2>
          </div>
        </div>

        <div className="servora-pricing-grid">
          {data.pricing.map((item, index) => (
            <article
              key={item.title}
              className={`servora-price-card servora-reveal servora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <span data-editable="text">{item.title}</span>
              <strong data-editable="text">{item.price}</strong>
              <p data-editable="text">{item.text}</p>
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
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-section-head">
          <div>
            <span className="servora-eyebrow" data-editable="text">
              לקוחות מספרים
            </span>
            <h2 className="servora-section-title" data-editable="text">
              אמון מקומי הוא מה שהופך מבקר באתר ללקוח.
            </h2>
          </div>
        </div>

        <div className="servora-testimonials">
          <article className="servora-testimonial-main servora-reveal">
            <p data-editable="text">“{main?.quote}”</p>
            <div className="servora-testimonial-person">
              <strong data-editable="text">{main?.name}</strong>
              <span data-editable="text">{main?.role}</span>
            </div>
          </article>

          <div className="servora-testimonial-list">
            {rest.map((testimonial, index) => (
              <article
                key={testimonial.name}
                className={`servora-mini-testimonial servora-reveal servora-delay-${Math.min(
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
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-section-head">
          <div>
            <span className="servora-eyebrow" data-editable="text">
              שאלות נפוצות
            </span>
            <h2 className="servora-section-title" data-editable="text">
              כל מה שלקוח רוצה לדעת לפני שהוא משאיר פרטים.
            </h2>
          </div>
        </div>

        <div className="servora-faq">
          {data.faq.map((item) => (
            <article key={item.question} className="servora-faq-item">
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
    <section className="servora-section">
      <div className="servora-shell">
        <div className="servora-cta servora-reveal">
          <div>
            <h2 data-editable="text">{data.cta.title}</h2>
            <p data-editable="text">{data.cta.text}</p>
          </div>

          <button
            type="button"
            className="servora-btn servora-btn-orange"
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

function ServicesPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        eyebrow="השירותים שלנו"
        title="כל שירותי הבית שמייצרים פניות מהר."
        text="עמוד שירותים ברור עם כרטיס לכל שירות, כפתור פעולה והסבר קצר שמוביל לפנייה."
      />

      <ServicesSection data={data} onNavigate={onNavigate} />
      <AreasSection data={data} />
      <ProcessSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function PricingPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        eyebrow="מחירון"
        title="מחירים התחלתיים שמייצרים אמון לפני השיחה."
        text="אפשר להציג מחירים לפי שירות, קריאת שירות, עבודה לפי שעה או הצעת מחיר מותאמת."
      />

      <PricingSection data={data} />
      <FaqSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}

function GalleryPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        eyebrow="עבודות"
        title="לפני ואחרי, תוצאות והוכחות שהעסק באמת מקצועי."
        text="אזור עבודות שמציג ללקוחות את איכות השירות עוד לפני שהם משאירים פרטים."
      />

      <ProjectSection data={data} onNavigate={onNavigate} />
      <TestimonialsSection data={data} />
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

      <section className="servora-section">
        <div className="servora-shell">
          <div className="servora-contact-grid">
            <div className="servora-contact-panel servora-reveal">
              <span className="servora-eyebrow" data-editable="text">
                פרטי התקשרות
              </span>
              <h2 className="servora-section-title" data-editable="text">
                זמינים להצעות מחיר, קריאות שירות ותיאום הגעה.
              </h2>
              <p className="servora-section-text" data-editable="text">
                אפשר להחליף כאן טלפון, וואטסאפ, מייל, אזורי שירות ושעות פעילות.
              </p>

              <div className="servora-contact-info">
                <div className="servora-info-line">
                  <span>טלפון</span>
                  <strong data-editable="text">{data.brand.phone}</strong>
                </div>

                <div className="servora-info-line">
                  <span>וואטסאפ</span>
                  <strong data-editable="text">{data.brand.whatsapp}</strong>
                </div>

                <div className="servora-info-line">
                  <span>מייל</span>
                  <strong data-editable="text">{data.brand.email}</strong>
                </div>

                <div className="servora-info-line">
                  <span>כתובת / אזור</span>
                  <strong data-editable="text">{data.contact.address}</strong>
                </div>

                <div className="servora-info-line">
                  <span>שעות פעילות</span>
                  <strong data-editable="text">{data.contact.hours}</strong>
                </div>
              </div>
            </div>

            <div className="servora-form-card servora-reveal servora-delay-2">
              <form
                className="servora-form"
                onSubmit={(event) => event.preventDefault()}
              >
                <div className="servora-field">
                  <label htmlFor="servora-name">שם מלא</label>
                  <input
                    id="servora-name"
                    name="name"
                    type="text"
                    placeholder="השם שלך"
                    data-editable="input"
                  />
                </div>

                <div className="servora-field">
                  <label htmlFor="servora-phone">טלפון</label>
                  <input
                    id="servora-phone"
                    name="phone"
                    type="tel"
                    placeholder="050-0000000"
                    data-editable="input"
                  />
                </div>

                <div className="servora-field">
                  <label htmlFor="servora-service">סוג שירות</label>
                  <select id="servora-service" name="service" data-editable="select">
                    <option>תיקונים כלליים</option>
                    <option>אינסטלציה</option>
                    <option>חשמל ותאורה</option>
                    <option>מיזוג ותחזוקה</option>
                    <option>ניקיון והדברה</option>
                    <option>גינון וחוץ</option>
                  </select>
                </div>

                <div className="servora-field">
                  <label htmlFor="servora-message">מה צריך לתקן?</label>
                  <textarea
                    id="servora-message"
                    name="message"
                    placeholder="ספרו בקצרה על התקלה או העבודה"
                    data-editable="textarea"
                  />
                </div>

                <button
                  type="submit"
                  className="servora-btn servora-btn-orange"
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
    <section className="servora-page-hero">
      <div className="servora-shell">
        <div className="servora-page-hero-inner servora-reveal">
          <span className="servora-eyebrow" data-editable="text">
            {eyebrow}
          </span>
          <h1 className="servora-page-title" data-editable="text">
            {title}
          </h1>
          <p className="servora-page-text" data-editable="text">
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <footer className="servora-footer">
      <div className="servora-shell">
        <div className="servora-footer-inner">
          <div>
            © {new Date().getFullYear()} {data.brand.name}. כל הזכויות שמורות.
          </div>

          <div className="servora-nav">
            {data.nav.map((item) => (
              <button
                key={`footer-${item.page}`}
                type="button"
                className="servora-nav-link"
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