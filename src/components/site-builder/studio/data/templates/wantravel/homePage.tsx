import React from "react";
import type { WantravelSeed } from "./wantravelData";
import {
  BookingSection,
  PackagesGrid,
  ProcessSection,
  Reveal,
  ReviewsSection,
  SafeImage,
} from "./shared";

export default function WantravelHomePage({ data }: { data: WantravelSeed }) {
  return (
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
              <h2 className="wan-section-title">{data.destinations.title}</h2>
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
  );
}