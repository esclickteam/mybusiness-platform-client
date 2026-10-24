import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { getActivityPage } from "../../lib/activityPages.mjs";
import { marketingPublicUrl, normalizeMarketingLocale, splitMarketingLocale } from "../../lib/localePath.mjs";
import {
  AutomationIllustration,
  CampaignIllustration,
  WebsiteFixtureIllustration,
} from "../../components/product-marketing/ProductIllustrations";
import "./activityPage.css";

const LEAD_LABELS = new Set([
  "The short answer",
  "התשובה הקצרה",
  "La respuesta corta",
  "A resposta curta",
  "الإجابة المباشرة",
]);

function Visual({ media, locale }) {
  if (media === "crm") {
    return null;
  }
  if (media === "campaign") return <CampaignIllustration locale={locale} />;
  if (media === "automation") return <AutomationIllustration locale={locale} />;
  if (media === "site") return <WebsiteFixtureIllustration locale={locale} />;
  return null;
}

export default function ActivityPage() {
  const { pathname } = useLocation();
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const bare = splitMarketingLocale(pathname).path;
  const page = getActivityPage(bare, locale);
  const dir = getTextDirection(locale);
  const [zoom, setZoom] = useState(false);
  const caption = {
    en: "Product capture from the Bizuply CRM. Names in the image are sample data, not live customers.",
    he: "צילום מתוך ה־CRM של ביזאפלי. השמות בצילום הם נתוני הדגמה, לא לקוחות אמיתיים.",
    es: "Captura del CRM de Bizuply. Los nombres son de demostración, no clientes reales.",
    "pt-BR": "Captura do CRM da Bizuply. Os nomes são de demonstração, não clientes reais.",
    ar: "لقطة من CRM في Bizuply. الأسماء بيانات عرض وليست عملاء حقيقيين.",
  }[locale] || "Product capture from the Bizuply CRM. Names in the image are sample data, not live customers.";

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
      {page.media === "crm" ? (
        <figure className="act-shot">
          <button type="button" onClick={() => setZoom(true)}>
            <img src="/leads1.jpeg" alt={caption} />
          </button>
          <figcaption>{caption}</figcaption>
        </figure>
      ) : (
        <Visual media={page.media} locale={locale} />
      )}
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
      {zoom ? (
        <dialog open className="act-zoom" onClick={() => setZoom(false)}>
          <img src="/leads1.jpeg" alt={caption} />
        </dialog>
      ) : null}
    </article>
  );
}
