import { FormEvent, useEffect, useState } from "react";

type Alert = { level: "warning" | "severe" | "stopped"; message: string };

type Usage = {
  day: string;
  spentUsd: number;
  capUsd: number;
  remainingUsd: number;
  percent: number;
  scansToday: number;
  liveCalls: number;
  cacheHits: number;
  averageUsd: number | null;
  reservedUsd: number;
  level: "ok" | "warning" | "severe" | "stopped";
  resetAt: string;
  measured: boolean;
  alerts: Alert[];
};

type HistoryRow = { day: string; spentUsd: number; liveCalls: number; cacheHits: number };

type Row = {
  id: string;
  requesterName: string | null;
  requesterEmail: string | null;
  createdAt: string;
  url: string;
  host: string;
  status: string;
  score: number | null;
  coverage: number | null;
  ok: number | null;
  action: number | null;
  missing: number | null;
  unverified: number | null;
  purchaseStatus: string;
  plan?: string;
  consentStatus?: string | null;
  consentAt?: string | null;
  consentId?: string | null;
};

const STATUS: Record<string, string> = {
  queued: "בתור",
  running: "רצה",
  completed: "הושלמה",
  failed: "נכשלה",
};

function stamp(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short" }).format(date);
}

function count(value: number | null) {
  return value == null ? "—" : String(value);
}

function money(value: number) {
  return `$${value.toFixed(value >= 1 ? 2 : 4)}`;
}

function resetLabel(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return `${new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "UTC" }).format(date)} UTC`;
}

