import React, { useEffect } from "react";
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

function shot(locale, name) {
  const folder = locale === "he" || locale === "ar" ? "he" : "en";
  return `/demo-media/home/screens/${folder}-desktop-${name}.webp`;
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

  return (
    <article className="pf" lang={language === "pt-BR" ? "pt-BR" : language} dir={dir}>
      <Helmet>
        <title>{story.title}</title>
        <meta name="description" content={story.description} />
        <link rel="canonical" href={canonical} />
      </Helmet>

      <header className="pf-hero">
        <div className="pf-wrap pf-hero-grid">
          <div>
            <p className="pf-eye">{ui.eyebrow}</p>
            <h1>{ui.h1}</h1>
            <p className="pf-lede">{ui.lede}</p>
            <div className="pf-actions">
              <a className="pf-btn ghost" href="#workspace">{ui.meet}</a>
              <Link className="pf-btn yellow" to={href("/register")}>{ui.start}</Link>
            </div>
          </div>
          <figure className="pf-frame">
            <img src={shot(language, "crm-list")} alt="" width="1440" height="900" />
          </figure>
        </div>
      </header>

      <nav className="pf-jump" aria-label={ui.sWork}>
        <div className="pf-wrap">
          {jumps.map(([id, label]) => <a key={id} href={id}>{label}</a>)}
        </div>
      </nav>

      <section id="structure" className="pf-section">
        <div className="pf-wrap">
          <h2>{ui.sStruct}</h2>
          <p>{ui.structA}</p>
          <p>{ui.structB}</p>
          <ol className="pf-layers">
            <li><span>01</span><h3>{ui.layer1}</h3><p>{ui.layer1b}</p></li>
            <li><span>02</span><h3>{ui.layer2}</h3><p>{ui.layer2b}</p></li>
            <li><span>03</span><h3>{ui.layer3}</h3><p>{ui.layer3b}</p></li>
          </ol>
        </div>
      </section>

      <section id="workspace" className="pf-section pf-soft">
        <div className="pf-wrap">
          <h2>{ui.sWork}</h2>
          <div className="pf-products">
            {ui.products.map((product, index) => (
              <article key={product.id} id={product.id} className={index % 2 ? "is-flip" : ""}>
                <div>
                  <h3>{product.name}</h3>
                  <p>{product.body}</p>
                  <Link to={href(product.href)}>{ui.open}</Link>
                </div>
                <figure>
                  <img src={shot(language, product.shot)} alt="" width="1440" height="900" loading="lazy" />
                </figure>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="journey" className="pf-section">
        <div className="pf-wrap">
          <h2>{ui.sJourney}</h2>
          <p>{ui.journeyLede}</p>
          <ol className="pf-steps">
            {ui.journey.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="day" className="pf-section pf-soft">
        <div className="pf-wrap pf-day">
          <div>
            <h2>{ui.sDay}</h2>
            <ul>
              {ui.day.map((item) => (
                <li key={item.title}><h3>{item.title}</h3><p>{item.body}</p></li>
              ))}
            </ul>
          </div>
          <figure className="pf-frame">
            <img src={shot(language, "dashboard")} alt="" width="1440" height="900" loading="lazy" />
          </figure>
        </div>
      </section>

      <section id="fit" className="pf-section">
        <div className="pf-wrap">
          <h2>{ui.sFit}</h2>
          <p>{ui.fitLede}</p>
          <div className="pf-fits">
            {ui.fits.map((item) => (
              <Link key={item.href} to={href(item.href)}>
                <h3>{item.name}</h3>
                <p>{item.body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="compare" className="pf-section pf-soft">
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

      <section id="channels" className="pf-section">
        <div className="pf-wrap">
          <h2>{ui.sChan}</h2>
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

      <section id="trust" className="pf-section pf-soft">
        <div className="pf-wrap">
          <h2>{ui.sTrust}</h2>
          <p>{ui.trustBody}</p>
          <p className="pf-links">
            <Link to={href("/privacy")}>{ui.privacy}</Link>
            <Link to={href("/terms")}>{ui.terms}</Link>
            <Link to={href("/pricing")}>{ui.plans}</Link>
          </p>
          <h3>{ui.guides}</h3>
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
