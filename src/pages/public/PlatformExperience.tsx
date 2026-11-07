import React, { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getTextDirection } from "../../i18n/localeUtils";
import { getActivityPage } from "../../lib/activityPages.mjs";
import { marketingNav } from "../../lib/marketingNav.mjs";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import "./platformExperience.css";

const STATUS_KEYS = ["new", "contacted", "interested", "converted", "lost", "old"] as const;

const STEP_MEDIA = [
  { src: "/demo-media/forms/form.png", width: 1200, height: 800 },
  { src: "/demo-media/crm/lead-file.png", width: 1400, height: 900 },
  { src: "/demo-media/crm/lead-task.png", width: 1400, height: 900 },
  { src: "/demo-media/home/automations.jpg", width: 1600, height: 1000 },
];

const COPY = {
  en: {
    contact: "See how BizUply can fit your business",
    pricing: "Pricing",
    statusNow: "One status on the lead",
    plans: [
      ["CRM only", "$49 per month"],
      ["Business plan", "$99 per month or $990 per year"],
      ["WhatsApp", "$29 per month per number"],
    ],
    extra: [
      ["Does BizUply publish growth or savings figures?", "No. The dashboard shows views that already exist, including new and untreated leads and upcoming appointments."],
      ["What does the business plan include?", "CRM together with appointments, collaborations and automations, at $99 per month or $990 per year. WhatsApp stays $29 per month per connected number, and Meta messaging fees are separate."],
    ],
  },
  he: {
    contact: "גלו איך BizUply יכולה להתאים לעסק שלכם",
    pricing: "למחירון",
    statusNow: "סטטוס אחד על הליד",
    plans: [
      ["CRM בלבד", "49 דולר לחודש"],
      ["החבילה העסקית", "99 דולר לחודש או 990 דולר לשנה"],
      ["WhatsApp", "29 דולר לחודש לכל מספר"],
    ],
    extra: [
      ["האם BizUply מפרסמת אחוזי צמיחה או חיסכון?", "לא. לוח הבקרה מציג תצוגות שקיימות במוצר, כולל לידים חדשים, לידים שלא טופלו ופגישות קרובות."],
      ["מה כלול בחבילה העסקית?", "CRM יחד עם תורים, שיתופים ואוטומציות, ב־99 דולר לחודש או 990 דולר לשנה. WhatsApp נשאר 29 דולר לחודש לכל מספר מחובר, וחיובי ההודעות של Meta נפרדים."],
    ],
  },
  es: {
    contact: "Ved cómo BizUply puede encajar en el negocio",
    pricing: "Precios",
    statusNow: "Un estado en el lead",
    plans: [
      ["Solo CRM", "49 dólares al mes"],
      ["Plan de negocio", "99 al mes o 990 al año"],
      ["WhatsApp", "29 al mes por número"],
    ],
    extra: [
      ["¿BizUply publica porcentajes de crecimiento o ahorro?", "No. El panel muestra vistas que ya existen: leads nuevos, leads sin tratar y próximas citas."],
      ["¿Qué incluye el plan de negocio?", "CRM, citas, colaboraciones y automatizaciones, a 99 al mes o 990 al año. WhatsApp sigue a 29 al mes por número conectado, y Meta cobra los mensajes aparte."],
    ],
  },
  "pt-BR": {
    contact: "Veja como a BizUply pode servir ao negócio",
    pricing: "Preços",
    statusNow: "Um status no lead",
    plans: [
      ["Somente CRM", "49 dólares por mês"],
      ["Plano de negócios", "99 por mês ou 990 por ano"],
      ["WhatsApp", "29 por mês por número"],
    ],
    extra: [
      ["A BizUply publica percentuais de crescimento ou economia?", "Não. O painel mostra visões que já existem: leads novos, leads sem tratamento e próximos compromissos."],
      ["O que o plano de negócios inclui?", "CRM, agenda, colaborações e automações, a 99 por mês ou 990 por ano. O WhatsApp continua a 29 por mês por número conectado, e a Meta cobra as mensagens à parte."],
    ],
  },
  ar: {
    contact: "اكتشفوا كيف تناسب BizUply عملكم",
    pricing: "الأسعار",
    statusNow: "حالة واحدة على العميل المحتمل",
    plans: [
      ["CRM وحده", "49 دولاراً شهرياً"],
      ["الخطة التجارية", "99 شهرياً أو 990 سنوياً"],
      ["واتساب", "29 شهرياً لكل رقم"],
    ],
    extra: [
      ["هل تنشر BizUply نسب نمو أو وفراً؟", "لا. تعرض اللوحة مشاهد موجودة بالفعل: عملاء محتملون جدد، وعملاء لم يُعالجوا، ومواعيد قريبة."],
      ["ماذا تشمل الخطة التجارية؟", "CRM والمواعيد والتعاون والأتمتة، بـ 99 شهرياً أو 990 سنوياً. يبقى واتساب 29 شهرياً لكل رقم متصل، ورسوم رسائل Meta منفصلة."],
    ],
  },
} as const;

