import React, { useEffect } from "react";
import type { RefObject } from "react";
import type { LexoraSeed } from "./lexoraData";

export type LexoraPageKey =
  | "home"
  | "services"
  | "cases"
  | "process"
  | "about"
  | "contact";

export type LexoraNavigate = (page: LexoraPageKey) => void;

export function SafeImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={(event) => {
        const img = event.currentTarget;
        img.style.display = "none";

        const parent = img.parentElement;
        if (parent) {
          parent.style.background =
            "linear-gradient(135deg, #1c2420 0%, #b99b6b 100%)";
        }
      }}
    />
  );
}

export function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={className}
      data-lex-reveal="true"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function useLexoraMotion(
  rootRef: RefObject<HTMLDivElement | null>,
  activePage: string,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const previewScroller = root.closest(
      ".lexora-preview-scroll",
    ) as HTMLElement | null;

    const scrollTarget: HTMLElement | Window = previewScroller || window;

    const revealElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-lex-reveal='true']"),
    );

    revealElements.forEach((el) => {
      el.classList.remove("is-visible");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            observer.unobserve(el);
          }
        });
      },
      {
        root: previewScroller || null,
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      },
    );

    revealElements.forEach((el) => observer.observe(el));

    const getScrollTop = () => {
      if (previewScroller) return previewScroller.scrollTop;
      return window.scrollY || 0;
    };

    const updateMotion = () => {
      const y = getScrollTop();

      root.style.setProperty("--lex-scroll-y", `${Math.min(y * 0.08, 80)}px`);
      root.style.setProperty("--lex-image-y", `${Math.min(y * 0.05, 52)}px`);
    };

    updateMotion();

    scrollTarget.addEventListener("scroll", updateMotion, { passive: true });

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", updateMotion);
    };
  }, [rootRef, activePage]);
}

function NavButton({
  children,
  page,
  activePage,
  onNavigate,
  className,
}: {
  children: React.ReactNode;
  page: LexoraPageKey;
  activePage?: LexoraPageKey;
  onNavigate: LexoraNavigate;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      data-active={activePage === page}
      onClick={() => onNavigate(page)}
    >
      {children}
    </button>
  );
}

export function LexoraHeader({
  data,
  activePage,
  onNavigate,
}: {
  data: LexoraSeed;
  activePage: LexoraPageKey;
  onNavigate: LexoraNavigate;
}) {
  return (
    <header className="lex-header">
      <div className="lex-container lex-header-inner">
        <button
          type="button"
          className="lex-brand"
          aria-label={data.brand.name}
          onClick={() => onNavigate("home")}
        >
          <span className="lex-brand-mark">{data.brand.logoText}</span>
          <span className="lex-brand-name">{data.brand.name}</span>
        </button>

        <nav className="lex-nav" aria-label="ניווט ראשי">
          <NavButton
            page="services"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            שירותים
          </NavButton>

          <NavButton
            page="cases"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            תיקים
          </NavButton>

          <NavButton
            page="process"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            תהליך
          </NavButton>

          <NavButton
            page="about"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            אודות
          </NavButton>
        </nav>

        <button
          type="button"
          className="lex-header-cta"
          onClick={() => onNavigate("contact")}
        >
          ייעוץ משפטי
        </button>
      </div>
    </header>
  );
}

export function ServicesGrid({
  data,
  onNavigate,
}: {
  data: LexoraSeed;
  onNavigate: LexoraNavigate;
}) {
  return (
    <div className="lex-services-list">
      {data.services.items.map((item, index) => (
        <Reveal
          key={item.title}
          className="lex-service-row"
          delay={index * 90}
        >
          <button
            type="button"
            className="lex-service-row-link"
            onClick={() => onNavigate("contact")}
          >
            <span className="lex-service-number">
              {String(index + 1).padStart(2, "0")}
            </span>

            <div className="lex-service-main">
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>

            <strong>{item.meta}</strong>

            <em>לייעוץ</em>
          </button>
        </Reveal>
      ))}
    </div>
  );
}

