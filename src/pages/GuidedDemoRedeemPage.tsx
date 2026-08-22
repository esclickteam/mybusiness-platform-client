import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { peekGuidedDemo, redeemGuidedDemo } from "../api/guidedDemoApi";
import { backupCurrentAuth, writeGuidedDemoSession } from "../guidedDemo/sessionStore";
import { useAuth } from "../context/AuthContext";
import BizuplyLoader from "../components/ui/BizuplyLoader";

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
      if (code === "DEMO_ALREADY_REDEEMED") {
        setError("הקישור כבר מומש במכשיר אחר.");
      } else if (code === "DEMO_EXPIRED" || code === "DEMO_REVOKED") {
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
          <h1 className="text-2xl font-black text-slate-900">הדמו הזה כבר אינו פעיל</h1>
          <p className="mt-3 text-sm font-semibold text-slate-500">
            הקישור פג תוקף, בוטל, או שאינו תקין.
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
      <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-right shadow-xl">
        <h1 className="text-2xl font-black text-slate-900">הדמו האישי שלכם מוכן</h1>
        {preview?.customerName ? (
          <p className="mt-2 text-sm font-bold text-slate-600">שלום {preview.customerName}</p>
        ) : null}
        <ul className="mt-4 space-y-1 text-sm font-bold text-emerald-700">
          {(preview?.modules || []).map((mod) => (
            <li key={mod.title}>✓ {mod.title}</li>
          ))}
        </ul>
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
