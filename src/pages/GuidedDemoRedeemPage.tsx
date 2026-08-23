import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CalendarCheck, LayoutDashboard, LayoutTemplate, Sparkles, Users, Workflow } from "lucide-react";
import { peekGuidedDemo, redeemGuidedDemo } from "../api/guidedDemoApi";
import { backupCurrentAuth, writeGuidedDemoSession } from "../guidedDemo/sessionStore";
import { INTRO_CATEGORIES } from "../guidedDemo/overlayHelpers";
import { useAuth } from "../context/AuthContext";
import BizuplyLoader from "../components/ui/BizuplyLoader";

const INTRO_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  crm: Users,
  work: CalendarCheck,
  auto: Workflow,
  growth: Sparkles,
  web: LayoutTemplate,
};

export default function GuidedDemoRedeemPage() {
  const { token = "" } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth() as {
    loginWithToken: (user: unknown, token: string, opts?: { skipRedirect?: boolean }) => void;
  };
  const [state, setState] = useState<"loading" | "ready" | "expired" | "invalid" | "error">("loading");
  const [preview, setPreview] = useState<{ customerName?: string; modules?: { title: string }[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const data = await peekGuidedDemo(token);
        if (!alive) return;
        if (!data?.ok && data?.code === "DEMO_TOKEN_INVALID") {
          setState("invalid");
          return;
        }
        if (!data?.ok) {
          setState("expired");
          return;
        }
        setPreview(data);
        setState("ready");
      } catch (err: any) {
        if (!alive) return;
        const code = err?.response?.data?.code;
        if (code === "DEMO_TOKEN_INVALID") setState("invalid");
        else if (code === "DEMO_EXPIRED" || code === "DEMO_REVOKED") setState("expired");
        else setState("expired");
      }
    })();
    return () => {
      alive = false;
    };
  }, [token]);

  async function enter() {
    setBusy(true);
    setError("");
    try {
      backupCurrentAuth();
      const data = await redeemGuidedDemo(token);
      writeGuidedDemoSession(data.session);
      loginWithToken(data.user, data.accessToken, { skipRedirect: true });
      const businessId = data.user?.businessId;
      const first = data.session?.steps?.[0]?.route || "/dashboard/dashboard";
      navigate(`/business/${businessId}${first}`, { replace: true });
    } catch (err: any) {
      const code = err?.response?.data?.code;
      if (code === "DEMO_EXPIRED" || code === "DEMO_REVOKED") {
        setState("expired");
      } else {
        setError(err?.response?.data?.error || "לא הצלחנו לפתוח את הדמו.");
      }
    } finally {
      setBusy(false);
    }
  }

  if (state === "loading") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f6fb]" dir="rtl">
        <BizuplyLoader />
      </div>
    );
  }

  if (state === "expired" || state === "invalid") {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f6fb] p-6" dir="rtl">
        <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-xl">
          <h1 className="text-2xl font-black text-slate-900">הקישור לדמו כבר אינו פעיל</h1>
          <p className="mt-3 text-sm font-semibold leading-7 text-slate-500">
            תוקף הדמו שקיבלת הסתיים. אם תרצה/י לצפות בו שוב, ניתן לפנות אלינו לקבלת קישור חדש.
          </p>
          <Link
            to="/contact"
            className="mt-6 inline-flex rounded-2xl bg-[#6D28D9] px-5 py-3 text-sm font-black text-white"
          >
            רוצים לקבל דמו חדש? צרו איתנו קשר
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid min-h-screen place-items-center bg-[#f5f6fb] p-6" dir="rtl">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-8 text-right shadow-xl">
        <p className="text-xs font-black tracking-[0.16em] text-violet-500">BIZUPLY</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">הדמו האישי שלכם מוכן</h1>
        {preview?.customerName ? (
          <p className="mt-2 text-sm font-bold text-slate-600">שלום {preview.customerName}</p>
        ) : null}
        <p className="mt-3 text-sm font-semibold leading-7 text-slate-600">
          בכמה דקות תראו איך BizUply מרכזת את ניהול העסק במקום אחד — בלי רשימת מודולים ארוכה.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {INTRO_CATEGORIES.map((item) => {
            const Icon = INTRO_ICONS[item.icon];
            return (
              <div
                key={item.key}
                className="flex flex-col items-center gap-2 rounded-2xl border border-violet-100 bg-violet-50/50 px-3 py-4 text-center shadow-sm"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-violet-700 shadow-sm ring-1 ring-violet-100">
                  {Icon ? <Icon className="h-5 w-5" /> : null}
                </span>
                <p className="text-sm font-black leading-5 text-slate-800">{item.title}</p>
              </div>
            );
          })}
        </div>
        {error ? <p className="mt-3 text-sm font-bold text-rose-600">{error}</p> : null}
        <button
          type="button"
          disabled={busy}
          onClick={() => void enter()}
          className="mt-6 w-full rounded-2xl bg-[#6D28D9] px-4 py-3 text-sm font-black text-white disabled:opacity-60"
        >
          {busy ? "פותחים…" : "כניסה לדמו"}
        </button>
      </div>
    </div>
  );
}
