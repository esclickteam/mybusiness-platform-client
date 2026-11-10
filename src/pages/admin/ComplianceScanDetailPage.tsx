import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type Finding = {
  id?: string;
  title?: string;
  category?: string;
  severity?: string;
  outcome?: string;
  evidence?: string | null;
  recommendation?: string;
  source?: string | null;
  url?: string | null;
  description?: string;
};

type Detail = {
  id: string;
  requesterName?: string | null;
  requesterEmail?: string | null;
  requesterUserId?: string | null;
  guest?: boolean;
  createdAt?: string;
  url?: string;
  host?: string;
  status?: string;
  score?: number | null;
  plan?: string;
  purchaseStatus?: string;
  paid?: boolean;
  demo?: boolean;
  error?: string;
  consentStatus?: string | null;
  consentAt?: string | null;
  consentId?: string | null;
  reportStored?: boolean;
  findingsStored?: boolean;
  summary?: Record<string, number | string | boolean | null> | null;
  report?: { findings?: Finding[]; url?: string; scannedAt?: string } | null;
};

const TABS = ["סקירה", "דוח ראשוני", "דוח מלא", "ממצאים וראיות", "PDF", "פרטי לקוח", "הצהרה וחתימה", "נתונים טכניים"] as const;

function stamp(value?: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("he-IL", { dateStyle: "short", timeStyle: "short", timeZone: "Asia/Jerusalem" }).format(date);
}

function text(value: unknown) {
  if (value == null || value === "") return "—";
  return String(value);
}

