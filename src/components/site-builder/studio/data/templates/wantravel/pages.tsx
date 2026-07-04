import React, { useEffect, useMemo, useRef } from "react";
import { wantravelEditorCss } from "./editorCss";
import { wantravelSeed, type WantravelSeed } from "./wantravelData";

export const wantravelPages = [
  {
    id: "home",
    name: "בית",
    slug: "/",
  },
  {
    id: "packages",
    name: "חבילות",
    slug: "/packages",
  },
  {
    id: "process",
    name: "איך זה עובד",
    slug: "/how-it-works",
  },
  {
    id: "reviews",
    name: "המלצות",
    slug: "/reviews",
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

function normalizePageValue(value: string | null | undefined) {
  return String(value || "").trim().toLowerCase();
}

function getActiveWantravelPage(props: WantravelPagesProps) {
  const raw =
    normalizePageValue(props.selectedPageId) ||
    normalizePageValue(props.pageId) ||
    normalizePageValue(props.selectedPageSlug) ||
    normalizePageValue(props.pageSlug);

  if (raw.includes("packages")) return "packages";
  if (raw.includes("how-it-works") || raw.includes("process")) return "process";
  if (raw.includes("reviews") || raw.includes("testimonials")) return "reviews";

  return "home";
}

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

function WantravelHeader({
  data,
  activePage,
}: {
  data: WantravelSeed;
  activePage: string;
}) {
  return (
    <header className="wan-header">
      <div className="wan-header-inner">
        <a href="/" className="wan-brand" aria-label={data.brand.name}>
          <span className="wan-brand-name">{data.brand.name}</span>
          <span className="wan-brand-mark">{data.brand.logoText}</span>
        </a>

        <nav className="wan-nav" aria-label="ניווט ראשי">
          <a href="/packages" data-active={activePage === "packages"}>
            חבילות
          </a>
          <a href="/how-it-works" data-active={activePage === "process"}>
            איך זה עובד
          </a>
          <a href="/reviews" data-active={activePage === "reviews"}>
            המלצות
          </a>
          <a href="/#destinations">יעדים</a>
        </nav>

        <a className="wan-header-cta" href="/#booking">
          תכנון חופשה
        </a>
      </div>
    </header>
  );
}

function BookingSection({ data }: { data: WantravelSeed }) {
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

function WantravelHomePage({ data }: { data: WantravelSeed }) {
  return (
    <>
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
                  <span>{data.hero.eyebrow}</span>
                  <span className="wan-dot" />
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
                <strong>+48</strong>
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

            <PackagesGrid data={data} />
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

              <Reveal
                className="wan-editorial-image wan-editorial-image-two"
                delay={180}
              >
                <SafeImage
                  src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=90"
                  alt="חופשה טרופית"
                />
              </Reveal>
            </div>
          </div>
        </section>

        <ProcessSection data={data} />
        <ReviewsSection data={data} />
        <BookingSection data={data} />
      </main>
    </>
  );
}

function PackagesGrid({ data }: { data: WantravelSeed }) {
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

            <a href="/#booking">לפרטים נוספים ←</a>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ProcessSection({ data }: { data: WantravelSeed }) {
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

function ReviewsSection({ data }: { data: WantravelSeed }) {
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

function WantravelPackagesPage({ data }: { data: WantravelSeed }) {
  return (
    <main className="wan-inner-page">
      <section className="wan-page-hero">
        <div className="wan-container wan-page-hero-grid">
          <Reveal>
            <div>
              <div className="wan-eyebrow-dark">חבילות נסיעה</div>
              <h1>חבילות מדויקות לכל סוג של חופשה</h1>
              <p>
                חבילות זוגיות, משפחתיות ואקזוטיות עם תכנון מלא, נראות יוקרתית
                וחוויית לקוח שמובילה להשארת פרטים.
              </p>
            </div>
          </Reveal>

          <Reveal className="wan-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1100&q=90"
              alt="חבילות נסיעה"
            />
          </Reveal>
        </div>
      </section>

      <section className="wan-section wan-packages-page-section">
        <div className="wan-container">
          <PackagesGrid data={data} />
        </div>
      </section>

      <BookingSection data={data} />
    </main>
  );
}

function WantravelProcessPage({ data }: { data: WantravelSeed }) {
  return (
    <main className="wan-inner-page">
      <section className="wan-page-hero wan-page-hero-soft">
        <div className="wan-container wan-page-hero-grid">
          <Reveal>
            <div>
              <div className="wan-eyebrow-dark">איך זה עובד</div>
              <h1>תהליך פשוט, ברור ויוקרתי מהשיחה הראשונה עד החופשה</h1>
              <p>
                העמוד הזה מציג ללקוח איך השירות עובד, מוריד התנגדויות ומסביר
                למה כדאי להשאיר פרטים.
              </p>
            </div>
          </Reveal>

          <Reveal className="wan-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1100&q=90"
              alt="איך זה עובד"
            />
          </Reveal>
        </div>
      </section>

      <ProcessSection data={data} />

      <section className="wan-editorial-section">
        <div className="wan-container wan-editorial-grid">
          <Reveal className="wan-editorial-copy">
            <span>שירות אישי</span>
            <h2>כל לקוח מקבל מסלול שנבנה לפי הסגנון שלו.</h2>
            <p>
              לא בוחרים תבנית מוכנה. בונים חוויה לפי תקציב, יעד, אופי הטיול
              ורמת הליווי שהלקוח צריך.
            </p>
          </Reveal>

          <div className="wan-editorial-images">
            <Reveal className="wan-editorial-image wan-editorial-image-one">
              <SafeImage
                src="https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=900&q=90"
                alt="תכנון חופשה"
              />
            </Reveal>

            <Reveal
              className="wan-editorial-image wan-editorial-image-two"
              delay={180}
            >
              <SafeImage
                src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=900&q=90"
                alt="טיול באיטליה"
              />
            </Reveal>
          </div>
        </div>
      </section>

      <BookingSection data={data} />
    </main>
  );
}

function WantravelReviewsPage({ data }: { data: WantravelSeed }) {
  return (
    <main className="wan-inner-page">
      <section className="wan-page-hero">
        <div className="wan-container wan-page-hero-grid">
          <Reveal>
            <div>
              <div className="wan-eyebrow-dark">המלצות</div>
              <h1>לקוחות מרגישים את ההבדל כשהכול מתוכנן נכון</h1>
              <p>
                עמוד המלצות יוקרתי שמחזק אמון, מציג חוויות אמיתיות ומעודד לקוחות
                חדשים להתחיל תכנון.
              </p>
            </div>
          </Reveal>

          <Reveal className="wan-page-hero-image" delay={160}>
            <SafeImage
              src="https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=1100&q=90"
              alt="לקוחות ממליצים"
            />
          </Reveal>
        </div>
      </section>

      <ReviewsSection data={data} />

      <BookingSection data={data} />
    </main>
  );
}

function WantravelFooter({ data }: { data: WantravelSeed }) {
  return (
    <footer className="wan-footer">
      <div className="wan-container wan-footer-inner">
        <div>
          <strong>{data.brand.name}</strong>
          <p>{data.footer.text}</p>
        </div>

        <nav>
          <a href="/">בית</a>
          <a href="/packages">חבילות</a>
          <a href="/how-it-works">איך זה עובד</a>
          <a href="/reviews">המלצות</a>
        </nav>
      </div>
    </footer>
  );
}

export default function WantravelPages(props: WantravelPagesProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const data = useMemo(
    () => mergeWantravelData(wantravelSeed, props.data || props.defaultData),
    [props.data, props.defaultData],
  );

  const activePage = getActiveWantravelPage(props);

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
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
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
  }, [activePage]);

  return (
    <div
      ref={rootRef}
      dir="rtl"
      data-template-id="wantravel"
      className="wan-page"
    >
      <style>{wantravelEditorCss}</style>

      <WantravelHeader data={data} activePage={activePage} />

      {activePage === "packages" ? <WantravelPackagesPage data={data} /> : null}
      {activePage === "process" ? <WantravelProcessPage data={data} /> : null}
      {activePage === "reviews" ? <WantravelReviewsPage data={data} /> : null}
      {activePage === "home" ? <WantravelHomePage data={data} /> : null}

      <WantravelFooter data={data} />
    </div>
  );
}