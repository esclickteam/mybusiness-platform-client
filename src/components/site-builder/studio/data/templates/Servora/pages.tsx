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

function safeArray<T = any>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];
  if (Array.isArray(fallback)) return fallback;
  return [];
}

function safeObject<T extends Record<string, any>>(
  value: unknown,
  fallback: T,
): Partial<T> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return value as Partial<T>;
}

function getMediaUrl(value: unknown) {
  if (typeof value === "string") return value.trim();

  if (value && typeof value === "object" && !Array.isArray(value)) {
    const item = value as Record<string, any>;

    return String(
      item.secureUrl ||
        item.secure_url ||
        item.url ||
        item.src ||
        item.originalUrl ||
        "",
    ).trim();
  }

  return "";
}

function isVideoUrl(value: unknown) {
  const src = getMediaUrl(value).toLowerCase().split("?")[0].split("#")[0];

  return Boolean(
    src.includes("/video/upload/") ||
      src.endsWith(".mp4") ||
      src.endsWith(".webm") ||
      src.endsWith(".mov") ||
      src.endsWith(".m4v") ||
      src.endsWith(".ogv"),
  );
}

function MediaElement({
  src,
  alt,
  className,
  field,
}: {
  src: unknown;
  alt: string;
  className?: string;
  field: string;
}) {
  const mediaSrc = getMediaUrl(src);

  if (!mediaSrc) {
    return null;
  }

  const sharedProps = {
    className,
    "data-editable": "image",
    "data-field": field,
    "data-image-field": field,
    "data-visual-media-type": isVideoUrl(mediaSrc) ? "video" : "image",
    "data-visual-current-src": mediaSrc,
  } as Record<string, any>;

  if (isVideoUrl(mediaSrc)) {
    return (
      <video
        {...sharedProps}
        src={mediaSrc}
        title={alt}
        aria-label={alt}
        controls
        playsInline
        preload="metadata"
      />
    );
  }

  return <img {...sharedProps} src={mediaSrc} alt={alt} />;
}

function mergeData(data?: Partial<ServoraData>): ServoraData {
  const safeData = safeObject(data, servoraDefaultData);
  const heroData = safeObject(safeData.hero, servoraDefaultData.hero);
  const projectData = safeObject(safeData.project, servoraDefaultData.project);

  return {
    ...servoraDefaultData,
    ...safeData,

    brand: {
      ...servoraDefaultData.brand,
      ...safeObject(safeData.brand, servoraDefaultData.brand),
    },

    hero: {
      ...servoraDefaultData.hero,
      ...heroData,
      bullets: safeArray((heroData as any).bullets, servoraDefaultData.hero.bullets),
      image:
        getMediaUrl((heroData as any).image) ||
        getMediaUrl(servoraDefaultData.hero.image),
    },

    project: {
      ...servoraDefaultData.project,
      ...projectData,
      points: safeArray(
        (projectData as any).points,
        servoraDefaultData.project.points,
      ),
      image:
        getMediaUrl((projectData as any).image) ||
        getMediaUrl(servoraDefaultData.project.image),
    },

    cta: {
      ...servoraDefaultData.cta,
      ...safeObject(safeData.cta, servoraDefaultData.cta),
    },

    contact: {
      ...servoraDefaultData.contact,
      ...safeObject(safeData.contact, servoraDefaultData.contact),
    },

    nav: safeArray(safeData.nav, servoraDefaultData.nav),
    trustPills: safeArray(safeData.trustPills, servoraDefaultData.trustPills),
    stats: safeArray(safeData.stats, servoraDefaultData.stats),
    services: safeArray(safeData.services, servoraDefaultData.services),
    process: safeArray(safeData.process, servoraDefaultData.process),
    pricing: safeArray(safeData.pricing, servoraDefaultData.pricing),
    testimonials: safeArray(
      safeData.testimonials,
      servoraDefaultData.testimonials,
    ),
    faq: safeArray(safeData.faq, servoraDefaultData.faq),
  };
}

function normalizePage(page?: string): ServoraPageId {
  if (page === "services" || page === "pricing" || page === "gallery" || page === "contact") return page;
  return "home";
}

