import React from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, ExternalLink } from "lucide-react";
import { coerceSupportedLanguage, getTextDirection } from "../../../../i18n/localeUtils";
import MetaCostCalculator from "../../../business/dashboardPages/whatsapp/MetaCostCalculator";
import { META_PRICING_URL, SiteLink } from "../siteConfig";
import { Accordion, Callout, SectionHead } from "../ui";

const INCLUDED = [
  "One connected WhatsApp number",
  "Meta Embedded Signup onboarding",
  "REST API, API key and signed webhooks",
  "Template creation and Meta review tracking",
  "WhatsApp inbox and message history",
  "Meta-synced analytics and cost view",
  "Email support",
];

const FAQ = [
  {
    q: "What does the $29 cover?",
    a: "The Bizuply subscription for one connected WhatsApp number: onboarding, the API and webhooks, templates, inbox, analytics and the dashboard. One subscription covers one number; managing several numbers from one account isn't available yet.",
  },
  {
    q: "Are Meta's messaging charges included?",
    a: "No. Meta charges for template messages based on the recipient's country and the message category. Those charges are separate from the Bizuply subscription.",
  },
  {
    q: "Who bills the Meta charges?",
    a: "In the standard setup, Meta bills messaging charges to the payment method on your WhatsApp Business Account. You manage that payment method in Meta Business Manager, and the dashboard links you there.",
  },
  {
    q: "Why might my Meta invoice differ from the estimate?",
    a: "The calculator applies Meta's published list rates and volume tiers to the volumes you enter. Actual charges depend on what Meta delivers and bills, free messages you qualify for, currency, taxes and any rate changes Meta makes.",
  },
  {
    q: "Can I see my actual Meta costs after I connect?",
    a: "Yes. Once connected, the Meta costs view in the dashboard loads your account's Meta pricing analytics for the current period and can prefill the forecast with them.",
  },
];

export default function PricingPage() {
  const { i18n } = useTranslation();
  const lang = coerceSupportedLanguage(i18n.language);
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow="Pricing"
            title="$29/month per WhatsApp number."
            lead="One flat Bizuply subscription for each connected number. Meta's messaging charges are separate, and the calculator below estimates them from Meta's published rate card."
          />
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-plan">
        <div className="wa-wrap wa-grid-2" style={{ alignItems: "stretch" }}>
          <article className="wa-card is-featured wa-plan">
            <h2 id="wa-plan" className="wa-eyebrow">Bizuply subscription</h2>
            <div className="wa-price">
              <strong>$29</strong>
              <span>/ month per WhatsApp number</span>
            </div>
            <p>Everything you need to connect a number and integrate it with your systems.</p>
            <ul className="wa-list">
              {INCLUDED.map((item) => (
                <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
              ))}
            </ul>
            <div className="wa-actions">
              <SiteLink to="/get-started#request-access" className="wa-btn wa-btn-primary">
                Connect WhatsApp <ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
              <SiteLink to="/agencies" className="wa-btn wa-btn-ghost">Several numbers?</SiteLink>
            </div>
          </article>
          <article className="wa-card wa-plan">
            <h2 className="wa-eyebrow" style={{ color: "var(--wa-cyan)" }}>Meta messaging charges</h2>
            <div className="wa-price">
              <strong style={{ fontSize: "2.2rem" }}>Additional</strong>
            </div>
            <p>Set and billed by Meta, separate from your Bizuply subscription.</p>
            <ul className="wa-list is-muted">
              <li><Check size={16} aria-hidden="true" /> Priced per message by recipient country and category: marketing, utility, authentication or service</li>
              <li><Check size={16} aria-hidden="true" /> Volume tiers can lower utility and authentication rates</li>
              <li><Check size={16} aria-hidden="true" /> Billed to the payment method on your WhatsApp Business Account</li>
              <li><Check size={16} aria-hidden="true" /> Rates are set by Meta and can change</li>
            </ul>
            <div className="wa-actions">
              <a href="#calculator" className="wa-btn wa-btn-ghost">Estimate Meta costs</a>
              <a href={META_PRICING_URL} className="wa-btn wa-btn-quiet" target="_blank" rel="noreferrer">
                Meta's pricing page <ExternalLink size={14} aria-hidden="true" />
              </a>
            </div>
          </article>
        </div>
      </section>

      <section className="wa-section" id="calculator" aria-label="Meta messaging cost calculator">
        <div className="wa-wrap">
          <Callout tone="info">
            <p>
              <strong>Where the rates come from:</strong> Bizuply imports Meta's published rate card workbooks and checks for
              updates automatically. The calculator shows the rate card's effective date, when it was last imported, and a
              link to the source. If a fresh import fails, you'll see a warning rather than an outdated rate presented as
              current.
            </p>
          </Callout>
          <div style={{ marginTop: 24 }}>
            <div lang={lang} dir={getTextDirection(lang)}>
              <MetaCostCalculator variant="public" />
            </div>
          </div>
          <Callout tone="warn">
            <p>
              Estimates only. Meta's invoice is final. Your actual charges depend on delivered messages, free messages you're
              eligible for, currency conversion, taxes and Meta's current rates. Using the WhatsApp Business Platform is
              subject to Meta's terms, commerce and messaging policies.
            </p>
          </Callout>
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-pricing-faq">
        <div className="wa-wrap" style={{ maxWidth: 860 }}>
          <SectionHead eyebrow="Pricing FAQ" title={<span id="wa-pricing-faq">Pricing questions, answered.</span>} />
          <Accordion items={FAQ} defaultOpen={0} />
        </div>
      </section>
    </>
  );
}
