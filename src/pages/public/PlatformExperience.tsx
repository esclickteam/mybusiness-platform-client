import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { getTextDirection } from "../../i18n/localeUtils";
import { platformStory } from "../../lib/platformStory.mjs";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import {
  MARKETING_LOCALE_PREFIXES,
  marketingPublicUrl,
  splitMarketingLocale,
  withMarketingLocale,
} from "../../lib/localePath.mjs";
import "./platformExperience.css";

const GUIDES = ["what-is-a-crm", "follow-up-on-leads", "whatsapp-cloud-api-cost", "business-automation", "manage-meta-campaigns", "crm-and-business-platform"];
const FIT_SITES = ["studiora", "advisora", "studiora", "lashora", "primeview", "noodlix", "florique"];
const JOURNEY_SHOTS = ["crm-list", "crm-card", "whatsapp", "dashboard", "automation"];

function shot(locale, name) {
  const folder = locale === "he" || locale === "ar" ? "he" : "en";
  return `/demo-media/home/screens/${folder}-desktop-${name}.webp`;
}

function siteShot(locale, name) {
  const folder = locale === "he" || locale === "ar" ? "he" : "en";
  return `/demo-media/home/sites/${name}-${folder}-desk.webp`;
}

function markTitle(text, mark) {
  const index = text.indexOf(mark);
  if (index < 0) return text;
  return (
    <>
      {text.slice(0, index)}
      <em>{mark}</em>
      {text.slice(index + mark.length)}
    </>
  );
}

