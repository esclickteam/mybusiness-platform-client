import React from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { GUIDE_SLUGS, getGuide } from "../../lib/guidesMarketing.mjs";
import { getHebrewMarketingPage } from "../../lib/hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "../../lib/localeMarketing.mjs";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import "../../components/product-marketing/marketingKit.css";

const INDEX = {
  en: { title: "Guides | Bizuply", description: "Practical guides on CRM, WhatsApp Cloud API, automations, Meta ads, and the website builder.", h1: "Guides" },
  he: getHebrewMarketingPage("/guides"),
  es: getLocaleMarketingPage("/guides", "es"),
  "pt-BR": getLocaleMarketingPage("/guides", "pt-BR"),
  ar: getLocaleMarketingPage("/guides", "ar"),
};

export function GuidesIndexPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const page = INDEX[locale] || INDEX.en;
  return (
    <main className="pm-shell" dir={dir} style={{ padding: "4rem 1.25rem 5rem", maxWidth: 880 }}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={marketingPublicUrl("/guides", locale)} />
      </Helmet>
      <h1>{page.h1}</h1>
      <p>{page.description}</p>
      <ul>
        {GUIDE_SLUGS.map((slug) => {
          const article = getGuide(slug, locale);
          return (
            <li key={slug}>
              <Link to={`/guides/${slug}`}>{article.h1}</Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export function GuideArticlePage() {
  const { slug } = useParams();
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const article = getGuide(slug, locale);
  if (!article) {
    return (
      <main className="pm-shell" dir={dir} style={{ padding: "4rem 1.25rem" }}>
        <h1>Bizuply</h1>
        <Link to="/guides">Guides</Link>
      </main>
    );
  }
  return (
    <article className="pm-shell" dir={dir} lang={locale} style={{ padding: "4rem 1.25rem 5rem", maxWidth: 880 }}>
      <Helmet>
        <title>{article.title}</title>
        <meta name="description" content={article.description} />
        <link rel="canonical" href={marketingPublicUrl(`/guides/${slug}`, locale)} />
      </Helmet>
      <p><Link to="/guides">{locale === "he" ? "כל המדריכים" : locale === "ar" ? "كل الأدلة" : locale === "es" ? "Todas las guías" : locale === "pt-BR" ? "Todos os guias" : "All guides"}</Link></p>
      <h1>{article.h1}</h1>
      <p>{locale === "he" ? "עודכן" : locale === "ar" ? "آخر تحديث" : locale === "es" ? "Actualizado" : locale === "pt-BR" ? "Atualizado" : "Updated"} {article.updated}</p>
      {article.sections.map(([heading, paragraphs]) => (
        <section key={heading}>
          <h2>{heading}</h2>
          {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        </section>
      ))}
      <h2>{locale === "he" ? "שאלות נפוצות" : locale === "ar" ? "أسئلة شائعة" : locale === "es" ? "Preguntas frecuentes" : locale === "pt-BR" ? "Perguntas frequentes" : "FAQ"}</h2>
      {article.faq.map(([question, answer]) => (
        <section key={question}>
          <h3>{question}</h3>
          <p>{answer}</p>
        </section>
      ))}
      <p><Link to="/pricing">{locale === "he" ? "למחירון" : locale === "ar" ? "الأسعار" : locale === "es" ? "Ver precios" : locale === "pt-BR" ? "Ver preços" : "See pricing"}</Link></p>
    </article>
  );
}
