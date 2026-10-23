import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { GUIDE_SLUGS, getGuide } from "../../lib/guidesMarketing.mjs";
import { getHebrewMarketingPage } from "../../lib/hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "../../lib/localeMarketing.mjs";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
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
  "what-is-a-crm": "/leads1.jpeg",
  "meta-lead-ads-to-crm": "/leads2.jpeg",
  "follow-up-on-leads": "/leads4.jpeg",
  "crm-and-business-platform": "/leads5.jpeg",
};

const UI = {
  en: { all: "All guides", updated: "Updated", faq: "FAQ", pricing: "See pricing", crm: "Open the CRM", auto: "Automations", site: "Website builder", meta: "Meta campaigns", capture: "Product capture from the Bizuply CRM. Names in the image are sample data, not live customers.", zoom: "Enlarge", plan: "Plan", price: "Price", includes: "Includes", crmOnly: "CRM only", business: "Business plan", whatsapp: "WhatsApp number", crmIncludes: "Pipeline, client file, appointments calendar", businessIncludes: "CRM, appointments, collaborations, automations", waIncludes: "One connected number. Meta messaging fees are separate." },
  he: { all: "כל המדריכים", updated: "עודכן", faq: "שאלות נפוצות", pricing: "למחירון", crm: "לעמוד ה־CRM", auto: "אוטומציות", site: "בניית אתרים", meta: "קמפיינים של Meta", capture: "צילום מסך מתוך ה־CRM של ביזאפלי. השמות בצילום הם נתוני הדגמה, לא לקוחות אמיתיים.", zoom: "הגדלה", plan: "מסלול", price: "מחיר", includes: "כולל", crmOnly: "CRM בלבד", business: "חבילה עסקית", whatsapp: "מספר WhatsApp", crmIncludes: "צינור, תיק לקוח ויומן תורים", businessIncludes: "CRM, תורים, שיתופים ואוטומציות", waIncludes: "מספר מחובר אחד. חיובי Meta נפרדים." },
  es: { all: "Todas las guías", updated: "Actualizado", faq: "Preguntas frecuentes", pricing: "Ver precios", crm: "Abrir el CRM", auto: "Automatizaciones", site: "Constructor de sitios", meta: "Campañas de Meta", capture: "Captura del CRM de Bizuply. Los nombres de la imagen son de demostración, no clientes reales.", zoom: "Ampliar", plan: "Plan", price: "Precio", includes: "Incluye", crmOnly: "CRM solo", business: "Plan de negocio", whatsapp: "Número de WhatsApp", crmIncludes: "Pipeline, expediente y calendario", businessIncludes: "CRM, citas, colaboraciones y automatizaciones", waIncludes: "Un número conectado. Las tarifas de Meta van aparte." },
  "pt-BR": { all: "Todos os guias", updated: "Atualizado", faq: "Perguntas frequentes", pricing: "Ver preços", crm: "Abrir o CRM", auto: "Automações", site: "Construtor de sites", meta: "Campanhas da Meta", capture: "Captura do CRM da Bizuply. Os nomes na imagem são de demonstração, não clientes reais.", zoom: "Ampliar", plan: "Plano", price: "Preço", includes: "Inclui", crmOnly: "CRM sozinho", business: "Plano de negócios", whatsapp: "Número de WhatsApp", crmIncludes: "Pipeline, arquivo e agenda", businessIncludes: "CRM, agenda, colaborações e automações", waIncludes: "Um número conectado. As tarifas da Meta são à parte." },
  ar: { all: "كل الأدلة", updated: "آخر تحديث", faq: "أسئلة شائعة", pricing: "الأسعار", crm: "صفحة CRM", auto: "الأتمتة", site: "منشئ المواقع", meta: "حملات Meta", capture: "لقطة من CRM في Bizuply. الأسماء في الصورة بيانات عرض وليست عملاء حقيقيين.", zoom: "تكبير", plan: "المسار", price: "السعر", includes: "يشمل", crmOnly: "CRM وحده", business: "الخطة التجارية", whatsapp: "رقم واتساب", crmIncludes: "مسار وملف عميل وتقويم", businessIncludes: "CRM والمواعيد والتعاون والأتمتة", waIncludes: "رقم واحد متصل. رسوم Meta منفصلة." },
};

