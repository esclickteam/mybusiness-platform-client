import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowRight, Check, LogIn } from "lucide-react";
import { useLocation } from "react-router-dom";
import { coerceSupportedLanguage } from "../../../../i18n/localeUtils";
import { useWhatsAppApiAuthConfig } from "../../../../components/whatsappApiAuth/authConfig";
import ContactRequestForm from "../ContactRequestForm";
import SignupCheckoutForm from "../SignupCheckoutForm";
import { getStartedCopy, type Actor } from "../getStartedCopy";
import { META_BUSINESS_VERIFICATION_URL, SIGN_IN_URL, SUPPORT_EMAIL } from "../siteConfig";
import { Callout, SectionHead } from "../ui";

const ACTOR_TONE: Record<Actor, string> = { you: "is-info", meta: "is-warn", bizuply: "is-ok" };

const PROVIDER_NAMES = { google: "Google", microsoft: "Microsoft" } as const;

export default function GetStartedPage() {
  const { i18n } = useTranslation();
  const c = getStartedCopy(coerceSupportedLanguage(i18n.language));
  const authConfig = useWhatsAppApiAuthConfig();
  const { selfServe } = authConfig;
  const STAGES = [c.accountStage[selfServe ? "selfServe" : "request"], ...c.nextStages];
  const providerNames = authConfig.providers
    .filter((p): p is keyof typeof PROVIDER_NAMES => p in PROVIDER_NAMES)
    .map((p) => PROVIDER_NAMES[p]);
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) document.getElementById(hash.slice(1))?.scrollIntoView({ block: "start" });
  }, [hash, selfServe]);
  return (
    <>
      <section className="wa-page-hero">
        <div className="wa-wrap">
          <SectionHead as="h1" eyebrow={c.hero.eyebrow} title={c.hero.title} lead={c.hero.lead} />
          <div className="wa-actions" style={{ marginTop: -12 }}>
            <a className="wa-btn wa-btn-ghost" href={SIGN_IN_URL}>
              <LogIn size={16} aria-hidden="true" /> {c.hero.login}
            </a>
            <a className="wa-btn wa-btn-primary" href="#request-access">
              {selfServe ? c.hero.start : c.hero.request} <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="wa-section is-tight" aria-labelledby="wa-stages">
        <div className="wa-wrap">
          <h2 id="wa-stages" className="wa-h2" style={{ marginBottom: 24 }}>{c.stagesTitle}</h2>
          <ol className="wa-progress" style={{ ["--wa-steps" as string]: STAGES.length } as React.CSSProperties} aria-label={c.stagesLabel}>
            {STAGES.map((stage, index) => (
              <li key={stage.title} className={index === 0 ? "is-current" : undefined}>
                <span>
                  <span className="wa-sr">{c.step(index + 1)}</span>
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
                        <span key={actor} className={`wa-badge ${ACTOR_TONE[actor]}`}>{c.actors[actor]}</span>
                      ))}
                      {stage.meta ? <span className="wa-badge">{c.metaRequirement}</span> : null}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div style={{ display: "grid", gap: 16 }}>
              <article className="wa-card">
                <h3 className="wa-h3">{c.needsTitle}</h3>
                <ul className="wa-list">
                  {c.needs.map((item) => (
                    <li key={item}><Check size={16} aria-hidden="true" /> {item}</li>
                  ))}
                </ul>
              </article>
              <Callout tone="warn">
                <p>
                  <strong>{c.approval.strong}</strong> {c.approval.text}{" "}
                  <a className="wa-link" href={META_BUSINESS_VERIFICATION_URL} target="_blank" rel="noreferrer">
                    {c.approval.link}
                  </a>
                </p>
              </Callout>
              <Callout tone="info">
                <p>
                  <strong>{c.migrate.strong}</strong> {c.migrate.before}{" "}
                  <a className="wa-link" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> {c.migrate.after}
                </p>
              </Callout>
            </div>
          </div>
        </div>
      </section>

      <section className="wa-section is-band" aria-labelledby="wa-status-ref">
        <div className="wa-wrap">
          <SectionHead
            eyebrow={c.statuses.eyebrow}
            title={<span id="wa-status-ref">{c.statuses.title}</span>}
            lead={c.statuses.lead}
          />
          <div className="wa-table-wrap">
            <table className="wa-table">
              <thead>
                <tr><th scope="col">{c.statuses.status}</th><th scope="col">{c.statuses.meaning}</th></tr>
              </thead>
              <tbody>
                {c.statuses.rows.map(([name, text]) => (
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
              <p className="wa-eyebrow">{c.signup.eyebrow}</p>
              <h2 id="wa-request" className="wa-h2">{c.signup.title}</h2>
              <p className="wa-lead">{c.signup.lead}</p>
              <ol className="wa-list" style={{ marginTop: 20 }}>
                <li><Check size={16} aria-hidden="true" /> {c.signup.methods(providerNames)}</li>
                <li><Check size={16} aria-hidden="true" /> {c.signup.pay}</li>
                <li><Check size={16} aria-hidden="true" /> {c.signup.details}</li>
              </ol>
            </div>
          ) : (
            <div>
              <p className="wa-eyebrow">{c.signup.eyebrow}</p>
              <h2 id="wa-request" className="wa-h2">{c.signup.requestTitle}</h2>
              <p className="wa-lead">{c.signup.requestLead}</p>
            </div>
          )}
          <div className="wa-card">
            {selfServe ? <SignupCheckoutForm config={authConfig} /> : <ContactRequestForm defaultIntent="connect" />}
          </div>
        </div>
      </section>
    </>
  );
}
