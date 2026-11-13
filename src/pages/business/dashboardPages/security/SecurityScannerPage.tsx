import { FormEvent, useEffect, useState } from "react";
import API from "../../../../api";
import "./securityScanner.css";

type Progress = { phase: string; checksDone: number; checksTotal: number; pagesDone: number; pagesPlanned: number };
type Finding = { id: string; check: string; title: string; severity: string; confidence: string; summary: string; businessImpact: string; recommendation: string; evidence: string; scanId?: string; domain?: string };
type Site = { id: string; domain: string; ownership: { status: string; token: string; method: string | null }; scope: { status: string }; authorization?: { status: string } | null };
type Scan = { id: string; siteId: string; domain: string; status: string; mode: string; planId: string; progress: Progress; error?: string; report?: { score: { value: number; methodology: string[]; disclaimer: string }; findings: Finding[]; businessSummary: string; disclaimer: string; usage: { requests: number; durationMs: number; estimatedComputeNis: number; externalAiNis: number }; limitations: string[]; comparison?: { added: Finding[]; resolved: Finding[]; remaining: Finding[] } | null } };
type Plan = { id: string; name: string; priceIls: number; unit: string; sellable: boolean };
type Alert = { id: string; title: string; body: string; severity: string };
type Usage = { requests: number; durationMs: number; estimatedComputeNis: number; externalAiNis: number; billingActivated: boolean; entitlement?: { status: string; credits?: Record<string, number>; introUsed?: number } };

const PHASES: Record<string, string> = {
  queued: "ממתינה בתור",
  resolve: "מאמתת את הכתובת",
  tls: "בודקת הצפנה ותעודה",
  headers: "בודקת כותרות אבטחה",
  cookies: "בודקת עוגיות",
  cors: "בודקת CORS",
  exposure: "בודקת מידע חשוף",
  components: "משווה רכיבים לקטלוג",
  forms: "בודקת טפסים",
  api: "בודקת נתיבי API מאושרים",
  dns: "בודקת DNS",
  score: "מחשבת ציון",
  done: "הושלמה",
};

const VIEWS = ["מרכז", "אתר", "סריקות", "ממצאים", "דוח", "השוואה", "התראות", "חבילות"] as const;

function message(error: unknown) {
  const row = error as { response?: { data?: { error?: string } } };
  return row.response?.data?.error || "הפעולה לא הושלמה";
}

