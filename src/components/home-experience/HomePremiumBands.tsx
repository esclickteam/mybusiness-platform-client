import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { StudioFrame } from "./ProductMocks";

function useCine() {
  const { i18n } = useTranslation();
  return cinematicFor(i18n.language);
}

function useText() {
  const { i18n } = useTranslation();
  const he = i18n.language.startsWith("he");
  return (hebrew: string, english: string) => (he ? hebrew : english);
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

function Cta({ to, children, tone = "solid" }: { to: string; children: string; tone?: "solid" | "line" | "ink" }) {
  const className = `hx-btn text-inherit${tone === "line" ? " hx-btn-line" : ""}${tone === "ink" ? " hx-btn-ink" : ""}`;
  const inner = (
    <>
      <span>{children}</span>
      <i aria-hidden="true" />
    </>
  );
  if (to.startsWith("#")) {
    return (
      <a className={className} href={to}>
        {inner}
      </a>
    );
  }
  return (
    <Link className={className} to={to}>
      {inner}
    </Link>
  );
}

export function HomeJourney() {
  const cine = useCine();
  const [active, setActive] = useState(0);
  const reduced = useReduced();
  const ref = useRef<HTMLElement | null>(null);
  const steps = cine.journeySteps || [];

  useEffect(() => {
    if (reduced) return undefined;
    const node = ref.current;
    if (!node) return undefined;
    let frame = 0;
    const update = () => {
      frame = 0;
      const rect = node.getBoundingClientRect();
      const view = window.innerHeight || 1;
      const progress = Math.min(1, Math.max(0, (view - rect.top) / (node.offsetHeight + view)));
      const next = Math.min(steps.length - 1, Math.floor(progress * steps.length));
      setActive((current) => (current === next ? current : next));
    };
    const request = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [reduced, steps.length]);

  if (!steps.length) return null;
  const shown = steps[active] || steps[0];

  return (
    <section className="hx-journey" id="journey" ref={ref} aria-labelledby="hx-journey-title">
      <div className="hx-journey-wrap">
        <div className="hx-journey-copy">
          <h2 id="hx-journey-title">{cine.journeyTitle}</h2>
          <p className="hx-prose">{cine.journeyLead}</p>
          <ol className="hx-journey-steps">
            {steps.map(([title], index) => (
              <li key={title}>
                <button
                  type="button"
                  className={index === active ? "is-on" : undefined}
                  aria-current={index === active ? "step" : undefined}
                  onClick={() => setActive(index)}
                >
                  <span className="hx-journey-num">{String(index + 1).padStart(2, "0")}</span>
                  <span>{title}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
        <div className="hx-journey-stage" aria-live="polite">
          <p className="hx-journey-kicker">{String(active + 1).padStart(2, "0")}</p>
          <h3>{shown[0]}</h3>
          <p>{shown[1]}</p>
          <div className="hx-journey-visual" aria-hidden="true">
            <div className={`hx-journey-card is-${active}`}>
              <strong>{shown[0]}</strong>
              <span>{shown[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeTrust() {
  const cine = useCine();
  const text = useText();
  const points = cine.trustPoints || [];
  if (!points.length) return null;
  return (
    <section className="hx-trust hx-reveal" aria-labelledby="hx-trust-title">
      <div className="hx-trust-wrap">
        <h2 id="hx-trust-title">{cine.trustTitle}</h2>
        <p className="hx-prose">{cine.trustLead}</p>
        <ul className="hx-trust-grid">
          {points.map(([title, body]) => (
            <li key={title}>
              <h3>{title}</h3>
              <p>{body}</p>
            </li>
          ))}
        </ul>
        <ul className="hx-trust-integrations" aria-label={text("אינטגרציות", "Integrations")}>
          <li>WhatsApp Business API</li>
          <li>Meta Ads</li>
          <li>CRM</li>
          <li>Website Studio</li>
          <li>Automations</li>
        </ul>
      </div>
    </section>
  );
}

export function HomeAi() {
  const cine = useCine();
  const text = useText();
  const points = cine.aiPoints || [];
  if (!points.length) return null;
  return (
    <section className="hx-ai hx-reveal" aria-labelledby="hx-ai-title">
      <div className="hx-ai-wrap">
        <div className="hx-ai-copy">
          <p className="hx-eyebrow hx-eyebrow-on-dark">{text("זמין בתוך Website Studio", "Available inside Website Studio")}</p>
          <h2 id="hx-ai-title">{cine.aiTitle}</h2>
          <p className="hx-prose">{cine.aiLead}</p>
          <ul className="hx-points">
            {points.map(([title, body]) => (
              <li key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ul>
          <div className="hx-actions">
            <Cta to="/website-builder" tone="ink">
              {text("לבניית אתרים", "Website builder")}
            </Cta>
            <Cta to="/agents" tone="line">{text("לנציגים אנושיים", "Human agents")}</Cta>
          </div>
        </div>
        <figure className="hx-ai-visual">
          <img
            src="/images/about/shot-editor.webp"
            alt={text("עורך Website Studio עם כלי עריכה", "Website Studio editor with editing tools")}
            width={1200}
            height={800}
            loading="lazy"
            decoding="async"
            className="hx-crop-studio"
          />
          <figcaption>{text("הדגמה מעורך האתרים — לא צ׳אטבוט נפרד.", "From the website editor — not a separate chatbot.")}</figcaption>
        </figure>
      </div>
    </section>
  );
}

const SITE_SAMPLES = [
  ["/template-screenshots/studiora.webp", "Studiora", "#5b21b6"],
  ["/template-screenshots/vitalcare.webp", "Vitalcare", "#0f766e"],
  ["/template-screenshots/serenova.webp", "Serenova", "#7c3aed"],
  ["/template-screenshots/soleora.webp", "Soleora", "#1d4ed8"],
  ["/template-screenshots/glowhaus.webp", "Glowhaus", "#9a3412"],
  ["/template-screenshots/talentix.webp", "Talentix", "#312e81"],
] as const;

export function HomeSiteGallery() {
  const cine = useCine();
  const text = useText();
  const reduced = useReduced();
  const [index, setIndex] = useState(0);
  const current = SITE_SAMPLES[index] || SITE_SAMPLES[0];
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    sectionRef.current?.style.setProperty("--gallery-tint", current[2]);
  }, [current]);

  useEffect(() => {
    if (reduced) return undefined;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % SITE_SAMPLES.length);
    }, 6800);
    return () => window.clearInterval(timer);
  }, [reduced]);

  return (
    <section className="hx-site-gallery hx-reveal" id="sites" ref={sectionRef} aria-labelledby="hx-site-gallery-title">
      <div className="hx-site-gallery-wrap">
        <div className="hx-site-gallery-head">
          <h2 id="hx-site-gallery-title">{cine.sitesGalleryTitle}</h2>
          <p className="hx-prose">{cine.sitesGalleryLead}</p>
        </div>
        <div className="hx-site-gallery-stage" aria-live="polite" key={current[0]}>
          <StudioFrame src={current[0]} label={current[1]} mode="desktop" />
          <StudioFrame src={current[0]} label={current[1]} mode="mobile" />
        </div>
        <div className="hx-site-gallery-nav" role="tablist" aria-label={text("דוגמאות אתרים", "Website examples")}>
          {SITE_SAMPLES.map(([src, label], i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={i === index ? "is-on" : undefined}
              onClick={() => setIndex(i)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hx-actions">
          <Cta to="/website-builder" tone="ink">
            {text("לבניית אתרים וחנויות", "Build websites and stores")}
          </Cta>
        </div>
      </div>
    </section>
  );
}
