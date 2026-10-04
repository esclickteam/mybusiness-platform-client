import React from "react";
import { ArrowRight, Database, Fingerprint, Gauge, KeyRound, Lock, Mail, ShieldCheck, Users } from "lucide-react";
import { PRIVACY_URL, SUPPORT_EMAIL, SiteLink, TERMS_URL } from "../siteConfig";
import { Callout, SectionHead } from "../ui";

const CONTROLS = [
  {
    icon: KeyRound,
    title: "API key protection",
    points: [
      "Keys are generated randomly and shown in full only once, when you create them.",
      "Only a SHA-256 hash and a short visible prefix are stored, never the key itself.",
      "Revoking or regenerating a key takes effect immediately.",
      "The API is served over HTTPS, so keys and message data are encrypted in transit.",
      "A dashboard key can list templates, send messages, and read delivery status.",
    ],
  },
  {
    icon: Fingerprint,
    title: "Webhook authentication",
    points: [
      "Each delivery is signed with HMAC-SHA256 over the timestamp and raw body, using your workspace's secret.",
      "The timestamp and a unique delivery ID are sent with each request, so you can reject replays and duplicates.",
      "Webhook URLs must use HTTPS (plain HTTP is accepted only for localhost testing).",
      "You can reveal or regenerate the signing secret in the dashboard.",
    ],
  },
  {
    icon: Lock,
    title: "Meta credential handling",
    points: [
      "Meta access tokens for connected numbers are encrypted at rest with AES-256-GCM.",
      "Tokens are never returned to the browser or exposed through the external API.",
      "Your integration only ever holds a Bizuply API key.",
    ],
  },
  {
    icon: Users,
    title: "Tenant isolation",
    points: [
      "Every API key is bound to exactly one business.",
      "The business is derived from the key on every request, never from the request body or query.",
      "Templates, messages and status lookups are always scoped to that business.",
    ],
  },
  {
    icon: Gauge,
    title: "Abuse controls",
    points: [
      "Rate limits apply per API key and endpoint, with Retry-After on 429 responses.",
      "Meta's own throttling is passed through as META_RATE_LIMITED rather than bypassed.",
      "Idempotency keys prevent accidental duplicate sends on retry.",
    ],
  },
  {
    icon: Database,
    title: "Data and logging",
    points: [
      "API request logs record the request ID, endpoint, status, timing and error code.",
      "Message records keep the recipient, template, variables and status needed for tracking and the inbox.",
      "Personal data is handled under the Bizuply Privacy Policy.",
    ],
  },
];

const YOURS = [
  "Keep the API key and webhook secret on your servers, in a secrets manager or environment variables.",
  "Verify every webhook's signature and timestamp before acting on it.",
  "Regenerate the key right away if it may have been exposed.",
  "Collect WhatsApp opt-in from customers and follow Meta's messaging policies.",
];

export default function SecurityPage() {
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow="Security"
            title="How the WhatsApp API protects your data."
            lead="Every control on this page describes how the platform works today."
          />
          <Callout tone="info">
            <p>
              We only list certifications, audits or partner badges once they're verified, and none are claimed on this site.
              If your procurement process needs specific documentation, email{" "}
              <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
            </p>
          </Callout>
        </div>
      </section>

      <section className="wa-section is-tight" aria-label="Security controls">
        <div className="wa-wrap wa-grid-2">
          {CONTROLS.map((control) => {
            const Icon = control.icon;
            return (
              <article key={control.title} className="wa-card">
                <div className="wa-card-icon"><Icon size={20} aria-hidden="true" /></div>
                <h2 className="wa-h3">{control.title}</h2>
                <ul className="wa-list">
                  {control.points.map((point) => (
                    <li key={point}><ShieldCheck size={16} aria-hidden="true" /> {point}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-shared">
        <div className="wa-wrap wa-split" style={{ alignItems: "start" }}>
          <div>
            <p className="wa-eyebrow">Shared responsibility</p>
            <h2 id="wa-shared" className="wa-h2">What's in your hands.</h2>
            <p className="wa-lead">
              A few practices on your side complete the picture. The{" "}
              <SiteLink className="wa-link" to="/docs#security">security best practices</SiteLink> in the docs go into more detail.
            </p>
          </div>
          <article className="wa-card">
            <ul className="wa-list">
              {YOURS.map((item) => (
                <li key={item}><ShieldCheck size={16} aria-hidden="true" /> {item}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="wa-section" aria-labelledby="wa-disclosure">
        <div className="wa-wrap wa-grid-2">
          <article className="wa-card">
            <div className="wa-card-icon"><Mail size={20} aria-hidden="true" /></div>
            <h2 id="wa-disclosure" className="wa-h3">Report a vulnerability</h2>
            <p>
              Email <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with "Security" in the subject.
              Include steps to reproduce, and please don't access other customers' data or disrupt the service while testing.
            </p>
          </article>
          <article className="wa-card">
            <div className="wa-card-icon"><ShieldCheck size={20} aria-hidden="true" /></div>
            <h2 className="wa-h3">Policies</h2>
            <p>
              Read the <a className="wa-link" href={PRIVACY_URL}>Privacy Policy</a> and{" "}
              <a className="wa-link" href={TERMS_URL}>Terms of Service</a>. Using WhatsApp is also subject to Meta's WhatsApp
              Business terms and policies.
            </p>
          </article>
        </div>
      </section>

      <section className="wa-section is-tight">
        <div className="wa-wrap">
          <div className="wa-cta">
            <div>
              <h2 className="wa-h2">Review the API before you connect.</h2>
              <p className="wa-lead">Authentication, webhook signing and error handling are documented in full.</p>
            </div>
            <div className="wa-actions">
              <SiteLink to="/docs" className="wa-btn wa-btn-primary">
                Explore API <ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
              <SiteLink to="/get-started" className="wa-link">Get Started <ArrowRight size={14} aria-hidden="true" /></SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
