import React, { useEffect, useMemo, useRef } from "react";
import { wantravelEditorCss } from "./editorCss";
import { wantravelSeed, type WantravelSeed } from "./wantravelData";

export const wantravelPages = [
  {
    id: "home",
    name: "בית",
    slug: "/",
  },
];

type WantravelPagesProps = {
  data?: Partial<WantravelSeed>;
  defaultData?: Partial<WantravelSeed>;
  pageId?: string;
  pageSlug?: string;
  selectedPageId?: string;
  selectedPageSlug?: string;
};

function mergeWantravelData(
  base: WantravelSeed,
  override?: Partial<WantravelSeed>,
): WantravelSeed {
  if (!override) return base;

  return {
    ...base,
    ...override,
    brand: {
      ...base.brand,
      ...(override.brand || {}),
    },
    nav: override.nav || base.nav,
    hero: {
      ...base.hero,
      ...(override.hero || {}),
    },
    stats: override.stats || base.stats,
    marquee: override.marquee || base.marquee,
    destinations: {
      ...base.destinations,
      ...(override.destinations || {}),
      items: override.destinations?.items || base.destinations.items,
    },
    packages: {
      ...base.packages,
      ...(override.packages || {}),
      items: override.packages?.items || base.packages.items,
    },
    process: {
      ...base.process,
      ...(override.process || {}),
      steps: override.process?.steps || base.process.steps,
    },
    reviews: {
      ...base.reviews,
      ...(override.reviews || {}),
      items: override.reviews?.items || base.reviews.items,
    },
    booking: {
      ...base.booking,
      ...(override.booking || {}),
    },
    footer: {
      ...base.footer,
      ...(override.footer || {}),
    },
  };
}

