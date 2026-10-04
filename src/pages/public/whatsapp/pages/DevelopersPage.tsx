import React from "react";
import { ArrowRight, Braces, Fingerprint, Gauge, KeyRound, Repeat, ScrollText } from "lucide-react";
import { SEND_RESPONSE, SEND_SAMPLES, VERIFY_SAMPLES } from "../apiSamples";
import { API_BASE_URL, API_REFERENCE_URL, OPENAPI_URL, SiteLink } from "../siteConfig";
import { Callout, CodeBlock, SectionHead } from "../ui";

const ENDPOINTS = [
  { method: "GET", path: "/templates", text: "List approved templates", anchor: "ref-list-templates" },
  { method: "GET", path: "/templates/{templateName}", text: "Template schema and variable order", anchor: "ref-get-template" },
  { method: "POST", path: "/messages/template", text: "Send an approved template", anchor: "ref-send" },
  { method: "GET", path: "/messages/{messageId}", text: "Message status and timestamps", anchor: "ref-get-message" },
] as const;

const PRODUCTION = [
  { icon: Repeat, title: "Idempotent sends", text: "Retry with the same Idempotency-Key and the message is never sent twice." },
  { icon: Gauge, title: "Clear rate limits", text: "Limits per API key, with X-RateLimit headers and Retry-After on 429." },
  { icon: ScrollText, title: "Request IDs", text: "Every response carries X-Request-Id, so support can trace any call." },
  { icon: Braces, title: "One error format", text: "Machine-readable error codes, with missing or expected fields when it helps." },
  { icon: Fingerprint, title: "Signed events", text: "HMAC-SHA256 signature and timestamp on every webhook delivery." },
  { icon: KeyRound, title: "Server-side keys", text: "Business-scoped keys, hashed at rest, revocable from the dashboard." },
];

