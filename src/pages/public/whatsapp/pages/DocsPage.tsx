import React, { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen, ExternalLink, List, Search } from "lucide-react";
import {
  ERROR_RESPONSE,
  GET_MESSAGE_RESPONSE,
  GET_MESSAGE_SAMPLES,
  GET_TEMPLATE_RESPONSE,
  GET_TEMPLATE_SAMPLES,
  LIST_TEMPLATES_RESPONSE,
  LIST_TEMPLATES_SAMPLES,
  SEND_BODY,
  SEND_REPLAY_RESPONSE,
  SEND_RESPONSE,
  SEND_SAMPLES,
  VERIFY_SAMPLES,
  WEBHOOK_EVENTS,
  WEBHOOK_HEADERS,
  WEBHOOK_PAYLOAD,
} from "../apiSamples";
import { API_BASE_URL, API_REFERENCE_URL, OPENAPI_PATH, OPENAPI_URL, SIGN_IN_URL, SUPPORT_EMAIL, SiteLink } from "../siteConfig";
import { Callout, CodeBlock } from "../ui";

type ErrorCode = { code: string; httpStatus: number; message: string };
type SpecInfo = {
  source: "live" | "bundled";
  version: string;
  errorCodes: ErrorCode[];
  defaultLimit: number;
  sendLimit: number;
  windowSec: number;
};

/** Mirrors server/services/externalApi/errorCatalog.js; replaced by the live spec when it loads. */
const BUNDLED_ERRORS: ErrorCode[] = [
  { code: "INVALID_API_KEY", httpStatus: 401, message: "Invalid API key." },
  { code: "API_KEY_REVOKED", httpStatus: 401, message: "API key has been revoked." },
  { code: "API_KEY_EXPIRED", httpStatus: 401, message: "API key has expired." },
  { code: "UNAUTHORIZED", httpStatus: 401, message: "Missing or invalid Authorization header." },
  { code: "INSUFFICIENT_SCOPE", httpStatus: 403, message: "This API key cannot call this endpoint." },
  { code: "WHATSAPP_NOT_CONNECTED", httpStatus: 409, message: "WhatsApp is not connected for this business." },
  { code: "TEMPLATE_NOT_FOUND", httpStatus: 404, message: "The requested WhatsApp template was not found for this business." },
  { code: "TEMPLATE_NOT_APPROVED", httpStatus: 400, message: "The selected WhatsApp template is not approved." },
  { code: "TEMPLATE_REQUIRED", httpStatus: 400, message: "template is required." },
  { code: "INVALID_TEMPLATE_PARAMETERS", httpStatus: 400, message: "Template parameters are invalid or incomplete." },
  { code: "INVALID_PHONE_NUMBER", httpStatus: 400, message: "Invalid phone number in 'to'." },
  { code: "RATE_LIMIT_EXCEEDED", httpStatus: 429, message: "Rate limit exceeded. Retry after the indicated delay." },
  { code: "META_API_ERROR", httpStatus: 502, message: "Meta WhatsApp Cloud API returned an error." },
  { code: "META_RATE_LIMITED", httpStatus: 429, message: "Meta WhatsApp Cloud API rate-limited or throttled this request." },
  { code: "MESSAGE_NOT_FOUND", httpStatus: 404, message: "Message not found." },
  { code: "INTERNAL_ERROR", httpStatus: 500, message: "Internal server error." },
];

const BUNDLED_SPEC: SpecInfo = {
  source: "bundled",
  version: "1.0.0",
  errorCodes: BUNDLED_ERRORS,
  defaultLimit: 60,
  sendLimit: 300,
  windowSec: 60,
};

