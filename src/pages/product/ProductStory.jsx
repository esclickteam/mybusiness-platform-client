import React, { useEffect, useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import { getCoreProductStory } from "../../lib/coreProductStories.mjs";
import ProductDemoVideo from "../../components/product-marketing/ProductDemoVideo";
import "../public/activityPage.css";

const MEDIA = {
  "/whatsapp-api": "whatsapp",
  "/automations": "automations",
  "/meta-campaigns": "campaigns",
  "/website-builder": "websites",
  "/appointments": "appointments",
};

const CTA = {
  en: ["Start with BizUply", "See pricing"],
  he: ["התחילו עם BizUply", "למחירים"],
  es: ["Empezar con BizUply", "Ver precios"],
  "pt-BR": ["Começar com a BizUply", "Ver preços"],
  ar: ["ابدأوا مع BizUply", "الأسعار"],
};

export default function ProductStory({ path }) {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const page = getCoreProductStory(path, locale);
  const media = MEDIA[path];
  const [primary, secondary] = CTA[locale] || CTA.en;
  const canonical = marketingPublicUrl(path, locale);
  const schema = useMemo(() => {
    if (!page) return null;
    return {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": `${canonical}#webpage`,
          url: canonical,
          name: page.title,
          description: page.description,
          inLanguage: locale === "pt-BR" ? "pt-BR" : locale,
          isPartOf: { "@id": "https://bizuply.com/#website" },
          about: { "@id": "https://bizuply.com/#organization" },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "BizUply", item: "https://bizuply.com/" },
            { "@type": "ListItem", position: 2, name: page.crumb, item: canonical },
          ],
        },
        {
          "@type": "FAQPage",
          inLanguage: locale === "pt-BR" ? "pt-BR" : locale,
          mainEntity: (page.faq || []).map(([name, text]) => ({
            "@type": "Question",
            name,
            acceptedAnswer: { "@type": "Answer", text },
          })),
        },
      ],
    };
  }, [canonical, locale, page]);

  useEffect(() => {
    if (!page?.title) return undefined;
    const previous = document.title;
    document.title = page.title;
    return () => {
      document.title = previous;
    };
  }, [page]);

  if (!page) return null;

  return (
    <article className="act act--product" dir={dir} lang={locale === "pt-BR" ? "pt-BR" : locale}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={page.title} />
        <meta property="og:description" content={page.description} />
        <meta property="og:site_name" content="BizUply" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <header className="act-hero">
        <p className="act-kicker">{page.crumb}</p>
        <h1>{page.h1}</h1>
        <p className="act-lede">{page.lede}</p>
        <div className="act-actions">
          <Link className="act-btn act-btn--primary" to="/register">{primary}</Link>
          <Link className="act-btn act-btn--ghost" to="/pricing">{secondary}</Link>
        </div>
      </header>
      {media ? <ProductDemoVideo moduleId={media} /> : null}
      <div className="act-body">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
          </section>
        ))}
      </div>
      <aside className="act-links">
        {(page.links || []).map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
      </aside>
      <div className="act-faq">
        {(page.faq || []).map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </article>
  );
}