export default function SecurityScannerPage() {
  const [view, setView] = useState<(typeof VIEWS)[number]>("מרכז");
  const [sites, setSites] = useState<Site[]>([]);
  const [scans, setScans] = useState<Scan[]>([]);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [selected, setSelected] = useState<Scan | null>(null);
  const [severity, setSeverity] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [domain, setDomain] = useState("");
  const [attested, setAttested] = useState(false);
  const [planId, setPlanId] = useState("professional");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [statement, setStatement] = useState("");
  const [evidenceNote, setEvidenceNote] = useState("");
  const [compareWith, setCompareWith] = useState("");
  const [comparison, setComparison] = useState<{ added: Finding[]; resolved: Finding[]; remaining: Finding[] } | null>(null);

  async function load() {
    const [siteRes, scanRes, planRes, alertRes, usageRes] = await Promise.all([
      API.get("/security-scanner/sites"),
      API.get("/security-scanner/scans"),
      API.get("/security-scanner/plans"),
      API.get("/security-scanner/alerts"),
      API.get("/security-scanner/usage"),
    ]);
    setSites(siteRes.data.sites || []);
    setScans(scanRes.data.scans || []);
    setPlans(planRes.data.plans || []);
    setAlerts(alertRes.data.alerts || []);
    setUsage(usageRes.data);
  }

  useEffect(() => {
    load().catch((reason) => setError(message(reason)));
  }, []);

  useEffect(() => {
    const active = scans.some((scan) => ["queued", "running", "stopping"].includes(scan.status));
    if (!active) return undefined;
    const timer = window.setInterval(() => {
      load().catch(() => undefined);
    }, 2000);
    return () => window.clearInterval(timer);
  }, [scans]);

  async function refreshFindings(level = severity) {
    const response = await API.get("/security-scanner/findings", { params: { severity: level } });
    setFindings(response.data.findings || []);
  }

  async function addSite(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      await API.post("/security-scanner/sites", { domain, attestation: attested });
      setDomain("");
      setAttested(false);
      await load();
      setNotice("האתר נשמר. פרסמו את אסימון האימות לפני סריקה אקטיבית.");
    } catch (reason) {
      setError(message(reason));
    }
  }

  async function verify(site: Site, method: "dns" | "file") {
    setError("");
    try {
      await API.post(`/security-scanner/sites/${site.id}/verify`, { method });
      await load();
      setNotice("הבעלות אומתה וההיקף הבסיסי אושר.");
    } catch (reason) {
      setError(message(reason));
    }
  }

  async function scan(site: Site, mode: "passive" | "active") {
    setError("");
    try {
      const response = await API.post(`/security-scanner/sites/${site.id}/scans`, {
        mode,
        planId: mode === "active" ? planId : "intro",
      });
      setSelected(response.data.scan);
      setView("סריקות");
      await load();
    } catch (reason) {
      setError(message(reason));
    }
  }

  async function stop(scanId: string) {
    await API.post(`/security-scanner/scans/${scanId}/stop`);
    await load();
  }

  async function openReport(scanId: string) {
    const response = await API.get(`/security-scanner/scans/${scanId}`);
    setSelected(response.data);
    setView("דוח");
  }

  async function download(scanId: string) {
    const response = await API.get(`/security-scanner/scans/${scanId}/pdf`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "bizuply-security-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function sendReport(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    setError("");
    try {
      const response = await API.post(`/security-scanner/scans/${selected.id}/send`, { to: email });
      setNotice(response.data.sent ? "הדוח נשלח." : "השליחה נרשמה אבל שרת הדואר אינו מוגדר, ולכן ההודעה לא יצאה.");
    } catch (reason) {
      setError(message(reason));
    }
  }

  async function compare(event: FormEvent) {
    event.preventDefault();
    if (!selected) return;
    const response = await API.get(`/security-scanner/scans/${selected.id}/compare`, { params: { against: compareWith } });
    setComparison(response.data);
  }

  async function order(planId: string) {
    setError("");
    try {
      const response = await API.post("/security-scanner/packages/orders", { packageId: planId });
      setNotice(`ההזמנה נרשמה על סך ${response.data.amountIls} ש״ח. לא בוצע חיוב.`);
      await load();
    } catch (reason) {
      setError(message(reason));
    }
  }

  const progress = selected?.progress;
  const percent = progress?.checksTotal ? Math.round((progress.checksDone / progress.checksTotal) * 100) : 0;

  return (
    <section className="security-scanner" dir="rtl" lang="he">
      <header className="security-scanner__hero">
        <p className="security-scanner__kicker">Bizuply Security Scanner</p>
        <h1>מרכז אבטחה</h1>
        <p>סריקה של אתר שבבעלותכם או שיש לכם הרשאה מתועדת לבדוק. הסריקה אינה מאשרת שהאתר מאובטח לחלוטין.</p>
      </header>
      <nav className="security-scanner__tabs" aria-label="מסכי הסורק">
        {VIEWS.map((item) => (
          <button key={item} className={view === item ? "is-active" : ""} type="button" onClick={() => { setView(item); if (item === "ממצאים") refreshFindings().catch((reason) => setError(message(reason))); }}>
            {item}
          </button>
        ))}
      </nav>
      {error ? <p className="security-scanner__error">{error}</p> : null}
      {notice ? <p>{notice}</p> : null}

      {view === "מרכז" ? (
        <div className="security-scanner__grid">
          <article className="security-scanner__card"><h2>אתרים</h2><p>{sites.length}</p></article>
          <article className="security-scanner__card"><h2>סריקות</h2><p>{scans.length}</p></article>
          <article className="security-scanner__card"><h2>התראות פתוחות</h2><p>{alerts.length}</p></article>
          <article className="security-scanner__card"><h2>בקשות שנמדדו</h2><p>{usage?.requests || 0}</p><p className="security-scanner__muted">הערכת חישוב {usage?.estimatedComputeNis || 0} ש״ח. עלות AI חיצונית {usage?.externalAiNis || 0}.</p></article>
        </div>
      ) : null}

      {view === "אתר" ? (
        <div className="security-scanner__list">
          <form className="security-scanner__card" onSubmit={addSite}>
            <h2>הוספת אתר ואימות בעלות</h2>
            <label>דומיין<input value={domain} onChange={(event) => setDomain(event.target.value)} placeholder="example.com" required /></label>
            <label><span><input type="checkbox" checked={attested} onChange={(event) => setAttested(event.target.checked)} required /> אני הבעלים של הדומיין או שיש לי הרשאה מפורשת ומתועדת לבדוק אותו.</span></label>
            <button className="security-scanner__primary" type="submit">שמירת אתר</button>
          </form>
          {sites.map((site) => (
            <article className="security-scanner__card" key={site.id}>
              <div className="security-scanner__row">
                <strong>{site.domain}</strong>
                <span className="security-scanner__badge">{site.ownership.status === "verified" ? "בעלות אומתה" : "ממתין לאימות"}</span>
              </div>
              <p className="security-scanner__muted">הוסיפו רשומת TXT בשם _bizuply-security או קובץ בכתובת /.well-known/bizuply-security.txt</p>
              <code>{site.ownership.token}</code>
              <label>חבילה לסריקה אקטיבית
                <select value={planId} onChange={(event) => setPlanId(event.target.value)}>
                  <option value="basic">בסיסי</option>
                  <option value="professional">מקצועי</option>
                  <option value="monitoring">ניטור</option>
                </select>
              </label>
              <form className="security-scanner__list" onSubmit={async (event) => {
                event.preventDefault();
                setError("");
                try {
                  await API.post(`/security-scanner/sites/${site.id}/authorization`, { ownerName, ownerEmail, statement, evidenceNote });
                  setNotice("התיעוד נשמר וממתין לאישור אדמין. הסריקה האקטיבית עדיין חסומה.");
                  await load();
                } catch (reason) {
                  setError(message(reason));
                }
              }}>
                <h3>הרשאה מבעל נכס שאינו שלכם</h3>
                <label>שם בעל הנכס<input value={ownerName} onChange={(event) => setOwnerName(event.target.value)} /></label>
                <label>דוא״ל<input type="email" value={ownerEmail} onChange={(event) => setOwnerEmail(event.target.value)} /></label>
                <label>היקף ההרשאה<textarea value={statement} onChange={(event) => setStatement(event.target.value)} placeholder="בעל הנכס אישר בדיקה מוגבלת לדומיין הזה, בלי ניחוש סיסמאות ובלי שינוי נתונים." /></label>
                <label>אסמכתה<textarea value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} placeholder="מספר פנייה, תאריך ומי אישר" /></label>
                <button type="submit">שמירת תיעוד לאישור</button>
              </form>
              <div className="security-scanner__actions">
                <button type="button" onClick={() => verify(site, "dns")}>אימות DNS</button>
                <button type="button" onClick={() => verify(site, "file")}>אימות קובץ</button>
                <button type="button" onClick={() => scan(site, "passive")}>סריקה פסיבית</button>
                <button className="security-scanner__primary" type="button" onClick={() => scan(site, "active")}>סריקה אקטיבית</button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {view === "סריקות" ? (
        <div className="security-scanner__list">
          {scans.map((scan) => {
            const ratio = scan.progress?.checksTotal ? Math.round((scan.progress.checksDone / scan.progress.checksTotal) * 100) : 0;
            return (
              <article className="security-scanner__card" key={scan.id}>
                <div className="security-scanner__row">
                  <strong>{scan.domain}</strong>
                  <span>{PHASES[scan.progress?.phase] || scan.status}</span>
                </div>
                <div className="security-scanner__meter" aria-valuenow={ratio} aria-valuemin={0} aria-valuemax={100}><span style={{ width: `${ratio}%` }} /></div>
                <p className="security-scanner__muted">{scan.progress?.checksDone || 0} מתוך {scan.progress?.checksTotal || 0} בדיקות · {scan.progress?.pagesDone || 0} עמודים</p>
                <div className="security-scanner__actions">
                  <button type="button" onClick={() => openReport(scan.id)}>דוח</button>
                  {["queued", "running", "stopping"].includes(scan.status) ? <button className="security-scanner__danger" type="button" onClick={() => stop(scan.id)}>עצירה</button> : null}
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {view === "ממצאים" ? (
        <div className="security-scanner__list">
          <div className="security-scanner__filters">
            {["", "critical", "high", "medium", "low", "info"].map((level) => (
              <button key={level || "all"} className={severity === level ? "is-active" : ""} type="button" onClick={() => { setSeverity(level); refreshFindings(level).catch((reason) => setError(message(reason))); }}>
                {level || "הכול"}
              </button>
            ))}
          </div>
          {findings.map((finding) => (
            <article className="security-scanner__card" key={`${finding.scanId}-${finding.id}`}>
              <div className="security-scanner__row">
                <strong>{finding.title}</strong>
                <span className={`security-scanner__badge is-${finding.severity}`}>{finding.confidence === "verified" ? "מאומת" : finding.confidence === "suspicion" ? "חשד" : "מידע"} · {finding.severity}</span>
              </div>
              <p>{finding.businessImpact}</p>
            </article>
          ))}
        </div>
      ) : null}

      {view === "דוח" && selected?.report ? (
        <article className="security-scanner__card">
          <h2>ציון {selected.report.score.value}</h2>
          <div className="security-scanner__meter" aria-label="התקדמות הסריקה"><span style={{ width: `${percent}%` }} /></div>
          <p>{selected.report.businessSummary}</p>
          <ul>{selected.report.score.methodology.map((line) => <li key={line}>{line}</li>)}</ul>
          {selected.report.findings.map((finding) => (
            <div key={finding.id}>
              <h3>{finding.title}</h3>
              <p>{finding.summary}</p>
              <p>המלצה: {finding.recommendation}</p>
              {finding.evidence ? <code>{finding.evidence}</code> : null}
            </div>
          ))}
          <p className="security-scanner__muted">{selected.report.disclaimer}</p>
          <div className="security-scanner__actions">
            <button type="button" onClick={() => download(selected.id)}>הורדת PDF</button>
          </div>
          <form onSubmit={sendReport}>
            <label>שליחה לדוא״ל<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></label>
            <button type="submit">שליחת הדוח</button>
          </form>
        </article>
      ) : null}

      {view === "השוואה" ? (
        <form className="security-scanner__card" onSubmit={compare}>
          <h2>השוואה בין סריקות</h2>
          <label>סריקה נוכחית
            <select value={selected?.id || ""} onChange={(event) => setSelected(scans.find((scan) => scan.id === event.target.value) || null)}>
              <option value="">בחרו סריקה</option>
              {scans.filter((scan) => scan.status === "completed").map((scan) => <option key={scan.id} value={scan.id}>{scan.domain}</option>)}
            </select>
          </label>
          <label>סריקה קודמת<input value={compareWith} onChange={(event) => setCompareWith(event.target.value)} placeholder="מזהה סריקה" required /></label>
          <button type="submit">השוואה</button>
          {comparison ? <p>{comparison.added.length} חדשים, {comparison.resolved.length} שירדו, {comparison.remaining.length} שנשארו.</p> : null}
        </form>
      ) : null}

      {view === "התראות" ? (
        <div className="security-scanner__list">
          {alerts.length === 0 ? <p>אין התראות פתוחות.</p> : null}
          {alerts.map((alert) => <article className="security-scanner__card" key={alert.id}><h2>{alert.title}</h2><p>{alert.body}</p></article>)}
        </div>
      ) : null}

      {view === "חבילות" ? (
        <div className="security-scanner__grid">
          {plans.filter((plan) => plan.sellable).map((plan) => (
            <article className="security-scanner__card" key={plan.id}>
              <h2>{plan.name}</h2>
              <p>{plan.priceIls} ש״ח ל{plan.unit}</p>
              <p className="security-scanner__muted">ההזמנה נשמרת בלי חיוב. הפעלה מסחרית דורשת אישור נפרד.</p>
              <button type="button" onClick={() => order(plan.id)}>רישום הזמנה</button>
            </article>
          ))}
          <article className="security-scanner__card">
            <h2>שימוש</h2>
            <p>סטטוס יתרה: {usage?.entitlement?.status}</p>
            <p className="security-scanner__muted">חיוב פעיל: {usage?.billingActivated ? "כן" : "לא"}</p>
          </article>
        </div>
      ) : null}
    </section>
  );
}