function useSpec(): SpecInfo {
  const [spec, setSpec] = useState<SpecInfo>(BUNDLED_SPEC);
  useEffect(() => {
    let cancelled = false;
    fetch(OPENAPI_PATH, { credentials: "omit" })
      .then((response) => (response.ok ? response.json() : null))
      .then((doc) => {
        if (cancelled || !doc) return;
        const codes = Array.isArray(doc["x-bizuply-error-codes"]) ? (doc["x-bizuply-error-codes"] as ErrorCode[]) : [];
        const rate = doc["x-bizuply-rate-limit"] || {};
        if (!codes.length) return;
        setSpec({
          source: "live",
          version: String(doc.info?.version || BUNDLED_SPEC.version),
          errorCodes: codes,
          defaultLimit: Number(rate.defaultLimit) || BUNDLED_SPEC.defaultLimit,
          sendLimit: Number(rate.sendLimit) || BUNDLED_SPEC.sendLimit,
          windowSec: Math.max(1, Math.ceil((Number(rate.windowMs) || 60_000) / 1000)),
        });
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);
  return spec;
}

type Param = { name: string; in: string; type: string; required: boolean; description: React.ReactNode };

function ParamTable({ params }: { params: Param[] }) {
  return (
    <div className="wa-table-wrap">
      <table className="wa-table">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">In</th>
            <th scope="col">Type</th>
            <th scope="col">Required</th>
            <th scope="col">Description</th>
          </tr>
        </thead>
        <tbody>
          {params.map((param) => (
            <tr key={`${param.in}-${param.name}`}>
              <td><code>{param.name}</code></td>
              <td>{param.in}</td>
              <td>{param.type}</td>
              <td>{param.required ? <span className="wa-badge is-warn">required</span> : <span className="wa-badge">optional</span>}</td>
              <td>{param.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ErrorTable({ rows }: { rows: Array<[number, string, string]> }) {
  return (
    <div className="wa-table-wrap">
      <table className="wa-table">
        <thead>
          <tr>
            <th scope="col">HTTP</th>
            <th scope="col">Code</th>
            <th scope="col">When</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([status, code, when]) => (
            <tr key={`${status}-${code}`}>
              <td>{status}</td>
              <td><code>{code}</code></td>
              <td>{when}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Endpoint({
  method,
  path,
  children,
}: {
  method: "GET" | "POST";
  path: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <div className="wa-endpoint-head">
        <span className={`wa-method is-${method.toLowerCase()}`}>{method}</span>
        <code>{path}</code>
      </div>
      {children}
    </>
  );
}

const AUTH_ERRORS: Array<[number, string, string]> = [
  [401, "UNAUTHORIZED", "The Authorization header is missing or malformed."],
  [401, "INVALID_API_KEY", "The key does not exist."],
  [401, "API_KEY_REVOKED", "The key was revoked in the dashboard."],
  [403, "INSUFFICIENT_SCOPE", "This API key cannot call this endpoint. Create a new key in WhatsApp → API / Developers."],
  [429, "RATE_LIMIT_EXCEEDED", "Too many requests in the current window. Honour Retry-After."],
];

type DocSection = {
  id: string;
  group: string;
  title: string;
  keywords: string;
  render: (spec: SpecInfo) => React.ReactNode;
};

const SECTIONS: DocSection[] = [
  {
    id: "getting-started",
    group: "Start here",
    title: "Getting started",
    keywords: "quickstart base url prerequisites sandbox first message",
    render: () => (
      <>
        <p>
          The Bizuply WhatsApp API lets your own systems send Meta-approved WhatsApp template messages from your connected
          number, check message status and receive signed status webhooks. It's a REST API over HTTPS with JSON requests
          and responses.
        </p>
        <CodeBlock title="Base URL" language="text" code={API_BASE_URL} />
        <h3>Before you start</h3>
        <ol>
          <li>A WhatsApp number connected to your Bizuply workspace under <strong>WhatsApp → Connection</strong>.</li>
          <li>At least one template with Meta status <code>APPROVED</code>.</li>
          <li>An API key from <strong>WhatsApp → API / Developers</strong>.</li>
        </ol>
        <h3>Send your first message</h3>
        <ol>
          <li>List approved templates with <code>GET /templates</code>.</li>
          <li>Read the variable order with <code>GET /templates/{"{templateName}"}</code>.</li>
          <li>Send with <code>POST /messages/template</code>, using an <code>Idempotency-Key</code>.</li>
          <li>Track the result with webhooks or <code>GET /messages/{"{messageId}"}</code>.</li>
        </ol>
        <CodeBlock samples={SEND_SAMPLES} title="Send a template message" />
        <Callout tone="info">
          <p>
            <strong>No public sandbox yet.</strong> Requests go to your live WhatsApp number and Meta may charge for them. For
            testing, use an approved utility template and send to a number you control.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "authentication",
    group: "Start here",
    title: "Authentication",
    keywords: "bearer token authorization header businessId 401 403",
    render: () => (
      <>
        <p>
          Every request except the public docs needs an API key in the <code>Authorization</code> header as a Bearer
          token. Keys start with <code>biz_live_</code>.
        </p>
        <CodeBlock title="Header" language="http" code={"Authorization: Bearer biz_live_xxxxxxxxxxxxxxxxxxxxxxxx"} />
        <p>
          Each key belongs to exactly one Bizuply business, so the key tells us which WhatsApp number to use.{" "}
          <strong>Do not send a <code>businessId</code></strong> in the body or query string.
        </p>
        <p>
          A key created in the dashboard can list templates, send approved template messages, and read delivery status.
        </p>
        <h3>Authentication errors</h3>
        <ErrorTable rows={AUTH_ERRORS} />
      </>
    ),
  },
  {
    id: "api-keys",
    group: "Start here",
    title: "API key management",
    keywords: "create regenerate rotate revoke key prefix secret storage",
    render: () => (
      <>
        <p>
          Manage keys under <strong>WhatsApp → API / Developers</strong> in the Bizuply dashboard (
          <a className="wa-link" href={SIGN_IN_URL}>log in</a>).
        </p>
        <p>Each workspace has one active API key at a time.</p>
        <ul>
          <li><strong>Create:</strong> the full key is shown once. Copy it into your secret store straight away.</li>
          <li><strong>Regenerate:</strong> issues a new key and revokes the previous one immediately. Update your systems as soon as you regenerate.</li>
          <li><strong>Revoke:</strong> disables the key immediately. Further requests with it return <code>API_KEY_REVOKED</code>.</li>
        </ul>
        <p>
          Bizuply stores only a SHA-256 hash of each key plus a short prefix (for example <code>biz_live_ab12••••</code>), so
          we can't show a lost key again. Create a new one instead.
        </p>
        <Callout tone="warn">
          <p>
            Keep API keys on your server. Never put them in browser code, mobile apps or public repositories. Anyone with the
            key can send messages from your number.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "sending",
    group: "Guides",
    title: "Sending template messages",
    keywords: "send template variables parameters E.164 phone header media buttons idempotency externalId",
    render: () => (
      <>
        <p>
          <code>POST /messages/template</code> sends an approved template to one recipient. The API sends template messages
          only; free-form replies inside the 24-hour customer service window are handled in the Bizuply inbox.
        </p>
        <h3>Rules</h3>
        <ul>
          <li>The template must have Meta status <code>APPROVED</code>.</li>
          <li><code>to</code> uses E.164 format with a leading <code>+</code>, for example <code>+15551234567</code>.</li>
          <li><code>variables[0]</code> fills <code>{"{{1}}"}</code>, <code>variables[1]</code> fills <code>{"{{2}}"}</code>, and so on. <code>parameters</code> is an older alias.</li>
          <li>Media headers use <code>header.image.link</code>, <code>header.video.link</code> or <code>header.document.link</code>.</li>
          <li>Dynamic URL buttons take their suffixes from <code>buttons.url</code>, in button order.</li>
          <li><code>externalId</code> is your own reference. It's returned in webhooks and status lookups.</li>
        </ul>
        <CodeBlock title="Request body" language="json" code={SEND_BODY} />
        <h3>Idempotency</h3>
        <p>
          Send an <code>Idempotency-Key</code> header that's unique per message, such as your order ID plus the message type.
          If a retry reuses the key, you get the original result back with HTTP 200 and <code>"idempotent": true</code>,
          and the message isn't sent twice.
        </p>
        <CodeBlock title="Idempotent replay · 200 OK" language="json" code={SEND_REPLAY_RESPONSE} />
        <Callout tone="info">
          <p>
            A <code>201</code> with status <code>accepted</code> means Meta accepted the request. Final delivery is reported
            later through webhooks. Meta's opt-in, quality and per-number messaging limits still apply.
          </p>
        </Callout>
      </>
    ),
  },
  {
    id: "templates",
    group: "Guides",
    title: "Listing and managing templates",
    keywords: "templates approved pending rejected language category create submit review",
    render: () => (
      <>
        <p>
          You create, edit and submit templates under <strong>WhatsApp → Templates</strong> in the dashboard. Meta reviews
          each template and sets its status. The API is read-only for templates and only returns templates that can be sent
          now.
        </p>
        <div className="wa-table-wrap">
          <table className="wa-table">
            <thead>
              <tr><th scope="col">Task</th><th scope="col">Where</th></tr>
            </thead>
            <tbody>
              <tr><td>Create or edit a template and submit it to Meta</td><td>Dashboard → Templates</td></tr>
              <tr><td>Track review status (approved, pending, rejected)</td><td>Dashboard → Templates</td></tr>
              <tr><td>List approved templates</td><td><code>GET /templates</code></td></tr>
              <tr><td>Read body, header, button and variable schema</td><td><code>GET /templates/{"{templateName}"}</code></td></tr>
            </tbody>
          </table>
        </div>
        <p>
          When you pass <code>language</code>, the API looks for an exact match first, then falls back to the base language
          (for example <code>en_US</code> → <code>en</code>).
        </p>
      </>
    ),
  },
  {
    id: "webhooks",
    group: "Guides",
    title: "Webhooks",
    keywords: "webhook events signature hmac sha256 secret verify retries delivery id timestamp test",
    render: () => (
      <>
        <p>
          Bizuply posts message status events to your HTTPS endpoint. Set the Webhook URL under{" "}
          <strong>WhatsApp → API / Developers</strong>. There you can also reveal or regenerate the signing secret and send a
          test event. URLs must use <code>https</code>; <code>http</code> is allowed only for <code>localhost</code>.
        </p>
        <h3>Events</h3>
        <div className="wa-table-wrap">
          <table className="wa-table">
            <thead>
              <tr><th scope="col">Event</th><th scope="col">Meaning</th></tr>
            </thead>
            <tbody>
              {WEBHOOK_EVENTS.map((row) => (
                <tr key={row.event}><td><code>{row.event}</code></td><td>{row.meaning}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout tone="info">
          <p>Webhooks cover outbound message status only. Customer replies are not forwarded to external webhooks yet.</p>
        </Callout>
        <h3>Request format</h3>
        <div className="wa-endpoint-grid">
          <CodeBlock title="Headers" language="http" code={WEBHOOK_HEADERS} />
          <CodeBlock title="Body" language="json" code={WEBHOOK_PAYLOAD} />
        </div>
        <h3>Verify the signature</h3>
        <ol>
          <li>Read <code>X-Bizuply-Timestamp</code> (Unix seconds) and reject old requests, for example older than 5 minutes.</li>
          <li>Compute HMAC-SHA256 over <code>{"{timestamp}.{rawBody}"}</code> with your webhook secret.</li>
          <li>Compare <code>sha256=&lt;hex&gt;</code> to <code>X-Bizuply-Signature</code> with a timing-safe comparison.</li>
          <li>Skip any <code>X-Bizuply-Delivery-Id</code> you've already processed.</li>
        </ol>
        <CodeBlock samples={VERIFY_SAMPLES} title="Verify webhook signature" />
        <h3>Retries</h3>
        <p>
          Reply with any 2xx status within 15 seconds. Otherwise the delivery is retried after about 30 seconds, 2 minutes,
          10 minutes, 30 minutes and 2 hours, up to five attempts in total.
        </p>
      </>
    ),
  },
  {
    id: "errors",
    group: "Guides",
    title: "Error handling",
    keywords: "errors error codes envelope http status retry rate limit 429 retry-after request id",
    render: (spec) => (
      <>
        <p>
          Errors use HTTP status codes and a consistent JSON envelope. Include <code>error.requestId</code> (also returned in
          the <code>X-Request-Id</code> header) when you contact support.
        </p>
        <CodeBlock title="Error envelope" language="json" code={ERROR_RESPONSE} />
        <h3>Error codes</h3>
        <p className="wa-fine">
          {spec.source === "live"
            ? `Loaded from the live OpenAPI document (version ${spec.version}).`
            : "Showing the bundled list; the live OpenAPI document could not be loaded."}
        </p>
        <div className="wa-table-wrap">
          <table className="wa-table">
            <thead>
              <tr><th scope="col">HTTP</th><th scope="col">Code</th><th scope="col">Message</th></tr>
            </thead>
            <tbody>
              {spec.errorCodes.map((row) => (
                <tr key={row.code}><td>{row.httpStatus}</td><td><code>{row.code}</code></td><td>{row.message}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <h3>Rate limits</h3>
        <ul>
          <li><code>POST /messages/template</code>: {spec.sendLimit} requests per {spec.windowSec} seconds per API key.</li>
          <li>Other endpoints: {spec.defaultLimit} requests per {spec.windowSec} seconds per API key and endpoint.</li>
        </ul>
        <p>
          Responses include <code>X-RateLimit-Limit</code> and <code>X-RateLimit-Remaining</code>. A <code>429</code> includes{" "}
          <code>Retry-After</code>. <code>META_RATE_LIMITED</code> means Meta throttled the send. Wait, then retry with the
          same <code>Idempotency-Key</code>.
        </p>
        <h3>When to retry</h3>
        <ul>
          <li><strong>Retry with backoff:</strong> 429, 502 and 500 responses and network timeouts. Reuse the same Idempotency-Key.</li>
          <li><strong>Don't retry unchanged:</strong> 400, 401, 403, 404 and 409. Fix the request, key, template or connection first.</li>
        </ul>
      </>
    ),
  },
  {
    id: "connection",
    group: "Guides",
    title: "Connection management",
    keywords: "connection connect number embedded signup status disconnected reconnect WHATSAPP_NOT_CONNECTED",
    render: () => (
      <>
        <p>
          Each Bizuply workspace connects one WhatsApp number through Meta Embedded Signup under{" "}
          <strong>WhatsApp → Connection</strong>. That page shows the connection status, phone number status and Meta
          account details, and is where you reconnect if Meta access changes.
        </p>
        <ul>
          <li>If the number isn't connected, or the connection is incomplete, the API returns <code>409 WHATSAPP_NOT_CONNECTED</code>.</li>
          <li>One subscription covers one number. Managing several numbers from one account isn't available yet; contact us if you need more than one.</li>
          <li>Connections are set up in the dashboard. There's no API to create or remove them.</li>
        </ul>
        <p>
          See <SiteLink className="wa-link" to="/get-started">Connect WhatsApp</SiteLink> for the onboarding steps and the Meta
          checks that can apply.
        </p>
      </>
    ),
  },
  {
    id: "security",
    group: "Guides",
    title: "Security best practices",
    keywords: "security best practices secret storage rotate least privilege https verify",
    render: () => (
      <>
        <ul>
          <li>Store API keys and the webhook secret in a secrets manager or environment variables, never in source control.</li>
          <li>Call the API only from your servers. Never from browsers or mobile apps.</li>
          <li>Rotate the key regularly, and right away if it may have leaked. Regenerating revokes the old key at once, so plan the switch.</li>
          <li>Verify every webhook signature and timestamp before acting on it, and dedupe by delivery ID.</li>
          <li>Send only the personal data the template needs, and follow WhatsApp's opt-in rules.</li>
        </ul>
        <p>
          More detail is on the <SiteLink className="wa-link" to="/security">security page</SiteLink>. To report a
          vulnerability, email <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        </p>
      </>
    ),
  },
  {
    id: "ref-list-templates",
    group: "API reference",
    title: "List templates",
    keywords: "GET /templates list approved templates reference",
    render: () => (
      <Endpoint method="GET" path="/templates">
        <p>Returns the business's templates with Meta status <code>APPROVED</code>. Pending and rejected templates are left out.</p>
        <p className="wa-fine">No parameters.</p>
        <div className="wa-endpoint-grid">
          <CodeBlock samples={LIST_TEMPLATES_SAMPLES} title="List templates" />
          <CodeBlock title="200 OK" language="json" code={LIST_TEMPLATES_RESPONSE} />
        </div>
        <h3>Errors</h3>
        <ErrorTable rows={[...AUTH_ERRORS, [409, "WHATSAPP_NOT_CONNECTED", "No connected WhatsApp number for this business."]]} />
      </Endpoint>
    ),
  },
  {
    id: "ref-get-template",
    group: "API reference",
    title: "Get a template",
    keywords: "GET /templates/{templateName} template detail variables header buttons reference",
    render: () => (
      <Endpoint method="GET" path="/templates/{templateName}">
        <p>Returns header, body, footer, buttons and the ordered variable list for one approved template.</p>
        <ParamTable
          params={[
            { name: "templateName", in: "path", type: "string", required: true, description: "Template name as approved by Meta." },
            { name: "language", in: "query", type: "string", required: false, description: "Language code such as en or en_US. Falls back to the base language." },
          ]}
        />
        <div className="wa-endpoint-grid">
          <CodeBlock samples={GET_TEMPLATE_SAMPLES} title="Get template" />
          <CodeBlock title="200 OK" language="json" code={GET_TEMPLATE_RESPONSE} />
        </div>
        <h3>Errors</h3>
        <ErrorTable
          rows={[
            ...AUTH_ERRORS,
            [404, "TEMPLATE_NOT_FOUND", "No approved template with this name (and language)."],
            [409, "WHATSAPP_NOT_CONNECTED", "No connected WhatsApp number for this business."],
          ]}
        />
      </Endpoint>
    ),
  },
  {
    id: "ref-send",
    group: "API reference",
    title: "Send a template message",
    keywords: "POST /messages/template send message reference idempotency",
    render: (spec) => (
      <Endpoint method="POST" path="/messages/template">
        <p>
          Sends an approved template to one recipient. Returns <code>201</code> for a new send, or <code>200</code> for an
          idempotent replay. Limit: {spec.sendLimit} requests per {spec.windowSec} seconds per API key.
        </p>
        <ParamTable
          params={[
            { name: "Idempotency-Key", in: "header", type: "string", required: false, description: "Unique per message. Retries with the same key return the original result." },
            { name: "to", in: "body", type: "string", required: true, description: "Recipient in E.164 format, e.g. +15551234567." },
            { name: "template", in: "body", type: "string", required: true, description: "Approved template name." },
            { name: "language", in: "body", type: "string", required: false, description: "Template language code, e.g. en." },
            { name: "variables", in: "body", type: "string[]", required: false, description: <>Body placeholders in order: <code>variables[0]</code> → <code>{"{{1}}"}</code>. Required when the template has variables.</> },
            { name: "parameters", in: "body", type: "string[]", required: false, description: "Older alias for variables." },
            { name: "header", in: "body", type: "object", required: false, description: <>Header text or media, e.g. <code>{'{"image":{"link":"https://…"}}'}</code>.</> },
            { name: "buttons.url", in: "body", type: "string | string[]", required: false, description: "Dynamic URL button suffixes, in button order." },
            { name: "externalId", in: "body", type: "string", required: false, description: "Your reference (max 200 characters), echoed in webhooks." },
          ]}
        />
        <div className="wa-endpoint-grid">
          <CodeBlock samples={SEND_SAMPLES} title="Send template" />
          <CodeBlock title="201 Created" language="json" code={SEND_RESPONSE} />
        </div>
        <h3>Errors</h3>
        <ErrorTable
          rows={[
            [400, "INVALID_PHONE_NUMBER", "to is missing or not a valid phone number."],
            [400, "TEMPLATE_REQUIRED", "template is missing."],
            [400, "INVALID_TEMPLATE_PARAMETERS", "Variables, header media or URL button values are missing or wrong. See error.missing and error.expected."],
            ...AUTH_ERRORS,
            [404, "TEMPLATE_NOT_FOUND", "No approved template with this name (and language)."],
            [409, "WHATSAPP_NOT_CONNECTED", "No connected WhatsApp number for this business."],
            [429, "META_RATE_LIMITED", "Meta throttled the send. Retry later with the same Idempotency-Key."],
            [502, "META_API_ERROR", "Meta rejected the send. error.message contains the reason."],
          ]}
        />
      </Endpoint>
    ),
  },
  {
    id: "ref-get-message",
    group: "API reference",
    title: "Get message status",
    keywords: "GET /messages/{messageId} message status delivered read reference",
    render: () => (
      <Endpoint method="GET" path="/messages/{messageId}">
        <p>Returns the current status and timestamps of a message sent through the API.</p>
        <ParamTable
          params={[
            { name: "messageId", in: "path", type: "string", required: true, description: <>The <code>messageId</code> returned when you sent the message (<code>bizmsg_…</code>).</> },
          ]}
        />
        <div className="wa-endpoint-grid">
          <CodeBlock samples={GET_MESSAGE_SAMPLES} title="Get message" />
          <CodeBlock title="200 OK" language="json" code={GET_MESSAGE_RESPONSE} />
        </div>
        <p className="wa-fine">
          <code>status</code> is one of <code>accepted</code>, <code>sent</code>, <code>delivered</code>, <code>read</code> or{" "}
          <code>failed</code>.
        </p>
        <h3>Errors</h3>
        <ErrorTable rows={[...AUTH_ERRORS, [404, "MESSAGE_NOT_FOUND", "No message with this ID for this business."]]} />
      </Endpoint>
    ),
  },
  {
    id: "openapi",
    group: "API reference",
    title: "OpenAPI specification",
    keywords: "openapi swagger spec json reference postman",
    render: (spec) => (
      <>
        <p>
          The OpenAPI 3.0 document is the source of truth for these endpoints. Import it into Postman, Insomnia or a code
          generator.
        </p>
        <div className="wa-actions" style={{ marginTop: 16 }}>
          <a className="wa-btn wa-btn-ghost" href={OPENAPI_URL}>
            openapi.json <ExternalLink size={14} aria-hidden="true" />
          </a>
          <a className="wa-btn wa-btn-ghost" href={API_REFERENCE_URL}>
            Interactive reference <ExternalLink size={14} aria-hidden="true" />
          </a>
        </div>
        <p className="wa-fine">Current spec version: {spec.version}.</p>
      </>
    ),
  },
];

function plain(section: DocSection) {
  return `${section.title} ${section.group} ${section.keywords}`.toLowerCase();
}

export default function DocsPage() {
  const spec = useSpec();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(SECTIONS[0].id);
  const [navOpen, setNavOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const matches = useMemo(() => {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return SECTIONS;
    return SECTIONS.filter((section) => terms.every((term) => plain(section).includes(term)));
  }, [query]);

  const groups = useMemo(() => {
    const map = new Map<string, DocSection[]>();
    matches.forEach((section) => map.set(section.group, [...(map.get(section.group) || []), section]));
    return Array.from(map.entries());
  }, [matches]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (event.key === "/" && !typing) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-90px 0px -65% 0px" },
    );
    SECTIONS.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="wa-wrap wa-docs">
      <aside className="wa-docs-side" aria-label="Documentation">
        <p className="wa-eyebrow"><BookOpen size={14} aria-hidden="true" /> Documentation</p>
        <div className="wa-search" role="search">
          <Search size={16} aria-hidden="true" />
          <label htmlFor="wa-docs-search" className="wa-sr">Search documentation</label>
          <input
            ref={searchRef}
            id="wa-docs-search"
            className="wa-input"
            type="search"
            placeholder="Search docs  ( / )"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              if (event.target.value.trim()) setNavOpen(true);
            }}
            aria-controls="wa-docs-nav"
            autoComplete="off"
          />
        </div>
        <button
          type="button"
          className="wa-btn wa-btn-ghost wa-btn-sm wa-docs-toggle"
          aria-expanded={navOpen}
          aria-controls="wa-docs-nav"
          onClick={() => setNavOpen((open) => !open)}
          style={{ width: "100%" }}
        >
          <List size={16} aria-hidden="true" /> {navOpen ? "Hide contents" : "Show contents"}
        </button>
        <nav id="wa-docs-nav" className={navOpen ? "wa-docs-nav is-open" : "wa-docs-nav"} aria-label="Documentation sections">
          <p className="wa-sr" aria-live="polite">
            {query.trim() ? `${matches.length} matching ${matches.length === 1 ? "section" : "sections"}` : ""}
          </p>
          {groups.length ? (
            groups.map(([group, items]) => (
              <div key={group}>
                <h2>{group}</h2>
                <ul>
                  {items.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className={active === section.id ? "is-active" : undefined}
                        aria-current={active === section.id ? "location" : undefined}
                        onClick={() => setNavOpen(false)}
                      >
                        {section.group === "API reference" && section.id !== "openapi" ? (
                          <span className={`wa-method is-${section.title.startsWith("Send") ? "post" : "get"}`} style={{ minWidth: 38, fontSize: 10 }}>
                            {section.title.startsWith("Send") ? "POST" : "GET"}
                          </span>
                        ) : null}
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <p className="wa-docs-empty">No sections match “{query}”.</p>
          )}
        </nav>
      </aside>
      <div className="wa-docs-main">
        <header style={{ marginBottom: 36 }}>
          <h1 className="wa-display" style={{ fontSize: "clamp(2rem, 3.6vw, 2.8rem)" }}>WhatsApp API documentation</h1>
          <p className="wa-lead">
            Everything you need to send WhatsApp template messages from your own systems and receive signed status events.
            API version {spec.version}.
          </p>
        </header>
        {SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="wa-doc-section" aria-labelledby={`${section.id}-title`}>
            <p className="wa-eyebrow" style={{ marginBottom: 8 }}>{section.group}</p>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            {section.render(spec)}
          </section>
        ))}
      </div>
    </div>
  );
}
