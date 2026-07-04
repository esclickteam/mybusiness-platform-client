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

function getLexoraPageSlug(page: LexoraPageKey) {
  if (page === "services") return "/services";
  if (page === "cases") return "/cases";
  if (page === "process") return "/process";
  if (page === "about") return "/about";
  if (page === "contact") return "/contact";
  return "/";
}

function getLexoraBasePath() {
  if (typeof window === "undefined") return "";

  const pathname = window.location.pathname || "/";
  const clean = pathname.replace(/\/+$/, "") || "/";

  for (const slug of ["/services", "/cases", "/process", "/about", "/contact"]) {
    if (clean.endsWith(slug)) return clean.slice(0, -slug.length) || "";
  }

  return clean === "/" ? "" : clean;
}

export function getLexoraHref(page: LexoraPageKey, hash?: string) {
  const basePath = getLexoraBasePath();
  const pageSlug = getLexoraPageSlug(page);
  const cleanHash = hash ? `#${hash.replace(/^#/, "")}` : "";

  if (pageSlug === "/") return `${basePath || "/"}${cleanHash}`;
  return `${basePath}${pageSlug}${cleanHash}`;
}

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
            "linear-gradient(135deg, #1e2a25 0%, #b6905d 100%)";
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

    revealElements.forEach((el) => el.classList.remove("is-visible"));

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

    const getScrollTop = () =>
      previewScroller ? previewScroller.scrollTop : window.scrollY || 0;

    const updateMotion = () => {
      const y = getScrollTop();

      root.style.setProperty("--lex-hero-shift", `${Math.min(y * 0.14, 110)}px`);
      root.style.setProperty("--lex-card-shift", `${Math.max(y * -0.05, -48)}px`);
      root.style.setProperty("--lex-image-shift", `${Math.min(y * 0.07, 64)}px`);
    };

    updateMotion();

    scrollTarget.addEventListener("scroll", updateMotion, { passive: true });

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", updateMotion);
    };
  }, [rootRef, activePage]);
}

export function LexoraHeader({
  data,
  activePage,
}: {
  data: LexoraSeed;
  activePage: LexoraPageKey;
}) {
  return (
    <header className="lex-header">
      <div className="lex-header-inner">
        <a
          href={getLexoraHref("home")}
          data-lex-page="home"
          className="lex-brand"
          aria-label={data.brand.name}
        >
          <span className="lex-brand-name">{data.brand.name}</span>
          <span className="lex-brand-mark">{data.brand.logoText}</span>
        </a>

        <nav className="lex-nav" aria-label="ניווט ראשי">
          <a
            href={getLexoraHref("services")}
            data-lex-page="services"
            data-active={activePage === "services"}
          >
            שירותים
          </a>
          <a
            href={getLexoraHref("cases")}
            data-lex-page="cases"
            data-active={activePage === "cases"}
          >
            תיקים
          </a>
          <a
            href={getLexoraHref("process")}
            data-lex-page="process"
            data-active={activePage === "process"}
          >
            תהליך
          </a>
          <a
            href={getLexoraHref("about")}
            data-lex-page="about"
            data-active={activePage === "about"}
          >
            אודות
          </a>
        </nav>

        <a
          href={getLexoraHref("contact")}
          data-lex-page="contact"
          className="lex-header-cta"
        >
          ייעוץ משפטי
        </a>
      </div>
    </header>
  );
}

export function ServicesGrid({ data }: { data: LexoraSeed }) {
  return (
    <div className="lex-services-grid">
      {data.services.items.map((item, index) => (
        <Reveal
          key={item.title}
          className="lex-service-card"
          delay={index * 120}
        >
          <a
            href={getLexoraHref("contact")}
            data-lex-page="contact"
            className="lex-service-link"
          >
            <div className="lex-service-content">
              <span>0{index + 1}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
              <strong>{item.stat}</strong>
              <em>פרטים</em>
            </div>

            <div className="lex-service-image">
              <SafeImage src={item.image} alt={item.title} />
            </div>
          </a>
        </Reveal>
      ))}
    </div>
  );
}

export function CasesList({ data }: { data: LexoraSeed }) {
  return (
    <div className="lex-cases-list">
      {data.cases.items.map((item, index) => (
        <Reveal key={item.title} className="lex-case-card" delay={index * 140}>
          <div className="lex-case-image">
            <SafeImage src={item.image} alt={item.title} />
          </div>

          <div className="lex-case-content">
            <div className="lex-case-meta">
              <span>{item.year}</span>
              <span>{item.type}</span>
            </div>

            <h3>{item.title}</h3>
            <p>{item.text}</p>

            <div className="lex-case-details">
              <div>
                <span>תוצאה</span>
                <strong>{item.result}</strong>
              </div>
              <div>
                <span>משך טיפול</span>
                <strong>{item.duration}</strong>
              </div>
            </div>

            <a href={getLexoraHref("contact")} data-lex-page="contact">
              ייעוץ דומה
            </a>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ProcessSection({ data }: { data: LexoraSeed }) {
  return (
    <section className="lex-section">
      <div className="lex-container lex-process-grid">
        <Reveal>
          <div className="lex-sticky-copy">
            <div className="lex-eyebrow">{data.process.eyebrow}</div>
            <h2 className="lex-section-title">{data.process.title}</h2>
            <p className="lex-section-text">{data.process.text}</p>
          </div>
        </Reveal>

        <div className="lex-steps">
          {data.process.steps.map((step, index) => (
            <Reveal key={step.number} className="lex-step" delay={index * 130}>
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
}: {
  data: LexoraSeed;
  activePage?: LexoraPageKey;
}) {
  return (
    <footer className="lex-footer">
      <div className="lex-container lex-footer-inner">
        <div>
          <strong>{data.brand.name}</strong>
          <p>{data.footer.text}</p>
        </div>

        <nav>
          <a
            href={getLexoraHref("home")}
            data-lex-page="home"
            data-active={activePage === "home"}
          >
            בית
          </a>
          <a
            href={getLexoraHref("services")}
            data-lex-page="services"
            data-active={activePage === "services"}
          >
            שירותים
          </a>
          <a
            href={getLexoraHref("cases")}
            data-lex-page="cases"
            data-active={activePage === "cases"}
          >
            תיקים
          </a>
          <a
            href={getLexoraHref("contact")}
            data-lex-page="contact"
            data-active={activePage === "contact"}
          >
            יצירת קשר
          </a>
        </nav>
      </div>
    </footer>
  );
}