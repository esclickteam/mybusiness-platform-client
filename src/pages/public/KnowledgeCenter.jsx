import React, { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import {
  clusterLabel,
  connectionLinks,
  guideCards,
  industryLinks,
  kindLabel,
  knowledgePage,
  knowledgeUi,
  learningPaths,
  templateFiles,
} from "../../lib/knowledgeHub.mjs";
import { glossaryPage } from "../../lib/glossaryContent.mjs";
import { compareIndex, getCompare } from "../../lib/compareContent.mjs";
import API from "../../api";
import "./knowledgeCenter.css";

function Shell({ path, children }) {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const ui = knowledgeUi(locale);
  const page = knowledgePage(path, locale);
  const dir = getTextDirection(locale);
  if (!page) {
    return (
      <main className="knowledge-page" dir={dir}>
        <h1>{ui.home}</h1>
        <Link to="/resources">{ui.library}</Link>
      </main>
    );
  }
  return (
    <main className="knowledge-page" dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={marketingPublicUrl(path, locale)} />
      </Helmet>
      <header className="knowledge-mast">
        <nav className="knowledge-crumbs" aria-label="Breadcrumb">
          <Link to="/">{ui.home}</Link>
          <span aria-hidden="true">/</span>
          {path === "/resources" ? <span>{ui.library}</span> : <Link to="/resources">{ui.library}</Link>}
          {path === "/resources" ? null : (
            <>
              <span aria-hidden="true">/</span>
              <span>{page.crumb}</span>
            </>
          )}
        </nav>
        <p className="knowledge-kicker">{ui.kicker}</p>
        <h1>{page.h1}</h1>
        <p>{page.lede || page.description}</p>
      </header>
      {children(locale, ui, page)}
    </main>
  );
}

function Card({ item, ui }) {
  return (
    <article className="knowledge-card">
      {item.poster ? <img src={item.poster} alt={item.alt} /> : null}
      <div>
        <p className="knowledge-meta">{item.kindLabel}</p>
        <h2><Link to={item.href}>{item.title}</Link></h2>
        <p>{item.description}</p>
        <p className="knowledge-meta">
          {item.minutes ? `${item.minutes} ${ui.minutes}` : item.kindLabel}
          {item.updated ? ` · ${ui.updated} ${item.updated}` : ""}
        </p>
      </div>
    </article>
  );
}

export function ResourceHubPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const ui = knowledgeUi(locale);
  const [query, setQuery] = useState("");
  const [cluster, setCluster] = useState("all");
  const [kind, setKind] = useState("all");
  const [published, setPublished] = useState([]);
  useEffect(() => {
    let active = true;
    API.get(`/knowledge/articles?locale=${encodeURIComponent(locale)}`)
      .then((response) => {
        if (active) setPublished(response.data?.articles || []);
      })
      .catch(() => {
        if (active) setPublished([]);
      });
    return () => {
      active = false;
    };
  }, [locale]);
  const cards = useMemo(() => {
    const guides = guideCards(locale).map((card) => ({
      ...card,
      kindLabel: kindLabel("guide", locale),
    }));
    const library = [
      { kind: "glossary", cluster: "", href: "/glossary", title: knowledgePage("/glossary", locale).h1, description: knowledgePage("/glossary", locale).description, updated: "2026-11-15", kindLabel: kindLabel("glossary", locale) },
      { kind: "template", cluster: "", href: "/templates", title: knowledgePage("/templates", locale).h1, description: knowledgePage("/templates", locale).description, updated: "2026-11-15", kindLabel: kindLabel("template", locale) },
      { kind: "comparison", cluster: "", href: "/compare", title: knowledgePage("/compare", locale).h1, description: knowledgePage("/compare", locale).description, updated: "2026-11-15", kindLabel: kindLabel("comparison", locale) },
      { kind: "path", cluster: "", href: "/academy", title: knowledgePage("/academy", locale).h1, description: knowledgePage("/academy", locale).description, updated: "2026-11-15", kindLabel: kindLabel("path", locale) },
    ];
    return [...library, ...guides];
  }, [locale]);
  const publishedCards = published.map((article) => ({
    kind: "guide",
    cluster: "",
    href: `/resources/a/${article.slug}`,
    title: article.h1 || article.title,
    description: article.description || "",
    updated: article.updated || "",
    kindLabel: kindLabel("guide", locale),
  }));
  const visibleCards = [...publishedCards, ...cards];
  const fresh = visibleCards.filter((card) => card.kind !== "guide").slice(0, 4);
  const start = cards.filter((card) => card.start);
  const needle = query.trim().toLowerCase();
  const filtered = visibleCards.filter((card) => {
    if (cluster !== "all" && card.cluster !== cluster) return false;
    if (kind !== "all" && card.kind !== kind) return false;
    if (!needle) return true;
    return `${card.title} ${card.description}`.toLowerCase().includes(needle);
  });
  const clusters = ["all", "crm", "whatsapp", "automations", "websites", "campaigns", "appointments"];
  const kinds = ["all", "guide", "template", "comparison", "glossary", "path"];
  return (
    <Shell path="/resources">
      {() => (
        <>
          <section className="knowledge-tools" aria-label={ui.search}>
            <label htmlFor="library-search">{ui.search}</label>
            <input id="library-search" type="search" value={query} placeholder={ui.searchPlaceholder} onChange={(event) => setQuery(event.target.value)} />
            <p className="knowledge-meta">{ui.topics}</p>
            <div className="knowledge-chips" role="group" aria-label={ui.topics}>
              {clusters.map((id) => (
                <button key={id} type="button" aria-pressed={cluster === id} onClick={() => setCluster(id)}>{clusterLabel(id, locale)}</button>
              ))}
            </div>
            <p className="knowledge-meta">{ui.types}</p>
            <div className="knowledge-chips" role="group" aria-label={ui.types}>
              {kinds.map((id) => (
                <button key={id} type="button" aria-pressed={kind === id} onClick={() => setKind(id)}>{kindLabel(id, locale)}</button>
              ))}
            </div>
          </section>
          {!needle && cluster === "all" && kind === "all" ? (
            <>
              <section className="knowledge-section">
                <h2>{ui.start}</h2>
                <ul className="knowledge-grid">
                  {start.map((item) => <li key={item.href}><Card item={item} ui={ui} /></li>)}
                </ul>
              </section>
              <section className="knowledge-section">
                <h2>{ui.fresh}</h2>
                <ul className="knowledge-grid">
                  {fresh.map((item) => <li key={item.href}><Card item={item} ui={ui} /></li>)}
                </ul>
              </section>
            </>
          ) : null}
          <section className="knowledge-section">
            <h2>{ui.guides}</h2>
            {filtered.length ? (
              <ul className="knowledge-grid">
                {filtered.map((item) => <li key={item.href}><Card item={item} ui={ui} /></li>)}
              </ul>
            ) : <p>{ui.empty}</p>}
          </section>
          <section className="knowledge-section">
            <h2>{ui.industriesTitle}</h2>
            <p>{ui.industriesBody}</p>
            <ul className="knowledge-links">
              {industryLinks(locale).map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}
            </ul>
          </section>
          <section className="knowledge-section">
            <h2>{ui.connectionsTitle}</h2>
            <p>{ui.connectionsBody}</p>
            <ul className="knowledge-links">
              {connectionLinks(locale).map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}
            </ul>
          </section>
        </>
      )}
    </Shell>
  );
}

