import React, { useCallback, useEffect, useMemo, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import { statusLabel, TRACK_LABELS } from "./copy";
import "./globalPartners.css";

type Tab = "dashboard" | "candidates" | "add" | "import" | "scans";

function Kpi({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="gp-kpi">
      <div className="gp-kpi-label">{label}</div>
      <div className="gp-kpi-value">{value}</div>
    </div>
  );
}

const EMPTY_FORM = {
  companyName: "",
  countryCode: "",
  city: "",
  website: "",
  vertical: "",
  businessEmail: "",
  businessPhone: "",
  companySize: "",
  notes: "",
};

export default function AdminGlobalPartners() {
  const [tab, setTab] = useState<Tab>("dashboard");
  const [access, setAccess] = useState<any>(null);
  const [dashboard, setDashboard] = useState<any>(null);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [csvText, setCsvText] = useState(
    "company_name,country_code,city,website,vertical,email,phone\n"
  );
  const [scanConfigs, setScanConfigs] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [message, setMessage] = useState("");

  const denied = useMemo(() => {
    if (!error) return false;
    return /OWNER_ONLY|allowlist|403/i.test(error);
  }, [error]);

  const loadAccess = useCallback(async () => {
    const data = await gpGet("/access");
    setAccess(data);
  }, []);

  const loadDashboard = useCallback(async () => {
    const data = await gpGet("/dashboard");
    setDashboard(data.dashboard);
  }, []);

  const loadCandidates = useCallback(async () => {
    const data = await gpGet("/candidates", {
      q: q || undefined,
      status: statusFilter || undefined,
      limit: 50,
    });
    setCandidates(data.items || []);
    setTotal(data.total || 0);
  }, [q, statusFilter]);

  const loadScans = useCallback(async () => {
    const [configs, runData] = await Promise.all([
      gpGet("/scan-configs"),
      gpGet("/scans/runs", { limit: 20 }),
    ]);
    setScanConfigs(configs.items || []);
    setRuns(runData.items || []);
  }, []);

  const refresh = useCallback(async () => {
    setError("");
    setBusy(true);
    try {
      await loadAccess();
      if (tab === "dashboard") await loadDashboard();
      if (tab === "candidates" || tab === "add") await loadCandidates();
      if (tab === "scans") await loadScans();
    } catch (err: any) {
      setError(err?.message || "שגיאה בטעינת Global Partners");
    } finally {
      setBusy(false);
    }
  }, [tab, loadAccess, loadDashboard, loadCandidates, loadScans]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function submitCandidate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const result = await gpPost("/candidates", form);
      if (result.duplicate) {
        setMessage("מועמד דומה כבר קיים — לא נוצרה כפילות.");
      } else {
        setMessage("המועמד נוסף ודורג לפי כללים קבועים.");
        setForm({ ...EMPTY_FORM });
      }
      setTab("candidates");
      await loadCandidates();
    } catch (err: any) {
      setError(err?.message || "שמירה נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function submitImport(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const result = await gpPost("/candidates/import-csv", { csv: csvText });
      const imp = result.import || {};
      setMessage(
        `ייבוא הסתיים: נמצאו ${imp.foundCount || 0}, נוצרו ${imp.createdCount || 0}, כפילויות ${imp.duplicateCount || 0}, שגיאות ${imp.errorCount || 0}.`
      );
      setTab("candidates");
      await loadCandidates();
    } catch (err: any) {
      setError(err?.message || "ייבוא נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function openCandidate(id: string) {
    setBusy(true);
    setError("");
    try {
      const data = await gpGet(`/candidates/${id}`);
      setSelected(data.candidate);
    } catch (err: any) {
      setError(err?.message || "טעינת מועמד נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(id: string, recruitmentStatus: string) {
    setBusy(true);
    try {
      const data = await gpPatch(`/candidates/${id}`, { recruitmentStatus });
      setSelected(data.candidate);
      await loadCandidates();
    } catch (err: any) {
      setError(err?.message || "עדכון סטטוס נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function rescore(id: string) {
    setBusy(true);
    try {
      const data = await gpPost(`/candidates/${id}/rescore`);
      setSelected(data.candidate);
      await loadCandidates();
      setMessage("הציון חושב מחדש לפי מנוע הכללים (ללא AI).");
    } catch (err: any) {
      setError(err?.message || "חישוב מחדש נכשל");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="gp-shell" dir="rtl" lang="he">
      <header className="gp-header">
        <div>
          <div className="gp-brand">Bizuply Global Partners</div>
          <p className="gp-sub">
            מערכת פנימית לאיתור, גיוס וניהול שותפים עולמיים — ללא AI, עם דירוג מבוסס
            כללים ומקורות מורשים בלבד.
          </p>
        </div>
        <div className="gp-pills">
          <span className="gp-pill gp-pill--ok">ללא AI</span>
          <span className="gp-pill">Owner only</span>
          {access?.places?.enabled ? (
            <span className="gp-pill gp-pill--ok">Places פעיל</span>
          ) : (
            <span className="gp-pill gp-pill--warn">Places כבוי עד אישור</span>
          )}
          {busy ? <span className="gp-pill">טוען…</span> : null}
        </div>
      </header>

      {error ? <div className="gp-error">{error}</div> : null}
      {message ? <div className="gp-banner">{message}</div> : null}
      {denied ? (
        <div className="gp-banner">
          הגישה מוגבלת לבעלי Bizuply ברשימת ההרשאות. הגדירו
          GLOBAL_PARTNERS_OWNER_EMAIL_ALLOWLIST בסביבת השרת.
        </div>
      ) : null}

      <nav className="gp-tabs" aria-label="ניווט Global Partners">
        {(
          [
            ["dashboard", "דשבורד"],
            ["candidates", "מועמדים"],
            ["add", "הוספה ידנית"],
            ["import", "ייבוא CSV"],
            ["scans", "סריקות"],
          ] as Array<[Tab, string]>
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`gp-tab${tab === id ? " is-active" : ""}`}
            onClick={() => {
              setSelected(null);
              setTab(id);
            }}
          >
            {label}
          </button>
        ))}
        <button type="button" className="gp-tab" onClick={() => void refresh()}>
          רענון
        </button>
      </nav>

      {tab === "dashboard" && dashboard ? (
        <>
          <div className="gp-grid">
            <Kpi label="מועמדים במאגר" value={dashboard.candidatesTotal ?? 0} />
            <Kpi label="חדשים היום" value={dashboard.candidatesToday ?? 0} />
            <Kpi label="סריקות פעילות" value={dashboard.activeScans ?? 0} />
            <Kpi label="שותפים פעילים" value={dashboard.activePartners ?? 0} />
            <Kpi label="מדינות במעקב" value={dashboard.countriesTracked ?? 0} />
            <Kpi label="פניות בתהליך" value={dashboard.outreachInPipeline ?? 0} />
            <Kpi label="שגיאות סריקה היום" value={dashboard.scanErrorsToday ?? 0} />
            <Kpi
              label="עלות API היום (¢)"
              value={dashboard.apiCostCentsToday ?? 0}
            />
          </div>

          <div className="gp-panel">
            <h2>לפי סטטוס גיוס</h2>
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>סטטוס</th>
                    <th>כמות</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(dashboard.byStatus || {}).map(([key, count]) => (
                    <tr key={key}>
                      <td>{statusLabel(key)}</td>
                      <td>{String(count)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="gp-muted" style={{ marginTop: 12 }}>
              {dashboard.note}
            </p>
          </div>
        </>
      ) : null}

      {tab === "candidates" ? (
        <div className="gp-panel">
          <h2>מאגר מועמדים ({total})</h2>
          <div className="gp-form" style={{ marginBottom: 12 }}>
            <label>
              חיפוש מהיר
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="שם / עיר / תחום" />
            </label>
            <label>
              סטטוס
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">הכל</option>
                {Object.entries(
                  (access?.statuses || []).reduce((acc: any, s: string) => {
                    acc[s] = statusLabel(s);
                    return acc;
                  }, {})
                ).map(([value, label]) => (
                  <option key={value} value={value}>
                    {String(label)}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="gp-actions">
            <button type="button" className="gp-btn" onClick={() => void loadCandidates()}>
              סנן
            </button>
          </div>
          <div className="gp-table-wrap" style={{ marginTop: 14 }}>
            <table className="gp-table">
              <thead>
                <tr>
                  <th>חברה</th>
                  <th>מדינה / עיר</th>
                  <th>תחום</th>
                  <th>ציון</th>
                  <th>סטטוס</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={6}>אין מועמדים להצגה — הוסיפו ידנית או ייבאו CSV.</td>
                  </tr>
                ) : (
                  candidates.map((c) => (
                    <tr key={c._id}>
                      <td>{c.companyName}</td>
                      <td>
                        {[c.countryCode, c.city].filter(Boolean).join(" · ") || "—"}
                      </td>
                      <td>{c.vertical || "—"}</td>
                      <td className="gp-score">{c.matchScore ?? 0}</td>
                      <td>{statusLabel(c.recruitmentStatus)}</td>
                      <td>
                        <button
                          type="button"
                          className="gp-btn gp-btn--ghost"
                          onClick={() => void openCandidate(c._id)}
                        >
                          פרופיל
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {selected ? (
        <div className="gp-panel">
          <h2>{selected.companyName}</h2>
          <p className="gp-muted">
            מקורות: {(selected.sources || []).map((s: any) => s.source).join(", ") || "—"} ·
            עדכון אחרון:{" "}
            {selected.lastVerifiedAt
              ? new Date(selected.lastVerifiedAt).toLocaleString("he-IL")
              : "—"}
          </p>
          <div className="gp-grid" style={{ marginTop: 12 }}>
            <Kpi
              label="Affiliate"
              value={selected.scores?.affiliate?.score ?? "—"}
            />
            <Kpi
              label="Business Partner"
              value={selected.scores?.business_partner?.score ?? "—"}
            />
            <Kpi
              label="בלעדיות"
              value={selected.scores?.exclusive_territory?.score ?? "—"}
            />
            <Kpi label="אתר" value={selected.website || "—"} />
          </div>
          <div className="gp-actions">
            <select
              value={selected.recruitmentStatus}
              onChange={(e) => void updateStatus(selected._id, e.target.value)}
            >
              {(access?.statuses || []).map((s: string) => (
                <option key={s} value={s}>
                  {statusLabel(s)}
                </option>
              ))}
            </select>
            <button type="button" className="gp-btn" onClick={() => void rescore(selected._id)}>
              חשב ציון מחדש
            </button>
            <button type="button" className="gp-btn gp-btn--ghost" onClick={() => setSelected(null)}>
              סגור
            </button>
          </div>
          <div className="gp-table-wrap" style={{ marginTop: 14 }}>
            <table className="gp-table">
              <thead>
                <tr>
                  <th>מסלול</th>
                  <th>כלל</th>
                  <th>נקודות</th>
                  <th>פירוט</th>
                </tr>
              </thead>
              <tbody>
                {["affiliate", "business_partner", "exclusive_territory"].flatMap((track) =>
                  (selected.scores?.[track]?.appliedRules || []).map((rule: any, idx: number) => (
                    <tr key={`${track}-${idx}`}>
                      <td>{TRACK_LABELS[track] || track}</td>
                      <td>{rule.rule}</td>
                      <td>{rule.points}</td>
                      <td>{typeof rule.detail === "string" ? rule.detail : JSON.stringify(rule.detail)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {tab === "add" ? (
        <div className="gp-panel">
          <h2>הוספת מועמד ידנית</h2>
          <form className="gp-form" onSubmit={submitCandidate}>
            <label>
              שם החברה *
              <input
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              />
            </label>
            <label>
              קוד מדינה
              <input
                value={form.countryCode}
                onChange={(e) => setForm({ ...form, countryCode: e.target.value })}
                placeholder="IL"
              />
            </label>
            <label>
              עיר
              <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </label>
            <label>
              אתר
              <input
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
              />
            </label>
            <label>
              תחום
              <input
                value={form.vertical}
                onChange={(e) => setForm({ ...form, vertical: e.target.value })}
                placeholder="digital_agency"
              />
            </label>
            <label>
              גודל חברה
              <input
                value={form.companySize}
                onChange={(e) => setForm({ ...form, companySize: e.target.value })}
                placeholder="11-50"
              />
            </label>
            <label>
              אימייל עסקי
              <input
                value={form.businessEmail}
                onChange={(e) => setForm({ ...form, businessEmail: e.target.value })}
              />
            </label>
            <label>
              טלפון עסקי
              <input
                value={form.businessPhone}
                onChange={(e) => setForm({ ...form, businessPhone: e.target.value })}
              />
            </label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="הערות"
            />
            <div className="gp-actions" style={{ gridColumn: "1 / -1" }}>
              <button type="submit" className="gp-btn" disabled={busy}>
                שמור ודרג
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {tab === "import" ? (
        <div className="gp-panel">
          <h2>ייבוא CSV</h2>
          <p className="gp-muted">
            כותרות נתמכות: company_name, country_code, city, website, vertical, email, phone.
            שדות חסרים לא מומצאים.
          </p>
          <form onSubmit={submitImport}>
            <textarea
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              style={{ width: "100%", minHeight: 220, marginTop: 12 }}
            />
            <div className="gp-actions">
              <button type="submit" className="gp-btn" disabled={busy}>
                ייבא
              </button>
            </div>
          </form>
        </div>
      ) : null}

      {tab === "scans" ? (
        <>
          <div className="gp-panel">
            <h2>הגדרות סריקה</h2>
            <p className="gp-muted">
              סריקות אוטומטיות חיצוניות (Places) יישארו כבויות עד אישור מפורש להפעלת
              שירות בתשלום. ניתן להגדיר יעדים כבר עכשיו.
            </p>
            {scanConfigs.length === 0 ? (
              <p className="gp-muted">אין קונפיגורציות עדיין.</p>
            ) : (
              <div className="gp-table-wrap">
                <table className="gp-table">
                  <thead>
                    <tr>
                      <th>שם</th>
                      <th>מקור</th>
                      <th>פעיל</th>
                      <th>מדינות</th>
                      <th>תדירות (דק׳)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scanConfigs.map((c) => (
                      <tr key={c._id}>
                        <td>{c.name}</td>
                        <td>{c.source}</td>
                        <td>{c.enabled ? "כן" : "לא"}</td>
                        <td>{(c.countries || []).join(", ") || "—"}</td>
                        <td>{c.intervalMinutes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="gp-panel">
            <h2>היסטוריית ריצות</h2>
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>תאריך</th>
                    <th>מקור</th>
                    <th>סטטוס</th>
                    <th>נוצרו</th>
                    <th>כפילויות</th>
                    <th>שגיאות</th>
                    <th>עלות ¢</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.length === 0 ? (
                    <tr>
                      <td colSpan={7}>אין ריצות עדיין.</td>
                    </tr>
                  ) : (
                    runs.map((r) => (
                      <tr key={r._id}>
                        <td>{new Date(r.createdAt).toLocaleString("he-IL")}</td>
                        <td>{r.source}</td>
                        <td>{r.status}</td>
                        <td>{r.createdCount}</td>
                        <td>{r.duplicateCount}</td>
                        <td>{r.errorCount}</td>
                        <td>{r.estimatedCostCents || 0}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
