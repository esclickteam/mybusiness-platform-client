import React, { useEffect, useRef, useState } from "react";
import { Check, Layers, Pause, Play, RotateCcw, Send, Server } from "lucide-react";
import { prefersReducedMotion } from "./ui";

type Scenario = {
  label: string;
  source: string;
  template: string;
  to: string;
  variables: string[];
  business: string;
  initials: string;
  header?: string;
  body: string;
  buttons: string[];
  messageId: string;
};

const SCENARIOS: Scenario[] = [
  {
    label: "Order update",
    source: "Your CRM",
    template: "order_update",
    to: "+15551234567",
    variables: ["Avery", "1042"],
    business: "Northwind Store",
    initials: "NW",
    header: "Order confirmed",
    body: "Hi Avery, your order #1042 is confirmed and will ship today.",
    buttons: ["Track order"],
    messageId: "bizmsg_3f9a1c0e7b2d…",
  },
  {
    label: "Appointment",
    source: "Booking app",
    template: "appointment_reminder",
    to: "+15557654321",
    variables: ["Maya", "Tue 10:30"],
    business: "Brightside Clinic",
    initials: "BC",
    header: "Appointment reminder",
    body: "Hi Maya, this is a reminder of your appointment on Tue 10:30.",
    buttons: ["Confirm", "Reschedule"],
    messageId: "bizmsg_8c41d2a9e05f…",
  },
  {
    label: "Login code",
    source: "Your SaaS",
    template: "login_code",
    to: "+15550198822",
    variables: ["482913"],
    business: "Acme Cloud",
    initials: "AC",
    body: "482913 is your verification code. For your security, do not share this code.",
    buttons: ["Copy code"],
    messageId: "bizmsg_b7e30f61c2a8…",
  },
];

/**
 * Phases: 0 request ready · 1 request travels to Bizuply · 2 checks · 3 sent to WhatsApp (201)
 * 4 notification on the phone · 5 message in chat (sent) · 6 delivered · 7 read
 */
const PHASE_MS = [900, 900, 1200, 900, 900, 1300, 1300, 2800];
const LAST = PHASE_MS.length - 1;

const STATUSES = [
  { key: "accepted", at: 3 },
  { key: "sent", at: 5 },
  { key: "delivered", at: 6 },
  { key: "read", at: 7 },
] as const;

const CHECKS = [
  { text: "API key and scope verified", at: 2 },
  { text: "Template approved by Meta", at: 2 },
  { text: "Sent via WhatsApp Cloud API", at: 3 },
];

function RequestBody({ s }: { s: Scenario }) {
  return (
    <pre className="wa-sim-code">
      <span className="tok-punc">{"{"}</span>
      {"\n  "}<span className="tok-key">"to"</span><span className="tok-punc">: </span><span className="tok-str">"{s.to}"</span><span className="tok-punc">,</span>
      {"\n  "}<span className="tok-key">"template"</span><span className="tok-punc">: </span><span className="tok-str">"{s.template}"</span><span className="tok-punc">,</span>
      {"\n  "}<span className="tok-key">"variables"</span><span className="tok-punc">: [</span>
      {s.variables.map((v, i) => (
        <React.Fragment key={v}>
          <span className="tok-str">"{v}"</span>
          {i < s.variables.length - 1 ? <span className="tok-punc">, </span> : null}
        </React.Fragment>
      ))}
      <span className="tok-punc">]</span>
      {"\n"}<span className="tok-punc">{"}"}</span>
    </pre>
  );
}

