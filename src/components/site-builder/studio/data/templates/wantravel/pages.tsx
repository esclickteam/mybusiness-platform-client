import React from "react";
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

export default function WantravelPages(props: WantravelPagesProps) {
  const data = mergeWantravelData(
    wantravelSeed,
    props.data || props.defaultData,
  );

  return (
    <div dir="rtl" data-template-id="wantravel" className="wan-page">
      <style>{wantravelEditorCss}</style>

      <header className="wan-header">
        <div className="wan-header-inner">
          <a href="#top" className="wan-brand">
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
              className="wan-scale"
            />
            <div className="wan-hero-overlay" />
          </div>

          <div className="wan-container wan-hero-grid">
            <div className="wan-hero-content wan-reveal">
              <div className="wan-eyebrow-light">
                <span className="wan-dot" />
                <span>{data.hero.eyebrow}</span>
              </div>

              <h1 className="wan-hero-title">{data.hero.title}</h1>

              <p className="wan-hero-text">{data.hero.text}</p>

              <div className="wan-hero-actions">
                <a href="#booking" className="wan-btn-primary">
                  {data.hero.primaryButton}
                  <span style={{ marginInlineStart: 10 }}>←</span>
                </a>

                <a href="#destinations" className="wan-btn-secondary">
                  {data.hero.secondaryButton}
                </a>
              </div>
            </div>

            <div className="wan-hero-visual wan-reveal">
              <div className="wan-floating-image wan-float">
                <SafeImage
                  src={data.hero.floatingImage}
                  alt="חוויית נסיעה"
                />
              </div>

              <div className="wan-floating-card">
                <p className="wan-floating-card-kicker">{data.brand.badge}</p>
                <h3>{data.hero.cardTitle}</h3>
                <p>{data.hero.cardText}</p>
              </div>
            </div>
          </div>

          <div className="wan-container">
            <div className="wan-stats">
              {data.stats.map((item, index) => (
                <div
                  key={`${item.value}-${item.label}`}
                  className="wan-stat wan-reveal"
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <div className="wan-stat-value">{item.value}</div>
                  <div className="wan-stat-label">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="wan-marquee-wrap">
              <div className="wan-marquee">
                {[...data.marquee, ...data.marquee, ...data.marquee].map(
                  (item, index) => (
                    <React.Fragment key={`${item}-${index}`}>
                      <span>{item}</span>
                      <span>•</span>
                    </React.Fragment>
                  ),
                )}
              </div>
            </div>
          </div>
        </section>

        <section id="destinations" className="wan-section">
          <div className="wan-container">
            <div className="wan-section-head">
              <div>
                <div className="wan-eyebrow-dark">
                  {data.destinations.eyebrow}
                </div>
                <h2 className="wan-section-title">
                  {data.destinations.title}
                </h2>
              </div>

              <p className="wan-section-text">{data.destinations.text}</p>
            </div>

            <div className="wan-destinations-grid">
              {data.destinations.items.map((item, index) => (
                <article
                  key={`${item.title}-${item.country}`}
                  className="wan-destination-card wan-reveal"
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <SafeImage src={item.image} alt={item.title} />
                  <div className="wan-destination-overlay" />
                  <span className="wan-destination-tag">{item.tag}</span>

                  <div className="wan-destination-body">
                    <h3>{item.title}</h3>
                    <p>{item.country}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="packages" className="wan-section wan-packages-section">
          <div className="wan-container">
            <div className="wan-section-head">
              <div>
                <div className="wan-eyebrow-dark">{data.packages.eyebrow}</div>
                <h2 className="wan-section-title">{data.packages.title}</h2>
              </div>

              <p className="wan-section-text">{data.packages.text}</p>
            </div>

            <div className="wan-packages-grid">
              {data.packages.items.map((item, index) => (
                <article
                  key={`${item.title}-${item.location}`}
                  className="wan-package-card wan-reveal"
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <div className="wan-package-image">
                    <SafeImage src={item.image} alt={item.title} />
                  </div>

                  <div className="wan-package-body">
                    <div className="wan-package-top">
                      <div>
                        <h3 className="wan-package-title">{item.title}</h3>
                        <p className="wan-package-location">{item.location}</p>
                      </div>

                      <span className="wan-package-price">{item.price}</span>
                    </div>

                    <ul className="wan-package-list">
                      {item.features.map((feature) => (
                        <li key={feature}>
                          <span className="wan-list-dot" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <a href="#booking" className="wan-card-link">
                      לפרטים נוספים
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="wan-section">
          <div className="wan-container wan-process-grid">
            <div>
              <div className="wan-eyebrow-dark">{data.process.eyebrow}</div>
              <h2 className="wan-section-title">{data.process.title}</h2>
              <p className="wan-section-text" style={{ marginTop: 24 }}>
                {data.process.text}
              </p>
            </div>

            <div className="wan-steps">
              {data.process.steps.map((step, index) => (
                <article
                  key={`${step.number}-${step.title}`}
                  className="wan-step wan-reveal"
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <div className="wan-step-row">
                    <span className="wan-step-number">{step.number}</span>

                    <div>
                      <h3>{step.title}</h3>
                      <p>{step.text}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="wan-section wan-reviews-section">
          <div className="wan-container">
            <div className="wan-section-head wan-center">
              <div>
                <div className="wan-eyebrow-dark">{data.reviews.eyebrow}</div>
                <h2 className="wan-section-title">{data.reviews.title}</h2>
              </div>
            </div>

            <div className="wan-reviews-grid">
              {data.reviews.items.map((item, index) => (
                <article
                  key={`${item.name}-${item.role}`}
                  className="wan-review-card wan-reveal"
                  style={{ animationDelay: `${0.08 * index}s` }}
                >
                  <div className="wan-stars" aria-hidden="true">
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                    <span>★</span>
                  </div>

                  <p className="wan-review-text">"{item.text}"</p>
                  <p className="wan-review-name">{item.name}</p>
                  <p className="wan-review-role">{item.role}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="booking" className="wan-booking">
          <div className="wan-container">
            <div className="wan-booking-card">
              <div>
                <div className="wan-eyebrow-dark">{data.booking.eyebrow}</div>
                <h2 className="wan-section-title">{data.booking.title}</h2>
                <p className="wan-section-text" style={{ marginTop: 24 }}>
                  {data.booking.text}
                </p>

                <div className="wan-booking-notes">
                  <div className="wan-booking-note">
                    <span>מענה אישי</span>
                    <strong>{data.booking.noteOne}</strong>
                  </div>

                  <div className="wan-booking-note">
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
                <div className="wan-form-grid">
                  <div className="wan-field">
                    <label htmlFor="wantravel-name">שם מלא</label>
                    <input
                      id="wantravel-name"
                      className="wan-input"
                      type="text"
                      placeholder="השם שלך"
                    />
                  </div>

                  <div className="wan-field">
                    <label htmlFor="wantravel-phone">טלפון</label>
                    <input
                      id="wantravel-phone"
                      className="wan-input"
                      type="tel"
                      placeholder="050-0000000"
                    />
                  </div>

                  <div className="wan-field">
                    <label htmlFor="wantravel-destination">יעד מבוקש</label>
                    <input
                      id="wantravel-destination"
                      className="wan-input"
                      type="text"
                      placeholder="למשל: יוון / איטליה / באלי"
                    />
                  </div>

                  <div className="wan-field">
                    <label htmlFor="wantravel-message">הודעה</label>
                    <textarea
                      id="wantravel-message"
                      className="wan-textarea"
                      placeholder="ספרו בקצרה מה אתם מחפשים"
                    />
                  </div>

                  <button className="wan-submit" type="submit">
                    {data.booking.button}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="wan-footer">
        <div className="wan-container wan-footer-inner">
          <div>
            <div className="wan-footer-brand">{data.brand.name}</div>
            <div className="wan-footer-text">{data.footer.text}</div>
          </div>

          <nav className="wan-footer-links" aria-label="ניווט תחתון">
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