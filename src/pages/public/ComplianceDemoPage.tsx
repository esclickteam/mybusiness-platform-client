import { FormEvent, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { PlanCards } from "./ComplianceCommercial";
import { ComplianceReportView } from "./ComplianceReportView";
import { FreeResult } from "./ComplianceCommercial";
import { DEMO_PAYLOAD, DEMO_SUMMARY } from "./complianceDemoFixture";
import "./complianceScanner.css";
import "./complianceDemo.css";

type Stage = "form" | "live" | "free" | "full" | "pdf" | "plans";

const STEPS = [
  { phase: "checks", current: "פרטיות ועוגיות", completed: 3, total: 12, categories: { privacy: "checking", security: "waiting", accessibility: "waiting", documents: "waiting" } },
  { phase: "checks", current: "אבטחת אתר", completed: 6, total: 12, categories: { privacy: "done", security: "checking", accessibility: "waiting", documents: "waiting" } },
  { phase: "checks", current: "נגישות", completed: 9, total: 12, categories: { privacy: "done", security: "done", accessibility: "checking", documents: "waiting" } },
  { phase: "documents", current: "מסמכים ותנאים", completed: 11, total: 12, categories: { privacy: "done", security: "done", accessibility: "done", documents: "checking" } },
  { phase: "done", current: "הסריקה לדוגמה הסתיימה", completed: 12, total: 12, categories: { privacy: "done", security: "done", accessibility: "done", documents: "done" } },
];

const LIVE = {
  liveTitle: "אנחנו בודקים את האתר שלך",
  live_checks: "מריצים בדיקות אבטחה, פרטיות ונגישות",
  live_documents: "קוראים מסמכים משפטיים",
  live_done: "הסריקה לדוגמה הסתיימה",
  catSecurity: "אבטחת אתר",
  catPrivacy: "פרטיות ועוגיות",
  catAccess: "נגישות",
  catDocs: "מסמכים ותנאים",
  state_waiting: "ממתין",
  state_checking: "בבדיקה",
  state_done: "הושלם",
  now: "עכשיו: {name}",
  doneOf: "הושלמו {done} מתוך {total}",
};

function Live({ url, progress }: { url: string; progress: (typeof STEPS)[number] }) {
  const categories = [
    ["privacy", LIVE.catPrivacy],
    ["security", LIVE.catSecurity],
    ["accessibility", LIVE.catAccess],
    ["documents", LIVE.catDocs],
  ] as const;
  const phaseKey = progress.phase === "documents" ? "live_documents" : progress.phase === "done" ? "live_done" : "live_checks";
  return (
    <section className="scan-live" aria-live="polite" data-demo="live">
      <p className="demo-flag">הדגמה עם נתונים להמחשה</p>
      <h2>{LIVE.liveTitle}</h2>
      <p className="scan-live__url" dir="ltr">{url}</p>
      <p className="scan-live__phase">{LIVE[phaseKey]}</p>
      <p className="scan-live__phase">{LIVE.now.replace("{name}", progress.current)}</p>
      <p className="scan-live__phase">{LIVE.doneOf.replace("{done}", String(progress.completed)).replace("{total}", String(progress.total))}</p>
      <div className="scan-live__bar" role="progressbar" aria-valuenow={progress.completed} aria-valuemin={0} aria-valuemax={progress.total}>
        <span style={{ width: `${(progress.completed / progress.total) * 100}%` }} />
      </div>
      <ul className="scan-live__cats">
        {categories.map(([key, label]) => {
          const state = progress.categories[key] || "waiting";
          return (
            <li key={key} className={`is-${state}`}>
              <b>{label}</b>
              <em>{LIVE[`state_${state}` as "state_waiting"]}</em>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default function ComplianceDemoPage() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [stage, setStage] = useState<Stage>("form");
  const [step, setStep] = useState(0);
  const [pdf, setPdf] = useState(false);
  const shownUrl = url.replace(/^https?:\/\//, "") || "example.com";

  useEffect(() => {
    if (stage !== "live") return undefined;
    if (step >= STEPS.length - 1) return undefined;
    const timer = window.setTimeout(() => setStep((value) => value + 1), 2800);
    return () => window.clearTimeout(timer);
  }, [stage, step]);

  function start(event: FormEvent) {
    event.preventDefault();
    setStep(0);
    setStage("live");
  }

  return (
    <main className="scan-product demo-scan" dir="rtl" lang="he">
      <Helmet>
        <title>הדגמת סריקה | Bizuply</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <p className="demo-banner">הדגמה עם נתונים להמחשה. לא מתבצעת סריקה ולא נשמר דוח.</p>
      {stage === "form" && (
        <form onSubmit={start}>
          <section className="scan-hero">
            <div className="scan-hero__copy">
              <p className="scan-kicker">פרטיות · נגישות · אבטחה · רגולציה</p>
              <h1>בדקו את האתר מול מה שהוא באמת מפרסם</h1>
              <p className="scan-lead">סריקה טכנית וניתוח מסמכים של תקנון, פרטיות, עוגיות, נגישות ותנאי תשלום. הממצאים נשענים על הטקסט שנקרא, לא על ניחוש.</p>
              <div className="scan-panel">
                <div className="scan-launch">
                  <label className="scan-url">
                    <span>שם מלא</span>
                    <input data-demo="name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                  </label>
                  <label className="scan-url">
                    <span>כתובת האתר</span>
                    <input data-demo="url" value={url} onChange={(event) => setUrl(event.target.value)} inputMode="url" required />
                  </label>
                  <button className="scan-start" data-demo="start" type="submit">התחילו סריקה</button>
                </div>
                <p className="scan-name-note">השם בהדגמה אינו נשמר.</p>
                <div className="scan-field">
                  <span>איפה העסק פועל</span>
                  <div className="scan-tags"><button type="button">ישראל · מקור מאומת</button></div>
                </div>
                <div className="scan-field">
                  <span>סוג הפעילות</span>
                  <div className="scan-types"><button type="button" className="is-on" aria-pressed="true">אתר תדמית</button></div>
                </div>
                <p className="scan-notice">הבדיקה אוטומטית. היא אינה ייעוץ משפטי, חוות דעת או אישור עמידה בחוק.</p>
              </div>
            </div>
          </section>
        </form>
      )}
      {stage === "live" && (
        <>
          <Live url={url.startsWith("http") ? url : `https://${url}`} progress={STEPS[step]} />
          {step >= STEPS.length - 1 && (
            <p className="demo-next"><button type="button" data-demo="results" onClick={() => setStage("free")}>פתחו את הדוח הראשוני</button></p>
          )}
        </>
      )}
      {stage === "free" && (
        <section className="scan-report">
          <p className="demo-flag">הדגמה עם נתונים להמחשה. הדוח החינמי אינו מציג את פירוט הממצאים.</p>
          <FreeResult locale="he" summary={{ ...DEMO_SUMMARY, host: shownUrl.replace(/\/$/, ""), url: url.startsWith("http") ? url : `https://${shownUrl}` }} status="completed" />
          <p className="demo-next"><button type="button" data-demo="full" onClick={() => setStage("full")}>הדגמת הדוח המלא</button></p>
        </section>
      )}
      {(stage === "full" || stage === "pdf" || stage === "plans") && (
        <section className="scan-report" data-demo="report">
          <p className="demo-flag">הדגמה עם נתונים להמחשה. זה אינו דוח של אתר אמיתי ולא בוצעה רכישה.</p>
          <ComplianceReportView locale="he" payload={DEMO_PAYLOAD} onPdf={() => { setPdf(true); setStage("pdf"); }} />
          <PlanCards locale="he" />
        </section>
      )}
      {pdf && (
        <div className="demo-pdf" role="dialog" aria-modal="true" aria-labelledby="demo-pdf-title" data-demo="pdf-preview">
          <article>
            <p>Bizuply Compliance AI</p>
            <h2 id="demo-pdf-title">דוח סריקה לדוגמה</h2>
            <p dir="ltr">example.com · 9 בנובמבר 2026</p>
            <p>ציון 82/100 · היקף בדיקות שהוכרעו 94% · 28 תקינות · 7 דורשות טיפול · 2 חסרות · 2 לא הוכרעו</p>
            <h3>כותרת Content-Security-Policy חסרה בתגובה שנבדקה</h3>
            <p>חומרה: בינונית</p>
            <p dir="ltr">https://example.com/</p>
            <p>ראיה: התשובה לא כללה את הכותרת Content-Security-Policy.</p>
            <p>המלצה: להגדיר מדיניות שמתאימה למשאבים של האתר ולבדוק אותה לפני פרסום.</p>
            <p>מקור: MDN, Content-Security-Policy.</p>
            <p>בדיקה: לטעון את העמוד ולוודא שהכותרת מופיעה בתשובה.</p>
            <footer>תצוגה מקדימה של PDF להמחשה. לא נוצר קובץ של סריקה אמיתית.</footer>
            <p><button type="button" data-demo="plans" onClick={() => { setPdf(false); setStage("plans"); }}>המשיכו למסלולים</button></p>
          </article>
        </div>
      )}
      <p className="demo-caption" data-demo="caption">
        {stage === "form" && "מזינים שם וכתובת אתר"}
        {stage === "live" && "הסריקה בודקת פרטיות, אבטחה, נגישות ומסמכים"}
        {stage === "free" && "הדוח החינמי מציג תמונת מצב, בלי פירוט הממצאים"}
        {stage === "full" && !pdf && "הדוח המלא מציג ראיה, המלצה ומקור"}
        {pdf && "תצוגה מקדימה של ה־PDF. הרכישה אינה פעילה"}
        {stage === "plans" && "דוח ראשוני בחינם. דוח מלא 35 דולר. מנוי שנתי 300 דולר לשנה, מתחדש אוטומטית ואפשר לבטל את החידוש"}
      </p>
    </main>
  );
}
