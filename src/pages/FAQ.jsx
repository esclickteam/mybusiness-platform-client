import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../i18n/localeUtils";
import { marketingPublicUrl, normalizeMarketingLocale } from "../lib/localePath.mjs";
import { getFaqCatalog } from "../lib/faqCatalog.mjs";
import "../styles/publicStage.css";

function FAQ() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const page = getFaqCatalog(locale);
  const dir = getTextDirection(i18n.language);

  return (
    <main className="co-faq" dir={dir}>
      <Helmet>
        <title>{page.title} | BizUply</title>
        <meta name="description" content={page.lede} />
        <link rel="canonical" href={marketingPublicUrl("/faq", locale)} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <header className="co-faq-hero">
        <p>BizUply</p>
        <h1>{page.title}</h1>
        <p>{page.lede}</p>
      </header>

      <div className="co-faq-layout">
        <nav className="co-faq-nav" aria-label={page.title}>
          {page.groups.map((group) => (
            <a key={group.id} href={`#faq-${group.id}`}>
              {group.title}
            </a>
          ))}
        </nav>

        <div>
          {page.groups.map((group) => (
            <section key={group.id} id={`faq-${group.id}`} className="co-faq-group">
              <h2>{group.title}</h2>
              {group.items.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </section>
          ))}
          <p>
            <Link to="/contact">{locale === "he" ? "יצירת קשר" : locale === "es" ? "Contacto" : locale === "pt-BR" ? "Contato" : locale === "ar" ? "اتصال" : "Contact"}</Link>
            {" · "}
            <Link to="/pricing">{locale === "he" ? "מחירים" : locale === "es" ? "Precios" : locale === "pt-BR" ? "Preços" : locale === "ar" ? "الأسعار" : "Pricing"}</Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default FAQ;
