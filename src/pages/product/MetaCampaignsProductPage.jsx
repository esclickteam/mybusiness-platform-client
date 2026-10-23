import React from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { BarChart3, Megaphone, ShieldCheck, Target } from "lucide-react";
import {
  CenteredProductHero,
  FaqAccordion,
  FinalCta,
  SectionHeading,
  SpotlightCard,
} from "../../components/product-marketing";
import { getTextDirection } from "../../i18n/localeUtils";
import { getHebrewMarketingPage } from "../../lib/hebrewMarketing.mjs";
import { getLocaleMarketingPage } from "../../lib/localeMarketing.mjs";
import { marketingPublicUrl, normalizeMarketingLocale } from "../../lib/localePath.mjs";
import "../../components/product-marketing/marketingKit.css";
import "../../components/product-marketing/CenteredProductHero.css";

const ENGLISH = {
  title: "Meta Campaign Management | Bizuply",
  description:
    "Create and edit Meta campaigns, ad sets, and ads from the Bizuply dashboard, and send Lead Ads into the CRM. Meta bills the ad spend.",
  h1: "Meta campaigns next to the CRM",
  paragraphs: [
    "From the dashboard the business connects its own Meta ad account. You can create and edit campaigns, ad sets, and ads, with a budget on the campaign or on the ad set.",
    "The dashboard shows performance for the connected campaigns. Lead Ads forms can enter the CRM with a source and a status.",
    "Later follow-up is a CRM task, and on the business plan it can also be an automation. Bizuply does not replace Meta's media bill.",
    "There is no separate campaign price on this page. CRM only is $49 per month. The business plan is $99 per month or $990 per year.",
  ],
};

const COPY = {
  en: {
    eyebrow: "Meta ads",
    levels: "Campaign, ad set, and ad",
    budget: "Budget on the campaign or the ad set",
    leads: "Lead Ads can enter the CRM",
    spend: "Meta bills the ad spend",
    primary: "See pricing",
    secondary: "Open the CRM guide",
    faqTitle: "Questions",
    faqs: [
      ["Can Bizuply create a Meta campaign?", "Yes. After the business connects its own ad account, the dashboard can create and edit campaigns, ad sets, and ads."],
      ["Does Bizuply pay for the ads?", "No. Meta bills the media spend. Bizuply does not add a separate campaign subscription on this page."],
      ["Where do the leads go?", "Lead Ads can enter the CRM with a source and a status. Follow-up is a task, or an automation on the business plan."],
    ],
  },
  he: {
    eyebrow: "מודעות Meta",
    levels: "קמפיין, קבוצת מודעות ומודעה",
    budget: "תקציב בקמפיין או בקבוצה",
    leads: "לידים ממודעות יכולים להיכנס ל־CRM",
    spend: "את הוצאת המדיה גובה Meta",
    primary: "למחירון",
    secondary: "למדריך על הקמפיינים",
    faqTitle: "שאלות",
    faqs: [
      ["אפשר ליצור קמפיין Meta מביזאפלי?", "כן. אחרי שהעסק מחבר את חשבון המודעות שלו, לוח הבקרה יכול ליצור ולערוך קמפיינים, קבוצות מודעות ומודעות."],
      ["ביזאפלי משלמת על המודעות?", "לא. Meta גובה את הוצאת המדיה. אין בעמוד הזה מנוי נפרד לקמפיינים."],
      ["לאן הלידים מגיעים?", "טפסי Lead Ads יכולים להיכנס ל־CRM עם מקור וסטטוס. ההמשך הוא משימה, או אוטומציה בחבילה העסקית."],
    ],
  },
  es: {
    eyebrow: "Anuncios de Meta",
    levels: "Campaña, conjunto y anuncio",
    budget: "Presupuesto en la campaña o en el conjunto",
    leads: "Los Lead Ads pueden entrar al CRM",
    spend: "Meta cobra el gasto",
    primary: "Ver precios",
    secondary: "Abrir la guía",
    faqTitle: "Preguntas",
    faqs: [
      ["¿Bizuply puede crear una campaña de Meta?", "Sí. Después de conectar la cuenta de anuncios, el panel puede crear y editar campañas, conjuntos y anuncios."],
      ["¿Bizuply paga los anuncios?", "No. Meta cobra el gasto. Esta página no añade una suscripción aparte de campañas."],
      ["¿A dónde van los leads?", "Los formularios de Lead Ads pueden entrar al CRM con origen y estado. El seguimiento es una tarea o una automatización del plan de negocio."],
    ],
  },
  "pt-BR": {
    eyebrow: "Anúncios da Meta",
    levels: "Campanha, conjunto e anúncio",
    budget: "Orçamento na campanha ou no conjunto",
    leads: "Lead Ads podem entrar no CRM",
    spend: "A Meta cobra a mídia",
    primary: "Ver preços",
    secondary: "Abrir o guia",
    faqTitle: "Perguntas",
    faqs: [
      ["A Bizuply pode criar uma campanha da Meta?", "Sim. Depois de conectar a conta de anúncios, o painel pode criar e editar campanhas, conjuntos e anúncios."],
      ["A Bizuply paga os anúncios?", "Não. A Meta cobra a mídia. Esta página não cria uma assinatura separada de campanhas."],
      ["Para onde vão os leads?", "Formulários de Lead Ads podem entrar no CRM com origem e status. O acompanhamento é uma tarefa ou uma automação do plano de negócios."],
    ],
  },
  ar: {
    eyebrow: "إعلانات Meta",
    levels: "حملة ومجموعة وإعلان",
    budget: "ميزانية على الحملة أو المجموعة",
    leads: "إعلانات العملاء المحتملين يمكن أن تدخل CRM",
    spend: "Meta تحصّل الإنفاق",
    primary: "الأسعار",
    secondary: "افتحوا الدليل",
    faqTitle: "أسئلة",
    faqs: [
      ["هل تستطيع Bizuply إنشاء حملة Meta؟", "نعم. بعد ربط الحساب الإعلاني يمكن للوحة إنشاء وتحرير الحملات والمجموعات والإعلانات."],
      ["هل تدفع Bizuply ثمن الإعلانات؟", "لا. تحصّل Meta الإنفاق. لا تضيف هذه الصفحة اشتراكاً منفصلاً للحملات."],
      ["إلى أين يذهب العملاء المحتملون؟", "يمكن لنماذج Lead Ads الدخول إلى CRM مع المصدر والحالة. المتابعة مهمة أو أتمتة في الخطة التجارية."],
    ],
  },
};

