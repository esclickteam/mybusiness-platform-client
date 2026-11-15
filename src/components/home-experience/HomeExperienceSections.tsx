import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { homeText } from "./homeCopy";
import ProductTheater, { type TheaterFilm, type TheaterStep } from "./ProductTheater";
import CustomerCommandCenter from "./CustomerCommandCenter";
import WhatsAppOperations from "./WhatsAppOperations";
import SmartAutomations from "./SmartAutomations";
import MetaCampaigns from "./MetaCampaigns";
import AiActionFlow from "./AiActionFlow";
import MeetingBooking from "./MeetingBooking";
import WebsiteGallery from "./WebsiteGallery";
import films from "./theaterFilms.json";

const MEDIA = "/demo-media/home";
const FILM_VERSION = "t8";

type FilmKey = keyof typeof films;

function filmFor(key: FilmKey): TheaterFilm {
  const spec = films[key];
  // Mobile plays a 9:16 cut of the same recording. Desktop keeps the original file.
  const file = key.endsWith("-mobile") ? `${key}-focus` : key;
  return {
    src: `${MEDIA}/theater/${file}.mp4?v=${FILM_VERSION}`,
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
        <div className="ht-band ht-band-purple">
          <CustomerCommandCenter />
          <WhatsAppOperations />
          <SmartAutomations />
        </div>
        <div className="ht-band ht-band-light">
          <MetaCampaigns />
          <AiActionFlow />
          <MeetingBooking />
          <WebsiteGallery />
          <Benefits />
        </div>
        <Faq />
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
    <section className="hx-hero" id="how" aria-labelledby="hx-hero-title">
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
            <Cta to="/contact" tone="line">{hero.see}</Cta>
          </div>
        </div>
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


function BenefitIcon({ kind }: { kind: "system" | "phone" | "official" | "flow" | "spark" | "test" }) {
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
  if (kind === "flow") {
    return (
      <svg {...pen}>
        <path d="M7 8h8.5M7 16h18M7 24h12" />
        <path d="m12.5 5.2 3.2 2.8-3.2 2.8M21.5 13.2 25 16l-3.5 2.8M16 21.2l3.2 2.8-3.2 2.8" />
      </svg>
    );
  }
  if (kind === "spark") {
    return (
      <svg {...pen}>
        <path d="M16 5.5v4.2M16 22.3v4.2M5.5 16h4.2M22.3 16h4.2M8.4 8.4l3 3M20.6 20.6l3 3M23.6 8.4l-3 3M11.4 20.6l-3 3" />
        <circle cx="16" cy="16" r="2.2" />
      </svg>
    );
  }
  return (
    <svg {...pen}>
      <circle cx="16" cy="16" r="9" strokeDasharray="3 2.4" />
      <path d="m13.5 12.2 7 3.8-7 3.8z" fill="currentColor" stroke="none" />
    </svg>
  );
}

function Benefits() {
  const { text } = useCopy();
  const items = [
    ["system", text("מערכת אחת. הכול מחובר.", "One system. Everything connected."), text("לידים, לקוחות, שיחות, משימות ואוטומציות — הכול באותה סביבת עבודה.", "Leads, customers, conversations, tasks and automations live in the same workspace.")],
    ["phone", text("עובדים מכל מקום", "Work from anywhere"), text("גישה לניהול העסק מהמחשב ומהטלפון, עם חוויית שימוש מותאמת.", "Run the business from a computer or a phone, with a layout that fits the screen.")],
    ["official", text("חיבורים רשמיים", "Official connections"), text("חיבור ל־WhatsApp Business API ול־Meta באמצעות האינטגרציות הרלוונטיות.", "Connect WhatsApp Business API and Meta through the integrations those platforms provide.")],
    ["flow", text("אוטומציות חכמות", "Smart automations"), text("תהליכים אוטומטיים שמצמצמים עבודה ידנית ועוזרים לעקוב אחרי לקוחות.", "Automated steps that cut repetitive work and help the team follow up.")],
    ["spark", text("AI שמקדם החלטות", "AI that moves the next step forward"), text("תובנות והצעות פעולה שעוזרות להבין מה לעשות בהמשך.", "Insights and suggested next actions that make the following step clearer.")],
    ["test", text("מתנסים לפני שמפעילים", "Try it before you turn it on"), text("הדגמות וסימולציות שמאפשרות להכיר תהליכים לפני הפעלה אמיתית.", "Demos and simulations so you can see a process before it runs for real.")],
  ] as const;
  return (
    <section className="ht-benefits" id="benefits" aria-labelledby="ht-benefits-title">
      <div className="ht-wrap">
        <div className="ht-head" data-reveal>
          <h2 id="ht-benefits-title">
            {text("כל מה שהעסק צריך. במקום אחד.", "Everything the business needs. In one place.")}
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

function Faq() {
  const { text, language } = useCopy();
  const locale = faqLocale(language);
  const items = (HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en;
  const shown = locale === "he" || locale === "en" ? items.slice(0, 8) : items;
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="ht-faq" id="faq" aria-labelledby="ht-faq-title">
      <div className="ht-wrap ht-faq-center">
        <h2 id="ht-faq-title" data-reveal>{text("שאלות נפוצות", "Frequently Asked Questions")}</h2>
        <div className="ht-faq-list">
          {shown.map(([question, answer], index) => {
            const on = open === index;
            const panelId = `ht-faq-panel-${index}`;
            return (
              <div className={on ? "ht-faq-item is-open" : "ht-faq-item"} key={question}>
                <h3>
                  <button
                    type="button"
                    id={`${panelId}-button`}
                    aria-expanded={on}
                    aria-controls={panelId}
                    onClick={() => setOpen(on ? null : index)}
                  >
                    <span>{question}</span>
                    <i aria-hidden="true" />
                  </button>
                </h3>
                <div className="ht-faq-a" id={panelId} role="region" aria-labelledby={`${panelId}-button`} aria-hidden={!on}>
                  <div>
                    <p>{answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
