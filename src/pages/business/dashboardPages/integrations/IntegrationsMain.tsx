import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  disconnectGmail,
  getGmailConnectUrl,
  getGmailStatus,
  type GmailPublicAccount,
  type GmailStatusResponse,
} from "../../../../api/gmailApi";

export default function IntegrationsMain() {
  const { businessId = "" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [status, setStatus] = useState<GmailStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

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

  useEffect(() => {
    void load();
  }, [businessId]);

  useEffect(() => {
    if (!banner) return;
    const next = new URLSearchParams(searchParams);
    next.delete("gmail_connected");
    next.delete("gmail_email");
    next.delete("gmail_error");
    next.delete("gmail_error_code");
    setSearchParams(next, { replace: true });
  }, [banner]);

  async function connect() {
    if (!businessId) return;
    setBusy(true);
    setError("");
    try {
      const returnUrl = `/business/${businessId}/dashboard/integrations`;
      const data = await getGmailConnectUrl(businessId, returnUrl);
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
    } catch (e) {
      setError(e instanceof Error ? e.message : "ניתוק נכשל");
    } finally {
      setBusy(false);
    }
  }

  const account: GmailPublicAccount | null = status?.account || null;
  const available = Boolean(status?.available);
  const connected = account?.connectionStatus === "connected";

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto" dir="rtl">
      <h1 className="text-2xl font-bold mb-2">אינטגרציות</h1>
      <p className="text-slate-600 mb-6">
        חיבורי שירותים חיצוניים לעסק — Gmail לשליחת מיילים מאוטומציות.
      </p>

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
                : connected
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {!available
              ? "בתהליך אישור"
              : connected
                ? "מחובר"
                : "לא מחובר"}
          </span>
        </div>

        {loading ? (
          <p className="mt-4 text-sm text-slate-500">טוען...</p>
        ) : !available ? (
          <p className="mt-4 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2">
            Gmail נמצא כרגע בתהליך אישור מול Google
          </p>
        ) : connected && account ? (
          <div className="mt-4 space-y-2 text-sm">
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
              <button
                type="button"
                disabled={busy}
                onClick={() => void disconnect()}
                className="px-3 py-2 rounded-lg border border-slate-300 text-sm"
              >
                ניתוק
              </button>
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
    </div>
  );
}