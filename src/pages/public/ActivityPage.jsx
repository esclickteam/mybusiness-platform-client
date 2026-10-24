import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { getActivityPage } from "../../lib/activityPages.mjs";
import { marketingPublicUrl, normalizeMarketingLocale, splitMarketingLocale } from "../../lib/localePath.mjs";
import ProductDemoVideo from "../../components/product-marketing/ProductDemoVideo";
import "./activityPage.css";

const LEAD_LABELS = new Set([
  "The short answer",
  "התשובה הקצרה",
  "La respuesta corta",
  "A resposta curta",
  "الإجابة المباشرة",
]);

function Visual({ media }) {
  if (media === "automation") return <ProductDemoVideo moduleId="automations" />;
  if (media === "campaign") return <ProductDemoVideo moduleId="campaigns" />;
  return null;
}

export default function ActivityPage() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const bare = splitMarketingLocale(pathname).path;
  const page = getActivityPage(bare, locale);
  const dir = getTextDirection(locale);

  if (!page) {
    return (
      <main className="act" dir={dir}>
        <Helmet>
          <meta name="robots" content="noindex" />
        </Helmet>
        <h1>Bizuply</h1>
        <Link to="/platform">Bizuply</Link>
      </main>
    );
  }

  return (
    <article className={`act act--${page.layout}`} dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={marketingPublicUrl(bare, locale)} />
      </Helmet>
      <header className="act-hero">
        <p className="act-kicker">{page.crumb}</p>
        <h1>{page.h1}</h1>
        <p className="act-lede">{page.lede}</p>
        <div className="act-actions">
          <Link to="/pricing">{locale === "he" ? "למחירון" : locale === "ar" ? "الأسعار" : locale === "es" ? "Precios" : locale === "pt-BR" ? "Preços" : "Pricing"}</Link>
          <Link to="/contact">{locale === "he" ? "יצירת קשר" : locale === "ar" ? "اتصال" : locale === "es" ? "Contacto" : locale === "pt-BR" ? "Contato" : "Contact"}</Link>
        </div>
      </header>
      <Visual media={page.media} />
      {page.steps?.length ? (
        <ol className="act-steps">
          {page.steps.map((step) => <li key={step}>{step}</li>)}
        </ol>
      ) : null}
      <div className="act-body">
        {page.sections.map(([heading, paragraphs]) => (
          LEAD_LABELS.has(heading) ? null : (
            <section key={heading}>
              <h2>{heading}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
            </section>
          )
        ))}
      </div>
      <aside className="act-links">
        {page.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
      </aside>
      <div className="act-faq">
        {page.faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </article>
  );
}
