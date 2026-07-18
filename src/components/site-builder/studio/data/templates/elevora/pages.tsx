import React, { useMemo, useState } from "react";

import { VisualPageStack } from "../../../../runtime/VisualPageStack";
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
  initialPageId?: ElevoraPageId | string;
  activePageId?: ElevoraPageId | string;
  currentPageId?: ElevoraPageId | string;
  pageId?: ElevoraPageId | string;
  mode?: "preview" | "editor" | "public" | string;
  data?: Partial<ElevoraData>;
};

function isPlainObject(value: unknown): value is Record<string, any> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function safeObject<T extends Record<string, any>>(value: unknown, fallback: T): T {
  return isPlainObject(value) ? ({ ...fallback, ...value } as T) : fallback;
}

function safeArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : fallback;
}

function isVideoUrl(value: unknown) {
  const clean = String(value || "")
    .trim()
    .toLowerCase()
    .split("?")[0]
    .split("#")[0];

  return Boolean(
    clean.includes("/video/upload/") ||
      clean.endsWith(".mp4") ||
      clean.endsWith(".webm") ||
      clean.endsWith(".mov") ||
      clean.endsWith(".m4v") ||
      clean.endsWith(".ogv"),
  );
}

function MediaElement({
  src,
  alt,
  className,
  editable = true,
  field,
}: {
  src: string;
  alt: string;
  className?: string;
  editable?: boolean;
  field?: string;
}) {
  const cleanSrc = String(src || "").trim();

  const sharedProps = editable
    ? {
        "data-editable": "image",
        "data-field": field,
        "data-image-field": field,
      }
    : {
        "data-editable": "false",
      };

  if (isVideoUrl(cleanSrc)) {
    return (
      <video
        src={cleanSrc}
        className={className}
        controls
        playsInline
        preload="metadata"
        muted
        {...sharedProps}
      />
    );
  }

  return (
    <img
      src={cleanSrc}
      alt={alt}
      className={className}
      {...sharedProps}
    />
  );
}

