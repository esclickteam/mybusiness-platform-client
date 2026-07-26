import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";

import API from "../api";
import AuthShell, { AuthCard } from "../components/auth/AuthShell";

type ForgotPasswordProps = {
  closePopup?: () => void;
};

type ApiError = {
  response?: {
    data?: {
      error?: string;
    };
  };
  message?: string;
};

export default function ForgotPassword({ closePopup }: ForgotPasswordProps) {
  const [email, setEmail] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleSendReset = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!email.trim()) {
      setSuccess(false);
      setMessage("אנא הזינו כתובת אימייל");
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(false);

    try {
      await API.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      setSuccess(true);
      setMessage("נשלח אליכם קישור לאיפוס סיסמה למייל.");
    } catch (error) {
      const apiError = error as ApiError;
      console.error("Error sending reset link:", apiError);
      setSuccess(false);
      setMessage(
        apiError.response?.data?.error || "אירעה שגיאה. נסו שוב מאוחר יותר."
      );
    } finally {
      setLoading(false);
    }
  };

  const card = (
    <AuthCard
      title="שכחתי סיסמה"
      subtitle="הזינו את האימייל שלכם ונשלח קישור מאובטח לאיפוס הסיסמה"
    >
      <form onSubmit={handleSendReset} className="space-y-4">
        <div className="text-right">
          <label
            htmlFor="reset-email"
            className="mb-2 block text-sm font-bold text-slate-700"
          >
            אימייל
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="reset-email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoComplete="email"
              dir="ltr"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pr-11 pl-4 text-left text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:ring-4 focus:ring-violet-100 disabled:opacity-70"
            />
          </div>
        </div>

        {message ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm font-bold leading-6 ${
              success
                ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                : "border-rose-100 bg-rose-50 text-rose-600"
            }`}
            role="alert"
          >
            {message}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 text-base font-black text-white shadow-[0_14px_30px_rgba(99,102,241,0.35)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "שולח..." : "שליחת קישור לאיפוס"}
          {!loading ? <span aria-hidden>←</span> : null}
        </button>

        {closePopup ? (
          <button
            type="button"
            onClick={closePopup}
            className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-black text-slate-700 transition hover:border-violet-200 hover:text-violet-700"
          >
            סגירה
          </button>
        ) : (
          <p className="pt-1 text-center text-sm font-semibold text-slate-600">
            נזכרתם בסיסמה?{" "}
            <Link
              to="/login"
              className="font-black text-violet-700 transition hover:text-indigo-700"
            >
              חזרה להתחברות
            </Link>
          </p>
        )}
      </form>
    </AuthCard>
  );

  if (closePopup) {
    return (
      <div
        className="fixed inset-0 z-[99999] grid place-items-center bg-slate-900/35 p-4 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        aria-labelledby="forgot-password-title"
      >
        <button
          type="button"
          aria-label="סגירת חלון איפוס סיסמה"
          onClick={closePopup}
          className="absolute inset-0 h-full w-full cursor-default"
        />
        <div className="relative w-full max-w-[440px]">{card}</div>
      </div>
    );
  }

  return (
    <AuthShell
      headline={
        <>
          איפוס סיסמה{" "}
          <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            בקלות
          </span>
          <br />
          <span className="bg-gradient-to-l from-sky-500 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
            ובצורה מאובטחת
          </span>
        </>
      }
    >
      {card}
    </AuthShell>
  );
}
