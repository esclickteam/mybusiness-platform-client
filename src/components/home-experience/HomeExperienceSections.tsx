import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { PRICING_PACKAGES } from "../../data/pricingPackagesData";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { homeText } from "./homeCopy";
import ProductTheater, { type TheaterFilm, type TheaterStep } from "./ProductTheater";
import CustomerJourney from "./CustomerJourney";
import films from "./theaterFilms.json";

const MEDIA = "/demo-media/home";
const FILM_VERSION = "t7";

type FilmKey = keyof typeof films;

function filmFor(key: FilmKey): TheaterFilm {
  const spec = films[key];
  return {
    src: `${MEDIA}/theater/${key}.mp4?v=${FILM_VERSION}`,
    poster: `${MEDIA}/theater/${key}.webp?v=${FILM_VERSION}`,
    width: spec.width,
    height: spec.height,
    duration: spec.duration,
    chapters: spec.chapters,
  };
}

function faqLocale(language: string) {
  const value = language.toLowerCase();
  if (value.startsWith("he")) return "he";
  if (value.startsWith("es")) return "es";
  if (value.startsWith("pt")) return "pt-BR";
  if (value.startsWith("ar")) return "ar";
  return "en";
}

function useCopy() {
  const { i18n, t } = useTranslation();
  const language = i18n.language || "en";
  const he = language.startsWith("he");
  const text = (hebrew: string, english: string) => homeText(language, hebrew, english);
  const cine = cinematicFor(language);
  return { text, he, t, cine, language, dir: getTextDirection(language) };
}

function useReduced() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia("(prefers-reduced-motion: reduce)").matches : false,
  );
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(query.matches);
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);
  return reduced;
}

/** Adds `is-in` to [data-reveal] nodes as they enter the viewport. Content stays visible without JS. */
function useReveal(root: { current: HTMLElement | null }) {
  const reduced = useReduced();
  useEffect(() => {
    const node = root.current;
    if (!node) return undefined;
    const targets = [...node.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach((target) => target.classList.add("is-in"));
      return undefined;
    }
    document.documentElement.classList.add("ht-motion");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((target) => {
      const rect = target.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) target.classList.add("is-in");
      else observer.observe(target);
    });
    return () => observer.disconnect();
  }, [reduced, root]);
}