function uiFor(locale) {
  return UI[locale] || UI.en;
}

export function GuidesIndexPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const page = INDEX[locale] || INDEX.en;
  return (
    <main className="guide-page" dir={dir}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={marketingPublicUrl("/guides", locale)} />
      </Helmet>
      <p className="guide-kicker">Bizuply</p>
      <h1>{page.h1}</h1>
      <p>{page.description}</p>
      <ol>
        {GUIDE_SLUGS.map((slug) => {
          const article = getGuide(slug, locale);
          return (
            <li key={slug}>
              <Link to={`/guides/${slug}`}>{article.h1}</Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}

export function GuideArticlePage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const copy = uiFor(locale);
  const article = getGuide(slug, locale);
  const [zoom, setZoom] = useState(false);
  if (!article) {
    return (
      <main className="guide-page" dir={dir}>
        <h1>Bizuply</h1>
        <Link to="/guides">{copy.all}</Link>
      </main>
    );
  }
  const shot = CAPTURES[slug];
  return (
    <article className="guide-page" dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={marketingPublicUrl(`/guides/${slug}`, locale)} />
      </Helmet>
      <p><Link to="/guides">{copy.all}</Link></p>
      <p className="guide-kicker">{copy.updated} {article.updated}</p>
      <h1>{article.h1}</h1>
      <p>{article.description}</p>
      <nav className="guide-toc" aria-label={article.h1}>
        <ol>
          {article.sections.map(([heading]) => (
            <li key={heading}><a href={`#${encodeURIComponent(heading)}`}>{heading}</a></li>
          ))}
        </ol>
      </nav>
      {shot ? (
        <figure className="guide-shot">
          <button type="button" onClick={() => setZoom(true)} aria-label={copy.zoom} style={{ padding: 0, border: 0, background: "transparent", cursor: "zoom-in", width: "100%" }}>
            <img src={shot} alt={copy.capture} />
          </button>
          <figcaption>{copy.capture}</figcaption>
        </figure>
      ) : null}
      {slug === "crm-and-business-platform" ? (
        <table className="guide-table">
          <thead>
            <tr>
              <th>{copy.plan}</th>
              <th>{copy.price}</th>
              <th>{copy.includes}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{copy.crmOnly}</td>
              <td>$49</td>
              <td>{copy.crmIncludes}</td>
            </tr>
            <tr>
              <td>{copy.business}</td>
              <td>$99 / $990</td>
              <td>{copy.businessIncludes}</td>
            </tr>
            <tr>
              <td>{copy.whatsapp}</td>
              <td>$29</td>
              <td>{copy.waIncludes}</td>
            </tr>
          </tbody>
        </table>
      ) : null}
      {article.sections.map(([heading, paragraphs]) => (
        <section key={heading} id={encodeURIComponent(heading)}>
          <h2>{heading}</h2>
          {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
        </section>
      ))}
      <h2>{copy.faq}</h2>
      {article.faq.map(([question, answer]) => (
        <section key={question}>
          <h3>{question}</h3>
          <p>{answer}</p>
        </section>
      ))}
      <div className="guide-links">
        <Link to="/pricing">{copy.pricing}</Link>
        <Link to="/crm">{copy.crm}</Link>
        <Link to="/automations">{copy.auto}</Link>
        <Link to="/website-builder">{copy.site}</Link>
        <Link to="/meta-campaigns">{copy.meta}</Link>
      </div>
      {zoom && shot ? (
        <dialog open style={{ maxWidth: "min(1100px, 96vw)", border: 0, padding: 0, background: "transparent" }} onClick={() => setZoom(false)}>
          <img src={shot} alt={copy.capture} style={{ width: "100%", height: "auto", borderRadius: 16 }} />
        </dialog>
      ) : null}
    </article>
  );
}
