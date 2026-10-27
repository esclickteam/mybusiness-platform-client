import React, { useEffect, useId, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import {
  WB_MEDIA,
  WB_TEMPLATES,
  getWebsiteBuilderCopy,
} from "../../content/websiteBuilderCopy.mjs";
import { marketingPublicUrl, splitMarketingLocale } from "../../lib/localePath.mjs";
import "./websiteProductPage.css";

const HREFLANG = [
  ["en", "https://bizuply.com/website-builder"],
  ["he", "https://bizuply.com/he/website-builder"],
  ["es", "https://bizuply.com/es/website-builder"],
  ["pt-BR", "https://bizuply.com/pt-br/website-builder"],
  ["ar", "https://bizuply.com/ar/website-builder"],
];

function FaqItem({ question, answer, startOpen }) {
  const [open, setOpen] = useState(startOpen);
  return (
    <details open={open} onToggle={(event) => setOpen(event.currentTarget.open)}>
      <summary><h3>{question}</h3></summary>
      <p>{answer}</p>
    </details>
  );
}

function Forward() {
  return <ArrowRight className="wb-forward" size={17} aria-hidden="true" />;
}

function GrowthMark({ index }) {
  const marks = [
    <svg key="a" viewBox="0 0 64 64" aria-hidden="true"><rect x="8" y="14" width="48" height="34" rx="6" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M8 22h48" stroke="currentColor" strokeWidth="2" /></svg>,
    <svg key="b" viewBox="0 0 64 64" aria-hidden="true"><rect x="12" y="10" width="40" height="44" rx="8" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M22 28h20M22 36h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>,
    <svg key="c" viewBox="0 0 64 64" aria-hidden="true"><circle cx="18" cy="32" r="8" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="46" cy="20" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><circle cx="46" cy="46" r="7" fill="none" stroke="currentColor" strokeWidth="2" /><path d="M25 29l14-6M25 35l14 8" stroke="currentColor" strokeWidth="2" /></svg>,
    <svg key="d" viewBox="0 0 64 64" aria-hidden="true"><rect x="10" y="28" width="14" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="26" y="18" width="14" height="32" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /><rect x="42" y="10" width="12" height="40" rx="3" fill="none" stroke="currentColor" strokeWidth="2" /></svg>,
  ];
  return <span className="wb-mark">{marks[index]}</span>;
}

export default function WebsiteProductPage() {
  const locale = splitMarketingLocale(window.location.pathname).locale;
  const copy = getWebsiteBuilderCopy(locale);
  const [preview, setPreview] = useState(null);
  const previewTitleId = useId();
  const canonical = marketingPublicUrl("/website-builder", copy.locale);
  const typeImages = [WB_MEDIA.typeBusiness, WB_MEDIA.typeStore, WB_MEDIA.typeBooking];
  const screenShots = [
    ["desktop", WB_MEDIA.screenDesktop],
    ["tablet", WB_MEDIA.screenTablet],
    ["mobile", WB_MEDIA.screenMobile],
  ];

  useEffect(() => {
    document.title = copy.seoTitle;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", copy.seoDescription);
  }, [copy.seoTitle, copy.seoDescription]);

  useEffect(() => {
    if (!preview) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setPreview(null);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [preview]);

  return (
    <div className="wbp" dir={copy.dir} lang={copy.lang}>
      <Helmet>
        <html lang={copy.lang} dir={copy.dir} />
        <title>{copy.seoTitle}</title>
        <meta name="description" content={copy.seoDescription} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={copy.seoTitle} />
        <meta property="og:description" content={copy.seoDescription} />
        <meta property="og:url" content={canonical} />
        <link rel="preload" as="image" href={WB_MEDIA.heroDesktop} />
        {HREFLANG.map(([code, href]) => (
          <link key={code} rel="alternate" hrefLang={code} href={href} />
        ))}
        <link rel="alternate" hrefLang="x-default" href="https://bizuply.com/website-builder" />
      </Helmet>

      <nav className="wb-crumb" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Bizuply</Link></li>
          <li aria-current="page">{copy.crumb}</li>
        </ol>
      </nav>

      <section className="wb-hero">
        <div className="wb-shell wb-hero__grid">
          <div>
            <p className="wb-eyebrow">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className="wb-hero__lead">{copy.hero.description}</p>
            <div className="wb-actions">
              <Link className="wb-btn wb-btn--light" to="/register">{copy.hero.primary}<Forward /></Link>
              <a className="wb-btn wb-btn--ghost" href="#wb-templates">{copy.hero.secondary}</a>
            </div>
            <ul className="wb-points">
              {copy.hero.points.map((point) => (
                <li key={point}><Check size={16} aria-hidden="true" />{point}</li>
              ))}
            </ul>
          </div>
          <div className="wb-stage" dir="ltr">
            <figure className="wb-laptop">
              <div className="wb-laptop__screen">
                <img src={WB_MEDIA.heroDesktop} alt={copy.hero.desktopAlt} width="1440" height="900" />
              </div>
              <div className="wb-laptop__base" />
            </figure>
            <figure className="wb-phone">
              <div className="wb-phone__screen">
                <img src={WB_MEDIA.heroMobile} alt={copy.hero.mobileAlt} width="390" height="844" />
              </div>
            </figure>
          </div>
        </div>
      </section>

      <section className="wb-band wb-band--white" aria-labelledby="wb-about-title">
        <div className="wb-shell">
          <h2 id="wb-about-title">{copy.about.title}</h2>
          <p className="wb-prose">{copy.about.lead}</p>
          <p className="wb-prose">{copy.about.more}</p>
          <div className="wb-types">
            {copy.about.cards.map((card, index) => (
              <article className="wb-type" key={card.title}>
                <figure dir="ltr"><img src={typeImages[index]} alt={card.alt} width="1280" height="800" /></figure>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-band wb-band--mist" id="wb-editor" aria-labelledby="wb-editor-title">
        <div className="wb-shell">
          <h2 id="wb-editor-title">{copy.editor.title}</h2>
          <p className="wb-prose">{copy.editor.lead}</p>
          <div className="wb-editor">
            <ol>
              {copy.editor.items.map((item, index) => (
                <li key={item.title}><span>{index + 1}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>
              ))}
            </ol>
            <figure className="wb-editor-frame" dir="ltr">
              <img src={WB_MEDIA.editorStill} alt={copy.editor.stillAlt} width="1440" height="900" />
              <figcaption>{copy.editor.stillCaption}</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section className="wb-band wb-band--white" id="wb-templates" aria-labelledby="wb-templates-title">
        <div className="wb-shell">
          <h2 id="wb-templates-title">{copy.templates.title}</h2>
          <p className="wb-prose">{copy.templates.lead}</p>
          <div className="wb-gallery">
            {WB_TEMPLATES.map((template) => (
              <article className="wb-card" key={template.id}>
                <figure dir="ltr">
                  <img src={template.image} alt={`${template.name}. ${copy.templates.categories[template.category]}`} width="1440" height="900" />
                </figure>
                <div className="wb-card__body">
                  <h3>{template.name}</h3>
                  <p>{copy.templates.businessType}: {copy.templates.categories[template.category]}</p>
                  <button type="button" className="wb-text-btn" onClick={() => setPreview(template)}>
                    {copy.templates.preview}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-band wb-band--navy" aria-labelledby="wb-screens-title">
        <div className="wb-shell">
          <h2 id="wb-screens-title">{copy.screens.title}</h2>
          <p className="wb-prose wb-prose--light">{copy.screens.lead}</p>
          <p className="wb-note">{copy.screens.note}</p>
          <div className="wb-screens">
            {screenShots.map(([key, src]) => (
              <figure className={`wb-screen wb-screen--${key}`} key={key} dir="ltr">
                <img src={src} alt={copy.screens.alts[key]} />
                <figcaption>{copy.screens.labels[key]}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-band wb-band--white" aria-labelledby="wb-crm-title">
        <div className="wb-shell">
          <h2 id="wb-crm-title">{copy.crm.title}</h2>
          <p className="wb-prose">{copy.crm.lead}</p>
          <p className="wb-links">
            {copy.crm.linksLead}{" "}
            <Link to="/crm">{copy.crm.linkCrm}</Link>
            {" · "}
            <Link to="/appointments">{copy.crm.linkAppointments}</Link>
            {" · "}
            <Link to="/whatsapp-api">{copy.crm.linkWhatsapp}</Link>
            {" · "}
            <Link to="/automations">{copy.crm.linkAutomations}</Link>
          </p>
          <ol className="wb-flow">
            {copy.crm.steps.map((step, index) => (
              <li key={step}>
                <strong>{step}</strong>
                {index < copy.crm.steps.length - 1 ? <Forward /> : null}
              </li>
            ))}
          </ol>
          <div className="wb-types">
            {copy.crm.cards.map((card) => (
              <article className="wb-type wb-type--plain" key={card.title}>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="wb-band wb-band--mist" aria-labelledby="wb-growth-title">
        <div className="wb-shell">
          <h2 id="wb-growth-title">{copy.growth.title}</h2>
          <p className="wb-prose">{copy.growth.lead}</p>
          <div className="wb-growth">
            {copy.growth.items.map((item, index) => (
              <article key={item.title}>
                <GrowthMark index={index} />
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
          <p className="wb-links">
            <Link to="/features">{copy.growth.linkPlatform}</Link>
            {" · "}
            <Link to="/how-it-works">{copy.growth.linkHow}</Link>
            {" · "}
            <Link to="/guides">{copy.growth.linkGuides}</Link>
          </p>
        </div>
      </section>

      <section className="wb-band wb-band--ink" aria-labelledby="wb-paths-title">
        <div className="wb-shell">
          <h2 id="wb-paths-title">{copy.paths.title}</h2>
          <p className="wb-prose wb-prose--light">{copy.paths.lead}</p>
          <div className="wb-paths">
            <article>
              <h3>{copy.paths.self.title}</h3>
              <p>{copy.paths.self.text}</p>
              <ul>{copy.paths.self.items.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
              <a className="wb-btn wb-btn--light" href="#wb-editor">{copy.paths.self.cta}</a>
            </article>
            <article>
              <h3>{copy.paths.pro.title}</h3>
              <p>{copy.paths.pro.text}</p>
              <ul>{copy.paths.pro.items.map((item) => <li key={item}><Check size={16} aria-hidden="true" />{item}</li>)}</ul>
              <Link className="wb-btn wb-btn--ghost" to="/contact">{copy.paths.pro.cta}</Link>
            </article>
          </div>
          <p className="wb-note">{copy.paths.note}</p>
        </div>
      </section>

      <section className="wb-band wb-band--white" aria-labelledby="wb-compare-title">
        <div className="wb-shell">
          <h2 id="wb-compare-title">{copy.compare.title}</h2>
          <div className="wb-table-wrap">
            <table className="wb-table">
              <thead>
                <tr>{copy.compare.headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr>
              </thead>
              <tbody>
                {copy.compare.rows.map((row) => (
                  <tr key={row[0]}>
                    <th scope="row">{row[0]}</th>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wb-fine">{copy.compare.note}</p>
        </div>
      </section>

      <section className="wb-band wb-band--mist" aria-labelledby="wb-faq-title">
        <div className="wb-shell wb-faq">
          <h2 id="wb-faq-title">{copy.faq.title}</h2>
          {copy.faq.items.map(([question, answer], index) => (
            <FaqItem key={question} question={question} answer={answer} startOpen={index === 0} />
          ))}
        </div>
      </section>

      <section className="wb-final">
        <div className="wb-shell">
          <h2>{copy.final.title}</h2>
          <p>{copy.final.description}</p>
          <div className="wb-actions wb-actions--center">
            <Link className="wb-btn wb-btn--light" to="/register">{copy.final.primary}<Forward /></Link>
            <Link className="wb-btn wb-btn--ghost" to="/contact">{copy.final.secondary}</Link>
          </div>
        </div>
      </section>

      {preview ? (
        <div className="wb-modal" role="dialog" aria-modal="true" aria-labelledby={previewTitleId}>
          <button type="button" className="wb-modal__backdrop" aria-label={copy.templates.close} onClick={() => setPreview(null)} />
          <div className="wb-modal__panel" dir="ltr">
            <div className="wb-modal__bar">
              <h2 id={previewTitleId}>{preview.name}</h2>
              <button type="button" onClick={() => setPreview(null)}>{copy.templates.close}</button>
            </div>
            <iframe title={preview.name} src={`/embed/template/${preview.id}?mode=preview&lang=en`} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