export default function PlatformExperience() {
  const { i18n, t } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const page = getActivityPage("/platform", locale);
  const dir = getTextDirection(locale);
  const ui = COPY[locale] || COPY.en;
  const rootRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState(0);
  const [step, setStep] = useState(0);
  const nav = marketingNav(locale);
  const industryGroup = nav.find((group) => group.id === "industries");
  const industries = (industryGroup?.links || []) as Array<[string, string, string?]>;
  const lang = locale === "pt-BR" ? "pt-BR" : locale;
  const statuses = STATUS_KEYS.map((key) => t(`automations.catalog.leadStatuses.${key}`));

  useEffect(() => {
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    root.classList.add("px-motion");
    const nodes = root.querySelectorAll("[data-reveal]");
    const seen = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        seen.unobserve(entry.target);
      });
    }, { threshold: 0.18 });
    nodes.forEach((node) => seen.observe(node));
    return () => seen.disconnect();
  }, [locale]);

  if (!page) return null;

  const [place, team, fit, flow, decisions, start] = page.sections;
  const faqs = [...page.faq, ...ui.extra];

  return (
    <article className="px" dir={dir} lang={lang} ref={rootRef}>
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
            <Link className="px-btn px-btn--light" to="/contact">{ui.contact}</Link>
            <Link className="px-btn px-btn--line" to="/pricing">{ui.pricing}</Link>
          </div>
        </div>
        <div className="px-stage">
          <figure className="px-browser">
            <div className="px-browser-bar" aria-hidden="true"><span /><span /><span /></div>
            <img src="/demo-media/home/crm.jpg" alt={place?.[0] || page.h1} width="1600" height="1000" />
          </figure>
          <p className="px-chip">
            <small>{ui.statusNow}</small>
            <strong>{statuses[0]}</strong>
          </p>
        </div>
      </header>

      <nav className="px-rail" data-reveal aria-label={page.h1}>
        {page.sections.map(([heading], index) => (
          <a key={heading} href={`#px-${index}`}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            {heading}
          </a>
        ))}
      </nav>

      <section className="px-crm" id="px-0" data-reveal>
        <div className="px-crm-copy">
          <h2>{place?.[0]}</h2>
          {(place?.[1] || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
          <div className="px-statuses" role="listbox" aria-label={ui.statusNow}>
            {statuses.map((label, index) => (
              <button
                key={STATUS_KEYS[index]}
                type="button"
                role="option"
                aria-selected={status === index}
                className={status === index ? "is-on" : ""}
                onClick={() => setStatus(index)}
              >
                <i aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>
          <p className="px-status-read"><span>{ui.statusNow}</span> {statuses[status]}</p>
        </div>
        <figure className="px-browser px-browser--raised">
          <div className="px-browser-bar" aria-hidden="true"><span /><span /><span /></div>
          <img
            src={status < 3 ? "/demo-media/crm/leads-list.png" : "/demo-media/crm/lead-file.png"}
            alt={place?.[0] || "CRM"}
            width="1400"
            height="900"
          />
        </figure>
      </section>

      <section className="px-quote" id="px-1" data-reveal>
        <h2>{team?.[0]}</h2>
        {(team?.[1] || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
      </section>

      <section className="px-flow" id="px-3" data-reveal>
        <div className="px-flow-head">
          <h2>{flow?.[0]}</h2>
          {(flow?.[1] || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        </div>
        <div className="px-steps" role="tablist">
          {(page.steps || []).map((item, index) => (
            <button
              key={item}
              type="button"
              role="tab"
              id={`px-step-${index}`}
              aria-selected={step === index}
              aria-controls="px-step-panel"
              className={step === index ? "is-on" : ""}
              onClick={() => setStep(index)}
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item}
            </button>
          ))}
        </div>
        <div className="px-flow-stage" id="px-step-panel" role="tabpanel" aria-labelledby={`px-step-${step}`}>
          <figure className="px-browser">
            <div className="px-browser-bar" aria-hidden="true"><span /><span /><span /></div>
            {STEP_MEDIA.map((media, index) => (
              <img
                key={media.src}
                src={media.src}
                alt=""
                width={media.width}
                height={media.height}
                className={step === index ? "is-on" : ""}
              />
            ))}
          </figure>
          <p>{page.steps?.[step]}</p>
        </div>
      </section>

      <section className="px-calendar" id="px-4" data-reveal>
        <figure className="px-browser px-browser--wide">
          <div className="px-browser-bar" aria-hidden="true"><span /><span /><span /></div>
          <img src="/demo-media/home/appointments.jpg" alt={decisions?.[0] || ""} width="1600" height="1000" />
        </figure>
        <div className="px-calendar-card">
          <h2>{decisions?.[0]}</h2>
          {(decisions?.[1] || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        </div>
      </section>

      <section className="px-tools" id="px-2" data-reveal>
        <div className="px-tools-copy">
          <h2>{fit?.[0]}</h2>
          {(fit?.[1] || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
          <div className="px-links">
            {page.links.map(([to, label]) => <Link key={to} to={to}>{label}</Link>)}
          </div>
        </div>
        <div className="px-tools-stage">
          <figure className="px-browser px-browser--back">
            <div className="px-browser-bar" aria-hidden="true"><span /><span /><span /></div>
            <img src="/demo-media/websites/my-sites.jpg" alt={fit?.[0] || ""} width="1400" height="900" />
          </figure>
          <figure className="px-browser px-browser--front">
            <div className="px-browser-bar" aria-hidden="true"><span /><span /><span /></div>
            <img src="/demo-media/whatsapp/still-3.jpg" alt="WhatsApp" width="1600" height="1000" />
          </figure>
        </div>
      </section>

      {industries.length ? (
        <section className="px-industries" data-reveal>
          <h2>{industryGroup?.label}</h2>
          <ul>
            {industries.map((link) => (
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

      <section className="px-plans" id="px-5" data-reveal>
        <h2>{start?.[0]}</h2>
        <div className="px-plan-grid">
          {ui.plans.map(([name, detail]) => (
            <article key={name}>
              <h3>{name}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        {(start?.[1] || []).map((paragraph) => <p key={paragraph.slice(0, 40)}>{paragraph}</p>)}
        <Link className="px-btn px-btn--solid" to="/pricing">{ui.pricing}</Link>
      </section>

      <section className="px-faq" data-reveal>
        <h2>{locale === "he" ? "שאלות נפוצות" : locale === "ar" ? "أسئلة شائعة" : locale === "es" ? "Preguntas frecuentes" : locale === "pt-BR" ? "Perguntas frequentes" : "FAQ"}</h2>
        {faqs.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}</summary>
            <p>{answer}</p>
          </details>
        ))}
      </section>

      <section className="px-close" data-reveal>
        <h2>{page.h1}</h2>
        <p>{page.description}</p>
        <Link className="px-btn px-btn--light" to="/contact">{ui.contact}</Link>
      </section>
    </article>
  );
}
