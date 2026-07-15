import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { acceptSiteInvite, getSiteInvite } from "../api/mySitesApi";

export default function WebsiteInviteAcceptPage() {
  const { token = "" } = useParams<{ token: string }>();
  const { user, initialized } = useAuth() as {
    user: { businessId?: string; role?: string } | null;
    initialized: boolean;
  };
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);
  const [error, setError] = useState("");
  const [invite, setInvite] = useState<{
    toEmail: string;
    mode: "share" | "transfer";
    role?: "editor" | "viewer";
  } | null>(null);
  const [siteName, setSiteName] = useState("האתר");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!initialized) return;
    if (!user) {
      navigate(`/login?redirect=${encodeURIComponent(`/website-invite/${token}`)}`, {
        replace: true,
      });
      return;
    }

    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getSiteInvite(token);
        if (!alive) return;
        setInvite(data.invite);
        setSiteName(data.site?.name || "האתר");
      } catch (err: any) {
        if (!alive) return;
        setError(err?.message || "לא ניתן לטעון את ההזמנה");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [initialized, user, token, navigate]);

  async function handleAccept() {
    try {
      setAccepting(true);
      setError("");
      const result = await acceptSiteInvite(token);
      setDone(true);

      const businessId = result.site?.businessId || user?.businessId;
      if (businessId) {
        window.setTimeout(() => {
          navigate(`/business/${businessId}/dashboard/website`, { replace: true });
        }, 1200);
      }
    } catch (err: any) {
      setError(err?.message || "אישור ההזמנה נכשל");
    } finally {
      setAccepting(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#f5f6fb] px-4 py-10"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
        <h1 className="text-xl font-bold text-slate-900">הזמנה לאתר ב־Bizuply</h1>

        {loading ? (
          <div className="mt-8 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            טוען הזמנה...
          </div>
        ) : error && !invite ? (
          <div className="mt-6 space-y-4">
            <div className="flex items-start gap-2 rounded-xl bg-rose-50 px-3 py-3 text-sm text-rose-700">
              <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {error}
            </div>
            <Link
              to="/"
              className="inline-flex text-sm font-semibold text-slate-700 hover:underline"
            >
              חזרה לדף הבית
            </Link>
          </div>
        ) : done ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-start gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-sm text-emerald-800">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              ההזמנה אושרה בהצלחה. מעבירים אתכם לאתרים שלי...
            </div>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-slate-600">
              הוזמנתם ל־<strong>{siteName}</strong>
              {invite?.toEmail ? (
                <>
                  {" "}
                  עבור <span dir="ltr">{invite.toEmail}</span>
                </>
              ) : null}
              .
            </p>

            <div className="rounded-xl bg-slate-50 px-3 py-3 text-sm text-slate-700">
              {invite?.mode === "transfer" ? (
                <p>
                  זו <strong>העברת בעלות מלאה</strong> — לאחר האישור האתר יופיע אצלכם בלבד.
                </p>
              ) : (
                <p>
                  זה <strong>שיתוף בנוסף</strong> — תקבלו הרשאת{" "}
                  {invite?.role === "viewer" ? "צפייה" : "עריכה"} באתר.
                </p>
              )}
            </div>

            {error ? (
              <div className="rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <button
              type="button"
              onClick={handleAccept}
              disabled={accepting}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:opacity-60"
            >
              {accepting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              אישור ההזמנה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