function SafeImage({
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

function Reveal({
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

export default function WantravelPages(props: WantravelPagesProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(
    () => mergeWantravelData(wantravelSeed, props.data || props.defaultData),
    [props.data, props.defaultData],
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const revealElements = Array.from(
      root.querySelectorAll<HTMLElement>("[data-wan-reveal='true']"),
    );

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
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    revealElements.forEach((el) => observer.observe(el));

    const updateScrollMotion = () => {
      const y = window.scrollY || 0;
      const heroShift = Math.min(y * 0.16, 120);
      const cardShift = Math.min(y * -0.06, 0);
      const imageShift = Math.min(y * 0.08, 70);

      root.style.setProperty("--wan-hero-shift", `${heroShift}px`);
      root.style.setProperty("--wan-card-shift", `${cardShift}px`);
      root.style.setProperty("--wan-image-shift", `${imageShift}px`);
    };

    updateScrollMotion();
    window.addEventListener("scroll", updateScrollMotion, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateScrollMotion);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-template-id="wantravel"
      className="wan-page"
    >
      <style>{wantravelEditorCss}</style>

      <header className="wan-header">
        <div className="wan-header-inner">
          <a href="#top" className="wan-brand" aria-label={data.brand.name}>
            <span className="wan-brand-mark">{data.brand.logoText}</span>
            <span className="wan-brand-name">{data.brand.name}</span>
          </a>

          <nav className="wan-nav" aria-label="ניווט ראשי">
            {data.nav.map((item) => (
              <a key={item.href} href={item.href}>
                {item.label}
              </a>
            ))}
          </nav>

          <a className="wan-header-cta" href="#booking">
            תכנון חופשה
          </a>
        </div>
      </header>

      <main id="top">
        <section className="wan-hero">
          <div className="wan-hero-bg">
            <SafeImage
              src={data.hero.image}
              alt={data.hero.title}
              className="wan-hero-bg-image"
            />
            <div className="wan-hero-overlay" />
            <div className="wan-hero-noise" />
          </div>

          <div className="wan-hero-orb wan-hero-orb-one" />
          <div className="wan-hero-orb wan-hero-orb-two" />

          <div className="wan-container wan-hero-grid">
            <div className="wan-hero-content">
              <Reveal className="wan-hero-reveal" delay={60}>
                <div className="wan-hero-kicker">
                  <span className="wan-dot" />
                  <span>{data.hero.eyebrow}</span>
                </div>
              </Reveal>

              <Reveal className="wan-hero-reveal" delay={150}>
                <h1 className="wan-hero-title">
                  <span>חופשה</span>
                  <span>שמרגישה</span>
                  <span>תפורה אישית</span>
                </h1>
              </Reveal>

              <Reveal className="wan-hero-reveal" delay={260}>
                <p className="wan-hero-text">{data.hero.text}</p>
              </Reveal>

              <Reveal className="wan-hero-reveal" delay={360}>
                <div className="wan-hero-actions">
                  <a href="#booking" className="wan-btn-primary">
                    {data.hero.primaryButton}
                    <span>←</span>
                  </a>

                  <a href="#destinations" className="wan-btn-secondary">
                    {data.hero.secondaryButton}
                  </a>
                </div>
              </Reveal>
            </div>

            <div className="wan-hero-showcase">
              <Reveal className="wan-showcase-main" delay={180}>
                <SafeImage
                  src={data.hero.floatingImage}
                  alt="חופשת בוטיק"
                  className="wan-showcase-image"
                />
                <div className="wan-showcase-label">
                  <span>01</span>
                  <strong>יעד נבחר</strong>
                </div>
              </Reveal>

              <Reveal className="wan-showcase-card" delay={340}>
                <p>{data.brand.badge}</p>
                <h3>{data.hero.cardTitle}</h3>
                <span>{data.hero.cardText}</span>
              </Reveal>

              <Reveal className="wan-mini-card wan-mini-card-one" delay={480}>
                <strong>48+</strong>
                <span>יעדים בהתאמה</span>
              </Reveal>

              <Reveal className="wan-mini-card wan-mini-card-two" delay={560}>
                <strong>24/7</strong>
                <span>ליווי אישי</span>
              </Reveal>
            </div>
          </div>

          <div className="wan-container wan-search-wrap">
            <Reveal delay={620}>
              <div className="wan-search-card">
                <div className="wan-search-item">
                  <span>יעד</span>
                  <strong>לאן תרצו לטוס?</strong>
                </div>
                <div className="wan-search-item">
                  <span>סגנון</span>
                  <strong>יוקרה / משפחתי / זוגי</strong>
                </div>
                <div className="wan-search-item">
                  <span>תקציב</span>
                  <strong>מותאם אישית</strong>
                </div>
                <a href="#booking" className="wan-search-button">
                  התחילו תכנון
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="wan-marquee-section" aria-hidden="true">
          <div className="wan-marquee-track">
            {[...data.marquee, ...data.marquee, ...data.marquee].map(
              (item, index) => (
                <React.Fragment key={`${item}-${index}`}>
                  <span>{item}</span>
                  <i>✦</i>
                </React.Fragment>
              ),
            )}
          </div>
        </section>

        <section id="destinations" className="wan-section wan-destination-zone">
          <div className="wan-container">
            <div className="wan-section-head">
              <Reveal>
                <div className="wan-eyebrow-dark">
                  {data.destinations.eyebrow}
                </div>
                <h2 className="wan-section-title">
                  {data.destinations.title}
                </h2>
              </Reveal>

              <Reveal delay={140}>
                <p className="wan-section-text">{data.destinations.text}</p>
              </Reveal>
            </div>

            <div className="wan-destination-layout">
              {data.destinations.items.map((item, index) => (
                <Reveal
                  key={`${item.title}-${item.country}`}
                  className={
                    index === 0
                      ? "wan-destination-card wan-destination-card-large"
                      : "wan-destination-card"
                  }
                  delay={index * 110}
                >
                  <SafeImage src={item.image} alt={item.title} />
                  <div className="wan-destination-gradient" />
                  <div className="wan-destination-top">
                    <span>{item.tag}</span>
                    <b>{String(index + 1).padStart(2, "0")}</b>
                  </div>
                  <div className="wan-destination-body">
                    <h3>{item.title}</h3>
                    <p>{item.country}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="wan-section wan-packages-section">
          <div className="wan-container">
            <div className="wan-section-head wan-section-head-light">
              <Reveal>
                <div className="wan-eyebrow-light-solid">
                  {data.packages.eyebrow}
                </div>
                <h2 className="wan-section-title">{data.packages.title}</h2>
              </Reveal>

              <Reveal delay={140}>
                <p className="wan-section-text">{data.packages.text}</p>
              </Reveal>
            </div>

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
                    <span className="wan-package-index">
                      0{index + 1}
                    </span>
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

                    <a href="#booking">לפרטים נוספים ←</a>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="wan-editorial-section">
          <div className="wan-container wan-editorial-grid">
            <Reveal className="wan-editorial-copy">
              <span>חוויה מלאה</span>
              <h2>לא עוד אתר רגיל. נראות של מותג נסיעות פרימיום.</h2>
              <p>
                עמוד בית שמרגיש כמו מגזין תיירות יוקרתי: תמונות גדולות, תנועה
                חלקה, שכבות, עומק, כרטיסים צפים וקריאה ברורה להשארת פרטים.
              </p>
            </Reveal>

            <div className="wan-editorial-images">
              <Reveal className="wan-editorial-image wan-editorial-image-one">
                <SafeImage
                  src="https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=90"
                  alt="נוף הררי"
                />
              </Reveal>

              <Reveal className="wan-editorial-image wan-editorial-image-two" delay={180}>
                <SafeImage
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=90"
                  alt="חופשה טרופית"
                />
              </Reveal>
            </div>
          </div>
        </section>

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
      </main>

      <footer className="wan-footer">
        <div className="wan-container wan-footer-inner">
          <div>
            <strong>{data.brand.name}</strong>
            <p>{data.footer.text}</p>
          </div>

          <nav>
            <a href="#top">בית</a>
            <a href="#destinations">יעדים</a>
            <a href="#packages">חבילות</a>
            <a href="#booking">יצירת קשר</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}