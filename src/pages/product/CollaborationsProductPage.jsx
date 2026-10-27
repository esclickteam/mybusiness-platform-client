import React, { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { languageFromUrl } from "../../i18n/localeUtils";
import {
  COLLAB_CSS,
  collaborationsAlternates,
  collaborationsCanonical,
  collaborationsLanguage,
  getCollaborationsCopy,
} from "./collaborations/runtime.js";

function initials(name) {
  return String(name || "").split(/\s+/).slice(0, 2).map((part) => part[0] || "").join("").toUpperCase();
}

function CardGrid({ items, columns = 4 }) {
  return (
    <div className={`clx-grid clx-grid--${columns}`}>
      {items.map((item) => (
        <article className="clx-card" key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.text}</p>
        </article>
      ))}
    </div>
  );
}

function HeroStage({ copy }) {
  const business = copy.businesses[0];
  const messages = copy.chat.messages.slice(0, 2);
  return (
    <aside className="clx-stage" aria-label={copy.captions.hero}>
      <div className="clx-stage__bar">
        <span>{copy.ui.workspace}</span>
        <span className="clx-example">{copy.ui.example}</span>
      </div>
      <div className="clx-stage__body">
        <article className="clx-mini">
          <strong>{business.name}</strong>
          <p className="clx-meta">{business.field} · {business.area}</p>
          <p>{business.description}</p>
          <p className="clx-meta">{copy.ui.preferred}: {business.seeking}</p>
          <div className="clx-rowbtns" aria-hidden="true">
            <span>{copy.ui.profile}</span>
            <span className="is-primary">{copy.ui.sendProposal}</span>
            <span>{copy.ui.chat}</span>
          </div>
        </article>
        <div>
          <article className="clx-mini">
            <strong>{copy.proposals.sampleTitle}</strong>
            <p className="clx-meta">{copy.ui.from}: {copy.proposals.from}</p>
            <p className="clx-meta">{copy.ui.to}: {copy.proposals.to}</p>
            <span className="clx-status">{copy.ui.pending}</span>
          </article>
          <div className="clx-mini" style={{ marginTop: "0.85rem" }}>
            {messages.map((message) => (
              <p className={message.side === "a" ? "clx-bubble is-me" : "clx-bubble"} key={message.text}>{message.text}</p>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function CollaborationsProductPage() {
  const { i18n } = useTranslation();
  const lang = collaborationsLanguage(languageFromUrl() || i18n.resolvedLanguage || i18n.language);
  const copy = getCollaborationsCopy(lang);
  const dir = lang === "he" || lang === "ar" ? "rtl" : "ltr";
  const canonical = collaborationsCanonical(lang);
  const alternates = collaborationsAlternates();
  const schema = useMemo(() => {
    const faq = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: copy.faq.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    };
    const software = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Bizuply",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: canonical,
      description: copy.seo.description,
      inLanguage: lang,
    };
    return [faq, software];
  }, [canonical, copy, lang]);

  return (
    <div className="clx" lang={lang} dir={dir}>
      <style>{COLLAB_CSS}</style>
      <Helmet htmlAttributes={{ lang, dir }}>
        <title>{copy.seo.title}</title>
        <meta name="description" content={copy.seo.description} />
        <link rel="canonical" href={canonical} />
        {alternates.map((item) => (
          <link key={item.hrefLang} rel="alternate" hrefLang={item.hrefLang} href={item.href} />
        ))}
        <meta property="og:title" content={copy.seo.title} />
        <meta property="og:description" content={copy.seo.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:type" content="website" />
        {lang === "ar" ? (
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@500;700;800&display=swap" />
        ) : null}
        {schema.map((entry) => (
          <script key={`${entry["@type"]}-${entry.name || "page"}`} type="application/ld+json">
            {JSON.stringify(entry)}
          </script>
        ))}
      </Helmet>

      <header className="clx-hero">
        <div className="clx-shell clx-hero__grid">
          <div>
            <nav className="clx-crumb" aria-label="Breadcrumb">
              <Link to="/">{copy.home}</Link>
              <span aria-hidden="true">/</span>
              <span>{copy.crumb}</span>
            </nav>
            <p className="clx-kicker">{copy.hero.eyebrow}</p>
            <h1>{copy.hero.title}</h1>
            <p className="clx-lead">{copy.hero.description}</p>
            <div className="clx-actions">
              <a className="clx-btn clx-btn--solid" href="#discover">{copy.hero.primary}</a>
              <a className="clx-btn clx-btn--ghost" href="#how-to-start">{copy.hero.secondary}</a>
            </div>
            <ul className="clx-points">
              {copy.hero.points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
          <HeroStage copy={copy} />
        </div>
      </header>

      <section className="clx-section clx-section--white" id="discover">
        <div className="clx-shell">
          <h2>{copy.what.title}</h2>
          {copy.what.paragraphs.map((paragraph) => <p className="clx-copy" key={paragraph}>{paragraph}</p>)}
          <CardGrid items={copy.what.cards} />
        </div>
      </section>

      <section className="clx-section clx-section--ice">
        <div className="clx-shell">
          <h2>{copy.find.title}</h2>
          <p className="clx-lead">{copy.find.lead}</p>
          <CardGrid items={copy.find.examples} />
          <div className="clx-grid clx-grid--4">
            {copy.businesses.map((business) => (
              <article className="clx-biz" key={business.name}>
                <div className="clx-biz__top">
                  <strong>{business.name}</strong>
                  <span className="clx-mark" aria-hidden="true">{initials(business.name)}</span>
                </div>
                <p className="clx-meta">{copy.ui.category}: {business.field}</p>
                <p className="clx-meta">{copy.ui.area}: {business.area}</p>
                <p>{business.description}</p>
                <p className="clx-meta">{copy.ui.preferred}: {business.seeking}</p>
                <div className="clx-rowbtns" aria-hidden="true">
                  <span>{copy.ui.profile}</span>
                  <span className="is-primary">{copy.ui.sendProposal}</span>
                  <span>{copy.ui.chat}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="clx-note">{copy.find.note}</p>
          <p className="clx-caption">{copy.captions.partners}</p>
        </div>
      </section>

      <section className="clx-section clx-section--navy" id="opportunities">
        <div className="clx-shell">
          <h2>{copy.market.title}</h2>
          <p className="clx-lead">{copy.market.lead}</p>
          <CardGrid items={copy.market.types} />
          <div className="clx-grid clx-grid--2">
            {copy.listings.map((listing) => (
              <article className="clx-card" key={listing.title}>
                <p className="clx-example">{copy.ui.example}</p>
                <h3>{listing.title}</h3>
                <p>{listing.business}</p>
                <p>{listing.description}</p>
                <p className="clx-meta">{copy.ui.needs}</p>
                <div className="clx-chiprow">{listing.needs.map((item) => <span className="clx-chip" key={item}>{item}</span>)}</div>
                <p className="clx-meta">{copy.ui.offers}</p>
                <div className="clx-chiprow">{listing.offers.map((item) => <span className="clx-chip" key={item}>{item}</span>)}</div>
                <p className="clx-meta">{copy.ui.budget}: {listing.budget}</p>
                <p className="clx-meta">{copy.ui.expires}: {listing.expires}</p>
                <div className="clx-rowbtns" aria-hidden="true">
                  <span className="is-primary">{copy.ui.submitProposal}</span>
                  <span>{copy.ui.chat}</span>
                  <span>{copy.ui.profile}</span>
                </div>
              </article>
            ))}
          </div>
          <p className="clx-note">{copy.market.note}</p>
          <p className="clx-caption">{copy.captions.market}</p>
        </div>
      </section>

      <section className="clx-section clx-section--white" id="proposals">
        <div className="clx-shell">
          <h2>{copy.proposals.title}</h2>
          <p className="clx-lead">{copy.proposals.lead}</p>
          <CardGrid items={copy.proposals.cards} columns={3} />
          <article className="clx-stage" style={{ marginTop: "1.75rem" }}>
            <div className="clx-stage__bar">
              <span>{copy.ui.sent}</span>
              <span className="clx-example">{copy.ui.example}</span>
            </div>
            <div className="clx-stage__body">
              <article className="clx-mini">
                <strong>{copy.proposals.sampleTitle}</strong>
                <p className="clx-meta">{copy.ui.from}: {copy.proposals.from}</p>
                <p className="clx-meta">{copy.ui.to}: {copy.proposals.to}</p>
                <p>{copy.proposals.description}</p>
                <span className="clx-status">{copy.ui.pending}</span>
              </article>
            </div>
          </article>
          <p className="clx-note">{copy.proposals.statusNote}</p>
          <p className="clx-caption">{copy.captions.proposal}</p>
        </div>
      </section>

      <section className="clx-section clx-section--ice" id="chat">
        <div className="clx-shell">
          <h2>{copy.chat.title}</h2>
          <p className="clx-lead">{copy.chat.lead}</p>
          <CardGrid items={copy.chat.uses} />
          <article className="clx-stage" style={{ marginTop: "1.75rem" }}>
            <div className="clx-stage__bar">
              <span>{copy.ui.chat}</span>
              <span className="clx-example">{copy.ui.example}</span>
            </div>
            <div className="clx-mini" style={{ margin: "0.9rem" }}>
              {copy.chat.messages.map((message) => (
                <p className={message.side === "a" ? "clx-bubble is-me" : "clx-bubble"} key={message.text}>
                  <strong>{message.name}</strong><br />{message.text}
                </p>
              ))}
            </div>
          </article>
          <p className="clx-note">{copy.chat.note}</p>
          <p className="clx-caption">{copy.captions.chat}</p>
        </div>
      </section>

      <section className="clx-section clx-section--navy" id="how-to-start">
        <div className="clx-shell">
          <h2>{copy.start.title}</h2>
          <ol className="clx-steps">
            {copy.start.steps.map((step) => (
              <li key={step.title}><div><h3>{step.title}</h3><p>{step.text}</p></div></li>
            ))}
          </ol>
          <p className="clx-note">{copy.start.note}</p>
        </div>
      </section>

      <section className="clx-section clx-section--white">
        <div className="clx-shell">
          <h2>{copy.models.title}</h2>
          <CardGrid items={copy.models.items} columns={3} />
          <p className="clx-note">{copy.models.note}</p>
        </div>
      </section>

      <section className="clx-section clx-section--ice">
        <div className="clx-shell">
          <h2>{copy.small.title}</h2>
          <p className="clx-lead">{copy.small.lead}</p>
          <CardGrid items={copy.small.benefits} />
        </div>
      </section>

      <section className="clx-section clx-section--white">
        <div className="clx-shell">
          <h2>{copy.compare.title}</h2>
          <p className="clx-lead">{copy.compare.lead}</p>
          <div className="clx-table-wrap">
            <table className="clx-table">
              <caption>{copy.compare.note}</caption>
              <thead>
                <tr><th scope="col">{copy.compare.tool}</th><th scope="col">{copy.compare.purpose}</th></tr>
              </thead>
              <tbody>
                {copy.compare.rows.map((row) => (
                  <tr key={row.tool}><th scope="row">{row.tool}</th><td>{row.purpose}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="clx-section clx-section--navy">
        <div className="clx-shell">
          <h2>{copy.platform.title}</h2>
          <p className="clx-lead">{copy.platform.lead}</p>
          <div className="clx-grid clx-grid--3">
            {copy.platform.items.map((item) => (
              <article className="clx-card" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                <p>{item.href.startsWith("#") ? <a className="clx-inline" href={item.href}>{item.label}</a> : <Link className="clx-inline" to={item.href}>{item.label}</Link>}</p>
              </article>
            ))}
          </div>
          <p className="clx-saas">{copy.platform.saas} <Link to="/saas">{copy.platform.saasLabel}</Link></p>
          <div className="clx-actions">
            <Link className="clx-btn clx-btn--solid" to="/platform">{copy.platform.cta}</Link>
          </div>
        </div>
      </section>

      <section className="clx-section clx-section--white">
        <div className="clx-shell">
          <h2>{copy.choose.title}</h2>
          <p className="clx-lead">{copy.choose.lead}</p>
          <CardGrid items={copy.choose.criteria} columns={3} />
          <div className="clx-questions clx-question">
            <h3>{copy.choose.questionsTitle}</h3>
            <ol>{copy.choose.questions.map((question) => <li key={question}>{question}</li>)}</ol>
          </div>
        </div>
      </section>

      <section className="clx-section clx-section--ice" id="faq">
        <div className="clx-shell">
          <h2>{copy.faq.title}</h2>
          <div className="clx-faq">
            {copy.faq.items.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary><h3>{item.q}</h3></summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="clx-section clx-section--navy">
        <div className="clx-shell">
          <h2>{copy.cta.title}</h2>
          <p className="clx-lead">{copy.cta.text}</p>
          <div className="clx-actions">
            <a className="clx-btn clx-btn--solid" href="#opportunities">{copy.cta.primary}</a>
            <Link className="clx-btn clx-btn--ghost" to="/business">{copy.cta.secondary}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
