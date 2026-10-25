import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import {
  marketingPublicUrl,
  normalizeMarketingLocale,
  splitMarketingLocale,
} from "../../lib/localePath.mjs";
import { PLATFORM_MEDIA, TILE_MEDIA, platformActivity } from "../../lib/platformPage.mjs";
import "./platformPage.css";

const HREFLANG = [
  ["en", "https://bizuply.com/platform"],
  ["he", "https://bizuply.com/he/platform"],
  ["es", "https://bizuply.com/es/platform"],
  ["pt-BR", "https://bizuply.com/pt-br/platform"],
  ["ar", "https://bizuply.com/ar/platform"],
  ["x-default", "https://bizuply.com/platform"],
];

function usePlatformLocale() {
  const { i18n } = useTranslation();
  const locale = typeof window === "undefined"
    ? "en"
    : splitMarketingLocale(window.location.pathname).locale;
  useEffect(() => {
    if (normalizeMarketingLocale(i18n.language) !== locale) {
      void i18n.changeLanguage(locale);
    }
  }, [i18n, locale]);
  return locale;
}

function LoopFilm({ filmKey, label, pauseLabel, playLabel }) {
  const media = PLATFORM_MEDIA[filmKey];
  const nodeRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduce(query.matches);
    apply();
    query.addEventListener?.("change", apply);
    return () => query.removeEventListener?.("change", apply);
  }, []);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;
    if (reduce || paused) {
      node.pause();
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void node.play().catch(() => undefined);
      else node.pause();
    }, { threshold: 0.4 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [paused, reduce, filmKey]);

  return (
    <div className="pf-screen">
      <video
        ref={nodeRef}
        key={media.film}
        src={media.film}
        poster={media.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
      />
      <button type="button" className="pf-pause" onClick={() => setPaused((value) => !value)}>
        {paused || reduce ? playLabel : pauseLabel}
      </button>
    </div>
  );
}

function HeroStage({ page }) {
  return (
    <div className="pf-stage">
      <img className="pf-stage__main" src="/demo-media/home/crm.jpg" alt={page.stageMain} width="1200" height="750" fetchPriority="high" decoding="async" />
      <img className="pf-stage__float pf-stage__float--a" src="/demo-media/whatsapp/still-3.jpg" alt={page.stageChat} width="640" height="400" />
      <img className="pf-stage__float pf-stage__float--b" src="/demo-media/appointments/still-8.jpg" alt={page.stageCalendar} width="640" height="400" />
      <img className="pf-stage__float pf-stage__float--c" src="/demo-media/home/campaigns.jpg" alt={page.stageCampaigns} width="640" height="400" />
    </div>
  );
}

function ModuleMap({ labels }) {
  return (
    <div className="pf-orbit" aria-hidden="true">
      <svg viewBox="0 0 640 360">
        <path d="M320 180 C 180 40, 80 80, 90 70" />
        <path d="M320 180 C 460 40, 560 80, 550 70" />
        <path d="M80 180 H 250" />
        <path d="M390 180 H 560" />
        <path d="M320 180 C 180 300, 120 300, 130 300" />
        <path d="M320 180 C 460 300, 520 300, 510 300" />
      </svg>
      <p className="pf-orbit__core">Bizuply</p>
      {labels.map((label) => <span className="pf-node" key={label}>{label}</span>)}
    </div>
  );
}

