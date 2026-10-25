import React, { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { getGuide } from "../../lib/guidesMarketing.mjs";
import {
  guideHasTutorial,
  guidesHubCopy,
  publishedGuideGroups,
} from "../../lib/guidesHub.mjs";
import { marketingPublicUrl, normalizeMarketingLocale, splitMarketingLocale } from "../../lib/localePath.mjs";
import { demoMediaLocale } from "../../components/product-marketing/ProductDemoVideo";
import GuideFigure from "./GuideFigure";
import "../../components/product-marketing/marketingKit.css";
import "./guidesArticle.css";
import "./guidesHub.css";

const POPULAR = ["what-is-a-crm", "whatsapp-cloud-api-cost", "meta-lead-ads-to-crm", "business-automation"];

function useGuideLocale() {
  const { i18n } = useTranslation();
  const locale = typeof window === "undefined" ? "en" : splitMarketingLocale(window.location.pathname).locale;
  useEffect(() => {
    if (normalizeMarketingLocale(i18n.language) !== locale) void i18n.changeLanguage(locale);
  }, [i18n, locale]);
  return locale;
}

function sectionParagraphs(section) {
  return Array.isArray(section) ? section[1] : section.paragraphs || [];
}

function sectionHeading(section) {
  return Array.isArray(section) ? section[0] : section.heading;
}

const UI = {
  en: { all: "All guides", updated: "Updated", faq: "Common questions", pricing: "See pricing", crm: "Open the CRM", auto: "Automations", site: "Website builder", meta: "Meta campaigns", capture: "A lead record in Bizuply", zoom: "Enlarge", plan: "Plan", price: "Price", includes: "Includes", crmOnly: "CRM only", business: "Business plan", whatsapp: "WhatsApp number", crmIncludes: "Pipeline and client file", businessIncludes: "CRM, appointments, collaborations, automations", waIncludes: "One connected number. Meta messaging fees are separate.", read: "Read the guide", onPage: "On this page", example: "Example", related: "Continue with" },
  he: { all: "כל המדריכים", updated: "עודכן", faq: "שאלות נפוצות", pricing: "למחירון", crm: "לעמוד ה־CRM", auto: "אוטומציות", site: "בניית אתרים", meta: "קמפיינים של Meta", capture: "רשומת ליד בביזאפלי", zoom: "הגדלה", plan: "מסלול", price: "מחיר", includes: "כולל", crmOnly: "CRM בלבד", business: "חבילה עסקית", whatsapp: "מספר WhatsApp", crmIncludes: "צינור ותיק לקוח", businessIncludes: "CRM, תורים, שיתופים ואוטומציות", waIncludes: "מספר מחובר אחד. חיובי Meta נפרדים.", read: "למדריך", onPage: "בעמוד", example: "דוגמה", related: "המשיכו אל" },
  es: { all: "Todas las guías", updated: "Actualizado", faq: "Preguntas frecuentes", pricing: "Ver precios", crm: "Abrir el CRM", auto: "Automatizaciones", site: "Constructor de sitios", meta: "Campañas de Meta", capture: "Un registro de lead en Bizuply", zoom: "Ampliar", plan: "Plan", price: "Precio", includes: "Incluye", crmOnly: "CRM solo", business: "Plan de negocio", whatsapp: "Número de WhatsApp", crmIncludes: "Pipeline y expediente", businessIncludes: "CRM, citas, colaboraciones y automatizaciones", waIncludes: "Un número conectado. Las tarifas de Meta van aparte.", read: "Leer la guía", onPage: "En esta página", example: "Ejemplo", related: "Siga con" },
  "pt-BR": { all: "Todos os guias", updated: "Atualizado", faq: "Perguntas frequentes", pricing: "Ver preços", crm: "Abrir o CRM", auto: "Automações", site: "Construtor de sites", meta: "Campanhas da Meta", capture: "Um registro de lead na Bizuply", zoom: "Ampliar", plan: "Plano", price: "Preço", includes: "Inclui", crmOnly: "CRM sozinho", business: "Plano de negócios", whatsapp: "Número de WhatsApp", crmIncludes: "Pipeline e arquivo do cliente", businessIncludes: "CRM, agenda, colaborações e automações", waIncludes: "Um número conectado. As tarifas da Meta são à parte.", read: "Ler o guia", onPage: "Nesta página", example: "Exemplo", related: "Continue com" },
  ar: { all: "كل الأدلة", updated: "آخر تحديث", faq: "أسئلة شائعة", pricing: "الأسعار", crm: "صفحة CRM", auto: "الأتمتة", site: "منشئ المواقع", meta: "حملات Meta", capture: "سجل عميل في Bizuply", zoom: "تكبير", plan: "المسار", price: "السعر", includes: "يشمل", crmOnly: "CRM وحده", business: "الخطة التجارية", whatsapp: "رقم واتساب", crmIncludes: "المسار وملف العميل", businessIncludes: "CRM والمواعيد والتعاون والأتمتة", waIncludes: "رقم واحد متصل. رسوم Meta منفصلة.", read: "اقرأ الدليل", onPage: "في هذه الصفحة", example: "مثال", related: "تابع مع" },
};

function uiFor(locale) {
  return UI[locale] || UI.en;
}

function GuideCard({ item, read }) {
  return (
    <article className="gk-card">
      <Link to={`/guides/${item.slug}`}>
        <img src={item.media.src} alt={item.media.alt} width="640" height="400" />
        <h3>{item.article.h1}</h3>
        <p>{item.article.description}</p>
        <p>{read}</p>
      </Link>
    </article>
  );
}

export function GuidesIndexPage() {
  const locale = useGuideLocale();
  const dir = getTextDirection(locale);
  const copy = guidesHubCopy(locale);
  const groups = publishedGuideGroups(locale);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const needle = query.trim().toLowerCase();
  const visible = useMemo(() => groups
    .filter((group) => category === "all" || group.id === category)
    .map((group) => ({
      ...group,
      articles: group.articles.filter(({ article }) => {
        if (!needle) return true;
        return `${article.h1} ${article.description} ${group.label}`.toLowerCase().includes(needle);
      }),
    }))
    .filter((group) => group.articles.length), [groups, category, needle]);
  const flat = visible.flatMap((group) => group.articles);
  const popular = flat.filter((item) => POPULAR.includes(item.slug));
  const tutorials = flat.filter((item) => guideHasTutorial(item.article));
  const lang = locale === "pt-BR" ? "pt-BR" : locale;
  return (
    <main className="gk" dir={dir} lang={lang}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={marketingPublicUrl("/guides", locale)} />
      </Helmet>
      <section className="gk-hero">
        <div className="gk-wrap">
          <p className="gk-kicker">{copy.kicker}</p>
          <h1>{copy.h1}</h1>
          <p className="gk-lead">{copy.lede}</p>
          <form className="gk-search" role="search" onSubmit={(event) => event.preventDefault()}>
            <label className="gk-sr" htmlFor="guide-search">{copy.searchLabel}</label>
            <input id="guide-search" type="search" value={query} placeholder={copy.search} onChange={(event) => setQuery(event.target.value)} />
          </form>
          <div className="gk-chips" role="toolbar" aria-label={copy.all}>
            <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")}>{copy.all}</button>
            {groups.map((group) => (
              <button key={group.id} type="button" aria-pressed={category === group.id} onClick={() => setCategory(group.id)}>{group.label}</button>
            ))}
          </div>
        </div>
      </section>
      {category === "all" && !needle ? (
        <section className="gk-feature">
          <div className="gk-wrap gk-feature__grid">
            <div>
              <p className="gk-kicker">{copy.featuredKicker}</p>
              <h2>{copy.featuredTitle}</h2>
              <p>{copy.featuredBody}</p>
              <Link className="gk-btn" to="/guides/what-is-a-crm">{copy.featuredCta}</Link>
            </div>
            <img src="/demo-media/crm/lead-file.png" alt={copy.featuredTitle} width="960" height="600" />
          </div>
        </section>
      ) : null}
      <div className="gk-wrap" id="guides">
        {flat.length ? null : <p className="gk-empty">{copy.empty}</p>}
        {popular.length > 1 && category === "all" && !needle ? (
          <section className="gk-band">
            <h2>{copy.popular}</h2>
            <ul className="gk-links">
              {popular.map((item) => (
                <li key={item.slug}><Link to={`/guides/${item.slug}`}>{item.article.h1}</Link></li>
              ))}
            </ul>
          </section>
        ) : null}
        {visible.map((group) => (
          <section className="gk-group" key={group.id} id={group.id}>
            <h2>{group.label}</h2>
            <div className="gk-grid">{group.articles.map((item) => <GuideCard key={item.slug} item={item} read={copy.read} />)}</div>
          </section>
        ))}
        {tutorials.length && !needle ? (
          <section className="gk-band">
            <h2>{copy.tutorials}</h2>
            <ul className="gk-links">
              {tutorials.map((item) => (
                <li key={`tutorial-${item.slug}`}><Link to={`/guides/${item.slug}`}>{item.article.h1}</Link></li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
      <section className="gk-cta">
        <div className="gk-wrap">
          <h2>{copy.ctaTitle}</h2>
          <p>{copy.ctaBody}</p>
          <div className="gk-cta__actions">
            <Link to="/platform">{copy.explore}</Link>
            <Link to="/pricing">{copy.pricing}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function GuideFilm({ moduleId }) {
  const { i18n } = useTranslation();
  const locale = demoMediaLocale(i18n.language);
  const nodeRef = useRef(null);
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) void node.play().catch(() => {});
      else node.pause();
    }, { threshold: 0.45 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [moduleId, locale]);
  const src = `/demo-media/${moduleId}/${moduleId}-${locale}.mp4`;
  return (
    <video
      key={src}
      ref={nodeRef}
      className="pdv__video"
      controls
      muted
      loop
      playsInline
      preload="none"
      poster={`/demo-media/${moduleId}/poster.jpg`}
    >
      <source src={src} type="video/mp4" />
      {["en", "he", "es", "pt-br", "ar"].map((fileLocale) => (
        <track
          key={fileLocale}
          kind="subtitles"
          src={`/demo-media/${moduleId}/${moduleId}.${fileLocale}.vtt`}
          srcLang={fileLocale === "pt-br" ? "pt-BR" : fileLocale}
          default={fileLocale === locale}
        />
      ))}
    </video>
  );
}

function GuideSection({ section, locale }) {
  const heading = sectionHeading(section);
  const paragraphs = sectionParagraphs(section);
  const id = section.id || encodeURIComponent(heading);
  return (
    <section className="guide-block" id={id}>
      <h2>{heading}</h2>
      {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 64)}>{paragraph}</p>)}
      {section.steps?.length ? (
        <ol className="guide-steps">
          {section.steps.map((step) => <li key={step.slice(0, 64)}>{step}</li>)}
        </ol>
      ) : null}
      {section.example?.body ? (
        <aside className="guide-example">
          <p>{section.example.title}</p>
          <p>{section.example.body}</p>
        </aside>
      ) : null}
      {section.mistakes?.length ? (
        <div className="guide-mistakes">
          {section.mistakes.map((item) => (
            <div key={item.problem}>
              <p>{item.problem}</p>
              <p>{item.fix}</p>
            </div>
          ))}
        </div>
      ) : null}
      {section.table?.rows?.length ? (
        <table className="guide-table">
          {section.table.columns?.length ? (
            <thead>
              <tr>{section.table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
            </thead>
          ) : null}
          <tbody>
            {section.table.rows.map((row) => (
              <tr key={row.join("|")}>{row.map((cell) => <td key={cell}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
      ) : null}
      {section.shots?.length ? (
        <div className="guide-shots">
          {section.shots.map((shot) => (
            <figure className="guide-shot" key={shot.src}>
              <img src={shot.src} alt={shot.caption || heading} />
              {shot.caption ? <figcaption>{shot.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      ) : null}
      {section.figure ? <GuideFigure kind={section.figure} locale={locale} /> : null}
      {section.video ? (
        <figure className="guide-video">
          <GuideFilm moduleId={section.video} />
          {section.videoNote ? <figcaption>{section.videoNote}</figcaption> : null}
        </figure>
      ) : null}
    </section>
  );
}

export function GuideArticlePage() {
  const { slug } = useParams();
  const locale = useGuideLocale();
  const dir = getTextDirection(locale);
  const copy = uiFor(locale);
  const article = getGuide(slug, locale);
  if (!article) {
    return (
      <main className="guide-page" dir={dir}>
        <h1>Bizuply</h1>
        <Link to="/guides">{copy.all}</Link>
      </main>
    );
  }
  const related = (article.related || [])
    .map((relatedSlug) => ({ slug: relatedSlug, article: getGuide(relatedSlug, locale) }))
    .filter((item) => item.article);
  return (
    <article className={`guide-page guide-layout-${article.layout || "story"}`} dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={marketingPublicUrl(`/guides/${slug}`, locale)} />
      </Helmet>
      <header className="guide-article-head">
        <p><Link to="/guides">{copy.all}</Link></p>
        <p className="guide-kicker">{copy.updated} {article.updated}</p>
        <h1>{article.h1}</h1>
        <p className="guide-answer">{article.lede || article.description}</p>
      </header>
      <div className="guide-split">
        <nav className="guide-toc" aria-label={copy.onPage}>
          <p>{copy.onPage}</p>
          <ol>
            {article.sections.map((section) => {
              const heading = sectionHeading(section);
              const id = section.id || encodeURIComponent(heading);
              return <li key={id}><a href={`#${id}`}>{heading}</a></li>;
            })}
          </ol>
        </nav>
        <div className="guide-body">
          {article.sections.map((section) => (
            <GuideSection key={section.id || sectionHeading(section)} section={section} locale={locale} />
          ))}
          <section className="guide-block" id="questions">
            <h2>{copy.faq}</h2>
            {article.faq.map(([question, answer]) => (
              <details key={question} className="guide-faq">
                <summary>{question}</summary>
                <p>{answer}</p>
              </details>
            ))}
          </section>
          {article.serviceLink ? (
            <p className="guide-service">
              <Link to={article.serviceLink.href}>{article.serviceLink.label}</Link>
            </p>
          ) : null}
          <nav className="guide-links" aria-label={copy.related}>
            <p>{copy.related}</p>
            {related.map((item) => (
              <Link key={item.slug} to={`/guides/${item.slug}`}>{item.article.h1}</Link>
            ))}
            <Link to="/pricing">{copy.pricing}</Link>
          </nav>
        </div>
      </div>
    </article>
  );
}
