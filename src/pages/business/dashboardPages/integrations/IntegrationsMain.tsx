import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  disconnectGmail,
  getGmailConnectUrl,
  getGmailStatus,
  type GmailPublicAccount,
  type GmailStatusResponse,
} from "../../../../api/gmailApi";
import {
  disconnectGoogleCalendar,
  getGoogleCalendarConnectUrl,
  getGoogleCalendarStatus,
  type GoogleCalendarStatusResponse,
} from "../../../../api/googleCalendarApi";
import {
  disconnectOutlook,
  getOutlookConnectUrl,
  getOutlookStatus,
  testOutlookSend,
  type OutlookPublicAccount,
  type OutlookStatusResponse,
} from "../../../../api/outlookApi";

type IntegrationsMainProps = {
  /** OAuth return path override (defaults to dashboard integrations). */
  returnPath?: string;
  title?: string;
  description?: string;
  /** Compact wrapper styles when embedded inside Automations. */
  embedded?: boolean;
  /**
   * Optional businessId override for nested routes (e.g. Automations → Connections).
   * Falls back to the `:businessId` route param — same data path either way.
   */
  businessId?: string;
};

export default function IntegrationsMain({
  returnPath,
  title = "אינטגרציות",
  description = "חיבורי שירותים חיצוניים לעסק — Gmail, Google Calendar ו-Outlook.",
  embedded = false,
  businessId: businessIdProp,
}: IntegrationsMainProps) {
  const { businessId: businessIdParam = "" } = useParams();
  const businessId = String(businessIdProp || businessIdParam || "");
  const [searchParams, setSearchParams] = useSearchParams();
  const oauthReturnPath =
    returnPath || `/business/${businessId}/dashboard/integrations`;
  const [status, setStatus] = useState<GmailStatusResponse | null>(null);
  const [outlookStatus, setOutlookStatus] =
    useState<OutlookStatusResponse | null>(null);
  const [calendarStatus, setCalendarStatus] =
    useState<GoogleCalendarStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [outlookLoading, setOutlookLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [outlookBusy, setOutlookBusy] = useState(false);
  const [calendarBusy, setCalendarBusy] = useState(false);
  const [error, setError] = useState("");
  const [outlookError, setOutlookError] = useState("");
  const [calendarError, setCalendarError] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testMessage, setTestMessage] = useState("");

  const banner = useMemo(() => {
    if (searchParams.get("gmail_connected") === "1") {
      return `Gmail חובר בהצלחה${
        searchParams.get("gmail_email")
          ? `: ${searchParams.get("gmail_email")}`
          : ""
      }`;
    }
    if (searchParams.get("gmail_error")) {
      return String(searchParams.get("gmail_error"));
    }
    if (searchParams.get("gcal_connected") === "1") {
      return `Google Calendar חובר בהצלחה${
        searchParams.get("gcal_email")
          ? `: ${searchParams.get("gcal_email")}`
          : ""
      }`;
    }
    if (searchParams.get("gcal_error")) {
      return String(searchParams.get("gcal_error"));
    }
    if (searchParams.get("outlook_connected") === "1") {
      return `Outlook חובר בהצלחה${
        searchParams.get("outlook_email")
          ? `: ${searchParams.get("outlook_email")}`
          : ""
      }`;
    }
    if (searchParams.get("outlook_error")) {
      return String(searchParams.get("outlook_error"));
    }
    return "";
  }, [searchParams]);

  async function load() {
    if (!businessId) return;
    setLoading(true);
    setError("");
    try {
      const data = await getGmailStatus(businessId);
      setStatus(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה בטעינת Gmail");
    } finally {
      setLoading(false);
    }
  }

  async function loadOutlook() {
    if (!businessId) return;
    setOutlookLoading(true);
    setOutlookError("");
    try {
      const data = await getOutlookStatus(businessId);
      setOutlookStatus(data);
    } catch (e) {
      setOutlookError(
        e instanceof Error ? e.message : "שגיאה בטעינת Outlook"
      );
    } finally {
      setOutlookLoading(false);
    }
  }

  async function loadCalendar() {
    if (!businessId) return;
    setCalendarLoading(true);
    setCalendarError("");
    try {
      const data = await getGoogleCalendarStatus(businessId);
      setCalendarStatus(data);
    } catch (e) {
      setCalendarError(
        e instanceof Error ? e.message : "שגיאה בטעינת Google Calendar"
      );
    } finally {
      setCalendarLoading(false);
    }
  }

  useEffect(() => {
    void load();
    void loadOutlook();
    void loadCalendar();
  }, [businessId]);

  useEffect(() => {
    if (!banner) return;
    const next = new URLSearchParams(searchParams);
    next.delete("gmail_connected");
    next.delete("gmail_email");
    next.delete("gmail_error");
    next.delete("gmail_error_code");
    next.delete("gcal_connected");
    next.delete("gcal_email");
    next.delete("gcal_error");
    next.delete("gcal_error_code");
    next.delete("outlook_connected");
    next.delete("outlook_email");
    next.delete("outlook_error");
    next.delete("outlook_error_code");
    setSearchParams(next, { replace: true });
  }, [banner]);

  async function connect() {
    if (!businessId) return;
    setBusy(true);
    setError("");
    try {
      const data = await getGmailConnectUrl(businessId, oauthReturnPath);
      if (!data?.url) throw new Error("לא התקבל קישור התחברות");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "התחברות נכשלה");
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!businessId) return;
    setBusy(true);
    setError("");
    try {
      await disconnectGmail(businessId);
      await load();
      await loadCalendar();
    } catch (e) {
      setError(e instanceof Error ? e.message : "ניתוק נכשל");
    } finally {
      setBusy(false);
    }
  }

  async function connectCalendar() {
    if (!businessId) return;
    setCalendarBusy(true);
    setCalendarError("");
    try {
      const data = await getGoogleCalendarConnectUrl(
        businessId,
        oauthReturnPath
      );
      if (data?.enabledLocally) {
        await loadCalendar();
        setCalendarBusy(false);
        return;
      }
      if (!data?.url) throw new Error("לא התקבל קישור התחברות");
      window.location.href = data.url;
    } catch (e) {
      setCalendarError(e instanceof Error ? e.message : "התחברות נכשלה");
      setCalendarBusy(false);
    }
  }

  async function disconnectCalendar() {
    if (!businessId) return;
    setCalendarBusy(true);
    setCalendarError("");
    try {
      await disconnectGoogleCalendar(businessId);
      await loadCalendar();
      await load();
    } catch (e) {
      setCalendarError(e instanceof Error ? e.message : "ניתוק Calendar נכשל");
    } finally {
      setCalendarBusy(false);
    }
  }

  async function connectOutlook() {
    if (!businessId) return;
    setOutlookBusy(true);
    setOutlookError("");
    try {
      const data = await getOutlookConnectUrl(businessId, oauthReturnPath);
      if (!data?.url) throw new Error("לא התקבל קישור התחברות");
      window.location.href = data.url;
    } catch (e) {
      setOutlookError(e instanceof Error ? e.message : "התחברות נכשלה");
      setOutlookBusy(false);
    }
  }

  async function disconnectOutlookAccount() {
    if (!businessId) return;
    setOutlookBusy(true);
    setOutlookError("");
    try {
      await disconnectOutlook(businessId);
      await loadOutlook();
    } catch (e) {
      setOutlookError(e instanceof Error ? e.message : "ניתוק נכשל");
    } finally {
      setOutlookBusy(false);
    }
  }

  async function sendTestOutlookEmail() {
    if (!businessId) return;
    const to = String(testEmail || "").trim().toLowerCase();
    if (!to) {
      setOutlookError("יש להזין כתובת מייל לבדיקה");
      return;
    }
    setOutlookBusy(true);
    setOutlookError("");
    setTestMessage("");
    try {
      await testOutlookSend({
        businessId,
        to,
        confirm: true,
      });
      setTestMessage(`מייל בדיקה נשלח אל ${to}`);
    } catch (e) {
      setOutlookError(
        e instanceof Error ? e.message : "שליחת מייל בדיקה נכשלה"
      );
    } finally {
      setOutlookBusy(false);
    }
  }

  const account: GmailPublicAccount | null = status?.account || null;
  const available = Boolean(status?.available);
  const connected = account?.connectionStatus === "connected";
  const needsGmailGrant =
    connected && account?.hasGmailSend === false;
  const needsReconnect =
    account?.connectionStatus === "needs_reconnect" ||
    account?.connectionStatus === "expired" ||
    account?.connectionStatus === "revoked" ||
    needsGmailGrant;

  const outlookAccount: OutlookPublicAccount | null =
    outlookStatus?.account || null;
  const outlookAvailable = Boolean(outlookStatus?.available);
  const outlookConnected = outlookAccount?.connectionStatus === "connected";
  const outlookNeedsReconnect =
    outlookAccount?.connectionStatus === "needs_reconnect" ||
    outlookAccount?.connectionStatus === "expired" ||
    outlookAccount?.connectionStatus === "revoked";

  const calendarAvailable = Boolean(calendarStatus?.available);
  const calendarInfo = calendarStatus?.calendar;
  const calendarConnected = Boolean(calendarInfo?.connected);
  const calendarNeedsGrant = Boolean(calendarInfo?.needsGrant);
  const calendarNeedsReconnect = Boolean(calendarInfo?.needsReconnect);
  const calendarEmail =
    calendarInfo?.googleEmail || calendarStatus?.account?.email || "";

  function calendarBadgeLabel() {
    if (!calendarAvailable) return "לא זמין";
    if (calendarConnected) return "מחובר";
    if (calendarNeedsReconnect) return "נדרש חיבור מחדש";
    if (calendarNeedsGrant) return "נדרשת הרשאת יומן";
    return "לא מחובר";
  }

  function calendarPrimaryCta() {
    if (calendarNeedsReconnect) return "חיבור מחדש";
    if (calendarNeedsGrant) return "Grant Calendar access";
    if (calendarConnected) return "חיבור מחדש";
    return "Connect Google Calendar";
  }

  return (
    <div
      className={
        embedded
          ? "ax-integrations-embedded"
          : "p-4 md:p-6 max-w-3xl mx-auto"
      }
      dir="rtl"
    >
      <h1 className="text-2xl font-bold mb-2">{title}</h1>
      <p className="text-slate-600 mb-6">{description}</p>

      {banner ? (
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          {banner}
        </div>
      ) : null}
      {error ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}
      {calendarError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {calendarError}
        </div>
      ) : null}
      {outlookError ? (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {outlookError}
        </div>
      ) : null}

      <div className="space-y-4">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Gmail</h2>
              <p className="text-sm text-slate-600 mt-1">
                שליחת מיילים מאוטומציות דרך חשבון Google של העסק
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                !available
                  ? "bg-amber-100 text-amber-800"
                  : needsGmailGrant || needsReconnect
                    ? "bg-amber-100 text-amber-800"
                    : connected
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-slate-100 text-slate-700"
              }`}
            >
              {!available
                ? "בתהליך אישור"
                : needsGmailGrant
                  ? "נדרשת הרשאת שליחה"
                  : connected
                    ? "מחובר"
                    : needsReconnect
                      ? "נדרש חיבור מחדש"
                      : "לא מחובר"}
            </span>
          </div>

          {loading ? (
            <p className="mt-4 text-sm text-slate-500">טוען...</p>
          ) : !available ? (
            <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              Gmail נמצא כרגע בתהליך אישור מול Google
            </p>
          ) : account && (connected || needsReconnect) ? (
            <div className="mt-4 space-y-2 text-sm">
              {needsGmailGrant ? (
                <p className="text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  חסרה הרשאת שליחה של Gmail — יש לאשר מחדש (החיבור ל-Google
                  עדיין פעיל)
                </p>
              ) : needsReconnect ? (
                <p className="text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  חיבור Gmail פג תוקף — יש להתחבר מחדש
                </p>
              ) : null}
              <div>
                <span className="text-slate-500">חשבון: </span>
                <span dir="ltr">{account.email}</span>
              </div>
              {account.displayName ? (
                <div>
                  <span className="text-slate-500">שם: </span>
                  {account.displayName}
                </div>
              ) : null}
              <div>
                <span className="text-slate-500">אימות אחרון: </span>
                {account.lastVerifiedAt
                  ? new Date(account.lastVerifiedAt).toLocaleString("he-IL")
                  : "—"}
              </div>
              <div className="flex flex-wrap gap-2 pt-3">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void connect()}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
                >
                  חיבור מחדש
                </button>
                {connected ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void disconnect()}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    ניתוק
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                disabled={busy}
                onClick={() => void connect()}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
              >
                חיבור Gmail
              </button>
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Google Calendar</h2>
              <p className="text-sm text-slate-600 mt-1">
                יצירת אירועי יומן מאוטומציות דרך חשבון Google של העסק
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                !calendarAvailable
                  ? "bg-amber-100 text-amber-800"
                  : calendarConnected
                    ? "bg-emerald-100 text-emerald-800"
                    : calendarNeedsGrant || calendarNeedsReconnect
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
              }`}
            >
              {calendarBadgeLabel()}
            </span>
          </div>

          {calendarLoading ? (
            <p className="mt-4 text-sm text-slate-500">טוען...</p>
          ) : !calendarAvailable ? (
            <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              {calendarStatus?.message ||
                "Google Calendar אינו זמין לעסק זה כרגע"}
            </p>
          ) : (
            <div className="mt-4 space-y-2 text-sm">
              {calendarNeedsReconnect ? (
                <p className="text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  חיבור Google פג תוקף — יש להתחבר מחדש ליומן
                </p>
              ) : null}
              {calendarNeedsGrant ? (
                <p className="text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  Gmail מחובר, אך חסרה הרשאת Google Calendar. אישור ההרשאה לא
                  מנתק את Gmail.
                </p>
              ) : null}
              {calendarEmail ? (
                <div>
                  <span className="text-slate-500">חשבון Google: </span>
                  <span dir="ltr">{calendarEmail}</span>
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-3">
                <button
                  type="button"
                  disabled={calendarBusy}
                  onClick={() => void connectCalendar()}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
                >
                  {calendarPrimaryCta()}
                </button>
                {calendarConnected ? (
                  <button
                    type="button"
                    disabled={calendarBusy}
                    onClick={() => void disconnectCalendar()}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    ניתוק Calendar
                  </button>
                ) : null}
              </div>
              {calendarConnected ? (
                <p className="text-xs text-slate-500 pt-1">
                  ניתוק Calendar אינו מנתק את Gmail.
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Outlook</h2>
              <p className="text-sm text-slate-600 mt-1">
                שליחת מיילים מאוטומציות דרך חשבון Outlook או Microsoft 365 של
                העסק
              </p>
            </div>
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                !outlookAvailable
                  ? "bg-amber-100 text-amber-800"
                  : outlookConnected
                    ? "bg-emerald-100 text-emerald-800"
                    : outlookNeedsReconnect
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-700"
              }`}
            >
              {!outlookAvailable
                ? "לא זמין"
                : outlookConnected
                  ? "מחובר"
                  : outlookNeedsReconnect
                    ? "נדרש חיבור מחדש"
                    : "לא מחובר"}
            </span>
          </div>

          {outlookLoading ? (
            <p className="mt-4 text-sm text-slate-500">טוען...</p>
          ) : !outlookAvailable ? (
            <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
              {outlookStatus?.message ||
                "Outlook / Microsoft 365 אינו זמין לעסק זה כרגע"}
            </p>
          ) : outlookAccount && (outlookConnected || outlookNeedsReconnect) ? (
            <div className="mt-4 space-y-2 text-sm">
              {outlookNeedsReconnect ? (
                <p className="text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
                  חיבור Outlook פג תוקף — יש להתחבר מחדש
                </p>
              ) : null}
              <div>
                <span className="text-slate-500">חשבון: </span>
                <span dir="ltr">{outlookAccount.email}</span>
              </div>
              {outlookConnected ? (
                <div className="space-y-2 pt-2">
                  <label className="block text-sm">
                    <span className="text-slate-500">מייל בדיקה</span>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2"
                      dir="ltr"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </label>
                  {testMessage ? (
                    <p className="text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2">
                      {testMessage}
                    </p>
                  ) : null}
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 pt-3">
                {outlookConnected ? (
                  <button
                    type="button"
                    disabled={outlookBusy}
                    onClick={() => void sendTestOutlookEmail()}
                    className="px-3 py-2 rounded-lg bg-sky-700 text-white text-sm"
                  >
                    שליחת מייל בדיקה
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={outlookBusy}
                  onClick={() => void connectOutlook()}
                  className="px-3 py-2 rounded-lg bg-slate-900 text-white text-sm"
                >
                  חיבור מחדש
                </button>
                {outlookConnected ? (
                  <button
                    type="button"
                    disabled={outlookBusy}
                    onClick={() => void disconnectOutlookAccount()}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
                  >
                    ניתוק
                  </button>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="mt-4">
              <button
                type="button"
                disabled={outlookBusy}
                onClick={() => void connectOutlook()}
                className="px-4 py-2 rounded-lg bg-slate-900 text-white text-sm"
              >
                חיבור Outlook
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