function mergeData(data?: Partial<ElevoraData>): ElevoraData {
  const safeData = isPlainObject(data) ? data : {};

  const brand = safeObject(safeData.brand, elevoraDefaultData.brand);
  const hero = safeObject(safeData.hero, elevoraDefaultData.hero);
  const aboutRaw = safeObject(safeData.about, elevoraDefaultData.about);
  const cta = safeObject(safeData.cta, elevoraDefaultData.cta);
  const contact = safeObject(safeData.contact, elevoraDefaultData.contact);

  return {
    ...elevoraDefaultData,
    ...safeData,

    brand,
    hero,
    about: {
      ...aboutRaw,
      points: safeArray(aboutRaw.points, elevoraDefaultData.about.points),
    },
    cta,
    contact,

    nav: safeArray(safeData.nav, elevoraDefaultData.nav),
    stats: safeArray(safeData.stats, elevoraDefaultData.stats),
    services: safeArray(safeData.services, elevoraDefaultData.services),
    process: safeArray(safeData.process, elevoraDefaultData.process),
    testimonials: safeArray(safeData.testimonials, elevoraDefaultData.testimonials),
    faq: safeArray(safeData.faq, elevoraDefaultData.faq),
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
  initialPageId,
  activePageId,
  currentPageId,
  pageId,
  mode = "preview",
  data,
}: ElevoraPagesProps) {
  const templateData = useMemo(() => mergeData(data), [data]);
  const resolvedPage = normalizePage(
    activePageId || currentPageId || pageId || initialPageId || initialPage,
  );
  const [currentPage, setCurrentPage] = useState<ElevoraPageId>(resolvedPage);

  React.useEffect(() => {
    setCurrentPage(resolvedPage);
  }, [resolvedPage]);

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
        data-template-page-id={currentPage}
        className="elevora-page"
      >
        <Header
          data={templateData}
          currentPage={currentPage}
          onNavigate={goTo}
        />

        <VisualPageStack
          activePageId={currentPage}
          pages={[
            {
              id: "home",
              content: <HomePage data={templateData} onNavigate={goTo} />,
            },
            {
              id: "about",
              content: <AboutPage data={templateData} onNavigate={goTo} />,
            },
            {
              id: "services",
              content: <ServicesPage data={templateData} onNavigate={goTo} />,
            },
            {
              id: "contact",
              content: <ContactPage data={templateData} />,
            },
          ]}
        />

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
        <div className="elevora-hero-bg-grid" aria-hidden="true" />
        <div className="elevora-hero-glow elevora-hero-glow-one" aria-hidden="true" />
        <div className="elevora-hero-glow elevora-hero-glow-two" aria-hidden="true" />

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
              <span
                className="elevora-orbit"
                aria-hidden="true"
                data-editable="false"
              />

              <div
                className="elevora-media-card"
                data-editable="image"
                data-field="hero.image"
                data-image-field="hero.image"
              >
                <MediaElement
                  src={data.hero.image}
                  alt="פגישה עסקית מקצועית"
                  className="elevora-media-image"
                  field="hero.image"
                />
              </div>

              <div className="elevora-floating-badge" data-editable="false">
                <strong data-editable="text">{data.hero.badgeTitle}</strong>
                <span data-editable="text">{data.hero.badgeText}</span>
              </div>

              <div
                className="elevora-dashboard-card"
                aria-hidden="true"
                data-editable="false"
              >
                <div className="elevora-dashboard-top">
                  <span>Live Growth</span>
                  <strong>CRM</strong>
                </div>

                <div className="elevora-dashboard-chart">
                  <span style={{ height: "42%" }} />
                  <span style={{ height: "64%" }} />
                  <span style={{ height: "48%" }} />
                  <span style={{ height: "78%" }} />
                  <span style={{ height: "58%" }} />
                  <span style={{ height: "92%" }} />
                </div>

                <div className="elevora-dashboard-bottom">
                  <span>Leads</span>
                  <strong>+38%</strong>
                </div>
              </div>

              <div
                className="elevora-mini-kpi elevora-mini-kpi-one"
                aria-hidden="true"
                data-editable="false"
              >
                <span>Response</span>
                <strong>2.4x</strong>
              </div>

              <div
                className="elevora-mini-kpi elevora-mini-kpi-two"
                aria-hidden="true"
                data-editable="false"
              >
                <span>Pipeline</span>
                <strong>91%</strong>
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

function AnimatedStatValue({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = React.useState(value);
  const [isDone, setIsDone] = React.useState(false);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const duration = 1350;
    let frame = 0;
    let started = false;

    function easeOutBack(t: number) {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    function startCounter() {
      if (started) return;
      started = true;

      // מקור האמת לערך היעד הוא הטקסט שמופיע בפועל על האלמנט — כלומר הערך
      // שהמשתמש עדכן בעורך, ולא ערך ברירת המחדל מה-props. כך הספירה עולה עד
      // הערך המעודכן במדויק (למשל 260) בלי לעצור בברירת המחדל ואז לקפוץ.
      const cleanValue = String(element.textContent || value || "")
        .replace(/\u200e/g, "")
        .replace(/\u200f/g, "")
        .trim();

      const match = cleanValue.match(/^([^0-9.-]*)(-?\d+(?:[.,]\d+)?)(.*)$/);

      if (!match) {
        setDisplayValue(cleanValue);
        setIsDone(true);
        return;
      }

      const prefix = match[1] || "";
      const rawNumber = match[2].replace(",", ".");
      const suffix = match[3] || "";
      const target = Number(rawNumber);

      if (!Number.isFinite(target)) {
        setDisplayValue(cleanValue);
        setIsDone(true);
        return;
      }

      const decimals = rawNumber.includes(".")
        ? rawNumber.split(".")[1].length
        : 0;

      function formatNumber(current: number) {
        if (decimals > 0) return current.toFixed(decimals);
        return Math.round(current).toString();
      }

      const startTime = performance.now();

      function tick(now: number) {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = Math.min(1, easeOutBack(progress));
        const current = target * eased;

        setDisplayValue(`${prefix}${formatNumber(current)}${suffix}`);

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        } else {
          setDisplayValue(`${prefix}${target.toFixed(decimals)}${suffix}`);
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
      {
        threshold: 0.35,
      },
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
      className={`elevora-counter-value ${isDone ? "is-done" : ""}`}
      data-editable="text"
    >
      {displayValue}
    </span>
  );
}

function StatsSection({ data }: SharedProps) {
  return (
    <section className="elevora-section-tight elevora-results-strip">
      <div className="elevora-shell">
        <div className="elevora-stats elevora-stats-only">
          {data.stats.map((stat, index) => (
            <article
              key={`${stat.value}-${stat.label}`}
              className={`elevora-stat elevora-pop-card elevora-delay-${Math.min(
                index + 1,
                4,
              )}`}
            >
              <strong className="elevora-stat-number">
                <AnimatedStatValue value={stat.value} />
              </strong>

              <span className="elevora-stat-label" data-editable="text">
                {stat.label}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="elevora-section elevora-services-section">
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
          <div
            className="elevora-about-image elevora-reveal"
            data-editable="image"
            data-field="about.image"
            data-image-field="about.image"
          >
            <MediaElement
              src={data.about.image}
              alt="צוות ייעוץ עסקי"
              className="elevora-about-media"
              field="about.image"
            />

            <div
              className="elevora-about-floating elevora-about-floating-one"
              data-editable="false"
            >
              <span>Lead flow</span>
              <strong>Automated</strong>
            </div>

            <div
              className="elevora-about-floating elevora-about-floating-two"
              data-editable="false"
            >
              <span>Sales</span>
              <strong>Clear</strong>
            </div>
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
    <section className="elevora-section elevora-process-section">
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