export function CasesList({
  data,
  onNavigate,
}: {
  data: LexoraSeed;
  onNavigate: LexoraNavigate;
}) {
  return (
    <div className="lex-cases-list">
      {data.cases.items.map((item, index) => (
        <Reveal key={item.title} className="lex-case-card" delay={index * 110}>
          <div className="lex-case-image">
            <SafeImage src={item.image} alt={item.title} />
          </div>

          <div className="lex-case-content">
            <div className="lex-case-top">
              <span>{item.year}</span>
              <span>{item.type}</span>
            </div>

            <h3>{item.title}</h3>
            <p>{item.text}</p>

            <div className="lex-case-info">
              <div>
                <span>מיקום</span>
                <strong>{item.location}</strong>
              </div>
              <div>
                <span>משך טיפול</span>
                <strong>{item.duration}</strong>
              </div>
              <div>
                <span>סטטוס</span>
                <strong>{item.status}</strong>
              </div>
            </div>

            <button type="button" onClick={() => onNavigate("contact")}>
              ייעוץ דומה
            </button>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ProcessSection({ data }: { data: LexoraSeed }) {
  return (
    <section className="lex-section">
      <div className="lex-container lex-split">
        <Reveal>
          <div className="lex-sticky-copy">
            <div className="lex-eyebrow">{data.process.eyebrow}</div>
            <h2 className="lex-section-title">{data.process.title}</h2>
            <p className="lex-section-text">{data.process.text}</p>
          </div>
        </Reveal>

        <div className="lex-process-list">
          {data.process.steps.map((step, index) => (
            <Reveal
              key={step.number}
              className="lex-process-row"
              delay={index * 100}
            >
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection({ data }: { data: LexoraSeed }) {
  return (
    <section className="lex-section lex-faq-section">
      <div className="lex-container">
        <Reveal className="lex-center-head">
          <div className="lex-eyebrow">שאלות נפוצות</div>
          <h2 className="lex-section-title">מה חשוב לדעת לפני שמתחילים?</h2>
        </Reveal>

        <div className="lex-faq-list">
          {data.faqs.map((faq, index) => (
            <Reveal
              key={faq.question}
              className="lex-faq-item"
              delay={index * 80}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ConsultationSection({ data }: { data: LexoraSeed }) {
  return (
    <section className="lex-consultation" id="consultation">
      <div className="lex-container">
        <Reveal>
          <div className="lex-consultation-card">
            <div className="lex-consultation-copy">
              <div className="lex-eyebrow-light">
                {data.consultation.eyebrow}
              </div>
              <h2>{data.consultation.title}</h2>
              <p>{data.consultation.text}</p>
            </div>

            <form
              className="lex-form"
              onSubmit={(event) => {
                event.preventDefault();
              }}
            >
              <label>
                <span>שם מלא</span>
                <input type="text" placeholder="השם שלך" />
              </label>

              <label>
                <span>טלפון</span>
                <input type="tel" placeholder="050-0000000" />
              </label>

              <label>
                <span>אימייל</span>
                <input type="email" placeholder="name@email.com" />
              </label>

              <label>
                <span>סיבת הפנייה</span>
                <textarea placeholder="ספרו בקצרה במה צריך עזרה" />
              </label>

              <button type="submit">{data.consultation.button}</button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function LexoraFooter({
  data,
  activePage,
  onNavigate,
}: {
  data: LexoraSeed;
  activePage?: LexoraPageKey;
  onNavigate: LexoraNavigate;
}) {
  return (
    <footer className="lex-footer">
      <div className="lex-container lex-footer-inner">
        <div>
          <strong>{data.brand.name}</strong>
          <p>{data.footer.text}</p>
        </div>

        <nav>
          <NavButton
            page="home"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            בית
          </NavButton>

          <NavButton
            page="services"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            שירותים
          </NavButton>

          <NavButton
            page="cases"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            תיקים
          </NavButton>

          <NavButton
            page="contact"
            activePage={activePage}
            onNavigate={onNavigate}
          >
            יצירת קשר
          </NavButton>
        </nav>
      </div>
    </footer>
  );
}