export default function HeroSimulation() {
  const [reduced] = useState(prefersReducedMotion);
  const [scenario, setScenario] = useState(0);
  const [phase, setPhase] = useState(reduced ? LAST : 0);
  const [playing, setPlaying] = useState(!reduced);
  const [visible, setVisible] = useState(true);
  const root = useRef<HTMLDivElement>(null);
  const s = SCENARIOS[scenario];

  useEffect(() => {
    const node = root.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || !visible) return undefined;
    const timer = window.setTimeout(() => {
      if (phase < LAST) {
        setPhase(phase + 1);
      } else {
        setScenario((current) => (current + 1) % SCENARIOS.length);
        setPhase(0);
      }
    }, PHASE_MS[phase]);
    return () => window.clearTimeout(timer);
  }, [phase, playing, visible]);

  const choose = (next: number) => {
    setScenario(next);
    setPhase(reduced ? LAST : 0);
    setPlaying(!reduced);
  };

  const replay = () => {
    setPhase(reduced ? LAST : 0);
    setPlaying(!reduced);
  };

  const status = [...STATUSES].reverse().find((item) => phase >= item.at)?.key;

  return (
    <div
      ref={root}
      className="wa-sim"
      data-phase={phase}
      dir="ltr"
      lang="en"
      role="region"
      aria-label="Illustration of a WhatsApp message sent through the Bizuply API"
    >
      <div className="wa-sim-bar">
        <span className="wa-badge is-info">Illustration · sample data</span>
        <div className="wa-sim-tabs" role="group" aria-label="Example message">
          {SCENARIOS.map((item, i) => (
            <button key={item.label} type="button" aria-pressed={i === scenario} onClick={() => choose(i)}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="wa-sim-controls">
          <button
            type="button"
            aria-label={playing ? "Pause animation" : "Play animation"}
            aria-pressed={playing}
            onClick={() => setPlaying((value) => !value)}
          >
            {playing ? <Pause size={14} aria-hidden="true" /> : <Play size={14} aria-hidden="true" />}
          </button>
          <button type="button" aria-label="Replay animation" onClick={replay}>
            <RotateCcw size={14} aria-hidden="true" />
          </button>
        </div>
      </div>

      <p className="wa-sr">
        {s.source} sends the approved template {s.template} to the Bizuply API. Bizuply checks the key and template, sends
        it through the WhatsApp Cloud API, and returns 201 with status accepted. The customer receives the message, and
        status updates follow: sent, delivered and read.
      </p>

      <div className="wa-sim-body" aria-hidden="true">
        <div className="wa-sim-flow">
          <div className="wa-sim-card wa-sim-request">
            <div className="wa-sim-card-head">
              <span className="wa-method is-post">POST</span>
              <code>/api/v1/whatsapp/messages/template</code>
            </div>
            <RequestBody s={s} key={`req-${scenario}`} />
          </div>

          <div className="wa-sim-rail">
            <span className="wa-sim-track"><span className="wa-sim-fill" /></span>
            <span className="wa-sim-packet" />
            <div className="wa-sim-node is-src"><Server size={16} />{s.source}</div>
            <div className="wa-sim-node is-biz"><Layers size={16} />Bizuply</div>
            <div className="wa-sim-node is-wa"><Send size={16} />WhatsApp</div>
          </div>

          <ul className="wa-sim-checks">
            {CHECKS.map((item, i) => (
              <li key={item.text} className={phase >= item.at ? "is-on" : undefined} style={{ transitionDelay: phase >= item.at ? `${i * 160}ms` : "0ms" }}>
                <span><Check size={12} /></span>
                {item.text}
              </li>
            ))}
          </ul>

          <div className="wa-sim-card wa-sim-response">
            <div className="wa-sim-card-head">
              <span className="wa-sim-label">Response</span>
              {phase >= 3 ? <span className="wa-badge is-ok">201 Created</span> : <span className="wa-sim-wait">waiting…</span>}
            </div>
            <div className="wa-sim-response-body">
              <div className="wa-sim-kv">
                <span>messageId</span>
                <code>{phase >= 3 ? s.messageId : "—"}</code>
              </div>
              <div className="wa-sim-statuses">
                {STATUSES.map((item) => (
                  <span
                    key={item.key}
                    className={[phase >= item.at ? "is-done" : "", status === item.key ? "is-current" : ""].join(" ").trim() || undefined}
                  >
                    {item.key}
                  </span>
                ))}
              </div>
              <small className="wa-sim-hint">
                {phase >= 5 ? `Status webhook · whatsapp.message.${status}` : "Status updates arrive as signed webhooks"}
              </small>
            </div>
          </div>
        </div>

        <div className="wa-sim-phone">
          <div className="wa-sim-notify">
            <span className="wa-sim-avatar">{s.initials}</span>
            <div>
              <strong>{s.business}</strong>
              <span>{s.body}</span>
            </div>
          </div>
          <div className="wa-sim-chat-head">
            <span className="wa-sim-avatar">{s.initials}</span>
            <div>
              <strong>{s.business}</strong>
              <small>Business account</small>
            </div>
          </div>
          <div className="wa-sim-chat">
            <span className="wa-sim-day">Today</span>
            {phase >= 5 ? (
              <div className="wa-sim-msg" key={`msg-${scenario}`}>
                {s.header ? <strong>{s.header}</strong> : null}
                <p>{s.body}</p>
                <small>09:41</small>
                {s.buttons.map((label) => (
                  <span key={label} className="wa-sim-msg-btn">{label}</span>
                ))}
              </div>
            ) : null}
          </div>
          <div className="wa-sim-compose">
            <span>Message</span>
          </div>
        </div>
      </div>
    </div>
  );
}
