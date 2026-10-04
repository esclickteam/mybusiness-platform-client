import React, { useMemo, useState } from "react";
import { BookOpen, FileText, LifeBuoy, Mail, Search, ShieldCheck } from "lucide-react";
import ContactRequestForm from "../ContactRequestForm";
import { PRIVACY_URL, SIGN_IN_URL, SUPPORT_EMAIL, SiteLink, TERMS_URL } from "../siteConfig";
import { Accordion, SectionHead } from "../ui";

type Topic = "Getting started" | "Meta & verification" | "Numbers" | "Templates & messaging" | "Billing" | "API & webhooks";

const TOPICS: Topic[] = ["Getting started", "Meta & verification", "Numbers", "Templates & messaging", "Billing", "API & webhooks"];

const ARTICLES: Array<{ topic: Topic; q: string; a: string }> = [
  {
    topic: "Getting started",
    q: "How do I start?",
    a: "If you already have a Bizuply account, log in and open WhatsApp → Connection to start Meta's Embedded Signup. If you're new, send the onboarding request on the Connect WhatsApp page and we'll reply with access.",
  },
  {
    topic: "Getting started",
    q: "Is this the official WhatsApp API?",
    a: "Yes. Messages are sent through Meta's official WhatsApp Cloud API, and numbers are connected through Meta's Embedded Signup. Bizuply provides the API, webhooks, dashboard and tools on top.",
  },
  {
    topic: "Getting started",
    q: "Do I need to write code?",
    a: "No, not to send from the dashboard. The API is for connecting WhatsApp to your own systems, such as a CRM, website, SaaS product or internal tools.",
  },
  {
    topic: "Meta & verification",
    q: "Does Meta need to approve my account?",
    a: "Meta reviews display names and may ask for business verification or review the account, depending on the business and use case. Bizuply doesn't add its own approval queue, but it can't skip Meta's checks either.",
  },
  {
    topic: "Meta & verification",
    q: "How long does onboarding take?",
    a: "The Embedded Signup flow itself is short. The time before you can message at full volume depends on Meta's reviews and the messaging limits Meta sets for your account, so we don't promise a fixed time.",
  },
  {
    topic: "Meta & verification",
    q: "Why can I only message a limited number of customers?",
    a: "Meta sets a messaging limit on how many unique customers you can start conversations with in 24 hours. It increases as you send good-quality messages. WhatsApp → Connection shows your current limit and quality rating.",
  },
  {
    topic: "Numbers",
    q: "Can I use my existing number?",
    a: "Often, yes. The number must be able to receive a verification code by SMS or voice call. If it's currently used in the WhatsApp or WhatsApp Business app, it may need to be migrated or removed from the app first, depending on what Meta supports.",
  },
  {
    topic: "Numbers",
    q: "Can I connect more than one number?",
    a: "Not from one account yet. Each subscription covers one WhatsApp number with its own API key and webhook. If you need several numbers today, contact us and we'll set them up for you.",
  },
  {
    topic: "Templates & messaging",
    q: "Why do I have to use templates?",
    a: "WhatsApp requires an approved template to start a conversation with a customer. The Bizuply API sends approved templates. Replies inside the 24-hour customer service window are handled in the Bizuply inbox.",
  },
  {
    topic: "Templates & messaging",
    q: "My template was rejected. What now?",
    a: "Meta rejects templates that break its policies or don't fit the chosen category. Edit the content or category in WhatsApp → Templates and submit it again. Rejected and pending templates can't be sent through the API.",
  },
  {
    topic: "Billing",
    q: "What does Bizuply charge?",
    a: "$29 per month per connected WhatsApp number. Meta's messaging charges are separate.",
  },
  {
    topic: "Billing",
    q: "How are Meta's charges billed?",
    a: "In the standard setup, Meta bills messaging charges to the payment method on your WhatsApp Business Account. Use the cost calculator on the Pricing page to estimate them.",
  },
  {
    topic: "Billing",
    q: "What happens if I cancel?",
    a: "You can cancel from your dashboard at any time. Your WhatsApp API access keeps working until the end of the period you've already paid for, and you can resume the subscription before then. After the paid period ends, API access stops until you subscribe again. Meta's charges for messages already sent are billed by Meta as usual.",
  },
  {
    topic: "Billing",
    q: "What happens if payment fails?",
    a: "If a renewal payment fails, your access continues for a short grace period while you update your payment method. If the payment still hasn't gone through when the grace period ends, WhatsApp API access is paused until the subscription is paid.",
  },
  {
    topic: "API & webhooks",
    q: "Where do I get an API key?",
    a: "In the dashboard under WhatsApp → API / Developers. The key is shown once. If you lose it, regenerate it; the previous key stops working immediately.",
  },
  {
    topic: "API & webhooks",
    q: "My webhook isn't receiving events.",
    a: "Check that the URL uses https and returns a 2xx status within 15 seconds, and that you verify the signature over the raw request body. Use 'Send test webhook' in WhatsApp → API / Developers to test. Failed deliveries are retried up to five times.",
  },
  {
    topic: "API & webhooks",
    q: "I get WHATSAPP_NOT_CONNECTED.",
    a: "The workspace behind your API key has no fully connected WhatsApp number. Open WhatsApp → Connection to finish or repair the connection.",
  },
  {
    topic: "API & webhooks",
    q: "Do webhooks include customer replies?",
    a: "Not yet. Webhooks cover outbound message status: accepted, sent, delivered, read and failed. Customer replies appear in the Bizuply WhatsApp inbox.",
  },
];