export default function PlatformExperience() {
  const language = splitMarketingLocale(typeof window === "undefined" ? "/" : window.location.pathname).locale;
  const story = platformStory(language);
  const ui = story.ui;
  const dir = getTextDirection(language);
  const href = (path) => withMarketingLocale(path, language);
  const canonical = marketingPublicUrl("/platform", language);
  const guides = GUIDES.map((slug) => ({ slug, guide: getGuide(slug, language) })).filter((item) => item.guide?.h1);
  const say = (he, en, es, pt, ar) => (language === "he" ? he : language === "es" ? es : language === "pt-BR" ? pt : language === "ar" ? ar : en);
  const jumps = [
    ["#structure", say("המבנה", "Structure", "Estructura", "Estrutura", "البنية")],
    ["#workspace", say("הכלים", "Tools", "Herramientas", "Ferramentas", "الأدوات")],
    ["#journey", say("התהליך", "Process", "Proceso", "Processo", "العملية")],
    ["#day", say("שגרה", "A workday", "La jornada", "O dia", "يوم العمل")],
    ["#fit", say("התאמה", "Fit", "Encaje", "Encaixe", "الملاءمة")],
    ["#faq", say("שאלות", "Questions", "Preguntas", "Perguntas", "أسئلة")],
  ];
  const titleMark = say("כל חלקי העסק", "every part of the business", "cada parte del negocio", "cada parte do negócio", "كل جزء من النشاط");
  const [tool, setTool] = useState(0);
  const [fit, setFit] = useState(0);
  const [journeyStep, setJourneyStep] = useState(0);
  const [dayStep, setDayStep] = useState(0);
  const activeTool = ui.products[tool] || ui.products[0];
  const activeFit = ui.fits[fit] || ui.fits[0];

  useEffect(() => {
    document.title = story.title;
    const setMeta = (attr: "name" | "property", key: string, content: string) => {
      let node = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
      if (!node) {
        node = document.createElement("meta");
        node.setAttribute(attr, key);
        document.head.appendChild(node);
      }
      node.content = content;
    };
    setMeta("name", "description", story.description);
    setMeta("property", "og:title", story.title);
    setMeta("property", "og:description", story.description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", "website");
    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = canonical;
    const alternates: Array<[string, string]> = [
      ["en", marketingPublicUrl("/platform", "en")],
      ["x-default", marketingPublicUrl("/platform", "en")],
      ...MARKETING_LOCALE_PREFIXES.map((entry) => [entry.htmlLang, marketingPublicUrl("/platform", entry.locale)] as [string, string]),
    ];
    for (const [lang, value] of alternates) {
      let alt = document.head.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${lang}"]`);
      if (!alt) {
        alt = document.createElement("link");
        alt.rel = "alternate";
        alt.hreflang = lang;
        document.head.appendChild(alt);
      }
      alt.href = value;
    }
    document.documentElement.lang = language === "pt-BR" ? "pt-BR" : language;
    document.documentElement.dir = dir;
  }, [canonical, dir, language, story.description, story.title]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    const tick = () => {
      frame = 0;
      const vh = window.innerHeight || 800;
      document.querySelectorAll<HTMLElement>(".pf [data-scrub]").forEach((node) => {
        if (reduce) {
          node.style.setProperty("--p", "1");
          return;
        }
        const box = node.getBoundingClientRect();
        const passed = vh - box.top;
        const p = Math.min(1, Math.max(0, passed / (box.height + vh)));
        node.style.setProperty("--p", p.toFixed(3));
        if (node.id === "journey") {
          const next = Math.min(ui.journey.length - 1, Math.max(0, Math.floor(p * ui.journey.length)));
          setJourneyStep((current) => (current === next ? current : next));
        }
        if (node.id === "day") {
          const next = Math.min(ui.day.length - 1, Math.max(0, Math.floor(p * ui.day.length)));
          setDayStep((current) => (current === next ? current : next));
        }
      });
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(tick);
    };
    tick();
    const area = document.querySelector(".app-scroll-area");
    window.addEventListener("scroll", onScroll, { passive: true });
    area?.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      area?.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [language, ui.day.length, ui.journey.length]);

  return (
    <article className="pf" lang={language === "pt-BR" ? "pt-BR" : language} dir={dir}>
      <Helmet>
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <header className="pf-hero" data-scrub>
        <div className="pf-wrap pf-hero-grid">
          <div>
            <p className="pf-eye">{ui.eyebrow}</p>
            <h1>{markTitle(ui.h1, titleMark)}</h1>
            <p className="pf-lede">{ui.lede}</p>
            <div className="pf-actions">
              <a className="pf-btn ghost" href="#workspace">{ui.meet}</a>
              <Link className="pf-btn yellow" to={href("/register")}>{ui.start}</Link>
            </div>
          </div>
          <div className="pf-stage">
            <span className="pf-slab blue" />
            <span className="pf-slab pink" />
            <span className="pf-slab yellow" />
            <figure className="pf-frame">
              <img src={shot(language, "crm-list")} alt="" width="1440" height="900" />
            </figure>
          </div>
        </div>
      </header>

      <nav className="pf-jump" aria-label={ui.sWork}>
        <div className="pf-wrap">
          {jumps.map(([id, label]) => <a key={id} href={id}>{label}</a>)}
        </div>
      </nav>

      <section id="structure" className="pf-section" data-scrub>
        <div className="pf-wrap">
          <h2>{ui.sStruct}</h2>
          <p>{ui.structA}</p>
          <p>{ui.structB}</p>
          <div className="pf-flow">
            <svg className="pf-wires" viewBox="0 0 900 80" aria-hidden="true">
              <path d="M40 40 H860" />
              <circle cx="150" cy="40" r="7" />
              <circle cx="450" cy="40" r="7" />
              <circle cx="750" cy="40" r="7" />
            </svg>
            <ol className="pf-layers">
              <li><span>01</span><h3>{ui.layer1}</h3><p>{ui.layer1b}</p></li>
              <li><span>02</span><h3>{ui.layer2}</h3><p>{ui.layer2b}</p></li>
              <li><span>03</span><h3>{ui.layer3}</h3><p>{ui.layer3b}</p></li>
            </ol>
          </div>
        </div>
      </section>

      <section id="workspace" className="pf-section pf-navy">
        <div className="pf-wrap">
          <h2>{ui.sWork}</h2>
          <div className="pf-tabs" role="tablist">
            {ui.products.map((product, index) => (
              <button key={product.id} type="button" role="tab" aria-selected={index === tool} className={index === tool ? "is-on" : ""} onClick={() => setTool(index)}>
                {product.name}
              </button>
            ))}
          </div>
          <div className="pf-explorer">
            <figure className="pf-frame" key={activeTool.id}>
              <img src={shot(language, activeTool.shot)} alt="" width="1440" height="900" />
            </figure>
            <div>
              {ui.products.map((product, index) => (
                <article key={product.id} id={product.id} className={index === tool ? "is-on" : ""}>
                  <h3>{product.name}</h3>
                  <p>{product.body}</p>
                  <Link to={href(product.href)}>{ui.open}</Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="journey" className="pf-section" data-scrub>
        <div className="pf-wrap pf-split">
          <div>
            <h2>{ui.sJourney}</h2>
            <p>{ui.journeyLede}</p>
            <ol className="pf-steps">
              {ui.journey.map((step, index) => (
                <li key={step.title} className={index === journeyStep ? "is-on" : ""}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <figure className="pf-frame pf-journey-shot" key={JOURNEY_SHOTS[journeyStep]}>
            <img src={shot(language, JOURNEY_SHOTS[journeyStep] || "crm-list")} alt="" width="1440" height="900" />
          </figure>
        </div>
      </section>

      <section id="day" className="pf-section" data-scrub data-tone={["blue", "blue", "yellow", "pink"][dayStep] || "blue"}>
        <div className="pf-wrap pf-split">
          <div>
            <h2>{ui.sDay}</h2>
            <ul className="pf-day">
              {ui.day.map((item, index) => (
                <li key={item.title} className={index === dayStep ? "is-on" : ""}>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="pf-frame">
            <img src={shot(language, dayStep === 2 ? "dashboard" : dayStep === 3 ? "automation" : "crm-card")} alt="" width="1440" height="900" />
          </figure>
        </div>
      </section>

      <section id="fit" className="pf-section pf-fit">
        <div className="pf-wrap">
          <h2>{ui.sFit}</h2>
          <p>{ui.fitLede}</p>
          <div className="pf-fit-grid">
            <div className="pf-tabs" role="tablist">
              {ui.fits.map((item, index) => (
                <button key={item.href} type="button" role="tab" aria-selected={index === fit} className={index === fit ? "is-on" : ""} onClick={() => setFit(index)}>
                  {item.name}
                </button>
              ))}
            </div>
            <div className="pf-fit-stage">
              <span className="pf-fit-wash" />
              <figure className="pf-frame" key={activeFit.href}>
                <img src={siteShot(language, FIT_SITES[fit] || "studiora")} alt="" width="1440" height="900" />
              </figure>
              <div>
                <h3>{activeFit.name}</h3>
                <p>{activeFit.body}</p>
                <Link to={href(activeFit.href)}>{ui.open}</Link>
              </div>
            </div>
          </div>
          <div className="pf-fit-all">
            {ui.fits.map((item) => (
              <p key={item.href}><strong>{item.name}. </strong>{item.body} <Link to={href(item.href)}>{item.name}</Link></p>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="pf-section">
        <div className="pf-wrap">
          <h2>{ui.sCompare}</h2>
          <p>{ui.compareNote}</p>
          <div className="pf-table">
            <table>
              <thead><tr>{story.compare.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
              <tbody>
                {story.compare.rows.map((row) => (
                  <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="channels" className="pf-section" data-scrub>
        <div className="pf-wrap">
          <h2>{ui.sChan}</h2>
          <div className="pf-hub">
            <img src="/brand/logo.png" alt="Bizuply" width="220" height="75" />
          </div>
          <ul className="pf-channels">
            {ui.channels.map((item) => (
              <li key={item.name}>
                <div>
                  <h3>{item.name}</h3>
                  <small>{item.kind === "external" ? ui.external : ui.internal}</small>
                </div>
                <p>{item.body}</p>
                {item.kind === "external"
                  ? <a href={item.href} rel="noopener noreferrer">{item.name}</a>
                  : <Link to={href(item.href)}>{ui.open}</Link>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="trust" className="pf-section pf-trust">
        <div className="pf-wrap">
          <h2>{ui.sTrust}</h2>
          <p>{ui.trustBody}</p>
          <p className="pf-links">
            <Link to={href("/privacy")}>{ui.privacy}</Link>
            <Link to={href("/terms")}>{ui.terms}</Link>
            <Link to={href("/pricing")}>{ui.plans}</Link>
          </p>
          <div className="pf-actions">
            <Link className="pf-btn yellow" to={href("/register")}>{ui.start}</Link>
            <Link className="pf-btn ghost" to={href("/contact")}>{ui.demo}</Link>
          </div>
        </div>
      </section>

      <section id="guides" className="pf-section">
        <div className="pf-wrap">
          <h2>{ui.guides}</h2>
          <ul className="pf-guides">
            {guides.map(({ slug, guide }) => (
              <li key={slug}><Link to={href(`/guides/${slug}`)}>{guide.h1}</Link></li>
            ))}
          </ul>
        </div>
      </section>

      <section id="faq" className="pf-section">
        <div className="pf-wrap pf-faq">
          <h2>{ui.sFaq}</h2>
          {story.faq.map(([question, answer]) => (
            <details key={question}>
              <summary>{question}</summary>
              <div className="pf-answer"><p>{answer}</p></div>
            </details>
          ))}
        </div>
      </section>

      <section className="pf-end">
        <div className="pf-wrap">
          <h2>{ui.endTitle}</h2>
          <p>{ui.endBody}</p>
          <div className="pf-actions">
            <Link className="pf-btn yellow" to={href("/register")}>{ui.start}</Link>
            <Link className="pf-btn ghost" to={href("/contact")}>{ui.demo}</Link>
            <Link className="pf-btn ghost" to={href("/pricing")}>{ui.plans}</Link>
          </div>
        </div>
      </section>
    </article>
  );
}
