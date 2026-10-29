import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { GUIDE_SLUGS, getGuide } from "../../lib/guidesMarketing.mjs";
import { getHebrewMarketingPage } from "../../lib/hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "../../lib/localeMarketing.mjs";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import ProductDemoVideo from "../../components/product-marketing/ProductDemoVideo";
import GuideFigure from "./GuideFigure";
import CrmLeadGuidePage from "./CrmLeadGuidePage";
import "../../components/product-marketing/marketingKit.css";
import "./guidesArticle.css";

const INDEX = {
  en: { title: "Guides | Bizuply", description: "Practical guides on CRM, WhatsApp Cloud API, automations, Meta ads, and the website builder.", h1: "Guides" },
  he: getHebrewMarketingPage("/guides"),
  es: getLocaleMarketingPage("/guides", "es"),
  "pt-BR": getLocaleMarketingPage("/guides", "pt-BR"),
  ar: getLocaleMarketingPage("/guides", "ar"),
};

const CAPTURES = {
  "what-is-a-crm": "/demo-media/crm/poster.jpg",
  "follow-up-on-leads": "/demo-media/crm/poster.jpg",
  "business-automation": "/demo-media/automations/poster.jpg",
  "build-a-website-without-code": "/demo-media/websites/poster.jpg",
  "manage-meta-campaigns": "/demo-media/campaigns/poster.jpg",
  "appointments-for-a-service-business": "/demo-media/appointments/poster.jpg",
  "whatsapp-message-templates": "/demo-media/whatsapp/poster.jpg",
};

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

export function GuidesIndexPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const page = INDEX[locale] || INDEX.en;
  const copy = uiFor(locale);
  const [featured, ...rest] = GUIDE_SLUGS;
  const lead = getGuide(featured, locale);
  return (
    <main className="guide-index" dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={marketingPublicUrl("/guides", locale)} />
      </Helmet>
      <header className="guide-mast">
        <p className="guide-kicker">Bizuply</p>
        <h1>{page.h1}</h1>
        <p>{page.description}</p>
      </header>
      <article className="guide-feature">
        <div>
          <p className="guide-kicker">01</p>
          <h2><Link to={`/guides/${featured}`}>{lead.h1}</Link></h2>
          <p>{lead.description}</p>
          <Link className="guide-read" to={`/guides/${featured}`}>{copy.read}</Link>
        </div>
        <img src={CAPTURES[featured]} alt={copy.capture} />
      </article>
      <ol className="guide-rail">
        {rest.map((slug, index) => {
          const article = getGuide(slug, locale);
          return (
            <li key={slug}>
              <span>{String(index + 2).padStart(2, "0")}</span>
              <div>
                <Link to={`/guides/${slug}`}>{article.h1}</Link>
                <p>{article.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </main>
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
          <ProductDemoVideo moduleId={section.video} />
          {section.videoNote ? <figcaption>{section.videoNote}</figcaption> : null}
        </figure>
      ) : null}
    </section>
  );
}

export function GuideArticlePage() {
  const { slug } = useParams();
  if (slug === "crm-lead-management") return <CrmLeadGuidePage />;
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
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
