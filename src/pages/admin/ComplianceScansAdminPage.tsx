import { FormEvent, useEffect, useState } from "react";

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

  useEffect(() => {
    load(1);
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

  const pages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <section className="compliance-admin" dir="rtl">
      <header className="compliance-admin__head">
        <h1>סריקות ודוחות</h1>
        <p>הצפייה כאן שמורה לבעלת המערכת ולמנהלים עם הרשאת compliance.reports. פתיחת דוח אינה רושמת רכישה.</p>
      </header>
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
              <th>רכישה</th>
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
                <td>{row.purchaseStatus === "verified" ? "רכישה מאומתת" : "לא נרכש"}</td>
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
      <div className="compliance-admin__pager">
        <button type="button" disabled={page <= 1} onClick={() => load(page - 1)}>הקודם</button>
        <span>{page} / {pages}</span>
        <button type="button" disabled={page >= pages} onClick={() => load(page + 1)}>הבא</button>
      </div>
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
        .compliance-admin__table { overflow-x: auto; max-width: 100%; }
        .compliance-admin table { width: 100%; border-collapse: collapse; min-width: 980px; background: #fff; }
        .compliance-admin th, .compliance-admin td { border-bottom: 1px solid #e6eaf2; padding: 8px; text-align: right; vertical-align: top; font-size: 0.86rem; }
        .compliance-admin__actions { display: flex; flex-wrap: wrap; gap: 6px; }
        .compliance-admin__actions a, .compliance-admin__actions button { padding: 6px 8px; text-decoration: none; font-size: 0.8rem; }
        .compliance-admin__pager { display: flex; gap: 12px; align-items: center; }
        @media (max-width: 800px) {
          .compliance-admin__filters { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  );
}