function AnimatedStatValue({ value }: { value: string }) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === "undefined") return;

    const raw = String(value || "").trim();
    const numeric = raw.match(/^(\+?)(\d[\d,.]*)(.*)$/);

    if (!numeric) {
      setDisplayValue(raw);
      return;
    }

    const prefix = numeric[1] || "";
    const targetNumber = Number(numeric[2].replace(/,/g, ""));
    const suffix = numeric[3] || "";

    if (!Number.isFinite(targetNumber)) {
      setDisplayValue(raw);
      return;
    }

    let frame = 0;
    let started = false;

    const start = () => {
      if (started) return;
      started = true;
      const startTime = performance.now();
      const duration = 950;

      const tick = (now: number) => {
        const progress = Math.min(1, (now - startTime) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(targetNumber * eased);
        setDisplayValue(`${prefix}${current.toLocaleString("en-US")}${suffix}`);
        if (progress < 1) frame = window.requestAnimationFrame(tick);
      };

      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          start();
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref} className="servora-counter-value" data-editable="text">
      {displayValue}
    </span>
  );
}

export default function ServoraPages({ initialPage = "home", mode = "preview", data }: ServoraPagesProps) {
  const templateData = useMemo(() => mergeData(data), [data]);
  const [currentPage, setCurrentPage] = useState<ServoraPageId>(normalizePage(initialPage));

  function goTo(page: ServoraPageId) {
    setCurrentPage(page);
    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "smooth" }));
    }
  }

  return (
    <>
      <style>{servoraEditorCss}</style>
      <main dir="rtl" data-template-id="servora" data-template-mode={mode} className="servora-page">
        <Header data={templateData} currentPage={currentPage} onNavigate={goTo} />
        {currentPage === "home" && <HomePage data={templateData} onNavigate={goTo} />}
        {currentPage === "services" && <ServicesPage data={templateData} onNavigate={goTo} />}
        {currentPage === "pricing" && <PricingPage data={templateData} onNavigate={goTo} />}
        {currentPage === "gallery" && <GalleryPage data={templateData} onNavigate={goTo} />}
        {currentPage === "contact" && <ContactPage data={templateData} />}
        <Footer data={templateData} onNavigate={goTo} />
      </main>
    </>
  );
}

type SharedProps = { data: ServoraData };
type NavigateProps = { onNavigate: (page: ServoraPageId) => void };

