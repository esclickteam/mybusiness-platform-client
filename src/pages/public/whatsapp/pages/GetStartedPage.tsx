import React, { useEffect, useState } from "react";
import { ArrowRight, Check, LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";
import API from "../../../../api";
import ContactRequestForm from "../ContactRequestForm";
import SignupCheckoutForm from "../SignupCheckoutForm";
import { META_BUSINESS_VERIFICATION_URL, SIGN_IN_URL } from "../siteConfig";
import { Callout, SectionHead } from "../ui";

type Actor = "You" | "Meta" | "Bizuply";

const STAGES: Array<{ title: string; text: string; actors: Actor[]; meta?: boolean }> = [
  {
    title: "Get access to Bizuply",
    text: "Existing customers log in. New customers send the request form below, and we reply with access to a workspace for your number.",
    actors: ["You", "Bizuply"],
  },
  {
    title: "Open Embedded Signup",
    text: "In the dashboard go to WhatsApp → Connection and start Meta's Embedded Signup. You sign in with your Facebook account and choose, or create, the Meta Business account and WhatsApp Business Account.",
    actors: ["You", "Meta"],
    meta: true,
  },
  {
    title: "Add and verify the phone number",
    text: "Enter the number and confirm you own it with a one-time code sent by SMS or voice call. Set the display name customers will see.",
    actors: ["You", "Meta"],
    meta: true,
  },
  {
    title: "Meta reviews",
    text: "Meta reviews the display name and may ask for business verification or review the account. Until then, messaging volume can be limited.",
    actors: ["Meta"],
    meta: true,
  },
  {
    title: "Add a payment method in Meta",
    text: "Meta bills messaging charges to the WhatsApp Business Account, so a valid payment method is needed for paid messages.",
    actors: ["You", "Meta"],
    meta: true,
  },
  {
    title: "Create templates and an API key",
    text: "Submit message templates for Meta's review, then create an API key and a webhook URL under WhatsApp → API / Developers.",
    actors: ["You", "Meta"],
  },
];

const STATUSES = [
  ["Connection", "Whether the WhatsApp Business Account and number are linked to your workspace and ready to send."],
  ["Phone number registration", "Whether the number is registered on the WhatsApp Cloud API."],
  ["Code verification", "Whether ownership of the number was confirmed with the one-time code."],
  ["Display name", "Meta's review status for the name shown to customers."],
  ["Business verification", "Whether Meta has verified the business, when it's required."],
  ["Quality rating", "Meta's rating of recent message quality, based on customer feedback."],
  ["Messaging limit", "How many unique customers you can start conversations with in 24 hours. Meta raises this over time."],
  ["Payment method", "Whether Meta has a valid payment method for messaging charges."],
] as const;

const NEEDS = [
  "A Facebook account with admin access to your company's Meta Business account, or permission to create one",
  "A phone number that can receive an SMS or voice call",
  "A display name that matches your business and follows Meta's display name guidelines",
  "A payment method you can add in Meta for messaging charges",
];

const ACTOR_TONE: Record<Actor, string> = { You: "is-info", Meta: "is-warn", Bizuply: "is-ok" };

function useSelfServeSignup() {
  const [selfServe, setSelfServe] = useState(false);
  useEffect(() => {
    let alive = true;
    API.get("/whatsapp-api/availability")
      .then(({ data }) => {
        if (alive) setSelfServe(Boolean(data?.selfServe));
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);
  return selfServe;
}

export default function GetStartedPage() {
  const selfServe = useSelfServeSignup();
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash, selfServe]);
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead
            as="h1"
            eyebrow="Connect WhatsApp"
            title="Connect your WhatsApp number."
            lead="Numbers are connected through Meta's Embedded Signup inside the Bizuply dashboard. Here's what happens at each step, who acts, and which Meta checks can apply."
          />
          <div className="wa-actions" style={{ marginTop: -12 }}>
            <a className="wa-btn wa-btn-primary" href={SIGN_IN_URL}>
              <LogIn size={16} aria-hidden="true" /> I have a Bizuply account
            </a>
            <a className="wa-btn wa-btn-ghost" href="#request-access">
              I'm new to Bizuply <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-stages">
        <div className="wa-wrap">
          <h2 id="wa-stages" className="wa-h2" style={{ marginBottom: 24 }}>Onboarding, step by step</h2>
          <ol className="wa-progress" style={{ ["--wa-steps" as string]: STAGES.length } as React.CSSProperties} aria-label="Onboarding stages">
            {STAGES.map((stage, index) => (
              <li key={stage.title} className={index === 0 ? "is-current" : undefined}>
                <span>
                  <span className="wa-sr">Step {index + 1}: </span>
                  {stage.title}
                </span>
              </li>
            ))}
          </ol>
          <div className="wa-split" style={{ alignItems: "start" }}>
            <ol className="wa-steps">
              {STAGES.map((stage, index) => (
                <li className="wa-step" key={stage.title}>
                  <span className="wa-step-n" aria-hidden="true">0{index + 1}</span>
                  <div className="wa-step-body">
                    <h3>{stage.title}</h3>
                    <p>{stage.text}</p>
                    <div className="wa-step-meta">
                      {stage.actors.map((actor) => (
                        <span key={actor} className={`wa-badge ${ACTOR_TONE[actor]}`}>{actor}</span>
                      ))}
                      {stage.meta ? <span className="wa-badge">Meta requirement</span> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div style={{ display: "grid", gap: 16 }}>
              <article className="wa-card">
                <h3 className="wa-h3">What you'll need</h3>
                <ul className="wa-list">
                  {NEEDS.map((item) => (
                    <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
                  ))}
                </ul>
              </article>
              <Callout tone="warn">
                <p>
                  <strong>Approval isn't instant or guaranteed.</strong> Meta decides on display names, business verification
                  and messaging limits, and can take longer for some businesses or categories. Bizuply doesn't add its own
                  approval queue, and it can't skip Meta's requirements.{" "}
                  <a className="wa-link" href={META_BUSINESS_VERIFICATION_URL} target="_blank" rel="noreferrer">
                    About Meta business verification
                  </a>
                </p>
              </Callout>
              <Callout tone="info">
                <p>
                  <strong>Using the number in the WhatsApp app today?</strong> Depending on what Meta supports for that number,
                  you may need to migrate it or remove it from the app before it can be registered on the Cloud API. Tell us
                  in the form and we'll check with you first.
                </p>
              </Callout>
            </div>
          </div>
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-status-ref">
        <div className="wa-wrap">
          <SectionHead
            eyebrow="After you connect"
            title={<span id="wa-status-ref">Statuses you'll see in the dashboard.</span>}
            lead="WhatsApp → Connection shows Meta's live status for your account and number, with a message explaining what to do whenever action is needed."
          />
          <div className="wa-table-wrap">
            <table className="wa-table">
              <thead>
                <tr><th scope="col">Status</th><th scope="col">What it tells you</th></tr>
              </thead>
              <tbody>
                {STATUSES.map(([name, text]) => (
                  <tr key={name}><td><strong>{name}</strong></td><td>{text}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="wa-section" id="request-access" aria-labelledby="wa-request">
        <div className="wa-wrap wa-split" style={{ alignItems: "start" }}>
          {selfServe ? (
            <div>
              <p className="wa-eyebrow">New to Bizuply</p>
              <h2 id="wa-request" className="wa-h2">Create your account.</h2>
              <p className="wa-lead">
                $29/month. Meta messaging charges are additional. Pay securely with Lemon Squeezy; your workspace is ready
                as soon as the payment goes through, and you can connect your number from WhatsApp → Connection.
              </p>
            </div>
          ) : (
            <div>
              <p className="wa-eyebrow">New to Bizuply</p>
              <h2 id="wa-request" className="wa-h2">Request onboarding.</h2>
              <p className="wa-lead">
                $29/month per WhatsApp number. Meta messaging charges are additional. Send us your details and we'll reply by
                email with access and the next steps.
              </p>
            </div>
          )}
          <div className="wa-card">
            {selfServe ? <SignupCheckoutForm /> : <ContactRequestForm defaultIntent="connect" />}
          </div>
        </div>
      </section>
    </>
  );
}
