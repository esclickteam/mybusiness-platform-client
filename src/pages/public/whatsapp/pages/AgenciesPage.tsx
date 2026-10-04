import React from "react";
import {
  ArrowRight,
  BarChart3,
  Check,
  Clock,
  KeyRound,
  Layers,
  MessageSquare,
  Phone,
  Server,
  Settings2,
  Webhook,
} from "lucide-react";
import ContactRequestForm from "../ContactRequestForm";
import { SiteLink } from "../siteConfig";
import { Callout, SectionHead } from "../ui";

const WORKFLOW = [
  {
    icon: Phone,
    title: "Connect customer WhatsApp numbers",
    text: "Each client gets its own Bizuply workspace. The number is connected through Meta Embedded Signup, using the client's own Meta Business account.",
  },
  {
    icon: Settings2,
    title: "Manage connections",
    text: "Each workspace's Connection page shows the connection, phone number and Meta account status, and is where you reconnect if access changes.",
  },
  {
    icon: KeyRound,
    title: "Use API keys",
    text: "Every client workspace has its own API key. A key can only reach its own business's number, templates and messages.",
  },
  {
    icon: Webhook,
    title: "Configure webhooks",
    text: "Point each workspace at your endpoint with its own signing secret. Pass your externalId so every event maps back to the right client record.",
  },
  {
    icon: MessageSquare,
    title: "Send messages and handle replies",
    text: "Send approved templates from your platform through the API. Customer replies arrive in that client's Bizuply WhatsApp inbox, not in your webhook.",
  },
  {
    icon: BarChart3,
    title: "Review messaging performance",
    text: "Each workspace shows Meta-synced analytics, template results and message status for the period you choose.",
  },
];

const AVAILABLE = [
  "One WhatsApp number per client workspace, connected through Meta Embedded Signup",
  "An isolated API key per client, scoped to that business",
  "A separate webhook URL and signing secret per client",
  "Per-client templates, inbox, analytics and Meta cost view",
  "One subscription per number, $29/month each",
];

const NOT_YET = [
  "One agency console that lists every client connection",
  "An agency-level key or sub-account API that works across clients",
  "Consolidated billing for all client numbers",
  "Inbound customer messages delivered to your webhook",
];

export default function AgenciesPage() {
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow="Agencies, SaaS developers and software companies"
            title="Bizuply for Agencies"
            lead="Give your clients' systems a WhatsApp connection. Connect each client's number, then send and track messages from the CRMs, websites and platforms you build, through one consistent API."
          />
          <div className="wa-actions" style={{ marginTop: -12 }}>
            <a href="#agency-contact" className="wa-btn wa-btn-primary">
              Talk to us about your clients <ArrowRight size={16} aria-hidden="true" />
            </a>
            <SiteLink to="/docs" className="wa-link">Explore API <ArrowRight size={14} aria-hidden="true" /></SiteLink>
          </div>
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-architecture">
        <div className="wa-wrap">
          <h2 id="wa-architecture" className="wa-sr">How client connections are structured</h2>
          <div className="wa-feature-visual" style={{ padding: 28 }}>
            <div className="wa-grid-3 wa-arch" style={{ alignItems: "stretch" }}>
              <div className="wa-card" style={{ display: "grid", alignContent: "center", gap: 8 }}>
                <Server size={22} aria-hidden="true" style={{ color: "var(--wa-green)" }} />
                <strong>Your platform</strong>
                <p className="wa-fine" style={{ margin: 0 }}>CRM, website, SaaS product or custom system</p>
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {["Client A", "Client B", "Client C"].map((client) => (
                  <div key={client} className="wa-event-row">
                    <span><Layers size={14} aria-hidden="true" style={{ verticalAlign: "-2px" }} /> {client} workspace</span>
                    <span className="wa-badge is-ok">own key + webhook</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "grid", gap: 10 }}>
                {["+1 555 010 0001", "+44 20 7946 0002", "+972 3 555 0003"].map((number) => (
                  <div key={number} className="wa-event-row">
                    <span><Phone size={14} aria-hidden="true" style={{ verticalAlign: "-2px" }} /> {number}</span>
                    <span className="wa-badge">WhatsApp</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="wa-fine" style={{ marginBottom: 0 }}>
              Example numbers. Each client's number, templates, messages and API key stay inside that client's workspace.
            </p>
          </div>
        </div>
      </section>

      <section className="wa-section" aria-labelledby="wa-workflow">
        <div className="wa-wrap">
          <SectionHead
            eyebrow="Workflow"
            title={<span id="wa-workflow">From a new client to live messaging.</span>}
            lead="This is how agencies and software companies use Bizuply today."
          />
          <div className="wa-grid-3">
            {WORKFLOW.map((step, index) => {
              const Icon = step.icon;
              return (
                <article key={step.title} className="wa-card is-hover">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <div className="wa-card-icon"><Icon size={20} aria-hidden="true" /></div>
                    <span className="wa-mono" style={{ color: "var(--wa-faint)", fontSize: 13 }}>0{index + 1}</span>
                  </div>
                  <h3 className="wa-h3">{step.title}</h3>
                  <p>{step.text}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-capability-status">
        <div className="wa-wrap">
          <SectionHead
            eyebrow="Capability status"
            title={<span id="wa-capability-status">What's available today, and what's coming later.</span>}
            lead="Plan your integration with the facts. We list multi-client features as available only once they actually ship."
          />
          <div className="wa-grid-2">
            <article className="wa-card is-featured">
              <span className="wa-badge is-ok"><span className="wa-dot" /> Available today</span>
              <ul className="wa-list">
                {AVAILABLE.map((item) => (
                  <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
                ))}
              </ul>
            </article>
            <article className="wa-card">
              <span className="wa-badge"><span className="wa-dot" /> Coming soon</span>
              <ul className="wa-list is-muted">
                {NOT_YET.map((item) => (
                  <li key={item}><Clock size={16} aria-hidden="true" /> {item}</li>
                ))}
              </ul>
            </article>
          </div>
          <Callout tone="info">
            <p>
              Each client connection is billed at <strong>$29/month per WhatsApp number</strong>. Meta messaging charges are
              billed separately to each client's WhatsApp Business Account. Connecting many numbers? Tell us your volume and
              we'll walk through the setup with you.
            </p>
          </Callout>
        </div>
      </section>

      <section className="wa-section" id="agency-contact" aria-labelledby="wa-agency-form">
        <div className="wa-wrap wa-split" style={{ alignItems: "start" }}>
          <div>
            <p className="wa-eyebrow">Talk to us</p>
            <h2 id="wa-agency-form" className="wa-h2">Plan your client rollout.</h2>
            <p className="wa-lead">
              Tell us how many client numbers you expect and which systems you're connecting. We'll reply with onboarding steps
              for your first client.
            </p>
          </div>
          <div className="wa-card">
            <ContactRequestForm defaultIntent="agency" />
          </div>
        </div>
      </section>
    </>
  );
}