function Header({ data, currentPage, onNavigate }: SharedProps & NavigateProps & { currentPage: ServoraPageId }) {
  return (
    <header className="servora-header">
      <div className="servora-shell">
        <div className="servora-header-inner">
          <button type="button" className="servora-brand" onClick={() => onNavigate("home")} aria-label="חזרה לדף הבית">
            <span className="servora-brand-mark" aria-hidden="true">⚡</span>
            <span>
              <strong className="servora-brand-name" data-editable="text">{data.brand.name}</strong>
              <span className="servora-brand-label" data-editable="text">{data.brand.label}</span>
            </span>
          </button>

          <nav className="servora-nav" aria-label="ניווט ראשי">
            {safeArray(data.nav).map((item) => (
              <button
                key={item.page}
                type="button"
                className={`servora-nav-link ${currentPage === item.page ? "is-active" : ""}`}
                onClick={() => onNavigate(item.page)}
                data-editable="link"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="servora-header-actions">
            <a className="servora-phone-pill" href={`tel:${data.brand.phone}`} data-editable="link">
              <span aria-hidden="true">☎</span>
              <strong data-editable="text">{data.brand.phone}</strong>
            </a>
            <button type="button" className="servora-btn servora-btn-orange servora-header-cta" onClick={() => onNavigate("contact")} data-editable="button">
              לקביעת ביקור
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function HomePage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <section className="servora-hero servora-electric-hero">
        <div className="servora-shell">
          <div className="servora-hero-grid">
            <div className="servora-hero-media servora-reveal">
  <div className="servora-media-card" data-editable="image" data-field="hero.image" data-image-field="hero.image">
    <MediaElement
      src={data.hero.image}
      alt="חשמלאי מקצועי"
      field="hero.image"
    />
  </div>

  <ServiceRequestCard data={data} compact />
</div>

            <div className="servora-hero-content servora-reveal servora-delay-1">
              <span className="servora-eyebrow" data-editable="text">{data.hero.eyebrow}</span>
              <h1 className="servora-hero-title">
                <span data-editable="text">{data.hero.title}</span>
                <span className="servora-highlight" data-editable="text">{data.hero.highlight}</span>
              </h1>
              <ul className="servora-hero-bullets">
                {safeArray(data.hero.bullets).map((bullet) => (
                  <li key={bullet} data-editable="text">{bullet}</li>
                ))}
              </ul>
              <div className="servora-hero-actions">
                <button type="button" className="servora-btn servora-btn-orange" onClick={() => onNavigate("contact")} data-editable="button">
                  {data.hero.primaryCta}
                </button>
                <button type="button" className="servora-btn servora-btn-light" onClick={() => onNavigate("services")} data-editable="button">
                  {data.hero.secondaryCta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip data={data} />
      <IntroSection data={data} />
      <StatsSection data={data} />
      <ServicesSection data={data} onNavigate={onNavigate} />
      <FeatureSection data={data} onNavigate={onNavigate} />
      <ProcessSection data={data} />
      <TestimonialsSection data={data} />
      <PricingSection data={data} onNavigate={onNavigate} />
      <FaqSection data={data} />
      <CtaSection data={data} onNavigate={onNavigate} />
    </>
  );
}



function ServiceRequestCard({ data, compact = false }: SharedProps & { compact?: boolean }) {
  return (
    <div className={`servora-request-card ${compact ? "servora-request-card-float servora-free-move-element" : ""}`}>
      <div className="servora-request-card-head">
        <div>
          <h3 data-editable="text">בקשת שירות מהירה</h3>
          <p data-editable="text">השאירו פרטים ונחזור אליכם עם הצעה.</p>
        </div>
        <span className="servora-request-icon" aria-hidden="true">⚡</span>
      </div>
      <form className="servora-request-form" onSubmit={(event) => event.preventDefault()}>
        <input name="name" type="text" placeholder="שם מלא" aria-label="שם מלא" data-editable="input" dir="rtl" />
        <input name="phone" type="tel" placeholder="טלפון" aria-label="טלפון" data-editable="input" dir="rtl" />
        <select name="service" aria-label="בחירת שירות" data-editable="select" dir="rtl">
          {safeArray(data.services).map((service) => <option key={service.title}>{service.title}</option>)}
        </select>
        <button type="submit" className="servora-btn servora-btn-orange servora-request-submit" data-editable="button">שליחת בקשה</button>
      </form>
    </div>
  );
}

function TrustStrip({ data }: SharedProps) {
  return (
    <section className="servora-trust-strip">
      <div className="servora-shell">
        <div className="servora-trust-pills">
          {safeArray(data.trustPills).map((item) => (
            <span key={item} className="servora-logo-pill" data-editable="text">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntroSection({ data }: SharedProps) {
  return (
    <section className="servora-section servora-proof-section">
      <div className="servora-shell">
        <div className="servora-proof-grid">
          <article className="servora-emergency-panel servora-reveal">
            <span className="servora-neon-bolt" aria-hidden="true">ϟ</span>
            <h2 data-editable="text">שירות חשמלאי מקצועי 24/7</h2>
            <p data-editable="text">זמינים לקריאות דחופות, תיקון תקלות, התקנות ושדרוג חשמל — עם אחריות מלאה.</p>
            <a href={`tel:${data.brand.phone}`} className="servora-dark-phone" data-editable="link">חייגו עכשיו</a>
          </article>
          <article className="servora-proof-card servora-reveal servora-delay-1">
            <span className="servora-large-icon" aria-hidden="true">🏅</span>
            <div>
              <span className="servora-eyebrow" data-editable="text">למה לבחור בנו</span>
              <h2 data-editable="text">שירותי חשמל שעושים את ההבדל</h2>
              <p data-editable="text">חשמלאים מוסמכים עם תהליך ברור: אבחון, הצעת מחיר מסודרת, ביצוע נקי ואחריות בסיום העבודה.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data }: SharedProps) {
  return (
    <section className="servora-section-tight servora-stats-section">
      <div className="servora-shell">
        <div className="servora-stats-wrap">
          {safeArray(data.stats).map((stat, index) => (
            <article key={`${stat.value}-${stat.label}`} className={`servora-stat servora-reveal servora-delay-${Math.min(index + 1, 4)}`}>
              <span className="servora-stat-icon" data-editable="text">{stat.icon}</span>
              <strong className="servora-stat-number"><AnimatedStatValue value={stat.value} /></strong>
              <span className="servora-stat-label" data-editable="text">{stat.label}</span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="servora-section servora-services-section">
      <div className="servora-shell">
        <SectionTitle eyebrow="השירותים שלנו" title="כל שירותי החשמל במקום אחד" text="כרטיסים נקיים וברורים כמו במוקאפ — אייקון כתום, כותרת, תיאור קצר וקריאה לפעולה." />
        <div className="servora-services-grid">
          {data.services.map((service, index) => (
            <article key={service.title} className={`servora-service-card servora-reveal servora-delay-${Math.min(index + 1, 4)}`}>
              <span className="servora-service-icon" data-editable="text">{service.icon}</span>
              <h3 data-editable="text">{service.title}</h3>
              <p data-editable="text">{service.text}</p>
              <button type="button" className="servora-service-arrow" onClick={() => onNavigate("contact")} data-editable="button">קראו עוד ←</button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="servora-section servora-feature-section">
      <div className="servora-shell">
        <div className="servora-feature-grid">
          <article className="servora-feature-content servora-reveal">
            <span className="servora-eyebrow" data-editable="text">{data.project.eyebrow}</span>
            <h2 data-editable="text">{data.project.title}</h2>
            <p data-editable="text">{data.project.text}</p>
            <div className="servora-check-list">
              {safeArray(data.project.points).map((point) => <span key={point} className="servora-check" data-editable="text">{point}</span>)}
            </div>
            <div className="servora-feature-actions">
              <button type="button" className="servora-btn servora-btn-orange" onClick={() => onNavigate("contact")} data-editable="button">לתיאום ייעוץ</button>
              <button type="button" className="servora-btn servora-btn-dark-light" onClick={() => onNavigate("pricing")} data-editable="button">צפו במחירים</button>
            </div>
          </article>
          <div className="servora-feature-image servora-reveal servora-delay-1" data-editable="image" data-field="project.image" data-image-field="project.image">
            <MediaElement
              src={data.project.image}
              alt="עבודת חשמל מקצועית"
              field="project.image"
            />
            <div className="servora-feature-image-badge"><strong data-editable="text">24/7</strong><span data-editable="text">שירות זמין עבורכם</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data }: SharedProps) {
  return (
    <section className="servora-section servora-process-section">
      <div className="servora-shell">
        <SectionTitle eyebrow="איך זה עובד" title="תהליך קצר וברור שמוביל לתיקון בטוח" />
        <div className="servora-process-line">
          {safeArray(data.process).map((step, index) => (
            <article key={step.number} className={`servora-step servora-reveal servora-delay-${Math.min(index + 1, 4)}`}>
              <span className="servora-step-icon" data-editable="text">{step.icon}</span>
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
  const [main, ...rest] = safeArray(data.testimonials);
  return (
    <section className="servora-section servora-testimonials-section">
      <div className="servora-shell">
        <SectionTitle eyebrow="לקוחות מספרים" title="מה אומרים עלינו" />
        <div className="servora-testimonials-grid">
          <article className="servora-testimonial-main servora-reveal">
            <span className="servora-stars" data-editable="text">★★★★★</span>
            <p data-editable="text">“{main.quote}”</p>
            <strong data-editable="text">{main.name}</strong>
          </article>
          {rest.map((item, index) => (
            <article key={item.name} className={`servora-mini-testimonial servora-reveal servora-delay-${index + 1}`}>
              <span className="servora-stars" data-editable="text">★★★★★</span>
              <p data-editable="text">“{item.quote}”</p>
              <strong data-editable="text">{item.name}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection({ data, onNavigate }: SharedProps & Partial<NavigateProps>) {
  return (
    <section className="servora-section servora-pricing-section">
      <div className="servora-shell">
        <SectionTitle eyebrow="מחירים הוגנים" title="חבילות מומלצות" text="מחירים התחלתיים וברורים לפני שמשאירים פרטים." />
        <div className="servora-pricing-grid">
          {safeArray(data.pricing).map((item, index) => (
            <article key={item.title} className={`servora-price-card ${index === 1 ? "is-popular" : ""} servora-reveal servora-delay-${index + 1}`}>
              {index === 1 && <span className="servora-popular-badge" data-editable="text">הכי פופולרי</span>}
              <span className="servora-price-title" data-editable="text">{item.title}</span>
              <strong data-editable="text">{item.price}</strong>
              <p data-editable="text">{item.text}</p>
              <ul>
                {safeArray(item.features).map((feature) => <li key={feature} data-editable="text">{feature}</li>)}
              </ul>
              {onNavigate && <button type="button" className="servora-btn servora-btn-orange" onClick={() => onNavigate("contact")} data-editable="button">הזמנה עכשיו</button>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data }: SharedProps) {
  return (
    <section className="servora-section servora-faq-section">
      <div className="servora-shell">
        <SectionTitle eyebrow="שאלות נפוצות" title="כל מה שלקוח רוצה לדעת לפני שהוא משאיר פרטים." />
        <div className="servora-faq">
          {safeArray(data.faq).map((item) => (
            <details key={item.question} className="servora-faq-item">
              <summary data-editable="text">{item.question}</summary>
              <p data-editable="text">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <section className="servora-section servora-cta-section">
      <div className="servora-shell">
        <div className="servora-cta">
          <div>
            <span className="servora-eyebrow" data-editable="text">צריכים חשמלאי עכשיו?</span>
            <h2 data-editable="text">{data.cta.title}</h2>
            <p data-editable="text">{data.cta.text}</p>
          </div>
          <div className="servora-cta-actions">
            <button type="button" className="servora-btn servora-btn-orange" onClick={() => onNavigate("contact")} data-editable="button">{data.cta.button}</button>
            <a className="servora-btn servora-btn-dark-light" href={`tel:${data.brand.phone}`} data-editable="link">פרטים נוספים</a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="servora-section-head servora-reveal">
      <span className="servora-eyebrow" data-editable="text">{eyebrow}</span>
      <h2 className="servora-section-title" data-editable="text">{title}</h2>
      {text && <p className="servora-section-text" data-editable="text">{text}</p>}
    </div>
  );
}

function ServicesPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return <><PageHero eyebrow="שירותי חשמל" title="כל שירותי החשמל במקום אחד" text="תיקונים, התקנות, שדרוגים ותחזוקה — עם מבנה תואם למוקאפ." /><ServicesSection data={data} onNavigate={onNavigate} /><FeatureSection data={data} onNavigate={onNavigate} /><ProcessSection data={data} /></>;
}

function PricingPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return <><PageHero eyebrow="מחירים" title="חבילות ומחירים ברורים" text="מחירון נקי ומקצועי שמוביל לפנייה." /><PricingSection data={data} onNavigate={onNavigate} /><FaqSection data={data} /></>;
}

function GalleryPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return <><PageHero eyebrow="עבודות" title="עבודות חשמל מסודרות ומקצועיות" text="אזור פרויקטים, תהליך והוכחות חברתיות." /><FeatureSection data={data} onNavigate={onNavigate} /><TestimonialsSection data={data} /></>;
}

function ContactPage({ data }: SharedProps) {
  return (
    <>
      <PageHero eyebrow={data.contact.eyebrow} title={data.contact.title} text={data.contact.text} />
      <section className="servora-section">
        <div className="servora-shell servora-contact-grid">
          <article className="servora-contact-panel">
            <h2 data-editable="text">ברקמן — פתרונות חשמל שקטים, אמינים ונקיים.</h2>
            <p data-editable="text">{data.contact.text}</p>
            <div className="servora-contact-info">
              <span data-editable="text">טלפון: {data.brand.phone}</span>
              <span data-editable="text">וואטסאפ: {data.brand.whatsapp}</span>
              <span data-editable="text">מייל: {data.brand.email}</span>
              <span data-editable="text">כתובת: {data.contact.address}</span>
            </div>
          </article>
          <div className="servora-form-card"><ServiceRequestCard data={data} /></div>
        </div>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) {
  return (
    <section className="servora-page-hero">
      <div className="servora-shell">
        <div className="servora-page-hero-inner">
          <span className="servora-eyebrow" data-editable="text">{eyebrow}</span>
          <h1 className="servora-page-title" data-editable="text">{title}</h1>
          <p className="servora-page-text" data-editable="text">{text}</p>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <footer className="servora-footer">
      <div className="servora-shell">
        <div className="servora-footer-grid">
          <div className="servora-footer-brand">
            <strong data-editable="text">{data.brand.name} — פתרונות חשמל</strong>
            <span data-editable="text">שירות נקי, מקצועי ומדויק בכל בית ועסק.</span>
            <b data-editable="text">בפריסה ארצית</b>
          </div>
          <div className="servora-footer-contact">
            <strong data-editable="text">צור קשר</strong>
            <span data-editable="text">{data.brand.phone}</span>
            <span data-editable="text">{data.brand.email}</span>
            <span data-editable="text">{data.contact.address}</span>
          </div>
          <div className="servora-footer-mini-form"><ServiceRequestCard data={data} /></div>
        </div>
        <div className="servora-footer-bottom">
          <span>© {new Date().getFullYear()} {data.brand.name}. כל הזכויות שמורות.</span>
          <nav>
            {safeArray(data.nav).map((item) => <button key={`footer-${item.page}`} type="button" onClick={() => onNavigate(item.page)}>{item.label}</button>)}
          </nav>
        </div>
      </div>
    </footer>
  );
}