export default function PlatformPage() {
  const locale = usePlatformLocale();
  const page = platformActivity(locale);
  const dir = getTextDirection(locale);
  const canonical = marketingPublicUrl("/platform", locale);
  const [tile, setTile] = useState(0);
  const tiles = page.workspace.tiles;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return undefined;
    const timer = window.setInterval(() => {
      setTile((value) => (value + 1) % tiles.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, [tiles.length]);

  const active = tiles[tile];
  const activeMedia = TILE_MEDIA[active.key];

  return (
    <main className="pf" lang={locale} dir={dir}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        {HREFLANG.map(([lang, href]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={href} />
        ))}
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:url" content={canonical} />
      </Helmet>

      <section className="pf-hero">
        <div className="pf-hero__glow" aria-hidden="true" />
        <div className="pf-wrap pf-hero__grid">
          <div>
            <h1 className="pf-hero__title">{page.h1}</h1>
            <p className="pf-hero__lead">{page.lede}</p>
            <div className="pf-actions">
              <a className="pf-btn pf-btn--ghost" href="#connected">{page.explore}</a>
              <Link className="pf-btn pf-btn--primary" to="/register">{page.start}</Link>
            </div>
          </div>
          <HeroStage page={page} />
        </div>
      </section>

      <section className="pf-section pf-light" id="connected">
        <div className="pf-wrap">
          <h2>{page.flow.title}</h2>
          <p className="pf-lead">{page.flow.lead}</p>
          <div className="pf-flow-wrap">
          <span className="pf-flow__rail" aria-hidden="true" />
          <ol className="pf-flow">
            {page.flow.steps.map((step, index) => (
              <li className="pf-step" key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          </div>
        </div>
      </section>

      <section className="pf-section pf-dark" id="workspace">
        <div className="pf-wrap">
          <h2>{page.workspace.title}</h2>
          <p className="pf-lead">{page.workspace.lead}</p>
          <div className="pf-board">
            <div>
              <ul className="pf-chips">
                {tiles.map((item, index) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      className="pf-chip"
                      aria-current={index === tile ? "true" : undefined}
                      onClick={() => setTile(index)}
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ul>
              <LoopFilm
                filmKey={activeMedia.film}
                label={active.alt}
                pauseLabel={page.pause}
                playLabel={page.play}
              />
            </div>
            <div className="pf-tiles">
              {tiles.map((item) => (
                <figure className="pf-tile" key={item.key}>
                  <img src={TILE_MEDIA[item.key].still} alt={item.alt} width="640" height="400" />
                  <figcaption>{item.title}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pf-section pf-white" id="products">
        <div className="pf-wrap">
          <h2>{page.products.title}</h2>
          <p className="pf-lead">{page.products.lead}</p>
          {page.products.items.map((item, index) => (
            <article className={index % 2 ? "pf-split pf-split--flip" : "pf-split"} key={item.key}>
              <div className="pf-copy">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
                <Link to={item.href}>{item.cta}</Link>
              </div>
              <div className="pf-media">
                <LoopFilm
                  filmKey={item.key}
                  label={item.alt}
                  pauseLabel={page.pause}
                  playLabel={page.play}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pf-section pf-dark" id="adapt">
        <div className="pf-wrap">
          <h2>{page.adapt.title}</h2>
          <p className="pf-lead">{page.adapt.lead}</p>
          <div className="pf-options">
            {page.adapt.options.map((option) => (
              <article className="pf-card" key={option.title}>
                <h3>{option.title}</h3>
                <p>{option.body}</p>
              </article>
            ))}
          </div>
          <div className="pf-actions">
            <Link className="pf-btn pf-btn--primary" to="/pricing">{page.plans}</Link>
          </div>
        </div>
      </section>

      <section className="pf-section pf-light" id="definition">
        <div className="pf-wrap">
          <h2>{page.definition.title}</h2>
          <div className="pf-prose pf-lead">
            {page.definition.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 32)}>{paragraph}</p>)}
          </div>
          <ModuleMap labels={page.products.items.map((item) => item.title)} />
        </div>
      </section>

      <section className="pf-section pf-white" id="workflows">
        <div className="pf-wrap">
          <h2>{page.workflows.title}</h2>
          <p className="pf-lead">{page.workflows.lead}</p>
          {page.workflows.items.map((item, index) => (
            <article className={index % 2 ? "pf-split pf-split--flip" : "pf-split"} key={item.title}>
              <div className="pf-copy">
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
              <div className="pf-media">
                <LoopFilm
                  filmKey={item.key}
                  label={item.alt}
                  pauseLabel={page.pause}
                  playLabel={page.play}
                />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pf-section pf-light">
        <div className="pf-wrap">
          <h2>{page.benefits.title}</h2>
          <div className="pf-options pf-benefits">
            {page.benefits.items.map((item) => (
              <article className="pf-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-section pf-dark">
        <div className="pf-wrap">
          <h2>{page.audiences.title}</h2>
          <p className="pf-lead">{page.audiences.lead}</p>
          <div className="pf-options pf-audiences">
            {page.audiences.items.map((item) => (
              <article className="pf-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pf-section pf-white" id="faq">
        <div className="pf-wrap pf-faq">
          <h2>{page.faqTitle}</h2>
          {page.faq.map(([question, answer]) => (
            <details key={question}>
              <summary><h3>{question}</h3></summary>
              <p>{answer}</p>
            </details>
          ))}
          <h2>{page.related}</h2>
          <ul className="pf-links">
            {page.links.map(([to, label]) => (
              <li key={to}><Link to={to}>{label}</Link></li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