export function GlossaryPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const page = glossaryPage(locale);
  const ui = knowledgeUi(locale);
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const terms = page.terms.filter((term) => !needle || `${term.term} ${term.definition} ${term.practice}`.toLowerCase().includes(needle));
  return (
    <Shell path="/glossary">
      {() => (
        <div className="knowledge-prose">
          <label htmlFor="glossary-search">{ui.search}</label>
          <input id="glossary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} />
          <ul className="knowledge-links">
            {terms.map((term) => <li key={term.id}><a href={`#${term.id}`}>{term.term}</a></li>)}
          </ul>
          {terms.map((term) => (
            <article className="knowledge-term" id={term.id} key={term.id}>
              <h2>{term.term}</h2>
              <h3>{ui.definition}</h3>
              <p>{term.definition}</p>
              <h3>{ui.practice}</h3>
              <p>{term.practice}</p>
              <h3>{ui.example}</h3>
              <p>{term.example}</p>
              <ul className="knowledge-links">
                {term.links.map((link) => <li key={link.href}><Link to={link.href}>{link.label}</Link></li>)}
              </ul>
            </article>
          ))}
          {!terms.length ? <p>{ui.empty}</p> : null}
        </div>
      )}
    </Shell>
  );
}

function parseNonNegative(value) {
  if (value === "") return null;
  const number = Number(value);
  if (!Number.isFinite(number) || number < 0) return null;
  return number;
}

