import React, { useEffect, useRef, useState } from "react";
import { CheckCheck, Cloud, Layers, Pause, Play, RotateCcw, Server, Smartphone } from "lucide-react";
import { CodeBlock, prefersReducedMotion } from "./ui";
import { SEND_RESPONSE, WEBHOOK_PAYLOAD } from "./apiSamples";

type NodeIndex = 0 | 1 | 2 | 3;

const NODES: Array<{ label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { label: "Your system", icon: Server },
  { label: "Bizuply API", icon: Layers },
  { label: "WhatsApp Cloud API", icon: Cloud },
  { label: "Customer", icon: Smartphone },
];

const CENTER = ["12.5%", "37.5%", "62.5%", "87.5%"];

type Step = {
  short: string;
  title: string;
  text: string;
  from: NodeIndex;
  to: NodeIndex;
  active: NodeIndex[];
  returning?: boolean;
  panel: "request" | "response" | "phone" | "webhook" | "ack";
};

const STEPS: Step[] = [
  {
    short: "API request",
    title: "Your system calls the Bizuply API",
    text: "Your CRM, website or backend sends one authenticated HTTPS request with an approved template name, the recipient and the template variables.",
    from: 0,
    to: 1,
    active: [0, 1],
    panel: "request",
  },
  {
    short: "Bizuply processes",
    title: "Bizuply validates and forwards the send",
    text: "The API key, scope, template approval and variable count are checked, the Idempotency-Key is recorded, and the message is sent through the official WhatsApp Cloud API.",
    from: 1,
    to: 2,
    active: [1, 2],
    panel: "response",
  },
  {
    short: "Reaches WhatsApp",
    title: "The message arrives on WhatsApp",
    text: "Meta delivers the template message to the customer's WhatsApp. Delivery depends on Meta's checks, the recipient's opt-in and their device being reachable.",
    from: 2,
    to: 3,
    active: [2, 3],
    panel: "phone",
  },
  {
    short: "Webhook event",
    title: "A status update becomes a signed webhook",
    text: "When WhatsApp reports the message as sent, delivered, read or failed, Bizuply creates a webhook event and signs it with your secret using HMAC-SHA256.",
    from: 3,
    to: 1,
    active: [3, 2, 1],
    returning: true,
    panel: "webhook",
  },
  {
    short: "System receives",
    title: "Your system receives and verifies the event",
    text: "Your endpoint checks the signature and timestamp, updates the record using messageId or your externalId, and answers 2xx. Failed deliveries are retried with backoff.",
    from: 1,
    to: 0,
    active: [1, 0],
    returning: true,
    panel: "ack",
  },
];

const REQUEST = `POST /api/v1/whatsapp/messages/template
Authorization: Bearer biz_live_••••••••
Idempotency-Key: order-1042-confirmation

{
  "to": "+15551234567",
  "template": "order_update",
  "language": "en",
  "variables": ["Avery", "1042"],
  "externalId": "order_1042"
}`;

const ACK = `// POST /webhooks/bizuply  (your endpoint)
verifySignature(req)          // HMAC-SHA256 over "{timestamp}.{rawBody}"
dedupe(req.get("X-Bizuply-Delivery-Id"))

await orders.update("order_1042", {
  whatsappStatus: "delivered",
});

res.sendStatus(200)`;

const STEP_MS = 5200;

function Panel({ step }: { step: Step }) {
  if (step.panel === "phone") {
    return (
      <div className="wa-phone" aria-label="Example WhatsApp message on the customer's phone">
        <div className="wa-phone-head">
          <span className="wa-phone-avatar" aria-hidden="true">NW</span>
          <span>Northwind Store</span>
        </div>
        <div className="wa-bubble">
          Hi Avery, order 1042 is confirmed and on its way.
          <small>
            09:14 <CheckCheck size={14} aria-label="Delivered" />
          </small>
        </div>
      </div>
    );
  }
  if (step.panel === "request") return <CodeBlock title="Request · your system → Bizuply" code={REQUEST} language="http" />;
  if (step.panel === "response") return <CodeBlock title="Response · 201 Created" code={SEND_RESPONSE} language="json" />;
  if (step.panel === "webhook") {
    return (
      <CodeBlock
        title="Webhook · X-Bizuply-Event: whatsapp.message.delivered"
        code={WEBHOOK_PAYLOAD}
        language="json"
      />
    );
  }
  return <CodeBlock title="Your webhook handler" code={ACK} language="js" />;
}

