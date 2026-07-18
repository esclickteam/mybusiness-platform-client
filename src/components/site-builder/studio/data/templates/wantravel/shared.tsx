import React, { useEffect } from "react";
import type { RefObject } from "react";
import type { WantravelSeed } from "./wantravelData";

export type WantravelPageKey = "home" | "packages" | "process" | "reviews";

function getWantravelPageSlug(page: WantravelPageKey) {
  if (page === "packages") return "/packages";
  if (page === "process") return "/how-it-works";
  if (page === "reviews") return "/reviews";

  return "/";
}

function getWantravelBasePath() {
  if (typeof window === "undefined") return "";

  const pathname = window.location.pathname || "/";
  const clean = pathname.replace(/\/+$/, "") || "/";

  if (clean.endsWith("/packages")) {
    return clean.slice(0, -"/packages".length) || "";
  }

  if (clean.endsWith("/how-it-works")) {
    return clean.slice(0, -"/how-it-works".length) || "";
  }

  if (clean.endsWith("/reviews")) {
    return clean.slice(0, -"/reviews".length) || "";
  }

  return clean === "/" ? "" : clean;
}

export function getWantravelHref(page: WantravelPageKey, hash?: string) {
  const basePath = getWantravelBasePath();
  const pageSlug = getWantravelPageSlug(page);
  const cleanHash = hash ? `#${hash.replace(/^#/, "")}` : "";

  if (pageSlug === "/") {
    return `${basePath || "/"}${cleanHash}`;
  }

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
            "linear-gradient(135deg, #18392f 0%, #b6772f 100%)";
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
      data-wan-reveal="true"
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export function useWantravelMotion(
  rootRef: RefObject<HTMLDivElement | null>,
  activePage: string,
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const previewScroller = root.closest(
      ".wantravel-preview-scroll",
    ) as HTMLElement | null;

    const scrollTarget: HTMLElement | Window = previewScroller || window;

    const revealElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-wan-reveal='true']"),
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

    const updateScrollMotion = () => {
      const y = getScrollTop();

      const heroShift = Math.min(y * 0.16, 120);
      const cardShift = Math.max(y * -0.06, -55);
      const imageShift = Math.min(y * 0.08, 70);

      root.style.setProperty("--wan-hero-shift", `${heroShift}px`);
      root.style.setProperty("--wan-card-shift", `${cardShift}px`);
      root.style.setProperty("--wan-image-shift", `${imageShift}px`);
    };

    updateScrollMotion();

    scrollTarget.addEventListener("scroll", updateScrollMotion, {
      passive: true,
    });

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener("scroll", updateScrollMotion);
    };
  }, [rootRef, activePage]);
}

export function WantravelHeader({
  data,
  activePage,
}: {
  data: WantravelSeed;
  activePage: WantravelPageKey;
}) {
  return (
    <header data-visual-flow-lock="true" data-template-section-type="header" data-section-kind="header" className="wan-header">
      <div className="wan-header-inner">
        <a
          href={getWantravelHref("home")}
          data-wan-page="home"
          className="wan-brand"
          aria-label={data.brand.name}
        >
          <span className="wan-brand-name">{data.brand.name}</span>
          <span className="wan-brand-mark">{data.brand.logoText}</span>
        </a>

        <nav className="wan-nav" aria-label="ניווט ראשי">
          <a
            href={getWantravelHref("packages")}
            data-wan-page="packages"
            data-active={activePage === "packages"}
          >
            חבילות
          </a>

          <a
            href={getWantravelHref("process")}
            data-wan-page="process"
            data-active={activePage === "process"}
          >
            איך זה עובד
          </a>

          <a
            href={getWantravelHref("reviews")}
            data-wan-page="reviews"
            data-active={activePage === "reviews"}
          >
            המלצות
          </a>

          <a
            href={getWantravelHref("home", "destinations")}
            data-wan-page="home"
            data-wan-hash="destinations"
          >
            יעדים
          </a>
        </nav>

        <a
          className="wan-header-cta"
          href={getWantravelHref("home", "booking")}
          data-wan-page="home"
          data-wan-hash="booking"
        >
          תכנון חופשה
        </a>
      </div>
    </header>
  );
}

