import React from "react";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Building2,
  Calculator,
  Check,
  Code2,
  FileText,
  Fingerprint,
  KeyRound,
  Lock,
  Network,
  Plug,
  ReceiptText,
  RefreshCw,
  ShieldCheck,
  Webhook,
  Workflow,
} from "lucide-react";
import ApiFlowDemo from "../ApiFlowDemo";
import HeroSimulation from "../HeroSimulation";
import { CodeBlock, SectionHead } from "../ui";
import { SiteLink, englishOnly } from "../siteConfig";

type HeroCopy = {
  eyebrow: string;
  lines: [string, string];
  lead: string;
  connect: string;
  explore: string;
  priceUnit: string;
  metaNote: string;
};

const HERO: Record<string, HeroCopy> = {
  en: {
    eyebrow: "Official WhatsApp Cloud API",
    lines: ["WhatsApp API.", "Built for Your Business."],
    lead: "Connect your CRM, website, SaaS platform or custom system to WhatsApp with a clean REST API and signed webhooks.",
    connect: "Connect WhatsApp",
    explore: "Explore API",
    priceUnit: "/month per number",
    metaNote: "Meta messaging fees are billed separately.",
  },
  he: {
    eyebrow: "WhatsApp Cloud API הרשמי",
    lines: ["WhatsApp API.", "נבנה עבור העסק שלכם."],
    lead: "חברו CRM, אתר, פלטפורמת SaaS או מערכת מותאמת ל-WhatsApp באמצעות REST API פשוט ו-Webhooks חתומים.",
    connect: "חיבור WhatsApp",
    explore: "גלו את ה-API",
    priceUnit: "לחודש לכל מספר",
    metaNote: "עלויות ההודעות של Meta מחויבות בנפרד.",
  },
  es: {
    eyebrow: "WhatsApp Cloud API oficial",
    lines: ["WhatsApp API.", "Diseñada para su negocio."],
    lead: "Conecte su CRM, sitio web, plataforma SaaS o sistema propio a WhatsApp con una API REST clara y webhooks firmados.",
    connect: "Conectar WhatsApp",
    explore: "Explorar la API",
    priceUnit: "/mes por número",
    metaNote: "Las tarifas de mensajería de Meta se facturan por separado.",
  },
  "pt-BR": {
    eyebrow: "WhatsApp Cloud API oficial",
    lines: ["WhatsApp API.", "Feita para o seu negócio."],
    lead: "Conecte seu CRM, site, plataforma SaaS ou sistema próprio ao WhatsApp com uma API REST clara e webhooks assinados.",
    connect: "Conectar WhatsApp",
    explore: "Explorar a API",
    priceUnit: "/mês por número",
    metaNote: "As tarifas de mensagens da Meta são cobradas separadamente.",
  },
  ar: {
    eyebrow: "WhatsApp Cloud API الرسمية",
    lines: ["WhatsApp API.", "مصممة لأعمالك."],
    lead: "اربط نظام CRM أو موقعك أو منصة SaaS أو نظامك الخاص بـ WhatsApp عبر REST API واضحة وWebhooks موقّعة.",
    connect: "ربط WhatsApp",
    explore: "استكشف الواجهة",
    priceUnit: "شهريًا لكل رقم",
    metaNote: "رسوم المراسلة من Meta تُحتسب بشكل منفصل.",
  },
};

const TRUST = ["REST + OpenAPI 3.0", "HMAC-signed webhooks", "Idempotent sends"];

const BENEFITS = [
  {
    icon: BadgeCheck,
    title: "Official WhatsApp Cloud API",
    text: "Integration using Meta's official Cloud API.",
  },
  {
    icon: Workflow,
    title: "Connect Your Existing Systems",
    text: "Connect your CRM, website or custom application using our API.",
  },
  {
    icon: ReceiptText,
    title: "Transparent Pricing",
    text: "$29/month per number, with Meta messaging fees billed separately.",
  },
];