export default function ApiFlowDemo() {
  const [index, setIndex] = useState(0);
  const [reduced] = useState(prefersReducedMotion);
  const [playing, setPlaying] = useState(!reduced);
  const [visible, setVisible] = useState(true);
  const [motion, setMotion] = useState<{ pos: string; animate: boolean }>({ pos: CENTER[0], animate: false });
  const root = useRef<HTMLDivElement>(null);
  const step = STEPS[index];
  const packet = reduced ? { pos: CENTER[step.to], animate: false } : motion;

  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.25 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return undefined;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % STEPS.length), STEP_MS);
    return () => window.clearTimeout(timer);
  }, [index, playing, visible]);

  useEffect(() => {
    if (reduced) return undefined;
    let frame = window.requestAnimationFrame(() => {
      setMotion({ pos: CENTER[step.from], animate: false });
      frame = window.requestAnimationFrame(() => {
        frame = window.requestAnimationFrame(() => setMotion({ pos: CENTER[step.to], animate: true }));
      });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [step, reduced]);

  const select = (next: number) => {
    setPlaying(false);
    setIndex(next);
  };

  return (
    <div className="wa-demo" ref={root} role="region" aria-roledescription="interactive diagram" aria-label="How a WhatsApp API request flows through Bizuply">
      <div className="wa-demo-top">
        <p>
          <span className="wa-badge is-info">Illustration</span>&nbsp; Sample data, not a live API transaction
        </p>
        <div className="wa-demo-controls">
          <button
            type="button"
            className="wa-btn wa-btn-ghost wa-btn-sm"
            aria-pressed={playing}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />}
            {playing ? "Pause" : "Play"}
          </button>
          <button
            type="button"
            className="wa-btn wa-btn-quiet wa-btn-sm"
            onClick={() => {
              setIndex(0);
              setPlaying(!reduced);
            }}
          >
            <RotateCcw size={14} /> Restart
          </button>
        </div>
      </div>

      <ol className="wa-demo-steps">
        {STEPS.map((item, i) => (
          <li key={item.short}>
            <button
              type="button"
              className={i < index ? "is-done" : undefined}
              aria-current={i === index ? "step" : undefined}
              onClick={() => select(i)}
            >
              <span className="n">0{i + 1}</span>
              <span className="t">{item.short}</span>
            </button>
          </li>
        ))}
      </ol>

      <div className="wa-demo-body">
        <div className="wa-demo-stage">
          <div className="wa-demo-lane" aria-hidden="true">
            {NODES.map((node, i) => {
              const Icon = node.icon;
              return (
                <div key={node.label} className={step.active.includes(i as NodeIndex) ? "wa-demo-node is-active" : "wa-demo-node"}>
                  <Icon size={20} />
                  {node.label}
                </div>
              );
            })}
            <span
              className={step.returning ? "wa-demo-packet is-return" : "wa-demo-packet"}
              style={{
                insetInlineStart: `calc(${packet.pos} - 5px)`,
                transition: packet.animate ? undefined : "none",
              }}
            />
          </div>
          <div className="wa-demo-caption wa-fade-in" key={`caption-${index}`} aria-live={playing ? "off" : "polite"}>
            <h3>
              <span className="wa-mono" style={{ color: "var(--wa-green)", fontSize: 13 }}>
                Step {index + 1} of {STEPS.length}
              </span>
              <br />
              {step.title}
            </h3>
            <p>{step.text}</p>
          </div>
        </div>
        <div className="wa-demo-code wa-fade-in" key={`panel-${index}`}>
          <Panel step={step} />
        </div>
      </div>
      <p className="wa-demo-note">
        Webhooks currently cover message status events (accepted, sent, delivered, read, failed). Customer replies are
        handled in the Bizuply WhatsApp inbox and are not forwarded to external webhooks yet.
      </p>
    </div>
  );
}
