import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import { getCrmLeadArticle } from "../../lib/crmLeadGuide.mjs";
import "./crmLeadGuide.css";

const PUBLISHED = "2026-10-29";
const MEDIA = "/guides/crm-lead-management";

function readingMinutes(article) {
  const chunks = [];
  const walk = (section) => {
    chunks.push(section.heading || "", ...(section.paragraphs || []), ...(section.steps || []));
    (section.subsections || []).forEach(walk);
    (section.faq || []).forEach(([q, a]) => chunks.push(q, a));
  };
  (article.sections || []).forEach(walk);
  (article.faq || []).forEach(([q, a]) => chunks.push(q, a));
  const words = chunks.join(" ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(8, Math.round(words / 180));
}

function tocItems(sections) {
  const items = [];
  sections.forEach((section) => {
    items.push({ id: section.id, heading: section.heading, level: 2 });
    (section.subsections || []).forEach((sub) => items.push({ id: sub.id, heading: sub.heading, level: 3 }));
  });
  return items;
}

function Figure({ shot }) {
  if (!shot) return null;
  return (
    <figure className="lg-shot">
      <img src={`${MEDIA}/${shot.file}`} alt={shot.alt} width={1440} height={900} loading="lazy" decoding="async" />
      <figcaption><strong>{shot.title}</strong> {shot.caption}</figcaption>
    </figure>
  );
}

function Film({ film, locale, transcriptLabel }) {
  if (!film) return null;
  const lang = locale === "pt-BR" ? "pt-BR" : locale;
  return (
    <figure className="lg-film" id={film.id}>
      <video controls preload="metadata" poster={`${MEDIA}/${film.poster}`} width={1440} height={900}>
        <source src={`${MEDIA}/${film.file}`} type="video/mp4" />
        <track kind="captions" srcLang={lang} src={`${MEDIA}/${film.file.replace(".mp4", `.${locale}.vtt`)}`} label={transcriptLabel} default />
      </video>
      <figcaption>
        <strong>{film.title}</strong>
        <span> {film.caption}</span>
      </figcaption>
      <details className="lg-transcript">
        <summary>{transcriptLabel}</summary>
        <p>{film.transcript}</p>
      </details>
    </figure>
  );
}

function Journey({ model }) {
  const [active, setActive] = useState(0);
  const step = model.steps[active];
  return (
    <div className="lg-panel">
      <div className="lg-path" role="tablist" aria-label={model.label}>
        {model.steps.map((item, index) => (
          <button key={item.title} type="button" role="tab" aria-selected={index === active} aria-pressed={index === active} onClick={() => setActive(index)}>
            {item.title}
          </button>
        ))}
      </div>
      <div role="tabpanel">
        <h3>{step.title}</h3>
        <p>{step.body}</p>
        <p><strong>{model.exampleLabel}</strong> {step.example}</p>
      </div>
    </div>
  );
}

function Calculator({ model }) {
  const [leads, setLeads] = useState("100");
  const [customers, setCustomers] = useState("10");
  const result = useMemo(() => {
    const leadCount = Number(leads);
    const customerCount = Number(customers);
    if (leads.trim() === "" || customers.trim() === "" || !Number.isFinite(leadCount) || !Number.isFinite(customerCount)) {
      return { error: model.invalid };
    }
    if (leadCount < 0 || customerCount < 0) return { error: model.invalid };
    if (leadCount === 0) return { error: model.zero };
    const rate = (customerCount / leadCount) * 100;
    return { rate: `${rate.toLocaleString(undefined, { maximumFractionDigits: 1 })}%` };
  }, [leads, customers, model]);
  return (
    <form className="lg-calc" onSubmit={(event) => event.preventDefault()}>
      <p>{model.intro}</p>
      <label>
        {model.leads}
        <input inputMode="decimal" value={leads} onChange={(event) => setLeads(event.target.value)} />
      </label>
      <label>
        {model.customers}
        <input inputMode="decimal" value={customers} onChange={(event) => setCustomers(event.target.value)} />
      </label>
      {result.error ? <p className="lg-warn" role="alert">{result.error}</p> : <p className="lg-result" aria-live="polite">{model.result}: {result.rate}</p>}
      <p>{model.note}</p>
    </form>
  );
}

function Compare({ model }) {
  return (
    <div className="lg-compare">
      {model.scenes.map((scene) => (
        <article key={scene.title} className={`lg-scene ${scene.ordered ? "lg-scene--ordered" : ""}`}>
          <h3>{scene.title}</h3>
          <p>{scene.body}</p>
        </article>
      ))}
    </div>
  );
}

function Block({ section, locale, transcriptLabel }) {
  const Tag = section.band ? "section" : "section";
  return (
    <Tag className={section.band ? "lg-band" : undefined} id={section.id} aria-labelledby={`${section.id}-title`}>
      <div className="lg-prose">
        <h2 id={`${section.id}-title`}>{section.heading}</h2>
        {(section.paragraphs || []).map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
        {section.callout ? <p className="lg-callout"><strong>{section.callout}</strong></p> : null}
        {section.steps?.length ? <ol className="lg-steps">{section.steps.map((step) => <li key={step.slice(0, 40)}>{step}</li>)}</ol> : null}
      </div>
      {section.widget === "journey" ? <Journey model={section.model} /> : null}
      {section.widget === "calculator" ? <Calculator model={section.model} /> : null}
      {section.widget === "compare" ? <Compare model={section.model} /> : null}
      {section.table ? (
        <div className="lg-table-wrap">
          <table className="lg-table">
            <thead><tr>{section.table.columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr></thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row[0]}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
          {section.table.note ? <p className="lg-caption">{section.table.note}</p> : null}
        </div>
      ) : null}
      {(section.subsections || []).map((sub) => (
        <div className="lg-prose" key={sub.id} id={sub.id}>
          <h3>{sub.heading}</h3>
          {(sub.paragraphs || []).map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
          {sub.steps?.length ? <ol className="lg-steps">{sub.steps.map((step) => <li key={step.slice(0, 40)}>{step}</li>)}</ol> : null}
        </div>
      ))}
      {(section.shots || []).map((shot) => <Figure key={shot.file} shot={shot} />)}
      {(section.films || []).map((film) => <Film key={film.file} film={film} locale={locale} transcriptLabel={transcriptLabel} />)}
      {section.links?.length ? (
        <p className="lg-links">
          {section.links.map((link) => link.href.startsWith("http")
            ? <a key={link.href} href={link.href}>{link.label}</a>
            : <Link key={link.href} to={link.href}>{link.label}</Link>)}
        </p>
      ) : null}
    </Tag>
  );
}

export default function CrmLeadGuidePage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const article = getCrmLeadArticle(locale);
  const minutes = readingMinutes(article);
  const items = tocItems(article.sections);
  const canonical = marketingPublicUrl("/guides/crm-lead-management", locale);
  const htmlLang = locale === "pt-BR" ? "pt-BR" : locale;
  useEffect(() => {
    document.title = article.title;
  }, [article.title]);
  return (
    <article className="lg lg-motion" dir={dir} lang={htmlLang}>
      <Helmet>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <header className="lg-hero">
        <div>
          <p className="lg-kicker">Bizuply</p>
          <h1>{article.h1}</h1>
          <p className="lg-dek">{article.dek}</p>
          <ul className="lg-meta">
            <li>{article.ui.publisher}</li>
            <li><time dateTime={PUBLISHED}>{article.ui.published}</time></li>
            <li>{article.ui.minutes.replace("{n}", String(minutes))}</li>
            <li><a href="#contents">{article.ui.toc}</a></li>
          </ul>
          <div className="lg-actions">
            <a className="lg-btn lg-btn--solid" href="#what-is-crm">{article.ui.start}</a>
            <a className="lg-btn lg-btn--ghost" href="#film-intro">{article.ui.watch}</a>
          </div>
        </div>
        <figure>
          <div className="lg-frame">
            <img src={`${MEDIA}/leads-workspace.webp`} alt={article.hero.alt} width={1440} height={900} fetchPriority="high" decoding="async" />
          </div>
          <figcaption><strong>{article.hero.title}</strong> {article.hero.caption}</figcaption>
        </figure>
      </header>
      <details className="lg-toc-mobile">
        <summary>{article.ui.toc}</summary>
        <ol>
          {items.map((item) => <li key={item.id}><a href={`#${item.id}`}>{item.heading}</a></li>)}
        </ol>
      </details>
      <div className="lg-layout" id="contents">
        <nav className="lg-toc" aria-label={article.ui.toc}>
          <p>{article.ui.toc}</p>
          <ol>
            {items.map((item) => (
              <li key={item.id} className={item.level === 3 ? "is-h3" : undefined}>
                <a href={`#${item.id}`}>{item.heading}</a>
              </li>
            ))}
          </ol>
        </nav>
        <div>
          {article.sections.map((section) => (
            <Block key={section.id} section={section} locale={locale} transcriptLabel={article.ui.transcript} />
          ))}
          <section className="lg-faq" id="faq">
            <h2>{article.ui.faq}</h2>
            {article.faq.map(([question, answer]) => (
              <details key={question}>
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
        </div>
      </div>
    </article>
  );
}