export function PackagesGrid({ data }: { data: WantravelSeed }) {
  return (
    <div className="wan-packages-grid">
      {data.packages.items.map((item, index) => (
        <Reveal
          key={`${item.title}-${item.location}`}
          className="wan-package-card"
          delay={index * 120}
        >
          <div className="wan-package-image">
            <SafeImage src={item.image} alt={item.title} />
            <span className="wan-package-price">{item.price}</span>
          </div>

          <div className="wan-package-body">
            <span className="wan-package-index">0{index + 1}</span>
            <h3>{item.title}</h3>
            <p>{item.location}</p>

            <ul>
              {item.features.map((feature) => (
                <li key={feature}>
                  <span />
                  {feature}
                </li>
              ))}
            </ul>

            <a
              href={getWantravelHref("home", "booking")}
              data-wan-page="home"
              data-wan-hash="booking"
            >
              לפרטים נוספים ←
            </a>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function ProcessSection({ data }: { data: WantravelSeed }) {
  return (
    <section id="process" className="wan-section">
      <div className="wan-container wan-process-grid">
        <Reveal>
          <div className="wan-sticky-copy">
            <div className="wan-eyebrow-dark">{data.process.eyebrow}</div>
            <h2 className="wan-section-title">{data.process.title}</h2>
            <p className="wan-section-text">{data.process.text}</p>
          </div>
        </Reveal>

        <div className="wan-steps">
          {data.process.steps.map((step, index) => (
            <Reveal
              key={`${step.number}-${step.title}`}
              className="wan-step"
              delay={index * 120}
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

export function ReviewsSection({ data }: { data: WantravelSeed }) {
  return (
    <section id="reviews" className="wan-section wan-reviews-section">
      <div className="wan-container">
        <Reveal className="wan-center-head">
          <div className="wan-eyebrow-dark">{data.reviews.eyebrow}</div>
          <h2 className="wan-section-title">{data.reviews.title}</h2>
        </Reveal>

        <div className="wan-reviews-grid">
          {data.reviews.items.map((item, index) => (
            <Reveal
              key={`${item.name}-${item.role}`}
              className="wan-review-card"
              delay={index * 140}
            >
              <div className="wan-stars">★★★★★</div>
              <p>"{item.text}"</p>
              <strong>{item.name}</strong>
              <span>{item.role}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function BookingSection({ data }: { data: WantravelSeed }) {
  return (
    <section id="booking" className="wan-booking">
      <div className="wan-container">
        <Reveal>
          <div className="wan-booking-card">
            <div className="wan-booking-copy">
              <div className="wan-eyebrow-light-solid">
                {data.booking.eyebrow}
              </div>
              <h2>{data.booking.title}</h2>
              <p>{data.booking.text}</p>

              <div className="wan-booking-notes">
                <div>
                  <span>מענה אישי</span>
                  <strong>{data.booking.noteOne}</strong>
                </div>
                <div>
                  <span>התאמה מלאה</span>
                  <strong>{data.booking.noteTwo}</strong>
                </div>
              </div>
            </div>

            <form
              className="wan-form"
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
                <span>יעד מבוקש</span>
                <input type="text" placeholder="למשל: יוון / איטליה / באלי" />
              </label>

              <label>
                <span>הודעה</span>
                <textarea placeholder="ספרו בקצרה מה אתם מחפשים" />
              </label>

              <button type="submit">{data.booking.button}</button>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function WantravelFooter({
  data,
  activePage,
}: {
  data: WantravelSeed;
  activePage?: WantravelPageKey;
}) {
  return (
    <footer className="wan-footer">
      <div className="wan-container wan-footer-inner">
        <div>
          <strong>{data.brand.name}</strong>
          <p>{data.footer.text}</p>
        </div>

        <nav>
          <a
            href={getWantravelHref("home")}
            data-wan-page="home"
            data-active={activePage === "home"}
          >
            בית
          </a>

          <a
            href={getWantravelHref("packages")}
            data-wan-page="packages"
            data-active={activePage === "packages"}
          >
            חבילות
          </a>

          <a
            href={getWantravelHref("process")}
            data-wan-page="process"
            data-active={activePage === "process"}
          >
            איך זה עובד
          </a>

          <a
            href={getWantravelHref("reviews")}
            data-wan-page="reviews"
            data-active={activePage === "reviews"}
          >
            המלצות
          </a>
        </nav>
      </div>
    </footer>
  );
}