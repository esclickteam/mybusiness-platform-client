import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import { statusLabel, TRACK_LABELS } from "./copy";
import { useGlobalPartnersRealtime } from "./useGlobalPartnersRealtime";
import OutreachCenter from "./OutreachCenter";
import "./globalPartners.css";

type Tab = "dashboard" | "candidates" | "outreach" | "add" | "import" | "scans";

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
  const [contactFilter, setContactFilter] = useState("");
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [csvText, setCsvText] = useState(
    "company_name,country_code,city,website,vertical,email,phone\n"
  );
  const [scanConfigs, setScanConfigs] = useState<any[]>([]);
  const [runs, setRuns] = useState<any[]>([]);
  const [sources, setSources] = useState<any[]>([]);
  const [worker, setWorker] = useState<any>(null);
  const [liveEvents, setLiveEvents] = useState<string[]>([]);
  const [scanForm, setScanForm] = useState({
    name: "סריקת שותפים פוטנציאליים",
    source: "wikidata",
    countries: "IL",
    cities: "",
    verticals: "marketing,digital_agency,it_consulting,consulting,saas",
    intervalMinutes: "1440",
    maxResultsPerRun: "15",
    dailyRequestBudget: "20",
    enabled: true,
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [message, setMessage] = useState("");

  const pushLive = useCallback((text: string) => {
    setLiveEvents((prev) => [`${new Date().toLocaleTimeString("he-IL")} · ${text}`, ...prev].slice(0, 12));
  }, []);

  const denied = useMemo(() => {
    if (!error) return false;
    return /OWNER_ONLY|allowlist|403/i.test(error);
  }, [error]);

  const loadAccess = useCallback(async () => {
    const data = await gpGet("/access");
    setAccess(data);
    if (data.sources) setSources(data.sources);
    if (data.worker) setWorker(data.worker);
  }, []);

  const loadDashboard = useCallback(async () => {
    const data = await gpGet("/dashboard");
    setDashboard(data.dashboard);
    if (data.dashboard?.worker) setWorker(data.dashboard.worker);
  }, []);

  const loadCandidates = useCallback(async () => {
    const contactParams: Record<string, string> = {};
    if (contactFilter === "email") contactParams.hasEmail = "1";
    if (contactFilter === "phone") contactParams.hasPhone = "1";
    if (contactFilter === "form") contactParams.hasForm = "1";
    if (contactFilter === "verified") contactParams.verifiedContact = "1";
    if (contactFilter === "ready") contactParams.outreachReady = "1";
    if (contactFilter === "none") contactParams.noContact = "1";
    const data = await gpGet("/candidates", {
      q: q || undefined,
      status: statusFilter || undefined,
      limit: 50,
      ...contactParams,
    });
    setCandidates(data.items || []);
    setTotal(data.total || 0);
  }, [q, statusFilter, contactFilter]);

  const loadScans = useCallback(async () => {
    const [configs, runData, workerData] = await Promise.all([
      gpGet("/scan-configs"),
      gpGet("/scans/runs", { limit: 20 }),
      gpGet("/worker-status"),
    ]);
    setScanConfigs(configs.items || []);
    setRuns(runData.items || []);
    setSources(configs.sources || []);
    setWorker(workerData.worker || configs.worker || null);
  }, []);

  const reloadRef = useRef({ loadScans, loadDashboard, loadCandidates });
  reloadRef.current = { loadScans, loadDashboard, loadCandidates };

  useGlobalPartnersRealtime({
    onQueued: (d) => {
      pushLive(`סריקה בתור (${d?.configId || "?"})`);
      void reloadRef.current.loadScans();
    },
    onStarted: (d) => {
      pushLive(`סריקה התחילה · ${d?.name || d?.source || ""}`);
      void reloadRef.current.loadScans();
    },
    onProgress: (d) => {
      pushLive(
        `התקדמות · נמצאו ${d?.foundCount ?? 0} · נוצרו ${d?.createdCount ?? 0} · עודכנו ${d?.updatedCount ?? 0}`
      );
    },
    onFinished: (d) => {
      pushLive(`סריקה הסתיימה · ${d?.status || ""} · עלות ¢${d?.estimatedCostCents ?? 0}`);
      void reloadRef.current.loadScans();
      void reloadRef.current.loadDashboard();
      void reloadRef.current.loadCandidates();
    },
    onError: (d) => pushLive(`שגיאת מקור · ${d?.message || ""}`),
    onWorkerStatus: (d) => setWorker(d),
    onEnrichStarted: (d) => {
      pushLive(`העשרת קשר התחילה · ${d?.companyName || d?.candidateId || ""}`);
    },
    onEnrichFinished: (d) => {
      pushLive(
        `העשרת קשר · ${d?.companyName || ""} · ${d?.outreachReady ? "מוכן לפנייה" : "ללא ערוץ"}`
      );
      void reloadRef.current.loadCandidates();
      void reloadRef.current.loadDashboard();
    },
  });

  const refresh = useCallback(async () => {
    setError("");
    setBusy(true);
    try {
      await loadAccess();
      if (tab === "dashboard") await loadDashboard();
      if (tab === "candidates" || tab === "add") await loadCandidates();
      if (tab === "scans") await loadScans();
      // outreach tab loads itself
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

  async function enrichContacts(id: string) {
    setBusy(true);
    setError("");
    try {
      const data = await gpPost(`/candidates/${id}/enrich`, { force: true, inline: true });
      if (data.enrich?.ok === false) {
        setMessage(`העשרה לא הצליחה: ${data.enrich.reason || "unknown"}`);
      } else if (data.mode === "queued") {
        setMessage("העשרת פרטי קשר נשלחה לתור העובד.");
      } else {
        setMessage(
          `העשרה הסתיימה · אימיילים ${data.enrich?.channels?.emails ?? 0} · טלפונים ${data.enrich?.channels?.phones ?? 0} · טפסים ${data.enrich?.channels?.forms ?? 0}`
        );
        if (data.enrich?.candidateId) {
          const refreshed = await gpGet(`/candidates/${id}`);
          setSelected(refreshed.candidate);
        }
      }
      await loadCandidates();
      await loadDashboard();
    } catch (err: any) {
      setError(err?.message || "העשרת פרטי קשר נכשלה");
    } finally {
      setBusy(false);
    }
  }

  async function verifyContact(id: string, type: string, value: string) {
    setBusy(true);
    try {
      const data = await gpPost(`/candidates/${id}/contacts/verify`, { type, value });
      setSelected(data.candidate);
      setMessage("סומן כמאומת ידנית על ידי Owner.");
      await loadCandidates();
    } catch (err: any) {
      setError(err?.message || "אימות ידני נכשל");
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
            ["outreach", "מרכז פניות"],
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

      {tab === "outreach" ? (
        <OutreachCenter
          onError={setError}
          onMessage={setMessage}
          busy={busy}
          setBusy={setBusy}
        />
      ) : null}

      {tab === "dashboard" && dashboard ? (
        <>
          <div className="gp-grid">
            <Kpi label="מועמדים במאגר" value={dashboard.candidatesTotal ?? 0} />
            <Kpi label="עם ערוץ קשר" value={dashboard.contacts?.withContactChannel ?? 0} />
            <Kpi label="מוכנים לפנייה" value={dashboard.contacts?.outreachReady ?? 0} />
            <Kpi label="אימייל / טלפון / טופס" value={`${dashboard.contacts?.withEmail ?? 0}/${dashboard.contacts?.withPhone ?? 0}/${dashboard.contacts?.withForm ?? 0}`} />
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
            <label>
              פרטי קשר
              <select value={contactFilter} onChange={(e) => setContactFilter(e.target.value)}>
                <option value="">הכל</option>
                <option value="email">יש אימייל</option>
                <option value="phone">יש טלפון</option>
                <option value="form">יש טופס קשר</option>
                <option value="verified">מאומת / תקין</option>
                <option value="ready">מוכן לפנייה</option>
                <option value="none">אין פרטי קשר</option>
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
                  <th>התאמה</th>
                  <th>קשר</th>
                  <th>ציון</th>
                  <th>סטטוס</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {candidates.length === 0 ? (
                  <tr>
                    <td colSpan={8}>אין מועמדים להצגה — הוסיפו ידנית או ייבאו CSV.</td>
                  </tr>
                ) : (
                  candidates.map((c) => (
                    <tr key={c._id}>
                      <td>{c.companyName}</td>
                      <td>
                        {[c.countryCode, c.city].filter(Boolean).join(" · ") || "—"}
                      </td>
                      <td>{c.vertical || "—"}</td>
                      <td className="gp-score">{c.partnerFitScore ?? "—"}</td>
                      <td>
                        {[
                          c.businessEmail ? "מייל" : null,
                          c.businessPhone ? "טל׳" : null,
                          c.contactFormUrl ? "טופס" : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </td>
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
            {selected.website ? (
              <>
                {" "}
                · אתר:{" "}
                <a href={selected.website} target="_blank" rel="noreferrer">
                  {selected.website}
                </a>
              </>
            ) : null}
          </p>
          <div className="gp-grid" style={{ marginTop: 12 }}>
            <Kpi label="אימייל עסקי" value={selected.businessEmail || "—"} />
            <Kpi label="טלפון עסקי" value={selected.businessPhone || "—"} />
            <Kpi
              label="טופס קשר"
              value={selected.contactFormUrl ? "יש" : "—"}
            />
            <Kpi
              label="מוכן לפנייה"
              value={selected.outreachReady ? "כן" : "לא"}
            />
          </div>
          <div className="gp-table-wrap" style={{ marginTop: 14 }}>
            <table className="gp-table">
              <thead>
                <tr>
                  <th>סוג</th>
                  <th>ערך</th>
                  <th>מקור</th>
                  <th>סטטוס</th>
                  <th>אומת</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {(selected.contactChannels || []).length === 0 ? (
                  <tr>
                    <td colSpan={6}>אין ערוצי קשר מחולצים עדיין — הפעילו העשרה מהאתר.</td>
                  </tr>
                ) : (
                  (selected.contactChannels || []).map((ch: any, idx: number) => (
                    <tr key={`${ch.type}-${idx}`}>
                      <td>{ch.type}</td>
                      <td>
                        {ch.type === "form" || ch.type === "linkedin" ? (
                          <a href={ch.value} target="_blank" rel="noreferrer">
                            {ch.value}
                          </a>
                        ) : (
                          ch.value
                        )}
                      </td>
                      <td className="gp-muted">
                        {ch.sourceUrl ? (
                          <a href={ch.sourceUrl} target="_blank" rel="noreferrer">
                            מקור
                          </a>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td>{ch.status}</td>
                      <td>
                        {ch.verifiedAt
                          ? new Date(ch.verifiedAt).toLocaleString("he-IL")
                          : "—"}
                      </td>
                      <td>
                        {ch.status !== "manual_verified" ? (
                          <button
                            type="button"
                            className="gp-btn gp-btn--ghost"
                            onClick={() =>
                              void verifyContact(selected._id, ch.type, ch.value)
                            }
                          >
                            אימות ידני
                          </button>
                        ) : (
                          "✓"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {selected.publicProfiles?.linkedin ? (
            <p className="gp-muted" style={{ marginTop: 8 }}>
              LinkedIn:{" "}
              <a href={selected.publicProfiles.linkedin} target="_blank" rel="noreferrer">
                {selected.publicProfiles.linkedin}
              </a>
            </p>
          ) : null}
          {selected.contactFormUrl ? (
            <p className="gp-muted">
              טופס:{" "}
              <a href={selected.contactFormUrl} target="_blank" rel="noreferrer">
                {selected.contactFormUrl}
              </a>
            </p>
          ) : null}
          <p className="gp-muted">
            מצב העשרה: {selected.contactEnrichment?.status || "טרם רץ"}
            {selected.contactEnrichment?.pagesFetched != null
              ? ` · עמודים ${selected.contactEnrichment.pagesFetched}`
              : ""}
            {selected.contactEnrichment?.lastError
              ? ` · ${selected.contactEnrichment.lastError}`
              : ""}
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
              label="Reseller"
              value={selected.scores?.reseller?.score ?? "—"}
            />
            <Kpi
              label="בלעדיות"
              value={selected.scores?.exclusive_territory?.score ?? "—"}
            />
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
            <button type="button" className="gp-btn" onClick={() => void enrichContacts(selected._id)}>
              חלץ פרטי קשר מהאתר
            </button>
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
                {["affiliate", "business_partner", "reseller", "exclusive_territory"].flatMap((track) =>
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
          <div className="gp-grid">
            <Kpi
              label="סריקות פעילות"
              value={scanConfigs.filter((c) => c.enabled).length}
            />
            <Kpi
              label="מדינות במעקב"
              value={
                new Set(scanConfigs.flatMap((c) => c.countries || [])).size
              }
            />
            <Kpi
              label="Worker"
              value={
                worker?.workerProcess
                  ? "פעיל"
                  : worker?.redisConfigured
                    ? "תור זמין"
                    : "לא מחובר"
              }
            />
            <Kpi
              label="מקור חינמי"
              value={
                [
                  sources.find((s) => s.id === "wikidata")?.enabled ? "Wikidata" : null,
                  sources.find((s) => s.id === "openstreetmap")?.enabled ? "OSM" : null,
                ]
                  .filter(Boolean)
                  .join(" + ") || "—"
              }
            />
          </div>

          <div className="gp-panel">
            <h2>מקורות מידע</h2>
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>מקור</th>
                    <th>מצב</th>
                    <th>תשלום</th>
                    <th>הערות</th>
                  </tr>
                </thead>
                <tbody>
                  {(sources.length ? sources : [
                    { id: "wikidata", enabled: true, paid: false, licensing: "CC0" },
                    { id: "openstreetmap", enabled: true, paid: false, licensing: "ODbL" },
                    { id: "google_places", enabled: false, paid: true, note: "כבוי עד אישור" },
                  ]).map((s) => (
                    <tr key={s.id}>
                      <td>{s.label || s.id}</td>
                      <td>{s.enabled ? "מחובר" : "כבוי"}</td>
                      <td>{s.paid ? "בתשלום" : "חינם"}</td>
                      <td className="gp-muted">{s.note || s.licensing || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="gp-panel">
            <h2>יצירת סריקה</h2>
            <form
              className="gp-form"
              onSubmit={async (e) => {
                e.preventDefault();
                setBusy(true);
                setError("");
                try {
                  await gpPost("/scan-configs", {
                    name: scanForm.name,
                    source: scanForm.source,
                    enabled: scanForm.enabled,
                    countries: scanForm.countries.split(",").map((s) => s.trim()).filter(Boolean),
                    cities: scanForm.cities.split(",").map((s) => s.trim()).filter(Boolean),
                    verticals: scanForm.verticals.split(",").map((s) => s.trim()).filter(Boolean),
                    intervalMinutes: Number(scanForm.intervalMinutes) || 1440,
                    maxResultsPerRun: Number(scanForm.maxResultsPerRun) || 15,
                    dailyRequestBudget: Number(scanForm.dailyRequestBudget) || 20,
                  });
                  setMessage("הגדרת סריקה נשמרה.");
                  await loadScans();
                } catch (err: any) {
                  setError(err?.message || "שמירת סריקה נכשלה");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <label>
                שם
                <input
                  value={scanForm.name}
                  onChange={(e) => setScanForm({ ...scanForm, name: e.target.value })}
                />
              </label>
              <label>
                מקור
                <select
                  value={scanForm.source}
                  onChange={(e) => setScanForm({ ...scanForm, source: e.target.value })}
                >
                  <option value="wikidata">Wikidata (חינם)</option>
                  <option value="openstreetmap">OpenStreetMap (חינם)</option>
                  <option value="google_places">Google Places (כבוי)</option>
                </select>
              </label>
              <label>
                מדינות (ISO, מופרד בפסיק)
                <input
                  value={scanForm.countries}
                  onChange={(e) => setScanForm({ ...scanForm, countries: e.target.value })}
                />
              </label>
              <label>
                ערים (אופציונלי)
                <input
                  value={scanForm.cities}
                  onChange={(e) => setScanForm({ ...scanForm, cities: e.target.value })}
                />
              </label>
              <label>
                תחומים
                <input
                  value={scanForm.verticals}
                  onChange={(e) => setScanForm({ ...scanForm, verticals: e.target.value })}
                />
              </label>
              <label>
                תדירות (דקות)
                <input
                  value={scanForm.intervalMinutes}
                  onChange={(e) => setScanForm({ ...scanForm, intervalMinutes: e.target.value })}
                />
              </label>
              <label>
                מקסימום תוצאות לריצה
                <input
                  value={scanForm.maxResultsPerRun}
                  onChange={(e) => setScanForm({ ...scanForm, maxResultsPerRun: e.target.value })}
                />
              </label>
              <label>
                מכסת בקשות ליום
                <input
                  value={scanForm.dailyRequestBudget}
                  onChange={(e) => setScanForm({ ...scanForm, dailyRequestBudget: e.target.value })}
                />
              </label>
              <div className="gp-actions" style={{ gridColumn: "1 / -1" }}>
                <button type="submit" className="gp-btn" disabled={busy}>
                  שמור סריקה
                </button>
              </div>
            </form>
          </div>

          <div className="gp-panel">
            <h2>סריקות במעקב</h2>
            <div className="gp-table-wrap">
              <table className="gp-table">
                <thead>
                  <tr>
                    <th>שם</th>
                    <th>מקור</th>
                    <th>פעיל</th>
                    <th>מדינות / תחומים</th>
                    <th>אחרון / הבא</th>
                    <th>סיכום אחרון</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {scanConfigs.length === 0 ? (
                    <tr>
                      <td colSpan={7}>אין סריקות עדיין.</td>
                    </tr>
                  ) : (
                    scanConfigs.map((c) => (
                      <tr key={c._id}>
                        <td>
                          {c.name}
                          {c.lockedAt ? (
                            <div className="gp-muted">בביצוע…</div>
                          ) : null}
                        </td>
                        <td>{c.source}</td>
                        <td>{c.enabled ? "כן" : "לא"}</td>
                        <td>
                          {(c.countries || []).join(", ") || "—"}
                          <div className="gp-muted">
                            {(c.verticals || []).join(", ") || "—"}
                          </div>
                        </td>
                        <td>
                          {c.lastRunAt
                            ? new Date(c.lastRunAt).toLocaleString("he-IL")
                            : "—"}
                          <div className="gp-muted">
                            {c.nextRunAt
                              ? new Date(c.nextRunAt).toLocaleString("he-IL")
                              : "—"}
                          </div>
                        </td>
                        <td>
                          נוצרו {c.lastRunSummary?.createdCount ?? 0} · עודכנו{" "}
                          {c.lastRunSummary?.updatedCount ?? 0}
                          <div className="gp-muted">
                            כפילויות {c.lastRunSummary?.duplicateCount ?? 0} · שגיאות{" "}
                            {c.lastRunSummary?.errorCount ?? 0} · ¢
                            {c.lastRunSummary?.estimatedCostCents ?? 0}
                          </div>
                        </td>
                        <td>
                          <div className="gp-actions">
                            <button
                              type="button"
                              className="gp-btn gp-btn--ghost"
                              onClick={() =>
                                void gpPost(`/scan-configs/${c._id}/run`).then(() => {
                                  pushLive("הופעלה סריקה ידנית");
                                  return loadScans();
                                })
                              }
                            >
                              הרץ
                            </button>
                            <button
                              type="button"
                              className="gp-btn gp-btn--ghost"
                              onClick={() =>
                                void gpPost(
                                  c.enabled
                                    ? `/scan-configs/${c._id}/stop`
                                    : `/scan-configs/${c._id}/start`
                                ).then(loadScans)
                              }
                            >
                              {c.enabled ? "עצור" : "הפעל"}
                            </button>
                            <button
                              type="button"
                              className="gp-btn gp-btn--ghost"
                              onClick={() =>
                                void gpPost(`/scan-configs/${c._id}/retry`).then(loadScans)
                              }
                            >
                              נסה שוב
                            </button>
                            <button
                              type="button"
                              className="gp-btn gp-btn--ghost"
                              onClick={() =>
                                void gpPatch(`/scan-configs/${c._id}`, {
                                  intervalMinutes: Math.max(
                                    60,
                                    Number(c.intervalMinutes || 1440) === 1440 ? 360 : 1440
                                  ),
                                }).then(loadScans)
                              }
                            >
                              תדירות
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="gp-panel">
            <h2>אירועים בזמן אמת</h2>
            {liveEvents.length === 0 ? (
              <p className="gp-muted">
                ממתין לאירועי Socket מה־Worker. סריקה לא תוצג כפעילה אם ה־Worker אינו
                מחובר.
              </p>
            ) : (
              <ul className="gp-muted">
                {liveEvents.map((ev) => (
                  <li key={ev}>{ev}</li>
                ))}
              </ul>
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
                    <th>נמצאו</th>
                    <th>נוצרו</th>
                    <th>עודכנו</th>
                    <th>כפילויות</th>
                    <th>שגיאות</th>
                    <th>עלות ¢</th>
                  </tr>
                </thead>
                <tbody>
                  {runs.length === 0 ? (
                    <tr>
                      <td colSpan={9}>אין ריצות עדיין.</td>
                    </tr>
                  ) : (
                    runs.map((r) => (
                      <tr key={r._id}>
                        <td>{new Date(r.createdAt).toLocaleString("he-IL")}</td>
                        <td>{r.source}</td>
                        <td>{r.status}</td>
                        <td>{r.foundCount}</td>
                        <td>{r.createdCount}</td>
                        <td>{r.updatedCount}</td>
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