const PLAN_INCLUDES = [
  "WhatsApp Cloud API connection",
  "API & Webhooks",
  "Message templates",
  "Management dashboard",
  "Performance analytics",
];

const ONBOARDING = [
  ["Meta Business account", "Use an existing one or create it during signup."],
  ["Embedded Signup", "Meta's own flow, opened from the Bizuply dashboard."],
  ["Verify the number", "Confirm ownership with a code by SMS or voice call."],
  ["Templates approved", "Submit templates; Meta reviews each one."],
  ["Create an API key", "Start sending from your own system."],
] as const;

const SECURITY = [
  { icon: KeyRound, title: "Hashed API keys", text: "Keys are shown once, then stored only as a SHA-256 hash and a short visible prefix." },
  { icon: Fingerprint, title: "Signed webhooks", text: "Every event carries an HMAC-SHA256 signature and timestamp you can verify." },
  { icon: Lock, title: "Encrypted Meta tokens", text: "Meta access tokens are encrypted at rest and never returned to the browser or your integration." },
  { icon: ShieldCheck, title: "Tenant isolation", text: "Each key is bound to one business, and every API request is scoped to it." },
];

export default function OverviewPage({ lang }: { lang: string }) {
  const hero = HERO[lang] || HERO.en;
  const en = englishOnly(lang);
  return (
    <>
      <section className="wa-hero" aria-labelledby="wa-hero-title">
        <div className="wa-wrap">
          <div className="wa-hero-grid">
            <div className="wa-hero-copy">
              <p className="wa-pill">
                <span className="wa-pill-dot" aria-hidden="true" />
                {hero.eyebrow}
              </p>
              <h1 id="wa-hero-title" className="wa-display">
                {hero.lines[0]}
                <br />
                <span className="wa-accent">{hero.lines[1]}</span>
              </h1>
              <p className="wa-lead">{hero.lead}</p>
              <div className="wa-hero-price" aria-label={`$29 ${hero.priceUnit}. ${hero.metaNote}`}>
                <div className="wa-hero-price-main" aria-hidden="true">
                  <strong>$29</strong>
                  <span>{hero.priceUnit}</span>
                </div>
                <p aria-hidden="true">{hero.metaNote}</p>
              </div>
              <div className="wa-actions">
                <SiteLink to="/get-started" className="wa-btn wa-btn-primary wa-btn-lg">
                  {hero.connect} <ArrowRight size={16} aria-hidden="true" />
                </SiteLink>
                <SiteLink to="/docs" className="wa-btn wa-btn-ghost wa-btn-lg">
                  <Code2 size={16} aria-hidden="true" /> {hero.explore}
                </SiteLink>
              </div>
              <ul className="wa-hero-trust" {...en}>
                {TRUST.map((item) => (
                  <li key={item}><Check size={14} aria-hidden="true" /> {item}</li>
                ))}
              </ul>
            </div>
            <div className="wa-hero-visual">
              <HeroSimulation />
            </div>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-tight wa-benefits" aria-label="Key benefits">
        <div className="wa-wrap">
          <div className="wa-grid-3">
            {BENEFITS.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="wa-card is-hover wa-benefit">
                  <div className="wa-card-icon"><Icon size={20} aria-hidden="true" /></div>
                  <h2 className="wa-h3">{item.title}</h2>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-how">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow="How it works"
              title={<span id="wa-how">Follow one message from request to receipt.</span>}
              lead="Step through a send in detail: the request your system makes, what Bizuply checks, how the message reaches WhatsApp, and how status updates come back as signed webhooks."
            />
          </div>
          <div className="wa-reveal">
            <ApiFlowDemo />
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-official">
        <div className="wa-wrap wa-split wa-reveal">
          <div>
            <p className="wa-eyebrow">Official integration</p>
            <h2 id="wa-official" className="wa-h2">Built on the official WhatsApp Cloud API.</h2>
            <p className="wa-lead">
              Every message is sent through Meta's WhatsApp Cloud API. Bizuply handles the Meta connection and gives your
              systems a simpler, stable API, so your code never touches Meta access tokens.
            </p>
            <ul className="wa-list">
              <li><Check size={16} aria-hidden="true" /> Numbers are connected through Meta Embedded Signup</li>
              <li><Check size={16} aria-hidden="true" /> Meta's messaging policies, quality ratings and limits apply as usual</li>
              <li><Check size={16} aria-hidden="true" /> Your integration authenticates with a Bizuply API key</li>
            </ul>
          </div>
          <div className="wa-feature-visual">
            <dl className="wa-kv">
              <div><dt>Messaging network</dt><dd>Meta WhatsApp Cloud API</dd></div>
              <div><dt>Number onboarding</dt><dd>Meta Embedded Signup</dd></div>
              <div><dt>Meta access token</dt><dd>Held by Bizuply, encrypted</dd></div>
              <div><dt>Your credential</dt><dd><code>biz_live_…</code> API key</dd></div>
              <div><dt>Base URL</dt><dd><code>api.bizuply.com/api/v1/whatsapp</code></dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-onboarding">
        <div className="wa-wrap wa-split is-flip wa-reveal">
          <div>
            <p className="wa-eyebrow">Fast onboarding</p>
            <h2 id="wa-onboarding" className="wa-h2">From Meta account to first message, step by step.</h2>
            <p className="wa-lead">
              Connect a number through Meta's Embedded Signup, inside the Bizuply dashboard. There's no separate Bizuply
              approval queue. Meta's own checks still apply, so timing depends on your account.
            </p>
            <p className="wa-fine">
              Meta may ask for business verification, review your display name, or limit messaging volume until your account
              builds a track record.
            </p>
            <div className="wa-actions">
              <SiteLink to="/get-started" className="wa-btn wa-btn-ghost">
                See the onboarding steps <ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
            </div>
          </div>
          <ol className="wa-steps wa-feature-visual" style={{ padding: 24 }}>
            {ONBOARDING.map(([title, text], i) => (
              <li className="wa-step" key={title}>
                <span className="wa-step-n" aria-hidden="true">0{i + 1}</span>
                <div className="wa-step-body">
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-capabilities">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow="Capabilities"
              title={<span id="wa-capabilities">Everything your system needs to talk on WhatsApp.</span>}
              lead="A focused API, signed events and the tools to manage templates, all built around one WhatsApp number per workspace."
            />
          </div>
          <div className="wa-grid-3 wa-reveal">
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Webhook size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">API and webhooks</h3>
              <p>
                Send approved templates with one POST, look up message status, and receive signed status webhooks:
                accepted, sent, delivered, read and failed.
              </p>
              <div style={{ marginTop: 18 }}>
                <div className="wa-event-row"><span>whatsapp.message.delivered</span><span className="wa-badge is-ok">200</span></div>
                <div className="wa-event-row"><span>whatsapp.message.read</span><span className="wa-badge is-ok">200</span></div>
              </div>
            </article>
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><FileText size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Message templates</h3>
              <p>
                Create templates in the dashboard and submit them to Meta for review. Your system lists approved templates
                and reads the variable order straight from the API.
              </p>
              <div style={{ marginTop: 18 }}>
                <div className="wa-event-row"><span>order_update · en</span><span className="wa-badge is-ok">APPROVED</span></div>
                <div className="wa-event-row"><span>appointment_reminder · es</span><span className="wa-badge is-warn">PENDING</span></div>
              </div>
            </article>
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Plug size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">CRM and custom systems</h3>
              <p>
                Any system that can make an HTTPS request can send WhatsApp messages: your CRM, website, SaaS backend,
                ERP or internal tools. No plugins or vendor lock-in.
              </p>
              <div style={{ marginTop: 18 }}>
                <div className="wa-event-row"><span>POST /messages/template</span><span className="wa-badge is-info">201</span></div>
                <div className="wa-event-row"><span>GET /templates</span><span className="wa-badge is-info">200</span></div>
              </div>
            </article>
          </div>
          <div className="wa-split wa-reveal" style={{ marginTop: 56 }}>
            <div>
              <h3 className="wa-h2" style={{ fontSize: "clamp(1.5rem, 2.6vw, 2rem)" }}>One call to send. One event to confirm.</h3>
              <p className="wa-lead">
                Use the template variables in order, add an Idempotency-Key for safe retries, and pass your own{" "}
                <code>externalId</code> so every webhook maps straight back to the right record.
              </p>
              <div className="wa-actions">
                <SiteLink to="/developers" className="wa-btn wa-btn-ghost">
                  Developer overview <ArrowRight size={16} aria-hidden="true" />
                </SiteLink>
              </div>
            </div>
            <CodeBlock
              title="send.ts"
              language="js"
              code={`await fetch("https://api.bizuply.com/api/v1/whatsapp/messages/template", {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${process.env.BIZUPLY_API_KEY}\`,
    "Content-Type": "application/json",
    "Idempotency-Key": "order-1042-confirmation",
  },
  body: JSON.stringify({
    to: "+15551234567",
    template: "order_update",
    variables: ["Avery", "1042"],
    externalId: "order_1042",
  }),
});`}
            />
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-pricing">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              center
              eyebrow="Transparent pricing"
              title={<span id="wa-pricing">One plan. One price per number.</span>}
              lead="A flat Bizuply subscription for each connected WhatsApp number. Meta's messaging fees are separate and billed by Meta."
            />
          </div>
          <div className="wa-pricing-block wa-reveal">
            <article className="wa-plan-card">
              <div className="wa-plan-card-head">
                <p className="wa-eyebrow">Bizuply plan</p>
                <span className="wa-badge is-ok">Per WhatsApp number</span>
              </div>
              <div className="wa-price is-xl">
                <strong>$29</strong>
                <span>/month<br />per WhatsApp number</span>
              </div>
              <p className="wa-plan-note">Meta messaging fees are billed separately, in addition to the subscription.</p>
              <ul className="wa-plan-list">
                {PLAN_INCLUDES.map((item) => (
                  <li key={item}><span aria-hidden="true"><Check size={14} /></span>{item}</li>
                ))}
              </ul>
              <div className="wa-actions">
                <SiteLink to="/get-started" className="wa-btn wa-btn-primary wa-btn-lg">
                  Connect WhatsApp <ArrowRight size={16} aria-hidden="true" />
                </SiteLink>
                <SiteLink to="/pricing" className="wa-btn wa-btn-ghost wa-btn-lg">Pricing details</SiteLink>
              </div>
            </article>
            <div className="wa-plan-side">
              <article className="wa-card">
                <div className="wa-card-icon is-cyan"><ReceiptText size={20} aria-hidden="true" /></div>
                <h3 className="wa-h3">Meta messaging fees</h3>
                <p>
                  Meta charges per message, based on the recipient's country and the message category. These charges go to
                  the payment method on your WhatsApp Business Account, not to your Bizuply subscription.
                </p>
              </article>
              <article className="wa-card is-hover">
                <div className="wa-card-icon is-cyan"><Calculator size={20} aria-hidden="true" /></div>
                <h3 className="wa-h3">Estimate your total</h3>
                <p>Use Meta's published rate card to estimate messaging costs by country, category and volume.</p>
                <SiteLink to="/pricing#calculator" className="wa-link" style={{ marginTop: 14 }}>
                  Open the cost calculator <ArrowRight size={14} aria-hidden="true" />
                </SiteLink>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-security">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow="Security"
              title={<span id="wa-security">Security built into the integration.</span>}
              lead="The controls below are how the platform works today. We don't display certifications we haven't earned."
            />
          </div>
          <div className="wa-grid-4 wa-reveal">
            {SECURITY.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="wa-card">
                  <div className="wa-card-icon"><Icon size={20} aria-hidden="true" /></div>
                  <h3 className="wa-h3">{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              );
            })}
          </div>
          <div className="wa-actions wa-reveal">
            <SiteLink to="/security" className="wa-link">
              Read the security overview <ArrowRight size={14} aria-hidden="true" />
            </SiteLink>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-band" aria-labelledby="wa-analytics">
        <div className="wa-wrap wa-split wa-reveal">
          <div>
            <p className="wa-eyebrow">Performance analytics</p>
            <h2 id="wa-analytics" className="wa-h2">See how your messages perform.</h2>
            <p className="wa-lead">
              The dashboard pulls messaging analytics from Meta for the date range you choose: sent, delivered and read
              counts, template-level results and Meta cost data, with CSV export.
            </p>
            <ul className="wa-list">
              <li><RefreshCw size={16} aria-hidden="true" /> Synced from Meta's analytics for your WhatsApp Business Account</li>
              <li><BarChart3 size={16} aria-hidden="true" /> Per-template insights when Meta template analytics are enabled</li>
              <li><Check size={16} aria-hidden="true" /> Message status for every API send, available through the API</li>
            </ul>
          </div>
          <div className="wa-feature-visual" aria-label="Illustration of the analytics dashboard">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <span className="wa-mono" style={{ fontSize: 12, color: "var(--wa-muted)" }}>Messages · last 14 days</span>
              <span className="wa-badge">Illustration</span>
            </div>
            <div className="wa-bars" aria-hidden="true">
              {[42, 58, 51, 66, 72, 61, 49, 70, 84, 77, 69, 88, 93, 81].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
            <dl className="wa-kv" style={{ marginTop: 14 }}>
              <div><dt>Delivered</dt><dd>Live from Meta in your dashboard</dd></div>
              <div><dt>Read</dt><dd>Per day and per template</dd></div>
            </dl>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section" aria-labelledby="wa-solutions">
        <div className="wa-wrap">
          <div className="wa-reveal">
            <SectionHead
              eyebrow="Solutions"
              title={<span id="wa-solutions">For developers and the agencies they build for.</span>}
            />
          </div>
          <div className="wa-grid-2 wa-reveal">
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Code2 size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Developers and SaaS teams</h3>
              <p>
                Add WhatsApp to your product with a small REST API, signed webhooks and examples in cURL, JavaScript and
                Python.
              </p>
              <div className="wa-actions">
                <SiteLink to="/developers" className="wa-link">For developers <ArrowRight size={14} aria-hidden="true" /></SiteLink>
                <SiteLink to="/docs" className="wa-link">Documentation <ArrowRight size={14} aria-hidden="true" /></SiteLink>
              </div>
            </article>
            <article className="wa-card is-hover">
              <div className="wa-card-icon"><Building2 size={20} aria-hidden="true" /></div>
              <h3 className="wa-h3">Agencies and software companies</h3>
              <p>
                Connect each client's WhatsApp number with its own isolated API key and webhook, then plug it into the
                systems you build for them.
              </p>
              <div className="wa-actions">
                <SiteLink to="/agencies" className="wa-link">Bizuply for Agencies <ArrowRight size={14} aria-hidden="true" /></SiteLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section {...en} className="wa-section is-tight">
        <div className="wa-wrap wa-reveal">
          <div className="wa-cta">
            <div>
              <h2 className="wa-h2">Connect your first WhatsApp number.</h2>
              <p className="wa-lead">$29/month per number. Meta messaging fees are billed separately.</p>
            </div>
            <div className="wa-actions">
              <SiteLink to="/get-started" className="wa-btn wa-btn-primary">
                <Network size={16} aria-hidden="true" /> Connect WhatsApp
              </SiteLink>
              <SiteLink to="/docs" className="wa-btn wa-btn-ghost">Explore API</SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
