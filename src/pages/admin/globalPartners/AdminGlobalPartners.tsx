import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gpGet, gpPatch, gpPost } from "./globalPartnersApi";
import { statusLabel } from "./copy";
import { useGlobalPartnersRealtime } from "./useGlobalPartnersRealtime";
import OutreachCenter from "./OutreachCenter";
import CandidateProfileModal from "./CandidateProfileModal";
import PipelineBoard from "./PipelineBoard";
import ActivePartnersPanel from "./ActivePartnersPanel";
import "./globalPartners.css";

type Tab =
  | "dashboard"
  | "discovery"
  | "outreach"
  | "pipeline"
  | "active"
  | "add"
  | "import"
  | "scans";

function Kpi({
  label,
  value,
  onClick,
  hint,
}: {
  label: string;
  value: string | number;
  onClick?: () => void;
  hint?: string;
}) {
  const body = (
    <>
      <div className="gp-kpi-label">{label}</div>
      <div className="gp-kpi-value">{value}</div>
      {hint ? <div className="gp-muted" style={{ fontSize: "0.75rem", marginTop: 4 }}>{hint}</div> : null}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className="gp-kpi gp-kpi--click" onClick={onClick}>
        {body}
      </button>
    );
  }
  return <div className="gp-kpi">{body}</div>;
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
  const [discoveryView, setDiscoveryView] = useState<"queue" | "all" | "rejected" | "archived">(
    "queue"
  );
  const [pipelineView, setPipelineView] = useState<"kanban" | "table">("kanban");
  const [minScore, setMinScore] = useState("");
  const [sourceFilter, setSourceFilter] = useState("");
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
  const [profileId, setProfileId] = useState<string | null>(null);
  const [outreachId, setOutreachId] = useState<string | null>(null);
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
      discoveryView: discoveryView === "all" ? "all" : discoveryView,
      workArea: discoveryView === "queue" ? "discovery" : undefined,
      source: sourceFilter || undefined,
      minScore: minScore || undefined,
      limit: 100,
      ...contactParams,
    });
    setCandidates(data.items || []);
    setTotal(data.total || 0);
  }, [q, statusFilter, contactFilter, discoveryView, sourceFilter, minScore]);

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
      if (tab === "discovery" || tab === "add") await loadCandidates();
      if (tab === "scans") await loadScans();
      // outreach tab loads itself
    } catch (err: any) {
      setError(err?.message || "שגיאה בטעינת Global Partners");
    } finally {
      setBusy(false);
    }
  }, [tab, loadAccess, loadDashboard, loadCandidates, loadScans]);

  useEffect(() => {
    if (tab !== "discovery") return;
    void loadCandidates().catch((err: any) =>
      setError(err?.message || "טעינת מועמדים נכשלה")
    );
  }, [discoveryView, tab, loadCandidates]);

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

  function openCandidate(id: string) {
    setError("");
    setProfileId(id);
  }

  function openOutreach(id: string) {
    setError("");
    setProfileId(null);
    setTab("outreach");
    setOutreachId(id);
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
          <span className="gp-pill gp-pill--ok">דירוג מבוסס כללים</span>
          <span className="gp-pill">גישה לבעלים בלבד</span>
          {access?.places?.enabled ? (
            <span className="gp-pill gp-pill--ok">מקור Places פעיל</span>
          ) : (
            <span className="gp-pill gp-pill--warn">מקור Places כבוי</span>
          )}
          {busy ? <span className="gp-pill">טוען…</span> : null}
        </div>
      </header>

      {error ? <div className="gp-error">{error}</div> : null}
      {message ? <div className="gp-success">{message}</div> : null}
      {denied ? (
        <div className="gp-banner">
          הגישה למערכת Global Partners מוגבלת לבעלים מורשים בלבד. אם אתם אמורים לקבל גישה —
          פנו למנהל המערכת להוספת החשבון לרשימת ההרשאות.
        </div>
      ) : null}

      <nav className="gp-tabs" aria-label="ניווט Global Partners">
        {(
          [
            ["dashboard", "דשבורד"],
            ["discovery", "מאגר מועמדים"],
            ["outreach", "מרכז פניות"],
            ["pipeline", "שותפים בתהליך"],
            ["active", "שותפים פעילים"],
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
              setProfileId(null);
              if (id !== "outreach") setOutreachId(null);
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
          openCandidateId={outreachId}
          onOpenCandidateHandled={() => setOutreachId(null)}
        />
      ) : null}

      {tab === "pipeline" ? (
        <>
          <div className="gp-actions" style={{ marginBottom: 12 }}>
            <button
              type="button"
              className={`gp-btn${pipelineView === "kanban" ? "" : " gp-btn--ghost"}`}
              onClick={() => setPipelineView("kanban")}
            >
              תצוגת לוח
            </button>
            <button
              type="button"
              className={`gp-btn${pipelineView === "table" ? "" : " gp-btn--ghost"}`}
              onClick={() => setPipelineView("table")}
            >
              תצוגת טבלה
            </button>
          </div>
          <PipelineBoard
            busy={busy}
            setBusy={setBusy}
            onError={setError}
            onMessage={setMessage}
            onOpenProfile={openCandidate}
            view={pipelineView}
          />
        </>
      ) : null}

      {tab === "active" ? (
        <ActivePartnersPanel
          busy={busy}
          setBusy={setBusy}
          onError={setError}
          onOpenProfile={openCandidate}
        />
      ) : null}

      {tab === "dashboard" && dashboard ? (
        <>
          <div className="gp-grid">
            <Kpi
              label="סך מועמדים"
              value={dashboard.candidatesTotal ?? 0}
              hint="לחיצה → כל המועמדים"
              onClick={() => {
                setDiscoveryView("all");
                setTab("discovery");
              }}
            />
            <Kpi
              label="ממתינים לבדיקה"
              value={dashboard.pendingReview ?? 0}
              onClick={() => {
                setDiscoveryView("queue");
                setTab("discovery");
              }}
            />
            <Kpi
              label="מאושרים לפנייה"
              value={dashboard.approvedForOutreach ?? 0}
              onClick={() => setTab("outreach")}
            />
            <Kpi
              label="טיוטות ממתינות"
              value={dashboard.draftsAwaitingApproval ?? 0}
              onClick={() => setTab("outreach")}
            />
            <Kpi
              label="פניות שנשלחו (חי)"
              value={dashboard.outreachSentLive ?? 0}
              hint={`בדיקות פנימיות: ${dashboard.outreachSentDryRun ?? 0}`}
              onClick={() => setTab("outreach")}
            />
            <Kpi
              label="תשובות שהתקבלו"
              value={dashboard.repliesReceived ?? 0}
              onClick={() => setTab("outreach")}
            />
            <Kpi
              label="שיעור תגובה %"
              value={dashboard.responseRatePercent ?? 0}
            />
            <Kpi
              label="שותפים בתהליך"
              value={dashboard.partnersInPipeline ?? dashboard.outreachInPipeline ?? 0}
              onClick={() => setTab("pipeline")}
            />
            <Kpi
              label="שותפים פעילים"
              value={dashboard.activePartners ?? 0}
              onClick={() => setTab("active")}
            />
            <Kpi
              label="משימות מעקב פתוחות"
              value={dashboard.openFollowUps ?? 0}
              onClick={() => setTab("outreach")}
            />
            <Kpi label="חדשים היום" value={dashboard.candidatesToday ?? 0} />
            <Kpi
              label="עם ערוץ קשר"
              value={dashboard.contacts?.withContactChannel ?? 0}
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

      {tab === "discovery" ? (
        <div className="gp-panel">
          <h2>
            מאגר מועמדים ({total})
            <span className="gp-muted" style={{ fontWeight: 400, marginRight: 8 }}>
              ·{" "}
              {discoveryView === "queue"
                ? "ממתינים לבדיקה"
                : discoveryView === "all"
                  ? "כל המועמדים"
                  : discoveryView === "rejected"
                    ? "נפסלו"
                    : "ארכיון"}
            </span>
          </h2>
          <p className="gp-muted">
            מאגר איתור בלבד. מועמד שאושר למרכז פניות לא יופיע בתור הממתין — ניתן למצוא אותו ב«כל
            המועמדים» או בחיפוש, בלי כפילות רשומה.
          </p>
          <div className="gp-actions" style={{ marginBottom: 10 }}>
            {(
              [
                ["queue", "ממתינים לבדיקה"],
                ["all", "כל המועמדים"],
                ["rejected", "נפסלו"],
                ["archived", "ארכיון"],
              ] as const
            ).map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`gp-btn${discoveryView === id ? "" : " gp-btn--ghost"}`}
                onClick={() => setDiscoveryView(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="gp-form" style={{ marginBottom: 12 }}>
            <label>
              חיפוש גלובלי
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="חברה / עיר / תחום / מייל"
              />
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
            <label>
              ציון מינימלי
              <input
                value={minScore}
                onChange={(e) => setMinScore(e.target.value)}
                placeholder="למשל 50"
              />
            </label>
            <label>
              מקור
              <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                <option value="">הכל</option>
                <option value="wikidata">Wikidata</option>
                <option value="manual">ידני</option>
                <option value="csv_import">ייבוא CSV</option>
                <option value="google_places">Google Places</option>
                <option value="openstreetmap">OpenStreetMap</option>
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
                        <div className="gp-row-actions">
                          <button
                            type="button"
                            className="gp-btn gp-btn--ghost"
                            onClick={() => openCandidate(c._id)}
                          >
                            פרופיל
                          </button>
                          <button
                            type="button"
                            className="gp-btn gp-btn--ghost"
                            onClick={() => openOutreach(c._id)}
                          >
                            פנייה
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
      ) : null}

      {profileId ? (
        <CandidateProfileModal
          candidateId={profileId}
          statuses={access?.statuses || []}
          busy={busy}
          setBusy={setBusy}
          onClose={() => setProfileId(null)}
          onError={setError}
          onMessage={setMessage}
          onOpenOutreach={openOutreach}
          onChanged={() => {
            void loadCandidates();
            void loadDashboard();
          }}
        />
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
