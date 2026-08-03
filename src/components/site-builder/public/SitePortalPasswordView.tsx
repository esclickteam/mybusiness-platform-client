import React, { useMemo, useState } from "react";

import {
  sitePortalForgotPassword,
  sitePortalResetPassword,
} from "../../../api/sitePortalApi";

type Props = {
  mode: "forgot" | "reset";
  siteName?: string;
  siteId?: string;
  loginPath?: string;
  accountPath?: string;
  resetPath?: string;
};

/**
 * Fallback password-recovery screens for a published site that has not added
 * designed "forgot password" / "new password" pages yet. Site members only —
 * this never touches the BizUply platform account.
 */
export default function SitePortalPasswordView({
  mode,
  siteName = "",
  siteId = "",
  loginPath = "/portal/login",
  accountPath = "/portal/account",
  resetPath = "/portal/reset-password",
}: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const token = useMemo(() => {
    if (typeof window === "undefined") return "";
    return new URLSearchParams(window.location.search).get("token") || "";
  }, []);

  const handleForgot = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    setBusy(true);

    try {
      const result = await sitePortalForgotPassword({
        email,
        siteId: siteId || undefined,
        resetPath,
      });

      setNotice(
        result?.message ||
          "אם קיים חשבון עם האימייל הזה, נשלח אליו קישור לאיפוס סיסמה.",
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "שליחת הקישור נכשלה");
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");

    if (password.length < 6) {
      setError("הסיסמה חייבת להיות באורך 6 תווים לפחות");
      return;
    }

    if (password !== confirmPassword) {
      setError("הסיסמאות אינן זהות");
      return;
    }

    setBusy(true);

    try {
      await sitePortalResetPassword({ token, password });
      window.location.replace(accountPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "איפוס הסיסמה נכשל");
    } finally {
      setBusy(false);
    }
  };

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-800 outline-none transition focus:border-slate-400";

  return (
    <div
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-slate-50 px-4"
    >
      <div className="w-full max-w-md rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-black tracking-wide text-slate-400">
          אזור אישי
        </p>
        <h1 className="mt-1 text-2xl font-black text-slate-900">
          {mode === "forgot" ? "שכחתי סיסמה" : "בחירת סיסמה חדשה"}
        </h1>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          {mode === "forgot"
            ? `הזינו את האימייל שאיתו נרשמתם${siteName ? ` ל${siteName}` : ""} ונשלח קישור לבחירת סיסמה חדשה.`
            : "בחרו סיסמה חדשה באורך 6 תווים לפחות."}
        </p>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
            {error}
          </div>
        ) : null}

        {notice ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">
            {notice}
          </div>
        ) : null}

        {mode === "forgot" ? (
          <form className="mt-5 space-y-4" onSubmit={handleForgot}>
            <label className="block text-xs font-black text-slate-500">
              אימייל
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={inputClass}
                dir="ltr"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:opacity-50"
            >
              {busy ? "שולח..." : "שליחת קישור לאיפוס"}
            </button>
          </form>
        ) : (
          <form className="mt-5 space-y-4" onSubmit={handleReset}>
            {!token ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-bold text-amber-800">
                הקישור חסר או אינו תקין. בקשו קישור חדש בעמוד «שכחתי סיסמה».
              </div>
            ) : null}
            <label className="block text-xs font-black text-slate-500">
              סיסמה חדשה
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={inputClass}
              />
            </label>
            <label className="block text-xs font-black text-slate-500">
              אימות סיסמה
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                className={inputClass}
              />
            </label>
            <button
              type="submit"
              disabled={busy || !token}
              className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-black text-white transition disabled:opacity-50"
            >
              {busy ? "שומר..." : "שמירת הסיסמה"}
            </button>
          </form>
        )}

        <a
          href={loginPath}
          className="mt-5 inline-block text-sm font-black text-slate-500 hover:text-slate-800"
        >
          חזרה להתחברות
        </a>
      </div>
    </div>
  );
}
