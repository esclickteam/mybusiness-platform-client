import { FormEvent, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { PlanCards } from "./ComplianceCommercial";
import { ComplianceReportView } from "./ComplianceReportView";
import { FreeResult } from "./ComplianceCommercial";
import { DEMO_SUMMARY } from "./complianceDemoFixture";
import { DEMO_UI, demoLocale, localizedDemoPayload } from "./complianceDemoCopy";
import "./complianceScanner.css";
import "./complianceDemo.css";

type Stage = "form" | "live" | "free" | "full" | "pdf" | "plans";

export default function ComplianceDemoPage() {
  const { i18n } = useTranslation();
  const [params] = useSearchParams();
  const locale = demoLocale(params.get("lang") || i18n.language);
  const copy = DEMO_UI[locale];
  const film = params.get("film") === "1";
  const dir = locale === "he" || locale === "ar" ? "rtl" : "ltr";
  const payload = useMemo(() => localizedDemoPayload(locale), [locale]);
  const steps = useMemo(() => {
    const cats = copy.cats;
    const states = (current: number) => ({
      privacy: current > 0 ? "done" : current === 0 ? "checking" : "waiting",
      security: current > 1 ? "done" : current === 1 ? "checking" : "waiting",
      accessibility: current > 2 ? "done" : current === 2 ? "checking" : "waiting",
      documents: current > 3 ? "done" : current === 3 ? "checking" : "waiting",
    }) as Record<string, "waiting" | "checking" | "done">;
    return [0, 1, 2, 3, 4].map((index) => ({
      phase: index === 3 ? "documents" : index === 4 ? "done" : "checks",
      current: index === 4 ? copy.finished : cats[index],
      completed: index === 4 ? 12 : 3 + index * 3,
      total: 12,
      categories: index === 4
        ? { privacy: "done", security: "done", accessibility: "done", documents: "done" }
        : states(index),
    }));
  }, [copy]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [stage, setStage] = useState<Stage>("form");
  const [step, setStep] = useState(0);
  const [pdf, setPdf] = useState(false);
  const shownUrl = url.replace(/^https?:\/\//, "") || "example.com";

  useEffect(() => {
    if (stage !== "live") return undefined;
    if (step >= steps.length - 1) return undefined;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 1500);
    return () => window.clearTimeout(timer);
  }, [stage, step, steps.length]);

  function start(event: FormEvent) {
    event.preventDefault();
    setStep(0);
    setStage("live");
  }

  const progress = steps[step];
  const categories = [
    ["privacy", copy.cats[0]],
    ["security", copy.cats[1]],
    ["accessibility", copy.cats[2]],
    ["documents", copy.cats[3]],
  ] as const;
  const phaseKey = progress.phase === "documents" ? copy.liveDocs : progress.phase === "done" ? copy.liveDone : copy.liveChecks;
  const stateLabel = { waiting: copy.waiting, checking: copy.checking, done: copy.done };

  return (
    <main className={`scan-product demo-scan${film ? " demo-scan--film" : ""}`} dir={dir} lang={locale}>
      <Helmet>
        <title>{copy.title}</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <p className="demo-banner">{copy.banner}</p>
      {stage === "form" && (
        <form onSubmit={start}>
          <section className="scan-hero">
            <div className="scan-hero__copy">
              <p className="scan-kicker">{copy.flag}</p>
              <h1>{copy.liveTitle}</h1>
              <p className="scan-lead">{copy.notice}</p>
              <div className="scan-panel">
                <div className="scan-launch">
                  <label className="scan-url">
                    <span>{copy.name}</span>
                    <input data-demo="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                  </label>
                  <label className="scan-url">
                    <span>{copy.url}</span>
                    <input data-demo="url" value={url} onChange={(event) => setUrl(event.target.value)} inputMode="url" required />
                  </label>
                  <button className="scan-start" data-demo="start" type="submit">{copy.start}</button>
                </div>
                <p className="scan-name-note">{copy.note}</p>
                {!film && (
                  <>
                    <div className="scan-field">
                      <span>{locale === "he" ? "איפה העסק פועל" : copy.flag}</span>
                      <div className="scan-tags"><button type="button">example.com</button></div>
                    </div>
                  </>
                )}
                <p className="scan-notice">{copy.notice}</p>
              </div>
            </div>
          </section>
        </form>
      )}
      {stage === "live" && (
        <>
          <section className="scan-live" aria-live="polite" data-demo="live">
            <p className="demo-flag">{copy.flag}</p>
            <h2>{copy.liveTitle}</h2>
            <p className="scan-live__url" dir="ltr">{url.startsWith("http") ? url : `https://${url}`}</p>
            <p className="scan-live__phase">{phaseKey}</p>
            <p className="scan-live__phase">{copy.now.replace("{name}", progress.current)}</p>
            <p className="scan-live__phase">{copy.doneOf.replace("{done}", String(progress.completed)).replace("{total}", String(progress.total))}</p>
            <div className="scan-live__bar" role="progressbar" aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={progress.total}>
              <span style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
            </div>
            <ul className="scan-live__cats">
              {categories.map(([key, label]) => {
                const state = progress.categories[key] || "waiting";
                return (
                  <li key={key} className={`is-${state}`}>
                    <b>{label}</b>
                    <em>{stateLabel[state]}</em>
                  </li>
                );
              })}
            </ul>
          </section>
          {step >= steps.length - 1 && (
            <p className="demo-next"><button type="button" data-demo="results" onClick={() => setStage("free")}>{copy.results}</button></p>
          )}
        </>
      )}
      {stage === "free" && (
        <section className="scan-report">
          <p className="demo-flag">{copy.freeFlag}</p>
          <FreeResult locale={locale} summary={{ ...DEMO_SUMMARY, host: shownUrl.replace(/\/$/, ""), url: url.startsWith("http") ? url : `https://${shownUrl}` }} status="completed" />
          <p className="demo-next"><button type="button" data-demo="full" onClick={() => setStage("full")}>{copy.full}</button></p>
        </section>
      )}
      {(stage === "full" || stage === "pdf" || stage === "plans") && (
        <section className="scan-report" data-demo="report">
          <p className="demo-flag">{copy.reportFlag}</p>
          <ComplianceReportView locale={locale} payload={payload} onPdf={() => { setPdf(true); setStage("pdf"); }} />
          {!film && <PlanCards locale={locale} />}
        </section>
      )}
      {pdf && (
        <div className="demo-pdf" role="dialog" aria-modal="true" aria-labelledby="demo-pdf-title" data-demo="pdf-preview">
          <article>
            <p>Bizuply Compliance AI</p>
            <h2 id="demo-pdf-title">{copy.pdfTitle}</h2>
            <p dir="ltr">example.com · 9 Nov 2026</p>
            <p>{copy.pdfMeta}</p>
            <h3>{copy.pdfFinding}</h3>
            <p>{copy.pdfSeverity}</p>
            <p dir="ltr">https://example.com/</p>
            <p>{copy.pdfEvidence}</p>
            <p>{copy.pdfFix}</p>
            <p>{copy.pdfSource}</p>
            <p>{copy.pdfCheck}</p>
            <footer>{copy.pdfFoot}</footer>
            {!film && <p><button type="button" data-demo="plans" onClick={() => { setPdf(false); setStage("plans"); }}>{copy.full}</button></p>}
          </article>
        </div>
      )}
    </main>
  );
}
