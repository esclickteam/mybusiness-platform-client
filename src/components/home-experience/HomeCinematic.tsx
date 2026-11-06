import { useEffect, useState, type ReactNode } from "react";
import { cinematicFor } from "../../lib/homeCinematic.mjs";

type Copy = ReturnType<typeof cinematicFor>;

export function useCinematic(language: string) {
  return cinematicFor(language) as Copy;
}

export function HeroDecor({ copy, reduced }: { copy: Copy; reduced: boolean }) {
  const hero = copy.hero;
  return (
    <>
      <svg className="hx-links" viewBox="0 0 640 420" aria-hidden="true">
        <path className="hx-link-path" d="M120 310 C 220 250, 280 210, 390 168" />
        <path className="hx-link-path hx-link-path-b" d="M150 120 C 240 150, 300 190, 410 230" />
        <circle className="hx-spark" cx="120" cy="310" r="3.5" />
        <circle className="hx-spark hx-spark-b" cx="150" cy="120" r="3.5" />
      </svg>
      <aside className="hx-float-card hx-lead-note" aria-label={hero.demo}>
        <p className="hx-kicker">{hero.demo}</p>
        <strong>{hero.leadTitle}</strong>
        <span>{hero.leadName}</span>
        <em>{hero.leadBody}</em>
        <b>{hero.leadStatus}</b>
      </aside>
      <aside className="hx-float-card hx-pulse" aria-label={hero.demo}>
        <p className="hx-kicker">{hero.demo}</p>
        <strong>{hero.pulseTitle}</strong>
        <ul>
          {hero.pulseRows.map((label, index) => (
            <li key={label}>
              <span>{label}</span>
              <b>{hero.pulseValues[index]}</b>
            </li>
          ))}
        </ul>
        <small>{hero.pulseNote}</small>
      </aside>
      <a className={`hx-scroll-cue${reduced ? " is-still" : ""}`} href="#hx-connect">
        <span>{hero.scroll}</span>
        <i aria-hidden="true" />
      </a>
    </>
  );
}

export function ConnectedFlow({ copy }: { copy: Copy }) {
  const [step, setStep] = useState(0);
  const [played, setPlayed] = useState(false);
  useEffect(() => {
    const node = document.getElementById("hx-connect");
    if (!node) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setStep(copy.stations.length);
      return undefined;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      setPlayed(true);
      observer.disconnect();
    }, { threshold: 0.35 });
    observer.observe(node);
    return () => observer.disconnect();
  }, [copy.stations.length]);
  useEffect(() => {
    if (!played) return undefined;
    if (step >= copy.stations.length) return undefined;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 700);
    return () => window.clearTimeout(timer);
  }, [played, step, copy.stations.length]);
  return (
    <ol className={`hx-flow${step >= copy.stations.length ? " is-done" : ""}`} aria-label={copy.connectTitle}>
      {copy.stations.map((label, index) => (
        <li key={label} className={index < step ? "is-on" : undefined}>
          <span>{index + 1}</span>
          <strong>{label}</strong>
        </li>
      ))}
    </ol>
  );
}

export function CrmStory({ copy }: { copy: Copy }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const node = document.getElementById("hx-crm-title")?.closest("section");
    if (!node) return undefined;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setPhase(4);
      return undefined;
    }
    let timers: number[] = [];
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || timers.length) return;
      [1, 2, 3, 4].forEach((next, index) => {
        timers.push(window.setTimeout(() => setPhase(next), 500 + index * 700));
      });
      observer.disconnect();
    }, { threshold: 0.3 });
    observer.observe(node);
    return () => {
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);
  return (
    <div className={`hx-crm-story is-${phase}`} aria-hidden="true">
      <p className="hx-story-card">
        <small>{copy.hero.demo}</small>
        <strong>{copy.hero.leadName}</strong>
        <em className={phase >= 2 ? "is-next" : undefined}>{phase >= 2 ? copy.crmStatusTo : copy.crmStatusFrom}</em>
      </p>
      <p className={`hx-story-task${phase >= 3 ? " is-on" : ""}`}>{copy.crmTask}</p>
      <p className={`hx-story-customer${phase >= 4 ? " is-on" : ""}`}>{copy.crmCustomer}</p>
    </div>
  );
}

export function PhoneStory({ copy }: { copy: Copy }) {
  return (
    <div className="hx-phone" aria-label={copy.waDemo}>
      <div className="hx-phone-screen">
        <p className="hx-bubble hx-bubble-biz">{copy.waBiz}</p>
        <p className="hx-bubble hx-bubble-customer">{copy.waCustomer}</p>
        <p className="hx-bubble hx-bubble-biz hx-bubble-late">{copy.waBiz2}</p>
      </div>
      <small>{copy.waDemo}</small>
    </div>
  );
}

export function AppointmentsBand({
  copy,
  shot,
}: {
  copy: Copy;
  shot: ReactNode;
}) {
  return (
    <section className="hx-appoint" aria-labelledby="hx-appoint-title">
      <div className="hx-appoint-copy">
        <h2 id="hx-appoint-title">{copy.apptTitle}</h2>
        <p>{copy.apptLead}</p>
      </div>
      <div className="hx-appoint-stage">
        {shot}
        <aside className="hx-appoint-card">
          <small>{copy.hero.demo}</small>
          <strong>{copy.apptCard}</strong>
          <span>{copy.apptWho}</span>
          <b>{copy.apptStatus}</b>
        </aside>
      </div>
    </section>
  );
}

export function OrbitBand({ copy }: { copy: Copy }) {
  return (
    <section className="hx-orbit-band" aria-labelledby="hx-orbit-title">
      <div className="hx-orbit-copy">
        <h2 id="hx-orbit-title">{copy.whyTitle}</h2>
        <p>{copy.whyLead}</p>
      </div>
      <div className="hx-orbit-map">
        <strong>BizUply</strong>
        <ul>
          {copy.orbit.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function GrowthBand({ copy }: { copy: Copy }) {
  return (
    <section className="hx-grow" aria-labelledby="hx-grow-title">
      <h2 id="hx-grow-title">{copy.growTitle}</h2>
      <p>{copy.growLead}</p>
      <ol>
        {copy.growSteps.map(([name, body]) => (
          <li key={name}>
            <strong>{name}</strong>
            <span>{body}</span>
          </li>
        ))}
      </ol>
      <small>{copy.growNote}</small>
    </section>
  );
}