export default function HelpPage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<Topic | null>(null);

  const results = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    return ARTICLES.filter((article) => {
      if (topic && article.topic !== topic) return false;
      const text = `${article.q} ${article.a} ${article.topic}`.toLowerCase();
      return terms.every((term) => text.includes(term));
    });
  }, [query, topic]);

  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow="Help Center"
            title="How can we help?"
            lead="Answers about onboarding, Meta's requirements, numbers, templates, billing and the API."
          />
          <div className="wa-help-search" role="search">
            <Search size={18} aria-hidden="true" />
            <label htmlFor="wa-help-search" className="wa-sr">Search help articles</label>
            <input
              id="wa-help-search"
              className="wa-input"
              type="search"
              placeholder="Search, e.g. verification, webhook, template"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              autoComplete="off"
            />
          </div>
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-help-articles">
        <div className="wa-wrap" style={{ maxWidth: 900 }}>
          <h2 id="wa-help-articles" className="wa-sr">Help articles</h2>
          <div className="wa-chips" role="group" aria-label="Filter by topic">
            <button type="button" className="wa-chip" aria-pressed={topic === null} onClick={() => setTopic(null)}>All</button>
            {TOPICS.map((item) => (
              <button key={item} type="button" className="wa-chip" aria-pressed={topic === item} onClick={() => setTopic(topic === item ? null : item)}>
                {item}
              </button>
            ))}
          </div>
          <p className="wa-fine" aria-live="polite" style={{ marginBottom: 14 }}>
            {results.length} {results.length === 1 ? "article" : "articles"}
          </p>
          {results.length ? (
            <Accordion key={`${topic}-${query}`} items={results.map((article) => ({ q: article.q, a: article.a }))} />
          ) : (
            <div className="wa-card">
              <p style={{ margin: 0 }}>
                No articles match. Try another term, or contact support below.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-help-resources">
        <div className="wa-wrap">
          <h2 id="wa-help-resources" className="wa-h2" style={{ marginBottom: 28 }}>Resources</h2>
          <div className="wa-grid-4">
            <SiteLink to="/docs" className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><BookOpen size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Documentation</h3>
              <p>API guides, webhooks and the endpoint reference.</p>
            </SiteLink>
            <SiteLink to="/security" className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><ShieldCheck size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Security</h3>
              <p>How keys, webhooks and Meta tokens are protected.</p>
            </SiteLink>
            <a href={PRIVACY_URL} className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Privacy Policy</h3>
              <p>How Bizuply handles personal data.</p>
            </a>
            <a href={TERMS_URL} className="wa-card is-hover" style={{ textDecoration: "none" }}>
              <div className="wa-card-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Terms of Service</h3>
              <p>The terms for using Bizuply.</p>
            </a>
          </div>
        </div>
      </section>

      <section className="wa-section" id="contact" aria-labelledby="wa-help-contact">
        <div className="wa-wrap wa-split" style={{ alignItems: "start" }}>
          <div>
            <p className="wa-eyebrow"><LifeBuoy size={14} aria-hidden="true" /> Support</p>
            <h2 id="wa-help-contact" className="wa-h2">Contact support.</h2>
            <p className="wa-lead">
              Send the form, or email us. For API issues, include the <code>requestId</code> from the error response.
            </p>
            <ul className="wa-list">
              <li><Mail size={16} aria-hidden="true" /> <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></li>
              <li><LifeBuoy size={16} aria-hidden="true" /> <span>Existing customers can also <a className="wa-link" href={SIGN_IN_URL}>log in</a> and see live connection status under WhatsApp → Connection.</span></li>
            </ul>
            <p className="wa-fine">
              There is no public service status page yet. Connection and Meta account status are shown live in your dashboard.
            </p>
          </div>
          <div className="wa-card">
            <ContactRequestForm defaultIntent="support" />
          </div>
        </div>
      </section>
    </>
  );
}