function pageCopy(locale) {
  if (locale === "he") return getHebrewMarketingPage("/meta-campaigns");
  if (locale === "en") return ENGLISH;
  return getLocaleMarketingPage("/meta-campaigns", locale) || ENGLISH;
}

export default function MetaCampaignsProductPage() {
  const { i18n } = useTranslation();
  const locale = normalizeMarketingLocale(i18n.language);
  const dir = getTextDirection(locale);
  const page = pageCopy(locale);
  const ui = COPY[locale] || COPY.en;
  const canonical = marketingPublicUrl("/meta-campaigns", locale);

  return (
    <div className="pm pm-hero-page" dir={dir}>
      <Helmet>
        <title>{page.title}</title>
        <meta name="description" content={page.description} />
        <link rel="canonical" href={canonical} />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <CenteredProductHero
        ariaLabel={page.h1}
        accent="violet"
        badges={[
          { label: ui.levels, icon: <Megaphone size={13} aria-hidden="true" /> },
          { label: ui.budget, icon: <Target size={13} aria-hidden="true" /> },
          { label: "Meta Tech Provider", icon: <ShieldCheck size={13} aria-hidden="true" /> },
        ]}
        title={page.h1}
        titleHighlight=""
        lead={page.paragraphs[0]}
        note={{ icon: <BarChart3 size={17} aria-hidden="true" />, text: page.paragraphs[1] }}
        stats={[
          { value: 3, label: ui.levels },
          { value: 2, label: ui.budget },
          { value: 49, prefix: "$", label: "CRM" },
          { value: 99, prefix: "$", label: "Business" },
        ]}
        primaryLabel={ui.primary}
        primaryTo="/pricing"
      />
      <section className="pm-section">
        <div className="pm-shell">
          <SectionHeading eyebrow={ui.eyebrow} title={page.h1} lead={page.paragraphs[2]} />
          <div className="pm-grid pm-grid--3">
            {page.paragraphs.slice(0, 3).map((paragraph) => (
              <SpotlightCard key={paragraph.slice(0, 24)}>
                <p>{paragraph}</p>
              </SpotlightCard>
            ))}
          </div>
          <p>
            <Link to="/guides/manage-meta-campaigns">{ui.secondary}</Link>
          </p>
        </div>
      </section>
      <section className="pm-section">
        <div className="pm-shell">
          <SectionHeading title={ui.faqTitle} />
          <FaqAccordion items={ui.faqs.map(([q, a]) => ({ q, a }))} />
        </div>
      </section>
      <FinalCta eyebrow={ui.eyebrow} title={page.h1} text={page.paragraphs[3]} primaryTo="/pricing" primaryLabel={ui.primary} />
    </div>
  );
}