function Calculator({ title, body, fields, compute, ui }) {
  const [raw, setRaw] = useState(() => fields.map(() => ""));
  const values = raw.map((value) => parseNonNegative(value));
  const complete = raw.every((value) => value !== "");
  const ready = values.every((value) => value !== null);
  const output = complete && ready ? compute(values) : null;
  return (
    <section className="knowledge-calc">
      <h3>{title}</h3>
      <p>{body}</p>
      {fields.map((field, index) => (
        <label key={field}>
          {field}
          <input
            inputMode="decimal"
            value={raw[index]}
            onChange={(event) => {
              const next = raw.slice();
              next[index] = event.target.value;
              setRaw(next);
            }}
          />
        </label>
      ))}
      <p className="knowledge-result" role="status">
        {complete && output == null ? ui.undefinedRate : output || ""}
      </p>
    </section>
  );
}

function formatPercent(value) {
  return `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(value)}%`;
}

export function TemplatesPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const ui = knowledgeUi(locale);
  const page = knowledgePage("/templates", locale);
  return (
    <Shell path="/templates">
      {() => (
        <>
          <section className="knowledge-section">
            <h2>{ui.files}</h2>
            <ul className="knowledge-grid">
              {templateFiles(locale).map((file) => (
                <li key={file.file}>
                  <article className="knowledge-card">
                    <div>
                      <h3>{file.title}</h3>
                      <p>{file.body}</p>
                      <a href={file.file} download={file.name}>{ui.download}</a>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </section>
          <section className="knowledge-section">
            <h2>{ui.calculators}</h2>
            <Calculator
              title={ui.conversionTitle}
              body={ui.conversionBody}
              fields={[ui.conversions, ui.visitors]}
              ui={ui}
              compute={([conversions, opportunities]) => (opportunities > 0 ? formatPercent((conversions / opportunities) * 100) : null)}
            />
            <Calculator
              title={ui.costTitle}
              body={ui.costBody}
              fields={[ui.spend, ui.leads]}
              ui={ui}
              compute={([spend, leads]) => (leads > 0 ? `${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(spend / leads)} ${ui.perLead}` : null)}
            />
            <Calculator
              title={ui.roiTitle}
              body={ui.roiBody}
              fields={[ui.revenue, ui.spend]}
              ui={ui}
              compute={([revenue, spend]) => {
                if (spend <= 0) return null;
                const roi = ((revenue - spend) / spend) * 100;
                const roas = revenue / spend;
                return `${formatPercent(roi)} · ${ui.roas} ${new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(roas)}`;
              }}
            />
          </section>
          <section className="knowledge-prose">
            <h2>{ui.faq}</h2>
            {page.faq.map(([question, answer]) => (
              <div key={question}>
                <h3>{question}</h3>
                <p>{answer}</p>
              </div>
            ))}
          </section>
        </>
      )}
    </Shell>
  );
}

export function CompareIndexPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const page = compareIndex(locale);
  return (
    <Shell path="/compare">
      {() => (
        <div className="knowledge-prose">
          <ul className="knowledge-links">
            {page.pages.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.h1}</Link>
                <p>{item.description}</p>
              </li>
            ))}
          </ul>
          <h2>{page.integrated.title}</h2>
          <p>{page.integrated.description}</p>
          <p><Link to={page.integrated.href}>{page.integrated.title}</Link></p>
        </div>
      )}
    </Shell>
  );
}

