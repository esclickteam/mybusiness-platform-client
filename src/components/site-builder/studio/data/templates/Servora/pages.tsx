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

type VisualElementType =
  | "text"
  | "image"
  | "button"
  | "section"
  | "box";

type SharedProps = { data: ServoraData };
type NavigateProps = { onNavigate: (page: ServoraPageId) => void };
type ScopedProps = { scope: string };

function visualProps(
  id: string,
  type: VisualElementType,
  label?: string,
): Record<string, string> {
  return {
    "data-visual-edit-id": id,
    "data-visual-edit-type": type,
    "data-visual-type": type,
    "data-visual-editable": "true",
    ...(label ? { "data-visual-edit-label": label } : {}),
  };
}

function sectionProps(
  id: string,
  label: string,
  kind: string,
): Record<string, string> {
  return {
    ...visualProps(id, "section", label),
    "data-template-section-id": id,
    "data-section-kind": kind,
    "data-section-title": label,
  };
}

function safeArray<T = any>(value: unknown, fallback: T[] = []): T[] {
  if (Array.isArray(value)) return value as T[];
  if (Array.isArray(fallback)) return fallback;
  return [];
}

function safeObject<T extends Record<string, any>>(
  value: unknown,
  _fallback: T,
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

function resolveMediaValue(value: unknown, fallback: unknown) {
  if (value !== undefined && value !== null) {
    return getMediaUrl(value);
  }

  return getMediaUrl(fallback);
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

  const mediaType = isVideoUrl(mediaSrc) ? "video" : "image";

  const sharedProps = {
    className,
    ...visualProps(field, "image", alt),
    "data-editable": "image",
    "data-field": field,
    "data-image-field": field,
    "data-visual-image-field": field,
    "data-visual-media-type": mediaType,
    "data-resource-type": mediaType,
    "data-visual-current-src": mediaSrc,
  } as Record<string, any>;

  if (mediaType === "video") {
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
      bullets: safeArray(
        (heroData as any).bullets,
        servoraDefaultData.hero.bullets,
      ),
      image: resolveMediaValue(
        (heroData as any).image,
        servoraDefaultData.hero.image,
      ),
    },

    project: {
      ...servoraDefaultData.project,
      ...projectData,
      points: safeArray(
        (projectData as any).points,
        servoraDefaultData.project.points,
      ),
      image: resolveMediaValue(
        (projectData as any).image,
        servoraDefaultData.project.image,
      ),
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

function AnimatedStatValue({
  value,
  visualId,
}: {
  value: string;
  visualId: string;
}) {
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

        setDisplayValue(
          `${prefix}${current.toLocaleString("en-US")}${suffix}`,
        );

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        }
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
    <span
      ref={ref}
      className="servora-counter-value"
      data-editable="text"
      {...visualProps(visualId, "text", "ערך סטטיסטי")}
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

  React.useEffect(() => {
    setCurrentPage(normalizePage(initialPage));
  }, [initialPage]);

  function goTo(page: ServoraPageId) {
    setCurrentPage(page);

    if (typeof window !== "undefined") {
      window.requestAnimationFrame(() =>
        window.scrollTo({ top: 0, behavior: "smooth" }),
      );
    }
  }

  return (
    <>
      <style>{servoraEditorCss}</style>

      <main
        dir="rtl"
        data-template-id="servora"
        data-template-mode={mode}
        data-template-page-id={currentPage}
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

function Header({
  data,
  currentPage,
  onNavigate,
}: SharedProps & NavigateProps & { currentPage: ServoraPageId }) {
  return (
    <header
      className="servora-header"
      {...sectionProps("global.header", "כותרת עליונה", "header")}
    >
      <div className="servora-shell">
        <div className="servora-header-inner">
          <button
            type="button"
            className="servora-brand"
            onClick={() => onNavigate("home")}
            aria-label="חזרה לדף הבית"
            data-editable="button"
            {...visualProps("global.header.brand", "button", "לוגו ומותג")}
          >
            <span className="servora-brand-mark" aria-hidden="true">
              ⚡
            </span>

            <span>
              <strong
                className="servora-brand-name"
                data-editable="text"
                {...visualProps(
                  "global.header.brand.name",
                  "text",
                  "שם העסק",
                )}
              >
                {data.brand.name}
              </strong>

              <span
                className="servora-brand-label"
                data-editable="text"
                {...visualProps(
                  "global.header.brand.label",
                  "text",
                  "תיאור העסק",
                )}
              >
                {data.brand.label}
              </span>
            </span>
          </button>

          <nav className="servora-nav" aria-label="ניווט ראשי">
            {safeArray(data.nav).map((item, index) => (
              <button
                key={`${item.page}-${index}`}
                type="button"
                className={`servora-nav-link ${
                  currentPage === item.page ? "is-active" : ""
                }`}
                onClick={() => onNavigate(item.page)}
                data-editable="link"
                {...visualProps(
                  `global.header.nav.${index}`,
                  "button",
                  `קישור ניווט ${index + 1}`,
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="servora-header-actions">
            <a
              className="servora-phone-pill"
              href={`tel:${data.brand.phone}`}
              data-editable="link"
              {...visualProps(
                "global.header.phoneLink",
                "button",
                "קישור טלפון",
              )}
            >
              <span aria-hidden="true">☎</span>

              <strong
                data-editable="text"
                {...visualProps(
                  "global.header.phoneText",
                  "text",
                  "מספר טלפון",
                )}
              >
                {data.brand.phone}
              </strong>
            </a>

            <button
              type="button"
              className="servora-btn servora-btn-orange servora-header-cta"
              onClick={() => onNavigate("contact")}
              data-editable="button"
              {...visualProps(
                "global.header.primaryCta",
                "button",
                "כפתור ראשי בכותרת",
              )}
            >
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
      <section
        className="servora-hero servora-electric-hero"
        {...sectionProps("home.hero", "אזור פתיחה", "hero")}
      >
        <div className="servora-shell">
          <div className="servora-hero-grid">
            <div
              className="servora-hero-media servora-reveal"
              {...visualProps(
                "home.hero.mediaColumn",
                "box",
                "עמודת מדיה וטופס",
              )}
            >
              <div
                className="servora-media-card"
                {...visualProps(
                  "home.hero.mediaCard",
                  "box",
                  "כרטיס תמונה ראשי",
                )}
              >
                <MediaElement
                  src={data.hero.image}
                  alt="חשמלאי מקצועי"
                  field="hero.image"
                />
              </div>

              <ServiceRequestCard
                data={data}
                compact
                scope="home.hero.request"
              />
            </div>

            <div
              className="servora-hero-content servora-reveal servora-delay-1"
              {...visualProps(
                "home.hero.content",
                "box",
                "תוכן אזור הפתיחה",
              )}
            >
              <span
                className="servora-eyebrow"
                data-editable="text"
                {...visualProps("hero.eyebrow", "text", "כותרת עליונה")}
              >
                {data.hero.eyebrow}
              </span>

              <h1
                className="servora-hero-title"
                {...visualProps("home.hero.titleGroup", "box", "כותרת ראשית")}
              >
                <span
                  data-editable="text"
                  {...visualProps("hero.title", "text", "כותרת ראשית")}
                >
                  {data.hero.title}
                </span>

                <span
                  className="servora-highlight"
                  data-editable="text"
                  {...visualProps(
                    "hero.highlight",
                    "text",
                    "הדגשת הכותרת",
                  )}
                >
                  {data.hero.highlight}
                </span>
              </h1>

              <ul className="servora-hero-bullets">
                {safeArray(data.hero.bullets).map((bullet, index) => (
                  <li
                    key={`hero-bullet-${index}`}
                    data-editable="text"
                    {...visualProps(
                      `hero.bullets.${index}`,
                      "text",
                      `יתרון ${index + 1}`,
                    )}
                  >
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="servora-hero-actions">
                <button
                  type="button"
                  className="servora-btn servora-btn-orange"
                  onClick={() => onNavigate("contact")}
                  data-editable="button"
                  {...visualProps(
                    "hero.primaryCta",
                    "button",
                    "כפתור ראשי",
                  )}
                >
                  {data.hero.primaryCta}
                </button>

                <button
                  type="button"
                  className="servora-btn servora-btn-light"
                  onClick={() => onNavigate("services")}
                  data-editable="button"
                  {...visualProps(
                    "hero.secondaryCta",
                    "button",
                    "כפתור משני",
                  )}
                >
                  {data.hero.secondaryCta}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TrustStrip data={data} scope="home.trust" />
      <IntroSection data={data} scope="home.intro" />
      <StatsSection data={data} scope="home.stats" />
      <ServicesSection
        data={data}
        onNavigate={onNavigate}
        scope="home.services"
      />
      <FeatureSection
        data={data}
        onNavigate={onNavigate}
        scope="home.feature"
      />
      <ProcessSection data={data} scope="home.process" />
      <TestimonialsSection data={data} scope="home.testimonials" />
      <PricingSection
        data={data}
        onNavigate={onNavigate}
        scope="home.pricing"
      />
      <FaqSection data={data} scope="home.faq" />
      <CtaSection data={data} onNavigate={onNavigate} scope="home.cta" />
    </>
  );
}

function ServiceRequestCard({
  data,
  compact = false,
  scope,
}: SharedProps & { compact?: boolean; scope: string }) {
  return (
    <div
      className={`servora-request-card ${
        compact
          ? "servora-request-card-float servora-free-move-element"
          : ""
      }`}
      {...visualProps(scope, "section", "טופס בקשת שירות")}
    >
      <div className="servora-request-card-head">
        <div>
          <h3
            data-editable="text"
            {...visualProps(`${scope}.title`, "text", "כותרת הטופס")}
          >
            בקשת שירות מהירה
          </h3>

          <p
            data-editable="text"
            {...visualProps(`${scope}.text`, "text", "תיאור הטופס")}
          >
            השאירו פרטים ונחזור אליכם עם הצעה.
          </p>
        </div>

        <span className="servora-request-icon" aria-hidden="true">
          ⚡
        </span>
      </div>

      <form
        className="servora-request-form"
        onSubmit={(event) => event.preventDefault()}
      >
        <input
          name="name"
          type="text"
          placeholder="שם מלא"
          aria-label="שם מלא"
          data-editable="input"
          dir="rtl"
          {...visualProps(`${scope}.nameInput`, "box", "שדה שם")}
        />

        <input
          name="phone"
          type="tel"
          placeholder="טלפון"
          aria-label="טלפון"
          data-editable="input"
          dir="rtl"
          {...visualProps(`${scope}.phoneInput`, "box", "שדה טלפון")}
        />

        <select
          name="service"
          aria-label="בחירת שירות"
          data-editable="select"
          dir="rtl"
          {...visualProps(`${scope}.serviceSelect`, "box", "בחירת שירות")}
        >
          {safeArray(data.services).map((service, index) => (
            <option key={`service-option-${index}`}>{service.title}</option>
          ))}
        </select>

        <button
          type="submit"
          className="servora-btn servora-btn-orange servora-request-submit"
          data-editable="button"
          {...visualProps(`${scope}.submit`, "button", "שליחת בקשה")}
        >
          שליחת בקשה
        </button>
      </form>
    </div>
  );
}

function TrustStrip({ data, scope }: SharedProps & ScopedProps) {
  return (
    <section
      className="servora-trust-strip"
      {...sectionProps(scope, "פס יתרונות", "trust")}
    >
      <div className="servora-shell">
        <div className="servora-trust-pills">
          {safeArray(data.trustPills).map((item, index) => (
            <span
              key={`trust-${index}`}
              className="servora-logo-pill"
              data-editable="text"
              {...visualProps(
                `trustPills.${index}`,
                "text",
                `יתרון מהיר ${index + 1}`,
              )}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function IntroSection({ data, scope }: SharedProps & ScopedProps) {
  return (
    <section
      className="servora-section servora-proof-section"
      {...sectionProps(scope, "למה לבחור בנו", "about")}
    >
      <div className="servora-shell">
        <div className="servora-proof-grid">
          <article
            className="servora-emergency-panel servora-reveal"
            {...visualProps(
              `${scope}.emergencyCard`,
              "section",
              "כרטיס שירות חירום",
            )}
          >
            <span className="servora-neon-bolt" aria-hidden="true">
              ϟ
            </span>

            <h2
              data-editable="text"
              {...visualProps(
                `${scope}.emergencyTitle`,
                "text",
                "כותרת שירות חירום",
              )}
            >
              שירות חשמלאי מקצועי 24/7
            </h2>

            <p
              data-editable="text"
              {...visualProps(
                `${scope}.emergencyText`,
                "text",
                "תיאור שירות חירום",
              )}
            >
              זמינים לקריאות דחופות, תיקון תקלות, התקנות ושדרוג חשמל — עם
              אחריות מלאה.
            </p>

            <a
              href={`tel:${data.brand.phone}`}
              className="servora-dark-phone"
              data-editable="link"
              {...visualProps(
                `${scope}.emergencyCta`,
                "button",
                "כפתור חייגו עכשיו",
              )}
            >
              חייגו עכשיו
            </a>
          </article>

          <article
            className="servora-proof-card servora-reveal servora-delay-1"
            {...visualProps(
              `${scope}.proofCard`,
              "section",
              "כרטיס הוכחת מקצועיות",
            )}
          >
            <span className="servora-large-icon" aria-hidden="true">
              🏅
            </span>

            <div>
              <span
                className="servora-eyebrow"
                data-editable="text"
                {...visualProps(
                  `${scope}.proofEyebrow`,
                  "text",
                  "כותרת משנה",
                )}
              >
                למה לבחור בנו
              </span>

              <h2
                data-editable="text"
                {...visualProps(
                  `${scope}.proofTitle`,
                  "text",
                  "כותרת הכרטיס",
                )}
              >
                שירותי חשמל שעושים את ההבדל
              </h2>

              <p
                data-editable="text"
                {...visualProps(
                  `${scope}.proofText`,
                  "text",
                  "תיאור הכרטיס",
                )}
              >
                חשמלאים מוסמכים עם תהליך ברור: אבחון, הצעת מחיר מסודרת, ביצוע
                נקי ואחריות בסיום העבודה.
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function StatsSection({ data, scope }: SharedProps & ScopedProps) {
  return (
    <section
      className="servora-section-tight servora-stats-section"
      {...sectionProps(scope, "נתונים וסטטיסטיקות", "stats")}
    >
      <div className="servora-shell">
        <div className="servora-stats-wrap">
          {safeArray(data.stats).map((stat, index) => (
            <article
              key={`stat-${index}`}
              className={`servora-stat servora-reveal servora-delay-${Math.min(
                index + 1,
                4,
              )}`}
              {...visualProps(
                `${scope}.items.${index}`,
                "section",
                `כרטיס נתון ${index + 1}`,
              )}
            >
              <span
                className="servora-stat-icon"
                data-editable="text"
                {...visualProps(
                  `stats.${index}.icon`,
                  "text",
                  `אייקון נתון ${index + 1}`,
                )}
              >
                {stat.icon}
              </span>

              <strong className="servora-stat-number">
                <AnimatedStatValue
                  value={stat.value}
                  visualId={`stats.${index}.value`}
                />
              </strong>

              <span
                className="servora-stat-label"
                data-editable="text"
                {...visualProps(
                  `stats.${index}.label`,
                  "text",
                  `תיאור נתון ${index + 1}`,
                )}
              >
                {stat.label}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function ServicesSection({
  data,
  onNavigate,
  scope,
}: SharedProps & NavigateProps & ScopedProps) {
  return (
    <section
      className="servora-section servora-services-section"
      {...sectionProps(scope, "שירותים", "services")}
    >
      <div className="servora-shell">
        <SectionTitle
          scope={`${scope}.heading`}
          eyebrow="השירותים שלנו"
          title="כל שירותי החשמל במקום אחד"
          text="כרטיסים נקיים וברורים כמו במוקאפ — אייקון כתום, כותרת, תיאור קצר וקריאה לפעולה."
        />

        <div className="servora-services-grid">
          {safeArray(data.services).map((service, index) => (
            <article
              key={`service-card-${index}`}
              className={`servora-service-card servora-reveal servora-delay-${Math.min(
                index + 1,
                4,
              )}`}
              {...visualProps(
                `${scope}.items.${index}`,
                "section",
                `כרטיס שירות ${index + 1}`,
              )}
            >
              <span
                className="servora-service-icon"
                data-editable="text"
                {...visualProps(
                  `services.${index}.icon`,
                  "text",
                  `אייקון שירות ${index + 1}`,
                )}
              >
                {service.icon}
              </span>

              <h3
                data-editable="text"
                {...visualProps(
                  `services.${index}.title`,
                  "text",
                  `כותרת שירות ${index + 1}`,
                )}
              >
                {service.title}
              </h3>

              <p
                data-editable="text"
                {...visualProps(
                  `services.${index}.text`,
                  "text",
                  `תיאור שירות ${index + 1}`,
                )}
              >
                {service.text}
              </p>

              <button
                type="button"
                className="servora-service-arrow"
                onClick={() => onNavigate("contact")}
                data-editable="button"
                {...visualProps(
                  `${scope}.items.${index}.cta`,
                  "button",
                  `כפתור שירות ${index + 1}`,
                )}
              >
                קראו עוד ←
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureSection({
  data,
  onNavigate,
  scope,
}: SharedProps & NavigateProps & ScopedProps) {
  return (
    <section
      className="servora-section servora-feature-section"
      {...sectionProps(scope, "פרויקט מוביל", "gallery")}
    >
      <div className="servora-shell">
        <div className="servora-feature-grid">
          <article
            className="servora-feature-content servora-reveal"
            {...visualProps(
              `${scope}.content`,
              "section",
              "תוכן הפרויקט",
            )}
          >
            <span
              className="servora-eyebrow"
              data-editable="text"
              {...visualProps(
                "project.eyebrow",
                "text",
                "כותרת עליונה לפרויקט",
              )}
            >
              {data.project.eyebrow}
            </span>

            <h2
              data-editable="text"
              {...visualProps("project.title", "text", "כותרת הפרויקט")}
            >
              {data.project.title}
            </h2>

            <p
              data-editable="text"
              {...visualProps("project.text", "text", "תיאור הפרויקט")}
            >
              {data.project.text}
            </p>

            <div className="servora-check-list">
              {safeArray(data.project.points).map((point, index) => (
                <span
                  key={`project-point-${index}`}
                  className="servora-check"
                  data-editable="text"
                  {...visualProps(
                    `project.points.${index}`,
                    "text",
                    `יתרון בפרויקט ${index + 1}`,
                  )}
                >
                  {point}
                </span>
              ))}
            </div>

            <div className="servora-feature-actions">
              <button
                type="button"
                className="servora-btn servora-btn-orange"
                onClick={() => onNavigate("contact")}
                data-editable="button"
                {...visualProps(
                  `${scope}.primaryCta`,
                  "button",
                  "כפתור תיאום ייעוץ",
                )}
              >
                לתיאום ייעוץ
              </button>

              <button
                type="button"
                className="servora-btn servora-btn-dark-light"
                onClick={() => onNavigate("pricing")}
                data-editable="button"
                {...visualProps(
                  `${scope}.secondaryCta`,
                  "button",
                  "כפתור צפייה במחירים",
                )}
              >
                צפו במחירים
              </button>
            </div>
          </article>

          <div
            className="servora-feature-image servora-reveal servora-delay-1"
            {...visualProps(
              `${scope}.mediaBox`,
              "box",
              "תמונת הפרויקט",
            )}
          >
            <MediaElement
              src={data.project.image}
              alt="עבודת חשמל מקצועית"
              field="project.image"
            />

            <div
              className="servora-feature-image-badge"
              {...visualProps(
                `${scope}.badge`,
                "box",
                "תג על התמונה",
              )}
            >
              <strong
                data-editable="text"
                {...visualProps(
                  `${scope}.badgeValue`,
                  "text",
                  "ערך התג",
                )}
              >
                24/7
              </strong>

              <span
                data-editable="text"
                {...visualProps(
                  `${scope}.badgeText`,
                  "text",
                  "טקסט התג",
                )}
              >
                שירות זמין עבורכם
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProcessSection({ data, scope }: SharedProps & ScopedProps) {
  return (
    <section
      className="servora-section servora-process-section"
      {...sectionProps(scope, "תהליך עבודה", "process")}
    >
      <div className="servora-shell">
        <SectionTitle
          scope={`${scope}.heading`}
          eyebrow="איך זה עובד"
          title="תהליך קצר וברור שמוביל לתיקון בטוח"
        />

        <div className="servora-process-line">
          {safeArray(data.process).map((step, index) => (
            <article
              key={`process-step-${index}`}
              className={`servora-step servora-reveal servora-delay-${Math.min(
                index + 1,
                4,
              )}`}
              {...visualProps(
                `${scope}.items.${index}`,
                "section",
                `שלב ${index + 1}`,
              )}
            >
              <span
                className="servora-step-icon"
                data-editable="text"
                {...visualProps(
                  `process.${index}.icon`,
                  "text",
                  `אייקון שלב ${index + 1}`,
                )}
              >
                {step.icon}
              </span>

              <h3
                data-editable="text"
                {...visualProps(
                  `process.${index}.title`,
                  "text",
                  `כותרת שלב ${index + 1}`,
                )}
              >
                {step.title}
              </h3>

              <p
                data-editable="text"
                {...visualProps(
                  `process.${index}.text`,
                  "text",
                  `תיאור שלב ${index + 1}`,
                )}
              >
                {step.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection({ data, scope }: SharedProps & ScopedProps) {
  const testimonials = safeArray(data.testimonials);
  const main = testimonials[0];
  const rest = testimonials.slice(1);

  if (!main) return null;

  return (
    <section
      className="servora-section servora-testimonials-section"
      {...sectionProps(scope, "המלצות לקוחות", "testimonials")}
    >
      <div className="servora-shell">
        <SectionTitle
          scope={`${scope}.heading`}
          eyebrow="לקוחות מספרים"
          title="מה אומרים עלינו"
        />

        <div className="servora-testimonials-grid">
          <article
            className="servora-testimonial-main servora-reveal"
            {...visualProps(
              `${scope}.items.0`,
              "section",
              "המלצה ראשית",
            )}
          >
            <span
              className="servora-stars"
              data-editable="text"
              {...visualProps(
                `${scope}.items.0.stars`,
                "text",
                "דירוג ההמלצה",
              )}
            >
              ★★★★★
            </span>

            <p
              data-editable="text"
              {...visualProps(
                "testimonials.0.quote",
                "text",
                "תוכן המלצה ראשית",
              )}
            >
              “{main.quote}”
            </p>

            <strong
              data-editable="text"
              {...visualProps(
                "testimonials.0.name",
                "text",
                "שם ממליץ ראשי",
              )}
            >
              {main.name}
            </strong>
          </article>

          {rest.map((item, restIndex) => {
            const index = restIndex + 1;

            return (
              <article
                key={`testimonial-${index}`}
                className={`servora-mini-testimonial servora-reveal servora-delay-${index}`}
                {...visualProps(
                  `${scope}.items.${index}`,
                  "section",
                  `המלצה ${index + 1}`,
                )}
              >
                <span
                  className="servora-stars"
                  data-editable="text"
                  {...visualProps(
                    `${scope}.items.${index}.stars`,
                    "text",
                    `דירוג המלצה ${index + 1}`,
                  )}
                >
                  ★★★★★
                </span>

                <p
                  data-editable="text"
                  {...visualProps(
                    `testimonials.${index}.quote`,
                    "text",
                    `תוכן המלצה ${index + 1}`,
                  )}
                >
                  “{item.quote}”
                </p>

                <strong
                  data-editable="text"
                  {...visualProps(
                    `testimonials.${index}.name`,
                    "text",
                    `שם ממליץ ${index + 1}`,
                  )}
                >
                  {item.name}
                </strong>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PricingSection({
  data,
  onNavigate,
  scope,
}: SharedProps & Partial<NavigateProps> & ScopedProps) {
  return (
    <section
      className="servora-section servora-pricing-section"
      {...sectionProps(scope, "מחירון", "pricing")}
    >
      <div className="servora-shell">
        <SectionTitle
          scope={`${scope}.heading`}
          eyebrow="מחירים הוגנים"
          title="חבילות מומלצות"
          text="מחירים התחלתיים וברורים לפני שמשאירים פרטים."
        />

        <div className="servora-pricing-grid">
          {safeArray(data.pricing).map((item, index) => (
            <article
              key={`price-card-${index}`}
              className={`servora-price-card ${
                index === 1 ? "is-popular" : ""
              } servora-reveal servora-delay-${index + 1}`}
              {...visualProps(
                `${scope}.items.${index}`,
                "section",
                `חבילת מחיר ${index + 1}`,
              )}
            >
              {index === 1 && (
                <span
                  className="servora-popular-badge"
                  data-editable="text"
                  {...visualProps(
                    `${scope}.items.${index}.badge`,
                    "text",
                    "תג פופולרי",
                  )}
                >
                  הכי פופולרי
                </span>
              )}

              <span
                className="servora-price-title"
                data-editable="text"
                {...visualProps(
                  `pricing.${index}.title`,
                  "text",
                  `שם חבילה ${index + 1}`,
                )}
              >
                {item.title}
              </span>

              <strong
                data-editable="text"
                {...visualProps(
                  `pricing.${index}.price`,
                  "text",
                  `מחיר חבילה ${index + 1}`,
                )}
              >
                {item.price}
              </strong>

              <p
                data-editable="text"
                {...visualProps(
                  `pricing.${index}.text`,
                  "text",
                  `תיאור חבילה ${index + 1}`,
                )}
              >
                {item.text}
              </p>

              <ul>
                {safeArray(item.features).map((feature, featureIndex) => (
                  <li
                    key={`price-${index}-feature-${featureIndex}`}
                    data-editable="text"
                    {...visualProps(
                      `pricing.${index}.features.${featureIndex}`,
                      "text",
                      `יתרון ${featureIndex + 1} בחבילה ${index + 1}`,
                    )}
                  >
                    {feature}
                  </li>
                ))}
              </ul>

              {onNavigate && (
                <button
                  type="button"
                  className="servora-btn servora-btn-orange"
                  onClick={() => onNavigate("contact")}
                  data-editable="button"
                  {...visualProps(
                    `${scope}.items.${index}.cta`,
                    "button",
                    `כפתור הזמנה לחבילה ${index + 1}`,
                  )}
                >
                  הזמנה עכשיו
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FaqSection({ data, scope }: SharedProps & ScopedProps) {
  return (
    <section
      className="servora-section servora-faq-section"
      {...sectionProps(scope, "שאלות נפוצות", "faq")}
    >
      <div className="servora-shell">
        <SectionTitle
          scope={`${scope}.heading`}
          eyebrow="שאלות נפוצות"
          title="כל מה שלקוח רוצה לדעת לפני שהוא משאיר פרטים."
        />

        <div className="servora-faq">
          {safeArray(data.faq).map((item, index) => (
            <details
              key={`faq-${index}`}
              className="servora-faq-item"
              {...visualProps(
                `${scope}.items.${index}`,
                "section",
                `שאלה נפוצה ${index + 1}`,
              )}
            >
              <summary
                data-editable="text"
                {...visualProps(
                  `faq.${index}.question`,
                  "text",
                  `שאלה ${index + 1}`,
                )}
              >
                {item.question}
              </summary>

              <p
                data-editable="text"
                {...visualProps(
                  `faq.${index}.answer`,
                  "text",
                  `תשובה ${index + 1}`,
                )}
              >
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({
  data,
  onNavigate,
  scope,
}: SharedProps & NavigateProps & ScopedProps) {
  return (
    <section
      className="servora-section servora-cta-section"
      {...sectionProps(scope, "קריאה לפעולה", "cta")}
    >
      <div className="servora-shell">
        <div
          className="servora-cta"
          {...visualProps(`${scope}.content`, "box", "תוכן קריאה לפעולה")}
        >
          <div>
            <span
              className="servora-eyebrow"
              data-editable="text"
              {...visualProps(
                `${scope}.eyebrow`,
                "text",
                "כותרת משנה לקריאה לפעולה",
              )}
            >
              צריכים חשמלאי עכשיו?
            </span>

            <h2
              data-editable="text"
              {...visualProps("cta.title", "text", "כותרת קריאה לפעולה")}
            >
              {data.cta.title}
            </h2>

            <p
              data-editable="text"
              {...visualProps("cta.text", "text", "תיאור קריאה לפעולה")}
            >
              {data.cta.text}
            </p>
          </div>

          <div className="servora-cta-actions">
            <button
              type="button"
              className="servora-btn servora-btn-orange"
              onClick={() => onNavigate("contact")}
              data-editable="button"
              {...visualProps(
                "cta.button",
                "button",
                "כפתור קריאה לפעולה",
              )}
            >
              {data.cta.button}
            </button>

            <a
              className="servora-btn servora-btn-dark-light"
              href={`tel:${data.brand.phone}`}
              data-editable="link"
              {...visualProps(
                `${scope}.secondaryCta`,
                "button",
                "כפתור פרטים נוספים",
              )}
            >
              פרטים נוספים
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionTitle({
  scope,
  eyebrow,
  title,
  text,
}: {
  scope: string;
  eyebrow: string;
  title: string;
  text?: string;
}) {
  return (
    <div
      className="servora-section-head servora-reveal"
      {...visualProps(scope, "box", "כותרת אזור")}
    >
      <span
        className="servora-eyebrow"
        data-editable="text"
        {...visualProps(`${scope}.eyebrow`, "text", "כותרת קטנה")}
      >
        {eyebrow}
      </span>

      <h2
        className="servora-section-title"
        data-editable="text"
        {...visualProps(`${scope}.title`, "text", "כותרת האזור")}
      >
        {title}
      </h2>

      {text !== undefined && (
        <p
          className="servora-section-text"
          data-editable="text"
          {...visualProps(`${scope}.text`, "text", "תיאור האזור")}
        >
          {text}
        </p>
      )}
    </div>
  );
}

function ServicesPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        scope="services.pageHero"
        eyebrow="שירותי חשמל"
        title="כל שירותי החשמל במקום אחד"
        text="תיקונים, התקנות, שדרוגים ותחזוקה — עם מבנה תואם למוקאפ."
      />

      <ServicesSection
        data={data}
        onNavigate={onNavigate}
        scope="services.services"
      />

      <FeatureSection
        data={data}
        onNavigate={onNavigate}
        scope="services.feature"
      />

      <ProcessSection data={data} scope="services.process" />
    </>
  );
}

function PricingPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        scope="pricing.pageHero"
        eyebrow="מחירים"
        title="חבילות ומחירים ברורים"
        text="מחירון נקי ומקצועי שמוביל לפנייה."
      />

      <PricingSection
        data={data}
        onNavigate={onNavigate}
        scope="pricing.pricing"
      />

      <FaqSection data={data} scope="pricing.faq" />
    </>
  );
}

function GalleryPage({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <>
      <PageHero
        scope="gallery.pageHero"
        eyebrow="עבודות"
        title="עבודות חשמל מסודרות ומקצועיות"
        text="אזור פרויקטים, תהליך והוכחות חברתיות."
      />

      <FeatureSection
        data={data}
        onNavigate={onNavigate}
        scope="gallery.feature"
      />

      <TestimonialsSection data={data} scope="gallery.testimonials" />
    </>
  );
}

function ContactPage({ data }: SharedProps) {
  return (
    <>
      <PageHero
        scope="contact.pageHero"
        eyebrow={data.contact.eyebrow}
        title={data.contact.title}
        text={data.contact.text}
        fieldPrefix="contact"
      />

      <section
        className="servora-section"
        {...sectionProps("contact.content", "פרטי יצירת קשר", "contact")}
      >
        <div className="servora-shell servora-contact-grid">
          <article
            className="servora-contact-panel"
            {...visualProps(
              "contact.infoPanel",
              "section",
              "פרטי יצירת קשר",
            )}
          >
            <h2
              data-editable="text"
              {...visualProps(
                "contact.infoPanel.title",
                "text",
                "כותרת פרטי קשר",
              )}
            >
              ברקמן — פתרונות חשמל שקטים, אמינים ונקיים.
            </h2>

            <p
              data-editable="text"
              {...visualProps(
                "contact.infoPanel.text",
                "text",
                "תיאור פרטי קשר",
              )}
            >
              {data.contact.text}
            </p>

            <div className="servora-contact-info">
              <span
                data-editable="text"
                {...visualProps(
                  "contact.infoPanel.phone",
                  "text",
                  "טלפון",
                )}
              >
                טלפון: {data.brand.phone}
              </span>

              <span
                data-editable="text"
                {...visualProps(
                  "contact.infoPanel.whatsapp",
                  "text",
                  "וואטסאפ",
                )}
              >
                וואטסאפ: {data.brand.whatsapp}
              </span>

              <span
                data-editable="text"
                {...visualProps(
                  "contact.infoPanel.email",
                  "text",
                  "אימייל",
                )}
              >
                מייל: {data.brand.email}
              </span>

              <span
                data-editable="text"
                {...visualProps(
                  "contact.infoPanel.address",
                  "text",
                  "כתובת",
                )}
              >
                כתובת: {data.contact.address}
              </span>
            </div>
          </article>

          <div
            className="servora-form-card"
            {...visualProps(
              "contact.formCard",
              "box",
              "כרטיס טופס יצירת קשר",
            )}
          >
            <ServiceRequestCard data={data} scope="contact.request" />
          </div>
        </div>
      </section>
    </>
  );
}

function PageHero({
  scope,
  eyebrow,
  title,
  text,
  fieldPrefix,
}: {
  scope: string;
  eyebrow: string;
  title: string;
  text: string;
  fieldPrefix?: string;
}) {
  const eyebrowId = fieldPrefix ? `${fieldPrefix}.eyebrow` : `${scope}.eyebrow`;
  const titleId = fieldPrefix ? `${fieldPrefix}.title` : `${scope}.title`;
  const textId = fieldPrefix ? `${fieldPrefix}.text` : `${scope}.text`;

  return (
    <section
      className="servora-page-hero"
      {...sectionProps(scope, "כותרת עמוד", "page-hero")}
    >
      <div className="servora-shell">
        <div className="servora-page-hero-inner">
          <span
            className="servora-eyebrow"
            data-editable="text"
            {...visualProps(eyebrowId, "text", "כותרת משנה לעמוד")}
          >
            {eyebrow}
          </span>

          <h1
            className="servora-page-title"
            data-editable="text"
            {...visualProps(titleId, "text", "כותרת העמוד")}
          >
            {title}
          </h1>

          <p
            className="servora-page-text"
            data-editable="text"
            {...visualProps(textId, "text", "תיאור העמוד")}
          >
            {text}
          </p>
        </div>
      </div>
    </section>
  );
}

function Footer({ data, onNavigate }: SharedProps & NavigateProps) {
  return (
    <footer
      className="servora-footer"
      {...sectionProps("global.footer", "כותרת תחתונה", "footer")}
    >
      <div className="servora-shell">
        <div className="servora-footer-grid">
          <div
            className="servora-footer-brand"
            {...visualProps(
              "global.footer.brandBlock",
              "box",
              "אודות העסק בפוטר",
            )}
          >
            <strong
              data-editable="text"
              {...visualProps(
                "global.footer.brandTitle",
                "text",
                "שם העסק בפוטר",
              )}
            >
              {data.brand.name} — פתרונות חשמל
            </strong>

            <span
              data-editable="text"
              {...visualProps(
                "global.footer.brandText",
                "text",
                "תיאור העסק בפוטר",
              )}
            >
              שירות נקי, מקצועי ומדויק בכל בית ועסק.
            </span>

            <b
              data-editable="text"
              {...visualProps(
                "global.footer.areaText",
                "text",
                "אזור שירות",
              )}
            >
              בפריסה ארצית
            </b>
          </div>

          <div
            className="servora-footer-contact"
            {...visualProps(
              "global.footer.contactBlock",
              "box",
              "פרטי קשר בפוטר",
            )}
          >
            <strong
              data-editable="text"
              {...visualProps(
                "global.footer.contactTitle",
                "text",
                "כותרת צור קשר",
              )}
            >
              צור קשר
            </strong>

            <span
              data-editable="text"
              {...visualProps(
                "global.footer.phone",
                "text",
                "טלפון בפוטר",
              )}
            >
              {data.brand.phone}
            </span>

            <span
              data-editable="text"
              {...visualProps(
                "global.footer.email",
                "text",
                "אימייל בפוטר",
              )}
            >
              {data.brand.email}
            </span>

            <span
              data-editable="text"
              {...visualProps(
                "global.footer.address",
                "text",
                "כתובת בפוטר",
              )}
            >
              {data.contact.address}
            </span>
          </div>

          <div
            className="servora-footer-mini-form"
            {...visualProps(
              "global.footer.formBox",
              "box",
              "טופס בפוטר",
            )}
          >
            <ServiceRequestCard data={data} scope="global.footer.request" />
          </div>
        </div>

        <div className="servora-footer-bottom">
          <span
            data-editable="text"
            {...visualProps(
              "global.footer.copyright",
              "text",
              "זכויות יוצרים",
            )}
          >
            © {new Date().getFullYear()} {data.brand.name}. כל הזכויות שמורות.
          </span>

          <nav>
            {safeArray(data.nav).map((item, index) => (
              <button
                key={`footer-${item.page}-${index}`}
                type="button"
                onClick={() => onNavigate(item.page)}
                data-editable="button"
                {...visualProps(
                  `global.footer.nav.${index}`,
                  "button",
                  `קישור פוטר ${index + 1}`,
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
