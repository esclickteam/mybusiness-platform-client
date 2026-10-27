import { useEffect, useId, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { showcaseCopy } from "../lib/homeShowcase.mjs";
import { normalizeMarketingLocale } from "../lib/localePathCore.mjs";
import "../styles/home-showcase.css";

const STRIP = [
  ["CRM", "/crm"],
  ["WhatsApp", "/whatsapp-api"],
  ["Marketing", "/meta-campaigns"],
  ["Websites", "/website-builder"],
  ["Automations", "/automations"],
  ["Appointments", "/appointments"],
  ["Agents", "/agents"],
  ["Collaborations", "/collaborations"],
] as const;

const FILMS = ["crm", "whatsapp", "campaigns", "websites"] as const;

function keptHero() {
  if (typeof document === "undefined") return false;
  return Boolean(
    document.querySelector("#bizuply-first-paint .home-hero") || document.querySelector("[data-kept-hero]"),
  );
}

function Film({
  id,
  label,
  pauseLabel,
  playLabel,
}: {
  id: string;
  label: string;
  pauseLabel: string;
  playLabel: string;
}) {
  const [paused, setPaused] = useState(false);
  const reactId = useId();
  useEffect(() => {
    const node = document.getElementById(reactId) as HTMLVideoElement | null;
    if (!node) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      node.pause();
      setPaused(true);
    }
    return undefined;
  }, [reactId]);
  return (
    <figure className={`hx-film hx-film--${id}`}>
      <video
        id={reactId}
        src={`/demo-media/home/${id}.mp4`}
        poster={`/demo-media/home/${id}.jpg`}
        muted
        playsInline
        loop
        autoPlay={!paused}
        preload="metadata"
        aria-label={label}
      />
      <button
        type="button"
        className="hx-film__pause"
        aria-pressed={paused}
        aria-controls={reactId}
        onClick={() => {
          const node = document.getElementById(reactId) as HTMLVideoElement | null;
          if (!node) return;
          if (node.paused) {
            void node.play();
            setPaused(false);
          } else {
            node.pause();
            setPaused(true);
          }
        }}
      >
        {paused ? playLabel : pauseLabel}
      </button>
    </figure>
  );
}