export function CompareArticlePage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const ui = knowledgeUi(locale);
  const article = getCompare(slug, locale);
  if (!article) {
    return (
      <main className="knowledge-page" dir={getTextDirection(locale)}>
        <h1>{ui.home}</h1>
        <Link to="/compare">{ui.library}</Link>
      </main>
    );
  }
  return (
    <Shell path={article.path}>
      {() => (
        <article className="knowledge-prose">
          <nav aria-label={ui.onThisPage}>
            <ol className="knowledge-steps">
              {article.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.heading}</a></li>)}
            </ol>
          </nav>
          {article.sections.map((section) => (
            <section id={section.id} key={section.id}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
              {section.steps?.length ? <ol className="knowledge-steps">{section.steps.map((step) => <li key={step}>{step}</li>)}</ol> : null}
              {section.mistakes?.map((item) => (
                <p key={item.problem}><strong>{item.problem}</strong> {item.fix}</p>
              ))}
              {section.table?.rows?.length ? (
                <table className="knowledge-table">
                  <thead><tr>{section.table.columns.map((column) => <th key={column}>{column}</th>)}</tr></thead>
                  <tbody>
                    {section.table.rows.map((line) => <tr key={line.join("|")}>{line.map((cell) => <td key={cell}>{cell}</td>)}</tr>)}
                  </tbody>
                </table>
              ) : null}
            </section>
          ))}
          <h2>{ui.related}</h2>
          <ul className="knowledge-links">
            {article.related.map((item) => <li key={item.href}><Link to={item.href}>{item.label}</Link></li>)}
          </ul>
          <h2>{ui.faq}</h2>
          {article.faq.map(([question, answer]) => (
            <div key={question}><h3>{question}</h3><p>{answer}</p></div>
          ))}
        </article>
      )}
    </Shell>
  );
}

function PublishedArticleBody({ slug, locale }) {
  const ui = knowledgeUi(locale);
  const [article, setArticle] = useState(null);
  const [missing, setMissing] = useState(false);
  useEffect(() => {
    let active = true;
    API.get(`/knowledge/articles/${encodeURIComponent(locale)}/${encodeURIComponent(slug || "")}`)
      .then((response) => {
        if (active) setArticle(response.data?.article || null);
      })
      .catch(() => {
        if (active) setMissing(true);
      });
    return () => {
      active = false;
    };
  }, [locale, slug]);
  if (missing || (article && !article.h1)) {
    return (
      <main className="knowledge-page" dir={getTextDirection(locale)}>
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        <h1>{ui.home}</h1>
        <Link to="/resources">{ui.library}</Link>
      </main>
    );
  }
  if (!article) {
    return <main className="knowledge-page" dir={getTextDirection(locale)}><p>{ui.library}</p></main>;
  }
  return (
    <main className="knowledge-page" dir={getTextDirection(locale)} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{article.title || article.h1}</title>
        <meta name="description" content={article.description || ""} />
        <link rel="canonical" href={marketingPublicUrl(`/resources/a/${article.slug}`, locale)} />
      </Helmet>
      <header className="knowledge-mast">
        <nav className="knowledge-crumbs" aria-label="Breadcrumb">
          <Link to="/">{ui.home}</Link>
          <span aria-hidden="true">/</span>
          <Link to="/resources">{ui.library}</Link>
        </nav>
        <h1>{article.h1}</h1>
        <p>{article.lede || article.description}</p>
      </header>
      <article className="knowledge-prose">
        {(article.sections || []).map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {(section.paragraphs || []).map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
          </section>
        ))}
        {(article.faq || []).length ? <h2>{ui.faq}</h2> : null}
        {(article.faq || []).map((pair) => (
          <div key={pair[0]}><h3>{pair[0]}</h3><p>{pair[1]}</p></div>
        ))}
      </article>
    </main>
  );
}

export function PublishedArticlePage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  return <PublishedArticleBody key={`${locale}:${slug || ""}`} slug={slug || ""} locale={locale} />;
}

export function LearningPathsPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const ui = knowledgeUi(locale);
  const paths = learningPaths(locale);
  return (
    <Shell path="/academy">
      {() => (
        <div className="knowledge-prose">
          {paths.map((path) => (
            <section id={path.id} key={path.id}>
              <h2>{path.title}</h2>
              <p>{path.body}</p>
              <ol className="knowledge-steps">
                {path.steps.map((step, index) => (
                  <li key={step.href}>{index ? `${ui.next}: ` : ""}<Link to={step.href}>{step.title}</Link></li>
                ))}
              </ol>
              {path.extra ? <p><Link to={path.extra}>{ui.next}</Link></p> : null}
            </section>
          ))}
          <p><Link to="/guides">{ui.allGuides}</Link></p>
        </div>
      )}
    </Shell>
  );
}
