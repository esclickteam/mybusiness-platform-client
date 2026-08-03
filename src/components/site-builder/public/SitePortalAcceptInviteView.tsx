import React, { useMemo, useState } from "react";
import { sitePortalAcceptInvite } from "../../../api/sitePortalApi";

type Props = {
  siteName?: string;
  onSuccess?: (siteId: string) => void;
};

export default function SitePortalAcceptInviteView({
  siteName = "",
  onSuccess,
}: Props) {
  const inviteToken = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  }, []);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!inviteToken) {
      setError("חסר טוקן הזמנה בקישור");
      return;
    }

    if (password.length < 6) {
      setError("הסיסמה חייבת להכיל לפחות 6 תווים");
      return;
    }

    if (password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await sitePortalAcceptInvite({
        inviteToken,
        password,
        fullName: fullName || undefined,
      });

      onSuccess?.(result.site?.id || result.member.siteId);
      window.history.replaceState({}, "", "/");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch (err: any) {
      setError(err?.message || "אישור ההזמנה נכשל");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-emerald-50 px-4 py-10"
    >
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-bold tracking-wide text-emerald-700">
          הזמנה לאזור אישי
        </p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">
          {siteName ? `הצטרפות ל${siteName}` : "השלמת הרשמה"}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          בחרו סיסמה כדי להפעיל את הגישה לאזור האישי של האתר.
        </p>

        {!inviteToken ? (
          <p className="mt-6 rounded-2xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
            קישור ההזמנה אינו תקין. בקשו מהעסק קישור חדש.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">
                שם מלא (אופציונלי)
              </span>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-emerald-200 transition focus:bg-white focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">
                סיסמה חדשה
              </span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-emerald-200 transition focus:bg-white focus:ring-2"
              />
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-bold text-slate-600">
                אימות סיסמה
              </span>
              <input
                type="password"
                required
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-800 outline-none ring-emerald-200 transition focus:bg-white focus:ring-2"
              />
            </label>

            {error ? (
              <p className="rounded-2xl bg-rose-50 px-3 py-2 text-xs font-bold text-rose-600">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-emerald-700 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-800 disabled:opacity-60"
            >
              {loading ? "מפעיל..." : "הפעלת גישה"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
