import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { FreeResult, commercialLocale } from "../public/ComplianceCommercial";
import { ComplianceReportView } from "../public/ComplianceReportView";
import "../public/complianceScanner.css";

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
  report?: { locale?: string; findings?: unknown[] } | null;
};

const TABS = ["סקירה", "דוח ראשוני", "דוח מלא", "ממצאים וראיות", "PDF", "פרטי לקוח", "הצהרה וחתימה", "נתונים טכניים"] as const;
type Tab = (typeof TABS)[number];
const TAB_QUERY: Record<string, Tab> = {
  overview: "סקירה",
  free: "דוח ראשוני",
  full: "דוח מלא",
  findings: "ממצאים וראיות",
  pdf: "PDF",
  customer: "פרטי לקוח",
  consent: "הצהרה וחתימה",
  technical: "נתונים טכניים",
};
const QUERY_TAB = Object.fromEntries(Object.entries(TAB_QUERY).map(([key, value]) => [value, key])) as Record<Tab, string>;

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
  const [params, setParams] = useSearchParams();
  const tab = TAB_QUERY[params.get("tab") || ""] || "סקירה";
  const [detail, setDetail] = useState<Detail | null>(null);
  const [customer, setCustomer] = useState<any>(null);
  const [summaryView, setSummaryView] = useState<any>(null);
  const [consent, setConsent] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");
  const [reportError, setReportError] = useState("");
  const [pdfMessage, setPdfMessage] = useState("");
  const [viewLocale, setViewLocale] = useState("he");

  useEffect(() => {
    const saved = sessionStorage.getItem("bizuplyComplianceViewLocale") || "";
    if (["he", "en", "es", "pt-BR", "ar"].includes(saved)) setViewLocale(saved);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token") || "";
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    let cancelled = false;
    (async () => {
      try {
        const [detailResponse, fullResponse, summaryResponse] = await Promise.all([
          fetch(`/compliance/api/admin/scans/${encodeURIComponent(scanId)}`, { headers, credentials: "include" }),
          fetch(`/compliance/api/scans/${encodeURIComponent(scanId)}?locale=${encodeURIComponent(viewLocale)}`, { headers, credentials: "include", cache: "no-store" }),
          fetch(`/compliance/api/scans/${encodeURIComponent(scanId)}?locale=${encodeURIComponent(viewLocale)}&view=summary`, { headers, credentials: "include", cache: "no-store" }),
        ]);
        const detailData = await detailResponse.json().catch(() => ({}));
        const fullData = await fullResponse.json().catch(() => ({}));
        const summaryData = await summaryResponse.json().catch(() => ({}));
        if (cancelled) return;
        if (!detailResponse.ok) {
          setError(detailData.error || `לא ניתן לטעון את הסריקה (HTTP ${detailResponse.status})`);
          return;
        }
        setDetail(detailData);
        if (!fullResponse.ok) setReportError(fullData.error || `לא ניתן לטעון את הדוח המלא (HTTP ${fullResponse.status})`);
        else setCustomer(fullData);
        if (summaryResponse.ok) setSummaryView(summaryData);
      } catch {
        if (!cancelled) setError("לא ניתן לטעון את הסריקה. הרשומה לא נמחקה.");
      }
    })();
    return () => { cancelled = true; };
  }, [scanId, viewLocale]);

  function chooseLocale(next: "he" | "en" | "es" | "pt-BR" | "ar") {
    sessionStorage.setItem("bizuplyComplianceViewLocale", next);
    setViewLocale(next);
  }

  function selectTab(next: Tab) {
    setParams({ tab: QUERY_TAB[next] }, { replace: true });
  }

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
    if (!detail?.reportStored && !customer?.report) {
      setPdfMessage("אין דוח שמור לסריקה הזו, ולכן אי אפשר להפיק PDF. לא נוצרה סריקה חדשה ולא הומצאו ממצאים.");
      return;
    }
    const token = localStorage.getItem("token") || "";
    const response = await fetch(`/compliance/api/scans/${detail?.id || scanId}/pdf?locale=${encodeURIComponent(viewLocale)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      credentials: "include",
      cache: "no-store",
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
    link.download = "bizuply-website-report.pdf";
    link.click();
    URL.revokeObjectURL(url);
    const engine = response.headers.get("X-Compliance-Pdf-Engine");
    setPdfMessage(engine === "chromium"
      ? "ה־PDF הופק עכשיו מהדוח השמור במנוע החדש. לא נטען קובץ ישן מהמטמון."
      : "ה־PDF הורד, אבל השרת לא סימן שהוא נוצר במנוע החדש.");
  }

  const locale = commercialLocale(viewLocale);
  const findings = customer?.report?.findings || detail?.report?.findings || [];
  const missingReport = detail ? !detail.reportStored && !customer?.report : false;

  return (
    <section className="scan-detail" dir="rtl">
      <header className="scan-detail__chrome">
        <a href="/admin/compliance-scans">חזרה לכל הסריקות</a>
        <h1>פרטי סריקה</h1>
        <p>{detail?.host || detail?.url || scanId}</p>
      </header>
      {error ? <p className="scan-detail__error" role="alert">{error}</p> : null}
      <div className="scan-detail__tabs" role="tablist">
        {TABS.map((item) => (
          <button key={item} type="button" role="tab" aria-selected={tab === item} onClick={() => selectTab(item)}>{item}</button>
        ))}
      </div>
      {!detail ? <p>טוען את הרשומה השמורה…</p> : (
        <article className="scan-detail__body">
          {tab === "סקירה" ? (
            <div className="scan-detail__grid">
              <p><span>תאריך</span><b>{stamp(detail.createdAt)}</b></p>
              <p><span>סטטוס</span><b>{text(detail.status)}</b></p>
              <p><span>ציון</span><b>{text(detail.score)}</b></p>
              <p><span>ממצאים שמורים</span><b>{Array.isArray(findings) ? findings.length : "לא נשמרו"}</b></p>
              <p><span>סוג</span><b>{detail.demo ? "בדיקה" : text(detail.plan)}</b></p>
              <p><span>תשלום</span><b>{detail.paid ? "שולם" : "לא שולם"}</b></p>
            </div>
          ) : null}
          {tab === "דוח ראשוני" ? (
            summaryView?.summary ? (
              <FreeResult locale={locale} summary={summaryView.summary} status={summaryView.status || detail.status} scanId={detail.id} audience="admin" />
            ) : <p>{reportError || "לסריקה הזו אין דוח שמור, ולכן אין סיכום ראשוני לשחזור."}</p>
          ) : null}
          {tab === "דוח מלא" || tab === "ממצאים וראיות" ? (
            reportError ? <p className="scan-detail__error" role="alert">{reportError}</p> : customer?.access === "full" && customer.report ? (
              <ComplianceReportView locale={locale} payload={customer} onPdf={downloadPdf} onLocale={chooseLocale} audience="admin" />
            ) : <p>{missingReport ? "הדוח המלא לא נשמר לסריקה הזו. לא הומצאו ממצאים." : "הדוח המלא לא זמין לחשבון הזה."}</p>
          ) : null}
          {tab === "PDF" ? (
            <div className="scan-detail__chrome">
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
              <div className="scan-detail__chrome">
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
        .scan-detail { display: grid; gap: 16px; color: #1a0b33; max-width: 100%; overflow-x: hidden; }
        .scan-detail__chrome h1, .scan-detail__chrome p { margin: 0; }
        .scan-detail__chrome a, .scan-detail__tabs button, .scan-detail__chrome button {
          border: 1px solid #d7dce8; border-radius: 0; background: #fff; color: #1a0b33;
          min-height: 40px; padding: 0 12px; text-decoration: none; display: inline-flex; align-items: center;
        }
        .scan-detail__tabs button, .scan-detail__chrome button { background: #5b21b6; color: #fff; cursor: pointer; }
        .scan-detail__tabs { display: flex; flex-wrap: wrap; gap: 8px; max-width: 100%; }
        .scan-detail__tabs button[aria-selected="true"] { outline: 2px solid #1a0b33; }
        .scan-detail__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 10px; }
        .scan-detail__grid p { display: grid; gap: 4px; background: #fff; border: 1px solid #e6eaf2; padding: 12px; margin: 0; }
        .scan-detail__body { min-width: 0; max-width: 100%; }
        .scan-detail .report-sheet { width: 100%; max-width: 100%; }
        .scan-detail .report-finding a, .scan-detail .report-sheet dd { overflow-wrap: anywhere; }
        .scan-detail__error { color: #9b2335; margin: 0; }
        .scan-detail img { width: min(100%, 320px); background: #fff; border: 1px solid #e5e7eb; }
        @media (max-width: 800px) {
          .scan-detail__tabs button { flex: 1 1 140px; }
        }
      `}</style>
    </section>
  );
}
