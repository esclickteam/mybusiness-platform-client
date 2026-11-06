import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { getActivityPage } from "../../lib/activityPages.mjs";
import { marketingNav } from "../../lib/marketingNav.mjs";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import "./platformExperience.css";

const SHOTS = [
  { src: "/demo-media/crm/leads-list.png", alt: "BizUply CRM leads list" },
  null,
  { src: "/demo-media/websites/my-sites.jpg", alt: "BizUply website builder" },
  { src: "/demo-media/home/automations.jpg", alt: "BizUply automations" },
  { src: "/demo-media/home/appointments.jpg", alt: "BizUply appointments calendar" },
  null,
];

const CHROME = {
  en: { pricing: "Pricing", contact: "See how BizUply can fit your business", flow: "How a new lead is handled", industries: "The same workspace, different work", faq: "Questions about the platform" },
  he: { pricing: "למחירון", contact: "גלו איך BizUply יכולה להתאים לעסק שלכם", flow: "איך מטפלים בפנייה חדשה", industries: "אותה סביבת עבודה, עבודה שונה", faq: "שאלות על הפלטפורמה" },
  es: { pricing: "Precios", contact: "Ved cómo BizUply puede encajar en el negocio", flow: "Cómo se trata una consulta nueva", industries: "El mismo espacio, distinto trabajo", faq: "Preguntas sobre la plataforma" },
  "pt-BR": { pricing: "Preços", contact: "Veja como a BizUply pode servir ao negócio", flow: "Como um contato novo é tratado", industries: "O mesmo espaço, trabalhos diferentes", faq: "Perguntas sobre a plataforma" },
  ar: { pricing: "الأسعار", contact: "اكتشفوا كيف تناسب BizUply عملكم", flow: "كيف يُعالَج استفسار جديد", industries: "مساحة العمل نفسها، عمل مختلف", faq: "أسئلة عن المنصة" },
} as const;

export default function PlatformExperience() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const page = getActivityPage("/platform", locale);
  const dir = getTextDirection(locale);
  const ui = CHROME[locale] || CHROME.en;
  const [step, setStep] = useState(0);
  const nav = marketingNav(locale);
  const industries = nav.find((group) => group.id === "industries");
  const lang = locale === "pt-BR" ? "pt-BR" : locale;

  if (!page) return null;

  return (
    <article className="px" dir={dir} lang={lang}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={marketingPublicUrl("/platform", locale)} />
      </Helmet>

      <header className="px-hero">
        <div className="px-hero-copy">
          <p className="px-kicker">{page.crumb}</p>
          <h1>{page.h1}</h1>
          <p className="px-lede">{page.lede}</p>
          <div className="px-actions">
            <Link className="px-btn px-btn--primary" to="/contact">{ui.contact}</Link>
            <Link className="px-btn px-btn--ghost" to="/pricing">{ui.pricing}</Link>
          </div>
        </div>
        <figure className="px-stage">
          <div className="px-frame">
            <div className="px-chrome" aria-hidden="true"><span /><span /><span /></div>
            <img src="/demo-media/home/crm.jpg" alt={SHOTS[0].alt} width="1600" height="1000" />
          </div>
          <img className="px-phone" src="/demo-media/whatsapp/still-3.jpg" alt="WhatsApp conversation in BizUply" width="390" height="844" />
        </figure>
      </header>

      <section className="px-map" aria-label={page.h1}>
        <ol>
          {page.sections.map(([heading], index) => (
            <li key={heading}>
              <a href={`#px-${index}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {heading}
              </a>
            </li>
          ))}
        </ol>
      </section>

      {page.sections.map(([heading, paragraphs], index) => {
        const shot = SHOTS[index];
        return (
          <section className={`px-block${index % 2 ? " is-flip" : ""}`} id={`px-${index}`} key={heading}>
            <div>
              <h2>{heading}</h2>
              {paragraphs.map((paragraph) => <p key={paragraph.slice(0, 48)}>{paragraph}</p>)}
              {index === page.sections.length - 1 ? (
                <p><Link to="/pricing">{ui.pricing}</Link></p>
              ) : null}
            </div>
            {shot ? (
              <figure className="px-shot">
                <img src={shot.src} alt={shot.alt} width="1200" height="750" loading="lazy" />
              </figure>
            ) : null}
          </section>
        );
      })}

      {page.steps?.length ? (
        <section className="px-flow">
          <h2>{ui.flow}</h2>
          <div className="px-steps" role="tablist">
            {page.steps.map((item, index) => (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={step === index}
                className={step === index ? "is-on" : ""}
                onClick={() => setStep(index)}
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                {item}
              </button>
            ))}
          </div>
          <p className="px-step-read" role="tabpanel">{page.steps[step]}</p>
        </section>
      ) : null}

      {industries?.links?.length ? (
        <section className="px-industries">
          <h2>{ui.industries}</h2>
          <ul>
            {industries.links.map((link) => (
              <li key={link[0]}>
                <Link to={link[0]}>
                  <strong>{link[1]}</strong>
                  {link[2] ? <span>{link[2]}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <aside className="px-links">
        {page.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
      </aside>

      <section className="px-faq">
        <h2>{ui.faq}</h2>
        {page.faq.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <section className="px-close">
        <h2>{page.h1}</h2>
        <p>{page.description}</p>
        <Link className="px-btn px-btn--primary" to="/contact">{ui.contact}</Link>
      </section>
    </article>
  );
}