function Words({ text, hot = -1, delay = 0 }: { text: string; hot?: number; delay?: number }) {
  const words = text.split(" ");
  const reduced = useReduced();
  // First paint must show the full headline. Enable motion only after that frame.
  const [motionReady, setMotionReady] = useState(false);
  useEffect(() => {
    if (reduced) {
      setMotionReady(false);
      return undefined;
    }
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setMotionReady(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [reduced, text]);

  return (
    <span className="hx-line">
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className={index === hot ? "hx-word is-hot" : "hx-word"}>
            <span
              className={motionReady ? "hx-word__in" : undefined}
              style={motionReady ? { animationDelay: `${delay + index * 75}ms` } : undefined}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </span>
  );
}

function Cta({ to, children, tone = "solid" }: { to: string; children: string; tone?: "solid" | "line" | "light" }) {
  const className = `hx-btn text-inherit${tone === "line" ? " hx-btn-line" : ""}${tone === "light" ? " hx-btn-light" : ""}`;
  const inner = (
    <>
      <span>{children}</span>
      <i aria-hidden="true" />
    </>
  );
  if (to.startsWith("#")) {
    return <a className={className} href={to}>{inner}</a>;
  }
  return <Link className={className} to={to}>{inner}</Link>;
}

function Waves({ className = "" }: { className?: string }) {
  return (
    <svg className={`ht-waves ${className}`} viewBox="0 0 1440 320" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="ht-wave-a" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#6d28d9" stopOpacity="0.55" />
          <stop offset="0.55" stopColor="#4f46e5" stopOpacity="0.4" />
          <stop offset="1" stopColor="#3b82f6" stopOpacity="0.35" />
        </linearGradient>
        <linearGradient id="ht-wave-b" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#a78bfa" stopOpacity="0.4" />
          <stop offset="1" stopColor="#93c5fd" stopOpacity="0.32" />
        </linearGradient>
      </defs>
      <g className="ht-wave ht-wave-1">
        <path d="M0 210 C 240 140 420 280 720 214 S 1180 120 1440 190 V320 H0Z" fill="url(#ht-wave-b)" />
        <path d="M1440 210 C 1680 140 1860 280 2160 214 S 2620 120 2880 190 V320 H1440Z" fill="url(#ht-wave-b)" />
      </g>
      <g className="ht-wave ht-wave-2">
        <path d="M0 250 C 260 196 470 300 760 252 S 1210 176 1440 236 V320 H0Z" fill="url(#ht-wave-a)" />
        <path d="M1440 250 C 1700 196 1910 300 2200 252 S 2650 176 2880 236 V320 H1440Z" fill="url(#ht-wave-a)" />
      </g>
      <path className="ht-wave-line" d="M0 176 C 300 120 520 236 820 186 S 1250 110 1440 160" fill="none" />
    </svg>
  );
}

export default function HomeExperienceSections() {
  const { text } = useCopy();
  const ref = useRef<HTMLDivElement | null>(null);
  useReveal(ref);
  return (
    <>
      <a className="hx-skip" href="#how">{text("דילוג לתוכן", "Skip to content")}</a>
      <div className="ht-root" ref={ref}>
        <Hero seek={null} />
        <CustomerJourney />
        <Websites />
        <Benefits />
        <Pricing />
        <Faq />
        <Close />
      </div>
    </>
  );
}

const STEP_IDS = ["lead", "crm", "whatsapp", "task", "automation", "done"] as const;

function useSteps(): TheaterStep[] {
  const { cine } = useCopy();
  const labels = (cine.hero.processSteps || []) as [string, string][];
  const copy = (cine.hero.processCopy || []) as [string, string][];
  return STEP_IDS.map((id, index) => ({
    id,
    label: labels[index]?.[1] || id,
    title: copy[index]?.[0] || "",
    body: copy[index]?.[1] || "",
  }));
}

function Hero({ seek }: { seek: { index: number; nonce: number } | null }) {
  const { cine, language } = useCopy();
  const hero = cine.hero;
  const lang = language.startsWith("he") ? "he" : "en";
  const hot = Math.max(0, String(hero.lineTwo).trim().split(/\s+/).length - 1);
  const steps = useSteps();
  return (
    <section className="hx-hero" aria-labelledby="hx-hero-title">
      <div className="hx-geo hx-geo-a" aria-hidden="true" />
      <div className="hx-geo hx-geo-b" aria-hidden="true" />
      <div className="hx-geo hx-geo-c" aria-hidden="true" />
      <Waves className="ht-hero-waves" />
      <div className="hx-hero-pin">
        <div className="hx-hero-copy">
          <p className="hx-hero-kicker">{hero.kicker || "BizUply"}</p>
          <h1 className="hx-display" id="hx-hero-title">
            <Words text={hero.lineOne} />
            <Words text={hero.lineTwo} hot={hot} delay={220} />
          </h1>
          <p className="hx-lead">{hero.lead1}</p>
          <div className="hx-actions">
            <Cta to="/register">{hero.start}</Cta>
            <Cta to="/contact" tone="line">{hero.see}</Cta>
          </div>
          {Array.isArray(hero.trust) && hero.trust.length ? (
            <ul className="hx-hero-trust">
              {hero.trust.map((item: string) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <aside className="ht-hero-side" aria-label={hero.demoEyebrow}>
          <p className="ht-eyebrow">{hero.demoEyebrow}</p>
          <p className="ht-hero-side-lead">{hero.demoLead}</p>
          <ol className="ht-hero-steps">
            {steps.map((step, index) => (
              <li key={step.id}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {step.label}
              </li>
            ))}
          </ol>
        </aside>
      </div>
      <div className="hx-hero-stage" id="product-theater">
        <div className="hx-hero-stage-inner">
          <ProductTheater
            desktop={filmFor(`${lang}-desktop` as FilmKey)}
            mobile={filmFor(`${lang}-mobile` as FilmKey)}
            steps={steps}
            seekRequest={seek}
            labels={{
              region: hero.processLabel || hero.stageAlt,
              play: hero.play,
              pause: hero.pause,
              prev: hero.prev,
              next: hero.next,
              step: hero.stepOf,
            }}
          />
        </div>
      </div>
    </section>
  );
}

const SITE_SHOWCASE = [
  { key: "studiora", name: "Studiora", he: "עסק", en: "Business" },
  { key: "noodlix", name: "Noodlix", he: "מסעדה", en: "Restaurant" },
  { key: "primeview", name: "Primeview", he: "נדל״ן", en: "Real estate" },
  { key: "lashora", name: "Lashora", he: "יופי", en: "Beauty" },
  { key: "advisora", name: "Advisora", he: "שירותים", en: "Services" },
  { key: "florique", name: "Florique", he: "דף נחיתה", en: "Landing page" },
] as const;

function Websites() {
  const { text, language, dir } = useCopy();
  const reduced = useReduced();
  const lang = language.startsWith("he") ? "he" : "en";
  const sites = SITE_SHOWCASE.map((site) => ({ ...site, kind: text(site.he, site.en) }));
  const count = sites.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [onscreen, setOnscreen] = useState(false);
  const root = useRef<HTMLElement | null>(null);
  const reasons = useRef(new Set<string>());
  const drag = useRef({ x: 0, id: -1 });

  const hold = (reason: string, on: boolean) => {
    if (on) reasons.current.add(reason);
    else reasons.current.delete(reason);
    setPaused(reasons.current.size > 0);
  };

  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setOnscreen(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setOnscreen(entry.isIntersecting),
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || paused || !onscreen) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, 5600);
    return () => window.clearInterval(timer);
  }, [reduced, paused, onscreen, count]);

  const go = (delta: number) => setIndex((current) => (current + delta + count) % count);
  const shift = `${dir === "rtl" ? index * 100 : -index * 100}%`;

  return (
    <section
      className="ht-products"
      id="websites"
      aria-labelledby="ht-sites-title"
      ref={root}
      onMouseEnter={() => hold("hover", true)}
      onMouseLeave={() => hold("hover", false)}
      onFocus={() => hold("focus", true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) hold("focus", false);
      }}
    >
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("בניית אתרים", "Website builder")}</p>
          <h2 id="ht-sites-title">{text("האתר הבא שלכם מתחיל כאן", "Your Next Website Starts Here")}</h2>
          <p className="ht-lead">
            {text(
              "אתרי תדמית, דפי נחיתה ואתרים עסקיים בעיצוב מקצועי — נבנים ומותאמים לעסק שלכם באמצעות Bizuply.",
              "Create professional business websites, landing pages and beautifully designed digital experiences with Bizuply.",
            )}
          </p>
        </div>
        <div
          className="ht-gallery"
          data-reveal
          role="region"
          aria-roledescription={text("גלריה", "gallery")}
          aria-label={text("אתרים שנבנו באמצעות Bizuply", "Websites built with Bizuply")}
        >
          <button type="button" className="ht-gallery-arrow ht-gallery-prev" onClick={() => go(-1)} aria-label={text("האתר הקודם", "Previous website")}>
            <i aria-hidden="true" />
          </button>
          <div
            className="ht-gallery-view"
            onPointerDown={(event) => {
              if (event.pointerType === "mouse" && event.button !== 0) return;
              event.preventDefault();
              drag.current = { x: event.clientX, id: event.pointerId };
              event.currentTarget.setPointerCapture(event.pointerId);
              hold("pointer", true);
            }}
            onPointerUp={(event) => {
              if (drag.current.id !== event.pointerId) return;
              const dx = event.clientX - drag.current.x;
              drag.current.id = -1;
              if (Math.abs(dx) > 48) go(dir === "rtl" ? (dx > 0 ? 1 : -1) : (dx < 0 ? 1 : -1));
              hold("pointer", false);
              hold("settle", true);
              window.setTimeout(() => hold("settle", false), 7000);
            }}
            onPointerCancel={() => {
              drag.current.id = -1;
              hold("pointer", false);
            }}
          >
            <div className="ht-gallery-track" style={{ transform: `translate3d(${shift}, 0, 0)` }}>
              {sites.map((site, siteIndex) => (
                <article className="ht-gallery-slide" key={site.key} aria-hidden={siteIndex !== index}>
                  <div className="ht-gallery-stage">
                    <img
                      src={`${MEDIA}/sites/${site.key}-${lang}-desk.webp`}
                      alt={siteIndex === index ? `${site.name} — ${site.kind}` : ""}
                      width={1440}
                      height={900}
                      loading={Math.abs(siteIndex - index) <= 1 ? "eager" : "lazy"}
                      decoding="async"
                    />
                  </div>
                  <p className="ht-gallery-caption"><span>{site.kind}</span><strong>{site.name}</strong></p>
                </article>
              ))}
            </div>
          </div>
          <button type="button" className="ht-gallery-arrow ht-gallery-next" onClick={() => go(1)} aria-label={text("האתר הבא", "Next website")}>
            <i aria-hidden="true" />
          </button>
          <div className="ht-gallery-dots">
            {sites.map((site, siteIndex) => (
              <button
                key={site.key}
                type="button"
                className={siteIndex === index ? "is-on" : undefined}
                aria-label={site.name}
                aria-current={siteIndex === index ? "true" : undefined}
                onClick={() => setIndex(siteIndex)}
              />
            ))}
          </div>
        </div>
        <div className="hx-actions ht-center">
          <Cta to="/website-builder">{text("בואו לבנות אתר", "Start Building")}</Cta>
        </div>
      </div>
    </section>
  );
}

function BenefitIcon({ kind }: { kind: "system" | "phone" | "official" | "test" | "start" }) {
  const pen = {
    width: 40,
    height: 40,
    viewBox: "0 0 32 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  if (kind === "system") {
    return (
      <svg {...pen}>
        <circle cx="16" cy="8" r="2.2" />
        <circle cx="8" cy="23" r="2.2" />
        <circle cx="24" cy="23" r="2.2" />
        <path d="M16 10.2 9.1 20.8M16 10.2 22.9 20.8M10.2 23h11.6" />
      </svg>
    );
  }
  if (kind === "phone") {
    return (
      <svg {...pen}>
        <rect x="11" y="4.5" width="10" height="23" rx="2" />
        <path d="M14 8.5h4M15.2 24h1.6" />
      </svg>
    );
  }
  if (kind === "official") {
    return (
      <svg {...pen}>
        <path d="M16 4.5 26 8.5v7.2c0 5.2-3.8 8.6-10 10.8-6.2-2.2-10-5.6-10-10.8V8.5z" />
        <path d="m12.2 15.4 2.5 2.5 5.1-5.4" />
      </svg>
    );
  }
  if (kind === "test") {
    return (
      <svg {...pen}>
        <circle cx="16" cy="16" r="9" strokeDasharray="3 2.4" />
        <path d="m13.5 12.2 7 3.8-7 3.8z" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return (
    <svg {...pen}>
      <circle cx="8" cy="16" r="2" fill="currentColor" stroke="none" />
      <path d="M10.5 16H24M19 11l5 5-5 5" />
    </svg>
  );
}

function Benefits() {
  const { text } = useCopy();
  const items = [
    ["system", text("מערכת אחת במקום כלים מפוזרים", "One system instead of scattered tools"), text("לידים, שיחות, משימות, אוטומציות וקמפיינים חולקים את אותו כרטיס לקוח.", "Leads, conversations, tasks, automations and campaigns share the same customer record.")],
    ["phone", text("עובד גם מהטלפון", "Works from your phone"), text("אותה מערכת בדסקטופ ובמובייל — לענות לליד גם מחוץ למשרד.", "The same system on desktop and mobile, so you can answer a lead away from the office.")],
    ["official", text("חיבורים רשמיים", "Official connections"), text("WhatsApp Business API ו־Meta דרך החיבורים הרשמיים, בהתאם לאישורים.", "WhatsApp Business API and Meta through their official connections, subject to approval.")],
    ["test", text("בודקים לפני שמפעילים", "Test before you go live"), text("הרצת בדיקה לאוטומציות, בלי לשלוח הודעות ובלי לשנות נתונים.", "Test runs for automations that send nothing and change no data.")],
  ] as const;
  return (
    <section className="ht-benefits" id="benefits" aria-labelledby="ht-benefits-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("יתרונות מרכזיים", "Key benefits")}</p>
          <h2 id="ht-benefits-title">
            {text("כל מה שהעסק צריך", "Everything the business needs")}
            <span className="ht-stop">.</span>
            {" "}
            {text("במקום אחד", "In one place")}
            <span className="ht-stop">.</span>
          </h2>
        </div>
        <ul className="ht-benefit-grid">
          {items.map(([kind, title, body]) => (
            <li key={title} data-reveal>
              <span className="ht-benefit-icon"><BenefitIcon kind={kind} /></span>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  const { text, t, he, language } = useCopy();
  const money = (value: number) =>
    new Intl.NumberFormat(he ? "he-IL" : language, { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
  const plans = PRICING_PACKAGES.map((pkg) => {
    const tx = (suffix: string, hebrew: string, english: string) =>
      he ? hebrew : t(`pricing.packages.${pkg.type}.${suffix}`, { defaultValue: english });
    return {
      key: pkg.type,
      highlighted: pkg.highlighted,
      name: tx("name", pkg.nameHe, pkg.nameEn),
      badge: tx("badge", pkg.badgeHe, pkg.badgeEn),
      description: tx("description", pkg.descriptionHe, pkg.descriptionEn),
      period: tx("pricePeriod", pkg.pricePeriodHe, pkg.pricePeriodEn),
      price: money(pkg.price),
      features: (he ? pkg.featuresHe : pkg.featuresEn.map((item, index) => t(`pricing.packages.${pkg.type}.features.${index}`, { defaultValue: item }))).slice(0, 5),
    };
  });
  return (
    <section className="ht-pricing" id="pricing" aria-labelledby="ht-pricing-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <p className="ht-eyebrow">{text("מחירים ומסלולים", "Pricing and plans")}</p>
          <h2 id="ht-pricing-title">{text("מסלול ברור לכל שלב של העסק.", "A clear plan for every stage of the business.")}</h2>
          <p className="ht-lead">
            {text(
              "המחירים בדולר ארה״ב. אפשר להתחיל בחשבון חינמי ולבחור מסלול בעמוד המחירים.",
              "Prices are in US dollars. You can start on a free account and choose a plan on the pricing page.",
            )}
          </p>
        </div>
        <ul className="ht-plans">
          {plans.map((plan, index) => (
            <li key={plan.key} className={plan.highlighted ? "is-featured" : undefined} data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
              <p className="ht-plan-badge">{plan.badge}</p>
              <h3>{plan.name}</h3>
              <p className="ht-plan-price">
                <strong>{plan.price}</strong>
                <span>{plan.period}</span>
              </p>
              <p className="ht-plan-desc">{plan.description}</p>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <Cta to="/pricing" tone={plan.highlighted ? "solid" : "line"}>{text("לפרטי המסלול", "See plan details")}</Cta>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  const { text, language } = useCopy();
  const locale = faqLocale(language);
  const items = (HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="ht-faq" id="faq" aria-labelledby="ht-faq-title">
      <div className="ht-wrap ht-faq-center">
        <h2 id="ht-faq-title" data-reveal>{text("שאלות נפוצות", "Frequently Asked Questions")}</h2>
        <div className="ht-faq-list">
          {items.map(([question, answer], index) => {
            const on = open === index;
            return (
              <div className={on ? "ht-faq-item is-open" : "ht-faq-item"} key={question}>
                <h3>
                  <button type="button" aria-expanded={on} onClick={() => setOpen(on ? null : index)}>
                    <span>{question}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div className="ht-faq-a">
                  <div>
                    <p>{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="ht-faq-more" data-reveal>
          <div className="hx-actions">
            <Cta to="/faq" tone="line">{text("כל השאלות", "All questions")}</Cta>
          </div>
        </div>
      </div>
    </section>
  );
}

function Close() {
  const { text } = useCopy();
  return (
    <section className="ht-close" aria-labelledby="ht-close-title">
      <Waves className="ht-close-waves" />
      <div className="ht-wrap ht-close-inner" data-reveal>
        <h2 id="ht-close-title">{text("העסק שלכם מוכן לעבוד חכם יותר.", "Your business is ready to work smarter.")}</h2>
        <p>
          {text(
            "פותחים חשבון חינמי, מחברים את מקורות הלידים, ומתחילים לנהל את הלקוחות מתוך מערכת אחת.",
            "Open a free account, connect your lead sources, and start managing customers from one system.",
          )}
        </p>
        <div className="hx-actions">
          <Cta to="/register" tone="light">{text("התחילו בחינם עכשיו", "Start for free now")}</Cta>
          <Cta to="/contact" tone="line">{text("קבעו הדגמה אישית", "Schedule a personal demo")}</Cta>
        </div>
      </div>
    </section>
  );
}