export default function HomeShowcase() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const copy = showcaseCopy(locale);
  const [watch, setWatch] = useState(false);
  const [step, setStep] = useState(0);
  const [skipHero, setSkipHero] = useState(false);

  useEffect(() => {
    setSkipHero(keptHero());
  }, []);

  useEffect(() => {
    if (!watch) return undefined;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setWatch(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [watch]);

  return (
    <div className="hx" dir={locale === "he" || locale === "ar" ? "rtl" : "ltr"}>
      {skipHero ? null : (
        <section className="home-hero hx-hero">
          <div className="hx-hero__wash" aria-hidden="true" />
          <div className="hx-hero__copy">
            <p className="hx-eyebrow">{copy.eyebrow}</p>
            <h1 className="home-hero__title">{copy.headline}</h1>
            <p className="home-hero__lead">{copy.description}</p>
            <div className="hx-hero__actions">
              <Link className="hx-btn hx-btn--navy" to="/platform">{copy.ctaPlatform}</Link>
              <Link className="hx-btn hx-btn--line" to="/saas">{copy.ctaSaas}</Link>
              <button type="button" className="hx-btn hx-btn--quiet" onClick={() => setWatch(true)}>
                {copy.ctaWatch}
              </button>
            </div>
          </div>
          <div className="hx-stage" aria-hidden="true">
            <div className="hx-stage__orb hx-stage__orb--a" />
            <div className="hx-stage__orb hx-stage__orb--b" />
            <article className="hx-window hx-window--crm">
              <header><i /><i /><i /><strong>CRM</strong></header>
              <ul>
                <li><b>Charlotte Davis</b><span>New</span></li>
                <li><b>Michael Anderson</b><span>Contacted</span></li>
                <li><b>Emily Parker</b><span>Interested</span></li>
              </ul>
            </article>
            <article className="hx-phone">
              <header>WhatsApp</header>
              <p>Hi Northwind, can we review the brand direction this week?</p>
              <p className="is-out">Thursday at 11:00 works. I will send a short agenda.</p>
            </article>
            <article className="hx-window hx-window--site">
              <img src="/demo-media/forms/lead.webp" alt="" width="640" height="400" />
            </article>
            <article className="hx-window hx-window--ads">
              <header>Campaign</header>
              <div className="hx-bars"><span /><span /><span /><span /></div>
            </article>
            <article className="hx-saas-chip">
              <em>SaaS</em>
              <strong>BeautyFlow</strong>
              <span>Beauty & Wellness</span>
            </article>
          </div>
        </section>
      )}

      <section className="hx-strip">
        <div className="hx-wrap">
          <h2>{copy.stripTitle}</h2>
          <p>{copy.stripLead}</p>
          <nav className="hx-strip__nav" aria-label={copy.stripTitle}>
            {STRIP.map(([label, href], index) => (
              <Link key={href} to={href} className={`hx-pill hx-pill--${index}`}>
                <i aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </section>

      <section className="hx-journey" id="hx-journey">
        <div className="hx-wrap hx-journey__grid">
          <div>
            <p className="hx-eyebrow hx-eyebrow--light">{copy.journeyEyebrow}</p>
            <h2>{copy.journeyTitle}</h2>
            <p>{copy.journeyLead}</p>
          </div>
          <ol className="hx-rail">
            {copy.journeySteps.map((label, index) => (
              <li key={label}>
                <button type="button" className={step === index ? "is-on" : ""} onClick={() => setStep(index)} aria-pressed={step === index}>
                  <span>0{index + 1}</span>
                  {label}
                </button>
                {index < copy.journeySteps.length - 1 ? <i aria-hidden="true" /> : null}
              </li>
            ))}
          </ol>
        </div>
      </section>

      {copy.products.map((product, index) => (
        <section key={product.href} className={`hx-band hx-band--${index % 2 ? "flip" : "base"} hx-band--${FILMS[index]}`}>
          <div className="hx-wrap hx-band__grid">
            <div>
              <p className="hx-eyebrow">{product.kicker}</p>
              <h2>{product.title}</h2>
              <p>{product.body}</p>
              <Link className="hx-btn hx-btn--navy" to={product.href}>{product.cta}</Link>
            </div>
            <Film id={FILMS[index]} label={product.title} pauseLabel={copy.pause} playLabel={copy.play} />
          </div>
        </section>
      ))}

      <section className="hx-saas">
        <div className="hx-wrap">
          <p className="hx-eyebrow">{copy.saasEyebrow}</p>
          <div className="hx-saas__head">
            <h2>{copy.saasTitle}</h2>
            <p>{copy.saasLead}</p>
          </div>
          <div className="hx-saas__actions">
            <Link className="hx-btn hx-btn--navy" to="/saas">{copy.saasMarket}</Link>
            <Link className="hx-btn hx-btn--line" to="/solutions/ready-systems">{copy.saasHow}</Link>
          </div>
          <div className="hx-saas__grid">
            {copy.saasItems.map(([slug, name, industry, blurb]) => (
              <article key={slug} className={`hx-saas-card hx-saas-card--${slug}`}>
                <div className="hx-saas-card__art" aria-hidden="true"><span>{name.slice(0, 1)}</span></div>
                <p>{industry}</p>
                <h3>{name}</h3>
                <p>{blurb}</p>
                <Link to={`/saas/${slug}`}>{copy.saasChoose}</Link>
              </article>
            ))}
          </div>
          <p className="hx-note">{copy.saasNote}</p>
        </div>
      </section>

      <section className="hx-path">
        <div className="hx-wrap">
          <h2>{copy.pathTitle}</h2>
          <p>{copy.pathLead}</p>
          <ol>
            {copy.pathSteps.map(([title, body], index) => (
              <li key={title}>
                <span>0{index + 1}</span>
                <h3>{title}</h3>
                <p>{body}</p>
              </li>
            ))}
          </ol>
          <p className="hx-note hx-note--light">{copy.pathNote}</p>
        </div>
      </section>

      <section className="hx-templates">
        <div className="hx-wrap">
          <p className="hx-eyebrow">{copy.templatesEyebrow}</p>
          <h2>{copy.templatesTitle}</h2>
          <p>{copy.templatesLead}</p>
          <div className="hx-templates__grid">
            {copy.templateCards.map(([title, body], index) => (
              <article key={title} className={`hx-template hx-template--${index}`}>
                {index === 4 ? <img src="/demo-media/sites/ido-card.jpg" alt="" /> : null}
                {index === 5 ? <img src="/demo-media/websites/my-sites.jpg" alt="" /> : null}
                <div className="hx-template__mini" aria-hidden="true" />
                <h3>{title}</h3>
                <p>{body}</p>
                <Link to="/website-builder">{copy.templatesCta}</Link>
              </article>
            ))}
          </div>
          <Link className="hx-btn hx-btn--navy" to="/website-builder">{copy.templatesCta}</Link>
          <aside className="hx-help">
            <h3>{copy.templatesHelpTitle}</h3>
            <p>{copy.templatesHelp}</p>
            <Link to="/services/website-build">{copy.templatesHelpCta}</Link>
          </aside>
        </div>
      </section>

      <section className="hx-industries">
        <div className="hx-wrap">
          <h2>{copy.industriesTitle}</h2>
          <p>{copy.industriesLead}</p>
          <div className="hx-industries__grid">
            {copy.industryCards.map(([title, body, href]) => (
              <Link key={title} to={href} className="hx-industry">
                <h3>{title}</h3>
                <p>{body}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="hx-more">
        <div className="hx-wrap">
          <h2>{copy.moreTitle}</h2>
          <p>{copy.moreLead}</p>
          <div className="hx-more__grid">
            {copy.moreCards.map(([title, body, cta, href]) => (
              <article key={href + title}>
                <h3>{title}</h3>
                <p>{body}</p>
                <Link to={href}>{cta}</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hx-why">
        <div className="hx-wrap">
          <h2>{copy.whyTitle}</h2>
          <div className="hx-why__grid">
            <div className="hx-why__split" aria-hidden="true">
              <span>CRM</span>
              <span>WhatsApp</span>
              <span>Site</span>
              <b>Bizuply</b>
            </div>
            <div>
              {copy.whyCards.map(([title, body]) => (
                <article key={title}>
                  <h3>{title}</h3>
                  <p>{body}</p>
                </article>
              ))}
              <p className="hx-note">{copy.whyNote}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="hx-price">
        <div className="hx-wrap">
          <h2>{copy.priceTitle}</h2>
          <div className="hx-price__grid">
            {copy.priceCards.map(([title, price, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <strong>{price}</strong>
                <p>{body}</p>
              </article>
            ))}
          </div>
          <Link className="hx-btn hx-btn--navy" to="/pricing">{copy.priceCta}</Link>
        </div>
      </section>

      <section className="hx-guides">
        <div className="hx-wrap">
          <h2>{copy.guidesTitle}</h2>
          <p>{copy.guidesLead}</p>
          <div className="hx-guides__grid">
            {copy.guideCards.map(([title, body, href], index) => (
              <Link key={href} to={href} className={`hx-guide hx-guide--${index}`}>
                <h3>{title}</h3>
                <p>{body}</p>
              </Link>
            ))}
          </div>
          <Link className="hx-btn hx-btn--line" to="/guides">{copy.guidesCta}</Link>
        </div>
      </section>

      <section className="hx-faq">
        <div className="hx-wrap hx-faq__wrap">
          <h2>{copy.faqTitle}</h2>
          <p>{copy.faqLead}</p>
          {copy.faq.map(([question, answer]) => (
            <details key={question}>
              <summary><h3>{question}</h3></summary>
              <p>{answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="hx-final">
        <div className="hx-wrap">
          <h2>{copy.finalTitle}</h2>
          <p>{copy.finalLead}</p>
          <div className="hx-hero__actions">
            <Link className="hx-btn hx-btn--light" to="/register">{copy.finalStart}</Link>
            <Link className="hx-btn hx-btn--ghost" to="/saas">{copy.finalSaas}</Link>
          </div>
        </div>
      </section>

      {watch ? (
        <div className="hx-watch" role="dialog" aria-modal="true" aria-labelledby="hx-watch-title">
          <button type="button" className="hx-watch__backdrop" aria-label={copy.watchClose} onClick={() => setWatch(false)} />
          <div className="hx-watch__panel">
            <h2 id="hx-watch-title">{copy.watchTitle}</h2>
            <p>{copy.watchBody}</p>
            <ol>
              {copy.journeySteps.map((label) => <li key={label}>{label}</li>)}
            </ol>
            <button type="button" className="hx-btn hx-btn--navy" onClick={() => setWatch(false)}>{copy.watchClose}</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