export default function DevelopersPage() {
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow="Developers"
            title="WhatsApp messaging in one authenticated request."
            lead="A small REST API, an OpenAPI spec and signed webhooks. Send approved templates from any backend, track every message, and keep Meta credentials out of your code."
          />
          <div className="wa-actions" style={{ marginTop: -12 }}>
            <SiteLink to="/docs" className="wa-btn wa-btn-primary wa-btn-lg">
              Explore API <ArrowRight size={16} aria-hidden="true" />
            </SiteLink>
            <SiteLink to="/get-started" className="wa-link">Get Started <ArrowRight size={14} aria-hidden="true" /></SiteLink>
          </div>
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-quickstart">
        <div className="wa-wrap">
          <SectionHead
            eyebrow="Quick Start"
            title={<span id="wa-quickstart">Send your first message in four steps.</span>}
          />
          <div className="wa-endpoint-grid" style={{ marginBottom: 24 }}>
            <CodeBlock title="Base URL" language="text" code={API_BASE_URL} />
            <CodeBlock title="Authentication" language="http" code={"Authorization: Bearer $BIZUPLY_API_KEY"} />
          </div>
          <div className="wa-split" style={{ alignItems: "start" }}>
            <ol className="wa-steps">
              <li className="wa-step">
                <span className="wa-step-n" aria-hidden="true">01</span>
                <div className="wa-step-body">
                  <h3>Generate an API key</h3>
                  <p>
                    In the Bizuply dashboard open <strong>WhatsApp → API / Developers</strong> and create a key. It's shown
                    once. Store it as <code>BIZUPLY_API_KEY</code> on your server.
                  </p>
                </div>
              </li>
              <li className="wa-step">
                <span className="wa-step-n" aria-hidden="true">02</span>
                <div className="wa-step-body">
                  <h3>Set your webhook URL</h3>
                  <p>
                    On the same screen, add your HTTPS endpoint, copy the signing secret and send a test event.
                  </p>
                </div>
              </li>
              <li className="wa-step">
                <span className="wa-step-n" aria-hidden="true">03</span>
                <div className="wa-step-body">
                  <h3>Pick an approved template</h3>
                  <p>
                    <code>GET /templates</code> returns templates Meta has approved, along with each one's language and
                    variable count.
                  </p>
                </div>
              </li>
              <li className="wa-step">
                <span className="wa-step-n" aria-hidden="true">04</span>
                <div className="wa-step-body">
                  <h3>Send and track</h3>
                  <p>
                    <code>POST /messages/template</code> with the variables in order. Then follow the result through
                    webhooks or <code>GET /messages/{"{messageId}"}</code>.
                  </p>
                </div>
              </li>
            </ol>
            <div style={{ display: "grid", gap: 16, minWidth: 0 }}>
              <CodeBlock samples={SEND_SAMPLES} title="First request · send a template" />
              <CodeBlock title="Example response · 201 Created" language="json" code={SEND_RESPONSE} />
            </div>
          </div>
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-endpoints">
        <div className="wa-wrap">
          <SectionHead
            eyebrow="API surface"
            title={<span id="wa-endpoints">Four endpoints, documented in full.</span>}
            lead={<>Base URL <code>https://api.bizuply.com/api/v1/whatsapp</code>. JSON in, JSON out, with Bearer authentication.</>}
          />
          <div className="wa-table-wrap">
            <table className="wa-table">
              <thead>
                <tr>
                  <th scope="col">Method</th>
                  <th scope="col">Path</th>
                  <th scope="col">Purpose</th>
                  <th scope="col"><span className="wa-sr">Reference</span></th>
                </tr>
              </thead>
              <tbody>
                {ENDPOINTS.map((row) => (
                  <tr key={row.path}>
                    <td><span className={`wa-method is-${row.method.toLowerCase()}`}>{row.method}</span></td>
                    <td><code>{row.path}</code></td>
                    <td>{row.text}</td>
                    <td>
                      <SiteLink className="wa-link" to={`/docs#${row.anchor}`}>
                        Reference<span className="wa-sr"> for {row.method} {row.path}</span> <ArrowRight size={14} aria-hidden="true" />
                      </SiteLink>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="wa-fine">
            Prefer an interactive explorer? Open the <a className="wa-link" href={API_REFERENCE_URL}>OpenAPI reference</a> or
            download <a className="wa-link" href={OPENAPI_URL}>openapi.json</a>.
          </p>
        </div>
      </section>

      <section className="wa-section" aria-labelledby="wa-webhooks">
        <div className="wa-wrap wa-split" style={{ alignItems: "start" }}>
          <div>
            <p className="wa-eyebrow">Webhooks</p>
            <h2 id="wa-webhooks" className="wa-h2">Status events you can trust.</h2>
            <p className="wa-lead">
              Bizuply posts <code>accepted</code>, <code>sent</code>, <code>delivered</code>, <code>read</code> and{" "}
              <code>failed</code> events to your HTTPS endpoint. Each one is signed with your secret, and failed deliveries are
              retried with backoff.
            </p>
            <Callout tone="info">
              <p>Webhooks currently cover outbound message status. Customer replies are not forwarded to external webhooks yet.</p>
            </Callout>
            <div className="wa-actions">
              <SiteLink to="/docs#webhooks" className="wa-btn wa-btn-ghost">
                Webhook guide <ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
            </div>
          </div>
          <CodeBlock samples={VERIFY_SAMPLES} title="Verify webhook signature" />
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-production">
        <div className="wa-wrap">
          <SectionHead eyebrow="Production details" title={<span id="wa-production">The details that matter in production.</span>} />
          <div className="wa-grid-3">
            {PRODUCTION.map((item) => {
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
          <Callout tone="info">
            <p>
              <strong>Sandbox:</strong> there is no separate sandbox environment yet. Test against your connected number with
              an approved template sent to a phone you control. Meta charges may apply.
            </p>
          </Callout>
        </div>
      </section>

      <section className="wa-section is-tight">
        <div className="wa-wrap">
          <div className="wa-cta">
            <div>
              <h2 className="wa-h2">Ready to integrate?</h2>
              <p className="wa-lead">Connect a number, create a key and send your first approved template from your own code.</p>
            </div>
            <div className="wa-actions">
              <SiteLink to="/get-started" className="wa-btn wa-btn-primary">
                Get Started <ArrowRight size={16} aria-hidden="true" />
              </SiteLink>
              <SiteLink to="/docs" className="wa-link">Explore API <ArrowRight size={14} aria-hidden="true" /></SiteLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