export default function ComplianceScanDetailPage() {
  const { scanId = "" } = useParams();
  const [detail, setDetail] = useState<Detail | null>(null);
  const [consent, setConsent] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("סקירה");
  const [pdfMessage, setPdfMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/compliance/api/admin/scans/${encodeURIComponent(scanId)}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: "include",
        });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (!response.ok) {
          setError(data.error || `לא ניתן לטעון את הסריקה (HTTP ${response.status})`);
          return;
        }
        setDetail(data);
      } catch {
        if (!cancelled) setError("לא ניתן לטעון את הסריקה. הרשומה לא נמחקה.");
      }
    })();
    return () => { cancelled = true; };
  }, [scanId]);

  async function openConsent() {
    if (!detail?.consentId) return;
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/compliance/api/admin/consents/${detail.consentId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      setError(data.error || "לא ניתן לטעון את ההצהרה");
      return;
    }
    setConsent(data);
  }

  async function downloadPdf() {
    if (!detail?.reportStored) {
      setPdfMessage("אין דוח שמור לסריקה הזו, ולכן אי אפשר להפיק PDF. לא נוצרה סריקה חדשה ולא הומצאו ממצאים.");
      return;
    }
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/compliance/api/scans/${detail.id}/pdf`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setPdfMessage(data.error || `הפקת ה־PDF נכשלה (HTTP ${response.status})`);
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `bizuply-scan-${detail.id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
    setPdfMessage("ה־PDF הופק מהדוח השמור.");
  }

  const findings = detail?.report?.findings || [];
  const missingReport = detail && !detail.reportStored;

  return (
    <section className="scan-detail" dir="rtl">
      <header>
        <a href="/admin/compliance-scans">חזרה לכל הסריקות</a>
        <h1>פרטי סריקה</h1>
        <p>{detail?.host || detail?.url || scanId}</p>
      </header>
      {error ? <p className="scan-detail__error" role="alert">{error}</p> : null}
      <div className="scan-detail__tabs" role="tablist">
        {TABS.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => setTab(item)}>{item}</button>
        ))}
      </div>
      {!detail ? <p>טוען את הרשומה השמורה…</p> : (
        <article>
          {tab === "סקירה" ? (
            <div className="scan-detail__grid">
              <p><span>תאריך</span><b>{stamp(detail.createdAt)}</b></p>
              <p><span>סטטוס</span><b>{text(detail.status)}</b></p>
              <p><span>ציון</span><b>{text(detail.score)}</b></p>
              <p><span>ממצאים שמורים</span><b>{detail.findingsStored ? findings.length : "לא נשמרו"}</b></p>
              <p><span>סוג</span><b>{detail.demo ? "בדיקה" : text(detail.plan)}</b></p>
              <p><span>תשלום</span><b>{detail.paid ? "שולם" : "לא שולם"}</b></p>
            </div>
          ) : null}
          {tab === "דוח ראשוני" ? (
            missingReport ? <p>לסריקה הזו אין דוח שמור, ולכן אין סיכום ראשוני לשחזור.</p> : (
              <div className="scan-detail__grid">
                <p><span>ציון</span><b>{text(detail.summary?.checkedScore)}</b></p>
                <p><span>כיסוי</span><b>{text(detail.summary?.coverage)}</b></p>
                <p><span>תקינות</span><b>{text(detail.summary?.ok)}</b></p>
                <p><span>לטיפול</span><b>{text(detail.summary?.action)}</b></p>
                <p><span>לא אומתו</span><b>{text(detail.summary?.unverified)}</b></p>
                <p>{text(detail.summary?.checkedScoreLabel)}</p>
              </div>
            )
          ) : null}
          {tab === "דוח מלא" || tab === "ממצאים וראיות" ? (
            missingReport || !detail.findingsStored ? <p>הדוח המלא לא נשמר לסריקה הזו. לא הומצאו ממצאים.</p> : (
              <div className="scan-detail__findings">
                {findings.map((item, index) => (
                  <section key={item.id || index}>
                    <h2>{item.title || "ממצא שמור"}</h2>
                    <p>{[item.category, item.severity, item.outcome].filter(Boolean).join(" · ") || "אין סיווג שמור"}</p>
                    {item.description ? <p>{item.description}</p> : null}
                    {item.evidence ? <p><b>ראיה: </b>{item.evidence}</p> : <p>אין ראיה שמורה לממצא זה.</p>}
                    {item.recommendation ? <p><b>המלצה: </b>{item.recommendation}</p> : null}
                    {item.source ? <p><b>מקור: </b>{item.source}</p> : null}
                    {item.url ? <p><a href={item.url}>{item.url}</a></p> : null}
                  </section>
                ))}
              </div>
            )
          ) : null}
          {tab === "PDF" ? (
            <div>
              {missingReport ? <p>אין דוח שמור שממנו אפשר להפיק PDF.</p> : <button type="button" onClick={downloadPdf}>הורדת PDF מהדוח השמור</button>}
              {pdfMessage ? <p>{pdfMessage}</p> : null}
            </div>
          ) : null}
          {tab === "פרטי לקוח" ? (
            <div className="scan-detail__grid">
              <p><span>שם</span><b>{detail.requesterName || (detail.guest ? "אורח" : "לא נשמר")}</b></p>
              <p><span>אימייל</span><b>{detail.requesterEmail || "—"}</b></p>
              <p><span>סוג לקוח</span><b>{detail.requesterUserId ? "רשום" : "אורח"}</b></p>
              <p><span>אתר</span><b>{detail.host || detail.url || "—"}</b></p>
            </div>
          ) : null}
          {tab === "הצהרה וחתימה" ? (
            detail.consentStatus === "signed" ? (
              <div>
                <p>נחתם {stamp(detail.consentAt)}</p>
                <button type="button" onClick={openConsent}>צפייה בהצהרה</button>
                {consent ? (
                  <div>
                    <p>{consent.fullName} · {consent.email} · {consent.phone}</p>
                    <p>{consent.statementText}</p>
                    <p>{consent.termsVersion} · {consent.privacyVersion} · {consent.scannerVersion}</p>
                    {consent.signature ? <img src={consent.signature} alt="חתימת הלקוח" /> : <p>תמונת החתימה לא נשמרה.</p>}
                  </div>
                ) : null}
              </div>
            ) : <p>סריקה קודמת — לא קיים אישור חתום במערכת.</p>
          ) : null}
          {tab === "נתונים טכניים" ? (
            <div className="scan-detail__grid">
              <p><span>מזהה</span><b>{detail.id}</b></p>
              <p><span>סטטוס</span><b>{text(detail.status)}</b></p>
              <p><span>שגיאה</span><b>{detail.error || "אין"}</b></p>
              <p><span>מסלול</span><b>{text(detail.plan)}</b></p>
              <p><span>רכישה</span><b>{text(detail.purchaseStatus)}</b></p>
              <p><span>דוח שמור</span><b>{detail.reportStored ? "כן" : "לא"}</b></p>
            </div>
          ) : null}
        </article>
      )}
      <style>{`
        .scan-detail { display: grid; gap: 16px; color: #1a0b33; }
        .scan-detail h1, .scan-detail h2, .scan-detail p { margin: 0; }
        .scan-detail a, .scan-detail button { border: 1px solid #d7dce8; border-radius: 0; background: #fff; color: #1a0b33; min-height: 40px; padding: 0 12px; text-decoration: none; display: inline-flex; align-items: center; }
        .scan-detail button { background: #5b21b6; color: #fff; cursor: pointer; }
        .scan-detail__tabs { display: flex; flex-wrap: wrap; gap: 8px; }
        .scan-detail__tabs button[aria-selected="true"] { outline: 2px solid #5b21b6; }
        .scan-detail__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 10px; }
        .scan-detail__grid p, .scan-detail__findings section { display: grid; gap: 4px; background: #fff; border: 1px solid #e6eaf2; padding: 12px; }
        .scan-detail__findings { display: grid; gap: 10px; }
        .scan-detail__error { color: #9b2335; }
        .scan-detail img { width: min(100%, 320px); background: #fff; border: 1px solid #e5e7eb; }
      `}</style>
    </section>
  );
}