export default function ComplianceScansAdminPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [subscriptions, setSubscriptions] = useState<Array<Record<string, unknown>>>([]);
  const [consent, setConsent] = useState<Record<string, string> | null>(null);
  const [history, setHistory] = useState<HistoryRow[]>([]);
  const pageSize = 25;

  async function load(nextPage = page, event?: FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError("");
    const token = localStorage.getItem("token") || "";
    const params = new URLSearchParams({ page: String(nextPage), pageSize: String(pageSize) });
    if (q.trim()) params.set("q", q.trim());
    if (status) params.set("status", status);
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    try {
      const response = await fetch(`/compliance/api/admin/scans?${params.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setRows([]);
        setTotal(0);
        setError(data.error || "אין הרשאה לצפייה בסריקות");
        return;
      }
      setRows(data.rows || []);
      setTotal(Number(data.total) || 0);
      setPage(Number(data.page) || nextPage);
    } catch {
      setError("לא ניתן לטעון את הסריקות");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsage() {
    const token = localStorage.getItem("token") || "";
    try {
      const response = await fetch("/compliance/api/admin/ai-usage", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setUsage(null);
        setHistory([]);
        return;
      }
      setUsage(data.today || null);
      setHistory(data.history || []);
    } catch {
      setUsage(null);
    }
  }

  useEffect(() => {
    load(1);
    loadUsage();
    const token = localStorage.getItem("token") || "";
    fetch("/compliance/api/admin/subscriptions", { headers: token ? { Authorization: `Bearer ${token}` } : {} })
      .then((response) => response.ok ? response.json() : { rows: [] })
      .then((data) => setSubscriptions(data.rows || []))
      .catch(() => setSubscriptions([]));
    // The first view uses the current filters. Later searches submit the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function downloadPdf(id: string) {
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/compliance/api/scans/${id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      setError("ה־PDF לא נפתח");
      return;
    }
    const blob = await response.blob();
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `bizuply-website-report-${id.slice(0, 8)}.pdf`;
    link.click();
  }

  async function openConsent(id: string | null | undefined) {
    if (!id) return;
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/compliance/api/admin/consents/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) { setError(data.error || "ההצהרה לא נפתחה"); return; }
    setConsent(data);
  }

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="compliance-admin" dir="rtl">
      <header className="compliance-admin__head">
        <h1>סריקות ודוחות</h1>
        <p>הצפייה כאן שמורה לבעלת המערכת ולמנהלים עם הרשאת compliance.reports. פתיחת דוח אינה רושמת רכישה.</p>
      </header>
      {usage ? (
        <section className="compliance-admin__usage" aria-label="צריכת AI היום">
          <div>
            <h2>צריכת AI היום</h2>
            <p>הסכום הוא עלות מדודה לפי טוקנים ומחיר המודל. הוא אינו חיוב ללקוח.</p>
          </div>
          {usage.alerts.map((alert) => (
            <p key={alert.level} className={`compliance-admin__alert compliance-admin__alert--${alert.level}`} role="status">
              {alert.message}
            </p>
          ))}
          <div className="compliance-admin__bar" aria-hidden="true">
            <span style={{ width: `${Math.min(100, usage.percent)}%` }} />
          </div>
          <div className="compliance-admin__stats">
            <p><span>עלות היום</span><b>{money(usage.spentUsd)}</b></p>
            <p><span>תקציב יומי</span><b>{money(usage.capUsd)}</b></p>
            <p><span>סריקות היום</span><b>{usage.scansToday}</b></p>
            <p><span>ממוצע לסריקה עם AI</span><b>{usage.averageUsd == null ? "—" : money(usage.averageUsd)}</b></p>
            <p><span>קריאות חיות</span><b>{usage.liveCalls}</b></p>
            <p><span>מטמון, בלי חיוב</span><b>{usage.cacheHits}</b></p>
            <p><span>איפוס הבא</span><b>{resetLabel(usage.resetAt)}</b></p>
          </div>
          {usage.reservedUsd > usage.spentUsd ? <p>יש שמירת תקציב לסריקות שרצות כרגע. השמירה אינה חיוב.</p> : null}
          {history.length ? (
            <div className="compliance-admin__table compliance-admin__history">
              <table>
                <thead>
                  <tr>
                    <th>יום UTC</th>
                    <th>עלות מדודה</th>
                    <th>קריאות חיות</th>
                    <th>מטמון</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((row) => (
                    <tr key={row.day}>
                      <td>{row.day}</td>
                      <td>{money(row.spentUsd)}</td>
                      <td>{row.liveCalls}</td>
                      <td>{row.cacheHits}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>
      ) : null}
      <form className="compliance-admin__filters" onSubmit={(event) => load(1, event)}>
        <label>
          <span>שם או דומיין</span>
          <input value={q} onChange={(event) => setQ(event.target.value)} />
        </label>
        <label>
          <span>מתאריך</span>
          <input type="date" value={from} onChange={(event) => setFrom(event.target.value)} />
        </label>
        <label>
          <span>עד תאריך</span>
          <input type="date" value={to} onChange={(event) => setTo(event.target.value)} />
        </label>
        <label>
          <span>סטטוס</span>
          <select value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="">הכל</option>
            <option value="completed">הושלמה</option>
            <option value="running">רצה</option>
            <option value="queued">בתור</option>
            <option value="failed">נכשלה</option>
          </select>
        </label>
        <button type="submit">חיפוש</button>
      </form>
      {error ? <p className="compliance-admin__error">{error}</p> : null}
      <p className="compliance-admin__meta">{loading ? "טוען…" : `${total} סריקות`}</p>
      <div className="compliance-admin__table">
        <table>
          <thead>
            <tr>
              <th>שם</th>
              <th>אימייל</th>
              <th>תאריך</th>
              <th>אתר</th>
              <th>סטטוס</th>
              <th>ציון</th>
              <th>היקף</th>
              <th>תקינות</th>
              <th>טיפול</th>
              <th>חסרות</th>
              <th>לא אומתו</th>
              <th>מסלול</th>
              <th>רכישה</th>
              <th>הצהרה וחתימה</th>
              <th>דוחות</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.requesterName || "לא נשמר"}</td>
                <td>{row.requesterEmail || "—"}</td>
                <td>{stamp(row.createdAt)}</td>
                <td><a href={row.url}>{row.host || row.url}</a></td>
                <td>{STATUS[row.status] || row.status}</td>
                <td>{count(row.score)}</td>
                <td>{row.coverage == null ? "—" : `${row.coverage}%`}</td>
                <td>{count(row.ok)}</td>
                <td>{count(row.action)}</td>
                <td>{count(row.missing)}</td>
                <td>{count(row.unverified)}</td>
                <td>{row.plan === "quarterly" ? "רבעוני" : row.plan === "annual" || row.plan === "monitor" || row.plan === "monthly" ? "חודשי" : row.plan === "report" ? "חד־פעמי" : "חינם"}</td>
                <td>{row.purchaseStatus === "verified" ? "רכישה מאומתת" : "לא נרכש"}</td>
                <td>
                  {row.consentStatus === "signed" ? (
                    <>
                      <b>נחתם</b>
                      <div>{stamp(row.consentAt)}</div>
                      <button type="button" onClick={() => openConsent(row.consentId)}>צפייה בהצהרה</button>
                    </>
                  ) : (
                    <span>סריקה קודמת — לא קיים אישור חתום במערכת</span>
                  )}
                </td>
                <td className="compliance-admin__actions">
                  <a href={`/he/compliance/report/${row.id}?view=summary`}>דוח ראשוני</a>
                  <a href={`/he/compliance/report/${row.id}`}>דוח מפורט</a>
                  <button type="button" onClick={() => downloadPdf(row.id)}>PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h2>מנויים</h2>
      <div className="compliance-admin__table">
        <table>
          <thead>
            <tr>
              <th>מזהה</th><th>דומיין</th><th>מסלול</th><th>הושלמו</th><th>נותרו</th><th>יום</th><th>הבאה</th><th>מצב</th><th>סיום</th><th>חידוש</th>
            </tr>
          </thead>
          <tbody>
            {subscriptions.map((row) => (
              <tr key={`${row.host}-${row.plan}`}>
                <td>{String(row.userId || "—")}</td>
                <td>{String(row.host || "—")}</td>
                <td>{row.plan === "quarterly" ? "רבעוני" : "חודשי"}</td>
                <td>{String(row.completed ?? "—")}</td>
                <td>{String(row.remaining ?? "—")}</td>
                <td>{String(row.scanDay ?? "—")}</td>
                <td>{String(row.nextAt || "—").slice(0, 10)}</td>
                <td>{String(row.nextState || "—")}</td>
                <td>{String(row.periodEnd || "—").slice(0, 10)}</td>
                <td>{row.renew ? "פעיל" : "כבוי"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="compliance-admin__pager">
        <button type="button" disabled={page <= 1} onClick={() => load(page - 1)}>הקודם</button>
        <span>{page} / {pages}</span>
        <button type="button" disabled={page >= pages} onClick={() => load(page + 1)}>הבא</button>
      </div>
      {consent && (
        <div className="compliance-admin__dialog" role="dialog" aria-modal="true">
          <article>
            <h2>פרטי החותם</h2>
            <p>{consent.fullName}</p>
            <p>{consent.email}</p>
            <p>{consent.phone}</p>
            <p>{consent.site}</p>
            <h2>פרטי ההסכמה</h2>
            <p>{stamp(consent.signedAt)}</p>
            <p>{consent.statementText}</p>
            <p>{consent.termsVersion} · {consent.privacyVersion} · {consent.scannerVersion}</p>
            <p>{consent.locale}</p>
            <p>{consent.id}</p>
            <h2>חתימה</h2>
            {consent.signature ? <img src={consent.signature} alt="" /> : null}
            <button type="button" onClick={() => setConsent(null)}>סגירה</button>
          </article>
        </div>
      )}
      <style>{`
        .compliance-admin { display: grid; gap: 16px; color: #1d2433; }
        .compliance-admin__head h1 { margin: 0; font-size: 1.5rem; }
        .compliance-admin__head p, .compliance-admin__meta { margin: 0; color: #5c6578; }
        .compliance-admin__filters { display: grid; grid-template-columns: 1.4fr repeat(3, minmax(0, 1fr)) auto; gap: 10px; align-items: end; }
        .compliance-admin label { display: grid; gap: 4px; font-size: 0.82rem; font-weight: 700; }
        .compliance-admin input, .compliance-admin select, .compliance-admin button, .compliance-admin a {
          border: 1px solid #d7dce8; border-radius: 0; background: #fff; color: #1d2433; min-height: 40px;
        }
        .compliance-admin button { background: #5b4bdb; color: #fff; padding: 0 14px; cursor: pointer; }
        .compliance-admin button:disabled { opacity: 0.45; }
        .compliance-admin__error { color: #9b2335; margin: 0; }
        .compliance-admin__dialog { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.72); display: grid; place-items: center; z-index: 80; padding: 1rem; }
        .compliance-admin__dialog article { background: #fff; color: #1a0b33; max-width: 640px; width: 100%; padding: 1rem; display: grid; gap: 0.4rem; max-height: 86vh; overflow: auto; }
        .compliance-admin__dialog img { width: min(100%, 320px); background: #fff; border: 1px solid #e5e7eb; }
        .compliance-admin__table { overflow-x: auto; max-width: 100%; }
        .compliance-admin table { width: 100%; border-collapse: collapse; min-width: 980px; background: #fff; }
        .compliance-admin th, .compliance-admin td { border-bottom: 1px solid #e6eaf2; padding: 8px; text-align: right; vertical-align: top; font-size: 0.86rem; }
        .compliance-admin__actions { display: flex; flex-wrap: wrap; gap: 6px; }
        .compliance-admin__actions a, .compliance-admin__actions button { padding: 6px 8px; text-decoration: none; font-size: 0.8rem; }
        .compliance-admin__pager { display: flex; gap: 12px; align-items: center; }
        .compliance-admin__usage { display: grid; gap: 12px; border: 1px solid #d7dce8; background: #fff; padding: 16px; }
        .compliance-admin__usage h2 { margin: 0; font-size: 1.15rem; }
        .compliance-admin__usage p { margin: 0; }
        .compliance-admin__stats { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
        .compliance-admin__stats p { display: grid; gap: 4px; }
        .compliance-admin__stats span { color: #5c6578; font-size: 0.78rem; }
        .compliance-admin__bar { height: 10px; background: #eceff6; }
        .compliance-admin__bar > span { display: block; height: 100%; background: #5b4bdb; }
        .compliance-admin__history table { min-width: 0; }
        .compliance-admin__alert { padding: 12px; font-weight: 800; }
        .compliance-admin__alert--warning { background: #fff6d8; color: #6a4b00; }
        .compliance-admin__alert--severe { background: #ffe8d6; color: #8a2e00; }
        .compliance-admin__alert--stopped { background: #fde2e6; color: #8d1d32; }
        @media (max-width: 800px) {
          .compliance-admin__filters, .compliance-admin__stats { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
