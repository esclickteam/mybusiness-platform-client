import { Fragment, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { cinematicFor } from "../../lib/homeCinematic.mjs";
import { HOME_FAQ } from "../../lib/homeFaq.mjs";
import { industryNav, marketingNav } from "../../lib/marketingNav.mjs";
import { homeText } from "./homeCopy";

const MEDIA = "/demo-media/home/screens";

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

function Words({ text, hot = -1, delay = 0 }: { text: string; hot?: number; delay?: number }) {
  const words = text.split(" ");
  const reduced = useReduced();
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
              style={motionReady ? { animationDelay: `${delay + index * 70}ms` } : undefined}
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

function bindScroll(node: HTMLElement, onFrame: (progress: number) => void) {
  let frame = 0;
  const tick = () => {
    frame = 0;
    const rect = node.getBoundingClientRect();
    const total = node.offsetHeight - window.innerHeight;
    const progress = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
    onFrame(progress);
  };
  const request = () => {
    if (!frame) frame = window.requestAnimationFrame(tick);
  };
  request();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  return () => {
    if (frame) window.cancelAnimationFrame(frame);
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", request);
  };
}

export default function WorldHome() {
  const { i18n } = useTranslation();
  const language = i18n.language || "en";
  const cine = cinematicFor(language);
  const hero = cine.hero;
  const dir = getTextDirection(language);
  const lang = language.toLowerCase().startsWith("he") ? "he" : "en";
  const locale =
    language.toLowerCase().startsWith("he") ? "he"
    : language.toLowerCase().startsWith("es") ? "es"
    : language.toLowerCase().startsWith("pt") ? "pt-BR"
    : language.toLowerCase().startsWith("ar") ? "ar"
    : "en";
  const reduced = useReduced();
  const storyRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLElement | null>(null);
  const hotSource = hero.lineThree || hero.lineTwo;
  const hot = Math.max(0, String(hotSource).trim().split(/\s+/).length - 1);
  const steps = (hero.processCopy || []) as [string, string][];
  const labels = (hero.processSteps || []) as [string, string][];
  const products = marketingNav(locale).find((group) => group.id === "products");
  const productLinks = products?.columns?.flatMap((column) => column.links) || [];
  const industries = industryNav(locale);
  const faqs = ((HOME_FAQ as Record<string, [string, string][]>)[locale] || HOME_FAQ.en).slice(0, 6);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const shots = [
    `${MEDIA}/${lang}-desktop-dashboard.webp`,
    `${MEDIA}/${lang}-desktop-crm-card.webp`,
    `${MEDIA}/${lang}-desktop-whatsapp.webp`,
    `${MEDIA}/${lang}-desktop-automation.webp`,
    `${MEDIA}/${lang}-mobile-campaigns.webp`,
    `${MEDIA}/${lang}-desktop-ai.webp`,
  ];

  useEffect(() => {
    const story = storyRef.current;
    const rail = railRef.current;
    const clean: Array<() => void> = [];
    if (story) {
      clean.push(bindScroll(story, (progress) => {
        const step = Math.min(steps.length - 1, Math.floor(progress * steps.length));
        story.style.setProperty("--p", progress.toFixed(4));
        if (story.dataset.step !== String(step)) story.dataset.step = String(step);
      }));
    }
    if (rail) {
      const track = rail.querySelector<HTMLElement>(".bz-rail__track");
      clean.push(bindScroll(rail, (progress) => {
        if (!track) return;
        const distance = Math.max(0, track.scrollWidth - rail.clientWidth + 48);
        const sign = dir === "rtl" ? 1 : -1;
        track.style.transform = reduced ? "" : `translate3d(${sign * distance * progress}px, 0, 0)`;
      }));
    }
    return () => clean.forEach((fn) => fn());
  }, [dir, reduced, steps.length]);

  return (
    <div className="bz-world" dir={dir}>
      <a className="bz-skip" href="#how">{homeText(language, "דילוג לתוכן", "Skip to content")}</a>

      <section className="hx-hero" id="how" data-bz-tone="ink" aria-labelledby="hx-hero-title">
        <div className="bz-stage__shapes" aria-hidden="true">
          <span className="bz-blob bz-blob--pink" />
          <span className="bz-blob bz-blob--yellow" />
          <span className="bz-bridge" />
        </div>
        <div className="bz-stage__copy">
          <p className="hx-hero-kicker">{hero.kicker}</p>
          <h1 className="hx-display" id="hx-hero-title">
            <Words text={hero.lineOne} />
            <Words text={hero.lineTwo} hot={hero.lineThree ? -1 : hot} delay={80} />
            {hero.lineThree ? <Words text={hero.lineThree} hot={hot} delay={160} /> : null}
          </h1>
          <p className="hx-lead">{hero.lead1}</p>
          <div className="hx-actions">
            <Link className="hx-btn" to="/register"><span>{hero.start}</span></Link>
            <Link className="hx-btn hx-btn-line" to="/contact"><span>{hero.see}</span></Link>
          </div>
        </div>
        <div className="bz-stage__media" aria-hidden="true">
          <img className="bz-float bz-float--desk" src={`${MEDIA}/${lang}-desktop-dashboard.webp`} alt="" width="1600" height="1000" />
          <img className="bz-float bz-float--card" src={`${MEDIA}/${lang}-desktop-crm-card.webp`} alt="" width="1400" height="900" />
          <img className="bz-float bz-float--phone" src={`${MEDIA}/${lang}-mobile-whatsapp.webp`} alt="" width="640" height="1280" />
          {reduced ? (
            <img className="bz-float bz-float--film" src={`/demo-media/home/theater/${lang}-desktop.webp`} alt="" width="1920" height="1080" />
          ) : (
            <video
              className="bz-float bz-float--film"
              src={`/demo-media/home/theater/${lang}-desktop.mp4`}
              poster={`/demo-media/home/theater/${lang}-desktop.webp`}
              muted
              playsInline
              autoPlay
              loop
            />
          )}
        </div>
      </section>

      <section className="bz-story" ref={storyRef} data-step="0" data-bz-tone="paper" aria-label={hero.processLabel}>
        <div className="bz-story__pin">
          <svg className="bz-story__line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d="M8 12 C 28 28, 18 58, 42 62 S 70 30, 92 88" />
          </svg>
          {steps.map(([title, body], index) => (
            <article className="bz-panel" data-i={index} key={title}>
              <div className="bz-panel__copy">
                <p>{labels[index]?.[1] || String(index + 1)}</p>
                <h2>{title}</h2>
                <span>{body}</span>
              </div>
              <img src={shots[index] || shots[0]} alt="" width="1400" height="900" />
            </article>
          ))}
        </div>
      </section>

      <section className="bz-tools" data-bz-tone="navy" aria-labelledby="bz-tools-title">
        <div className="bz-tools__intro">
          <h2 id="bz-tools-title">{cine.toolsTitle}</h2>
          <p>{cine.toolsLead}</p>
        </div>
        <div className="bz-bento">
          {productLinks.map((link, index) => (
            <Link key={link.to + link.label} className={`bz-tile bz-tile--${index % 5}`} to={link.to}>
              <strong>{link.label}</strong>
              <span>{link.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bz-split" data-bz-tone="paper">
        <div className="bz-split__copy">
          <h2>{cine.crmTitle}</h2>
          <p>{cine.crmLead}</p>
          <Link to="/crm">{hero.cta}</Link>
        </div>
        <div className="bz-split__mask">
          <img src={`${MEDIA}/${lang}-desktop-crm-list.webp`} alt="" width="1600" height="1000" />
        </div>
      </section>

      <section className="bz-split bz-split--flip" data-bz-tone="pink">
        <div className="bz-split__mask bz-split__mask--round">
          <video
            src={`/demo-media/home/whatsapp.mp4`}
            poster="/demo-media/home/whatsapp.jpg"
            muted
            playsInline
            autoPlay={reduced ? undefined : true}
            loop
          />
        </div>
        <div className="bz-split__copy">
          <h2>{cine.waTitle}</h2>
          <p>{cine.waLead}</p>
          <Link to="/whatsapp-api">{hero.see}</Link>
        </div>
      </section>

      <section className="bz-hscroll" ref={railRef} data-bz-tone="yellow" aria-label={industries.label || cine.growTitle}>
        <div className="bz-hscroll__pin">
          <h2>{cine.growTitle}</h2>
          <div className="bz-rail__track">
            {industries.links.map(([to, label, blurb]) => (
              <Link key={to} to={to}>
                <strong>{label}</strong>
                <span>{blurb}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bz-why" data-bz-tone="paper">
        <h2>{cine.whyTitle}</h2>
        <p>{cine.whyLead}</p>
        <ul>
          {(cine.orbit as string[]).map((item) => <li key={item}>{item}</li>)}
        </ul>
      </section>

      <section className="bz-faq" id="faq" data-bz-tone="paper">
        <h2>{cine.faqTitle}</h2>
        <div>
          {faqs.map(([question, answer], index) => {
            const on = openFaq === index;
            return (
              <article key={question} className={on ? "is-open" : undefined}>
                <h3>
                  <button type="button" aria-expanded={on} onClick={() => setOpenFaq(on ? null : index)}>
                    {question}
                  </button>
                </h3>
                {on ? <p>{answer}</p> : null}
              </article>
            );
          })}
        </div>
      </section>

      <section className="bz-end" data-bz-tone="navy">
        <h2>{cine.endTitle}</h2>
        <p>{cine.endLead}</p>
        <div>
          <Link className="hx-btn" to="/register"><span>{cine.endPrimary}</span></Link>
          <Link className="hx-btn hx-btn-line" to="/pricing"><span>{cine.endSecondary}</span></Link>
        </div>
      </section>
    </div>
  );
}
